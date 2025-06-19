
"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Users, PlusCircle, Settings, CalendarDays, Stethoscope, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { UserNav } from '@/components/navigation/UserNav';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/patients', label: 'Patients', icon: Users },
  { href: '/dashboard/add-patient', label: 'Add Patient', icon: PlusCircle },
  { href: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
          <Stethoscope className="h-7 w-7 text-sidebar-primary-foreground" />
          <span className="font-headline text-sidebar-primary-foreground">DentalChart Pro</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-1 px-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Button
                asChild
                variant={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start text-base h-11",
                  (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                    ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground text-sidebar-foreground"
                )}
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-sidebar lg:block">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] bg-sidebar text-sidebar-foreground border-r-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            {/* Optional: Breadcrumbs or Page Title can go here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
