import { BookOpen, Heart, Home, Search, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/cn';

const items = [
  { to: '/app', label: 'Inicio', icon: Home, end: true },
  { to: '/app/explorar', label: 'Explorar', icon: Search },
  { to: '/app/mis-clases', label: 'Mis Clases', icon: BookOpen },
  { to: '/app/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/app/perfil', label: 'Perfil', icon: UserRound },
];

const BottomNavigation = () => (
  <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-gray-100 bg-white/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
    <div className="grid grid-cols-5 gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl text-[12px] font-medium text-muted transition',
                isActive && 'text-violet',
              )
            }
          >
            <Icon className="h-7 w-7" strokeWidth={item.label === 'Inicio' ? 2.8 : 2.3} />
            <span className="leading-none">{item.label}</span>
          </NavLink>
        );
      })}
    </div>
  </nav>
);

export default BottomNavigation;
