import React, { useState } from 'react';
import { X, UserPlus, Flag, MessageCircle, Lock, ArrowLeftRight, Search, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AvatarWithFrame } from './AvatarWithFrame';
import { UserBadges } from './UserBadges';
import { InventoryItem } from '../types';

interface UserProfilePreviewModalProps {
  onOpenChatWithUser?: (username: string) => void;
  onSearchProductInStore?: (query: string) => void;
}

export const UserProfilePreviewModal: React.FC<UserProfilePreviewModalProps> = ({
  onOpenChatWithUser,
  onSearchProductInStore
}) => {
  const {
    currentUser,
    userProfile,
    viewingProfileUser,
    setViewingProfileUser,
    fanClubs,
    friendRequestsSent,
    sendFriendRequest,
    inventory,
    submitTradeOffer,
    showToast
  } = useApp();

  const [selectedMerchItem, setSelectedMerchItem] = useState<InventoryItem | null>(null);
  const [tradeOfferModalOpen, setTradeOfferModalOpen] = useState(false);
  const [offeredInventoryItemId, setOfferedInventoryItemId] = useState<string>('');
  const [tradeNote, setTradeNote] = useState('');

  if (!viewingProfileUser) return null;

  const isSelf = viewingProfileUser.username === currentUser;
  const hasSentRequest = !!friendRequestsSent[viewingProfileUser.username];

  // Load items in showcase
  const allUserInventory = isSelf
    ? inventory
    : JSON.parse(localStorage.getItem('ym_inventory') || '[]') as InventoryItem[];

  const showcaseItems = allUserInventory.filter((item) =>
    (viewingProfileUser.showcaseItemIds || []).includes(item.id)
  ).slice(0, 5);

  const handleItemClick = (item: InventoryItem) => {
    setSelectedMerchItem(item);
  };

  const handleStartTrade = () => {
    if (!inventory.length) {
      showToast('No tienes ningún item en tu inventario para ofrecer en intercambio.');
      return;
    }
    setOfferedInventoryItemId(inventory[0].id);
    setTradeOfferModalOpen(true);
  };

  const handleConfirmTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMerchItem || !offeredInventoryItemId) return;
    submitTradeOffer(
      viewingProfileUser.username,
      offeredInventoryItemId,
      selectedMerchItem.id,
      tradeNote
    );
    setTradeOfferModalOpen(false);
    setSelectedMerchItem(null);
  };

  const handleSearchProduct = () => {
    if (!selectedMerchItem) return;
    const q = selectedMerchItem.productName;
    setSelectedMerchItem(null);
    setViewingProfileUser(null);
    if (onSearchProductInStore) {
      onSearchProductInStore(q);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-700 p-6 shadow-2xl flex flex-col gap-5 text-white max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: viewingProfileUser.profileBgColor || '#1e293b'
        }}
      >
        {/* Close button */}
        <button
          onClick={() => {
            setViewingProfileUser(null);
            setSelectedMerchItem(null);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header with Outer Avatar Frame */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <AvatarWithFrame
            src={viewingProfileUser.avatar}
            size="2xl"
            ringColor={viewingProfileUser.ringColor}
            transparentFrame={viewingProfileUser.transparentFrame}
          />

          <div>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <h3 className="text-xl font-bold">{viewingProfileUser.nickname || viewingProfileUser.username}</h3>
              <UserBadges user={viewingProfileUser} fanClubs={fanClubs} />
            </div>
            <p className="text-xs text-indigo-300 mt-0.5">@{viewingProfileUser.username}</p>
          </div>

          <p className="text-sm text-slate-300 max-w-sm px-2">
            {viewingProfileUser.description || 'Sin descripción personal todavía.'}
          </p>

          {/* Artist details if applicable */}
          {(viewingProfileUser.accountType === 'artista' || viewingProfileUser.accountType === 'admin') && (
            <div className="flex items-center gap-3 text-xs bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-700">
              {viewingProfileUser.animal && (
                <span>🐾 Animal: <strong>{viewingProfileUser.animal}</strong></span>
              )}
              <span className="flex items-center gap-1">
                🎨 Aura:
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: viewingProfileUser.ringColor }}
                />
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {!isSelf && (
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => sendFriendRequest(viewingProfileUser.username)}
              disabled={hasSentRequest}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition ${
                hasSentRequest
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {hasSentRequest ? 'Solicitud enviada' : 'Añadir Amigo'}
            </button>

            <button
              onClick={() => {
                if (onOpenChatWithUser) {
                  onOpenChatWithUser(viewingProfileUser.username);
                  setViewingProfileUser(null);
                }
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              Mensaje
            </button>

            <button
              onClick={() => {
                showToast(`Usuario @${viewingProfileUser.username} reportado al equipo de moderación.`);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border border-red-500/40 text-red-400 hover:bg-red-500/10 transition"
            >
              <Flag className="w-4 h-4" />
              Reportar
            </button>
          </div>
        )}

        {/* Merch Showcase (Vitrina de Merch) */}
        <div className="bg-slate-900/70 border border-slate-700 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Vitrina de Merch
              <span className="text-xs text-slate-400 font-normal">
                ({showcaseItems.length}/5 destacados)
              </span>
            </h4>
            {viewingProfileUser.isMerchPrivate && (
              <span className="text-[11px] text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                <Lock className="w-3 h-3" /> Privada
              </span>
            )}
          </div>

          {viewingProfileUser.isMerchPrivate && !isSelf ? (
            <div className="py-6 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
              <Lock className="w-8 h-8 text-slate-500" />
              <p className="text-sm">Esta vitrina de merch es privada por elección del usuario.</p>
            </div>
          ) : showcaseItems.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-sm">
              {isSelf
                ? 'Aún no has destacado productos. Ve a "Mi Vitrina de Merch" en el menú para seleccionarlos.'
                : 'Este usuario no tiene items exhibidos en su vitrina.'}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {showcaseItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-white cursor-pointer hover:border-amber-400 hover:shadow-lg transition flex items-center justify-center p-1"
                  title={item.productName}
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-center font-medium p-1">
                    Ver opciones
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for clicked item inside Showcase */}
        {selectedMerchItem && !tradeOfferModalOpen && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h5 className="text-xs font-bold text-slate-300">
                Opciones de Merch: <span className="text-white">{selectedMerchItem.productName}</span>
              </h5>
              <button
                onClick={() => setSelectedMerchItem(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cerrar
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                <img
                  src={selectedMerchItem.image}
                  alt={selectedMerchItem.productName}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-slate-300 line-clamp-2">
                {selectedMerchItem.description}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              {!isSelf && (
                <button
                  onClick={handleStartTrade}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  Solicitar trade
                </button>
              )}

              <button
                onClick={handleSearchProduct}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition"
              >
                <Search className="w-3.5 h-3.5" />
                Buscar el producto
              </button>
            </div>
          </div>
        )}

        {/* Modal for Trade Offer */}
        {tradeOfferModalOpen && selectedMerchItem && (
          <form
            onSubmit={handleConfirmTrade}
            className="bg-slate-800 border border-indigo-500/40 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <h5 className="text-sm font-bold text-indigo-300 flex items-center gap-1.5">
                <ArrowLeftRight className="w-4 h-4" /> Proponer Trade con @{viewingProfileUser.username}
              </h5>
              <button
                type="button"
                onClick={() => setTradeOfferModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              Solicitas:{' '}
              <strong className="text-white">{selectedMerchItem.productName}</strong>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Selecciona qué item de tu inventario ofreces a cambio:
              </label>
              <select
                value={offeredInventoryItemId}
                onChange={(e) => setOfferedInventoryItemId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                required
              >
                {inventory.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.productName} (Valor aprox. {inv.pricePaid} Coins)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Mensaje o nota para la propuesta (opcional):
              </label>
              <input
                type="text"
                value={tradeNote}
                onChange={(e) => setTradeNote(e.target.value)}
                placeholder="Ej: Te ofrezco este photocard exclusivo que buscabas..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTradeOfferModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
              >
                Enviar Propuesta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
