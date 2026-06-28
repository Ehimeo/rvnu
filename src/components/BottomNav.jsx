import { NavLink } from 'react-router-dom'
import { Home, Shirt, Sparkles, Heart, Users, CalendarDays } from 'lucide-react'
import { cn } from '../utils/cn'
import { useCalendar } from '../hooks/useCalendar'

const TABS = [
  { to: '/',         icon: Home,         label: 'Home' },
  { to: '/wardrobe', icon: Shirt,         label: 'Wardrobe' },
  { to: '/generate', icon: Sparkles,      label: 'Generate' },
  { to: '/calendar', icon: CalendarDays,  label: 'Calendar' },
  { to: '/saved',    icon: Heart,         label: 'Saved' },
  { to: '/profiles', icon: Users,         label: 'Profiles' },
]

export default function BottomNav() {
  const { upcomingReminders } = useCalendar()
  const reminderCount = upcomingReminders.length

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40">
      <div className="max-w-md mx-auto flex items-center justify-around px-1 py-2 safe-area-bottom">
        {TABS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-[44px] relative',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={cn('h-5 w-5 transition-all', isActive && 'scale-110')} strokeWidth={isActive ? 2.2 : 1.8} />
                  {to === '/calendar' && reminderCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center leading-none">
                      {reminderCount > 9 ? '9+' : reminderCount}
                    </span>
                  )}
                </div>
                <span className={cn('text-[9px] font-medium leading-none', isActive ? 'text-primary' : 'text-muted-foreground')}>
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
