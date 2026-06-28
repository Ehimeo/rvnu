import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, Plus, Bot, X, Send,
  Bell, Clock, Trash2, Edit2, Sparkles, CalendarDays,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { useCalendar } from '../hooks/useCalendar'
import { useWeather } from '../hooks/useWeather'
import EventModal from '../components/EventModal'
import { cn } from '../utils/cn'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const OCCASION_DOT = {
  casual: 'bg-blue-400',
  work: 'bg-indigo-500',
  school: 'bg-amber-400',
  church: 'bg-purple-400',
  party: 'bg-pink-400',
  'date-night': 'bg-red-400',
  gym: 'bg-green-400',
  travel: 'bg-cyan-400',
  wedding: 'bg-rose-400',
  outdoor: 'bg-emerald-400',
}

const OCCASION_BADGE = {
  casual: 'bg-blue-100 text-blue-700',
  work: 'bg-indigo-100 text-indigo-700',
  school: 'bg-amber-100 text-amber-700',
  church: 'bg-purple-100 text-purple-700',
  party: 'bg-pink-100 text-pink-700',
  'date-night': 'bg-red-100 text-red-700',
  gym: 'bg-green-100 text-green-700',
  travel: 'bg-cyan-100 text-cyan-700',
  wedding: 'bg-rose-100 text-rose-700',
  outdoor: 'bg-emerald-100 text-emerald-700',
}

const OCCASION_ICONS = {
  casual: '👕', work: '💼', school: '📚', church: '⛪',
  party: '🎉', 'date-night': '🌹', gym: '💪', travel: '✈️',
  wedding: '💍', outdoor: '🌿',
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()
  const days = []
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: new Date(year, month - 1, daysInPrev - i), overflow: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ date: new Date(year, month, d), overflow: false })
  }
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), overflow: true })
  }
  return days
}

function toLocalISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatTime(time) {
  if (!time) return 'All day'
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 || 12
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatEventDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function getTimeUntil(dateStr, time) {
  const eventTime = new Date(`${dateStr}T${time || '23:59'}`)
  const now = new Date()
  const diff = eventTime - now
  if (diff < 0) return 'Past'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `in ${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `in ${hrs}h`
  const days = Math.floor(hrs / 24)
  return `in ${days}d`
}

export default function Calendar({ profile }) {
  const navigate = useNavigate()
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(toLocalISO(today))
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your calendar assistant. Ask me about your schedule, get outfit suggestions for upcoming events, or let me help you plan your week.",
    },
  ])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  const { events, addEvent, updateEvent, deleteEvent, upcomingReminders } = useCalendar()
  const { weather } = useWeather(profile?.lat, profile?.lon)

  const calDays = getCalendarDays(viewYear, viewMonth)
  const todayISO = toLocalISO(today)

  const dayEvents = events.filter(e => e.date === selectedDate)

  const upcomingEvents = events
    .filter(e => e.date >= todayISO)
    .slice(0, 5)

  const eventsOnDay = useCallback((dateISO) =>
    events.filter(e => e.date === dateISO), [events])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function handleDayClick(dateObj) {
    setSelectedDate(toLocalISO(dateObj))
  }

  function openAddModal() {
    setEditingEvent(null)
    setModalOpen(true)
  }

  function openEditModal(ev) {
    setEditingEvent(ev)
    setModalOpen(true)
  }

  function handleSaveEvent(form) {
    if (editingEvent) updateEvent(editingEvent.id, form)
    else addEvent(form)
    setModalOpen(false)
    setEditingEvent(null)
  }

  function handleDeleteEvent(id) {
    deleteEvent(id)
    setModalOpen(false)
    setEditingEvent(null)
  }

  async function sendMessage() {
    const text = inputText.trim()
    if (!text || sending) return
    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInputText('')
    setSending(true)

    try {
      const res = await fetch('/api/calendar-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          profile,
          weather,
          events,
          currentDate: today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't connect right now. Try again in a moment." }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting. Please check your network and try again." }])
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [messages, chatOpen])

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 200)
  }, [chatOpen])

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const selectedLabel = selectedDate === todayISO
    ? 'Today'
    : new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="pb-6 space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Your schedule,</p>
          <h1 className="text-xl font-bold leading-tight">Calendar</h1>
        </div>
        <button
          onClick={() => navigate('/profiles')}
          className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground hover:bg-muted/80 transition-colors"
        >
          {profile?.name?.[0]?.toUpperCase() ?? '?'}
        </button>
      </div>

      {/* Reminders banner */}
      {upcomingReminders.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
          <Bell className="h-4 w-4 text-primary flex-shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary leading-tight">
              {upcomingReminders.length === 1
                ? `Reminder: "${upcomingReminders[0].title}"`
                : `${upcomingReminders.length} reminders coming up`}
            </p>
            {upcomingReminders.length === 1 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTime(upcomingReminders[0].time)} · {getTimeUntil(upcomingReminders[0].date, upcomingReminders[0].time)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Calendar card */}
      <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">
        {/* Month navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <button
            onClick={prevMonth}
            className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-sm font-semibold">{monthName}</h2>
          <button
            onClick={nextMonth}
            className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border/40">
          {WEEKDAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {calDays.map(({ date, overflow }, i) => {
            const iso = toLocalISO(date)
            const isSelected = iso === selectedDate
            const isToday = iso === todayISO
            const dayEvts = eventsOnDay(iso)
            const hasEvents = dayEvts.length > 0

            return (
              <button
                key={i}
                onClick={() => handleDayClick(date)}
                className={cn(
                  'flex flex-col items-center py-2 gap-1 transition-all relative',
                  overflow ? 'opacity-30' : 'opacity-100',
                  isSelected
                    ? 'bg-primary/10'
                    : 'hover:bg-muted/60',
                )}
              >
                <span
                  className={cn(
                    'h-7 w-7 flex items-center justify-center rounded-full text-xs font-medium transition-all',
                    isSelected && isToday && 'bg-primary text-primary-foreground',
                    isSelected && !isToday && 'bg-primary/20 text-primary font-semibold',
                    !isSelected && isToday && 'bg-primary/10 text-primary font-semibold',
                    !isSelected && !isToday && 'text-foreground',
                  )}
                >
                  {date.getDate()}
                </span>
                {/* Event dots */}
                {hasEvents && (
                  <div className="flex items-center gap-0.5 h-1.5">
                    {dayEvts.slice(0, 3).map((ev, j) => (
                      <span
                        key={j}
                        className={cn('h-1.5 w-1.5 rounded-full', OCCASION_DOT[ev.occasion] ?? 'bg-primary')}
                      />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day events */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{selectedLabel}</h3>
            <p className="text-xs text-muted-foreground">{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>

        {dayEvents.length === 0 ? (
          <div className="rounded-2xl border border-border/50 border-dashed py-8 flex flex-col items-center gap-2 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No events on this day</p>
            <button
              onClick={openAddModal}
              className="text-xs text-primary font-medium hover:underline"
            >
              Add your first event
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {dayEvents.map(ev => (
              <EventCard
                key={ev.id}
                event={ev}
                onEdit={() => openEditModal(ev)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Upcoming events */}
      {upcomingEvents.filter(e => e.date !== selectedDate).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Coming Up</h3>
          <div className="space-y-2">
            {upcomingEvents
              .filter(e => e.date !== selectedDate)
              .map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onEdit={() => openEditModal(ev)}
                  showDate
                />
              ))}
          </div>
        </div>
      )}

      {/* AI Assistant FAB */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-24 right-4 z-30 h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Event Modal */}
      {modalOpen && (
        <EventModal
          event={editingEvent}
          defaultDate={selectedDate}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => { setModalOpen(false); setEditingEvent(null) }}
        />
      )}

      {/* AI Chat Sheet */}
      {chatOpen && (
        <ChatSheet
          messages={messages}
          inputText={inputText}
          setInputText={setInputText}
          onSend={sendMessage}
          sending={sending}
          onClose={() => setChatOpen(false)}
          chatEndRef={chatEndRef}
          inputRef={inputRef}
        />
      )}
    </div>
  )
}

function EventCard({ event, onEdit, showDate = false }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-card border border-border/50 px-4 py-3 hover:border-primary/30 transition-colors">
      <div className={cn('h-8 w-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5', OCCASION_BADGE[event.occasion] ?? 'bg-muted text-muted-foreground')}>
        {OCCASION_ICONS[event.occasion] ?? '📅'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight truncate">{event.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {showDate && (
            <span className="text-xs text-muted-foreground">{formatEventDate(event.date)}</span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <Clock className="h-3 w-3" />
            {formatTime(event.time)}
          </span>
          {event.time && (
            <span className="text-xs font-medium text-primary/70">
              {getTimeUntil(event.date, event.time)}
            </span>
          )}
        </div>
        {event.notes ? (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{event.notes}</p>
        ) : null}
      </div>
      <button
        onClick={onEdit}
        className="h-8 w-8 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors flex-shrink-0"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

function ChatSheet({ messages, inputText, setInputText, onSend, sending, onClose, chatEndRef, inputRef }) {
  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 glass flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Calendar Assistant</p>
            <p className="text-xs text-muted-foreground">Powered by Claude</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/70 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex',
              msg.role === 'user' ? 'justify-end' : 'justify-start',
            )}
          >
            {msg.role === 'assistant' && (
              <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-card border border-border/50 text-foreground rounded-tl-sm',
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            "What's on my schedule this week?",
            "Suggest an outfit for my next event",
            "What should I wear today?",
            "Remind me what's coming up",
          ].map(prompt => (
            <button
              key={prompt}
              onClick={() => { setInputText(prompt); setTimeout(() => inputRef.current?.focus(), 50) }}
              className="flex-shrink-0 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/70 transition-colors whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-border/50 glass flex-shrink-0 flex items-center gap-2">
        <input
          ref={inputRef}
          className="flex-1 rounded-xl bg-muted px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Ask about your schedule..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKey}
          disabled={sending}
        />
        <button
          onClick={onSend}
          disabled={!inputText.trim() || sending}
          className="h-11 w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
