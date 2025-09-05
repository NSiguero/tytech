"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  mode?: "single"
  initialFocus?: boolean
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  ...props
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date())
  const today = new Date()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Generate calendar grid
  const calendarDays = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day))
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString()
  }

  const isDisabled = (date: Date) => {
    return disabled ? disabled(date) : false
  }

  const handleDateClick = (date: Date) => {
    if (!isDisabled(date)) {
      onSelect?.(date)
    }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <div className={cn("p-4 bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold text-gray-900">
          {MONTHS[month]} {year}
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0 hover:bg-gray-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-semibold text-gray-600 uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-10" />
          }

          const isCurrentDay = isToday(date)
          const isSelectedDay = isSelected(date)
          const isDisabledDay = isDisabled(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              disabled={isDisabledDay}
              className={cn(
                "h-10 w-full rounded-md text-sm font-medium transition-all duration-200",
                "hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                {
                  // Today styling
                  "bg-blue-100 text-blue-900 border border-blue-300 font-bold": isCurrentDay && !isSelectedDay,
                  // Selected styling
                  "bg-blue-600 text-white hover:bg-blue-700": isSelectedDay,
                  // Disabled styling
                  "text-gray-300 cursor-not-allowed hover:bg-transparent": isDisabledDay,
                  // Normal day styling
                  "text-gray-900 hover:bg-blue-50": !isCurrentDay && !isSelectedDay && !isDisabledDay,
                }
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Hoy: {today.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
export type { CalendarProps }