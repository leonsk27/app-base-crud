
"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, LogIn, LogOut, Users } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard },
  { href: '/products', label: 'Productos', icon: Package },
  { href: '/orders', label: 'Pedidos', icon: ShoppingCart },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-background text-foreground">Cargando...</div>;
  }
  
  if (!user && pathname !== '/login') {
     // Still loading or redirecting
    return <div className="flex items-center justify-center min-h-screen bg-background text-foreground">Redirigiendo a login...</div>;
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-sidebar text-sidebar-foreground" collapsible="icon">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Image src="https://placehold.co/40x40.png?text=MF" alt="Mercado Facil Logo" width={40} height={40} className="rounded-md" data-ai-hint="logo market"/>
            <span className="text-lg font-semibold text-sidebar-primary-foreground group-data-[collapsible=icon]:hidden">Mercado Facil</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    className="justify-start"
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className: "bg-primary text-primary-foreground" }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://placehold.co/40x40.png?text=${user?.name?.charAt(0) || 'U'}`} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">{user?.name}</span>
              <span className="text-xs text-sidebar-foreground/70">{user?.email}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2 group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 border-b bg-background sm:px-6">
          <div className="flex items-center gap-2">
             <SidebarTrigger className="md:hidden" />
             <h1 className="text-xl font-semibold text-foreground">
                {navItems.find(item => item.href === pathname)?.label || 'Mercado Facil'}
             </h1>
          </div>
          {/* Add any header actions here if needed */}
        </header>
        <main className="flex-1 p-4 overflow-auto sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
