import { useState, useEffect } from "react";
import { Search, X, Filter, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from '../hooks/useRouter';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onTagFilter: (tag: string) => void;
  currentCategory?: string;
  currentTag?: string;
  currentQuery?: string;
}

interface SearchResult {
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
}

export default function SearchSection({
  onSearch,
  onCategoryFilter,
  onTagFilter,
  currentCategory = 'all',
  currentTag = '',
  currentQuery = ''
}: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState(currentQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { navigate } = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    setSearchQuery(currentQuery);
  }, [currentQuery]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-c8cbcb38/categories`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-c8cbcb38/tags`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTags(data.tags);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-c8cbcb38/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    onSearch('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-8 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Search bar */}
          <div className="relative mb-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="記事を検索..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-12 pr-12 h-12 text-base border-2 border-gray-200 focus:border-[var(--brand-red)] rounded-lg shadow-sm"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>

            {/* Search results dropdown */}
            {showResults && (
              <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto shadow-lg border">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    検索中...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                        onClick={() => {
                          navigate(`/article/${result.slug}`);
                          setShowResults(false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={result.image}
                            alt={result.title}
                            className="w-16 h-12 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-[var(--brand-red)] transition-colors">
                              {result.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-[var(--brand-red)]/10 text-[var(--brand-red)] border-0"
                              >
                                {result.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(result.publishedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    検索結果が見つかりませんでした
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              フィルター:
            </div>

            {/* Category filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${currentCategory !== 'all' ? 'bg-[var(--brand-red)]/10 text-[var(--brand-red)] border-[var(--brand-red)]/20' : ''}`}
                >
                  {currentCategory === 'all' ? 'すべてのカテゴリ' : currentCategory}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onCategoryFilter('all')}>
                  すべてのカテゴリ
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category} 
                    onClick={() => onCategoryFilter(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tag filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${currentTag ? 'bg-[var(--brand-red)]/10 text-[var(--brand-red)] border-[var(--brand-red)]/20' : ''}`}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  {currentTag || 'タグを選択'}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-64 overflow-y-auto">
                <DropdownMenuItem onClick={() => onTagFilter('')}>
                  すべてのタグ
                </DropdownMenuItem>
                {tags.map((tag) => (
                  <DropdownMenuItem 
                    key={tag} 
                    onClick={() => onTagFilter(tag)}
                  >
                    #{tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear filters */}
            {(currentCategory !== 'all' || currentTag || currentQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onCategoryFilter('all');
                  onTagFilter('');
                  handleClearSearch();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                フィルターをクリア
              </Button>
            )}
          </div>

          {/* Active filters display */}
          {(currentCategory !== 'all' || currentTag || currentQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">適用中:</span>
              
              {currentQuery && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  検索: "{currentQuery}"
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 hover:bg-blue-100"
                    onClick={handleClearSearch}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {currentCategory !== 'all' && (
                <Badge variant="secondary" className="bg-green-50 text-green-700">
                  カテゴリ: {currentCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 hover:bg-green-100"
                    onClick={() => onCategoryFilter('all')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              
              {currentTag && (
                <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                  タグ: #{currentTag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 hover:bg-purple-100"
                    onClick={() => onTagFilter('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}