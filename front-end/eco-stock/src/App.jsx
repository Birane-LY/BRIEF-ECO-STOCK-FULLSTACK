import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Warehouses from "./pages/Warehouses"; // Ton composant avec la grille des 6 entrepôts
import WarehouseDetails from "./pages/WarehouseDetails"; // Ton composant détails + tiroir produit
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <BrowserRouter>
      {/* Provide Auth Context state down the entire React component rendering tree */}
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/produits" element={<Product />} />
          
          {/* NOUVELLES ROUTES CONFIGURÉES POUR L'INTÉGRATION */}
          <Route path="/entrepots" element={<Warehouses />} />
          <Route path="/entrepots/:id" element={<WarehouseDetails />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;