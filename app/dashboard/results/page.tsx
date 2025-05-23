"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import ResultsTable from "@/components/results/results-table"
import ResultsChart from "@/components/results/results-chart"
import ExportButton from "@/components/results/export-button"
import { useCalculatorStore } from "@/lib/store"
import { ArrowLeft, Save } from "lucide-react"
import Swal from "sweetalert2"

export default function ResultsPage() {
  const router = useRouter()
  const { currentResult, saveCalculation } = useCalculatorStore()

  useEffect(() => {
    if (!currentResult) {
      router.push("/dashboard/calculator")
    }
  }, [currentResult, router])

  if (!currentResult) {
    return null
  }

  const handleSave = () => {
    // Guardar el cálculo en el store (que a su vez lo guarda en localStorage)
    saveCalculation()

    // Mostrar confirmación
    Swal.fire({
      title: "Guardado",
      text: "Los resultados han sido guardados exitosamente en el almacenamiento local",
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      router.push("/dashboard/history")
    })
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Resultados del Cálculo</h1>
        <p className="text-gray-600 mt-2">Comparación entre central de mezclas manual y automatizada</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ResultsChart />
        <ResultsTable />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/calculator")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Editar Datos
        </Button>

        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
          <ExportButton />
        </div>
      </div>
    </div>
  )
}
