import { NavLink } from 'react-router-dom'
import { Home, Shirt, User, Sparkles } from 'lucide-react'
import { cn } from '../utils/cn'

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Today' },
  { to: '/wardrobe', icon: Shirt, label: 'Wardrobe' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-sm">
      <div className="max-w-md mx-auto flex">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
