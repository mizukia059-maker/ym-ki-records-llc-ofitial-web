import React from 'react';
import { X, Sparkles, Lock, CheckCircle2, Plus, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MerchShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToStore?: () => void;
}

export const MerchShowcaseModal: React.FC<MerchShowcaseModalProps> = ({
  isOpen,
  onClose,
  onGoToStore
}) => {
  const { userProfile, inventory, toggleShowcaseItem, setMerchPrivate } = useApp();

  if (!isOpen) return null;

  const showcaseIds = userProfile.showcaseItemIds || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-white max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Gestión de mi Vitrina de Merch</h3>
              <p className="text-xs text-slate-400">
                Selecciona hasta 5 productos de tu inventario para exhibirlos en la vista previa de tu perfil.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Checkbox */}
        <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-sm font-semibold">Mantener mi vitrina de merch privada</span>
              <p className="text-xs text-slate-400">
                Si está activa, otros usuarios verán tu vitrina bloqueada y no podrán inspeccionarla.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={userProfile.isMerchPrivate}
              onChange={(e) => setMerchPrivate(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* Showcase Status Bar */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Items exhibidos: <strong className="text-amber-400">{showcaseIds.length} / 5</strong>
          </span>
          {showcaseIds.length >= 5 && (
            <span className="text-xs text-amber-400 font-medium">Límite máximo alcanzado</span>
          )}
        </div>

        {/* Inventory Items List */}
        <div className="flex-1 overflow-y-auto pr-1">
          {inventory.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
              <ShoppingBag className="w-10 h-10 text-slate-600" />
              <div className="max-w-xs">
                <p className="text-sm font-semibold text-slate-300">Tu inventario está vacío</p>
                <p className="text-xs text-slate-400 mt-1">
                  Adquiere álbumes, photocards o lightsticks en la Tienda Oficial o en el Outlet para comenzar a armar tu vitrina.
                </p>
              </div>
              {onGoToStore && (
                <button
                  onClick={() => {
                    onClose();
                    onGoToStore();
                  }}
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold rounded-xl text-white transition shadow-lg"
                >
                  Ir a la Tienda
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {inventory.map((item) => {
                const isSelected = showcaseIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleShowcaseItem(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="w-14 h-14 bg-white rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.productName}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
                      <span className="text-[10px] text-amber-400 font-semibold mt-1 inline-block">
                        {item.pricePaid} Coins
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-black font-bold">
                          <CheckCircle2 className="w-5 h-5 text-slate-950" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 hover:border-amber-400 hover:text-amber-400 transition">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
          >
            Listo y Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
