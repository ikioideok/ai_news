import { Card } from "./ui/card";
import { TrendingUp, Users, BookOpen, Award } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "1,200+",
    label: "専門記事",
    description: "AI・マーケティング分野の深いインサイト"
  },
  {
    icon: Users,
    value: "25,000+",
    label: "読者数",
    description: "業界のプロフェッショナルが愛読"
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "満足度",
    description: "読者による高い評価を獲得"
  },
  {
    icon: Award,
    value: "50+",
    label: "専門家",
    description: "第一線で活躍する寄稿者ネットワーク"
  }
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">
            信頼される<span style={{ color: 'var(--brand-red)' }}>メディア</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            業界をリードする専門家と読者に支持される、
            AI Marketing Newsの実績をご紹介します
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 group border-0 shadow-md">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-[var(--brand-red)]/10 rounded-lg flex items-center justify-center mx-auto group-hover:bg-[var(--brand-red)]/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-[var(--brand-red)]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-[var(--brand-red)]">
                    {stat.value}
                  </h3>
                  <h4 className="font-semibold text-lg">
                    {stat.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}