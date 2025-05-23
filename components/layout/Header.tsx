'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Menu, 
  User, 
  LogOut, 
  BookOpen, 
  Search, 
  X,
  ChevronDown
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AuthForms from '@/components/auth/AuthForms';
import ProfileDialog from '@/components/auth/ProfileDialog';
import LogoutDialog from '@/components/auth/LogoutDialog';

export default function Header() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  // Truncate login if too long
  const displayLogin = user?.login && user.login.length > 10
    ? `${user.login.substring(0, 10)}...`
    : user?.login;

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Knowledge<span className="text-orange-400">+</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/courses" className="hover:text-orange-400 transition-colors">
              Курсы
            </Link>
            <Link href="/search" className="hover:text-orange-400 transition-colors">
              Поиск
            </Link>
            {user && (
              <Link href="/create-course" className="hover:text-orange-400 transition-colors">
                Создать курс
              </Link>
            )}
          </nav>

          {/* Auth buttons for desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User size={18} />
                    <span>{displayLogin}</span>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
                    <User size={16} className="mr-2" /> Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsLogoutOpen(true)}>
                    <LogOut size={16} className="mr-2" /> Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Авторизация</DialogTitle>
                    </DialogHeader>
                    <AuthForms onSuccess={() => setIsAuthOpen(false)} />
                  </DialogContent>
                </Dialog>
                
                <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
                  <DialogTrigger asChild>
                    <Button>Регистрация</Button>
                  </DialogTrigger>
                </Dialog>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-semibold">Меню</span>
                  <Button variant="ghost" size="icon" onClick={closeMenu}>
                    <X />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Link href="/courses" 
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                    onClick={closeMenu}
                  >
                    <BookOpen size={18} />
                    <span>Курсы</span>
                  </Link>
                  
                  <Link href="/search" 
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                    onClick={closeMenu}
                  >
                    <Search size={18} />
                    <span>Поиск</span>
                  </Link>
                  
                  {user && (
                    <Link href="/create-course" 
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                      onClick={closeMenu}
                    >
                      <BookOpen size={18} />
                      <span>Создать курс</span>
                    </Link>
                  )}
                </div>
                
                <div className="mt-auto pt-6 border-t">
                  {user ? (
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start" 
                        onClick={() => {
                          setIsProfileOpen(true);
                          closeMenu();
                        }}
                      >
                        <User size={18} className="mr-2" />
                        <span>Профиль ({displayLogin})</span>
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive" 
                        onClick={() => {
                          setIsLogoutOpen(true);
                          closeMenu();
                        }}
                      >
                        <LogOut size={18} className="mr-2" />
                        <span>Выйти</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setIsAuthOpen(true);
                          closeMenu();
                        }}
                      >
                        Войти
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setIsAuthOpen(true);
                          closeMenu();
                        }}
                      >
                        Регистрация
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Auth Dialogs */}
      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Авторизация</DialogTitle>
          </DialogHeader>
          <AuthForms onSuccess={() => setIsAuthOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Профиль пользователя</DialogTitle>
          </DialogHeader>
          <ProfileDialog onClose={() => setIsProfileOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Выход из системы</DialogTitle>
          </DialogHeader>
          <LogoutDialog onClose={() => setIsLogoutOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}