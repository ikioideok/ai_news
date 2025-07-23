import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// --- OpenAIの設定 ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Googleスプレッドシートの設定 ---
const SPREADSHEET_ID = '17Hi55yo6nA8TWYmDCB-ON7mAPh5zU3Bqv9QLo5Y2k3s';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KEYFILEPATH = path.join(__dirname, 'credentials.json');
const auth = new google.auth.GoogleAuth({ keyFile: KEYFILEPATH, scopes: ['https://www.googleapis.com/auth/spreadsheets']});
const sheets = google.sheets({ version: 'v4', auth: auth });

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function saveChatToSheet(sheetName, userId, message, reply, fullPrompt, usage) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:H`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [
            new Date().toLocaleString('ja-JP'),
            userId, message, reply, fullPrompt,
            usage.prompt_tokens, usage.completion_tokens, usage.total_tokens
          ]
        ],
      },
    });
    console.log(`スプレッドシートの「${sheetName}」にログを記録しました。`);
  } catch (sheetError) {
    console.error(`「${sheetName}」シートへの書き込みエラー:`, sheetError.message);
  }
}

app.post('/api/chat', async (req, res) => {
  const { userId, message, isConsultation, history } = req.body;
  try {
    const normalPrompt = 'あなたは株式会社AIMAの受付AI「アイ」。以下のように、来訪者の質問にやさしく簡潔に対応：\n\n- 回答は原則3文以内\n- 丁寧語を保ちつつ、あいさつ・相槌・前置きは省略\n- 要点のみを簡単な敬語で返答。しかし冷たくならず愛嬌たっぷりに\n\n▼ 会社情報\n株式会社AIMAは2018年設立、大阪市北区梅田に本社を構えるAIマーケティング支援企業。  \n代表は水間雄紀。資本金100万円。  \n事業内容は次の3つ：\n\n1. AIマーケティング支援：戦略立案から実行・運用までサポート。  \n2.メディア運営：AI活用事例やノウハウを発信。  \n3. AIライター協会AILAの運営：AIライター検定・ガイドライン発行・イベント開催など。\n\n2024年2月にはコンテンツマーケティング事業をラグザス社へ譲渡し、AI分野へリソース集中。\n\n必要に応じて、担当者への引き継ぎを案内してください。';
    const consultationPrompt = 'あなたは株式会社AIMAの優秀なビジネスアシスタントです。相手のビジネス課題を深く、具体的にヒアリングし、AIMAのどのサービス（AIマーケティング支援、メディア運営、AILA運営）が解決に貢献できるかを論理的に提案してください。相手に共感を示し、信頼関係を築くことを目指してください。';
    const systemPrompt = isConsultation ? consultationPrompt : normalPrompt;

    const formattedHistory = (history || []).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content || msg.text || ''
    }));
    const currentMessages = [{ role: 'system', content: systemPrompt }, ...formattedHistory, { role: 'user', content: message }];

    const response = await openai.chat.completions.create({ model: 'gpt-4o', messages: currentMessages, max_tokens: 800 });
    const reply = response.choices[0]?.message?.content || '(応答なし)';
    const usage = response.usage;
    const cleanReply = reply.replace(/【.*?】/g, '').trim();

    const targetSheet = isConsultation ? '商談ログ' : '通常ログ';
    const promptDump = currentMessages.map(m => `[${m.role}] ${m.content}`).join('\n');
    await saveChatToSheet(targetSheet, userId, message, cleanReply, promptDump, usage);

    res.json({ reply: cleanReply });

  } catch (error) {
    console.error('AIとの通信でエラー:', error);
    res.status(500).json({ error: 'AIとの通信に失敗しました。' });
  }
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});