<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AIMA Inc. - DIAGONAL IMPACT</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@900&family=Roboto+Mono:wght@700&display=swap" rel="stylesheet" />

  <style>
    :root {
      --orange-flash: #FF4500;
      --mint-flash: #00FFC4;
      --text-raw: #000000;
      --bg-raw: #FFFFFF;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: var(--bg-raw);
      font-family: 'Noto Sans JP', sans-serif;
      color: var(--text-raw);
    }

    #hero {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-raw);
    }

    .flash-pane {
      position: absolute;
      width: 150vw;
      height: 150vh;
      z-index: 100;
      animation-duration: 1.2s;
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      animation-fill-mode: forwards;
    }

    .orange-pane {
      top: -25vh;
      left: -25vw;
      background-color: var(--orange-flash);
      transform: translate(-100%, -100%) rotate(-45deg);
      animation-name: diagonal-flash-orange;
    }

    .mint-pane {
      bottom: -25vh;
      right: -25vw;
      background-color: var(--mint-flash);
      transform: translate(100%, 100%) rotate(-45deg);
      animation-name: diagonal-flash-mint;
      animation-delay: 0.2s;
    }

    .hero-title {
      margin: 0;
      font-size: clamp(4rem, 16vw, 13rem);
      font-weight: 900;
      color: var(--text-raw);
      z-index: 10;
      opacity: 0;
      animation: fade-in 1s ease-out 1.5s forwards;
    }

    #main-content {
      position: relative;
      width: 100%;
      min-height: 100vh;
      padding: 100px 40px;
      box-sizing: border-box;
    }

    .content-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }

    h2 {
      font-size: 3rem;
      margin-bottom: 40px;
      border-bottom: 4px solid var(--text-raw);
      display: inline-block;
    }

    .description-box {
      width: clamp(280px, 30vw, 350px);
      padding: 25px;
      border: 2px solid var(--text-raw);
      margin-bottom: 40px;
    }

    .description-box p {
      margin: 0;
      font-family: 'Roboto Mono', monospace;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.6;
    }

    .description-box .highlight {
      background: var(--mint-flash);
      color: var(--text-raw);
      padding: 2px 5px;
    }

    .main-text p {
      font-size: 1.1rem;
      line-height: 2;
    }

    @keyframes diagonal-flash-orange {
      0% { transform: translate(-100%, -100%) rotate(-45deg); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translate(0, 0) rotate(-45deg); opacity: 0; }
    }

    @keyframes diagonal-flash-mint {
      0% { transform: translate(100%, 100%) rotate(-45deg); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translate(0, 0) rotate(-45deg); opacity: 0; }
    }

    @keyframes fade-in {
      to { opacity: 1; }
    }
  </style>
</head>

<body>
  <section id="hero">
    <div class="flash-pane orange-pane"></div>
    <div class="flash-pane mint-pane"></div>
    <h1 class="hero-title">限界を超えろ。</h1>
  </section>

  <section id="main-content">
    <div class="content-wrapper">
      <h2>Our Vision</h2>
      <div class="description-box">
        <p>
          <span class="highlight">// AIMA Inc.</span><br />
          STATUS: UNLEASHED<br />
          OBJECTIVE: BREAK THE RULES<br />
          METHOD: ARTIFICIAL INTELLIGENCE
        </p>
      </div>

      <div class="main-text">
        <p>
          ここにメインコンテンツが表示されます。株式会社AIMAは、AI技術を核とした革新的なソリューションを提供し、既成概念を打ち破ることでクライアントのビジネスを新たな次元へと導きます。私たちの目的は、単なる問題解決ではなく、未来そのものを創造することです。
        </p>
      </div>
    </div>
  </section>

  <script>
    window.addEventListener('load', () => {
      const heroTitle = document.querySelector('.hero-title');
      const mainContent = document.getElementById('main-content');

      // アニメーション終了後にスクロール
      heroTitle.addEventListener('animationend', () => {
        setTimeout(() => {
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }, 100); // 100ミリ秒後にスクロール
      });
    });
  </script>

</body>
</html>