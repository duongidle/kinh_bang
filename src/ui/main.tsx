import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './design';
import './app.css';
import { registerSW } from 'virtual:pwa-register';
import { getThemePref, setThemePref } from './theme';

// PWA: cài như app, mở không cần mạng (K0.14)
registerSW({ immediate: true });

// Đặt chế độ sáng/tối đã chọn trước khi vẽ. Nút đổi nằm trong menu của thanh trên.
setThemePref(getThemePref());

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
