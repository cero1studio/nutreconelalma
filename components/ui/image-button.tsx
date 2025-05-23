"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface ImageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "purple" | "green"
  text: string
  className?: string
  loading?: boolean
}

const buttonImages = {
  purple: {
    INGRESAR: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/botones-11-LmLzbKjcyDja9MLxeyaNlU1Ccd1bLW.png",
    "EDITAR DATOS":
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/botones-07-LqO4vndWhoeGWg3MRXtlRxuSOT8O8U.png",
    "IR A CALCULADORA":
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/botones-12-A7MOY8BktAKLO1fldlXfJmb74IwidE.png",
    GUARDAR: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/botones-09-LkhHdROGvTrFiFi4TW6RJopQlIAwim.png",
  },
  green: {
    CALCULAR: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/botones-08-1j83tEvXqCUMVCrnjEl5K2kMQiyivx.png",
    DESCARGAR: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/botones-10-jJYsypaqxnISZnkMKvBuYt1efsODHM.png",
  },
}

export function ImageButton({ variant, text, className, loading, ...props }: ImageButtonProps) {
  const buttonStyle = {
    background: `url(${
      variant === "purple"
        ? buttonImages.purple[text] || buttonImages.purple.GUARDAR
        : buttonImages.green[text] || buttonImages.green.CALCULAR
    }) no-repeat center center`,
    backgroundSize: "contain",
    width: "100%",
    maxWidth: "240px",
    height: "48px",
    border: "none",
    color: "transparent",
    cursor: loading ? "wait" : "pointer",
    opacity: loading ? 0.7 : 1,
  }

  return (
    <button
      type="button"
      className={cn("transition-opacity hover:opacity-90 mx-auto", className)}
      style={buttonStyle}
      disabled={loading}
      aria-label={text}
      {...props}
    >
      <span className="sr-only">{loading ? "Cargando..." : text}</span>
    </button>
  )
}
