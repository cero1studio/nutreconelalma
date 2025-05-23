"use client"

import { Check, Save, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface SaveStatusProps {
  lastSaved: Date | null
  isSaving: boolean
  hasChanges: boolean
  onSave?: () => void
  className?: string
}

export function SaveStatus({ lastSaved, isSaving, hasChanges, onSave, className }: SaveStatusProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {isSaving ? (
        <>
          <Save className="h-4 w-4 animate-pulse text-yellow-500" />
          <span className="text-yellow-500">Guardando...</span>
        </>
      ) : hasChanges ? (
        <>
          <Clock className="h-4 w-4 text-yellow-500" />
          <span className="text-yellow-500">Cambios sin guardar</span>
          {onSave && (
            <button onClick={onSave} className="text-blue-500 hover:text-blue-700 underline text-xs ml-2">
              Guardar ahora
            </button>
          )}
        </>
      ) : lastSaved ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-500">Guardado a las {formatTime(lastSaved)}</span>
        </>
      ) : null}
    </div>
  )
}
