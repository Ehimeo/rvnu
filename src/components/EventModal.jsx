import { useState, useEffect } from 'react'
import { X, Trash2, Calendar, Clock, Tag, Bell, FileText } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '../utils/cn'

const OCCASIONS = [
  { value: 'casual', label: 'Casual', icon: '👕' },
  { value: 'work', label: 'Work', icon: '💼' },
  { value: 'school', label: 'School', icon: '📚' },
  { value: 'church', label: 'Church', icon: '⛪' },
  { value: 'party', label: 'Party', icon: '🎉' },
  { value: 'date-night', label: 'Date Night', icon: '🌹' },
  { value: 'gym', label: 'Gym', icon: '💪' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'wedding', label: 'Wedding', icon: '💍' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌿' },
]

const REMINDERS = [
  { value: 0, label: 'No reminder' },
  { value: 15, label: '15 min before' },
  { value: 60, label: '1 hour before' },
  { value: 1440, label: '1 day before' },
  { value: 10080, label: '1 week before' },
]

const OCCASION_COLORS = {
  casual: 'bg-blue-100 text-blue-700 border-blue-200',
  work: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  school: 'bg-amber-100 text-amber-700 border-amber-200',
  church: 'bg-purple-100 text-purple-700 border-purple-200',
  party: 'bg-pink-100 text-pink-700 border-pink-200',
  'date-night': 'bg-red-100 text-red-700 border-red-200',
  gym: 'bg-green-100 text-green-700 border-green-200',
  travel: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  wedding: 'bg-rose-100 text-rose-700 border-rose-200',
  outdoor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

export default function EventModal({ event, defaultDate, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    title: '',
    date: defaultDate || new Date().toISOString().slice(0, 10),
    time: '',
    occasion: 'casual',
    notes: '',
    reminderMinutes: 60,
  })

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title ?? '',
        date: event.date ?? defaultDate ?? new Date().toISOString().slice(0, 10),
        time: event.time ?? '',
        occasion: event.occasion ?? 'casual',
        notes: event.notes ?? '',
        reminderMinutes: event.reminderMinutes ?? 60,
      })
    }
  }, [event, defaultDate])

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = () => {
    if (!form.title.trim() || !form.date) return
    onSave({ ...form, title: form.title.trim() })
  }

  const isEditing = Boolean(event)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/50">
          <h2 className="text-base font-semibold">{isEditing ? 'Edit Event' : 'New Event'}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Event Title</label>
            <input
              className="w-full rounded-xl bg-muted px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="What's happening?"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              autoFocus
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <Calendar className="h-3 w-3" /> Date
              </label>
              <input
                type="date"
                className="w-full rounded-xl bg-muted px-3 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <Clock className="h-3 w-3" /> Time
              </label>
              <input
                type="time"
                className="w-full rounded-xl bg-muted px-3 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.time}
                onChange={e => set('time', e.target.value)}
              />
            </div>
          </div>

          {/* Occasion */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Tag className="h-3 w-3" /> Occasion
            </label>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map(occ => (
                <button
                  key={occ.value}
                  onClick={() => set('occasion', occ.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    form.occasion === occ.value
                      ? OCCASION_COLORS[occ.value]
                      : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/70'
                  )}
                >
                  {occ.icon} {occ.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <Bell className="h-3 w-3" /> Reminder
            </label>
            <select
              className="w-full rounded-xl bg-muted px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
              value={form.reminderMinutes}
              onChange={e => set('reminderMinutes', Number(e.target.value))}
            >
              {REMINDERS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <FileText className="h-3 w-3" /> Notes
            </label>
            <textarea
              className="w-full rounded-xl bg-muted px-4 py-3 text-sm resize-none placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Add any details..."
              rows={2}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-border/50">
          {isEditing && (
            <button
              onClick={() => { onDelete(event.id); onClose() }}
              className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0 hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!form.title.trim() || !form.date}
          >
            {isEditing ? 'Save Changes' : 'Add Event'}
          </Button>
        </div>
      </div>
    </div>
  )
}
