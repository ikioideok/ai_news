import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Eye, Share2, Bookmark, Heart, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import SEOHead from "./SEOHead";
import { useRouter } from "../hooks/useRouter";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
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

interface ArticleDetailPageProps {
  slug: string;
}

export default function ArticleDetailPage({ slug }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch article
      const articleResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/articles/${slug}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!articleResponse.ok) {
        if (articleResponse.status === 404) {
          throw new Error('記事が見つかりません');
        }
        throw new Error('記事の取得に失敗しました');
      }

      const articleData = await articleResponse.json();
      setArticle(articleData.article);

      // Fetch related articles
      const relatedResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/articles/${slug}/related`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        setRelatedArticles(relatedData.articles);
      }

    } catch (err) {
      console.error('Fetch article error:', err);
      setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-bold my-3">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 my-1 list-disc">{line.slice(2)}</li>;
        }
        if (line.startsWith('```')) {
          return null; // Skip code block markers for now
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="my-3 leading-relaxed">{line}</p>;
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-24"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            ホームに戻る
          </Button>
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/')}>
              ホームに戻る
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${article.title} | AI Marketing News`}
        description={article.excerpt}
        keywords={article.tags}
        ogTitle={article.title}
        ogDescription={article.excerpt}
        ogImage={article.image}
        ogUrl={typeof window !== 'undefined' ? window.location.href : undefined}
        twitterTitle={article.title}
        twitterDescription={article.excerpt}
        twitterImage={article.image}
        canonicalUrl={typeof window !== 'undefined' ? window.location.href : undefined}
        articleData={{
          author: article.author.name,
          publishedTime: article.publishedAt,
          section: article.category,
          tags: article.tags
        }}
      />
      <div className="container py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          記事一覧に戻る
        </Button>

        {/* Article header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge 
                variant="secondary" 
                className="bg-[var(--brand-red)]/10 text-[var(--brand-red)] border-0"
              >
                {article.category}
              </Badge>
              {article.featured && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                  注目記事
                </Badge>
              )}
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-6">
              {article.title}
            </h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{article.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(article.publishedAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime}分で読める
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views.toLocaleString()}回閲覧
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                共有
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`flex items-center gap-2 ${isBookmarked ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                ブックマーク
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 ${isLiked ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                いいね
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate('/', { tag })}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </header>

          {/* Featured image */}
          <div className="mb-8">
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </div>

          {/* Article content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="leading-relaxed text-gray-800">
              {formatContent(article.content)}
            </div>
          </div>

          {/* Article footer */}
          <footer className="border-t pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">この記事が役に立ったら</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 ${isLiked ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  いいね
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                記事をシェア
              </Button>
            </div>
          </footer>
        </article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-4xl mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-8">関連記事</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card
                  key={relatedArticle.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 group"
                  onClick={() => navigate(`/article/${relatedArticle.slug}`)}
                >
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <Badge 
                      variant="secondary" 
                      className="mb-2 bg-[var(--brand-red)]/10 text-[var(--brand-red)] border-0"
                    >
                      {relatedArticle.category}
                    </Badge>
                    <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-[var(--brand-red)] transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {relatedArticle.readTime}分
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}