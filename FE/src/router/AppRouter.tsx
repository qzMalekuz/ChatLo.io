import { Suspense, lazy, useEffect, useState } from 'react';
import { ChatProvider } from '../context/ChatContext';

const App = lazy(() => import('../App'));
const LandingPage = lazy(() => import('../pages/LandingPage'));

function BootFallback() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-muted flex items-center justify-center">
      <p className="text-sm">Loading ChatLo.io...</p>
    </div>
  );
}

function normalizePath(pathname: string) {
  if (pathname === '/chat') return '/chat';
  if (pathname === '/') return '/';
  return '/';
}

export default function AppRouter() {
  const [pathname, setPathname] = useState(() => {
    try {
      return normalizePath(window.location.pathname);
    } catch {
      return '/';
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (window.localStorage.getItem('chatlo_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const onPopState = () => {
      try {
        setPathname(normalizePath(window.location.pathname));
      } catch {
        setPathname('/');
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('chatlo_theme', theme);
    } catch {
      // Storage may be unavailable in strict privacy contexts.
    }

    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const navigate = (path: '/' | '/chat') => {
    if (path === pathname) return;
    window.history.pushState({}, '', path);
    setPathname(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  if (pathname === '/chat') {
    return (
      <Suspense fallback={<BootFallback />}>
        <ChatProvider>
          <App theme={theme} onToggleTheme={toggleTheme} />
        </ChatProvider>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<BootFallback />}>
      <LandingPage onOpenChat={() => navigate('/chat')} theme={theme} onToggleTheme={toggleTheme} />
    </Suspense>
  );
}
