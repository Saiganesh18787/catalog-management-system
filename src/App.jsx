import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import ProductDetails from './pages/ProductDetails';
import Calendar from './pages/Calendar';
import SalesEntry from './pages/SalesEntry';
import Settings from './pages/Settings';
import { ProductProvider } from './context/ProductContext';
import { SalesProvider } from './context/SalesContext'; // Added import for SalesProvider
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ProductProvider>
        <SalesProvider> {/* Wrapped with SalesProvider */}
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} /> {/* Changed root route */}
                <Route path="dashboard" element={<Dashboard />} /> {/* Added dashboard route */}
                <Route path="calendar" element={<Calendar />} />
                <Route path="sales" element={<SalesEntry />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="products/:id/edit" element={<ProductForm />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </SalesProvider>
      </ProductProvider>
    </ErrorBoundary>
  );
}

export default App;
