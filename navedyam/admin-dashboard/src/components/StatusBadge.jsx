import React from 'react';

const STATUS_MAP = {
  placed: {
    label: 'Placed',
    bg: '#FFFBEB', color: '#B45309', border: '#FCD34D',
    dot: '#F59E0B',
  },
  confirmed: {
    label: 'Confirmed',
    bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE',
    dot: '#3B82F6',
  },
  preparing: {
    label: 'Preparing',
    bg: '#FFF7ED', color: '#C2410C', border: '#FDBA74',
    dot: '#F97316',
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    bg: '#F0FDF4', color: '#15803D', border: '#86EFAC',
    dot: '#22C55E',
  },
  delivered: {
    label: 'Delivered',
    bg: '#DCFCE7', color: '#14532D', border: '#4ADE80',
    dot: '#16A34A',
  },
  cancelled: {
    label: 'Cancelled',
    bg: '#FEF2F2', color: '#991B1B', border: '#FCA5A5',
    dot: '#EF4444',
  },
};

/**
 * StatusBadge
 * Props:
 *   status (string) – order status key
 */
export default function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] ?? {
    label:  status ?? 'Unknown',
    bg:     'var(--cream-dark)',
    color:  'var(--text-muted)',
    border: 'var(--border)',
    dot:    'var(--text-muted)',
  };

  return (
    <span
      className="badge"
      style={{
        background:    cfg.bg,
        color:         cfg.color,
        border:        `1px solid ${cfg.border}`,
        fontWeight:    600,
        fontSize:      '0.72rem',
        letterSpacing: '0.01em',
      }}
    >
      <span style={{
        width:        6,
        height:       6,
        borderRadius: '50%',
        background:   cfg.dot,
        flexShrink:   0,
        display:      'inline-block',
      }} />
      {cfg.label}
    </span>
  );
}
