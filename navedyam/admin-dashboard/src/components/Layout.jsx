import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AuthContext';
import {
  DashboardIcon, OrdersIcon, MenuIcon, CouponIcon,
  UsersIcon, AnalyticsIcon, LogoutIcon, FlameIcon,
} from './Icons';

const NAV_ITEMS = [
  { to: '/',          Icon: DashboardIcon, label: 'Dashboard'  },
  { to: '/orders',    Icon: OrdersIcon,    label: 'Orders'     },
  { to: '/menu',      Icon: MenuIcon,      label: 'Menu'       },
  { to: '/coupons',   Icon: CouponIcon,    label: 'Coupons'    },
  { to: '/users',     Icon: UsersIcon,     label: 'Users'      },
  { to: '/analytics', Icon: AnalyticsIcon, label: 'Analytics'  },
];

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/orders':    'Orders',
  '/menu':      'Menu Management',
  '/coupons':   'Coupons',
  '/users':     'Users',
  '/analytics': 'Analytics',
};

export default function Layout({ children }) {
  const { admin, logout } = useAdminAuth();
  const navigate          = useNavigate();
  const location          = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Admin';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="admin-layout">
      {/* ---- Sidebar ---- */}
      <aside className="admin-sidebar">
        {/* Logo */}
        <div style={{
          padding: '20px 16px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #FC8019, #FF9F4A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, boxShadow: '0 2px 10px rgba(252,128,25,0.38)',
          }}>
            <FlameIcon size={18} color="#fff" strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FDF6EC', letterSpacing: '-0.01em' }}>
              Navedyam
            </div>
            <div style={{ fontSize: '0.64rem', color: 'rgba(253,246,236,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display:        'flex',
                alignItems:     'center',
                gap:            10,
                padding:        '9px 12px',
                borderRadius:   8,
                marginBottom:   2,
                fontSize:       '0.875rem',
                fontWeight:     isActive ? 700 : 500,
                color:          isActive ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
                background:     isActive ? 'rgba(252,128,25,0.2)' : 'transparent',
                borderLeft:     isActive ? '3px solid #FC8019' : '3px solid transparent',
                textDecoration: 'none',
                transition:     'all 0.15s ease',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    color={isActive ? '#FF9F4A' : 'rgba(255,255,255,0.72)'}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '10px 8px 16px', borderTop: '1px solid rgba(255,255,255,0.09)' }}>
          {admin && (
            <div style={{
              padding: '8px 12px', marginBottom: 6, borderRadius: 8,
              background: 'rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(252,128,25,0.24)',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FF9F4A' }}>
                  {(admin.name ?? admin.phone ?? 'A')[0].toUpperCase()}
                </span>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '0.8rem', fontWeight: 600, color: '#FDF6EC',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {admin.name ?? admin.phone ?? 'Admin'}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(253,246,236,0.45)' }}>Administrator</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          8,
              width:        '100%',
              padding:      '9px 12px',
              borderRadius: 8,
              fontSize:     '0.875rem',
              fontWeight:   500,
              color:        'rgba(253,246,236,0.6)',
              color:        'rgba(255,255,255,0.72)',
              background:   'transparent',
              cursor:       'pointer',
              transition:   'all 0.15s ease',
              border:       '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background  = 'rgba(220,38,38,0.18)';
              e.currentTarget.style.color       = '#FCA5A5';
              e.currentTarget.style.borderColor = 'rgba(220,38,38,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background  = 'transparent';
              e.currentTarget.style.color       = 'rgba(255,255,255,0.72)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <LogoutIcon size={15} color="currentColor" strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ---- Main area ---- */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            {pageTitle}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display:      'flex',
              alignItems:   'center',
              gap:          7,
              background:   'var(--saffron-pale)',
              border:       '1px solid rgba(252,128,25,0.2)',
              borderRadius: 'var(--radius-full)',
              padding:      '5px 14px 5px 8px',
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'linear-gradient(135deg, #FC8019, #FF9F4A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FlameIcon size={12} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--saffron)' }}>
                Navedyam
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
