import React from 'react';
import { Crown, Mic, CheckCircle2, Sparkles } from 'lucide-react';
import { UserProfile, FanClub } from '../types';

interface UserBadgesProps {
  user: UserProfile | { username: string; accountType?: string; badgeAdminColor?: string; badgeVerifiedColor?: string };
  fanClubs?: FanClub[];
  className?: string;
  showFandomBadges?: boolean;
}

export const UserBadges: React.FC<UserBadgesProps> = ({
  user,
  fanClubs = [],
  className = '',
  showFandomBadges = true
}) => {
  const isAdmin = user.accountType === 'admin';
  const isArtist = user.accountType === 'artista';
  const isPremiumFan = user.accountType === 'premium_fan';

  const adminColor = (user as UserProfile).badgeAdminColor || '#ec4899';
  const verifiedColor = (user as UserProfile).badgeVerifiedColor || '#38bdf8';

  const userJoinedClubs = fanClubs.filter(
    (club) => club.members && club.members.includes(user.username)
  );

  return (
    <span className={`inline-flex items-center gap-1 align-middle ${className}`}>
      {isAdmin && (
        <>
          <span title="Administrador Oficial">
            <Crown className="w-3.5 h-3.5 inline drop-shadow" style={{ color: adminColor }} />
          </span>
          <span title="Cuenta Verificada">
            <CheckCircle2 className="w-3.5 h-3.5 inline drop-shadow" style={{ color: verifiedColor }} />
          </span>
        </>
      )}

      {isArtist && (
        <>
          <span title="Artista Oficial">
            <Mic className="w-3.5 h-3.5 inline drop-shadow" style={{ color: adminColor }} />
          </span>
          <span title="Artista Verificado">
            <CheckCircle2 className="w-3.5 h-3.5 inline drop-shadow" style={{ color: verifiedColor }} />
          </span>
        </>
      )}

      {isPremiumFan && (
        <span
          title="Fan Premium YM-ki"
          className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-sm"
        >
          <Sparkles className="w-2.5 h-2.5" /> VIP
        </span>
      )}

      {showFandomBadges &&
        userJoinedClubs.map((club) => {
          const bg = club.tagColor || '#ec4899';
          return (
            <span
              key={club.id}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white shadow-sm"
              style={{ backgroundColor: bg }}
              title={`Fandom: ${club.fandomName}`}
            >
              {club.tagIconImg ? (
                <img
                  src={club.tagIconImg}
                  alt=""
                  className="w-3 h-3 rounded-full object-cover inline"
                />
              ) : (
                <span>{club.tagIcon || '⭐'}</span>
              )}
              <span>{club.fandomName}</span>
            </span>
          );
        })}
    </span>
  );
};
