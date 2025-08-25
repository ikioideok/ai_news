import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Quote, Linkedin, Twitter } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const experts = [
  {
    id: 1,
    name: "山田 健太郎",
    title: "AI戦略コンサルタント",
    company: "デジタル・イノベーション社",
    avatar: "https://images.unsplash.com/photo-1716471361267-9bc5d3291fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWNoJTIwZXhwZXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU2MDk3MDcwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    insight: "2024年は生成AIの実用化元年でしたが、2025年はAIエージェントが主流になるでしょう。マーケティング自動化の精度が飛躍的に向上します。",
    specialty: "AI自動化"
  },
  {
    id: 2,
    name: "佐藤 美咲",
    title: "マーケティングディレクター",
    company: "グロース・ラボ",
    avatar: "https://images.unsplash.com/photo-1648747067003-0e4660db791f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTYwOTcwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    insight: "パーソナライゼーションの次のステップは「プレディクティブ・パーソナライゼーション」です。顧客が何を求めているかを事前に予測し、最適なタイミングでアプローチする時代が到来します。",
    specialty: "データ分析"
  },
  {
    id: 3,
    name: "李 智恵",
    title: "テクノロジーリサーチャー",
    company: "未来技術研究所",
    avatar: "https://images.unsplash.com/photo-1694375073673-fc3f0b706d8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHRlY2glMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU2MDk3MDc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    insight: "マルチモーダルAIの普及により、テキスト、音声、画像、動画を統合したマーケティングコンテンツの制作が主流になります。創造性とテクノロジーの境界が曖昧になっていく時代です。",
    specialty: "次世代AI"
  }
];

export default function ExpertInsightsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <Badge 
            variant="outline" 
            className="border-[var(--brand-red)] text-[var(--brand-red)]"
          >
            🎯 専門家の見解
          </Badge>
          
          <h2 className="text-3xl font-bold">
            業界<span style={{ color: 'var(--brand-red)' }}>エキスパート</span>の洞察
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI・マーケティング分野の第一線で活躍する専門家たちが、
            最新トレンドと未来への展望を語ります
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <Card 
              key={expert.id} 
              className="p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden border-0 shadow-lg"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* 背景装飾 */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[var(--brand-red)]/5 to-transparent rounded-bl-3xl" />
              
              <div className="space-y-4">
                {/* プロフィール */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <ImageWithFallback
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--brand-red)] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{expert.name}</h3>
                    <p className="text-sm text-muted-foreground">{expert.title}</p>
                    <p className="text-xs text-[var(--brand-red)]">{expert.company}</p>
                  </div>
                </div>

                {/* 専門分野 */}
                <div className="mb-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-[var(--brand-red)]/10 text-[var(--brand-red)] border-0"
                  >
                    {expert.specialty}
                  </Badge>
                </div>

                {/* インサイト */}
                <div className="relative">
                  <Quote className="h-6 w-6 text-[var(--brand-red)]/20 mb-2" />
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    "{expert.insight}"
                  </p>
                </div>

                {/* ソーシャルリンク */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <span className="text-xs text-muted-foreground">フォロー:</span>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors cursor-pointer">
                      <Linkedin className="h-3 w-3 text-blue-600" />
                    </div>
                    <div className="w-6 h-6 bg-sky-50 rounded-full flex items-center justify-center hover:bg-sky-100 transition-colors cursor-pointer">
                      <Twitter className="h-3 w-3 text-sky-600" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[var(--brand-red)]/5 to-[var(--brand-red)]/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">
              あなたも<span style={{ color: 'var(--brand-red)' }}>専門家</span>として参加しませんか？
            </h3>
            <p className="text-muted-foreground mb-4">
              AI・マーケティング分野の専門知識をお持ちの方の寄稿をお待ちしています
            </p>
            <button className="text-[var(--brand-red)] hover:text-[var(--brand-red-hover)] font-medium hover:underline">
              寄稿について詳しく見る →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}