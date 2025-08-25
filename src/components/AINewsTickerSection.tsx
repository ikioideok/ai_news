import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Zap, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

const liveUpdates = [
  {
    id: 1,
    time: "2分前",
    type: "breaking",
    icon: Zap,
    title: "OpenAI、GPT-5の開発を正式発表",
    description: "次世代AIモデルの革新的機能を予告"
  },
  {
    id: 2,
    time: "15分前",
    type: "trending",
    icon: TrendingUp,
    title: "Google、Bard Pro版をリリース",
    description: "マーケター向け専用機能を搭載"
  },
  {
    id: 3,
    time: "32分前",
    type: "insight",
    icon: Sparkles,
    title: "AI広告最適化で売上200%向上",
    description: "大手EC企業の成功事例が話題に"
  },
  {
    id: 4,
    time: "1時間前",
    type: "breaking",
    icon: Zap,
    title: "Microsoft、AI統合Officeを発表",
    description: "ビジネス文書作成の革命が始まる"
  },
  {
    id: 5,
    time: "1時間前",
    type: "trending",
    icon: TrendingUp,
    title: "ChatGPT API利用料金が50%削減",
    description: "中小企業のAI導入が加速する見込み"
  }
];

const typeConfig = {
  breaking: {
    color: "text-[var(--brand-red)]",
    bg: "bg-[var(--brand-red)]/10",
    label: "速報"
  },
  trending: {
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "トレンド"
  },
  insight: {
    color: "text-green-600",
    bg: "bg-green-50",
    label: "インサイト"
  }
};

export default function AINewsTickerSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % liveUpdates.length);
        setIsAnimating(false);
      }, 200);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentUpdate = liveUpdates[currentIndex];
  const IconComponent = currentUpdate.icon;
  const config = typeConfig[currentUpdate.type as keyof typeof typeConfig];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-y border-gray-100 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-red)]/5 via-transparent to-blue-600/5"></div>
      
      <div className="container relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-[var(--brand-red)] rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-[var(--brand-red)] rounded-full animate-ping opacity-20"></div>
            </div>
            <h2 className="text-2xl font-bold">
              <span style={{ color: 'var(--brand-red)' }}>LIVE</span> AI業界速報
            </h2>
          </div>
          
          <Badge variant="outline" className="hidden sm:flex border-[var(--brand-red)] text-[var(--brand-red)] animate-pulse">
            🔴 リアルタイム更新中
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインニュース */}
          <div className="lg:col-span-2">
            <Card className={`p-8 transition-all duration-500 border-l-4 border-l-[var(--brand-red)] hover:shadow-2xl relative overflow-hidden ${isAnimating ? 'transform scale-98 opacity-80' : 'transform scale-100 opacity-100'}`}>
              {/* 背景グラデーション */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--brand-red)]/5 to-transparent rounded-bl-full"></div>
              
              <div className="flex items-start gap-6 relative">
                <div className={`p-3 rounded-xl ${config.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`h-6 w-6 ${config.color}`} />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant="secondary" 
                      className={`${config.bg} ${config.color} border-0 px-3 py-1`}
                    >
                      {config.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-medium">{currentUpdate.time}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold leading-tight hover:text-[var(--brand-red)] transition-colors cursor-pointer">
                    {currentUpdate.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {currentUpdate.description}
                  </p>
                  
                  <div className="flex items-center gap-2 pt-3 group cursor-pointer">
                    <span className="text-sm text-[var(--brand-red)] hover:text-[var(--brand-red-hover)] font-medium">
                      詳細を読む
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--brand-red)] group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* サイドニュース */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">
              その他の更新
            </h3>
            
            {liveUpdates
              .filter((_, index) => index !== currentIndex)
              .slice(0, 3)
              .map((update, sideIndex) => {
                const UpdateIcon = update.icon;
                const updateConfig = typeConfig[update.type as keyof typeof typeConfig];
                
                return (
                  <Card 
                    key={update.id} 
                    className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-[var(--brand-red)]/20"
                    style={{
                      animationDelay: `${sideIndex * 100}ms`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${updateConfig.bg} group-hover:scale-105 transition-transform`}>
                        <UpdateIcon className={`h-4 w-4 ${updateConfig.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 group-hover:text-[var(--brand-red)] transition-colors">
                          {update.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{update.time}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>

        {/* 進行インジケーター */}
        <div className="flex justify-center mt-8 gap-2">
          {liveUpdates.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-8 rounded-full transition-all duration-500 cursor-pointer hover:scale-110 ${
                index === currentIndex 
                  ? 'bg-[var(--brand-red)] shadow-md' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}