import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import { isMockApiEnabled } from './lib/env';
import './styles/index.css';

async function bootstrap() {
  if (import.meta.env.DEV && isMockApiEnabled()) {
    const { startMockApi } = await import('./mocks/browser');
    await startMockApi();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

void bootstrap();
