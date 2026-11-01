import React from 'react';
import {
  Menu,
  Music,
  MessageSquare,
  Mic,
  MessageCircle,
  Star,
  Store,
  Coins,
  Search,
  LogOut,
  Bell,
  CreditCard,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AvatarWithFrame } from './AvatarWithFrame';
import { UserBadges } from './UserBadges';

export type AppSection =
  | 'foros'
  | 'audiciones'
  | 'chats'
  | 'fans'
  | 'tienda'
  | 'idcard'
  | 'configuracion'
  | 'customize';

interface NavbarProps {
  currentSection: AppSection;
  onSelectSection: (section: AppSection) => void;
  onOpenSidebar: () => void;
  onOpenCoinsModal: () => void;
  onOpenSearchModal: () => void;
  onOpenNotificationsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  onOpenSidebar,
  onOpenCoinsModal,
  onOpenSearchModal,
  onOpenNotificationsModal
}) => {
  const {
    userProfile,
    fanClubs,
    notifications,
    currentUser,
    themeMode,
    setThemeMode,
    themeGradient,
    primaryButtonColor,
    logout
  } = useApp();

  const isTraineeOrArtist =
    userProfile.accountType === 'trainee' || userProfile.accountType === 'artista';

  const unreadNotifsCount = notifications.filter(
    (n) => n.recipient === currentUser && !n.read
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 shadow-md">
      {/* Left Menu & Brand */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Menú de cuenta"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => onSelectSection('foros')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div
            style={{ background: themeGradient }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow"
          >
            <Music className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-white hidden md:inline">
            YM-ki <span style={{ color: primaryButtonColor }}>Web</span>
          </span>
        </div>
      </div>

      {/* Center Navigation Links: Icons only by default, expands on hover as requested */}
      <nav className="flex items-center gap-1.5 overflow-visible py-1 px-1">
        {/* Foros */}
        <button
          onClick={() => onSelectSection('foros')}
          style={currentSection === 'foros' ? { background: themeGradient } : undefined}
          className={`group relative flex items-center h-9 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer ${
            currentSection === 'foros'
              ? 'theme-btn text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Foros Comunitarios"
        >
          <MessageSquare className="w-4 h-4 flex-shrink-0" />
          <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5">
            Foros
          </span>
        </button>

        {/* Audiciones */}
        <button
          onClick={() => onSelectSection('audiciones')}
          style={currentSection === 'audiciones' ? { background: themeGradient } : undefined}
          className={`group relative flex items-center h-9 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer ${
            currentSection === 'audiciones'
              ? 'theme-btn text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Centro de Audiciones"
        >
          <Mic className="w-4 h-4 flex-shrink-0" />
          <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5">
            Audiciones
          </span>
        </button>

        {/* Chats */}
        <button
          onClick={() => onSelectSection('chats')}
          style={currentSection === 'chats' ? { background: themeGradient } : undefined}
          className={`group relative flex items-center h-9 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer ${
            currentSection === 'chats'
              ? 'theme-btn text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Chats y Grupos"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5">
            Chats
          </span>
        </button>

        {/* Fans */}
        <button
          onClick={() => onSelectSection('fans')}
          style={currentSection === 'fans' ? { background: themeGradient } : undefined}
          className={`group relative flex items-center h-9 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer ${
            currentSection === 'fans'
              ? 'theme-btn text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Clubes de Fans"
        >
          <Star className="w-4 h-4 flex-shrink-0" />
          <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5">
            Fans
          </span>
        </button>

        {/* Tienda */}
        <button
          onClick={() => onSelectSection('tienda')}
          style={currentSection === 'tienda' ? { background: themeGradient } : undefined}
          className={`group relative flex items-center h-9 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer ${
            currentSection === 'tienda'
              ? 'theme-btn text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Tienda & Outlet"
        >
          <Store className="w-4 h-4 flex-shrink-0" />
          <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5">
            Tienda
          </span>
        </button>

        {/* ID-CARD: ONLY VISIBLE FOR TRAINEES AND ARTISTAS AS REQUESTED */}
        {isTraineeOrArtist && (
          <button
            onClick={() => onSelectSection('idcard')}
            className={`group relative flex items-center h-9 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer ${
              currentSection === 'idcard'
                ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg'
                : 'text-amber-400 hover:text-white hover:bg-amber-500/10'
            }`}
            title="Mi ID-Card Oficial"
          >
            <CreditCard className="w-4 h-4 flex-shrink-0 text-amber-400 group-hover:text-white" />
            <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5">
              ID-Card
            </span>
          </button>
        )}

        {/* Configuración (now a full page) */}
        <button
          onClick={() => onSelectSection('configuracion')}
          className={`group relative flex items-center h-9 px-2.5 rounded-xl text-xs font-bold transition-all duration-300 ease-in-out cursor-pointer ${
            currentSection === 'configuracion'
              ? 'bg-indigo-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
          title="Página de Configuración"
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          <span className="max-w-0 opacity-0 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-1.5">
            Configuración
          </span>
        </button>
      </nav>

      {/* Right User Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Global Search */}
        <button
          onClick={onOpenSearchModal}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Buscar en la plataforma"
        >
          <Search className="w-4 h-4 text-indigo-400" />
        </button>

        {/* Theme quick toggle */}
        <button
          onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title={themeMode === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {themeMode === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotificationsModal}
          className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Bandeja de Notificaciones y Audiciones"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-pink-500 text-[10px] font-bold rounded-full flex items-center justify-center text-white animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Coins Wallet Badge */}
        <div
          onClick={onOpenCoinsModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 cursor-pointer transition select-none shadow-sm"
          title="Ver Cartera de YM-Coins"
        >
          <Coins className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-extrabold hidden sm:inline">
            {userProfile.coins.toLocaleString('es-MX')}
          </span>
        </div>

        {/* User Profile Button with Outer Avatar Frame */}
        <button
          onClick={() => onSelectSection('customize')}
          className="flex items-center gap-1.5 py-1 px-1.5 rounded-full hover:bg-slate-800 transition text-left"
          title="Personalizar perfil"
        >
          <AvatarWithFrame
            src={userProfile.avatar}
            size="sm"
            ringColor={userProfile.ringColor}
            transparentFrame={userProfile.transparentFrame}
          />
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
