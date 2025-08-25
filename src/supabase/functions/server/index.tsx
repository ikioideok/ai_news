import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS and logging
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', logger(console.log));

// Types
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  readTime: number;
  views: number;
  featured: boolean;
  status: 'draft' | 'published';
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Initialize sample data if needed
app.get('/make-server-c8cbcb38/init', async (c) => {
  try {
    const existingArticles = await kv.get('articles');
    if (!existingArticles) {
      const sampleArticles: Article[] = [
        {
          id: "1",
          slug: "gpt-4-marketing-automation",
          title: "GPT-4を活用したマーケティング自動化の実践ガイド",
          excerpt: "GPT-4の強力な自然言語処理能力を活用して、マーケティング業務を効率化する具体的な手法をご紹介します。",
          content: `# GPT-4を活用したマーケティング自動化の実践ガイド

マーケティング業界において、AI技術の活用は単なるトレンドではなく、競争優位性を獲得するための必須戦略となっています。特にGPT-4の登場により、これまで人間でなければできなかった創造的なマーケティング業務も自動化できるようになりました。

## 1. コンテンツ生成の自動化

GPT-4を活用することで、以下のコンテンツを効率的に生成できます：

- **ブログ記事**: SEOに最適化された記事の自動生成
- **SNS投稿**: 各プラットフォームに適したコンテンツの作成
- **メールマーケティング**: パーソナライズされたメール文面の自動生成
- **広告コピー**: ターゲット別の効果的な広告文の作成

## 2. 顧客対応の自動化

### チャットボットの高度化

従来のルールベースのチャットボットとは異なり、GPT-4を活用したチャットボットは：

- 複雑な質問にも自然な対話で対応
- 顧客の意図を正確に理解し、適切な情報を提供
- 感情を理解した共感的な対応

### カスタマーサポートの効率化

- サポートチケットの自動分類
- 回答候補の自動生成
- エスカレーション基準の判断

## 3. データ分析とインサイト生成

GPT-4は大量のマーケティングデータを分析し、人間が見落としがちなパターンや洞察を発見できます：

- **顧客行動の分析**: 購買パターンの特定と予測
- **市場トレンドの把握**: ソーシャルメディアやニュースデータからのトレンド抽出
- **競合分析**: 競合他社の戦略分析と対策提案

## 4. 実装のベストプラクティス

### 段階的な導入

1. **パイロットプロジェクト**: 小規模な施策から開始
2. **効果測定**: KPIを設定し、改善効果を定量化
3. **スケールアップ**: 成功事例を他の業務に展開

### 品質管理

- **人間によるレビュー**: AI生成コンテンツの品質確認
- **ブランドガイドライン**: 一貫したブランドメッセージの維持
- **継続的な学習**: フィードバックによるAIモデルの改善

## まとめ

GPT-4を活用したマーケティング自動化は、企業の競争力向上に大きく貢献します。ただし、技���的な導入だけでなく、組織体制の整備や従業員のスキルアップも同時に進めることが成功の鍵となります。

次世代のマーケティング戦略として、GPT-4の活用を検討してみてはいかがでしょうか。`,
          category: "AI技術",
          tags: ["GPT-4", "マーケティング自動化", "AI活用", "効率化"],
          publishedAt: "2024-08-20T10:00:00Z",
          author: {
            name: "山田健太郎",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
          },
          image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
          readTime: 8,
          views: 2543,
          featured: true,
          status: 'published' as const,
          seo: {
            metaTitle: "GPT-4マーケティング自動化ガイド | AI Marketing News",
            metaDescription: "GPT-4を活用したマーケティング自動化の実践手法を詳しく解説。コンテンツ生成から顧客対応まで、効率化のポイントをご紹介します。",
            ogTitle: "GPT-4を活用したマーケティング自動化の実践ガイド",
            ogDescription: "GPT-4の強力な自然言語処理能力を活用して、マーケティング業務を効率化する具体的な手法をご紹介します。",
            ogImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200",
            twitterTitle: "GPT-4マーケティング自動化ガイド",
            twitterDescription: "GPT-4でマーケティング業務を効率化する具体的な手法を解説",
            twitterImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
            keywords: ["GPT-4", "マーケティング自動化", "AI", "効率化", "コンテンツ生成"]
          },
          createdAt: "2024-08-20T10:00:00Z",
          updatedAt: "2024-08-20T10:00:00Z"
        },
        {
          id: "2",
          slug: "ai-content-marketing-strategy",
          title: "AIを活用したコンテンツマーケティング戦略2024",
          excerpt: "2024年のコンテンツマーケティングにおけるAI活用の最新トレンドと実践的なアプローチを解説します。",
          content: `# AIを活用したコンテンツマーケティング戦略2024

2024年、コンテンツマーケティングの世界は大きな変革期を迎えています。AI技術の急速な発展により、従来の手法では太刀打ちできない新たな競争環境が生まれています。

## 現在のコンテンツマーケティングの課題

### 1. コンテンツの量的・質的な競争激化

- 毎日数百万の記事が公開される中での差別化
- SEOアルゴリズムの複雑化
- ユーザーの注意時間の短縮化

### 2. パーソナライゼーションの重要性

- One-to-Oneマーケティングの必要性
- 膨大な顧客データの活用
- リアルタイムでの最適化

## AIがもたらす革新的な解決策

### コンテンツ生成の自動化

**テキストコンテンツ**
- 記事の自動生成と最適化
- SEOキーワードの自動選定
- 多言語対応コンテンツの作成

**ビジュアルコンテンツ**
- 画像・動画の自動生成
- インフォグラフィックの作成
- ブランドイメージに合わせたデザイン

### データドリブンな戦略策定

- 顧客行動予測
- コンテンツパフォーマンスの分析
- 最適な配信タイミングの判断

## 実践的な導入ステップ

### フェーズ1: 基盤整備（1-2ヶ月）

1. **データ収集基盤の構築**
   - 顧客データの統合
   - アナリティクス環境の整備

2. **ツール選定と導入**
   - AI文章生成ツール
   - 画像・動画生成ツール
   - 分析・最適化ツール

### フェーズ2: パイロット運用（2-3ヶ月）

1. **限定的な範囲での実験**
   - 特定カテゴリでのAI生成コンテンツテスト
   - A/Bテストによる効果検証

2. **品質管理体制の確立**
   - 人間による監修プロセス
   - ブランドガイドラインの適用

### フェーズ3: 本格展開（3-6ヶ月）

1. **スケールアップ**
   - 全カテゴリへの展開
   - 多チャネル対応

2. **継続的な最適化**
   - パフォーマンス監視
   - AIモデルの改善

## 成功事例から学ぶベストプラクティス

### 事例1: 大手ECサイト

- **課題**: 商品説明文の大量作成
- **解決策**: GPT-4による自動生成システム
- **結果**: 作業時間90%削減、コンバージョン率15%向上

### 事例2: BtoB企業

- **課題**: 業界別コンテンツの個別作成
- **解決策**: AI分析による顧客セグメント別コンテンツ最適化
- **結果**: リード獲得数200%増加

## 2024年の展望と次世代戦略

### マルチモーダルAIの活用

- テキスト、画像、音声を統合したコンテンツ
- インタラクティブなコンテンツ体験
- VR/ARとの連携

### リアルタイム最適化

- 顧客の行動に応じた動的コンテンツ変更
- 予測分析による先回りした提案
- 感情分析を活用した共感コンテンツ

## まとめ

AIを活用したコンテンツマーケティングは、もはや「あれば良い」ものではなく、競争力維持のための「必須」技術となっています。早期の導入と継続的な最適化により、持続可能な競争優位性を構築することが可能です。

2024年は、AIネイティブなコンテンツマーケティング戦略を確立する重要な年となるでしょう。`,
          category: "マーケティング戦略",
          tags: ["コンテンツマーケティング", "AI活用", "戦略", "2024トレンド"],
          publishedAt: "2024-08-18T14:30:00Z",
          author: {
            name: "佐藤美咲",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
          },
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
          readTime: 12,
          views: 1834,
          featured: true,
          status: 'published' as const,
          seo: {
            metaTitle: "AIコンテンツマーケティング戦略2024 | AI Marketing News",
            metaDescription: "2024年のコンテンツマーケティングにおけるAI活用の最新トレンドと実践的なアプローチを専門家が解説します。",
            ogTitle: "AIを活用したコンテンツマーケティング戦略2024",
            ogDescription: "2024年のコンテンツマーケティングにおけるAI活用の最新トレンドと実践的なアプローチを解説します。",
            ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
            keywords: ["コンテンツマーケティング", "AI", "戦略", "2024", "マーケティング"]
          },
          createdAt: "2024-08-18T14:30:00Z",
          updatedAt: "2024-08-18T14:30:00Z"
        },
        {
          id: "3",
          slug: "chatgpt-customer-support",
          title: "ChatGPTを活用したカスタマーサポートの最適化",
          excerpt: "ChatGPTの導入により、カスタマーサポートの品質向上とコスト削減を同時に実現する方法を詳しく解説します。",
          content: `# ChatGPTを活用したカスタマーサポートの最適化

カスタマーサポートは企業と顧客の重要な接点であり、顧客満足度や収益に直結する重要な機能です。ChatGPTの登場により、従来のサポート業務が大きく変革される可能性があります。

## 従来のカスタマーサポートの課題

### 1. 人的リソースの制約

- 24時間365日対応の困難
- ピーク時の対応遅延
- 熟練スタッフの育成コスト

### 2. 対応品質のバラつき

- オペレーター間のスキル差
- 感情的な対応のリスク
- 一貫性のない回答

### 3. コストの増大

- 人件費の上昇
- 研修・教育コスト
- システム維持費用

## ChatGPTがもたらす革新

### 即座な対応

- **24時間365日対応**: 時間を問わない顧客サポート
- **同時多重対応**: 複数の問い合わせを並行処理
- **ゼロ待機時間**: 即座の応答による顧客満足度向上

### 高品質な対応

- **一貫した品質**: 常に最適な回答を提供
- **感情理解**: 顧客の感情を理解した共感的対応
- **多言語対応**: グローバル顧客への対応

### 学習・改善能力

- **継続的学習**: 過去の対応から学習し改善
- **知識ベース活用**: 企業の蓄積された知識を効果的に活用
- **パターン認識**: 類似問題の早期発見と解決

## 実装における具体的なアプローチ

### ステップ1: 準備段階

**データ整備**
// - FAQ データベースの構築
// - 過去の問い合わせ履歴の分析  
// - 製品・サービス情報の整理

**システム設計**
// - ChatGPT API の統合
// - 既存CRMシステムとの連携
// - セキュリティ対策の実装

### ステップ2: パイロット運用

**限定的な導入**
- 特定カテゴリの問い合わせから開始
- 人間のオペレーターによる監視
- 定期的な品質チェック

**効果測定**
- 応答時間の短縮
- 顧客満足度の変化
- 問題解決率の向上

### ステップ3: 本格運用

**全面展開**
- 全カテゴリへの適用
- 複雑な問い合わせへの対応拡大
- エスカレーション機能の最適化

**継続改善**
- フィードバックによる学習
- 新機能の追加
- パフォーマンスの最適化

## 成功事例の紹介

### 事例1: 大手通信キャリア

**導入前の課題**
- 月間問い合わせ数：50万件
- 平均応答時間：15分
- 顧客満足度：3.2/5

**ChatGPT導入後の改善**
- 初回応答時間：30秒以下
- 問題解決率：85%
- 顧客満足度：4.1/5
- 人件費：40%削減

### 事例2: Eコマース企業

**導入効果**
- 注文関連問い合わせの自動解決：90%
- 返品・交換処理の効率化：60%向上
- 多言語対応の実現：5言語同時対応

## 導入時の注意点とベストプラクティス

### セキュリティ対策

- **個人情報の保護**: 適切なデータマスキング
- **アクセス制御**: 権限管理の徹底
- **監査ログ**: 全ての対応履歴の記録

### 品質管理

- **定期的な評価**: 対応品質の継続的な監視
- **人間による監督**: 複雑なケースでの介入
- **フィードバック機能**: 顧客からの評価収集

### 従業員への配慮

- **役割の再定義**: より高度な業務への移行支援
- **スキルアップ支援**: 新しい技術習得の支援
- **段階的な導入**: 急激な変化を避ける

## 今後の展望

### 技術の進歩

- **感情認識の向上**: より人間らしい対応
- **音声対応**: 電話サポートの自動化
- **予測分析**: 問題の事前検知と予防

### 新たな価値創造

- **プロアクティブサポート**: 問題が起きる前の提案
- **パーソナライゼーション**: 個別最適化されたサポート
- **ビジネスインサイト**: サポートデータからの事業改善提案

## まとめ

ChatGPTを活用したカスタマーサポートの最適化は、コスト削減と品質向上を同時に実現する革新的なソリューションです。適切な導入戦略と継続的な改善により、顧客満足度の向上と競争優位性の確立が可能になります。

企業規模や業界を問わず、カスタマーサポートの変革を検討する時期が来ています。早期の導入により、将来的な競争優位性を築くことができるでしょう。`,
          category: "カスタマーサポート",
          tags: ["ChatGPT", "カスタマーサポート", "最適化", "AI導入"],
          publishedAt: "2024-08-15T09:15:00Z",
          author: {
            name: "田中雄一",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
          },
          image: "https://images.unsplash.com/photo-1553775282-20af80779df7?w=800",
          readTime: 10,
          views: 3421,
          featured: false,
          status: 'published' as const,
          seo: {
            metaTitle: "ChatGPTカスタマーサポート最適化ガイド | AI Marketing News",
            metaDescription: "ChatGPTを活用したカスタマーサポートの品質向上とコスト削減を同時に実現する方法を詳しく解説します。",
            ogTitle: "ChatGPTを活用したカスタマーサポートの最適化",
            ogDescription: "ChatGPTの導入により、カスタマーサポートの品質向上とコスト削減を同時に実現する方法を詳しく解説します。",
            ogImage: "https://images.unsplash.com/photo-1553775282-20af80779df7?w=1200",
            keywords: ["ChatGPT", "カスタマーサポート", "最適化", "AI", "顧客対応"]
          },
          createdAt: "2024-08-15T09:15:00Z",
          updatedAt: "2024-08-15T09:15:00Z"
        }
      ];

      await kv.set('articles', sampleArticles);
      await kv.set('articleCount', sampleArticles.length);
      
      // Create search index
      const searchIndex = sampleArticles.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        tags: article.tags,
        slug: article.slug
      }));
      await kv.set('searchIndex', searchIndex);
      
      console.log('Sample articles initialized');
    }
    
    return c.json({ success: true, message: 'Data initialized' });
  } catch (error) {
    console.error('Init error:', error);
    return c.json({ error: 'Failed to initialize data' }, 500);
  }
});

