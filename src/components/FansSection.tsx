import React, { useState } from 'react';
import {
  Star,
  Users,
  Plus,
  Send,
  Lock,
  MessageCircle,
  Coins,
  ShieldAlert,
  Edit,
  Trash2,
  X,
  Palette
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AvatarWithFrame } from './AvatarWithFrame';
import { UserBadges } from './UserBadges';
import { FanClub } from '../types';

interface FansSectionProps {
  onOpenUserProfile: (username: string) => void;
  onOpenChatWithUser?: (username: string) => void;
}

export const FansSection: React.FC<FansSectionProps> = ({
  onOpenUserProfile,
  onOpenChatWithUser
}) => {
  const {
    fanClubs,
    currentUser,
    userProfile,
    isPrivileged,
    createFanClub,
    joinFanClub,
    leaveFanClub,
    emptyFanClubMembers,
    updateFanClub,
    addPrivateForumToClub,
    deletePrivateForumFromClub,
    getProfileOf,
    sendChatMessage,
    addCoins,
    themeGradient,
    showToast
  } = useApp();

  const [activeClub, setActiveClub] = useState<FanClub | null>(null);
  const [inspectingArtist, setInspectingArtist] = useState<string | null>(null);

  // Create club modal
  const [isCreateClubOpen, setIsCreateClubOpen] = useState(false);
  const [clubName, setClubName] = useState('');
  const [fandomName, setFandomName] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [associatedArtistsList, setAssociatedArtistsList] = useState<string[]>([]);
  const [messagePrice, setMessagePrice] = useState<number>(20);
  const [clubDesc, setClubDesc] = useState('');
  const [clubBanner, setClubBanner] = useState('');
  const [clubAvatar, setClubAvatar] = useState('');
  const [tagColor, setTagColor] = useState('#ec4899');

  // Paid message modal
  const [isPaidMessageOpen, setIsPaidMessageOpen] = useState(false);
  const [paidMessageText, setPaidMessageText] = useState('');

  // Add private forum modal
  const [isPrivateForumOpen, setIsPrivateForumOpen] = useState(false);
  const [privateForumName, setPrivateForumName] = useState('');

  const canCreateClub = isPrivileged();

  // Artist press enter handler
  const handleArtistKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = artistInput.trim();
      if (val && !associatedArtistsList.includes(val)) {
        setAssociatedArtistsList([...associatedArtistsList, val]);
        setArtistInput('');
      }
    }
  };

  const handleCreateClubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalArtists = [...associatedArtistsList];
    if (artistInput.trim() && !finalArtists.includes(artistInput.trim())) {
      finalArtists.push(artistInput.trim());
    }

    if (finalArtists.length === 0) {
      showToast('Añade al menos un artista asociado (escribe el usuario y presiona Enter).');
      return;
    }

    createFanClub({
      name: clubName.trim(),
      fandomName: fandomName.trim(),
      artists: finalArtists,
      manager: currentUser || 'Manager',
      messagePrice: Number(messagePrice) || 20,
      tagIcon: '⭐',
      tagColor,
      description: clubDesc.trim(),
      banner: clubBanner || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&h=300&fit=crop',
      avatar: clubAvatar || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop'
    });

    setIsCreateClubOpen(false);
    setClubName('');
    setFandomName('');
    setAssociatedArtistsList([]);
    setClubDesc('');
  };

  const handleSendPaidMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClub || !inspectingArtist || !paidMessageText.trim()) return;

    if (userProfile.coins < activeClub.messagePrice) {
      showToast(`Coins insuficientes. Este mensaje cuesta ${activeClub.messagePrice} Coins.`);
      return;
    }

    // Deduct coins
    addCoins(-activeClub.messagePrice);

    // Send fan chat message
    sendChatMessage(inspectingArtist, paidMessageText.trim(), true);

    setIsPaidMessageOpen(false);
    setPaidMessageText('');
    showToast(`¡Mensaje enviado a @${inspectingArtist}! Se descontaron ${activeClub.messagePrice} Coins.`);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-12 animate-fadeIn">
      {/* Top Header */}
      {!activeClub && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400" /> Clubes de Fans Oficiales
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Apoya de cerca a tus artistas, únete a sus comunidades y porta la insignia de su fandom.
            </p>
          </div>

          {canCreateClub && (
            <button
              onClick={() => setIsCreateClubOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Crear Club de Fans
            </button>
          )}
        </div>
      )}

      {/* CLUBS GRID (When no club is active) */}
      {!activeClub && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fanClubs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 flex flex-col items-center justify-center gap-2 col-span-full">
              <Star className="w-10 h-10 text-slate-600" />
              <p className="text-base font-semibold text-slate-300">
                Aún no hay clubes de fans creados.
              </p>
              <p className="text-xs text-slate-500">
                Los artistas o administradores pueden crear un club oficial con su propia insignia.
              </p>
            </div>
          ) : (
            fanClubs.map((club) => {
              const isMember = club.members.includes(currentUser || '');
              return (
                <div
                  key={club.id}
                  onClick={() => setActiveClub(club)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl cursor-pointer transition flex flex-col justify-between group"
                >
                  <div className="relative h-28 bg-slate-800">
                    <img src={club.banner} alt="" className="w-full h-full object-cover" />
                    <img
                      src={club.avatar}
                      alt=""
                      className="absolute -bottom-4 left-4 w-14 h-14 rounded-full border-4 border-slate-900 object-cover shadow-lg bg-slate-800"
                    />
                  </div>

                  <div className="p-5 pt-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                          {club.name}
                        </h3>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow"
                          style={{ backgroundColor: club.tagColor || '#ec4899' }}
                        >
                          ⭐ {club.fandomName}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                        {club.description}
                      </p>

                      <div className="mt-2 text-[11px] text-slate-500">
                        Artistas:{' '}
                        <strong className="text-slate-300">{club.artists.join(', ')}</strong>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {club.members.length} miembros
                      </span>
                      {isMember && (
                        <span className="text-emerald-400 font-semibold text-[11px]">
                          ✓ Miembro
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ACTIVE CLUB DETAIL VIEW */}
      {activeClub && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          <button
            onClick={() => {
              setActiveClub(null);
              setInspectingArtist(null);
            }}
            className="self-start px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            ← Volver a Clubes de Fans
          </button>

          {/* Club Hero Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <img src={activeClub.banner} alt="" className="w-full h-44 object-cover" />
            <div className="p-6 relative">
              <img
                src={activeClub.avatar}
                alt=""
                className="w-20 h-20 rounded-full border-4 border-slate-900 object-cover absolute -top-10 left-6 shadow-xl bg-slate-800"
              />
              <div className="pt-8 sm:pt-0 sm:pl-28 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-extrabold text-white">{activeClub.name}</h2>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow"
                      style={{ backgroundColor: activeClub.tagColor || '#ec4899' }}
                    >
                      ⭐ Fandom: {activeClub.fandomName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl mt-1.5 leading-relaxed">
                    {activeClub.description}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-2 block">
                    <Users className="w-3 h-3 inline mr-1" /> {activeClub.members.length} miembros oficiales
                  </span>
                </div>

                {activeClub.members.includes(currentUser || '') ? (
                  <button
                    onClick={() => leaveFanClub(activeClub.id)}
                    className="px-4 py-2 bg-slate-800 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition"
                  >
                    Salir del Club
                  </button>
                ) : (
                  <button
                    onClick={() => joinFanClub(activeClub.id)}
                    className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-lg transition"
                  >
                    Unirse al Club & Portar Fandom
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Associated Artists Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" /> Artistas Oficiales Asociados
            </h3>
            <p className="text-xs text-slate-400">
              Al añadir un usuario a un club de fans como artista, su perfil real es el que se muestra aquí.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {activeClub.artists.map((artUsername) => {
                const artistProfile = getProfileOf(artUsername);
                return (
                  <div
                    key={artUsername}
                    onClick={() => setInspectingArtist(artUsername)}
                    className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-2xl cursor-pointer transition flex items-center gap-3.5 shadow"
                  >
                    <AvatarWithFrame
                      src={artistProfile.avatar}
                      size="lg"
                      ringColor={artistProfile.ringColor}
                      transparentFrame={artistProfile.transparentFrame}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-white truncate">
                          {artistProfile.nickname || artUsername}
                        </h4>
                        <UserBadges user={artistProfile} />
                      </div>
                      <span className="text-[11px] text-indigo-400 block mt-0.5">
                        @{artUsername}
                      </span>
                      {artistProfile.animal && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          🐾 {artistProfile.animal}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amplified Artist Card if an artist is selected */}
          {inspectingArtist && (
            <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Perfil Ampliado de Artista
                </h4>
                <button
                  onClick={() => setInspectingArtist(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {(() => {
                const prof = getProfileOf(inspectingArtist);
                return (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <AvatarWithFrame
                      src={prof.avatar}
                      size="2xl"
                      ringColor={prof.ringColor}
                      transparentFrame={prof.transparentFrame}
                    />

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h3 className="text-xl font-bold text-white">
                          {prof.nickname || inspectingArtist}
                        </h3>
                        <UserBadges user={prof} />
                      </div>
                      <p className="text-xs text-indigo-400 font-medium">@{inspectingArtist}</p>
                      <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                        {prof.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-400">
                        {prof.animal && <span>🐾 Animal: <strong className="text-white">{prof.animal}</strong></span>}
                        <span>
                          🎨 Aura:
                          <span
                            className="w-3 h-3 rounded-full inline-block ml-1 align-middle"
                            style={{ backgroundColor: prof.ringColor }}
                          />
                        </span>
                      </div>

                      {/* Action to send paid message */}
                      <div className="pt-3 flex gap-2 justify-center sm:justify-start">
                        <button
                          onClick={() => setIsPaidMessageOpen(true)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
                        >
                          <Coins className="w-3.5 h-3.5" /> Enviar Mensaje Exclusivo ({activeClub.messagePrice} Coins)
                        </button>
                        <button
                          onClick={() => onOpenUserProfile(inspectingArtist)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition"
                        >
                          Ver Perfil Completo
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Private Forums of the club */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-400" /> Foros Privados del Club (Máx 2)
              </h3>
              {(activeClub.manager === currentUser || isPrivileged()) && (
                <button
                  onClick={() => setIsPrivateForumOpen(true)}
                  disabled={activeClub.privateForums.length >= 2}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                    activeClub.privateForums.length >= 2
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-pink-600 hover:bg-pink-500 text-white shadow'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir Foro Privado
                </button>
              )}
            </div>

            {activeClub.privateForums.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">
                No hay foros privados en este club.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {activeClub.privateForums.map((pfName, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/60 border border-pink-500/20 rounded-xl flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-pink-400" /> {pfName}
                    </span>
                    {(activeClub.manager === currentUser || isPrivileged()) && (
                      <button
                        onClick={() => deletePrivateForumFromClub(activeClub.id, idx)}
                        className="text-red-400 hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREAR CLUB DE FANS */}
      {isCreateClubOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <form
            onSubmit={handleCreateClubSubmit}
            className="my-auto relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white max-h-[88vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" /> Crear Club de Fans Oficial
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateClubOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Club de Fans:
              </label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Ej: Starlight Oficial Fanclub"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Fandom (insignia de miembros):
              </label>
              <input
                type="text"
                value={fandomName}
                onChange={(e) => setFandomName(e.target.value)}
                placeholder="Ej: Starlights, Echoes, Beats..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            {/* Associated Artists */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Artistas asociados (escribe el usuario y presiona Enter):
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-800 border border-slate-700 rounded-xl items-center mb-1.5">
                {associatedArtistsList.map((art) => (
                  <span
                    key={art}
                    className="inline-flex items-center gap-1 bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-lg text-xs"
                  >
                    @{art}
                    <button
                      type="button"
                      onClick={() =>
                        setAssociatedArtistsList(associatedArtistsList.filter((x) => x !== art))
                      }
                      className="hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={artistInput}
                  onChange={(e) => setArtistInput(e.target.value)}
                  onKeyDown={handleArtistKeydown}
                  placeholder="Escribe usuario y pulsa Enter (ej: AlexBeats)..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none min-w-[140px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Costo por mensaje (Coins):
                </label>
                <input
                  type="number"
                  min="0"
                  value={messagePrice}
                  onChange={(e) => setMessagePrice(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Color de Insignia de Fandom:
                </label>
                <input
                  type="color"
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-full h-10 bg-slate-800 border border-slate-700 rounded-xl p-1 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descripción del Club:
              </label>
              <textarea
                value={clubDesc}
                onChange={(e) => setClubDesc(e.target.value)}
                placeholder="Descripción, lema y objetivos del club..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white min-h-[70px]"
                required
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreateClubOpen(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ background: themeGradient }}
                className="theme-btn flex-1 py-2 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer"
              >
                Crear Club de Fans
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: MENSAJE PAGADO A ARTISTA */}
      {isPaidMessageOpen && inspectingArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={handleSendPaidMessage}
            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold flex items-center gap-2 text-amber-400">
                <Coins className="w-5 h-5" /> Mensaje Exclusivo para @{inspectingArtist}
              </h3>
              <button
                type="button"
                onClick={() => setIsPaidMessageOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Costo de envío prioritario:{' '}
              <strong className="text-amber-400">{activeClub?.messagePrice} Coins</strong> (Tu saldo:{' '}
              {userProfile.coins.toLocaleString()} Coins).
            </p>

            <textarea
              value={paidMessageText}
              onChange={(e) => setPaidMessageText(e.target.value)}
              placeholder="Escribe tu mensaje especial para el artista..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white min-h-[90px]"
              required
            />

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPaidMessageOpen(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg"
              >
                Pagar y Enviar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: AÑADIR FORO PRIVADO */}
      {isPrivateForumOpen && activeClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!privateForumName.trim()) return;
              addPrivateForumToClub(activeClub.id, privateForumName.trim());
              setIsPrivateForumOpen(false);
              setPrivateForumName('');
            }}
            className="relative w-full max-w-sm bg-slate-900 border border-pink-500/40 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-pink-300">
                <Lock className="w-4 h-4" /> Nuevo Foro Privado
              </h3>
              <button
                type="button"
                onClick={() => setIsPrivateForumOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Foro Privado:
              </label>
              <input
                type="text"
                value={privateForumName}
                onChange={(e) => setPrivateForumName(e.target.value)}
                placeholder="Ej: Backstage & Ensayos VIP"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPrivateForumOpen(false)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold transition"
              >
                Crear Foro Privado
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
