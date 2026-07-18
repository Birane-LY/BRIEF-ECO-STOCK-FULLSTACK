import React, { createContext, useContext, useReducer, useCallback } from "react";
import api from "../services/api";

const DataContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "SET_WAREHOUSES":
      return { ...state, warehouses: action.payload };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    default:
      return state;
  }
}

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { warehouses: [], products: [] });

  const loadAll = useCallback(async () => {
    try {
      const [whRes, prodRes] = await Promise.all([
        api.get("/api/warehouses/"),
        api.get("/api/produits/"),
      ]);
      dispatch({ type: "SET_WAREHOUSES", payload: whRes.data || [] });
      dispatch({ type: "SET_PRODUCTS", payload: prodRes.data || [] });
    } catch (err) {
      console.error("DataProvider loadAll error:", err);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await api.get("/api/produits/");
      dispatch({ type: "SET_PRODUCTS", payload: res.data || [] });
    } catch (err) {
      console.error("refreshProducts error:", err);
    }
  }, []);

  return (
    <DataContext.Provider value={{ ...state, loadAll, refreshProducts, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};