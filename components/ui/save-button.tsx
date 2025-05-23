"use client"

import { useState } from "react"
import { ImageButton } from "@/components/ui/image-button"
import { Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SaveButtonProps {
  onSave: () => void
  className?: string
  text?: string
}

export function SaveButton({ onSave, className, text = "GUARDAR" }: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await onSave()

      // Mostrar indicador de éxito
      setShowSuccess(true)
      toast({
        title: "Guardado exitoso",
        description: "Los cambios han sido guardados correctamente",
        duration: 3000,
      })

      // Ocultar el indicador después de 1.5 segundos
      setTimeout(() => {
        setShowSuccess(false)
      }, 1500)
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative">
      <ImageButton variant="purple" text={text} onClick={handleSave} loading={isSaving} className={className} />
      {showSuccess && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}