// Get all articles with pagination and filtering
app.get('/make-server-c8cbcb38/articles', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '9');
    const category = c.req.query('category');
    const tag = c.req.query('tag');
    const search = c.req.query('search');
    const featured = c.req.query('featured');

    let articles: Article[] = await kv.get('articles') || [];

    // Apply filters
    if (category && category !== 'all') {
      articles = articles.filter(article => article.category === category);
    }

    if (tag) {
      articles = articles.filter(article => article.tags.includes(tag));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    if (featured === 'true') {
      articles = articles.filter(article => article.featured);
    }

    // Sort by published date (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Pagination
    const total = articles.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedArticles = articles.slice(offset, offset + limit);

    return c.json({
      articles: paginatedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get articles error:', error);
    return c.json({ error: 'Failed to fetch articles' }, 500);
  }
});

// Get single article by slug
app.get('/make-server-c8cbcb38/articles/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const articles: Article[] = await kv.get('articles') || [];
    
    const article = articles.find(a => a.slug === slug);
    
    if (!article) {
      return c.json({ error: 'Article not found' }, 404);
    }

    // Increment view count
    article.views += 1;
    await kv.set('articles', articles);

    return c.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    return c.json({ error: 'Failed to fetch article' }, 500);
  }
});

// Get all categories
app.get('/make-server-c8cbcb38/categories', async (c) => {
  try {
    const articles: Article[] = await kv.get('articles') || [];
    const categories = [...new Set(articles.map(article => article.category))];
    
    return c.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Get all tags
app.get('/make-server-c8cbcb38/tags', async (c) => {
  try {
    const articles: Article[] = await kv.get('articles') || [];
    const allTags = articles.flatMap(article => article.tags);
    const tags = [...new Set(allTags)];
    
    return c.json({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    return c.json({ error: 'Failed to fetch tags' }, 500);
  }
});

// Search articles
app.get('/make-server-c8cbcb38/search', async (c) => {
  try {
    const query = c.req.query('q') || '';
    const articles: Article[] = await kv.get('articles') || [];
    
    if (!query.trim()) {
      return c.json({ results: [] });
    }

    const searchLower = query.toLowerCase();
    const results = articles
      .filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        article.category.toLowerCase().includes(searchLower)
      )
      .map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        category: article.category,
        tags: article.tags,
        publishedAt: article.publishedAt,
        author: article.author,
        image: article.image,
        readTime: article.readTime
      }))
      .slice(0, 10); // Limit to 10 results

    return c.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return c.json({ error: 'Search failed' }, 500);
  }
});

// Get related articles
app.get('/make-server-c8cbcb38/articles/:slug/related', async (c) => {
  try {
    const slug = c.req.param('slug');
    const articles: Article[] = await kv.get('articles') || [];
    
    const currentArticle = articles.find(a => a.slug === slug);
    if (!currentArticle) {
      return c.json({ error: 'Article not found' }, 404);
    }

    // Find related articles based on category and tags
    const relatedArticles = articles
      .filter(article => article.slug !== slug)
      .map(article => {
        let score = 0;
        
        // Same category gets higher score
        if (article.category === currentArticle.category) {
          score += 10;
        }
        
        // Shared tags get points
        const sharedTags = article.tags.filter(tag => currentArticle.tags.includes(tag));
        score += sharedTags.length * 5;
        
        return { article, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.article);

    return c.json({ articles: relatedArticles });
  } catch (error) {
    console.error('Get related articles error:', error);
    return c.json({ error: 'Failed to fetch related articles' }, 500);
  }
});

// === ADMIN ENDPOINTS ===

// Simple admin authentication
const ADMIN_PASSWORD = 'admin123'; // In production, use proper auth

// Admin login
app.post('/make-server-c8cbcb38/admin/login', async (c) => {
  try {
    const { password } = await c.req.json();
    
    if (password === ADMIN_PASSWORD) {
      return c.json({ 
        success: true, 
        token: 'admin-token',
        message: 'Login successful' 
      });
    } else {
      return c.json({ error: 'Invalid password' }, 401);
    }
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Admin: Get all articles (including drafts)
app.get('/make-server-c8cbcb38/admin/articles', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.includes('admin-token')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '10');
    const status = c.req.query('status'); // 'draft', 'published', or undefined for all

    let articles: Article[] = await kv.get('articles') || [];

    // Filter by status if specified
    if (status) {
      articles = articles.filter(article => article.status === status);
    }

    // Sort by updated date (newest first)
    articles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Pagination
    const total = articles.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedArticles = articles.slice(offset, offset + limit);

    return c.json({
      articles: paginatedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin get articles error:', error);
    return c.json({ error: 'Failed to fetch articles' }, 500);
  }
});

// Admin: Get single article by ID
app.get('/make-server-c8cbcb38/admin/articles/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.includes('admin-token')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const articles: Article[] = await kv.get('articles') || [];
    
    const article = articles.find(a => a.id === id);
    
    if (!article) {
      return c.json({ error: 'Article not found' }, 404);
    }

    return c.json({ article });
  } catch (error) {
    console.error('Admin get article error:', error);
    return c.json({ error: 'Failed to fetch article' }, 500);
  }
});

// Admin: Create new article
app.post('/make-server-c8cbcb38/admin/articles', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.includes('admin-token')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const articleData = await c.req.json();
    const articles: Article[] = await kv.get('articles') || [];
    
    // Generate unique ID and slug
    const id = Date.now().toString();
    const slug = articleData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);

    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = articleData.content.split(/\s+/).length;
    const readTime = Math.max(1, Math.round(wordCount / 200));

    const newArticle: Article = {
      id,
      slug: `${slug}-${id}`,
      title: articleData.title,
      excerpt: articleData.excerpt,
      content: articleData.content,
      category: articleData.category,
      tags: articleData.tags || [],
      author: articleData.author,
      image: articleData.image,
      readTime,
      views: 0,
      featured: articleData.featured || false,
      status: articleData.status || 'draft',
      seo: articleData.seo || {},
      publishedAt: articleData.status === 'published' ? new Date().toISOString() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    articles.push(newArticle);
    await kv.set('articles', articles);

    // Update search index
    const searchIndex = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      slug: article.slug
    }));
    await kv.set('searchIndex', searchIndex);

    console.log('Article created:', newArticle.id);
    return c.json({ article: newArticle });
  } catch (error) {
    console.error('Create article error:', error);
    return c.json({ error: 'Failed to create article' }, 500);
  }
});

