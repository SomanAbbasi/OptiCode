'use client';

import { useState } from 'react';
import { theme } from '../theme';

interface OptimizeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function OptimizeButton({
  onClick,
  isLoading,
  disabled,
}: OptimizeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: `${theme.spacing.lg} ${theme.spacing['2xl']}`,
        fontSize: theme.fontSize.base,
        fontWeight: '600',
        color: '#ffffff',
        background: disabled
          ? theme.colors.surfaceLight
          : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
        border: 'none',
        borderRadius: theme.borderRadius.lg,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        boxShadow: disabled
          ? 'none'
          : isHovered
          ? `0 8px 25px rgba(59, 130, 246, 0.4)`
          : `0 4px 15px rgba(59, 130, 246, 0.3)`,
        opacity: disabled ? 0.5 : 1,
        width: '100%',
        maxWidth: '400px',
        transform: !disabled && isHovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {isLoading ? (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm }}>
          <span
            style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: `2px solid rgba(255, 255, 255, 0.3)`,
              borderTop: `2px solid white`,
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
          Optimizing...
        </span>
      ) : (
        '✨ Optimize Code'
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
