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
import Login from './pages/Login';
import AccessLogs from './pages/AccessLogs';
import { ProductProvider } from './context/ProductContext';
import { SalesProvider } from './context/SalesContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProductProvider>
          <SalesProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route
                    path="sales"
                    element={
                      <PrivateRoute>
                        <SalesEntry />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="access-logs"
                    element={
                      <PrivateRoute>
                        <AccessLogs />
                      </PrivateRoute>
                    }
                  />
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
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
