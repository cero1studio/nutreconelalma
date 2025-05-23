"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCalculatorStore } from "@/lib/store"
import { useEffect, useState } from "react"

export default function ResultsTable() {
  const [result, setResult] = useState(null)
  const [differenceThreshold, setDifferenceThreshold] = useState(0)

  const currentResult = useCalculatorStore((state) => state.currentResult)
  const diffThreshold = useCalculatorStore((state) => state.differenceThreshold)
  const dailyProduction = useCalculatorStore((state) => state.dailyProduction)

  useEffect(() => {
    setResult(currentResult)
    setDifferenceThreshold(diffThreshold)
  }, [currentResult, diffThreshold])

  if (!result) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value)
  }

  const isHighDifference = result.differencePercentage > differenceThreshold

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desglose de Costos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Concepto</TableHead>
              <TableHead>Central Manual</TableHead>
              <TableHead>Central Automatizada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Total por unidad</TableCell>
              <TableCell>{formatCurrency(result.manualTotal / dailyProduction)}</TableCell>
              <TableCell>{formatCurrency(result.automatedTotal / dailyProduction)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total diario</TableCell>
              <TableCell>{formatCurrency(result.manualTotal)}</TableCell>
              <TableCell>{formatCurrency(result.automatedTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Adulto</TableCell>
              <TableCell>{formatCurrency(result.adultTotal)}</TableCell>
              <TableCell>{formatCurrency(result.adultTotal * (1 - result.differencePercentage / 100))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Pediátrico</TableCell>
              <TableCell>{formatCurrency(result.pediatricTotal)}</TableCell>
              <TableCell>{formatCurrency(result.pediatricTotal * (1 - result.differencePercentage / 100))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Neonatal</TableCell>
              <TableCell>{formatCurrency(result.neonatalTotal)}</TableCell>
              <TableCell>{formatCurrency(result.neonatalTotal * (1 - result.differencePercentage / 100))}</TableCell>
            </TableRow>
            <TableRow className={isHighDifference ? "bg-green-50" : ""}>
              <TableCell className="font-bold">Diferencia</TableCell>
              <TableCell colSpan={2} className={`text-center font-bold ${isHighDifference ? "text-green-600" : ""}`}>
                {formatCurrency(result.difference)} ({result.differencePercentage.toFixed(2)}%)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
