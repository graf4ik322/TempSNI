import React, { ReactNode } from 'react';
import { Moon, Sun, Image } from 'lucide-react';
import { useApp } from '../../stores/AppContext';
import { Button } from '../ui/Button';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { state, toggleTheme } = useApp();
  const { theme } = state;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Header */}
      <header
        className="border-b px-4 py-3"
        style={{
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.secondary,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent }}
            >
              <Image size={20} color="white" />
            </div>
            <h1 className="text-xl font-bold">TwchPlaceholder</h1>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={`Переключить на ${theme.name === 'light' ? 'темную' : 'светлую'} тему`}
            >
              {theme.name === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="border-t px-4 py-3 text-center text-sm"
        style={{
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.secondary,
          color: theme.colors.text + '80',
        }}
      >
        <p>
          TwchPlaceholder v1.0.0 - Frontend-only решение для создания placeholder
        </p>
      </footer>
    </div>
  );
}