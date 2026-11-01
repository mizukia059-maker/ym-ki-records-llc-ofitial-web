import React, { useState } from 'react';
import {
  UserCheck,
  Upload,
  Trash2,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Palette,
  ShieldAlert,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AvatarWithFrame } from './AvatarWithFrame';

interface ProfileCustomizeSectionProps {
  onBack: () => void;
}

export const ProfileCustomizeSection: React.FC<ProfileCustomizeSectionProps> = ({ onBack }) => {
  const {
    userProfile,
    updateProfile,
    removeFrame,
    canUploadGif,
    showToast
  } = useApp();

  const [nickname, setNickname] = useState(userProfile.nickname || userProfile.username);
  const [description, setDescription] = useState(userProfile.description || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatar);
  const [bannerUrl, setBannerUrl] = useState(userProfile.banner);
  const [ringColor, setRingColor] = useState(userProfile.ringColor || '#6366f1');
  const [transparentFrame, setTransparentFrame] = useState<string | null>(
    userProfile.transparentFrame
  );

  // Privileged fields (for Artista, Admin and Premium Fan)
  const isPrivilegedUser =
    userProfile.accountType === 'artista' ||
    userProfile.accountType === 'admin' ||
    userProfile.accountType === 'premium_fan';

  const [profileBgColor, setProfileBgColor] = useState(
    userProfile.profileBgColor || '#1e293b'
  );
  const [badgeAdminColor, setBadgeAdminColor] = useState(
    userProfile.badgeAdminColor || '#ec4899'
  );
  const [badgeVerifiedColor, setBadgeVerifiedColor] = useState(
    userProfile.badgeVerifiedColor || '#38bdf8'
  );
  const [animal, setAnimal] = useState(userProfile.animal || 'Zorro 🦊');
  const [allowMessages, setAllowMessages] = useState(
    userProfile.allowMessages !== false
  );

  // File upload with GIF restriction rule
  const handleImageFile = (
    file: File,
    target: 'avatar' | 'banner' | 'frame'
  ) => {
    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

    if (isGif) {
      if (!canUploadGif()) {
        showToast(
          'Los GIFs como banner o foto de perfil solo están permitidos para Administradores, Artistas o Foros Verificados. Las cuentas estándar no pueden adjuntar GIFs.'
        );
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'avatar') setAvatarUrl(reader.result);
        if (target === 'banner') setBannerUrl(reader.result);
        if (target === 'frame') setTransparentFrame(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      nickname: nickname.trim() || userProfile.username,
      description: description.trim(),
      avatar: avatarUrl,
      banner: bannerUrl,
      ringColor,
      transparentFrame,
      profileBgColor: isPrivilegedUser ? profileBgColor : userProfile.profileBgColor,
      badgeAdminColor: isPrivilegedUser ? badgeAdminColor : userProfile.badgeAdminColor,
      badgeVerifiedColor: isPrivilegedUser ? badgeVerifiedColor : userProfile.badgeVerifiedColor,
      animal: isPrivilegedUser ? animal.trim() : userProfile.animal,
      allowMessages: isPrivilegedUser ? allowMessages : userProfile.allowMessages
    });
    onBack();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-12 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" /> Personalizar Perfil y Marco
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Banner Preview & Upload */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Banner de Perfil:</span>
            {!canUploadGif() && (
              <span className="text-[10px] text-amber-400">GIFs exclusivos para Artistas/Admin</span>
            )}
          </label>
          <div
            className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center group"
            style={{ backgroundImage: `url("${bannerUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
              <label className="cursor-pointer px-4 py-2 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white rounded-xl text-xs font-semibold shadow transition flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" /> Cambiar Banner
                <input
                  type="file"
                  accept={canUploadGif() ? 'image/*' : 'image/png,image/jpeg,image/webp'}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f, 'banner');
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Avatar & Outer Frame Section */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="flex flex-col items-center gap-2">
            {/* Real Avatar with outer frame preview */}
            <AvatarWithFrame
              src={avatarUrl}
              size="2xl"
              ringColor={ringColor}
              transparentFrame={transparentFrame}
            />

            {/* Remove Frame button as requested: "tambien la opcion de eliminar marco" */}
            {transparentFrame && (
              <button
                type="button"
                onClick={() => {
                  setTransparentFrame(null);
                  removeFrame();
                }}
                className="mt-1 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Eliminar Marco
              </button>
            )}
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Foto de Perfil / Avatar:
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold shadow transition flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" /> Subir Nueva Foto
                  <input
                    type="file"
                    accept={canUploadGif() ? 'image/*' : 'image/png,image/jpeg,image/webp'}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageFile(f, 'avatar');
                    }}
                    className="hidden"
                  />
                </label>
                {!canUploadGif() && (
                  <span className="text-[10px] text-slate-400">
                    JPG/PNG (GIF para Artistas)
                  </span>
                )}
              </div>
            </div>

            {/* Frame upload: frame is placed OUTSIDE the avatar photo */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Marco Transparente (PNG exterior que rodea la foto):
              </label>
              <label className="cursor-pointer px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold shadow transition flex items-center gap-1.5 inline-flex">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Subir Marco PNG
                <input
                  type="file"
                  accept="image/png,image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f, 'frame');
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Ring Color */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Color del Anillo Exterior:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={ringColor}
                  onChange={(e) => setRingColor(e.target.value)}
                  className="w-10 h-8 rounded-lg cursor-pointer bg-slate-800 border border-slate-700"
                />
                <span className="text-xs text-slate-400">{ringColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre de Usuario:
            </label>
            <input
              type="text"
              value={userProfile.username}
              disabled
              className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nickname / Apodo Público:
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Descripción Personal:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe algo sobre tu talento, aficiones o música favorita..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white min-h-[80px]"
          />
        </div>

        {/* Privileged Customization for Artist, Admin or Premium Fan */}
        {isPrivilegedUser && (
          <div className="p-5 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 rounded-3xl space-y-4">
            <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Opciones Especiales (Artista / Administrador / Premium Fan VIP)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Color Fondo de Perfil:
                </label>
                <input
                  type="color"
                  value={profileBgColor}
                  onChange={(e) => setProfileBgColor(e.target.value)}
                  className="w-full h-9 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Color Insignia Corona/Mic:
                </label>
                <input
                  type="color"
                  value={badgeAdminColor}
                  onChange={(e) => setBadgeAdminColor(e.target.value)}
                  className="w-full h-9 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Color Insignia Verificado:
                </label>
                <input
                  type="color"
                  value={badgeVerifiedColor}
                  onChange={(e) => setBadgeVerifiedColor(e.target.value)}
                  className="w-full h-9 rounded-xl bg-slate-800 border border-slate-700 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Animal Representativo:
              </label>
              <input
                type="text"
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
                placeholder="Ej: Zorro 🦊, Lobo 🐺, Conejo 🐰..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="allow-messages-check"
                checked={allowMessages}
                onChange={(e) => setAllowMessages(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-800"
              />
              <label
                htmlFor="allow-messages-check"
                className="text-xs text-slate-300 cursor-pointer"
              >
                Permitir mensajes de fans pagados a través de mi club
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition shadow-xl flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Guardar Todos los Cambios
        </button>
      </form>
    </div>
  );
};
