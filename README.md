# AIMA Inc. - Corporate Website

![AIMA Inc.](https://img.shields.io/badge/Status-Live-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-orange)

## 概要

AIMA Inc.の公式企業サイト。Three.jsを活用した印象的な3Dアニメーションと洗練されたデザインが特徴です。

## 技術スタック

- **HTML5** - セマンティックマークアップ
- **CSS3** - モダンなスタイリングとレスポンシブデザイン
- **JavaScript (ES6+)** - インタラクティブな機能
- **Three.js v0.158.0** - 3Dグラフィックスとアニメーション
- **GSAP v3.12.5** - スムーズなアニメーションとスクロール制御

## ファイル構成

```
aima,inc/
├── index.html                    # メインHTMLファイル
├── assets/
│   ├── css/
│   │   └── style.css            # メインスタイルシート
│   ├── js/
│   │   ├── script.js            # GSAP制御とメインロジック
│   │   ├── three-scenes-rubik.js # Three.js 3Dシーン管理
│   │   └── three-scenes.js      # 旧Three.jsファイル（参考用）
│   └── images/                  # 画像アセット
├── memAgent/                    # 設定ファイル
└── README.md                    # このファイル
```

## 機能

### 🎨 視覚的特徴
- **3Dルービックキューブ** - Hero sectionの印象的なアニメーション
- **ワイヤーフレーム美学** - 統一された5色グラデーション
- **レスポンシブデザイン** - モバイル端末対応

### 🚀 インタラクティブ要素
- **スムーズスクロール** - セクション間のシームレス移動
- **パララックス効果** - 3Dシーンとスクロール連動
- **チャプターインジケーター** - 現在位置の視覚的表示

### 📱 最適化
- **パフォーマンス最適化** - モバイル端末での動作改善
- **アクセシビリティ** - 動きを減らす設定に対応
- **クロスブラウザ対応** - モダンブラウザでの安定動作

## セクション構成

1. **Hero** - 企業紹介とメインビジュアル
2. **Vision** - 企業ビジョンと3Dニューラルネットワーク
3. **Service** - サービス紹介と幾何学アニメーション
4. **Company** - 会社概要と建築構造3D
5. **Contact** - お問い合わせフォーム

## 開発者向け情報

### 色彩設計
- **Gold**: #D4AF37 (メインアクセント)
- **Light Gold**: #F7E98E (ハイライト)
- **Silver**: #E5E7EB (セカンダリ)
- **White**: #FFFFFF (ベース)

### アニメーション仕様
- **5フェーズカラーサイクル**: Silver → Blue → Green → Gold → White
- **60秒ループ**: 各3Dオブジェクトの回転周期
- **ワイヤーフレーム**: 0.3-0.5px線幅での統一

## ライセンス

© 2024 AIMA Inc. All rights reserved.

---

**Built with ❤️ for the future of AI marketing**