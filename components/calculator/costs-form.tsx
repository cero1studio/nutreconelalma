"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ImageButton } from "@/components/ui/image-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useCalculatorStore } from "@/lib/store"
import { SaveButton } from "@/components/ui/save-button"
import { useToast } from "@/components/ui/use-toast"
import debounce from "lodash/debounce"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function CostsForm() {
  const [activeTab, setActiveTab] = useState("manual")
  const [activeMaterialTab, setActiveMaterialTab] = useState("materiales")
  const [activeManualTab, setActiveManualTab] = useState("proteccion")
  const [activeAutomatedTab, setActiveAutomatedTab] = useState("equipos")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Estado para manejar los valores de los campos
  const [inputValues, setInputValues] = useState<Record<string, { cantidad: string; costoUnitario: string }>>({})
  const store = useCalculatorStore()

  // Recuperar el estado de las pestañas del localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("activeCostsTab")
    const savedMaterialTab = localStorage.getItem("activeMaterialTab")
    const savedManualTab = localStorage.getItem("activeManualTab")
    const savedAutomatedTab = localStorage.getItem("activeAutomatedTab")

    if (savedTab) setActiveTab(savedTab)
    if (savedMaterialTab) setActiveMaterialTab(savedMaterialTab)
    if (savedManualTab) setActiveManualTab(savedManualTab)
    if (savedAutomatedTab) setActiveAutomatedTab(savedAutomatedTab)
  }, [])

  // Guardar el estado de las pestañas cuando cambian
  useEffect(() => {
    localStorage.setItem("activeCostsTab", activeTab)
    localStorage.setItem("activeMaterialTab", activeMaterialTab)
    localStorage.setItem("activeManualTab", activeManualTab)
    localStorage.setItem("activeAutomatedTab", activeAutomatedTab)
  }, [activeTab, activeMaterialTab, activeManualTab, activeAutomatedTab])

  // Modifica el useEffect para incluir los valores correctos de producción
  useEffect(() => {
    const initialValues: Record<string, { cantidad: string; costoUnitario: string }> = {}

    // Cargar valores de mantenimiento automatizado con cantidades y costos unitarios correctos
    initialValues["validacionAireAuto"] = {
      cantidad: "1.0",
      costoUnitario: "10000000",
    }
    initialValues["pruebasMicroAuto"] = {
      cantidad: "12.0",
      costoUnitario: "4000000",
    }
    initialValues["llenadosAsepticosAuto"] = {
      cantidad: "6.0",
      costoUnitario: "1000000",
    }
    initialValues["desafioDesinfectantesAuto"] = {
      cantidad: "1.0",
      costoUnitario: "1000000",
    }
    initialValues["mantCabinasAuto"] = {
      cantidad: "6.0",
      costoUnitario: "2000000",
    }
    initialValues["calificacionCabinasAuto"] = {
      cantidad: "3.0",
      costoUnitario: "2500000",
    }
    initialValues["calibracionManometrosAuto"] = {
      cantidad: "10.0",
      costoUnitario: "400000",
    }
    initialValues["cambiosFiltrosAuto"] = {
      cantidad: "1.0",
      costoUnitario: "5000000",
    }
    initialValues["mantUMAAuto"] = {
      cantidad: "2.0",
      costoUnitario: "2000000",
    }
    initialValues["calibracionTermoAuto"] = {
      cantidad: "5.0",
      costoUnitario: "400000",
    }
    initialValues["mantLocativosAuto"] = {
      cantidad: "1.0",
      costoUnitario: "10000000",
    }

    // Cargar valores de mantenimiento manual con los mismos valores que el automatizado
    initialValues["validacionAire"] = {
      cantidad: "1.0",
      costoUnitario: "10000000",
    }
    initialValues["pruebasMicro"] = {
      cantidad: "12.0",
      costoUnitario: "4000000",
    }
    initialValues["llenadosAsepticos"] = {
      cantidad: "6.0",
      costoUnitario: "1000000",
    }
    initialValues["desafioDesinfectantes"] = {
      cantidad: "1.0",
      costoUnitario: "1000000",
    }
    initialValues["mantCabinas"] = {
      cantidad: "6.0",
      costoUnitario: "2000000",
    }
    initialValues["calificacionCabinas"] = {
      cantidad: "3.0",
      costoUnitario: "2500000",
    }
    initialValues["calibracionManometros"] = {
      cantidad: "10.0",
      costoUnitario: "400000",
    }
    initialValues["cambiosFiltros"] = {
      cantidad: "1.0",
      costoUnitario: "5000000",
    }
    initialValues["mantUMA"] = {
      cantidad: "2.0",
      costoUnitario: "2000000",
    }
    initialValues["calibracionTermo"] = {
      cantidad: "5.0",
      costoUnitario: "400000",
    }
    initialValues["mantLocativos"] = {
      cantidad: "1.0",
      costoUnitario: "10000000",
    }

    // Cargar valores de producción según la tabla proporcionada
    initialValues["agua"] = {
      cantidad: "1.0",
      costoUnitario: "2388262",
    }
    initialValues["luz"] = {
      cantidad: "1.0",
      costoUnitario: "6775277",
    }
    initialValues["manoObra"] = {
      cantidad: "1.0",
      costoUnitario: "4783964",
    }
    initialValues["telefono"] = {
      cantidad: "1.0",
      costoUnitario: "6688000",
    }
    initialValues["depreciacion"] = {
      cantidad: "1.0",
      costoUnitario: "63000",
    }

    // Cargar los mismos valores para la producción automatizada
    initialValues["aguaAuto"] = {
      cantidad: "1.0",
      costoUnitario: "2388262",
    }
    initialValues["luzAuto"] = {
      cantidad: "1.0",
      costoUnitario: "6775277",
    }
    initialValues["manoObraAuto"] = {
      cantidad: "1.0",
      costoUnitario: "4783964",
    }
    initialValues["telefonoAuto"] = {
      cantidad: "1.0",
      costoUnitario: "6688000",
    }
    initialValues["depreciacionAuto"] = {
      cantidad: "1.0",
      costoUnitario: "63000",
    }

    // Horas requeridas de trabajo al mes
    initialValues["horasRequeridas"] = {
      cantidad: "230",
      costoUnitario: "0",
    }

    // Valores de salarios
    initialValues["salarioQuimico"] = {
      cantidad: "4200000",
      costoUnitario: "1", // Personal requerido
    }
    initialValues["salarioAuxiliar"] = {
      cantidad: "900000",
      costoUnitario: "1", // Personal requerido
    }

    // Valores para la versión automatizada
    initialValues["salarioQuimicoAuto"] = {
      cantidad: "6405000",
      costoUnitario: "2", // Personal requerido
    }
    initialValues["salarioAuxiliarAuto"] = {
      cantidad: "1493100",
      costoUnitario: "1", // Personal requerido
    }

    // Horas de trabajo
    initialValues["horasQuimico"] = {
      cantidad: "0.25", // Horas dedicadas por NPT
      costoUnitario: "230", // Horas mensuales
    }
    initialValues["horasAuxiliar"] = {
      cantidad: "0.25", // Horas dedicadas por NPT
      costoUnitario: "230", // Horas mensuales
    }

    // Horas de trabajo para versión automatizada
    initialValues["horasQuimicoAuto"] = {
      cantidad: "0.08", // 4.8 minutos
      costoUnitario: "230", // Horas mensuales
    }
    initialValues["horasAuxiliarAuto"] = {
      cantidad: "0.08", // 4.8 minutos
      costoUnitario: "230", // Horas mensuales
    }

    // Personal requerido
    initialValues["personalQuimico"] = {
      cantidad: "2",
      costoUnitario: "0",
    }
    initialValues["personalQuimicoAuto"] = {
      cantidad: "2",
      costoUnitario: "0",
    }
    initialValues["personalAuxiliar"] = {
      cantidad: "1",
      costoUnitario: "0",
    }
    initialValues["personalAuxiliarAuto"] = {
      cantidad: "1",
      costoUnitario: "0",
    }

    setInputValues(initialValues)
  }, [])

  // Función para guardar automáticamente los cambios
  const saveChanges = debounce(() => {
    if (hasUnsavedChanges) {
      // Actualizar el store con los valores actuales
      updateStoreFromInputValues()
      setHasUnsavedChanges(false)
    }
  }, 1000)

  // Guardar automáticamente cuando hay cambios
  useEffect(() => {
    saveChanges()

    // Limpiar el debounce al desmontar
    return () => {
      saveChanges.cancel()
    }
  }, [hasUnsavedChanges])

  // Guardar al cambiar de pestaña o al salir de la página
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        saveChanges.flush() // Ejecutar inmediatamente sin esperar el debounce
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  // Función para actualizar el store con los valores actuales
  const updateStoreFromInputValues = () => {
    // Actualizar costos manuales
    const newManualCosts = { ...store.manualCosts }
    const newAutomatedCosts = { ...store.automatedCosts }

    // Mapear los IDs de los inputs a las propiedades del store
    const maintenanceMap: Record<string, keyof typeof newManualCosts.maintenanceCosts> = {
      validacionAire: "validacionSistemaAire",
      pruebasMicro: "pruebasMicrobiologia",
      llenadosAsepticos: "llenadosAsepticos",
      desafioDesinfectantes: "desafioDesinfectantes",
      mantCabinas: "mantenimientoCabinas",
      calificacionCabinas: "calificacionCabinas",
      calibracionManometros: "calibracionManometros",
      cambiosFiltros: "cambiosFiltrosUMA",
      mantUMA: "mantenimientosUMA",
      calibracionTermo: "calibracionTermohigrometros",
      mantLocativos: "mantenimientosLocativos",
    }

    // Actualizar costos de mantenimiento manual
    Object.entries(maintenanceMap).forEach(([inputId, storeKey]) => {
      if (inputValues[inputId]) {
        const cantidad = Number.parseFloat(inputValues[inputId]?.cantidad || "0")
        const costoUnitario = Number.parseFloat(inputValues[inputId]?.costoUnitario || "0")
        newManualCosts.maintenanceCosts[storeKey] = cantidad * costoUnitario
      }
    })

    // Actualizar costos de mantenimiento automatizado
    Object.entries(maintenanceMap).forEach(([inputId, storeKey]) => {
      const autoInputId = `${inputId}Auto`
      if (inputValues[autoInputId]) {
        const cantidad = Number.parseFloat(inputValues[autoInputId]?.cantidad || "0")
        const costoUnitario = Number.parseFloat(inputValues[autoInputId]?.costoUnitario || "0")
        newAutomatedCosts.maintenanceCosts[storeKey] = cantidad * costoUnitario
      }
    })

    // Actualizar costos de producción
    const productionMap: Record<string, keyof typeof newManualCosts.productionCosts> = {
      agua: "agua",
      luz: "luz",
      manoObra: "manoObraIndirecta",
      telefono: "telefonoInternet",
      depreciacion: "depreciacionCabina",
    }

    // Actualizar costos de producción manual
    Object.entries(productionMap).forEach(([inputId, storeKey]) => {
      if (inputValues[inputId]) {
        const cantidad = Number.parseFloat(inputValues[inputId]?.cantidad || "0")
        const costoUnitario = Number.parseFloat(inputValues[inputId]?.costoUnitario || "0")
        newManualCosts.productionCosts[storeKey] = cantidad * costoUnitario
      }
    })

    // Actualizar costos de producción automatizado
    Object.entries(productionMap).forEach(([inputId, storeKey]) => {
      const autoInputId = `${inputId}Auto`
      if (inputValues[autoInputId]) {
        const cantidad = Number.parseFloat(inputValues[autoInputId]?.cantidad || "0")
        const costoUnitario = Number.parseFloat(inputValues[autoInputId]?.costoUnitario || "0")
        newAutomatedCosts.productionCosts[storeKey] = cantidad * costoUnitario
      }
    })

    // Actualizar costos de personal
    if (inputValues["salarioQuimico"] && inputValues["personalQuimico"]) {
      // Cálculo dinámico para el químico farmacéutico
      const salarioBasico = Number.parseFloat(inputValues["salarioQuimico"]?.cantidad || "0")
      const salarioTotal = salarioBasico * 1.53 // Factor para incluir todos los parafiscales
      const personalRequerido = Number.parseFloat(inputValues["personalQuimico"]?.cantidad || "2")
      const porcentajeTiempo = 0.25 // Valor fijo de 25%

      newManualCosts.personnelCosts.salarioFarmaceutico = salarioTotal
      newManualCosts.personnelCosts.horasFarmaceutico = porcentajeTiempo
      // El costo por hora ya incluye el personal requerido en el cálculo
    }

    if (inputValues["salarioAuxiliar"] && inputValues["personalAuxiliar"]) {
      // Cálculo dinámico para el auxiliar de farmacia
      const salarioBasico = Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "0")
      // Incluir subsidio de transporte (117,000) en el cálculo
      const subsidioTransporte = 117000
      const parafiscales = salarioBasico * 0.53 // 53% de parafiscales
      const salarioTotal = salarioBasico + parafiscales + subsidioTransporte
      const personalRequerido = Number.parseFloat(inputValues["personalAuxiliar"]?.cantidad || "1")
      const porcentajeTiempo = 0.25 // Valor fijo de 25%

      newManualCosts.personnelCosts.salarioEnfermeria = salarioTotal
      newManualCosts.personnelCosts.horasEnfermeria = porcentajeTiempo
      // El costo por hora ya incluye el personal requerido en el cálculo
    }

    // Para el sistema manual, usamos valores fijos
    newManualCosts.personnelCosts.horasFarmaceutico = Number.parseFloat(inputValues["horasQuimico"]?.cantidad || "0.25")
    newManualCosts.personnelCosts.horasEnfermeria = Number.parseFloat(inputValues["horasAuxiliar"]?.cantidad || "0.25")

    // Para el sistema automatizado, usamos los valores editables
    if (inputValues["horasQuimicoAuto"]) {
      const porcentajeTiempo = Number.parseFloat(inputValues["horasQuimicoAuto"]?.cantidad || "0.08")
      newAutomatedCosts.personnelCosts.horasFarmaceutico = porcentajeTiempo
    }

    if (inputValues["horasAuxiliarAuto"]) {
      const porcentajeTiempo = Number.parseFloat(inputValues["horasAuxiliarAuto"]?.cantidad || "0.08")
      newAutomatedCosts.personnelCosts.horasEnfermeria = porcentajeTiempo
    }

    // Actualizar el store
    store.setManualCosts(newManualCosts)
    store.setAutomatedCosts(newAutomatedCosts)
  }

  // Función para actualizar los valores de los campos
  const handleInputChange = (id: string, field: "cantidad" | "costoUnitario", value: string) => {
    setInputValues((prev) => {
      const updatedValues = {
        ...prev,
        [id]: {
          ...(prev[id] || { cantidad: "0", costoUnitario: "0" }),
          [field]: value,
        },
      }

      setHasUnsavedChanges(true)
      return updatedValues
    })
  }

  // Reemplazar la función calculateTotal con esta versión más segura
  const calculateTotal = (id: string) => {
    const values = inputValues[id] || { cantidad: "0", costoUnitario: "0" }

    // Función segura para evaluar fracciones
    const parseFraction = (value: string): number => {
      if (value.includes("/")) {
        const parts = value.split("/")
        if (parts.length === 2) {
          const numerator = Number.parseFloat(parts[0])
          const denominator = Number.parseFloat(parts[1])
          if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
            return numerator / denominator
          }
        }
      }
      return Number.parseFloat(value) || 0
    }

    const cantidad = parseFraction(values.cantidad)
    const costoUnitario = Number.parseFloat(values.costoUnitario) || 0
    return cantidad * costoUnitario
  }

  // Función para calcular el total de una sección
  const calculateSectionTotal = (ids: string[]) => {
    return ids.reduce((total, id) => {
      return total + calculateTotal(id)
    }, 0)
  }

  // Función especial para calcular el costo de los sets de transferencia
  const calculateTransferSetCost = (unitCost: number, productionDay: number): number => {
    if (!productionDay || productionDay === 0) return 0
    return unitCost / productionDay
  }

  // Modificar la función renderTotalRowWithSpecialCalc para incluir el cálculo especial
  const renderTotalRowWithSpecialCalc = (ids: string[], label = "Total", includeTransferSet = false) => (
    <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200 items-center">
      <div className="text-sm font-bold text-gray-700">{label}</div>
      <div className="col-span-2 text-right text-sm font-bold text-gray-700">Total:</div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
        <Input
          type="text"
          value={(calculateSectionTotal(ids) + (includeTransferSet ? calculateTransferSetCost(400000, 20) : 0))
            .toFixed(1)
            .replace(".", ",")}
          className="pl-8 rounded-full shadow-sm font-bold bg-gray-50"
          readOnly
        />
      </div>
    </div>
  )

  // Función para renderizar un campo de materiales (Cantidad, Costo unitario, Costo total)
  const renderMaterialField = (label: string, id: string, defaultQuantity = 0, defaultCost = 0) => {
    // Función para convertir una posible fracción a número decimal
    const parseFraction = (value: string): number => {
      if (value.includes("/")) {
        const [numerator, denominator] = value.split("/").map(Number)
        return numerator / denominator
      }
      return Number.parseFloat(value) || 0
    }

    // Initialize the input values if they don't exist yet
    if (!inputValues[id]) {
      // Si el defaultQuantity es una fracción como 1/60, lo mantenemos como string
      const defaultQuantityStr =
        typeof defaultQuantity === "number" && defaultQuantity === 1 / 60 ? "1/60" : defaultQuantity.toString()
      handleInputChange(id, "cantidad", defaultQuantityStr)
      handleInputChange(id, "costoUnitario", defaultCost.toString())
    }

    const quantity = inputValues[id]?.cantidad || (defaultQuantity === 1 / 60 ? "1/60" : defaultQuantity.toString())
    const costPerUnit = inputValues[id]?.costoUnitario || defaultCost.toString()
    // Para el cálculo, convertimos la posible fracción a decimal
    const quantityValue = parseFraction(quantity)
    const totalCost = quantityValue * Number.parseFloat(costPerUnit)

    return (
      <div className="grid grid-cols-4 gap-4 mb-4 items-center">
        <div className="text-sm text-gray-700">{label}</div>

        <div className="relative">
          <Input
            type="text"
            className="rounded-full shadow-sm"
            placeholder="0"
            defaultValue={quantity}
            onBlur={(e) => {
              handleInputChange(id, "cantidad", e.target.value || "0")
              setHasUnsavedChanges(true)
            }}
            step="0.0001"
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
          <Input
            type="number"
            className="pl-8 rounded-full shadow-sm"
            placeholder="0"
            value={costPerUnit}
            onChange={(e) => {
              // Importante: Mantener la cantidad actual al cambiar el costo unitario
              const currentValues = inputValues[id] || { cantidad: quantity, costoUnitario: "0" }
              handleInputChange(id, "costoUnitario", e.target.value)
              // Asegurarse de que la cantidad no se resetee
              if (currentValues.cantidad !== quantity) {
                handleInputChange(id, "cantidad", currentValues.cantidad)
              }
              setHasUnsavedChanges(true)
            }}
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
          <Input
            type="text"
            className="pl-8 rounded-full shadow-sm bg-gray-50"
            value={totalCost.toFixed(1).replace(".", ",")}
            readOnly
          />
        </div>
      </div>
    )
  }

  // Reemplaza la función renderCostoField para mostrar correctamente los valores
  const renderCostoField = (label: string, id: string) => {
    // Asegurarse de que los valores existan
    const cantidad = inputValues[id]?.cantidad || "0"
    const costoUnitario = inputValues[id]?.costoUnitario || "0"
    const costoTotal = Number.parseFloat(cantidad) * Number.parseFloat(costoUnitario)

    return (
      <div className="grid grid-cols-4 gap-4 mb-4 items-center">
        <div className="text-sm text-gray-700">{label}</div>

        <div className="relative">
          <Input
            type="number"
            className="rounded-full shadow-sm"
            placeholder="Cantidad"
            defaultValue={cantidad}
            onBlur={(e) => {
              handleInputChange(id, "cantidad", e.target.value || "0")
              setHasUnsavedChanges(true)
            }}
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
          <Input
            type="number"
            className="pl-8 rounded-full shadow-sm"
            placeholder="Costo unitario"
            value={costoUnitario}
            onChange={(e) => {
              // Importante: Mantener la cantidad actual al cambiar el costo unitario
              const currentValues = inputValues[id] || { cantidad: "0", costoUnitario: "0" }
              handleInputChange(id, "costoUnitario", e.target.value)
              // Asegurarse de que la cantidad no se resetee
              if (currentValues.cantidad !== cantidad) {
                handleInputChange(id, "cantidad", currentValues.cantidad)
              }
              setHasUnsavedChanges(true)
            }}
          />
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
          <Input
            type="text"
            className="pl-8 rounded-full shadow-sm bg-gray-50"
            value={costoTotal.toLocaleString("es-CO")}
            readOnly
          />
        </div>
      </div>
    )
  }

  // Reemplazar la función renderPersonalField con esta nueva versión:
  const renderValorHoraField = (label: string, salarioId: string) => {
    const horasRequeridas = Number.parseFloat(inputValues["horasRequeridas"]?.cantidad || "230")
    const salario = Number.parseFloat(inputValues[salarioId]?.cantidad || "0")
    const personalRequerido = Number.parseFloat(inputValues[salarioId]?.costoUnitario || "1")

    // Valor hora = salario / horas requeridas
    const valorHora = salario / horasRequeridas

    // Valor total = valor hora * personal requerido
    const valorTotal = valorHora * personalRequerido

    return (
      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
        <Label className="text-sm font-medium text-gray-700 mb-2">{label}</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="relative flex items-center">
            <span className="text-purple-600 mr-2">$</span>
            <Input
              type="text"
              className="rounded-full shadow-sm bg-gray-50"
              value={Math.round(valorHora).toLocaleString("es-CO")}
              readOnly
              title="Valor hora = Salario mensual / Horas requeridas"
            />
            <Label className="text-xs text-gray-500 mt-1">Valor hora</Label>
          </div>
          <div className="relative flex items-center">
            <span className="text-purple-600 mr-2">$</span>
            <Input
              type="text"
              className="rounded-full shadow-sm bg-gray-50"
              value={Math.round(valorTotal).toLocaleString("es-CO")}
              readOnly
              title="Valor total = Valor hora × Personal requerido"
            />
            <Label className="text-xs text-gray-500 mt-1">Valor total por hora</Label>
          </div>
        </div>
      </div>
    )
  }

  // Función para renderizar la fila de totales
  const renderTotalRow = (ids: string[], label = "Total") => (
    <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200 items-center">
      <div className="text-sm font-bold text-gray-700">{label}</div>

      <div className="col-span-2 text-right text-sm font-bold text-gray-700">Total:</div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
        <Input
          type="text"
          value={calculateSectionTotal(ids).toFixed(1).replace(".", ",")}
          className="pl-8 rounded-full shadow-sm font-bold bg-gray-50"
          readOnly
        />
      </div>
    </div>
  )

  // Reemplaza la función renderTotalCostoRow para calcular correctamente el total
  const renderTotalCostoRow = (ids: string[], label = "Total") => {
    const total = ids.reduce((sum, id) => {
      const cantidad = Number.parseFloat(inputValues[id]?.cantidad || "0")
      const costoUnitario = Number.parseFloat(inputValues[id]?.costoUnitario || "0")
      return sum + cantidad * costoUnitario
    }, 0)

    return (
      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200 items-center">
        <div className="text-sm font-bold text-gray-700">{label}</div>
        <div className="col-span-2 text-right text-sm font-bold text-gray-700">Total:</div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
          <Input
            type="text"
            value={total.toLocaleString("es-CO")}
            className="pl-8 rounded-full shadow-sm font-bold bg-gray-50"
            readOnly
          />
        </div>
      </div>
    )
  }

  // Función para renderizar el campo de salario
  const renderSalarioField = (label: string, id: string) => (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg">
      <Label className="text-sm font-medium text-gray-700 mb-2">{label}</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative flex items-center">
          <span className="text-purple-600 mr-2">$</span>
          <Input
            type="number"
            className="rounded-full shadow-sm"
            placeholder="0"
            value={inputValues[id]?.cantidad || ""}
            onChange={(e) => {
              handleInputChange(id, "cantidad", e.target.value)
              setHasUnsavedChanges(true)
            }}
          />
          <Label className="text-xs text-gray-500 mt-1">Salario mensual</Label>
        </div>
        <div className="relative">
          <Input
            type="number"
            className="rounded-full shadow-sm"
            placeholder="0"
            value={inputValues[id]?.costoUnitario || ""}
            onChange={(e) => {
              handleInputChange(id, "costoUnitario", e.target.value)
              setHasUnsavedChanges(true)
            }}
          />
          <Label className="text-xs text-gray-500 mt-1">Personal requerido</Label>
        </div>
      </div>
    </div>
  )

  // Función para guardar manualmente
  const handleManualSave = async () => {
    // Guardar los cambios actuales
    updateStoreFromInputValues()
    setHasUnsavedChanges(false)

    // Mostrar confirmación
    toast({
      title: "Cambios guardados",
      description: "Los cambios han sido guardados exitosamente",
      duration: 3000,
    })

    return Promise.resolve()
  }

  // Función para guardar y redirigir
  const handleSaveAndRedirect = async () => {
    // Guardar los cambios actuales
    updateStoreFromInputValues()
    setHasUnsavedChanges(false)

    // Mostrar confirmación
    toast({
      title: "Cambios guardados",
      description: "Los cambios han sido guardados exitosamente",
      duration: 3000,
    })

    // Redirigir a la calculadora
    router.push("/dashboard/calculator")
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4 sm:mb-0">CONFIGURACIÓN DE COSTOS</h1>
          <div className="flex gap-2">
            <SaveButton onSave={handleManualSave} className="w-auto" />
            <ImageButton
              variant="purple"
              text="IR A CALCULADORA"
              onClick={handleSaveAndRedirect}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Reemplazar la estructura de pestañas principal */}
          <Tabs
            defaultValue="manual"
            value={activeTab}
            onValueChange={(value) => {
              // Guardar los cambios actuales antes de cambiar de pestaña
              if (hasUnsavedChanges) {
                saveChanges.flush()
              }
              setActiveTab(value)
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual">Central de Mezclas Manual</TabsTrigger>
              <TabsTrigger value="automated">Central de Mezclas Automatizada</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6 mt-6">
              <Tabs
                defaultValue="materiales"
                value={activeMaterialTab}
                onValueChange={(value) => {
                  // Guardar los cambios actuales antes de cambiar de pestaña
                  if (hasUnsavedChanges) {
                    saveChanges.flush()
                  }
                  setActiveMaterialTab(value)
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="materiales">Materiales</TabsTrigger>
                  <TabsTrigger value="otros">Otros Costos</TabsTrigger>
                </TabsList>

                <TabsContent value="materiales" className="mt-6">
                  <Tabs
                    defaultValue="proteccion"
                    value={activeManualTab}
                    onValueChange={(value) => {
                      // Guardar los cambios actuales antes de cambiar de pestaña
                      if (hasUnsavedChanges) {
                        saveChanges.flush()
                      }
                      setActiveManualTab(value)
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="proteccion">Protección Personal</TabsTrigger>
                      <TabsTrigger value="higiene">Higiene y Limpieza</TabsTrigger>
                      <TabsTrigger value="esteril">Equipo Estéril</TabsTrigger>
                    </TabsList>

                    <TabsContent value="proteccion" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Materiales de Protección Personal</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad</div>
                        <div className="text-sm font-medium text-gray-700">Costo unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo total</div>
                      </div>

                      {renderMaterialField("Guantes Estériles desechables (par)", "guantes", 4.0, 500.0)}
                      {renderMaterialField("Bata Estéril de un solo uso", "bata", 2.0, 4000.0)}
                      {renderMaterialField("Gorro desechable", "gorro", 2.0, 300.0)}
                      {renderMaterialField("Mascarilla quirúrgica", "mascarilla", 2.0, 100.0)}
                      {renderMaterialField("Cubrezapatos desechables", "cubrezapatos", 2.0, 300.0)}
                      {renderTotalRow(
                        ["guantes", "bata", "gorro", "mascarilla", "cubrezapatos"],
                        "Total Materiales de Protección",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="higiene" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Materiales de Higiene y Limpieza</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad</div>
                        <div className="text-sm font-medium text-gray-700">Costo unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo total</div>
                      </div>

                      {renderMaterialField("Solución antiséptica para lavado de", "solucionAntiseptica", 0.0, 9000.0)}
                      {renderMaterialField("Paños estériles para limpieza de sup", "panosEsteriles", 1.0, 1000.0)}
                      {renderMaterialField("Alcohol al 70%", "alcohol70", 0.0, 1200.0)}
                      {renderMaterialField("Peróxido de hidrógeno acelerado", "peroxidoHidrogeno", "1/200", 70479.0)}
                      {renderMaterialField("Cloruro de benzalconio", "cloruroBenzalconio", "1/200", 55000.0)}
                      {renderTotalRow(
                        [
                          "solucionAntiseptica",
                          "panosEsteriles",
                          "alcohol70",
                          "peroxidoHidrogeno",
                          "cloruroBenzalconio",
                        ],
                        "Total Materiales de Higiene",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="esteril" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Equipo de Trabajo Estéril</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad</div>
                        <div className="text-sm font-medium text-gray-700">Costo unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo total</div>
                      </div>

                      {renderMaterialField("Jeringas 1ml", "jeringas1ml", 1.0, 400.0)}
                      {renderMaterialField("Jeringas 5ml", "jeringas5ml", 1.0, 400.0)}
                      {renderMaterialField("Jeringas 10ml", "jeringas10ml", 2.0, 400.0)}
                      {renderMaterialField("Jeringas 20ml", "jeringas20ml", 3.0, 500.0)}
                      {renderMaterialField("Jeringas 50ml", "jeringas50ml", 3.0, 2000.0)}
                      {renderMaterialField("Buretroles", "buretroles", 4.0, 2500.0)}
                      {renderMaterialField("Compresas Estériles", "compresasEsteriles", 1.0, 2000.0)}
                      {renderMaterialField("Gasas Estériles", "gasasEsteriles", 3.0, 200.0)}
                      {renderMaterialField("Etiquetas Estériles", "etiquetasEsteriles", 1.0, 5000.0)}
                      {renderMaterialField("Toallas Absorbentes", "toallasAbsorbentes", 0.1, 1000.0)}
                      {renderMaterialField("Contenedores de Residuos", "contenedoresResiduos", "1/60", 8000.0)}
                      {renderMaterialField("Agujas Estériles 16G - 18G", "agujasEsteriles", 10.0, 400.0)}
                      {renderMaterialField("Bolsa Roja", "bolsaRoja", 1.0, 500.0)}
                      {renderMaterialField("Bolsa Negra", "bolsaNegra", 1.0, 500.0)}
                      {renderMaterialField("Bolígrafos", "boligrafos", "1/60", 1500.0)}
                      {renderTotalRow(
                        [
                          "jeringas1ml",
                          "jeringas5ml",
                          "jeringas10ml",
                          "jeringas20ml",
                          "jeringas50ml",
                          "buretroles",
                          "compresasEsteriles",
                          "gasasEsteriles",
                          "etiquetasEsteriles",
                          "toallasAbsorbentes",
                          "contenedoresResiduos",
                          "agujasEsteriles",
                          "bolsaRoja",
                          "bolsaNegra",
                          "boligrafos",
                        ],
                        "Total Equipo Estéril",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="otros" className="mt-6">
                  <Tabs defaultValue="mantenimiento">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
                      <TabsTrigger value="produccion">Producción</TabsTrigger>
                    </TabsList>

                    <TabsContent value="mantenimiento" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Costos de Mantenimiento</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad (unidad)</div>
                        <div className="text-sm font-medium text-gray-700">Costo Unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo Total</div>
                      </div>

                      {renderCostoField("Validación Sistema de Aire", "validacionAire")}
                      {renderCostoField("Pruebas de Microbiología", "pruebasMicro")}
                      {renderCostoField("Llenados Asépticos", "llenadosAsepticos")}
                      {renderCostoField("Desafío de Desinfectantes", "desafioDesinfectantes")}
                      {renderCostoField("Mantenimiento de Cabinas", "mantCabinas")}
                      {renderCostoField("Calificación de Cabinas", "calificacionCabinas")}
                      {renderCostoField("Calibración de Manómetros", "calibracionManometros")}
                      {renderCostoField("Cambios de Filtros UMA", "cambiosFiltros")}
                      {renderCostoField("Mantenimientos UMA", "mantUMA")}
                      {renderCostoField("Calibración de Termohigrómetros", "calibracionTermo")}
                      {renderCostoField("Mantenimientos Locativos", "mantLocativos")}
                      {renderTotalCostoRow(
                        [
                          "validacionAire",
                          "pruebasMicro",
                          "llenadosAsepticos",
                          "desafioDesinfectantes",
                          "mantCabinas",
                          "calificacionCabinas",
                          "calibracionManometros",
                          "cambiosFiltros",
                          "mantUMA",
                          "calibracionTermo",
                          "mantLocativos",
                        ],
                        "Total Costos de Mantenimiento",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="produccion" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Costos de Producción</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-3 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Valor estimado</div>
                        <div className="text-sm font-medium text-gray-700">Valor unitario</div>
                      </div>

                      {renderCostoField("Agua", "agua")}
                      {renderCostoField("Luz", "luz")}
                      {renderCostoField("Mano de Obra Indirecta", "manoObra")}
                      {renderCostoField("Teléfono e Internet", "telefono")}
                      {renderCostoField("Depreciación de Cabina", "depreciacion")}
                      {renderTotalCostoRow(
                        ["agua", "luz", "manoObra", "telefono", "depreciacion"],
                        "Total Costos de Producción",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="automated" className="space-y-6 mt-6">
              <Tabs defaultValue="materiales" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="materiales">Materiales</TabsTrigger>
                  <TabsTrigger value="otros">Otros Costos</TabsTrigger>
                </TabsList>

                <TabsContent value="materiales" className="mt-6">
                  <Tabs
                    defaultValue="equipos"
                    value={activeAutomatedTab}
                    onValueChange={(value) => {
                      // Guardar los cambios actuales antes de cambiar de pestaña
                      if (hasUnsavedChanges) {
                        saveChanges.flush()
                      }
                      setActiveAutomatedTab(value)
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="equipos">Equipos Automatizados</TabsTrigger>
                      <TabsTrigger value="proteccion">Protección Personal</TabsTrigger>
                      <TabsTrigger value="higiene">Higiene y Limpieza</TabsTrigger>
                      <TabsTrigger value="esteril">Equipo Estéril</TabsTrigger>
                    </TabsList>

                    <TabsContent value="equipos" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Equipos Automatizados</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad</div>
                        <div className="text-sm font-medium text-gray-700">Costo unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo total</div>
                      </div>

                      {renderMaterialField("Tamper Resistant Clamps", "tamperClamps", 1.0, 1400.0)}
                      {/* Este campo tiene lógica especial basada en producción día */}
                      <div className="grid grid-cols-4 gap-4 mb-4 items-center">
                        <div className="text-sm text-gray-700">Sets Transferencia Universales (6)</div>
                        <div className="relative">
                          <Input
                            type="text"
                            className="rounded-full shadow-sm"
                            value="1/producciónDía"
                            readOnly
                            title="Este valor se calcula automáticamente como 1/producciónDía"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                          <Input
                            type="number"
                            className="pl-8 rounded-full shadow-sm"
                            placeholder="0"
                            value="400000"
                            onChange={(e) => {
                              handleInputChange("setsTransferencia6", "costoUnitario", e.target.value)
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                          <Input
                            type="text"
                            className="pl-8 rounded-full shadow-sm bg-gray-50"
                            value={(400000 / 20).toFixed(1).replace(".", ",")}
                            readOnly
                          />
                        </div>
                      </div>
                      {renderMaterialField("Sets Transferencia Universales (9)", "setsTransferencia9", 0.0, 500000.0)}
                      {renderTotalRowWithSpecialCalc(
                        ["tamperClamps", "setsTransferencia9"],
                        "Total Equipos Automatizados",
                        true,
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="proteccion" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Materiales de Protección Personal</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad</div>
                        <div className="text-sm font-medium text-gray-700">Costo unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo total</div>
                      </div>

                      {renderMaterialField("Guantes Estériles desechables (par)", "guantesAuto", 2.0, 500.0)}
                      {renderMaterialField("Bata Estéril de un solo uso", "bataAuto", 2.0, 4000.0)}
                      {renderMaterialField("Gorro desechable", "gorroAuto", 2.0, 300.0)}
                      {renderMaterialField("Mascarilla quirúrgica", "mascarillaAuto", 2.0, 100.0)}
                      {renderMaterialField("Cubrezapatos desechables", "cubrezapatosAuto", 2.0, 300.0)}
                      {renderTotalRow(
                        ["guantesAuto", "bataAuto", "gorroAuto", "mascarillaAuto", "cubrezapatosAuto"],
                        "Total Materiales de Protección",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="higiene" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Materiales de Higiene y Limpieza</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad</div>
                        <div className="text-sm font-medium text-gray-700">Costo unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo total</div>
                      </div>

                      {renderMaterialField(
                        "Solución antiséptica para lavado de manos (clorhexidina o alcohol)",
                        "solucionAntisepticaAuto",
                        0.0,
                        9000.0,
                      )}
                      {renderMaterialField(
                        "Paños estériles para limpieza de superficies",
                        "panosEsterilesAuto",
                        1.0,
                        1000.0,
                      )}
                      {renderMaterialField("Alcohol al 70%", "alcohol70Auto", 0.0, 1200.0)}
                      {renderMaterialField(
                        "Peróxido de hidrógeno acelerado",
                        "peroxidoHidrogenoAuto",
                        "1/200",
                        70479.0,
                      )}
                      {renderMaterialField("Cloruro de benzalconio", "cloruroBenzalconioAuto", "1/200", 55000.0)}
                      {renderTotalRow(
                        [
                          "solucionAntisepticaAuto",
                          "panosEsterilesAuto",
                          "alcohol70Auto",
                          "peroxidoHidrogenoAuto",
                          "cloruroBenzalconioAuto",
                        ],
                        "Total Materiales de Higiene",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="esteril" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Equipo de Trabajo Estéril</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad</div>
                        <div className="text-sm font-medium text-gray-700">Costo unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo total</div>
                      </div>

                      {renderMaterialField("Jeringas estériles de 1 mL", "jeringas1mlAuto", 1.0, 400.0)}
                      {renderMaterialField("Jeringas estériles de 5 mL", "jeringas5mlAuto", 1.0, 400.0)}
                      {renderMaterialField("Jeringas estériles de 10 mL", "jeringas10mlAuto", 0.0, 400.0)}
                      {renderMaterialField("Jeringas estériles de 20 mL", "jeringas20mlAuto", 0.0, 500.0)}
                      {renderMaterialField("Compresas Estériles", "compresasEsterilesAuto", 1.0, 2000.0)}
                      {renderMaterialField("Gasas Estériles", "gasasEsterilesAuto", 2.0, 400.0)}
                      {renderMaterialField("Buretroles", "buretrolesAuto", 0.0, 2500.0)}
                      {renderMaterialField("Jeringas estériles de 50 mL", "jeringas50mlAuto", 0.0, 2000.0)}
                      {renderMaterialField(
                        "Etiquetas estériles para identificar",
                        "etiquetasEsterilesAuto",
                        1.0,
                        5000.0,
                      )}
                      {renderMaterialField("Toallas absorbentes desechables", "toallasAbsorbentesAuto", 0.1, 1000.0)}
                      {renderMaterialField(
                        "Contenedores para residuos cortopunzantes",
                        "contenedoresResiduosAuto",
                        "1/60",
                        8000.0,
                      )}
                      {renderMaterialField("Agujas estériles", "agujasEsterilesAuto", 2.0, 400.0)}
                      {renderMaterialField("Bolsa roja para residuos biológicos", "bolsaRojaAuto", 1.0, 500.0)}
                      {renderMaterialField("Bolsa negra para residuos no contaminados", "bolsaNegraAuto", 1.0, 500.0)}
                      {renderMaterialField(
                        "Bolígrafos para etiquetado de soluciones",
                        "boligrafosAuto",
                        "1/60",
                        1500.0,
                      )}
                      {renderTotalRow(
                        [
                          "jeringas1mlAuto",
                          "jeringas5mlAuto",
                          "jeringas10mlAuto",
                          "jeringas20mlAuto",
                          "jeringas50mlAuto",
                          "buretrolesAuto",
                          "compresasEsterilesAuto",
                          "gasasEsterilesAuto",
                          "etiquetasEsterilesAuto",
                          "toallasAbsorbentesAuto",
                          "contenedoresResiduosAuto",
                          "agujasEsterilesAuto",
                          "bolsaRojaAuto",
                          "bolsaNegraAuto",
                          "boligrafosAuto",
                        ],
                        "Total Equipo Estéril",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="otros" className="mt-6">
                  <Tabs defaultValue="mantenimiento">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
                      <TabsTrigger value="produccion">Producción</TabsTrigger>
                    </TabsList>

                    <TabsContent value="mantenimiento" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Costos de Mantenimiento</h2>

                      {/* Encabezados de columna */}
                      <div className="grid grid-cols-4 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Cantidad (unidad)</div>
                        <div className="text-sm font-medium text-gray-700">Costo Unitario</div>
                        <div className="text-sm font-medium text-gray-700">Costo Total</div>
                      </div>

                      {renderCostoField("Validación Sistema de Aire", "validacionAireAuto")}
                      {renderCostoField("Pruebas de Microbiología", "pruebasMicroAuto")}
                      {renderCostoField("Llenados Asépticos", "llenadosAsepticosAuto")}
                      {renderCostoField("Desafío de Desinfectantes", "desafioDesinfectantesAuto")}
                      {renderCostoField("Mantenimiento de Cabinas", "mantCabinasAuto")}
                      {renderCostoField("Calificación de Cabinas", "calificacionCabinasAuto")}
                      {renderCostoField("Calibración de Manómetros", "calibracionManometrosAuto")}
                      {renderCostoField("Cambios de Filtros UMA", "cambiosFiltrosAuto")}
                      {renderCostoField("Mantenimientos UMA", "mantUMAAuto")}
                      {renderCostoField("Calibración de Termohigrómetros", "calibracionTermoAuto")}
                      {renderCostoField("Mantenimientos Locativos", "mantLocativosAuto")}
                      {renderTotalCostoRow(
                        [
                          "validacionAireAuto",
                          "pruebasMicroAuto",
                          "llenadosAsepticosAuto",
                          "desafioDesinfectantesAuto",
                          "mantCabinasAuto",
                          "calificacionCabinasAuto",
                          "calibracionManometrosAuto",
                          "cambiosFiltrosAuto",
                          "mantUMAAuto",
                          "calibracionTermoAuto",
                          "mantLocativosAuto",
                        ],
                        "Total Costos de Mantenimiento",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>

                    <TabsContent value="produccion" className="mt-6 space-y-4">
                      <h2 className="text-xl font-semibold text-green-600">Costos de Producción</h2>

                      {/* Encabezados de columna */}

                      <div className="grid grid-cols-3 gap-4 mb-2 items-center">
                        <div className="text-sm font-medium text-gray-700">Detalle</div>
                        <div className="text-sm font-medium text-gray-700">Valor estimado</div>
                        <div className="text-sm font-medium text-gray-700">Valor unitario</div>
                      </div>

                      {renderCostoField("Agua", "aguaAuto")}
                      {renderCostoField("Luz", "luzAuto")}
                      {renderCostoField("Mano de Obra Indirecta", "manoObraAuto")}
                      {renderCostoField("Teléfono e Internet", "telefonoAuto")}
                      {renderCostoField("Depreciación de Cabina", "depreciacionAuto")}
                      {renderTotalCostoRow(
                        ["aguaAuto", "luzAuto", "manoObraAuto", "telefonoAuto", "depreciacionAuto"],
                        "Total Costos de Producción",
                      )}

                      {/* Botón de guardar para esta sección */}
                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            updateStoreFromInputValues()
                            toast({
                              title: "Cambios temporales guardados",
                              description: "Los cambios se guardarán hasta que cierre la sesión",
                              duration: 3000,
                            })
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                        >
                          Guardar cambios temporales
                        </Button>
                        <SaveButton onSave={handleManualSave} className="w-auto" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6 mt-6">
              <h2 className="text-xl font-semibold text-green-600">Configuración de Personal</h2>

              {/* Horas requeridas - Movido arriba */}
              <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                <Label className="text-sm font-medium text-gray-700 mb-2">Horas requeridas de trabajo al mes</Label>
                <Input
                  type="number"
                  className="rounded-full shadow-sm"
                  value={inputValues["horasRequeridas"]?.cantidad || "230"}
                  onChange={(e) => {
                    handleInputChange("horasRequeridas", "cantidad", e.target.value)
                    setHasUnsavedChanges(true)
                  }}
                />
              </div>

              {/* Tabla de costos para Químico Farmacéutico */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-4">Salario de Químico Farmacéutico</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Concepto</TableHead>
                        <TableHead className="w-[30%]">Fórmula</TableHead>
                        <TableHead className="w-[30%]">Valor (COP)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Salario Básico</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="number"
                              className="pl-8 rounded-full shadow-sm"
                              value={inputValues["salarioQuimico"]?.cantidad || "4200000"}
                              onChange={(e) => {
                                handleInputChange("salarioQuimico", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cesantías</TableCell>
                        <TableCell>8%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="336,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Primas</TableCell>
                        <TableCell>8%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="336,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Vacaciones</TableCell>
                        <TableCell>4%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="168,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Intereses de Cesantías</TableCell>
                        <TableCell>1%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="42,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Salud</TableCell>
                        <TableCell>9%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="357,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pensión</TableCell>
                        <TableCell>12%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="504,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ARL (Riesgo I)</TableCell>
                        <TableCell>2%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="84,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Caja de Compensación</TableCell>
                        <TableCell>4%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="168,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SENA</TableCell>
                        <TableCell>2%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="84,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ICBF</TableCell>
                        <TableCell>3%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="126,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold">TOTAL PARAFISCALES</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50 font-bold"
                              value="2,205,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold">Salario total</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50 font-bold"
                              value="6,405,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold">Valor total hora</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50 font-bold"
                              value="27,848 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Tabla de costos para Auxiliar de Farmacia */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-purple-700 mb-4">Salario de Auxiliar de Farmacia</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40%]">Concepto</TableHead>
                        <TableHead className="w-[30%]">Fórmula</TableHead>
                        <TableHead className="w-[30%]">Valor (COP)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Salario Básico</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="number"
                              className="pl-8 rounded-full shadow-sm"
                              value={inputValues["salarioAuxiliar"]?.cantidad || "900000"}
                              onChange={(e) => {
                                handleInputChange("salarioAuxiliar", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Cesantías</TableCell>
                        <TableCell>8%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.08,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Primas</TableCell>
                        <TableCell>8%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.08,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Vacaciones</TableCell>
                        <TableCell>4%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.04,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Intereses de Cesantías</TableCell>
                        <TableCell>1%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.01,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Salud</TableCell>
                        <TableCell>9%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.09,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pensión</TableCell>
                        <TableCell>12%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.12,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ARL (Riesgo I)</TableCell>
                        <TableCell>2%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.02,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Caja de Compensación</TableCell>
                        <TableCell>4%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.04,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SENA</TableCell>
                        <TableCell>2%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.02,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>ICBF</TableCell>
                        <TableCell>3%</TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.03,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Subsidio de transporte</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50"
                              value="117,000 COP"
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold">TOTAL PARAFISCALES</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50 font-bold"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 0.53,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold">Salario total</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50 font-bold"
                              value={Math.round(
                                Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 1.53 + 117000,
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gray-50">
                        <TableCell className="font-bold">Valor total hora</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                            <Input
                              type="text"
                              className="pl-8 rounded-full shadow-sm bg-gray-50 font-bold"
                              value={Math.round(
                                (Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 1.53 +
                                  117000) /
                                  Number.parseFloat(inputValues["horasRequeridas"]?.cantidad || "230"),
                              ).toLocaleString("es-CO")}
                              readOnly
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Tabla de costos de personal para sistema manual */}
              <div className="grid grid-cols-1 gap-6 mt-8">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-md font-medium text-purple-700 mb-4">
                    Costos de personal por NPT - Sistema Manual
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60%]">Concepto</TableHead>
                          <TableHead className="w-[40%]">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Horas de químico farmacéutico para 1 nutrición parenteral
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="rounded-full shadow-sm"
                              placeholder="0.25"
                              value={inputValues["horasQuimico"]?.cantidad || "0.25"}
                              onChange={(e) => {
                                handleInputChange("horasQuimico", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                              step="0.01"
                            />
                            <span className="text-xs text-gray-500">
                              ({(Number.parseFloat(inputValues["horasQuimico"]?.cantidad || "0.25") * 60).toFixed(1)}{" "}
                              minutos)
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Personal químico farmacéutico requerido</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="rounded-full shadow-sm"
                              value={inputValues["personalQuimico"]?.cantidad || "2"}
                              onChange={(e) => {
                                handleInputChange("personalQuimico", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Costo por químico farmacéutico requerido para preparación
                          </TableCell>
                          <TableCell>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                              <Input
                                type="text"
                                className="pl-8 rounded-full shadow-sm bg-gray-50"
                                value={Math.round(
                                  ((Number.parseFloat(inputValues["salarioQuimico"]?.cantidad || "4200000") * 1.53) /
                                    Number.parseFloat(inputValues["horasRequeridas"]?.cantidad || "230")) *
                                    Number.parseFloat(inputValues["personalQuimico"]?.cantidad || "2") *
                                    Number.parseFloat(inputValues["horasQuimico"]?.cantidad || "0.25"),
                                ).toLocaleString("es-CO")}
                                readOnly
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Horas por Auxiliar de enfermería para 1 nutrición parenteral
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="rounded-full shadow-sm"
                              placeholder="0.25"
                              value={inputValues["horasAuxiliar"]?.cantidad || "0.25"}
                              onChange={(e) => {
                                handleInputChange("horasAuxiliar", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                              step="0.01"
                            />
                            <span className="text-xs text-gray-500">
                              ({(Number.parseFloat(inputValues["horasAuxiliar"]?.cantidad || "0.25") * 60).toFixed(1)}{" "}
                              minutos)
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Personal auxiliar requerido</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="rounded-full shadow-sm"
                              value={inputValues["personalAuxiliar"]?.cantidad || "1"}
                              onChange={(e) => {
                                handleInputChange("personalAuxiliar", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Costos por Auxiliar de enfermería para 1 nutrición parenteral
                          </TableCell>
                          <TableCell>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                              <Input
                                type="text"
                                className="pl-8 rounded-full shadow-sm bg-gray-50"
                                value={Math.round(
                                  ((Number.parseFloat(inputValues["salarioAuxiliar"]?.cantidad || "900000") * 1.53 +
                                    117000) /
                                    Number.parseFloat(inputValues["horasRequeridas"]?.cantidad || "230")) *
                                    Number.parseFloat(inputValues["personalAuxiliar"]?.cantidad || "1") *
                                    Number.parseFloat(inputValues["horasAuxiliar"]?.cantidad || "0.25"),
                                ).toLocaleString("es-CO")}
                                readOnly
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Tabla de costos de personal para sistema automatizado */}
              <div className="grid grid-cols-1 gap-6 mt-8">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-md font-medium text-purple-700 mb-4">
                    Costos de personal por NPT - Sistema Automatizado
                  </h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60%]">Concepto</TableHead>
                          <TableHead className="w-[40%]">Valor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Horas de químico farmacéutico para 1 nutrición parenteral
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="rounded-full shadow-sm"
                              placeholder="0.08"
                              value={inputValues["horasQuimicoAuto"]?.cantidad || "0.08"}
                              onChange={(e) => {
                                handleInputChange("horasQuimicoAuto", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                              step="0.01"
                            />
                            <span className="text-xs text-gray-500">
                              (
                              {(Number.parseFloat(inputValues["horasQuimicoAuto"]?.cantidad || "0.08") * 60).toFixed(1)}{" "}
                              minutos)
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Personal químico farmacéutico requerido</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="rounded-full shadow-sm"
                              value={inputValues["personalQuimicoAuto"]?.cantidad || "2"}
                              onChange={(e) => {
                                handleInputChange("personalQuimicoAuto", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Costo por químico farmacéutico requerido para preparación
                          </TableCell>
                          <TableCell>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                              <Input
                                type="text"
                                className="pl-8 rounded-full shadow-sm bg-gray-50"
                                value={Math.round(
                                  ((Number.parseFloat(inputValues["salarioQuimicoAuto"]?.cantidad || "4200000") *
                                    1.53) /
                                    230) *
                                    Number.parseFloat(inputValues["personalQuimicoAuto"]?.cantidad || "2") *
                                    Number.parseFloat(inputValues["horasQuimicoAuto"]?.cantidad || "0.08"),
                                ).toLocaleString("es-CO")}
                                readOnly
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Horas por Auxiliar de enfermería para 1 nutrición parenteral
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="rounded-full shadow-sm"
                              placeholder="0.08"
                              value={inputValues["horasAuxiliarAuto"]?.cantidad || "0.08"}
                              onChange={(e) => {
                                handleInputChange("horasAuxiliarAuto", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                              step="0.01"
                            />
                            <span className="text-xs text-gray-500">
                              (
                              {(Number.parseFloat(inputValues["horasAuxiliarAuto"]?.cantidad || "0.08") * 60).toFixed(
                                1,
                              )}{" "}
                              minutos)
                            </span>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Personal auxiliar requerido</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              className="rounded-full shadow-sm"
                              value={inputValues["personalAuxiliarAuto"]?.cantidad || "1"}
                              onChange={(e) => {
                                handleInputChange("personalAuxiliarAuto", "cantidad", e.target.value)
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Costos por Auxiliar de enfermería para 1 nutrición parenteral
                          </TableCell>
                          <TableCell>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-600">$</span>
                              <Input
                                type="text"
                                className="pl-8 rounded-full shadow-sm bg-gray-50"
                                value={Math.round(
                                  ((Number.parseFloat(inputValues["salarioAuxiliarAuto"]?.cantidad || "900000") * 1.53 +
                                    117000) /
                                    230) *
                                    Number.parseFloat(inputValues["personalAuxiliarAuto"]?.cantidad || "1") *
                                    Number.parseFloat(inputValues["horasAuxiliarAuto"]?.cantidad || "0.08"),
                                ).toLocaleString("es-CO")}
                                readOnly
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Botón de guardar para esta sección */}
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => {
                    updateStoreFromInputValues()
                    toast({
                      title: "Cambios temporales guardados",
                      description: "Los cambios se guardarán hasta que cierre la sesión",
                      duration: 3000,
                    })
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white mr-2"
                >
                  Guardar cambios temporales
                </Button>
                <SaveButton onSave={handleManualSave} className="w-auto" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
