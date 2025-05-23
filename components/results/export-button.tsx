"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Loader2 } from "lucide-react"
import { useCalculatorStore } from "@/lib/store"

export default function ExportButton() {
  const [isExporting, setIsExporting] = useState(false)
  const { currentResult } = useCalculatorStore()

  if (!currentResult) return null

  const handleExport = (format: "pdf" | "excel") => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)

      // Create a fake download
      const element = document.createElement("a")
      element.href = "#"
      element.download = `nutricion-hospitalaria-${format === "pdf" ? "reporte.pdf" : "datos.xlsx"}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 1500)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isExporting} className="rounded-full">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icono-flpRMN2ycwhIxI7kSP9XgcDIyYzD41.png"
            alt="PDF"
            className="mr-2 h-4 w-4"
          />
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icono-flpRMN2ycwhIxI7kSP9XgcDIyYzD41.png"
            alt="Excel"
            className="mr-2 h-4 w-4"
          />
          Exportar como Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
