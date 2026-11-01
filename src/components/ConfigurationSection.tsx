import React, { useState } from 'react';
import {
  Settings,
  Sun,
  Moon,
  Palette,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Send,
  Lock,
  CheckCircle2,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AccountType } from '../types';

export const ConfigurationSection: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    themeMode,
    setThemeMode,
    primaryButtonColor,
    setPrimaryButtonColor,
    themeGradient,
    themeBannerGradient,
    upgradeToPremiumFan,
    requestCeoUpgrade,
    ceoRequests,
    approveCeoRequest,
    ceosList,
    currentUser,
    showToast
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<AccountType>(userProfile.accountType);
  const [selectedCeoId, setSelectedCeoId] = useState<string>(ceosList[0]?.id || 'ceo-miki');
  const [ceoRequestReason, setCeoRequestReason] = useState<string>('');

  const currentRole = userProfile.accountType;
  const isPrivilegedUser =
    currentRole === 'admin' ||
    currentRole === 'artista' ||
    currentRole === 'premium_fan';

  // Standard user fixed colors: Azul, Verde, Amarillo, Rojo, Gris
  const standardColorChoices = [
    { name: 'Azul', hex: '#2563eb' },
    { name: 'Verde', hex: '#16a34a' },
    { name: 'Amarillo', hex: '#eab308' },
    { name: 'Rojo', hex: '#dc2626' },
    { name: 'Gris', hex: '#475569' }
  ];

  const handleRoleSelection = (role: AccountType) => {
    setSelectedRole(role);
  };

  const handleApplyRoleChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'fan') {
      updateProfile({ accountType: 'fan' });
      showToast('Cuenta cambiada a Fan Estándar.');
      return;
    }

    if (selectedRole === 'premium_fan') {
      upgradeToPremiumFan();
      return;
    }

    if (selectedRole === 'artista' || selectedRole === 'admin') {
      // Solicitar permiso a un CEO sin clave
      if (!ceoRequestReason.trim()) {
        showToast('Por favor escribe el motivo o propuesta de tu postulación.');
        return;
      }
      requestCeoUpgrade(selectedCeoId, selectedRole, ceoRequestReason.trim());
      setCeoRequestReason('');
    }
  };

  const pendingRequestsForUser = ceoRequests.filter((r) => r.username === currentUser);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-400" /> Página de Configuración General
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Personaliza el tema, color de los botones, membresía y permisos de cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PANEL 1: TEMA Y COLOR DE BOTONES DE LA PÁGINA */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Palette className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Apariencia y Colores de Botones
            </h3>
          </div>

          {/* Dark / Light Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Modo de Interfaz:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                  themeMode === 'dark'
                    ? 'border-indigo-500 bg-indigo-500/20 text-white shadow'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" /> Modo Oscuro
              </button>

              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                  themeMode === 'light'
                    ? 'border-indigo-500 bg-indigo-500/20 text-white shadow'
                    : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-400" /> Modo Claro
              </button>
            </div>
          </div>

          {/* Color de los botones de la página */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Color de los Botones de la Página:
              </label>
              {isPrivilegedUser ? (
                <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full">
                  Color Picker Ilimitado VIP
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  Opciones estándar
                </span>
              )}
            </div>

            {/* Standard Color Options (Azul, Verde, Amarillo, Rojo, Gris) */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {standardColorChoices.map((c) => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setPrimaryButtonColor(c.hex)}
                  className={`py-2 px-1 rounded-xl text-[11px] font-bold text-white transition flex flex-col items-center gap-1 border ${
                    primaryButtonColor === c.hex
                      ? 'ring-2 ring-white scale-105 border-white shadow'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  <span className="w-3 h-3 rounded-full bg-white/30" />
                  {c.name}
                </button>
              ))}
            </div>

            {/* Custom Color Picker: ONLY for Premium Fan, Artista, Admin as requested! */}
            {isPrivilegedUser ? (
              <div className="p-3 bg-slate-800/70 border border-indigo-500/30 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Selector de Color Personalizado:
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Cualquier color hexadecimal libre
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryButtonColor}
                    onChange={(e) => setPrimaryButtonColor(e.target.value)}
                    className="w-12 h-9 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-indigo-300 uppercase">
                    {primaryButtonColor}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic mt-1">
                🔒 El selector de color personalizado completo (Color Picker) se desbloquea con membresía <strong>Premium Fan (10,000 Coins)</strong>, Artista o Administrador.
              </p>
            )}

            {/* Live preview button & banner */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Vista previa de botón y banner con degradado:
              </span>
              <button
                type="button"
                className="theme-btn w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition"
                style={{ background: themeGradient }}
              >
                Botón Principal ({primaryButtonColor})
              </button>
              <div
                style={{ background: themeBannerGradient }}
                className="theme-banner w-full p-3.5 rounded-xl text-xs font-bold text-white shadow-md border border-white/20 flex items-center justify-between"
              >
                <div>
                  <span className="block font-extrabold text-sm text-white">Banner Degradado Dinámico</span>
                  <span className="text-[10px] text-white/80">Se adapta automáticamente al color de botones</span>
                </div>
                <span className="text-[10px] bg-black/40 px-2 py-1 rounded-lg font-mono text-amber-300 border border-white/20">
                  {primaryButtonColor}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: TIPO DE CUENTA Y SOLICITUD A CEO */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Tipo de Cuenta & Membresía
            </h3>
          </div>

          <form onSubmit={handleApplyRoleChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Seleccionar Modo de Cuenta:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Fan Estándar */}
                <div
                  onClick={() => handleRoleSelection('fan')}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    selectedRole === 'fan'
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Fan Estándar</span>
                    {currentRole === 'fan' && (
                      <span className="text-[9px] text-emerald-400 font-bold">ACTUAL</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Comunidad, foros y compras.</p>
                </div>

                {/* Premium Fan */}
                <div
                  onClick={() => handleRoleSelection('premium_fan')}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    selectedRole === 'premium_fan'
                      ? 'border-amber-500 bg-amber-500/20'
                      : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Premium Fan
                    </span>
                    {currentRole === 'premium_fan' && (
                      <span className="text-[9px] text-emerald-400 font-bold">ACTUAL</span>
                    )}
                  </div>
                  <span className="text-[10px] text-amber-400 font-semibold block mt-1">
                    10,000 Coins
                  </span>
                </div>

                {/* Artista */}
                <div
                  onClick={() => handleRoleSelection('artista')}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    selectedRole === 'artista'
                      ? 'border-pink-500 bg-pink-500/20'
                      : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-pink-300">Artista Oficial</span>
                    {currentRole === 'artista' && (
                      <span className="text-[9px] text-emerald-400 font-bold">ACTUAL</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Vía Permiso de CEO
                  </span>
                </div>

                {/* Administrador */}
                <div
                  onClick={() => handleRoleSelection('admin')}
                  className={`p-3 rounded-2xl border cursor-pointer transition ${
                    selectedRole === 'admin'
                      ? 'border-cyan-500 bg-cyan-500/20'
                      : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-cyan-300">Administrador</span>
                    {currentRole === 'admin' && (
                      <span className="text-[9px] text-emerald-400 font-bold">ACTUAL</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Vía Permiso de CEO
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Fan purchase info */}
            {selectedRole === 'premium_fan' && currentRole !== 'premium_fan' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1 text-slate-300">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <Coins className="w-4 h-4" /> Desbloquear membresía Premium Fan (10,000 Coins)
                </div>
                <p className="text-[11px]">
                  Saldo actual: <strong>{userProfile.coins.toLocaleString()} Coins</strong>.
                  Incluye personalización de colores ilimitada, regalos para artistas y prioridad en foros.
                </p>
              </div>
            )}

            {/* SOLICITAR PERMISO A UN CEO (SIN CLAVE COMO SE PIDIÓ) */}
            {(selectedRole === 'artista' || selectedRole === 'admin') && currentRole !== selectedRole && (
              <div className="p-4 bg-slate-800/80 border border-indigo-500/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <UserCheck className="w-4 h-4" /> Solicitar Permiso a un CEO
                </div>
                <p className="text-[11px] text-slate-400">
                  Ya no se requiere contraseña para cambiar de modo. Envía tu propuesta directamente al CEO evaluador de tu elección.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Seleccionar CEO:
                  </label>
                  <select
                    value={selectedCeoId}
                    onChange={(e) => setSelectedCeoId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    {ceosList.map((ceo) => (
                      <option key={ceo.id} value={ceo.id}>
                        {ceo.name} — {ceo.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Motivo o justificación de tu solicitud:
                  </label>
                  <textarea
                    value={ceoRequestReason}
                    onChange={(e) => setCeoRequestReason(e.target.value)}
                    placeholder="Describe tu propuesta, especialidad artística o cargo administrativo..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white min-h-[70px]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  style={{ background: themeGradient }}
                  className="theme-btn w-full py-2.5 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar Solicitud al CEO
                </button>
              </div>
            )}

            {/* Standard submit for Fan or Premium Fan */}
            {selectedRole !== 'artista' && selectedRole !== 'admin' && (
              <button
                type="submit"
                style={{ background: themeGradient }}
                className="theme-btn w-full py-2.5 text-white font-bold rounded-xl text-xs transition shadow cursor-pointer"
              >
                Aplicar Modo de Cuenta
              </button>
            )}
          </form>

          {/* Pending CEO Requests */}
          {pendingRequestsForUser.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Tus solicitudes enviadas a CEOs:
              </span>
              {pendingRequestsForUser.map((req) => (
                <div
                  key={req.id}
                  className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white capitalize">{req.requestedRole}</span>
                    <span className="text-[10px] text-slate-400 block">
                      Enviada a: {req.ceoName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        req.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {req.status === 'approved' ? 'Aprobada ✓' : 'En revisión'}
                    </span>
                    {/* Simulated immediate approval for demo testing */}
                    {req.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => approveCeoRequest(req.id)}
                        className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-semibold"
                        title="Simular aprobación por el CEO"
                      >
                        Aprobar (CEO)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
