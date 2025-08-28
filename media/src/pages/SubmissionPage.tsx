import { SimpleHeader } from "../components/SimpleHeader";
import { SimpleFooter } from "../components/SimpleFooter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

const SubmissionPage = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // For now, we'll just log the form data to the console.
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted:", data);
    alert("記事がコンソールに記録されました。実際の投稿機能は未実装です。");
  };

  return (
    <div className="min-h-screen bg-background">
      <SimpleHeader />
      <main className="w-full max-w-4xl mx-auto px-4 py-12">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>新規記事投稿</CardTitle>
              <CardDescription>新しい記事の情報を入力してください。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input id="title" name="title" placeholder="記事のタイトル" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">抜粋</Label>
                <Textarea id="excerpt" name="excerpt" placeholder="記事の短い説明" className="min-h-24" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">本文</Label>
                <Textarea id="body" name="body" placeholder="記事の本文をここに記述します..." className="min-h-64" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="author">著者</Label>
                  <Input id="author" name="author" placeholder="著者名" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ</Label>
                  <Input id="category" name="category" placeholder="例: AIマーケティング戦略" required />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="imageUrl">画像URL</Label>
                <Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.jpg" type="url" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">投稿する</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <SimpleFooter />
    </div>
  );
};

export default SubmissionPage;
