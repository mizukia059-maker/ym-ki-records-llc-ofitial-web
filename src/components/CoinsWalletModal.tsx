import React, { useState } from 'react';
import { X, Coins, Gem, ArrowRightLeft, Gift, CheckCircle2, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CoinsWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoinsWalletModal: React.FC<CoinsWalletModalProps> = ({ isOpen, onClose }) => {
  const {
    userProfile,
    transferCoins,
    claimDailyCoins,
    completeMission,
    allProfiles
  } = useApp();

  const [activeTab, setActiveTab] = useState<'balance' | 'transfer' | 'missions'>('balance');
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(50);

  if (!isOpen) return null;

  const today = new Date().toDateString();
  const canClaimDaily = userProfile.lastDailyClaim !== today;

  const missionsList = [
    {
      id: 'm-perfil',
      title: 'Completar personalización de perfil',
      desc: 'Edita tu bio, aura o avatar para destacar en la comunidad.',
      reward: 100
    },
    {
      id: 'm-foro',
      title: 'Participar en una conversación en Foros',
      desc: 'Publica o comenta en los foros comunitarios.',
      reward: 50
    },
    {
      id: 'm-fandom',
      title: 'Unirte a un Club de Fans Oficial',
      desc: 'Porta la insignia de tu artista preferido.',
      reward: 150
    },
    {
      id: 'm-audicion',
      title: 'Explorar el Centro de Audiciones YM-ki',
      desc: 'Consulta las modalidades y normas ante los CEOs.',
      reward: 40
    },
    {
      id: 'm-tienda',
      title: 'Visitar la Tienda Oficial y vitrina de merch',
      desc: 'Descubre los lanzamientos de álbumes y photocards.',
      reward: 60
    }
  ];

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const success = transferCoins(recipient, Number(transferAmount));
    if (success) {
      setRecipient('');
      setTransferAmount(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Cartera YM-ki</h3>
              <p className="text-xs text-slate-400">Tus fondos y recompensas del ecosistema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Balance Display (Gemas y Coins en grande) */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-inner">
          <div className="flex flex-col items-center justify-center p-3 bg-slate-950/40 rounded-xl border border-amber-500/20 text-center">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Coins className="w-4 h-4" /> YM-Coins
            </div>
            <span className="text-3xl font-extrabold text-amber-400 drop-shadow">
              {userProfile.coins.toLocaleString('es-MX')}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Moneda de comunidad & merch</span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-slate-950/40 rounded-xl border border-cyan-500/20 text-center">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Gem className="w-4 h-4" /> Gemas Estelares
            </div>
            <span className="text-3xl font-extrabold text-cyan-400 drop-shadow">
              {(userProfile.gems || 25).toLocaleString('es-MX')}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Rarezas & pases exclusivos</span>
          </div>
        </div>

        {/* Daily Bonus Section */}
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-indigo-500/10 border border-amber-500/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white">Bono Diario de YM-Coins</h4>
              <p className="text-[11px] text-slate-300">Recibe +200 Coins y +5 Gemas cada 24 horas.</p>
            </div>
          </div>
          <button
            onClick={claimDailyCoins}
            disabled={!canClaimDaily}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow ${
              canClaimDaily
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {canClaimDaily ? 'Reclamar Bono' : 'Reclamado Hoy ✓'}
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition ${
              activeTab === 'balance'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'transfer'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Transferir Coins
          </button>
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'missions'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Misiones
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'transfer' && (
          <form onSubmit={handleTransfer} className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nombre de usuario destinatario:
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Ej: CEO Miki o un amigo"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Cantidad a transferir (Coins):</span>
                <span className="text-amber-400 font-semibold">
                  Saldo: {userProfile.coins.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                min="1"
                max={userProfile.coins}
                value={transferAmount}
                onChange={(e) => setTransferAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                required
              />
            </div>

            <div className="flex gap-2">
              {[50, 100, 250, 500].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setTransferAmount(preset)}
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] text-slate-300 transition"
                >
                  +{preset}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" /> Confirmar Transferencia
            </button>
          </form>
        )}

        {activeTab === 'missions' && (
          <div className="flex flex-col gap-2.5">
            {missionsList.map((m) => {
              const isDone = userProfile.completedMissions.includes(m.id);
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700"
                >
                  <div className="pr-2">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {m.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.desc}</p>
                    <span className="text-[10px] font-semibold text-amber-400 mt-1 inline-block">
                      Recompensa: +{m.reward} Coins
                    </span>
                  </div>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Reclamada
                    </span>
                  ) : (
                    <button
                      onClick={() => completeMission(m.id, m.reward)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex-shrink-0 shadow transition"
                    >
                      Reclamar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'balance' && (
          <div className="flex flex-col gap-3 text-xs text-slate-300">
            <p>
              Las <strong>YM-Coins</strong> te permiten adquirir productos oficiales en la Tienda,
              intercambiar en el Outlet, enviar mensajes prioritarios a tus artistas preferidos y
              desbloquear el pase <strong>Premium Fan VIP</strong> (10,000 Coins).
            </p>
            <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex flex-col gap-1.5">
              <div className="flex justify-between font-medium">
                <span>Pase Premium Fan:</span>
                <span className="text-amber-400 font-bold">10,000 Coins</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Mensaje a Artista en Club:</span>
                <span className="text-amber-400 font-bold">10 ~ 50 Coins</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Reventa en Outlet:</span>
                <span className="text-emerald-400 font-bold">100% ganancias para ti</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
