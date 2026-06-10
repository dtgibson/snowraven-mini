// Options React entry — mounts <Options/> into options.html's #root.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './globals.css';
import { Options } from './components/Options';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Options />
    </StrictMode>,
  );
}
