"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useCalculatorStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { ImageButton } from "@/components/ui/image-button"
import { SaveModal } from "@/components/save-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SaveButton } from "@/components/ui/save-button"
import { useToast } from "@/components/ui/use-toast"
import debounce from "lodash/debounce"

const formSchema = z
  .object({
    populationType: z.enum(["Adulto", "Pediátrico", "Neonatal"]),
    productionLines: z.coerce.number().min(1),
    dailyProduction: z.coerce.number().min(1),
    adultPercentage: z.coerce.number().min(0).max(100),
    pediatricPercentage: z.coerce.number().min(0).max(100),
    neonatalPercentage: z.coerce.number().min(0).max(100),
    adultQuantities: z.record(z.number().min(0)),
    pediatricQuantities: z.record(z.number().min(0)),
    neonatalQuantities: z.record(z.number().min(0)),
  })
  .refine(
    (data) => {
      const sum = data.adultPercentage + data.pediatricPercentage + data.neonatalPercentage
      return sum === 100
    },
    {
      message: "Los porcentajes deben sumar 100%",
      path: ["adultPercentage"],
    },
  )

export default function CalculatorForm() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("manual")
  const [isTableCollapsed, setIsTableCollapsed] = useState(true)
  const [showPresentationColumn, setShowPresentationColumn] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const store = useCalculatorStore()
  const router = useRouter()
  const { toast } = useToast()
  const [inputValues, setInputValues] = useState<{ [key: string]: { cantidad: string; costoUnitario: string } }>({})

  // Recuperar la preferencia de mostrar/ocultar presentación del localStorage
  useEffect(() => {
    const savedPref = localStorage.getItem("showPresentationColumn")
    if (savedPref !== null) {
      setShowPresentationColumn(savedPref === "true")
    }
  }, [])

  // Guardar la preferencia cuando cambia
  useEffect(() => {
    localStorage.setItem("showPresentationColumn", showPresentationColumn.toString())
  }, [showPresentationColumn])

  // Recuperar el estado de la pestaña activa del localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("activeCalculatorTab")
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  // Guardar el estado de la pestaña activa cuando cambia
  useEffect(() => {
    localStorage.setItem("activeCalculatorTab", activeTab)
  }, [activeTab])

  // Modificar los valores por defecto del formulario para incluir las cantidades iniciales
  const getInitialQuantities = (ingredients: Record<string, number>): Record<string, number> => {
    // Valores iniciales por defecto para cada ingrediente
    const defaultValues: Record<string, number> = {
      // Adulto
      aminoacidsSinElectrolitos500ml: 1.0,
      aminoacidsConElectrolitos500ml: 0.0,
      aminoacids15500ml: 0.0,
      aminoacids151000ml: 0.0,
      cloruroPotasio10ml: 1.0,
      fosfatoPotasio10ml: 1.0,
      glicerofosfatoSodio20ml: 1.0,
      cloruroSodio10ml: 0.0,
      sulfatoMagnesio10ml: 1.0,
      gluconatoCalcio10ml: 0.0,
      lipidos500ml: 0.0,
      dextrosa50500ml: 0.0,
      vitaminasLiposolubles: 1.0,
      vitaminasHidrosolubles: 0.0,
      multivitaminas: 0.0,
      vitaminaC: 0.0,
      tiamina: 0.0,
      complejoB: 0.0,
      elementosTraza10ml: 1.0,
      aguaEsteril500ml: 2.0,
      bolsa1000ml: 1.0,
      bolsa500ml: 0.0,
      singleChamberMixingContainer250ml: 1.0,
      singleChamberMixingContainer500ml: 0.0,
      singleChamberMixingContainer1000ml: 0.0,
      singleChamberMixingContainer2000ml: 0.0,

      // Pediátrico
      aminoacidsInfantil100ml: 0.0,
      aminoacidsInfantil250ml: 0.0,
      aminoacidsInfantil500ml: 147.0,
      aminoacidsInfantil1000ml: 0.0,
      fosfatoPotasio10ml: 2.5,
      cloruroSodio10ml: 2.5,
      sulfatoMagnesio10ml: 9.8,
      gluconatoCalcio10ml: 2.5,
      lipidos100ml: 73.5,
      dextrosa50500ml: 127.0,
      multivitaminas: 5.0,
      aguaEsteril500ml: 98.37,

      // Neonatal
      aminoacidsInfantil100ml: 20.5,
      aminoacidsInfantil250ml: 0.0,
      aminoacidsInfantil500ml: 0.0,
      aminoacidsInfantil1000ml: 0.0,
      cloruroPotasio10ml: 0.4,
      fosfatoPotasio10ml: 0.4,
      cloruroSodio10ml: 1.6,
      sulfatoMagnesio10ml: 0.4,
      gluconatoCalcio10ml: 2.1,
      lipidos100ml: 10.1,
      dextrosa50500ml: 18.0,
      vitaminasLiposolubles: 1.0,
      vitaminasHidrosolubles: 1.0,
      multivitaminas: 1.0,
      aguaEsteril500ml: 100.0,
      bolsa1000ml: 1.0,
    }

    // Crear un objeto con las cantidades iniciales solo para los ingredientes que existen
    const initialQuantities: Record<string, number> = {}

    Object.keys(ingredients).forEach((key) => {
      initialQuantities[key] = defaultValues[key] || 0
    })

    return initialQuantities
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      populationType: store.populationType,
      productionLines: store.productionLines,
      dailyProduction: store.dailyProduction,
      adultPercentage: store.adultPercentage,
      pediatricPercentage: store.pediatricPercentage,
      neonatalPercentage: store.neonatalPercentage,
      adultQuantities: store.ingredientQuantities?.adult || getInitialQuantities(store.manualCosts.adultMaterialCosts),
      pediatricQuantities:
        store.ingredientQuantities?.pediatric || getInitialQuantities(store.manualCosts.pediatricMaterialCosts),
      neonatalQuantities:
        store.ingredientQuantities?.neonatal || getInitialQuantities(store.manualCosts.neonatalMaterialCosts),
    },
  })

  // Función para guardar automáticamente los cambios
  const saveChanges = debounce(() => {
    if (hasUnsavedChanges) {
      const values = form.getValues()
      store.setValues({
        ...values,
        ingredientQuantities: {
          adult: values.adultQuantities || {},
          pediatric: values.pediatricQuantities || {},
          neonatal: values.neonatalQuantities || {},
        },
      })
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

  useEffect(() => {
    if (store.currentResult) {
      form.reset({
        populationType: store.populationType,
        productionLines: store.productionLines,
        dailyProduction: store.dailyProduction,
        adultPercentage: store.adultPercentage,
        pediatricPercentage: store.pediatricPercentage,
        neonatalPercentage: store.neonatalPercentage,
      })
    }
  }, [store, form])

  // Marcar que hay cambios sin guardar cuando se modifica el formulario
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true)
    })

    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCalculating(true)

    // Guardar los cambios antes de calcular
    store.setValues({
      ...values,
      ingredientQuantities: {
        adult: values.adultQuantities || {},
        pediatric: values.pediatricQuantities || {},
        neonatal: values.neonatalQuantities || {},
      },
    })
    setHasUnsavedChanges(false)

    // Calcular los resultados
    store.calculateResults()

    setTimeout(() => {
      setIsCalculating(false)
    }, 1000)
  }

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

  const getIngredientLabel = (key: string): string => {
    const translations: Record<string, string> = {
      // Materia Prima - Adulto
      aminoacidsSinElectrolitos500ml: "Aminoácidos Sin electrolitos 10% x 500 mL",
      aminoacidsConElectrolitos500ml: "Aminoácidos con electrolitos 10% x 500 mL",
      aminoacids15500ml: "Aminoácidos 15 % x 500 mL",
      aminoacids151000ml: "Aminoácidos 15 % x 1000 mL",
      cloruroPotasio10ml: "Cloruro de potasio vial x 10cc",
      fosfatoPotasio10ml: "Fosfato de potasio vial x 10cc",
      glicerofosfatoSodio20ml: "Glicerofosfato de sodio x 20 ml",
      cloruroSodio10ml: "Cloruro de sodio vial x 10cc",
      sulfatoMagnesio10ml: "Sulfato de magnesio vial x 10 cc",
      gluconatoCalcio10ml: "Gluconato de calcio vial x 10cc",
      lipidos500ml: "Lípidos (Lipofundin) Frasco x 500 cc",
      lipidos100ml: "Lípidos (Lipofundin) Frasco vial x 100 cc",
      dextrosa50500ml: "Dextrosa al 50% Bolsa x 500cc",
      vitaminasLiposolubles: "Vitaminas Liposolubles Adulto",
      vitaminasHidrosolubles: "Vitaminas hidrosolubles",
      multivitaminas: "Multivitaminas",
      vitaminaC: "Vitamina C - ácido ascórbico",
      tiamina: "Tiamina",
      complejoB: "Complejo B",
      elementosTraza10ml: "Elementos traza x 10 ml",
      aguaEsteril500ml: "Agua estéril x 500 ml",
      bolsa1000ml: "Bolsa x 1000 mL",
      bolsa500ml: "Bolsa x 500 mL",

      // Materia Prima - Pediátrica y Neonatal
      aminoacidsInfantil100ml: "Aminoácidos Infantil x 100 mL",
      aminoacidsInfantil250ml: "Aminoácidos Infantil x 250 mL",
      aminoacidsInfantil500ml: "Aminoácidos infantil x 500 mL",
      aminoacidsInfantil1000ml: "Aminoácidos Infantil x 1000 mL",
      // Add these new translations
      singleChamberMixingContainer250ml: "Single-Chamber Mixing Container Eva 250 mL",
      singleChamberMixingContainer500ml: "Single-Chamber Mixing Container Eva 500 mL",
      singleChamberMixingContainer1000ml: "Single-Chamber Mixing Container Eva 1000 mL",
      singleChamberMixingContainer2000ml: "Single-Chamber Mixing Container Eva 2000 mL",
    }

    return translations[key] || key
  }

  // Función para extraer la presentación en ml del nombre del producto
  const extractPresentation = (label: string): number => {
    // Buscar patrones como "x 500 mL", "x 10cc", etc.
    const mlMatch = label.match(/x\s*(\d+)\s*m[lL]/i)
    const ccMatch = label.match(/x\s*(\d+)\s*cc/i)

    if (mlMatch && mlMatch[1]) {
      return Number.parseInt(mlMatch[1], 10)
    }
    if (ccMatch && ccMatch[1]) {
      return Number.parseInt(ccMatch[1], 10)
    }

    // Si no se encuentra un patrón, devolver 1 como valor predeterminado
    return 1
  }

  // Función para guardar manualmente
  const handleManualSave = async () => {
    // Guardar los cambios actuales
    const values = form.getValues()
    store.setValues({
      ...values,
      ingredientQuantities: {
        adult: values.adultQuantities || {},
        pediatric: values.pediatricQuantities || {},
        neonatal: values.neonatalQuantities || {},
      },
    })
    setHasUnsavedChanges(false)

    // Mostrar confirmación
    toast({
      title: "Cambios guardados",
      description: "Los cambios han sido guardados exitosamente",
      duration: 3000,
    })

    return Promise.resolve()
  }

  const handleSave = async () => {
    const { value: calculationName } = await Swal.fire({
      title: "Guardar cálculo",
      input: "text",
      inputLabel: "Nombre del cálculo",
      inputPlaceholder: "Ingrese un nombre para este cálculo",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Debe ingresar un nombre para el cálculo"
        }
      },
    })

    if (calculationName) {
      // Guardar el cálculo en el store (que a su vez lo guarda en localStorage)
      store.saveCalculation(calculationName)

      // Mostrar confirmación
      Swal.fire({
        title: "Guardado",
        text: "El cálculo ha sido guardado exitosamente en el almacenamiento local",
        icon: "success",
        confirmButtonText: "Aceptar",
      })
    }
  }

  const handleDownloadPDF = () => {
    const input = document.getElementById("calculator-content")
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF()
        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save("calculo-nutricion-hospitalaria.pdf")
      })
    }
  }

  // Función auxiliar para calcular el total de un objeto de costos
  const calculateTotalFromCostsObject = (costsObject: Record<string, number>): number => {
    return Object.values(costsObject).reduce((sum, cost) => sum + (cost || 0), 0)
  }

  // Función para obtener el costo por NPT según el tipo de población
  const getCostPerNPTByType = (populationType: string, centralType: "manual" | "automated"): number => {
    if (centralType === "manual") {
      switch (populationType) {
        case "Adulto":
          return store.manualAdultTotal
        case "Pediátrico":
          return store.manualPediatricTotal
        case "Neonatal":
          return store.manualNeonatalTotal
        default:
          return 0
      }
    } else {
      switch (populationType) {
        case "Adulto":
          return store.automatedAdultTotal
        case "Pediátrico":
          return store.automatedPediatricTotal
        case "Neonatal":
          return store.automatedNeonatalTotal
        default:
          return 0
      }
    }
  }

  // Función para manejar los cambios en los inputs
  const handleInputChange = (id: string, type: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [id]: {
        ...prevValues[id],
        [type]: value,
      },
    }))
  }

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
            value={quantity}
            onChange={(e) => {
              handleInputChange(id, "cantidad", e.target.value)
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
            value={cantidad}
            onChange={(e) => {
              handleInputChange(id, "cantidad", e.target.value)
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

  // Función para renderizar la tabla de materiales según el tipo de población seleccionado
  const renderMaterialsTable = (isManual: boolean) => {
    const populationType = form.watch("populationType")
    const dailyProduction = form.watch("dailyProduction")

    let materialCosts: Record<string, number>
    let quantitiesField: "adultQuantities" | "pediatricQuantities" | "neonatalQuantities"

    // Determinar qué costos y cantidades usar según el tipo de población
    switch (populationType) {
      case "Adulto":
        materialCosts = isManual ? store.manualCosts.adultMaterialCosts : store.automatedCosts.adultMaterialCosts
        quantitiesField = "adultQuantities"
        break
      case "Pediátrico":
        materialCosts = isManual
          ? store.manualCosts.pediatricMaterialCosts
          : store.automatedCosts.pediatricMaterialCosts
        quantitiesField = "pediatricQuantities"
        break
      case "Neonatal":
        materialCosts = isManual ? store.manualCosts.neonatalMaterialCosts : store.automatedCosts.neonatalMaterialCosts
        quantitiesField = "neonatalQuantities"
        break
      default:
        materialCosts = {}
        quantitiesField = "adultQuantities"
    }

    // Calcular el total de la tabla con la nueva lógica
    const tableTotal = Object.entries(materialCosts).reduce((sum, [key, value]) => {
      const quantity = form.watch(`${quantitiesField}.${key}`) || 0
      const label = getIngredientLabel(key)
      const presentation = extractPresentation(label)
      const costPerMl = value / presentation
      return sum + quantity * costPerMl
    }, 0)

    // Calcular los costos adicionales
    const protectionCost = calculateTotalFromCostsObject(
      isManual ? store.manualCosts.protectionMaterialCosts : store.automatedCosts.protectionMaterialCosts,
    )
    const hygieneCost = calculateTotalFromCostsObject(
      isManual ? store.manualCosts.hygieneMaterialCosts : store.automatedCosts.hygieneMaterialCosts,
    )
    const sterilCost = calculateTotalFromCostsObject(
      isManual ? store.manualCosts.sterilEquipmentCosts : store.automatedCosts.sterilEquipmentCosts,
    )
    const equipmentCost = isManual ? 0 : calculateTotalFromCostsObject(store.automatedCosts.automatedEquipmentCosts)

    const maintenanceTotal = calculateTotalFromCostsObject(
      isManual ? store.manualCosts.maintenanceCosts : store.automatedCosts.maintenanceCosts,
    )
    const maintenanceCost = maintenanceTotal / 12 / store.productionLines / (dailyProduction * 30)

    const productionTotal = calculateTotalFromCostsObject(
      isManual ? store.manualCosts.productionCosts : store.automatedCosts.productionCosts,
    )
    const productionCost = productionTotal / 2250

    const personnelCosts = isManual ? store.manualCosts.personnelCosts : store.automatedCosts.personnelCosts
    const farmCostPerHour = personnelCosts.salarioFarmaceutico / 230
    const nurseCostPerHour = personnelCosts.salarioEnfermeria / 230
    const personnelCost =
      farmCostPerHour * personnelCosts.horasFarmaceutico + nurseCostPerHour * personnelCosts.horasEnfermeria

    // Total para 1 NPT
    const totalPerNPT =
      tableTotal +
      protectionCost +
      hygieneCost +
      sterilCost +
      equipmentCost +
      maintenanceCost +
      productionCost +
      personnelCost

    // Total diario (multiplicado por la producción diaria)
    const totalDaily = totalPerNPT * dailyProduction

    // NO actualizamos el store aquí para evitar el bucle infinito

    const updateStoreFromInputValues = () => {
      const values = form.getValues()
      store.setValues({
        ...values,
        ingredientQuantities: {
          adult: values.adultQuantities || {},
          pediatric: values.pediatricQuantities || {},
          neonatal: values.neonatalQuantities || {},
        },
      })
      setHasUnsavedChanges(false)
    }

    return (
      <div className="overflow-x-auto">
        {/* Fila de total siempre visible */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTableCollapsed(!isTableCollapsed)}
              className="flex items-center text-purple-700 font-medium"
            >
              {isTableCollapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
              {isTableCollapsed ? "Mostrar detalles" : "Ocultar detalles"}
            </button>

            {!isTableCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPresentationColumn(!showPresentationColumn)}
                className="ml-4 text-xs flex items-center"
                title="Mostrar u ocultar la columna de presentación"
              >
                {showPresentationColumn ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Ocultar presentación
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Mostrar presentación
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-4">Total por NPT:</span>
              <div className="relative flex items-center">
                <span className="text-purple-600 mr-2">$</span>
                <Input value={totalPerNPT.toLocaleString("es-ES")} className="bg-gray-50 font-medium w-40" disabled />
              </div>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-4">Total diario ({dailyProduction} NPT):</span>
              <div className="relative flex items-center">
                <span className="text-purple-600 mr-2">$</span>
                <Input value={totalDaily.toLocaleString("es-ES")} className="bg-gray-50 font-bold w-40" disabled />
              </div>
            </div>
          </div>
        </div>
        {!isTableCollapsed && (
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
        )}

        {/* Tabla detallada que se muestra solo cuando no está colapsada */}
        {!isTableCollapsed && (
          <div className="mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={showPresentationColumn ? "w-[30%]" : "w-[40%]"}>Detalle</TableHead>
                  {showPresentationColumn && <TableHead className="w-[15%]">Presentación (mL)</TableHead>}
                  <TableHead className="w-[15%]">Cantidad (ml)</TableHead>
                  <TableHead className="w-[20%]">Costo por unidad</TableHead>
                  <TableHead className="w-[20%]">Costo total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(materialCosts).map(([key, value]) => {
                  const quantity = form.watch(`${quantitiesField}.${key}`) || 0
                  const label = getIngredientLabel(key)
                  const presentation = extractPresentation(label)
                  const costPerMl = value / presentation
                  const totalCost = quantity * costPerMl

                  return (
                    <TableRow key={key}>
                      <TableCell>{label}</TableCell>
                      {showPresentationColumn && (
                        <TableCell>
                          <Input type="number" min="1" value={presentation} readOnly className="w-full bg-gray-50" />
                        </TableCell>
                      )}
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          defaultValue={quantity}
                          onBlur={(e) => {
                            const value = Number.parseFloat(e.target.value) || 0
                            form.setValue(`${quantitiesField}.${key}`, value)
                            setHasUnsavedChanges(true)
                          }}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="relative flex items-center">
                          <span className="text-purple-600 mr-2">$</span>
                          <Input
                            type="number"
                            min="0"
                            step="100"
                            value={value}
                            onChange={(e) => {
                              // Actualizar el costo unitario en el store
                              if (isManual) {
                                const newCosts = { ...store.manualCosts }
                                if (populationType === "Adulto") {
                                  newCosts.adultMaterialCosts[key] = Number.parseFloat(e.target.value) || 0
                                } else if (populationType === "Pediátrico") {
                                  newCosts.pediatricMaterialCosts[key] = Number.parseFloat(e.target.value) || 0
                                } else {
                                  newCosts.neonatalMaterialCosts[key] = Number.parseFloat(e.target.value) || 0
                                }
                                store.setManualCosts(newCosts)
                              } else {
                                const newCosts = { ...store.automatedCosts }
                                if (populationType === "Adulto") {
                                  newCosts.adultMaterialCosts[key] = Number.parseFloat(e.target.value) || 0
                                } else if (populationType === "Pediátrico") {
                                  newCosts.pediatricMaterialCosts[key] = Number.parseFloat(e.target.value) || 0
                                } else {
                                  newCosts.neonatalMaterialCosts[key] = Number.parseFloat(e.target.value) || 0
                                }
                                store.setAutomatedCosts(newCosts)
                              }
                              setHasUnsavedChanges(true)
                            }}
                            className="w-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative flex items-center">
                          <span className="text-purple-600 mr-2">$</span>
                          <Input value={totalCost.toLocaleString("es-ES")} className="bg-gray-50" disabled />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Costos adicionales */}
            <div className="mt-6 border-t pt-4">
              <h4 className="text-md font-semibold text-purple-700 mb-4">Costos adicionales</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Materiales de protección:</span>
                  <div className="relative flex items-center">
                    <span className="text-purple-600 mr-2">$</span>
                    <Input value={protectionCost.toLocaleString("es-ES")} className="bg-gray-50 w-40" disabled />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Higiene y limpieza:</span>
                  <div className="relative flex items-center">
                    <span className="text-purple-600 mr-2">$</span>
                    <Input value={hygieneCost.toLocaleString("es-ES")} className="bg-gray-50 w-40" disabled />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Equipo estéril:</span>
                  <div className="relative flex items-center">
                    <span className="text-purple-600 mr-2">$</span>
                    <Input value={sterilCost.toLocaleString("es-ES")} className="bg-gray-50 w-40" disabled />
                  </div>
                </div>
                {!isManual && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Equipo automatizado:</span>
                    <div className="relative flex items-center">
                      <span className="text-purple-600 mr-2">$</span>
                      <Input value={equipmentCost.toLocaleString("es-ES")} className="bg-gray-50 w-40" disabled />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Mantenimiento:</span>
                  <div className="relative flex items-center">
                    <span className="text-purple-600 mr-2">$</span>
                    <Input value={maintenanceCost.toLocaleString("es-ES")} className="bg-gray-50 w-40" disabled />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Producción:</span>
                  <div className="relative flex items-center">
                    <span className="text-purple-600 mr-2">$</span>
                    <Input value={productionCost.toLocaleString("es-ES")} className="bg-gray-50 w-40" disabled />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Personal:</span>
                  <div className="relative flex items-center">
                    <span className="text-purple-600 mr-2">$</span>
                    <Input value={personnelCost.toLocaleString("es-ES")} className="bg-gray-50 w-40" disabled />
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de guardar para la tabla */}
            <div className="flex justify-end mt-4">
              <SaveButton onSave={handleManualSave} className="w-auto" />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-4 sm:p-6" id="calculator-content">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4 sm:mb-0">
            CALCULADORA NUTRICIÓN HOSPITALARIA
          </h1>
          <div className="flex gap-2">
            <SaveButton onSave={handleManualSave} className="w-auto" />
            <ImageButton
              variant="purple"
              text="EDITAR DATOS"
              onClick={() => router.push("/dashboard/configuration")}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-green-600">Ingreso de datos</h2>

                <FormField
                  control={form.control}
                  name="populationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de población</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setHasUnsavedChanges(true)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white border rounded-full shadow-sm">
                            <SelectValue placeholder="Seleccione tipo de población" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Adulto">Adulto</SelectItem>
                          <SelectItem value="Pediátrico">Pediátrico</SelectItem>
                          <SelectItem value="Neonatal">Neonatal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productionLines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Líneas de producción de la central</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setHasUnsavedChanges(true)
                          }}
                          className="rounded-full shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyProduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Producción día</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            setHasUnsavedChanges(true)
                          }}
                          className="rounded-full shadow-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <p className="text-sm text-purple-600 mt-8">
                  Del total de producción diaria indique el % entre adulto, pediátrica y neonatal, asegúrese que la suma
                  de estos sea el 100%
                </p>

                <FormField
                  control={form.control}
                  name="adultPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje de nutriciones de adulto</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setHasUnsavedChanges(true)
                            }}
                            className="rounded-full shadow-sm pr-8"
                          />
                        </FormControl>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pediatricPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje de nutriciones pediátrica</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setHasUnsavedChanges(true)
                            }}
                            className="rounded-full shadow-sm pr-8"
                          />
                        </FormControl>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neonatalPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentaje de nutriciones neonatal</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setHasUnsavedChanges(true)
                            }}
                            className="rounded-full shadow-sm pr-8"
                          />
                        </FormControl>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600">%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botón de guardar para la sección de datos */}
                <div className="flex justify-end mt-4">
                  <SaveButton onSave={handleManualSave} className="w-auto" />
                </div>
              </div>
            </div>

            <div className="mt-8">
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
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Central de Mezclas Manual</TabsTrigger>
                  <TabsTrigger value="automated">Central de Mezclas Automatizada</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="mt-4">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4">
                    Materiales para {form.watch("populationType")}
                  </h3>
                  {renderMaterialsTable(true)}
                </TabsContent>

                <TabsContent value="automated" className="mt-4">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4">
                    Materiales para {form.watch("populationType")}
                  </h3>
                  {renderMaterialsTable(false)}
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex justify-center mt-8 gap-4">
              <SaveButton onSave={handleManualSave} className="w-auto" />
              <ImageButton
                variant="green"
                text="CALCULAR"
                onClick={form.handleSubmit(onSubmit)}
                loading={isCalculating}
                className="w-full max-w-[240px]"
              />
            </div>
          </form>
        </Form>

        {store.currentResult && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-purple-800 mb-6">Resultados</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Headers */}
              <div className="col-span-1"></div>
              <div className="col-span-1 text-center">
                <h3 className="text-lg font-semibold text-green-600">Central de Mezclas Manual</h3>
                <p className="text-purple-600 font-medium">{store.populationType}</p>
              </div>
              <div className="col-span-1 text-center">
                <h3 className="text-lg font-semibold text-green-600">Central de Mezclas Automatizada</h3>
                <p className="text-purple-600 font-medium">{store.populationType}</p>
              </div>

              {/* Costos 1 NPT */}
              <div className="col-span-3 mt-6">
                <h4 className="text-lg font-semibold text-purple-700 mb-4">Costos 1 NPT</h4>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Costo de materiales de protección personal</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={calculateTotalFromCostsObject(store.manualCosts.protectionMaterialCosts).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={calculateTotalFromCostsObject(store.automatedCosts.protectionMaterialCosts).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Costos materiales de higiene y limpieza</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={calculateTotalFromCostsObject(store.manualCosts.hygieneMaterialCosts).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={calculateTotalFromCostsObject(store.automatedCosts.hygieneMaterialCosts).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Costos de mantenimiento</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={(
                      calculateTotalFromCostsObject(store.manualCosts.maintenanceCosts) /
                      12 /
                      store.productionLines /
                      (store.dailyProduction * 30)
                    ).toLocaleString("es-ES")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={(
                      calculateTotalFromCostsObject(store.automatedCosts.maintenanceCosts) /
                      12 /
                      store.productionLines /
                      (store.dailyProduction * 30)
                    ).toLocaleString("es-ES")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Costos de producción</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={(calculateTotalFromCostsObject(store.manualCosts.productionCosts) / 2250).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={(calculateTotalFromCostsObject(store.automatedCosts.productionCosts) / 2250).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Costos equipo estéril</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={calculateTotalFromCostsObject(store.manualCosts.sterilEquipmentCosts).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={calculateTotalFromCostsObject(store.automatedCosts.sterilEquipmentCosts).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Costos equipo automatizado</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input value="0" className="bg-gray-50" disabled />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={calculateTotalFromCostsObject(store.automatedCosts.automatedEquipmentCosts).toLocaleString(
                      "es-ES",
                    )}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">
                  Horas de químico farmacéutico para 1 nutrición parenteral
                </label>
              </div>
              <div className="col-span-1">
                <Input value={store.manualCosts.personnelCosts.horasFarmaceutico} className="bg-gray-50" disabled />
              </div>
              <div className="col-span-1">
                <Input value={store.automatedCosts.personnelCosts.horasFarmaceutico} className="bg-gray-50" disabled />
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">
                  Costo por químico farmacéutico requerido para preparación
                </label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={(
                      (store.manualCosts.personnelCosts.salarioFarmaceutico / 230) *
                      store.manualCosts.personnelCosts.horasFarmaceutico
                    ).toLocaleString("es-ES")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={(
                      (store.automatedCosts.personnelCosts.salarioFarmaceutico / 230) *
                      store.automatedCosts.personnelCosts.horasFarmaceutico
                    ).toLocaleString("es-ES")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">
                  Horas por auxiliar de enfermería para 1 nutrición parenteral
                </label>
              </div>
              <div className="col-span-1">
                <Input value={store.manualCosts.personnelCosts.horasEnfermeria} className="bg-gray-50" disabled />
              </div>
              <div className="col-span-1">
                <Input value={store.automatedCosts.personnelCosts.horasEnfermeria} className="bg-gray-50" disabled />
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">
                  Costos por auxiliar de enfermería para 1 nutrición parenteral
                </label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={(
                      (store.manualCosts.personnelCosts.salarioEnfermeria / 230) *
                      store.manualCosts.personnelCosts.horasEnfermeria
                    ).toLocaleString("es-ES")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={(
                      (store.automatedCosts.personnelCosts.salarioEnfermeria / 230) *
                      store.automatedCosts.personnelCosts.horasEnfermeria
                    ).toLocaleString("es-ES")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm font-medium text-gray-700">
                  Total de costos preparación 1 nutrición parenteral
                </label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={getCostPerNPTByType(store.populationType, "manual").toLocaleString("es-ES")}
                    className="bg-gray-50 font-medium"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={getCostPerNPTByType(store.populationType, "automated").toLocaleString("es-ES")}
                    className="bg-gray-50 font-medium"
                    disabled
                  />
                </div>
              </div>

              {/* Nutrition Values Section */}
              <div className="col-span-3 mt-6">
                <h4 className="text-lg font-semibold text-purple-700 mb-4">
                  Valores Nutriciones Diarias ({store.dailyProduction} NPT)
                </h4>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Valor total de adulto ({store.adultPercentage}%)</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={formatCurrency(store.currentResult.adultTotal * store.dailyProduction).replace("$", "")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={formatCurrency(
                      store.currentResult.adultTotal *
                        (1 - store.currentResult.differencePercentage / 100) *
                        store.dailyProduction,
                    ).replace("$", "")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Valor total pediátrica ({store.pediatricPercentage}%)</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={formatCurrency(store.currentResult.pediatricTotal * store.dailyProduction).replace("$", "")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={formatCurrency(
                      store.currentResult.pediatricTotal *
                        (1 - store.currentResult.differencePercentage / 100) *
                        store.dailyProduction,
                    ).replace("$", "")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm text-gray-700">Valor total neonatal ({store.neonatalPercentage}%)</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={formatCurrency(store.currentResult.neonatalTotal * store.dailyProduction).replace("$", "")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={formatCurrency(
                      store.currentResult.neonatalTotal *
                        (1 - store.currentResult.differencePercentage / 100) *
                        store.dailyProduction,
                    ).replace("$", "")}
                    className="bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div className="col-span-1 flex items-center">
                <label className="text-sm font-medium text-gray-700">VALOR TOTAL NUTRICIONES DÍA</label>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={formatCurrency(store.currentResult.manualTotal * store.dailyProduction).replace("$", "")}
                    className="bg-gray-50 font-medium"
                    disabled
                  />
                </div>
              </div>
              <div className="col-span-1">
                <div className="relative flex items-center">
                  <span className="text-purple-600 mr-2">$</span>
                  <Input
                    value={formatCurrency(store.currentResult.automatedTotal * store.dailyProduction).replace("$", "")}
                    className="bg-gray-50 font-medium"
                    disabled
                  />
                </div>
              </div>

              {/* Difference */}
              <div className="col-span-1 flex items-center">
                <label className="text-sm font-medium text-gray-700">VALOR TOTAL</label>
              </div>
              <div className="col-span-2">
                <div
                  className={`p-4 rounded-md ${store.currentResult.differencePercentage > store.differenceThreshold ? "bg-green-100" : "bg-gray-100"}`}
                >
                  <div className="flex justify-between">
                    <span
                      className={`font-bold ${store.currentResult.differencePercentage > store.differenceThreshold ? "text-green-600" : ""}`}
                    >
                      Diferencia: {formatCurrency(store.currentResult.difference * store.dailyProduction)}
                    </span>
                    <span
                      className={`font-bold ${store.currentResult.differencePercentage > store.differenceThreshold ? "text-green-600" : ""}`}
                    >
                      {store.currentResult.differencePercentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="col-span-3 mt-8 flex flex-col sm:flex-row justify-center gap-4">
                <SaveButton onSave={handleManualSave} className="w-full sm:w-auto" />
                <ImageButton
                  variant="purple"
                  text="GUARDAR"
                  onClick={() => setSaveModalOpen(true)}
                  className="w-full sm:w-auto"
                />
                <ImageButton
                  variant="green"
                  text="DESCARGAR"
                  onClick={handleDownloadPDF}
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <SaveModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        onSave={(filename) => {
          store.saveCalculation(filename)
          router.push("/dashboard/history")
        }}
      />
    </Card>
  )
}
