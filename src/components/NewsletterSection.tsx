import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 lg:p-12 bg-white border-0 shadow-lg">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* 左側：コンテンツ */}
              <div className="space-y-6">
                <Badge 
                  variant="outline" 
                  className="border-[var(--brand-red)] text-[var(--brand-red)]"
                >
                  🚀 無料登録
                </Badge>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    最新情報を
                    <span style={{ color: 'var(--brand-red)' }}>お届け</span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground">
                    週2回配信のニュースレターで、AI・マーケティング業界の
                    最新トレンドと実践的なインサイトを無料でお受け取りください。
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">業界専門家による分析記事</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">最新のAI技術とツール情報</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">成功事例とベストプラクティス</span>
                  </div>
                </div>
              </div>

              {/* 右側：フォーム */}
              <div className="space-y-6">
                {!isSubscribed ? (
                  <>
                    <div className="text-center lg:text-left">
                      <Mail className="h-12 w-12 text-[var(--brand-red)] mx-auto lg:mx-0 mb-4" />
                      <h3 className="text-xl font-bold mb-2">今すぐ登録</h3>
                      <p className="text-sm text-muted-foreground">
                        メールアドレスを入力して、最新情報を受け取りましょう
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                      <Button 
                        type="submit" 
                        className="w-full h-12 bg-[var(--brand-red)] hover:bg-[var(--brand-red-hover)] text-white"
                      >
                        無料で登録する
                      </Button>
                    </form>

                    <p className="text-xs text-muted-foreground text-center">
                      登録することで、
                      <a href="#" className="text-[var(--brand-red)] hover:underline">プライバシーポリシー</a>
                      に同意したものとします。
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">登録完了！</h3>
                    <p className="text-muted-foreground">
                      ご登録ありがとうございます。
                      まもなく確認メールをお送りします。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}