// Admin: Update article
app.put('/make-server-c8cbcb38/admin/articles/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.includes('admin-token')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const updateData = await c.req.json();
    const articles: Article[] = await kv.get('articles') || [];
    
    const articleIndex = articles.findIndex(a => a.id === id);
    if (articleIndex === -1) {
      return c.json({ error: 'Article not found' }, 404);
    }

    const existingArticle = articles[articleIndex];

    // Calculate read time if content changed
    let readTime = existingArticle.readTime;
    if (updateData.content && updateData.content !== existingArticle.content) {
      const wordCount = updateData.content.split(/\s+/).length;
      readTime = Math.max(1, Math.round(wordCount / 200));
    }

    // Update slug if title changed
    let slug = existingArticle.slug;
    if (updateData.title && updateData.title !== existingArticle.title) {
      slug = updateData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50) + '-' + id;
    }

    const updatedArticle: Article = {
      ...existingArticle,
      ...updateData,
      id, // Preserve ID
      slug,
      readTime,
      publishedAt: updateData.status === 'published' && existingArticle.status !== 'published' 
        ? new Date().toISOString() 
        : existingArticle.publishedAt,
      updatedAt: new Date().toISOString()
    };

    articles[articleIndex] = updatedArticle;
    await kv.set('articles', articles);

    // Update search index
    const searchIndex = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      slug: article.slug
    }));
    await kv.set('searchIndex', searchIndex);

    console.log('Article updated:', updatedArticle.id);
    return c.json({ article: updatedArticle });
  } catch (error) {
    console.error('Update article error:', error);
    return c.json({ error: 'Failed to update article' }, 500);
  }
});

