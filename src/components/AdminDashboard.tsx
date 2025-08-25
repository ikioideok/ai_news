import { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3, 
  Calendar,
  Users,
  Settings,
  LogOut,
  Search,
  Filter,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Alert, AlertDescription } from "./ui/alert";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt: string;
  author: {
    name: string;
    avatar: string;
  };
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  onCreateArticle: () => void;
  onEditArticle: (id: string) => void;
}

export default function AdminDashboard({ 
  token, 
  onLogout, 
  onCreateArticle, 
  onEditArticle 
}: AdminDashboardProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchDashboardData();
  }, [token, page, statusFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch articles
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const articlesResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/admin/articles?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!articlesResponse.ok) {
        throw new Error('記事の取得に失敗しました');
      }

      const articlesData = await articlesResponse.json();
      setArticles(articlesData.articles);
      setPagination(articlesData.pagination);

      // Fetch metadata
      const metadataResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/admin/metadata`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (metadataResponse.ok) {
        const metadataData = await metadataResponse.json();
        setMetadata(metadataData.metadata);
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('この記事を削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/admin/articles/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setArticles(articles.filter(article => article.id !== id));
        fetchDashboardData(); // Refresh data
      } else {
        throw new Error('削除に失敗しました');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('削除に失敗しました');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '未設定';
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredArticles = articles.filter(article =>
    searchQuery === '' || 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !articles.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--brand-red)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">ダッシュボードを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                管理者ダッシュボード
              </h1>
              <p className="text-gray-600">AI Marketing News</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={onCreateArticle}
                className="bg-[var(--brand-red)] hover:bg-[var(--brand-red-hover)] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規記事
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    設定
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="articles">記事管理</TabsTrigger>
            <TabsTrigger value="analytics">分析</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {metadata && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">総記事数</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metadata.totalArticles}</div>
                    <p className="text-xs text-muted-foreground">
                      すべての記事
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">公開記事</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{metadata.publishedArticles}</div>
                    <p className="text-xs text-muted-foreground">
                      公開済み
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">下書き</CardTitle>
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{metadata.draftArticles}</div>
                    <p className="text-xs text-muted-foreground">
                      下書き状態
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">カテゴリ数</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metadata.categories.length}</div>
                    <p className="text-xs text-muted-foreground">
                      登録カテゴリ
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Recent articles */}
            <Card>
              <CardHeader>
                <CardTitle>最近の記事</CardTitle>
                <CardDescription>
                  最近更新された記事の一覧
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.slice(0, 5).map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium line-clamp-1">{article.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={article.status === 'published' ? 'default' : 'secondary'}
                          >
                            {article.status === 'published' ? '公開' : '下書き'}
                          </Badge>
                          <span className="text-sm text-gray-500">{article.category}</span>
                          <span className="text-sm text-gray-500">
                            {formatDate(article.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditArticle(article.id)}
                      >
                        編集
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="記事を検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        {statusFilter === 'all' ? 'すべて' : 
                         statusFilter === 'published' ? '公開' : '下書き'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                        すべて
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('published')}>
                        公開済み
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('draft')}>
                        下書き
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Articles Table */}
            <Card>
              <CardHeader>
                <CardTitle>記事一覧</CardTitle>
                <CardDescription>
                  {pagination.total}件の記事が見つかりました
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium line-clamp-1">{article.title}</h4>
                          {article.featured && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                              注目
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <Badge 
                            variant={article.status === 'published' ? 'default' : 'secondary'}
                          >
                            {article.status === 'published' ? '公開' : '下書き'}
                          </Badge>
                          <span>{article.category}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.views}
                          </span>
                          <span>{formatDate(article.updatedAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditArticle(article.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredArticles.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      記事が見つかりませんでした
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                      ページ {page} / {pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={!pagination.hasPrev}
                      >
                        前へ
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={!pagination.hasNext}
                      >
                        次へ
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>サイト分析</CardTitle>
                <CardDescription>
                  サイトのパフォーマンス統計
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {metadata && (
                    <>
                      <div>
                        <h4 className="font-medium mb-3">カテゴリ別記事数</h4>
                        <div className="space-y-2">
                          {metadata.categories.map((category: string) => {
                            const count = articles.filter(a => a.category === category).length;
                            return (
                              <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm">{category}</span>
                                <Badge variant="secondary">{count}</Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">人気タグ</h4>
                        <div className="flex flex-wrap gap-2">
                          {metadata.tags.slice(0, 10).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}