"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "@/components/ui/use-toast"

interface AutoSaveOptions {
  onSave: () => void
  saveInterval?: number
  showToast?: boolean
  saveOnUnmount?: boolean
}

export function useAutoSave({
  onSave,
  saveInterval = 5000, // 5 segundos por defecto
  showToast = true,
  saveOnUnmount = true,
}: AutoSaveOptions) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const onSaveRef = useRef(onSave)

  // Actualizar la referencia cuando cambie la función onSave
  useEffect(() => {
    onSaveRef.current = onSave
  }, [onSave])

  // Función para marcar que hay cambios pendientes
  const markAsChanged = () => {
    setHasChanges(true)
  }

  // Función para guardar manualmente
  const saveNow = async () => {
    if (!hasChanges) return

    setIsSaving(true)
    try {
      await onSaveRef.current()
      setLastSaved(new Date())
      setHasChanges(false)

      if (showToast) {
        toast({
          title: "Guardado automático",
          description: "Los cambios han sido guardados",
          duration: 2000,
        })
      }
    } catch (error) {
      console.error("Error al guardar automáticamente:", error)
      if (showToast) {
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar los cambios",
          variant: "destructive",
          duration: 3000,
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Configurar el guardado automático
  useEffect(() => {
    // Función para programar el guardado
    const scheduleSave = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(() => {
        if (hasChanges) {
          saveNow()
        }
      }, saveInterval)
    }

    // Si hay cambios, programar un guardado
    if (hasChanges) {
      scheduleSave()
    }

    // Limpiar el timeout al desmontar
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [hasChanges, saveInterval])

  // Guardar al desmontar el componente
  useEffect(() => {
    return () => {
      if (saveOnUnmount && hasChanges) {
        onSaveRef.current()
      }
    }
  }, [saveOnUnmount, hasChanges])

  return {
    lastSaved,
    isSaving,
    hasChanges,
    markAsChanged,
    saveNow,
  }
}