// Admin: Delete article
app.delete('/make-server-c8cbcb38/admin/articles/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.includes('admin-token')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const articles: Article[] = await kv.get('articles') || [];
    
    const articleIndex = articles.findIndex(a => a.id === id);
    if (articleIndex === -1) {
      return c.json({ error: 'Article not found' }, 404);
    }

    const deletedArticle = articles[articleIndex];
    articles.splice(articleIndex, 1);
    await kv.set('articles', articles);

    // Update search index
    const searchIndex = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags,
      slug: article.slug
    }));
    await kv.set('searchIndex', searchIndex);

    console.log('Article deleted:', deletedArticle.id);
    return c.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('Delete article error:', error);
    return c.json({ error: 'Failed to delete article' }, 500);
  }
});

// Admin: Get site metadata
app.get('/make-server-c8cbcb38/admin/metadata', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.includes('admin-token')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const articles: Article[] = await kv.get('articles') || [];
    
    const metadata = {
      siteTitle: 'AI Marketing News',
      siteDescription: 'AI・マーケティング業界の最新動向と実践的なノウハウを専門家がお届け',
      siteUrl: 'https://ai-marketing-news.example.com',
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      categories: [...new Set(articles.map(a => a.category))],
      tags: [...new Set(articles.flatMap(a => a.tags))],
      lastUpdated: new Date().toISOString()
    };

    return c.json({ metadata });
  } catch (error) {
    console.error('Get metadata error:', error);
    return c.json({ error: 'Failed to fetch metadata' }, 500);
  }
});

Deno.serve(app.fetch);