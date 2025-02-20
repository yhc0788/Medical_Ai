import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 꼭! Tailwind 지시자가 있는 CSS 파일을 import
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
