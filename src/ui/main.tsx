import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './app.css';
import { registerSW } from 'virtual:pwa-register';

// PWA: cài như app, mở không cần mạng (K0.14)
registerSW({ immediate: true });

const root = createRoot(document.getElementById('root')!);
if (import.meta.env.DEV && new URLSearchParams(location.search).has('design')) {
  // dynamic import để bản build không chứa trang xem thử
  import('./design/Preview').then(({ Preview }) =>
    root.render(
      <StrictMode>
        <Preview />
      </StrictMode>,
    ),
  );
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
