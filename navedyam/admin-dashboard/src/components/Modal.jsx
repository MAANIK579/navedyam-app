import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon } from './Icons';

const SIZE_MAP = {
  sm:   480,
  md:   600,
  lg:   820,
  xl:  1000,
};

/**
 * Modal
 * Props:
 *   open       (bool)
 *   onClose    (func)
 *   title      (string)
 *   children   (ReactNode)
 *   size       ('sm'|'md'|'lg'|'xl')  default 'md'
 */
export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const maxWidth = SIZE_MAP[size] ?? SIZE_MAP.md;

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         1000,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '20px',
        animation:      'fadeIn 0.18s ease both',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:       'absolute',
          inset:          0,
          background:     'rgba(17,24,39,0.45)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Content card */}
      <div
        style={{
          position:       'relative',
          zIndex:         1,
          width:          '100%',
          maxWidth:       maxWidth,
          maxHeight:      'calc(100vh - 40px)',
          background:     'linear-gradient(165deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.66) 100%)',
          border:         '1px solid rgba(255,255,255,0.58)',
          borderRadius:   'var(--radius-xl)',
          boxShadow:      'var(--shadow-xl)',
          display:        'flex',
          flexDirection:  'column',
          overflow:       'hidden',
          animation:      'slideDown 0.22s ease both',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '16px 20px',
          borderBottom:   '1px solid rgba(255,255,255,0.62)',
          flexShrink:     0,
          background:     'rgba(248,249,251,0.6)',
        }}>
          <h2 style={{
            fontSize:      '1rem',
            fontWeight:    700,
            color:         'var(--text)',
            letterSpacing: '-0.01em',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width:          32,
              height:         32,
              borderRadius:   8,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          'var(--text-muted)',
              background:     'transparent',
              cursor:         'pointer',
              transition:     'all 0.15s',
              border:         '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'rgba(255,255,255,0.64)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
              e.currentTarget.style.color       = 'var(--saffron)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.color       = 'var(--text-muted)';
            }}
          >
            <CloseIcon size={16} color="currentColor" strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
