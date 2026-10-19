import React, { useState } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentPassword: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentPassword,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rememberSession, setRememberSession] = useState(true);

  if (!isOpen) return null;

  const OWNER_EMAIL = 'ebyzomsocial@gmail.com';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // Verify authorized owner email and password
    const isEmailValid = cleanEmail === OWNER_EMAIL;
    const isPasswordValid = cleanPassword === currentPassword.trim();

    if (isEmailValid && isPasswordValid) {
      setErrorMsg(null);
      setPasswordInput('');
      setEmailInput('');
      if (rememberSession) {
        localStorage.setItem('psm_admin_authenticated', 'true');
      } else {
        sessionStorage.setItem('psm_admin_authenticated', 'true');
      }
      onLoginSuccess();
    } else if (!isEmailValid) {
      setErrorMsg('Acceso no autorizado. Este correo no tiene permisos de administrador.');
    } else {
      setErrorMsg('Contraseña incorrecta. Solo el dueño autorizado puede acceder.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E4BEBA]/40 relative flex flex-col gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5B403D] hover:text-[#1B1B21] p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
          aria-label="Cerrar modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex flex-col items-center text-center gap-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FFDAD6] text-[#A20513] flex items-center justify-center font-bold shadow-xs">
            <span className="material-symbols-outlined text-[30px]">shield_person</span>
          </div>
          <h3 className="text-[18px] font-black text-[#1B1B21]">
            Acceso Exclusivo del Dueño
          </h3>
          <p className="text-[12px] text-[#5B403D]">
            Panel de administración privado de Piqueos San Miguel. Solo para el titular del negocio.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-[12px] font-medium text-center flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[#1B1B21] mb-1">
              Correo del Dueño:
            </label>
            <input
              type="email"
              required
              autoFocus
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="ebyzomsocial@gmail.com"
              className="w-full text-[13px] p-2.5 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#1B1B21] mb-1">
              Contraseña o PIN de Administrador:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setErrorMsg(null);
                }}
                placeholder="Ingresa tu clave privada..."
                className="w-full text-[13px] p-2.5 pr-10 rounded-xl border border-[#E4BEBA] focus:outline-none focus:ring-2 focus:ring-[#A20513]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-[11px] text-[#5B403D] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberSession}
              onChange={(e) => setRememberSession(e.target.checked)}
              className="rounded text-[#A20513] focus:ring-[#A20513]"
            />
            <span>Mantener sesión iniciada en este dispositivo</span>
          </label>

          <button
            type="submit"
            className="w-full mt-2 bg-[#A20513] hover:bg-[#C62828] text-white py-3 rounded-full font-bold text-[13px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">lock_open</span>
            Ingresar al Panel
          </button>
        </form>

        <div className="pt-2 border-t border-[#E4BEBA]/30 text-center">
          <p className="text-[11px] text-gray-400">
            🔒 Área protegida. Cualquier intento de acceso no autorizado queda bloqueado.
          </p>
        </div>
      </div>
    </div>
  );
};
