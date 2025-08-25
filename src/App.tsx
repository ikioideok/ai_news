import { useState, useEffect } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AINewsTickerSection from "./components/AINewsTickerSection";
import SearchSection from "./components/SearchSection";
import ArticlesSection from "./components/ArticlesSection";
import ArticleDetailPage from "./components/ArticleDetailPage";
import ExpertInsightsSection from "./components/ExpertInsightsSection";
import NewsletterSection from "./components/NewsletterSection";
import Footer from "./components/Footer";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminDashboard from "./components/AdminDashboard";
import ArticleEditor from "./components/ArticleEditor";
import SEOHead from "./components/SEOHead";
import { useRouter } from "./hooks/useRouter";

export default function App() {
  const { route, matchRoute, navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Check for stored admin token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setAdminToken(storedToken);
    }
  }, []);

  // Update filters from URL query parameters
  useEffect(() => {
    const query = route.query;
    setSearchQuery(query?.search || '');
    setCategoryFilter(query?.category || 'all');
    setTagFilter(query?.tag || '');
  }, [route.query]);

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleCreateArticle = () => {
    navigate('/admin/articles/new');
  };

  const handleEditArticle = (id: string) => {
    navigate(`/admin/articles/edit/${id}`);
  };

  const handleSaveArticle = () => {
    navigate('/admin');
  };

  // Admin routes
  const adminMatch = matchRoute('/admin', route.path);
  const adminDashboardMatch = route.path === '/admin';
  const adminNewArticleMatch = matchRoute('/admin/articles/new', route.path);
  const adminEditArticleMatch = matchRoute('/admin/articles/edit/:id', route.path);

  // Article detail route
  const articleMatch = matchRoute('/article/:slug', route.path);

  // Admin login page
  if (adminMatch.match && !adminToken) {
    return (
      <>
        <SEOHead 
          title="管理者ログイン | AI Marketing News"
          description="AI Marketing News管理画面へのログインページ"
        />
        <AdminLoginPage onLogin={handleAdminLogin} />
      </>
    );
  }

  // Admin dashboard
  if (adminDashboardMatch && adminToken) {
    return (
      <>
        <SEOHead 
          title="管理者ダッシュボード | AI Marketing News"
          description="AI Marketing News管理画面"
        />
        <AdminDashboard
          token={adminToken}
          onLogout={handleAdminLogout}
          onCreateArticle={handleCreateArticle}
          onEditArticle={handleEditArticle}
        />
      </>
    );
  }

  // Article editor - new
  if (adminNewArticleMatch.match && adminToken) {
    return (
      <>
        <SEOHead 
          title="新規記事作成 | AI Marketing News"
          description="新しい記事を作成する"
        />
        <ArticleEditor
          token={adminToken}
          onSave={handleSaveArticle}
          onCancel={() => navigate('/admin')}
        />
      </>
    );
  }

  // Article editor - edit
  if (adminEditArticleMatch.match && adminToken) {
    return (
      <>
        <SEOHead 
          title="記事編集 | AI Marketing News"
          description="記事を編集する"
        />
        <ArticleEditor
          token={adminToken}
          articleId={adminEditArticleMatch.params.id}
          onSave={handleSaveArticle}
          onCancel={() => navigate('/admin')}
        />
      </>
    );
  }

  // Article detail page
  if (articleMatch.match) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ArticleDetailPage slug={articleMatch.params.slug} />
        <Footer />
      </div>
    );
  }

  // Main page
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="AI Marketing News - AI・マーケティング業界の最新動向"
        description="AI・マーケティング業界の最新動向と実践的なノウハウを専門家がお届け。GPT-4、ChatGPT、マーケティング自動化など、最新のトレンドを詳しく解説します。"
        keywords={['AI', 'マーケティング', 'GPT-4', 'ChatGPT', 'マーケティング自動化', 'デジタルマーケティング', 'カスタマーサポート', 'コンテンツマーケティング']}
        ogTitle="AI Marketing News - AI・マーケティング業界の最新動向"
        ogDescription="AI・マーケティング業界の最新動向と実践的なノウハウを専門家がお届け"
        ogImage="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200"
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
      />
      <Header />
      <main>
        <HeroSection />
        <AINewsTickerSection />
        <SearchSection
          onSearch={setSearchQuery}
          onCategoryFilter={setCategoryFilter}
          onTagFilter={setTagFilter}
          currentQuery={searchQuery}
          currentCategory={categoryFilter}
          currentTag={tagFilter}
        />
        <ArticlesSection
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          tagFilter={tagFilter}
        />
        <ExpertInsightsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}