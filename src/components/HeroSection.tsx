import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function HeroSection() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左側：メインコンテンツ */}
          <div className="space-y-6">
            <Badge 
              variant="outline" 
              className="border-[var(--brand-red)] text-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white transition-colors"
            >
              🔥 トレンド
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                AI時代の
                <span style={{ color: 'var(--brand-red)' }} className="block">
                  マーケティング革命
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                最新のAI技術とマーケティング戦略に関する
                深いインサイトと実践的な情報をお届けします。
                業界のプロフェッショナルのための信頼できる情報源。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-[var(--brand-red)] hover:bg-[var(--brand-red-hover)] text-white"
              >
                最新記事を読む
              </Button>
              <Button variant="outline" size="lg">
                ニュースレター登録
              </Button>
            </div>
          </div>

          {/* 右側：特集記事カード */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">注目の記事</h2>
            
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1746608943132-065d1d4b3c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwdGVjaG5vbG9neSUyMG1hcmtldGluZ3xlbnwxfHx8fDE3NTYwOTY1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="AI Marketing Technology"
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[var(--brand-red)] text-white">特集</Badge>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    2025年8月25日
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    5分で読める
                  </div>
                </div>
                
                <h3 className="text-xl font-bold leading-tight group-hover:text-[var(--brand-red)] transition-colors">
                  生成AIがマーケティング業界に与える5つの革命的変化
                </h3>
                
                <p className="text-muted-foreground">
                  ChatGPTやMidjourneyなどの生成AI技術が、従来のマーケティング手法をどのように変革しているのかを詳しく解説します。
                </p>
                
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-[var(--brand-red)] hover:text-[var(--brand-red-hover)]"
                >
                  続きを読む →
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}