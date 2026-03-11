import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './router/AppRouter';
import AppErrorBoundary from './components/AppErrorBoundary';

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <AppRouter />
  </AppErrorBoundary>,
);
