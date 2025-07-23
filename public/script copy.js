let model; // VRMモデル保持用

// ページ読み込み時に初期化
window.addEventListener('DOMContentLoaded', async () => {
  await initVRM(); // VRMロード
  document.getElementById('sendBtn').addEventListener('click', sendMessage);
});

// チャット送信処理
async function sendMessage() {
  const input = document.getElementById('userInput');
  const message = input.value;
  if (!message) return;

  appendMessage('あなた', message);
  input.value = '';

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  appendMessage('AI', data.reply);
  speakText(data.reply); // 口パクさせる
}

// チャットUIに表示
function appendMessage(sender, text) {
  const box = document.getElementById('chatBox');
  const msg = document.createElement('div');
  msg.innerHTML = `<strong>${sender}：</strong>${text}`;
  box.appendChild(msg);
}

// テキストをVRMに喋らせる（簡易口パク）
function speakText(text) {
  let idx = 0;
  const interval = setInterval(() => {
    const mouthOpen = Math.sin(Date.now() / 100) * 0.5 + 0.5;
    if (model && model.expressionManager) {
      model.expressionManager.setValue('aa', mouthOpen);
    }
    idx++;
    if (idx > text.length * 2) {
      clearInterval(interval);
      if (model && model.expressionManager) {
        model.expressionManager.setValue('aa', 0);
      }
    }
  }, 100);
}
