"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCalculatorStore } from "@/lib/store"
import { Edit, Trash2 } from "lucide-react"

export default function HistoryView() {
  const { calculationHistory, deleteCalculation, setValues } = useCalculatorStore()
  const [selectedCalculation, setSelectedCalculation] = useState<string | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleEdit = (id: string) => {
    const calculation = calculationHistory.find((calc) => calc.id === id)
    if (calculation) {
      setValues(calculation)
      setSelectedCalculation(id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Cálculos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Manual</TableHead>
              <TableHead>Automatizado</TableHead>
              <TableHead>Diferencia</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calculationHistory.map((calc) => (
              <TableRow key={calc.id} className={selectedCalculation === calc.id ? "bg-blue-100" : ""}>
                <TableCell>{new Date(calc.date).toLocaleDateString()}</TableCell>
                <TableCell>{calc.populationType}</TableCell>
                <TableCell>{formatCurrency(calc.manualTotal)}</TableCell>
                <TableCell>{formatCurrency(calc.automatedTotal)}</TableCell>
                <TableCell>{calc.differencePercentage.toFixed(2)}%</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(calc.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteCalculation(calc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
