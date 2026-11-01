import React from 'react';
import { Bell, X, CheckCircle2, Mic, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationItem, AuditionSubmission } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAudition: (audition: AuditionSubmission) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onViewAudition
}) => {
  const {
    notifications,
    currentUser,
    auditions,
    markNotificationRead
  } = useApp();

  if (!isOpen) return null;

  const userNotifs = notifications.filter((n) => n.recipient === currentUser);

  const handleInspectAudition = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    if (notif.auditionId) {
      const targetAudition = auditions.find((a) => a.id === notif.auditionId);
      if (targetAudition) {
        onViewAudition(targetAudition);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-white max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Bandeja de Notificaciones</h3>
              <p className="text-xs text-slate-400">Audiciones recibidas, avisos y resoluciones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {userNotifs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No tienes notificaciones pendientes.
            </div>
          ) : (
            userNotifs.map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 text-xs ${
                  n.read
                    ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                    : 'bg-slate-800/90 border-indigo-500/40 text-white shadow-md'
                }`}
              >
                <div className="space-y-0.5 min-w-0 pr-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    {n.type === 'audition' ? (
                      <Mic className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{n.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight line-clamp-2">
                    {n.message}
                  </p>
                  <span className="text-[9px] text-slate-500 block">
                    {new Date(n.date).toLocaleDateString('es-MX')} ·{' '}
                    {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* BOTÓN "VER" QUE LLEVA A LA AUDICIÓN COMO SE SOLICITÓ */}
                {n.auditionId ? (
                  <button
                    onClick={() => handleInspectAudition(n)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow flex-shrink-0 flex items-center gap-1"
                  >
                    Ver <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  !n.read && (
                    <button
                      onClick={() => markNotificationRead(n.id)}
                      className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded-lg text-[10px]"
                    >
                      Leído
                    </button>
                  )
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
