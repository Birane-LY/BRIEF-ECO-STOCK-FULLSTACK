import React, { useState } from "react";
import { Store, ShieldCheck, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  // Extract context login handler trigger
  const { login } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    let isValid = true;
    let currentErrors = { email: "", password: "" };

    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    
    if (!email) {
      currentErrors.email = "L'adresse email est requise.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      currentErrors.email = "L'email doit commencer par une lettre et avoir un format valide.";
      isValid = false;
    }

    if (!password) {
      currentErrors.password = "Le mot de passe est requis.";
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      currentErrors.password = "Le mot de passe doit contenir au moins 8 caractères, incluant des lettres et des chiffres.";
      isValid = false;
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Calls global authentication handler context with verified payloads
      login(email);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#f4f6f4] relative overflow-hidden font-sans select-none">
      <div className="absolute w-[500px] h-[500px] left-[-150px] top-[-150px] bg-[#2f5dff] opacity-[0.08] rounded-full blur-[100px]" />
      <div className="absolute w-[400px] h-[400px] right-[-100px] bottom-[-100px] bg-[#0fa968] opacity-[0.05] rounded-full blur-[120px]" />
      <div className="w-full max-w-[440px] bg-white rounded-[32px] border border-[#e1e6e1] p-10 flex flex-col items-stretch shadow-[0px_20px_50px_rgba(16,20,26,0.04)] relative z-10 mx-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="text-white bg-[#2F5DFF] p-2 rounded-xl shadow-lg shadow-[#2F5DFF]/30">
            <Store className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-tight text-[#10141A]">
              EcoStock
            </h1>
            <p className="text-[9px] text-[#96A099] font-bold tracking-widest uppercase mt-0.5">
              Dons alimentaires • Logistique
            </p>
          </div>
        </div>

        {/* Panel Titles */}
        <div className="space-y-1.5 mb-6">
          <h2 className="text-2xl font-black tracking-tight text-[#10141A]">
            Connexion sécurisée
          </h2>
          <p className="text-xs font-semibold text-[#5c665f]">
            Accédez à votre centre de pilotage logistique.
          </p>
        </div>

        {/* Authentication Form Block */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#5c665f] tracking-wide">
              Email professionnel
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              placeholder="vous@ecostock.sn"
              className={`w-full h-11 px-4 text-sm font-semibold bg-[#fafbfa] border rounded-xl text-[#10141a] placeholder-[#96a099] focus:outline-none focus:bg-white transition-all duration-150 ${
                errors.email ? "border-red-500 focus:border-red-500" : "border-[#e1e6e1] focus:border-[#2f5dff]"
              }`}
            />
            {errors.email && (
              <div className="flex items-center gap-1.5 text-red-600 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="text-[11px] font-bold tracking-wide">{errors.email}</span>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-[#5c665f] tracking-wide">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              placeholder="••••••••"
              className={`w-full h-11 px-4 text-sm font-semibold bg-[#fafbfa] border rounded-xl text-[#10141a] placeholder-[#96a099] focus:outline-none focus:bg-white transition-all duration-150 ${
                errors.password ? "border-red-500 focus:border-red-500" : "border-[#e1e6e1] focus:border-[#2f5dff]"
              }`}
            />
            {errors.password && (
              <div className="flex items-center gap-1.5 text-red-600 mt-0.5">
                <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="text-[11px] font-bold tracking-wide">{errors.password}</span>
              </div>
            )}
          </div>

          {/* Action Submission Button */}
          <button
            type="submit"
            className="w-full h-11 bg-[#2f5dff] hover:bg-[#1e4be6] active:scale-[0.98] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#2f5dff]/20 transition-all duration-150 mt-2"
          >
            <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
            <span>Se connecter</span>
          </button>
        </form>
      </div>
    </div>
  );
}