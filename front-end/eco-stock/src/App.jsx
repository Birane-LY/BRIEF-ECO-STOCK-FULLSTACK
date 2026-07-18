import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Warehouses from "./pages/Warehouses";
import WarehouseDetails from "./pages/WarehouseDetails";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./routes/ProtectedRoute"; 

const App = () => {
  return (
    <BrowserRouter>
      {/* Authentication context is provided to the whole application */}
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public route: accessible by everyone */}
            <Route path="/login" element={<Login />} />

            {/* PRIVATE ROUTES: Protected by ProtectedRoute */}
    
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/produits"
              element={
                <ProtectedRoute>
                  <Product />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entrepots"
              element={
                <ProtectedRoute>
                  <Warehouses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entrepots/:id"
              element={
                <ProtectedRoute>
                  <WarehouseDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
