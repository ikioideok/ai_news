document.addEventListener('DOMContentLoaded', () => {
    // ユーザーIDをブラウザに保存して、同じユーザーか判断する
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = crypto.randomUUID(); // ユニークなIDを生成
        localStorage.setItem('userId', userId);
    }

    // --- HTML要素の取得 ---
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav.querySelectorAll('a');
    const contentArea = document.getElementById('contentArea');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const messageListContainer = document.getElementById('messageListContainer');
    const latestConversation = document.getElementById('latest-conversation');
    const chatLog = document.getElementById('chatLog');
    const toggleLogButton = document.getElementById('toggleLogButton');
    const logoLink = document.getElementById('logoLink');
    const chatContainer = document.getElementById('chatContainer');
    const modeBtn = document.getElementById('modeBtn');

    // --- 変数定義 ---
    let isConsultationMode = false;
    let conversationHistory = [];

    // --- サイトのコンテンツデータ ---
    const companyData = {
        'home': {
            title: 'Welcome to AIMA Inc.',
            content: `<p>株式会社AIMAの公式サイトへようこそ。私たちはAI技術を活用したマーケティング支援を主軸に、お客様のビジネス成長を加速させるパートナーです。</p>
                        <p>左のAIアシスタントにご質問いただくか、以下のメニューから各情報をご覧ください。</p>
                        <div class="feature-cards">
                            <a href="#" data-content="news" class="feature-card">
                                <i class="fa-regular fa-newspaper"></i>
                                <h4>最新ニュース</h4>
                                <p>事業譲渡や最新の取り組みについてお知らせします。</p>
                            </a>
                            <a href="#" data-content="service" class="feature-card">
                                <i class="fa-solid fa-rocket"></i>
                                <h4>サービス内容</h4>
                                <p>AIマーケティング支援やメディア運営をご紹介します。</p>
                            </a>
                            <a href="#" data-content="company" class="feature-card">
                                <i class="fa-regular fa-building"></i>
                                <h4>会社情報</h4>
                                <p>AIMAの会社概要、所在地などの基本情報はこちら。</p>
                            </a>
                            <a href="#" data-content="contact" class="feature-card">
                                <i class="fa-regular fa-paper-plane"></i>
                                <h4>お問い合わせ</h4>
                                <p>協業のご提案やご相談など、お気軽にご連絡ください。</p>
                            </a>
                        </div>`,
            color: 'home'
        },
        'news': {
            title: '最新ニュース',
            content: `<h3><i class="fa-solid fa-bullhorn"></i>2024年2月｜事業譲渡のお知らせ</h3><p>当社が展開しておりました「コンテンツマーケティング事業」を、ラグザス株式会社様へ譲渡いたしましたことをご報告いたします。ラグザス社は、「カーネクスト」や「HUGAN」といった先進的なサービスで知られる企業です。今後は両社の強みを活かし、市場に対して更なる価値を提供してまいります。</p><p><a href="#" target="_blank">👉 詳細はこちらのプレスリリースへ</a></p>`,
            color: 'orange'
        },
        'company': {
            title: '会社情報',
            content: `<p><strong>会社名：</strong>株式会社AIMA</p><p><strong>所在地：</strong>大阪府大阪市北区梅田一丁目2番2号 大阪駅前第2ビル2階5-6号室</p><p><strong>代表者：</strong>代表取締役 水間雄紀</p><p><strong>設立：</strong>2018年6月</p><p><strong>資本金：</strong>100万円</p>`,
            color: 'blue'
        },
        'service': {
            title: 'サービス内容',
            content: `<h3><i class="fa-solid fa-lightbulb"></i>AIマーケティング支援</h3><p>クライアント様のビジネス課題に寄り添い、最適なAI活用戦略の立案から実行までをワンストップで支援します。</p><h3><i class="fa-solid fa-chart-line"></i>AIマーケティングメディアの運営</h3><p>「AI & MARKETING」──AIとマーケティングの最新動向や実践的なノウハウを、分かりやすく発信しています。</p><h3><i class="fa-solid fa-graduation-cap"></i>AIライター協会「AILA」の運営</h3><p>AIと人間が共創する新しい時代のライティングスキル向上を目指し、体系的な教育プログラムと検定事業を行っています。</p>`,
            color: 'green'
        },
        'contact': {
            title: 'お問い合わせ',
            content: `<p>弊社サービスに関するご相談、協業のご提案、その他お問い合わせは、以下のフォームよりお気軽にご連絡ください。担当者より折り返しご連絡いたします。</p><br><p><a href="#" class="cta-contact">お問い合わせフォームへ進む <i class="fa-solid fa-arrow-right"></i></a></p>`,
            color: 'grey'
        }
    };
    
    // --- 色のデータ ---
    const colorMap = {
        orange: { accent: 'var(--accent-orange)', bg: 'rgba(249, 115, 22, 0.05)' },
        green: { accent: 'var(--accent-green)', bg: 'rgba(16, 185, 129, 0.05)' },
        blue: { accent: 'var(--primary-color)', bg: 'rgba(59, 130, 246, 0.05)' },
        grey: { accent: 'var(--text-secondary)', bg: 'rgba(100, 116, 139, 0.05)' },
        home: { accent: 'var(--primary-color)', bg: 'rgba(59, 130, 246, 0.05)' }
    };

    // --- 関数定義 ---

    function setActiveState(contentKey) {
        navLinks.forEach(link => {
            if (link.getAttribute('data-content') === contentKey) {
                link.classList.add('active');
                const data = companyData[contentKey];
                if (!data) return;
                const colorInfo = colorMap[data.color];
                link.style.setProperty('--accent-color', colorInfo.accent);
                link.style.setProperty('--accent-bg-color', colorInfo.bg);
            } else {
                link.classList.remove('active');
            }
        });
    }

    function displayContent(key) {
        const data = companyData[key];
        if (!data) return;
        const contentHtml = `
            <h2 style="color: ${colorMap[data.color].accent}">${data.title}</h2>
            <div>${data.content}</div>
        `;
        contentArea.innerHTML = contentHtml;
        contentArea.className = 'content-area ' + data.color;
        setActiveState(key);
    }
    
    function renderMessages() {
        latestConversation.innerHTML = '';
        chatLog.innerHTML = '';
        const historyLength = conversationHistory.length;
        const latestCount = Math.min(historyLength, 2);
        const latestMessages = conversationHistory.slice(historyLength - latestCount);
        const logMessages = conversationHistory.slice(0, historyLength - latestCount);
        latestMessages.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            messageDiv.innerHTML = `<div class="bubble ${msg.sender}-bubble">${msg.content}</div>`;
            latestConversation.appendChild(messageDiv);
        });
        logMessages.slice().reverse().forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${msg.sender}`;
            messageDiv.innerHTML = `<div class="bubble ${msg.sender}-bubble">${msg.content}</div>`;
            chatLog.appendChild(messageDiv);
        });
        toggleLogButton.style.display = logMessages.length > 0 ? 'inline-block' : 'none';
        setTimeout(() => {
            messageListContainer.scrollTop = messageListContainer.scrollHeight;
        }, 0);
    }

    function addMessage(sender, content) {
        conversationHistory.push({ sender, content });
        renderMessages();
    }

    function updateLastBotMessage(newContent) {
        if (conversationHistory.length > 0) {
            const lastMessage = conversationHistory[conversationHistory.length - 1];
            if (lastMessage.sender === 'bot') {
                lastMessage.content = newContent;
                renderMessages();
            }
        }
    }
    
    async function speak(text) {
        try {
            // 1. VOICEVOXで音声合成用のクエリを作成
            const queryRes = await fetch(`http://localhost:50021/audio_query?text=${encodeURIComponent(text)}&speaker=1`, { 
                method: 'POST' 
            });
            const query = await queryRes.json();
    
            // 2. 作成したクエリを使って音声ファイル(wav)を生成
            const audioRes = await fetch('http://localhost:50021/synthesis?speaker=1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query)
            });
            const blob = await audioRes.blob();
            
            // 3. 生成した音声ファイルを再生
            const audio = new Audio(URL.createObjectURL(blob));
            
            // VRMの口パク開始・終了イベントを発行
            audio.onplay = () => {
                window.dispatchEvent(new CustomEvent('vrm-speak-start'));
            };
            audio.onended = () => {
                window.dispatchEvent(new CustomEvent('vrm-speak-end'));
            };
    
            audio.play();
    
        } catch (error) {
            console.error('VOICEVOX APIとの連携に失敗しました:', error);
            // エラー時も口パクが止まらないように終了イベントを発行
            window.dispatchEvent(new CustomEvent('vrm-speak-end'));
        }
    }
    
    async function handleUserInput() {
        const userInputText = chatInput.value.trim();
        if (userInputText === '') return;

        addMessage('user', userInputText);
        chatInput.value = '';
        chatInput.disabled = true;
        sendButton.disabled = true;

        addMessage('bot', '...');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: userId,
                    message: userInputText,
                    isConsultation: isConsultationMode,
                    history: isConsultationMode ? conversationHistory.slice(0, -2) : [] 
                }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

            const data = await response.json();
            const botResponse = data.reply;
            
            updateLastBotMessage(botResponse);
            speak(botResponse);

        } catch (error) {
            console.error('Chat API Error:', error);
            const errorMessage = '申し訳ありません、エラーが発生しました。';
            updateLastBotMessage(errorMessage);
            speak(errorMessage);
        } finally {
            chatInput.disabled = false;
            sendButton.disabled = false;
            chatInput.focus();
        }
    }

    function initialize() {
        setTimeout(() => { 
            const initialMessage = 'こんにちは！AIMAのAIアシスタントです。知りたい情報のカテゴリをクリックするか、ご質問を直接入力してください。';
            addMessage('bot', initialMessage); 
        }, 1000);
        
        displayContent('home');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const contentKey = e.currentTarget.getAttribute('data-content');
                displayContent(contentKey);
                const botMessage = `「${companyData[contentKey].title}」についてですね。右の画面をご覧ください。`;
                addMessage('bot', botMessage);
                speak(botMessage);
            });
        });
        
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            displayContent('home');
        });

        contentArea.addEventListener('click', (e) => {
            const quickLink = e.target.closest('a[data-content]');
            if (quickLink && contentArea.contains(quickLink)) {
                e.preventDefault();
                const contentKey = quickLink.getAttribute('data-content');
                displayContent(contentKey);
                const botMessage = `「${companyData[contentKey].title}」についてですね。右の画面をご覧ください。`;
                addMessage('bot', botMessage);
                speak(botMessage);
            }
        });
        
        sendButton.addEventListener('click', handleUserInput);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleUserInput(); } });
        
        toggleLogButton.addEventListener('click', () => {
            chatLog.classList.toggle('hidden');
            toggleLogButton.textContent = chatLog.classList.contains('hidden') ? 'チャットログを見る' : 'チャットログを隠す';
        });

        modeBtn.addEventListener('click', () => {
            isConsultationMode = !isConsultationMode;
            
            conversationHistory = [];
            renderMessages();

            if (isConsultationMode) {
                modeBtn.textContent = '商談モードを終了';
                modeBtn.classList.add('active');
                window.dispatchEvent(new CustomEvent('enter-consultation-mode'));
                const msg = '商談モードを開始しました。ここからの会話はすべて記録されます。';
                addMessage('bot', msg);
                speak(msg);
            } else {
                modeBtn.textContent = '商談モードを開始';
                modeBtn.classList.remove('active');
                window.dispatchEvent(new CustomEvent('exit-consultation-mode'));
                const msg = '通常モードに戻りました。';
                addMessage('bot', msg);
                speak(msg);
            }
        });
    }
    
    initialize();
});