"use client";
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter }  from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || (!isLoading && isAuthenticated)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-accent/30">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-foreground">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-accent/30">
      <LoginForm />
    </div>
  );
}
