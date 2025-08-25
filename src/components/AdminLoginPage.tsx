import { useState } from "react";
import { Lock, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminLoginPageProps {
  onLogin: (token: string) => void;
}

export default function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('パスワードを入力してください');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c8cbcb38/admin/login`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(data.token);
      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('接続エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--brand-red)] rounded-full mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            管理者ログイン
          </h1>
          <p className="text-gray-600">
            AI Marketing News 管理画面
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">ログイン</CardTitle>
            <CardDescription>
              管理者パスワードを入力してください
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  パスワード
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="管理者パスワードを入力"
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-[var(--brand-red)] rounded-lg"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[var(--brand-red)] hover:bg-[var(--brand-red-hover)] text-white rounded-lg font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ログイン中...
                  </div>
                ) : (
                  'ログイン'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 text-center">
                  <strong>デモ用パスワード:</strong> admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2024 AI Marketing News. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}