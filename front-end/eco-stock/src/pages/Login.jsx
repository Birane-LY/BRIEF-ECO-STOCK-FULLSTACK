import React, { useEffect, useState } from "react";
import { Store, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (globalError) setGlobalError("");
  };

  const validateForm = () => {
    let currentErrors = { username: "", password: "" };
    let isValid = true;

    if (!credentials.username.trim()) {
      currentErrors.username = "Votre nom d'utilisateur est requis.";
      isValid = false;
    }
    if (!credentials.password) {
      currentErrors.password = "Le mot de passe est requis.";
      isValid = false;
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await api.post("/api/token/", {
        username: credentials.username.trim(),
        password: credentials.password,
      });
      
      login(credentials.username.trim(), {
        access: res.data.access,
        refresh: res.data.refresh,
      });
    } catch (error) {
      // Extraction et journalisation propre de l'erreur DRF
      const errorData = error.response?.data;
      console.error("Django authentication error details:", {
        status: error.response?.status,
        data: errorData,
        message: error.message
      });

      // Gestion fine du message selon le retour de Django Rest Framework
      if (errorData && typeof errorData === 'object') {
        if (errorData.detail) {
          setGlobalError(errorData.detail);
        } else if (errorData.non_field_errors) {
          setGlobalError(errorData.non_field_errors[0]);
        } else {
          setGlobalError("Identifiants incorrects ou compte inactif.");
        }
      } else {
        setGlobalError("Impossible de contacter le serveur d'authentification.");
      }
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#f4f6f4] relative overflow-hidden font-sans select-none">
      <div className="absolute w-[500px] h-[500px] left-[-150px] top-[-150px] bg-[#2f5dff] opacity-[0.08] rounded-full blur-[100px]" />
      <div className="absolute w-[400px] h-[400px] right-[-100px] bottom-[-100px] bg-[#0fa968] opacity-[0.05] rounded-full blur-[120px]" />
      
      <div className="w-full max-w-[440px] bg-white rounded-[32px] border border-[#e1e6e1] p-10 flex flex-col items-stretch shadow-[0px_20px_50px_rgba(16,20,26,0.04)] relative z-10 mx-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-white bg-[#2F5DFF] p-2 rounded-xl shadow-lg shadow-[#2F5DFF]/30"><Store className="h-5 w-5" /></div>
          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-tight text-[#10141A]">EcoStock</h1>
            <p className="text-[9px] text-[#96A099] font-bold tracking-widest uppercase mt-0.5">Dons alimentaires • Logistique</p>
          </div>
        </div>

        <div className="space-y-1.5 mb-6">
          <h2 className="text-2xl font-black tracking-tight text-[#10141A]">Connexion sécurisée</h2>
          <p className="text-xs font-semibold text-[#5c665f]">Accédez à votre centre de pilotage logistique.</p>
        </div>

        {/* Affichage d'une erreur globale si l'authentification échoue */}
        {globalError && (
          <div className="mb-4 p-3.5 bg-[#FDEAE8] border border-[#EF4438]/20 rounded-xl flex items-center gap-2.5 text-[#EF4438]">
            <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            <span className="text-xs font-bold leading-tight">{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Nom d'utilisateur" name="username" type="text" value={credentials.username} placeholder="birane" error={errors.username} onChange={handleChange} />
          <FormField label="Mot de passe" name="password" type="password" value={credentials.password} placeholder="••••••••" error={errors.password} onChange={handleChange} />

          <button type="submit" className="w-full h-11 bg-[#2f5dff] hover:bg-[#1e4be6] active:scale-[0.98] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#2f5dff]/20 transition-all duration-150 mt-2">
            <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
            <span>Se connecter</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// --- COMPOSANT DE FORMULAIRE LOCALISÉ ---

const FormField = ({ label, name, type, value, placeholder, error, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold text-[#5c665f] tracking-wide">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-11 px-4 text-sm font-semibold bg-[#fafbfa] border rounded-xl text-[#10141a] placeholder-[#96a099] focus:outline-none focus:bg-white transition-all duration-150 ${
        error ? "border-red-500 focus:border-red-500" : "border-[#e1e6e1] focus:border-[#2f5dff]"
      }`}
    />
    {error && (
      <div className="flex items-center gap-1.5 text-red-600 mt-0.5">
        <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
        <span className="text-[11px] font-bold tracking-wide">{error}</span>
      </div>
    )}
  </div>
);