import { Separator } from "./ui/separator";
import { Twitter, Linkedin, Youtube, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ロゴとミッション */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-black text-sm font-bold">AI</span>
              </div>
              <h3 className="text-xl font-bold">
                AI Marketing <span style={{ color: 'var(--brand-red)' }}>News</span>
              </h3>
            </div>
            
            <p className="text-gray-300 max-w-md">
              AI時代のマーケティング革命を先導する、
              信頼できる情報源として業界のプロフェッショナルに
              価値ある洞察をお届けします。
            </p>
            
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-[var(--brand-red)] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--brand-red)] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--brand-red)] transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--brand-red)] transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* カテゴリー */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">カテゴリー</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  AI技術
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  マーケティング戦略
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  事例研究
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  業界トレンド
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  ツール・ソフトウェア
                </a>
              </li>
            </ul>
          </div>

          {/* 会社情報 */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">会社情報</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  私たちについて
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  編集方針
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  広告掲載
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[var(--brand-red)] transition-colors">
                  採用情報
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2025 AI Marketing News. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-[var(--brand-red)] transition-colors">
              プライバシーポリシー
            </a>
            <a href="#" className="text-gray-400 hover:text-[var(--brand-red)] transition-colors">
              利用規約
            </a>
            <a href="#" className="text-gray-400 hover:text-[var(--brand-red)] transition-colors">
              Cookie設定
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}