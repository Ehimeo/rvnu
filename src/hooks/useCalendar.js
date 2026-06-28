import { useState, useCallback } from 'react'
import { loadCalendarEvents, saveCalendarEvents } from '../data/store'

export function useCalendar() {
  const [events, setEvents] = useState(() => loadCalendarEvents())

  const sync = useCallback(() => {
    const fresh = loadCalendarEvents()
    setEvents(fresh)
    return fresh
  }, [])

  const addEvent = useCallback((event) => {
    const newEvent = {
      id: crypto.randomUUID(),
      title: '',
      date: '',
      time: '',
      occasion: 'casual',
      notes: '',
      reminderMinutes: 60,
      ...event,
      createdAt: new Date().toISOString(),
    }
    const updated = [...loadCalendarEvents(), newEvent].sort(
      (a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`)
    )
    saveCalendarEvents(updated)
    setEvents(updated)
    return newEvent
  }, [])

  const updateEvent = useCallback((id, changes) => {
    const updated = loadCalendarEvents()
      .map(e => (e.id === id ? { ...e, ...changes } : e))
      .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`))
    saveCalendarEvents(updated)
    setEvents(updated)
  }, [])

  const deleteEvent = useCallback((id) => {
    const updated = loadCalendarEvents().filter(e => e.id !== id)
    saveCalendarEvents(updated)
    setEvents(updated)
  }, [])

  const upcomingReminders = events.filter(e => {
    if (!e.reminderMinutes) return false
    const eventTime = new Date(`${e.date}T${e.time || '23:59'}`).getTime()
    const reminderTime = eventTime - e.reminderMinutes * 60 * 1000
    const now = Date.now()
    return now >= reminderTime && now < eventTime
  })

  const todayEvents = events.filter(e => {
    const today = new Date().toISOString().slice(0, 10)
    return e.date === today
  })

  return { events, addEvent, updateEvent, deleteEvent, upcomingReminders, todayEvents, sync }
}
