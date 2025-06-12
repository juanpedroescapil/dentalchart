"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-background to-accent/30">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
      <p className="mt-6 text-xl font-semibold text-foreground">Loading DentalChart Pro...</p>
    </div>
  );
}
