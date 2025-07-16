import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import Terms from './pages/Terms.tsx';
import Privacy from './pages/Privacy.tsx';
import About from './pages/About.tsx';
import Support from './pages/Support.tsx';
import Impact from './pages/Impact.tsx';
import CulturalTerms from './pages/CulturalTerms.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/terms',
    element: <Terms />,
  },
  {
    path: '/privacy',
    element: <Privacy />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/support',
    element: <Support />,
  },
  {
    path: '/impact',
    element: <Impact />,
  },
  {
    path: '/cultural-terms',
    element: <CulturalTerms />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);