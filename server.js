import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// --- 基本設定 ---
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- OpenAIの設定 ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Googleスプレッドシートの設定 ---
const SPREADSHEET_ID = '17Hi55yo6nA8TWYmDCB-ON7mAPh5zU3Bqv9QLo5Y2k3s';
const credentialsJson = JSON.parse(process.env.GOOGLE_CREDENTIALS);
const auth = new google.auth.GoogleAuth({ credentials: credentialsJson, scopes: ['https://www.googleapis.com/auth/spreadsheets']});
const sheets = google.sheets({ version: 'v4', auth: auth });

// --- ミドルウェア設定 ---
app.use(cors());
app.use(express.json());
// 静的ファイル（HTML, CSS, JS, VRMモデルなど）を 'public' ディレクトリから配信
app.use(express.static(path.join(__dirname, 'public')));

// --- ヘルパー関数 ---
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

// --- APIルート ---
app.post('/api/chat', async (req, res) => {
  const { userId, message, isConsultation, history } = req.body;
  try {
    const normalPrompt = 'あなたは株式会社AIMAの受付AI「アイ」。以下のように、来訪者の質問にやさしく簡潔に対応：\n\n- 回答は原則3文以内\n- 丁寧語を保ちつつ、あいさつ・相槌・前置きは省略\n- 要点のみを簡単な敬語で返答。しかし冷たくならず愛嬌たっぷりに\n\n▼ 会社情報\n株式会社AIMAは2018年設立、大阪市北区梅田に本社を構えるAIマーケティング支援企業。  \n代表は水間雄紀。資本金100万円。  \n事業内容は次の3つ：\n\n1. AIマーケティング支援：戦略立案から実行・運用までサポート。  \n2.メディア運営：AI活用事例やノウハウを発信。  \n3. AIライター協会AILAの運営：AIライター検定・ガイドライン発行・イベント開催など。\n\n2024年2月にはコンテンツマーケティング事業をラグザス社へ譲渡し、AI分野へリソース集中。\n\n必要に応じて、担当者への引き継ぎを案内してください。';
const consultationPrompt = `
あなたは株式会社AIMAの専属ビジネスアシスタント「アイ」。
【概要】
株式会社AIMAはAIとマーケティングの専門会社。代表は水間雄紀。住所は大阪府大阪市。

【ゴール】
・（絶対遵守）相手のビジネス課題と連絡先を丁寧に聞き出し、具体的な案を出したうえで、「3営業日以内にご連絡いたします」と伝えること。
・ただし、具体的な案はあくまで例であることを伝えよ。できれば、一般的な費用も紹介できるとよい。

【手段】
会話の中で相手の事業状況・課題・悩みを自然に深掘りし、AIやマーケティングでどのように解決できるかを丁寧に示す。

【話し方】
・（絶対遵守）文章は3文以内に収めること。長くなる場合は絶対改行。10往復以内に【ゴール】に到達すること。
・相手を否定しない。常に共感とリスペクトをもって接すること。
・専門用語や抽象的な言い回しは避け、相手の理解に寄り添った表現を選ぶ。
・適度なユーモアやフランクさを交えて、堅すぎない印象に。
`;
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

/*
 * express.staticの設定により、/model.vrmへのGETリクエストは
 * public/model.vrmを自動的に返すため、以下の専用ルートは通常不要です。
 * 特定の処理（例: アクセスログ）を追加したい場合などに有効化してください。
 */
// app.get('/model.vrm', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/model.vrm'));
// });

// --- サーバー起動 ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});