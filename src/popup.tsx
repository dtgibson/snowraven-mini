// Popup React entry — mounts <Popup/> (the orchestrator) into popup.html's #root.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import { Popup } from './components/Popup';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Popup />
    </StrictMode>,
  );
}
