import { useState, useEffect } from "react";
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Image as ImageIcon, 
  Tag, 
  Settings,
  Globe,
  FileText,
  Hash
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Article {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  featured: boolean;
  status: 'draft' | 'published';
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterTitle: string;
    twitterDescription: string;
    twitterImage: string;
    keywords: string[];
  };
}

interface ArticleEditorProps {
  token: string;
  articleId?: string;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

const DEFAULT_CATEGORIES = [
  'AI技術',
  'マーケティング戦略',
  'カスタマーサポート',
  'データ分析',
  '事例研究',
  'トレンド',
  'インサイト'
];

const DEFAULT_AUTHOR = {
  name: 'AI Marketing News編集部',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
};

export default function ArticleEditor({ 
  token, 
  articleId, 
  onSave, 
  onCancel 
}: ArticleEditorProps) {
  const [article, setArticle] = useState<Article>({
    title: '',
    excerpt: '',
    content: '',
    category: DEFAULT_CATEGORIES[0],
    tags: [],
    author: DEFAULT_AUTHOR,
    image: '',
    featured: false,
    status: 'draft',
    seo: {
      metaTitle: '',
      metaDescription: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      keywords: []
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  // Auto-generate SEO fields when title/excerpt changes
  useEffect(() => {
    if (article.title && !article.seo.metaTitle) {
      setArticle(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaTitle: `${article.title} | AI Marketing News`,
          ogTitle: article.title,
          twitterTitle: article.title
        }
      }));
    }
  }, [article.title]);

  useEffect(() => {
    if (article.excerpt && !article.seo.metaDescription) {
      setArticle(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          metaDescription: article.excerpt,
          ogDescription: article.excerpt,
          twitterDescription: article.excerpt
        }
      }));
    }
  }, [article.excerpt]);

  useEffect(() => {
    if (article.image && !article.seo.ogImage) {
      setArticle(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          ogImage: article.image,
          twitterImage: article.image
        }
      }));
    }
  }, [article.image]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/admin/articles/${articleId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setArticle({
          ...data.article,
          seo: data.article.seo || article.seo
        });
      } else {
        throw new Error('記事の取得に失敗しました');
      }
    } catch (err) {
      console.error('Fetch article error:', err);
      setError(err instanceof Error ? err.message : '記事の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!article.title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    if (!article.content.trim()) {
      setError('本文を入力してください');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const articleData = {
        ...article,
        status,
        seo: {
          ...article.seo,
          keywords: article.seo.keywords.filter(k => k.trim() !== '')
        }
      };

      const url = articleId 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/admin/articles/${articleId}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/admin/articles`;

      const method = articleId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data.article);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存に失敗しました');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !article.seo.keywords.includes(keywordInput.trim())) {
      setArticle(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, keywordInput.trim()]
        }
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setArticle(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(k => k !== keyword)
      }
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--brand-red)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">記事を読み込み中...</p>
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
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
              <div>
                <h1 className="text-xl font-bold">
                  {articleId ? '記事編集' : '新規記事'}
                </h1>
                <p className="text-sm text-gray-500">
                  {article.status === 'published' ? '公開済み' : '下書き'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? '編集' : 'プレビュー'}
              </Button>
              
              <Button
                onClick={() => handleSave('draft')}
                disabled={saving}
                variant="outline"
              >
                下書き保存
              </Button>
              
              <Button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="bg-[var(--brand-red)] hover:bg-[var(--brand-red-hover)] text-white"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    保存中...
                  </div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    公開
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {previewMode ? (
          /* Preview Mode */
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h1>{article.title}</h1>
                <p className="lead">{article.excerpt}</p>
                {article.image && (
                  <img src={article.image} alt={article.title} className="w-full h-64 object-cover rounded-lg" />
                )}
                <div className="whitespace-pre-wrap">{article.content}</div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Edit Mode */
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList>
                <TabsTrigger value="content">
                  <FileText className="h-4 w-4 mr-2" />
                  コンテンツ
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  設定
                </TabsTrigger>
                <TabsTrigger value="seo">
                  <Globe className="h-4 w-4 mr-2" />
                  SEO
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">タイトル *</Label>
                      <Input
                        id="title"
                        value={article.title}
                        onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="記事のタイトルを入力"
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">要約 *</Label>
                      <Textarea
                        id="excerpt"
                        value={article.excerpt}
                        onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="記事の要約を入力（160文字以内推奨）"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {article.excerpt.length}/160文字
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="image">アイキャッチ画像URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="image"
                          value={article.image}
                          onChange={(e) => setArticle(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                        />
                        <Button variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      {article.image && (
                        <img 
                          src={article.image} 
                          alt="プレビュー" 
                          className="mt-2 w-32 h-20 object-cover rounded border"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>記事本文</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={article.content}
                      onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="記事の本文をMarkdown形式で入力..."
                      rows={20}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Markdown記法が使用できます。文字数: {article.content.length}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>カテゴリとタグ</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="category">カテゴリ</Label>
                        <Select 
                          value={article.category} 
                          onValueChange={(value) => setArticle(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DEFAULT_CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>タグ</Label>
                        <div className="flex gap-2 mb-2">
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="タグを入力"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          />
                          <Button type="button" onClick={addTag} size="sm">
                            <Tag className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>公開設定</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="featured">注目記事</Label>
                          <p className="text-sm text-gray-500">トップページで強調表示</p>
                        </div>
                        <Switch
                          id="featured"
                          checked={article.featured}
                          onCheckedChange={(checked) => setArticle(prev => ({ ...prev, featured: checked }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="author">著者名</Label>
                        <Input
                          id="author"
                          value={article.author.name}
                          onChange={(e) => setArticle(prev => ({ 
                            ...prev, 
                            author: { ...prev.author, name: e.target.value }
                          }))}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>基本SEO設定</CardTitle>
                    <CardDescription>
                      検索エンジン最適化のためのメタデータを設定します
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="metaTitle">メタタイトル</Label>
                      <Input
                        id="metaTitle"
                        value={article.seo.metaTitle}
                        onChange={(e) => setArticle(prev => ({ 
                          ...prev, 
                          seo: { ...prev.seo, metaTitle: e.target.value }
                        }))}
                        placeholder="SEO用のタイトル（60文字以内推奨）"
                      />
                      <p className="text-xs text-gray-500">
                        {article.seo.metaTitle.length}/60文字
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="metaDescription">メタディスクリプション</Label>
                      <Textarea
                        id="metaDescription"
                        value={article.seo.metaDescription}
                        onChange={(e) => setArticle(prev => ({ 
                          ...prev, 
                          seo: { ...prev.seo, metaDescription: e.target.value }
                        }))}
                        placeholder="検索結果に表示される説明文（160文字以内推奨）"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">
                        {article.seo.metaDescription.length}/160文字
                      </p>
                    </div>

                    <div>
                      <Label>SEOキーワード</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          placeholder="キーワードを入力"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        />
                        <Button type="button" onClick={addKeyword} size="sm">
                          <Hash className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {article.seo.keywords.map(keyword => (
                          <Badge key={keyword} variant="outline" className="cursor-pointer" onClick={() => removeKeyword(keyword)}>
                            {keyword} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Open Graph (Facebook)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="ogTitle">OGタイトル</Label>
                        <Input
                          id="ogTitle"
                          value={article.seo.ogTitle}
                          onChange={(e) => setArticle(prev => ({ 
                            ...prev, 
                            seo: { ...prev.seo, ogTitle: e.target.value }
                          }))}
                          placeholder="Facebook共有時のタイトル"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ogDescription">OG説明文</Label>
                        <Textarea
                          id="ogDescription"
                          value={article.seo.ogDescription}
                          onChange={(e) => setArticle(prev => ({ 
                            ...prev, 
                            seo: { ...prev.seo, ogDescription: e.target.value }
                          }))}
                          placeholder="Facebook共有時の説明文"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="ogImage">OG画像URL</Label>
                        <Input
                          id="ogImage"
                          value={article.seo.ogImage}
                          onChange={(e) => setArticle(prev => ({ 
                            ...prev, 
                            seo: { ...prev.seo, ogImage: e.target.value }
                          }))}
                          placeholder="Facebook共有時の画像URL"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Twitter Card</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="twitterTitle">Twitterタイトル</Label>
                        <Input
                          id="twitterTitle"
                          value={article.seo.twitterTitle}
                          onChange={(e) => setArticle(prev => ({ 
                            ...prev, 
                            seo: { ...prev.seo, twitterTitle: e.target.value }
                          }))}
                          placeholder="Twitter共有時のタイトル"
                        />
                      </div>

                      <div>
                        <Label htmlFor="twitterDescription">Twitter説明文</Label>
                        <Textarea
                          id="twitterDescription"
                          value={article.seo.twitterDescription}
                          onChange={(e) => setArticle(prev => ({ 
                            ...prev, 
                            seo: { ...prev.seo, twitterDescription: e.target.value }
                          }))}
                          placeholder="Twitter共有時の説明文"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="twitterImage">Twitter画像URL</Label>
                        <Input
                          id="twitterImage"
                          value={article.seo.twitterImage}
                          onChange={(e) => setArticle(prev => ({ 
                            ...prev, 
                            seo: { ...prev.seo, twitterImage: e.target.value }
                          }))}
                          placeholder="Twitter共有時の画像URL"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}