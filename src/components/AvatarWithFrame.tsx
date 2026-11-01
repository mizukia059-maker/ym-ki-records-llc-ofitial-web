import React from 'react';

interface AvatarWithFrameProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  ringColor?: string;
  transparentFrame?: string | null;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const AvatarWithFrame: React.FC<AvatarWithFrameProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  ringColor = '#6366f1',
  transparentFrame,
  className = '',
  onClick
}) => {
  const sizeMap = {
    xs: { outer: 'w-7 h-7', inner: 'w-6 h-6', ringPad: 'p-0.5', frameInset: '-inset-1' },
    sm: { outer: 'w-9 h-9', inner: 'w-8 h-8', ringPad: 'p-0.5', frameInset: '-inset-1' },
    md: { outer: 'w-11 h-11', inner: 'w-10 h-10', ringPad: 'p-0.5', frameInset: '-inset-1.5' },
    lg: { outer: 'w-16 h-16', inner: 'w-14 h-14', ringPad: 'p-1', frameInset: '-inset-2' },
    xl: { outer: 'w-24 h-24', inner: 'w-20 h-20', ringPad: 'p-1.5', frameInset: '-inset-2.5' },
    '2xl': { outer: 'w-32 h-32', inner: 'w-28 h-28', ringPad: 'p-2', frameInset: '-inset-3' },
  };

  const currentSize = sizeMap[size];
  const fallbackSrc = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces';
  const avatarSrc = src && src.trim() ? src : fallbackSrc;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${currentSize.outer} ${
        onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
      } ${className}`}
    >
      {/* Marco exterior (por fuera de la foto de perfil) */}
      <div
        className={`absolute inset-0 rounded-full transition-all`}
        style={{
          border: `2.5px solid ${ringColor || '#6366f1'}`,
          boxShadow: `0 0 10px ${ringColor || '#6366f1'}40`
        }}
      />

      {/* Si tiene marco transparente personalizado (PNG/GIF decorativo), se coloca alrededor exteriormente */}
      {transparentFrame && (
        <div
          className={`absolute ${currentSize.frameInset} pointer-events-none rounded-full bg-contain bg-center bg-no-repeat z-10`}
          style={{
            backgroundImage: `url("${transparentFrame}")`,
            transform: 'scale(1.08)'
          }}
        />
      )}

      {/* Foto interna circular contenida sin ser tapada */}
      <div className={`rounded-full overflow-hidden ${currentSize.inner} bg-slate-800 z-0`}>
        <img
          src={avatarSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackSrc;
          }}
        />
      </div>
    </div>
  );
};
