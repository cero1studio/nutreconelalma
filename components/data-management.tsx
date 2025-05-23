import type React from "react"
import { useCalculatorStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export function DataManagement() {
  const { exportToJSON, importFromJSON } = useCalculatorStore()

  const handleExport = () => {
    const jsonData = exportToJSON()
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "calculator-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        importFromJSON(content)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="flex gap-4">
      <Button onClick={handleExport}>Exportar datos</Button>
      <input type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} id="import-json" />
      <label htmlFor="import-json">
        <Button as="span">Importar datos</Button>
      </label>
    </div>
  )
}
