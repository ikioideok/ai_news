import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, User, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ArticleCardProps {
  id?: string | number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  imageUrl: string;
  featured?: boolean;
  views?: number;
  tags?: string[];
}

export default function ArticleCard({
  id,
  title,
  excerpt,
  category,
  date,
  readTime,
  author,
  imageUrl,
  featured = false,
  views,
  tags = []
}: ArticleCardProps) {
  return (
    <Card className={`overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group ${
      featured ? 'ring-2 ring-[var(--brand-red)]/20' : ''
    }`}>
      <div className="relative">
        <ImageWithFallback
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge 
            className={`${
              featured 
                ? 'bg-[var(--brand-red)] text-white' 
                : 'bg-white/90 text-gray-900'
            }`}
          >
            {category}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-yellow-500 text-white">注目</Badge>
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readTime}
          </div>
          {views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {views.toLocaleString()}
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold leading-tight group-hover:text-[var(--brand-red)] transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-gray-300 text-gray-600 hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {author}
          </div>
          
          <Button 
            variant="link" 
            className="p-0 h-auto text-[var(--brand-red)] hover:text-[var(--brand-red-hover)] text-sm"
          >
            続きを読む →
          </Button>
        </div>
      </div>
    </Card>
  );
}