import { SimpleHeader } from "./components/SimpleHeader";
import { SimpleCard } from "./components/SimpleCard";
import { CompactCard } from "./components/CompactCard";
import { Sidebar } from "./components/Sidebar";
import { SimpleFooter } from "./components/SimpleFooter";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { ArrowRight, TrendingUp, Star, Zap } from "lucide-react";

export default function App() {
  const featuredArticle = {
    title: "GPT-4 Turboの性能向上と新機能について徹底解説",
    excerpt: "OpenAIが発表した最新のGPT-4 Turboは、従来モデルと比較して大幅な性能向上を実現しています。新たに追加された機能と実用的な活用方法について詳しく解説します。",
    author: "田中 AI研究員",
    publishDate: "2024年1月15日",
    readTime: "8分",
    category: "技術解説",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzU2MTgzMDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    featured: true
  };

  const specialArticles = [
    {
      title: "機械学習エンジニアのキャリアパス2024年版",
      excerpt: "AI業界の急速な発展に伴い、機械学習エンジニアのキャリア選択肢も多様化しています。2024年現在の市場動向と将来性について分析します。",
      author: "佐藤 ML専門家",
      publishDate: "2024年1月12日", 
      readTime: "12分",
      category: "キャリア",
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzU2MTgzMDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "画像生成AIの商用利用における法的注意点",
      excerpt: "MidjourneyやDALL-E 3などの画像生成AIツールをビジネスで活用する際の著作権や肖像権に関する重要なポイントを法的観点から解説します。",
      author: "山田 法務専門員",
      publishDate: "2024年1月10日",
      readTime: "10分", 
      category: "法務・倫理",
      imageUrl: "https://images.unsplash.com/photo-1686191128892-4d9512e79e4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGFydCUyMGdlbmVyYXRpb258ZW58MXx8fHwxNzU2MTgzMDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "量子コンピューティングとAIの融合：次世代技術の展望",
      excerpt: "量子コンピュータとAI技術の組み合わせが開く新たな可能性について解説。量子機械学習アルゴリズムの基礎から実用化への道筋まで詳しく紹介します。",
      author: "川口 量子研究者",
      publishDate: "2024年1月9日",
      readTime: "16分",
      category: "先端技術",
      imageUrl: "https://images.unsplash.com/photo-1752451399417-eb6e072269bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxxdWFudHVtJTIwY29tcHV0aW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTYxMTIzMjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "ロボティクスにおけるAI技術の革新的応用",
      excerpt: "産業用ロボットから家庭用アシスタントまで、AI技術がロボット工学にもたらしている変革について事例を交えて詳しく解説します。",
      author: "小林 ロボティクス専門家",
      publishDate: "2024年1月7日",
      readTime: "13分",
      category: "ロボティクス",
      imageUrl: "https://images.unsplash.com/photo-1641312874336-6279a832a3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdGljcyUyMGF1dG9tYXRpb24lMjBhaXxlbnwxfHx8fDE3NTYxOTA0NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const recentArticles = [
    {
      title: "Transformerアーキテクチャの基礎から実装まで",
      excerpt: "自然言語処理の革命をもたらしたTransformerモデルについて、基本的な仕組みからPyTorchを使った実装例まで段階的に説明します。",
      author: "鈴木 NLP研究者",
      publishDate: "2024年1月8日",
      readTime: "15分",
      category: "技術解説", 
      imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXVyYWwlMjBuZXR3b3JrfGVufDF8fHx8MTc1NjE4MzAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "AutoMLツール比較：初心者向けガイド2024",
      excerpt: "機械学習の専門知識がなくても利用できるAutoMLツールが注目されています。主要なサービスの特徴と選び方のポイントを比較解説します。",
      author: "高橋 データサイエンティスト",
      publishDate: "2024年1月5日",
      readTime: "8分",
      category: "ツール紹介",
      imageUrl: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZXxlbnwxfHx8fDE3NTYxODMwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "コンピュータビジョンによる製造業DX事例",
      excerpt: "AI技術を活用した製造業の品質管理自動化事例を紹介。画像認識技術がもたらす効率化と品質向上の実際について詳しく解説します。",
      author: "中村 産業AI専門家",
      publishDate: "2024年1月3日",
      readTime: "12分",
      category: "ビジネス事例",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW51ZmFjdHVyaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTYxODMwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "深層学習による自然言語生成の最新手法",
      excerpt: "GPTシリーズから最新のLLaMAまで、言語生成モデルの進化と実用的な応用例について技術的な観点から詳しく解説します。",
      author: "林 研究開発者",
      publishDate: "2024年1月1日",
      readTime: "11分",
      category: "技術解説",
      imageUrl: "https://images.unsplash.com/photo-1676299081847-824916de030a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwbGFuZ3VhZ2UlMjBwcm9jZXNzaW5nfGVufDF8fHx8MTc1NjE4MzAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      title: "エッジAIの実装と性能最適化テクニック",
      excerpt: "IoTデバイスでのAI推論を効率化するためのモデル軽量化と最適化手法について、実際のプロジェクト事例を交えて解説します。",
      author: "森 エンジニア",
      publishDate: "2023年12月28日",
      readTime: "14分",
      category: "技術解説",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGdlJTIwY29tcHV0aW5nfGVufDF8fHx8MTc1NjE4MzAxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      
      <main className="w-full max-w-[95vw] mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground title-font">
              <span className="text-red-accent">AI</span> Media Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              人工知能の最新技術動向、研究成果、ビジネス応用まで、
              AI分野の信頼できる情報をわかりやすくお届けします
            </p>
          </div>
        </section>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Featured Article */}
            <section>
              <SimpleCard {...featuredArticle} />
            </section>

            {/* Special Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="h-6 w-6 text-red-accent" />
                  特集
                </h2>
                <Button variant="outline" className="border-red-accent text-red-accent hover:bg-red-accent hover:text-red-accent-foreground">
                  特集一覧
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specialArticles.map((article, index) => (
                  <SimpleCard key={index} {...article} />
                ))}
              </div>
            </section>

            {/* Recent Articles */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="h-6 w-6 text-red-accent" />
                  最新記事
                </h2>
                <Button variant="outline" className="border-red-accent text-red-accent hover:bg-red-accent hover:text-red-accent-foreground">
                  すべて見る
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentArticles.map((article, index) => (
                  <CompactCard key={index} {...article} />
                ))}
              </div>
            </section>

            {/* Load More */}
            <div className="text-center pt-8">
              <Button size="lg" className="bg-red-accent text-red-accent-foreground hover:bg-red-accent/90">
                さらに記事を読む
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <SimpleFooter />
    </div>
  );
}