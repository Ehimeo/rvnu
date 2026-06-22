import { cn } from '../utils/cn'

const GENDER_AVATAR = {
  woman: '👩', man: '👨', girl: '👧', boy: '👦',
}

export default function MemberSwitcher({ profile, activeMemberId, onSwitch }) {
  if (!profile?.members?.length) return null

  const all = [
    { id: null, name: profile.name || 'Me', gender: profile.gender },
    ...profile.members,
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
      {all.map(member => (
        <button
          key={member.id ?? 'me'}
          onClick={() => onSwitch(member.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-all shrink-0',
            activeMemberId === member.id
              ? 'bg-primary text-primary-foreground border-primary font-medium'
              : 'bg-card border-border text-foreground hover:border-primary/40'
          )}
        >
          <span>{GENDER_AVATAR[member.gender] ?? '🧑'}</span>
          {member.name || 'Member'}
        </button>
      ))}
    </div>
  )
}
