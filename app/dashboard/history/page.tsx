"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Eye, Trash2 } from "lucide-react"
import { useCalculatorStore } from "@/lib/store"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function HistoryPage() {
  const router = useRouter()
  const { calculationHistory, deleteCalculation, setValues } = useCalculatorStore()
  const [populationFilter, setPopulationFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("COP", "$")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "dd/MM/yyyy HH:mm", { locale: es })
  }

  const filteredHistory = calculationHistory.filter((calc) => {
    const matchesPopulation = populationFilter === "all" || calc.populationType === populationFilter
    const matchesDate = !dateFilter || calc.date.includes(dateFilter)
    return matchesPopulation && matchesDate
  })

  const handleViewDetails = (calculation: any) => {
    setValues(calculation)
    router.push("/dashboard/calculator")
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Historial de Cálculos</h1>
        <p className="text-gray-600 mt-2">Revise y gestione sus cálculos anteriores</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre el historial por tipo de población o fecha</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <Select value={populationFilter} onValueChange={setPopulationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo de población" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Adulto">Adulto</SelectItem>
                  <SelectItem value="Pediátrico">Pediátrico</SelectItem>
                  <SelectItem value="Neonatal">Neonatal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-1/2">
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="Filtrar por fecha"
                  className="pl-10"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredHistory.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Manual</TableHead>
                  <TableHead>Automatizado</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((calc) => (
                  <TableRow key={calc.id}>
                    <TableCell>{calc.name}</TableCell>
                    <TableCell>{formatDate(calc.date)}</TableCell>
                    <TableCell>{calc.populationType}</TableCell>
                    <TableCell>{formatCurrency(calc.manualTotal)}</TableCell>
                    <TableCell>{formatCurrency(calc.automatedTotal)}</TableCell>
                    <TableCell className={calc.differencePercentage > 40 ? "text-green-600 font-medium" : ""}>
                      {calc.differencePercentage.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(calc)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteCalculation(calc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No hay cálculos en el historial</p>
            <Button onClick={() => router.push("/dashboard/calculator")}>Crear nuevo cálculo</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
