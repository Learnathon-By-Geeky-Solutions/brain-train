import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "@/components/ui/provider";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import RecipeCardContainer from './components/RecipeCardContainer/RecipeCardContainer';
import RecipeDetails from './components/RecipeDetails/RecipeDetails';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        {/* <App /> */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  </StrictMode>
)
