import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import ArticleCard from "./ArticleCard";
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useRouter } from "../hooks/useRouter";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
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
}

interface ArticlesSectionProps {
  searchQuery?: string;
  categoryFilter?: string;
  tagFilter?: string;
}

export default function ArticlesSection({ 
  searchQuery = '', 
  categoryFilter = 'all',
  tagFilter = '' 
}: ArticlesSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const { navigate } = useRouter();

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [searchQuery, categoryFilter, tagFilter, pagination.page]);

  useEffect(() => {
    // Reset page to 1 when filters change
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    } else {
      fetchArticles();
    }
  }, [searchQuery, categoryFilter, tagFilter]);

  useEffect(() => {
    // Fetch articles when page changes
    fetchArticles();
  }, [pagination.page]);

  const initializeData = async () => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/init`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
      if (tagFilter) params.append('tag', tagFilter);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/articles?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('記事の取得に失敗しました');
      }

      const data = await response.json();
      setArticles(data.articles);
      setPagination(data.pagination);

    } catch (err) {
      console.error('Fetch articles error:', err);
      setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasNext) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleArticleClick = (slug: string) => {
    navigate(`/article/${slug}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && articles.length === 0) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">
              最新の<span style={{ color: 'var(--brand-red)' }}>記事</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI・マーケティング業界の最新動向から実践的なノウハウまで、
              専門家による質の高いコンテンツをお届けします。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">エラーが発生しました</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchArticles}>再試行</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">
            最新の<span style={{ color: 'var(--brand-red)' }}>記事</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI・マーケティング業界の最新動向から実践的なノウハウまで、
            専門家による質の高いコンテンツをお届けします。
          </p>
        </div>

        {/* Results summary */}
        {(searchQuery || categoryFilter !== 'all' || tagFilter) && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                {pagination.total}件の記事が見つかりました
              </div>
              <div className="flex items-center gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    検索: "{searchQuery}"
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="bg-green-50 text-green-700">
                    カテゴリ: {categoryFilter}
                  </Badge>
                )}
                {tagFilter && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                    タグ: #{tagFilter}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">記事が見つかりませんでした</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || categoryFilter !== 'all' || tagFilter
                ? '検索条件を変更してお試しください。'
                : '記事がまだ投稿されていません。'}
            </p>
            {(searchQuery || categoryFilter !== 'all' || tagFilter) && (
              <Button 
                variant="outline"
                onClick={() => {
                  navigate('/');
                }}
              >
                すべての記事を見る
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Articles grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article.slug)}
                  className="cursor-pointer"
                >
                  <ArticleCard
                    id={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    category={article.category}
                    date={formatDate(article.publishedAt)}
                    readTime={`${article.readTime}分`}
                    author={article.author.name}
                    imageUrl={article.image}
                    featured={article.featured}
                    views={article.views}
                    tags={article.tags}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <div className="text-sm text-muted-foreground">
                  ページ {pagination.page} / {pagination.totalPages} ({pagination.total}件中)
                </div>
                
                {pagination.hasNext && (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="border-[var(--brand-red)] text-[var(--brand-red)] hover:bg-[var(--brand-red)] hover:text-white"
                  >
                    {loading ? '読み込み中...' : 'もっと見る'}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}