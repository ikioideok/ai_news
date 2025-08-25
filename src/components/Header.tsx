import { Button } from "./ui/button";
import { Search, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* ロゴ */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h1 className="text-xl font-bold">
            AI Marketing <span style={{ color: 'var(--brand-red)' }}>News</span>
          </h1>
        </div>

        {/* ナビゲーション */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-[var(--brand-red)] transition-colors">
            最新ニュース
          </a>
          <a href="#" className="text-sm font-medium hover:text-[var(--brand-red)] transition-colors">
            AI技術
          </a>
          <a href="#" className="text-sm font-medium hover:text-[var(--brand-red)] transition-colors">
            マーケティング
          </a>
          <a href="#" className="text-sm font-medium hover:text-[var(--brand-red)] transition-colors">
            事例研究
          </a>
          <a href="#" className="text-sm font-medium hover:text-[var(--brand-red)] transition-colors">
            インサイト
          </a>
        </nav>

        {/* 検索とメニュー */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}