import { NavLink } from 'react-router-dom'
import { Home, Shirt, Sparkles, Heart, Users } from 'lucide-react'
import { cn } from '../utils/cn'

const TABS = [
  { to: '/',         icon: Home,     label: 'Home' },
  { to: '/wardrobe', icon: Shirt,    label: 'Wardrobe' },
  { to: '/generate', icon: Sparkles, label: 'Generate' },
  { to: '/saved',    icon: Heart,    label: 'Saved' },
  { to: '/profiles', icon: Users,    label: 'Profiles' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2 safe-area-bottom">
        {TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[52px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-5 w-5 transition-all', isActive && 'scale-110')} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className={cn('text-[10px] font-medium leading-none', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
