import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PopulationType = "Adulto" | "Pediátrico" | "Neonatal"

export interface CalculationResult {
  id: string
  name: string
  date: string
  populationType: PopulationType
  manualTotal: number
  automatedTotal: number
  adultTotal: number
  pediatricTotal: number
  neonatalTotal: number
  difference: number
  differencePercentage: number
}

// Definición de las estructuras de costos
export interface ManualCosts {
  // Adulto
  adultMaterialCosts: Record<string, number>
  // Pediátrica
  pediatricMaterialCosts: Record<string, number>
  // Neonatal
  neonatalMaterialCosts: Record<string, number>
  // Protección personal
  protectionMaterialCosts: Record<string, number>
  // Higiene y limpieza
  protectionMaterialCosts: Record<string, number>
  hygieneMaterialCosts: Record<string, number>
  // Equipo estéril
  sterilEquipmentCosts: Record<string, number>
  // Mantenimiento
  maintenanceCosts: Record<string, number>
  // Producción
  productionCosts: Record<string, number>
  // Personal
  personnelCosts: Record<string, number>
}

export interface AutomatedCosts {
  // Adulto
  adultMaterialCosts: Record<string, number>
  // Pediátrica
  pediatricMaterialCosts: Record<string, number>
  // Neonatal
  neonatalMaterialCosts: Record<string, number>
  // Equipos automatizados
  automatedEquipmentCosts: Record<string, number>
  // Protección personal
  protectionMaterialCosts: Record<string, number>
  // Higiene y limpieza
  hygieneMaterialCosts: Record<string, number>
  // Equipo estéril
  sterilEquipmentCosts: Record<string, number>
  // Mantenimiento
  maintenanceCosts: Record<string, number>
  // Producción
  productionCosts: Record<string, number>
  // Personal
  personnelCosts: Record<string, number>
}

interface CalculatorState {
  // General settings
  differenceThreshold: number
  productionLines: number
  dailyProduction: number
  adultPercentage: number
  pediatricPercentage: number
  neonatalPercentage: number
  populationType: PopulationType

  // Cantidades de ingredientes
  ingredientQuantities?: {
    adult: Record<string, number>
    pediatric: Record<string, number>
    neonatal: Record<string, number>
  }

  // Costos totales calculados por tipo de población
  manualAdultTotal: number
  manualPediatricTotal: number
  manualNeonatalTotal: number
  automatedAdultTotal: number
  automatedPediatricTotal: number
  automatedNeonatalTotal: number

  // Costos detallados por sección
  manualCosts: ManualCosts
  automatedCosts: AutomatedCosts

  // Ingredientes (mantenido para compatibilidad)
  ingredientCosts: Record<string, number>

  // Results
  currentResult: CalculationResult | null
  calculationHistory: CalculationResult[]

  // Actions
  setValues: (values: Partial<CalculatorState>) => void
  calculateResults: () => void
  saveCalculation: (name?: string) => void
  deleteCalculation: (id: string) => void
  resetForm: () => void
  exportToJSON: () => string
  importFromJSON: (json: string) => void
  setManualCosts: (costs: ManualCosts) => void
  setAutomatedCosts: (costs: AutomatedCosts) => void

  // Helpers para calcular subtotales
  calculateManualAdultTotal: () => number
  calculateManualPediatricTotal: () => number
  calculateManualNeonatalTotal: () => number
  calculateAutomatedAdultTotal: () => number
  calculateAutomatedPediatricTotal: () => number
  calculateAutomatedNeonatalTotal: () => number
}

// Función auxiliar para calcular el total de un objeto de costos
const calculateTotalFromCostsObject = (costsObject: Record<string, number>): number => {
  return Object.values(costsObject).reduce((sum, cost) => sum + (cost || 0), 0)
}

// Datos iniciales
const initialManualCosts: ManualCosts = {
  adultMaterialCosts: {
    aminoacidsSinElectrolitos500ml: 61000,
    aminoacidsConElectrolitos500ml: 61000,
    aminoacids15500ml: 66000,
    aminoacids151000ml: 135000,
    cloruroPotasio10ml: 1500,
    fosfatoPotasio10ml: 5700,
    glicerofosfatoSodio20ml: 20000,
    cloruroSodio10ml: 1500,
    sulfatoMagnesio10ml: 1500,
    gluconatoCalcio10ml: 1800,
    lipidos500ml: 80000,
    dextrosa50500ml: 10814,
    vitaminasLiposolubles: 13000,
    vitaminasHidrosolubles: 23000,
    multivitaminas: 25000,
    vitaminaC: 2000,
    tiamina: 3000,
    complejoB: 3000,
    elementosTraza10ml: 20000,
    aguaEsteril500ml: 4000,
    bolsa1000ml: 31000,
    bolsa500ml: 30000,
  },
  pediatricMaterialCosts: {
    aminoacidsInfantil100ml: 40000,
    aminoacidsInfantil250ml: 50000,
    aminoacidsInfantil500ml: 100000,
    aminoacidsInfantil1000ml: 20546.6,
    cloruroPotasio10ml: 1500,
    fosfatoPotasio10ml: 5700,
    cloruroSodio10ml: 1500,
    sulfatoMagnesio10ml: 1500,
    gluconatoCalcio10ml: 1800,
    lipidos100ml: 80000,
    dextrosa50500ml: 10814,
    vitaminasLiposolubles: 13000,
    vitaminasHidrosolubles: 23000,
    multivitaminas: 25000,
    vitaminaC: 2000,
    complejoB: 3000,
    elementosTraza10ml: 15000,
    aguaEsteril500ml: 4000,
    bolsa1000ml: 31000,
    bolsa500ml: 30000,
  },
  neonatalMaterialCosts: {
    aminoacidsInfantil100ml: 40000,
    aminoacidsInfantil250ml: 50000,
    aminoacidsInfantil500ml: 100000,
    aminoacidsInfantil1000ml: 20546.6,
    cloruroPotasio10ml: 1500,
    fosfatoPotasio10ml: 5700,
    cloruroSodio10ml: 1500,
    sulfatoMagnesio10ml: 1500,
    gluconatoCalcio10ml: 1800,
    lipidos100ml: 80000,
    dextrosa50500ml: 10814,
    vitaminasLiposolubles: 13000,
    vitaminasHidrosolubles: 23000,
    multivitaminas: 25000,
    vitaminaC: 2000,
    complejoB: 3000,
    elementosTraza10ml: 15000,
    aguaEsteril500ml: 4000,
    bolsa1000ml: 31000,
    bolsa500ml: 30000,
  },
  protectionMaterialCosts: {
    guantesEsteriles: 500,
    bataEsteril: 4000,
    gorroDesechable: 300,
    mascarillaQuirurgica: 100,
    cubrezapatosDesechables: 300,
  },
  hygieneMaterialCosts: {
    solucionAntiseptica: 9000,
    panosEsteriles: 1000,
    alcohol70: 1200,
    peroxidoHidrogeno: 70479,
    cloruroBenzalconio: 55000,
  },
  sterilEquipmentCosts: {
    jeringas1ml: 400,
    jeringas5ml: 400,
    jeringas10ml: 400,
    jeringas20ml: 500,
    jeringas50ml: 2000,
    buretroles: 2500,
    compresasEsteriles: 2000,
    gasasEsteriles: 200,
    etiquetasEsteriles: 5000,
    toallasAbsorbentes: 1000,
    contenedoresResiduos: 8000,
    agujasEsteriles: 400,
    bolsaRoja: 500,
    bolsaNegra: 500,
    boligrafos: 1500,
  },
  maintenanceCosts: {
    validacionSistemaAire: 10000000,
    pruebasMicrobiologia: 4000000,
    llenadosAsepticos: 1000000,
    desafioDesinfectantes: 1000000,
    mantenimientoCabinas: 2000000,
    calificacionCabinas: 2500000,
    calibracionManometros: 400000,
    cambiosFiltrosUMA: 5000000,
    mantenimientosUMA: 2000000,
    calibracionTermohigrometros: 400000,
    mantenimientosLocativos: 10000000,
  },
  productionCosts: {
    agua: 2388262,
    luz: 6775277,
    manoObraIndirecta: 4783964,
    telefonoInternet: 6688000,
    depreciacionCabina: 63000,
  },
  personnelCosts: {
    salarioFarmaceutico: 4200000,
    horasFarmaceutico: 0.25,
    salarioEnfermeria: 900000,
    horasEnfermeria: 0.25,
  },
}

const initialAutomatedCosts: AutomatedCosts = {
  adultMaterialCosts: {
    aminoacidsSinElectrolitos500ml: 61000,
    aminoacidsConElectrolitos500ml: 61000,
    aminoacids15500ml: 66000,
    aminoacids151000ml: 135000,
    cloruroPotasio10ml: 1500,
    fosfatoPotasio10ml: 5700,
    glicerofosfatoSodio20ml: 20000,
    cloruroSodio10ml: 1500,
    sulfatoMagnesio10ml: 1500,
    gluconatoCalcio10ml: 1800,
    lipidos500ml: 80000,
    dextrosa50500ml: 10814,
    vitaminasLiposolubles: 13000,
    vitaminasHidrosolubles: 23000,
    multivitaminas: 25000,
    vitaminaC: 2000,
    tiamina: 3000,
    complejoB: 3000,
    elementosTraza10ml: 20000,
    aguaEsteril500ml: 4000,
    bolsa1000ml: 31000,
    bolsa500ml: 30000,
    singleChamberMixingContainer250ml: 31000,
    singleChamberMixingContainer500ml: 30000,
    singleChamberMixingContainer1000ml: 31000,
    singleChamberMixingContainer2000ml: 31000,
  },
  pediatricMaterialCosts: {
    aminoacidsInfantil100ml: 40000,
    aminoacidsInfantil250ml: 50000,
    aminoacidsInfantil500ml: 100000,
    aminoacidsInfantil1000ml: 20546.6,
    cloruroPotasio10ml: 1500,
    fosfatoPotasio10ml: 5700,
    cloruroSodio10ml: 1500,
    sulfatoMagnesio10ml: 1500,
    gluconatoCalcio10ml: 1800,
    lipidos100ml: 80000,
    dextrosa50500ml: 10814,
    vitaminasLiposolubles: 13000,
    vitaminasHidrosolubles: 23000,
    multivitaminas: 25000,
    vitaminaC: 2000,
    complejoB: 3000,
    elementosTraza10ml: 15000,
    aguaEsteril500ml: 4000,
    singleChamberMixingContainer250ml: 31000,
    singleChamberMixingContainer500ml: 30000,
    singleChamberMixingContainer1000ml: 31000,
    singleChamberMixingContainer2000ml: 31000,
  },
  neonatalMaterialCosts: {
    aminoacidsInfantil100ml: 40000,
    aminoacidsInfantil250ml: 50000,
    aminoacidsInfantil500ml: 100000,
    aminoacidsInfantil1000ml: 20546.6,
    cloruroPotasio10ml: 1500,
    fosfatoPotasio10ml: 5700,
    cloruroSodio10ml: 1500,
    sulfatoMagnesio10ml: 1500,
    gluconatoCalcio10ml: 1800,
    lipidos100ml: 80000,
    dextrosa50500ml: 10814,
    vitaminasLiposolubles: 13000,
    vitaminasHidrosolubles: 23000,
    multivitaminas: 25000,
    vitaminaC: 2000,
    complejoB: 3000,
    elementosTraza10ml: 15000,
    aguaEsteril500ml: 4000,
    bolsa1000ml: 31000,
    bolsa500ml: 20000,
  },
  automatedEquipmentCosts: {
    tamperResistantClamps: 1400,
    setsTransferenciaUniversales6: 400000,
    setsTransferenciaUniversales9: 500000,
  },
  protectionMaterialCosts: {
    guantesEsteriles: 500,
    bataEsteril: 4000,
    gorroDesechable: 300,
    mascarillaQuirurgica: 100,
    cubrezapatosDesechables: 300,
  },
  hygieneMaterialCosts: {
    solucionAntiseptica: 9000,
    panosEsteriles: 1000,
    alcohol70: 1200,
    peroxidoHidrogeno: 70479,
    cloruroBenzalconio: 55000,
  },
  sterilEquipmentCosts: {
    jeringas1ml: 400,
    jeringas5ml: 400,
    jeringas10ml: 400,
    jeringas20ml: 500,
    jeringas50ml: 2000,
    buretroles: 2500,
    compresasEsteriles: 2000,
    gasasEsteriles: 200,
    etiquetasEsteriles: 5000,
    toallasAbsorbentes: 1000,
    contenedoresResiduos: 8000,
    agujasEsteriles: 400,
    bolsaRoja: 500,
    bolsaNegra: 500,
    boligrafos: 1500,
  },
  maintenanceCosts: {
    validacionSistemaAire: 10000000,
    pruebasMicrobiologia: 48000000,
    llenadosAsepticos: 6000000,
    desafioDesinfectantes: 1000000,
    mantenimientoCabinas: 12000000,
    calificacionCabinas: 7500000,
    calibracionManometros: 4000000,
    cambiosFiltrosUMA: 5000000,
    mantenimientosUMA: 4000000,
    calibracionTermohigrometros: 2000000,
    mantenimientosLocativos: 10000000,
  },
  productionCosts: {
    agua: 2388262,
    luz: 6775277,
    manoObraIndirecta: 4783964,
    telefonoInternet: 6688000,
    depreciacionCabina: 63000,
  },
  personnelCosts: {
    salarioFarmaceutico: 4200000,
    horasFarmaceutico: 0.08,
    salarioEnfermeria: 900000,
    horasEnfermeria: 0.08,
  },
}

const initialState: Omit<
  CalculatorState,
  | "setValues"
  | "calculateResults"
  | "saveCalculation"
  | "deleteCalculation"
  | "resetForm"
  | "exportToJSON"
  | "importFromJSON"
  | "calculateManualAdultTotal"
  | "calculateManualPediatricTotal"
  | "calculateManualNeonatalTotal"
  | "calculateAutomatedAdultTotal"
  | "calculateAutomatedPediatricTotal"
  | "calculateAutomatedNeonatalTotal"
  | "setManualCosts"
  | "setAutomatedCosts"
> = {
  differenceThreshold: 40,
  productionLines: 5,
  dailyProduction: 20,
  adultPercentage: 34,
  pediatricPercentage: 33,
  neonatalPercentage: 33,
  populationType: "Adulto",

  manualAdultTotal: 268814,
  manualPediatricTotal: 184400,
  manualNeonatalTotal: 113335.2,
  automatedAdultTotal: 278814,
  automatedPediatricTotal: 184400,
  automatedNeonatalTotal: 113335.2,

  manualCosts: initialManualCosts,
  automatedCosts: initialAutomatedCosts,

  // Para compatibilidad con código existente
  ingredientCosts: {
    aminoacidsInfantil100ml: 40000,
    aminoacidsInfantil250ml: 50000,
    aminoacidsInfantil500ml: 100000,
    aminoacidsInfantil1000ml: 20546,
    aminoacidsSinElectrolitos500ml: 61000,
    aminoacidsConElectrolitos500ml: 61000,
    aminoacids15500ml: 66000,
    aminoacids151000ml: 135000,
    cloruroPotasio10ml: 1500,
    fosfatoPotasio10ml: 5700,
    cloruroSodio10ml: 1500,
    glicerofosfatoSodio20ml: 20000,
    sulfatoMagnesio10ml: 1500,
    gluconatoCalcio10ml: 1800,
    lipidos100ml: 80000,
    lipidos500ml: 80000,
    dextrosa50500ml: 10814,
    vitaminasLiposolubles: 13000,
    vitaminasHidrosolubles: 23000,
    multivitaminas: 25000,
    vitaminaC: 2000,
    tiamina: 3000,
    complejoB: 3000,
    elementosTraza10ml: 15000,
    aguaEsteril500ml: 4000,
    bolsa250ml: 31000,
    bolsa500ml: 30000,
    bolsa1000ml: 31000,
    bolsa2000ml: 31000,
  },

  currentResult: null,
  calculationHistory: [],
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Calcular totales por tipo
      calculateManualAdultTotal: () => {
        const state = get()

        // Costo de materiales para adultos
        const materialCost = calculateTotalFromCostsObject(state.manualCosts.adultMaterialCosts)

        // Costos comunes
        const protectionCost = calculateTotalFromCostsObject(state.manualCosts.protectionMaterialCosts)
        const hygieneCost = calculateTotalFromCostsObject(state.manualCosts.hygieneMaterialCosts)
        const sterilCost = calculateTotalFromCostsObject(state.manualCosts.sterilEquipmentCosts)

        // Costos de mantenimiento (distribuido por NPT)
        const maintenanceTotal = calculateTotalFromCostsObject(state.manualCosts.maintenanceCosts)
        const maintenanceCost = maintenanceTotal / 12 / state.productionLines / (state.dailyProduction * 30)

        // Costos de producción (distribuido por NPT)
        const productionTotal = calculateTotalFromCostsObject(state.manualCosts.productionCosts)
        const productionCost = productionTotal / 2250 // 2250 es el valor fijo usado en el Excel

        // Costos de personal
        const farmCostPerHour = state.manualCosts.personnelCosts.salarioFarmaceutico / 230 // 230 horas al mes
        const nurseCostPerHour = state.manualCosts.personnelCosts.salarioEnfermeria / 230
        const personnelCost =
          farmCostPerHour * state.manualCosts.personnelCosts.horasFarmaceutico +
          nurseCostPerHour * state.manualCosts.personnelCosts.horasEnfermeria

        return (
          materialCost + protectionCost + hygieneCost + sterilCost + maintenanceCost + productionCost + personnelCost
        )
      },

      calculateManualPediatricTotal: () => {
        const state = get()

        // Similar al cálculo para adultos pero usando costos pediátricos
        const materialCost = calculateTotalFromCostsObject(state.manualCosts.pediatricMaterialCosts)

        // Los demás costos son similares a los de adultos
        const protectionCost = calculateTotalFromCostsObject(state.manualCosts.protectionMaterialCosts)
        const hygieneCost = calculateTotalFromCostsObject(state.manualCosts.hygieneMaterialCosts)
        const sterilCost = calculateTotalFromCostsObject(state.manualCosts.sterilEquipmentCosts)

        const maintenanceTotal = calculateTotalFromCostsObject(state.manualCosts.maintenanceCosts)
        const maintenanceCost = maintenanceTotal / 12 / state.productionLines / (state.dailyProduction * 30)

        const productionTotal = calculateTotalFromCostsObject(state.manualCosts.productionCosts)
        const productionCost = productionTotal / 2250

        const farmCostPerHour = state.manualCosts.personnelCosts.salarioFarmaceutico / 230
        const nurseCostPerHour = state.manualCosts.personnelCosts.salarioEnfermeria / 230
        const personnelCost =
          farmCostPerHour * state.manualCosts.personnelCosts.horasFarmaceutico +
          nurseCostPerHour * state.manualCosts.personnelCosts.horasEnfermeria

        return (
          materialCost + protectionCost + hygieneCost + sterilCost + maintenanceCost + productionCost + personnelCost
        )
      },

      calculateManualNeonatalTotal: () => {
        const state = get()

        // Similar al cálculo para adultos pero usando costos neonatales
        const materialCost = calculateTotalFromCostsObject(state.manualCosts.neonatalMaterialCosts)

        const protectionCost = calculateTotalFromCostsObject(state.manualCosts.protectionMaterialCosts)
        const hygieneCost = calculateTotalFromCostsObject(state.manualCosts.hygieneMaterialCosts)
        const sterilCost = calculateTotalFromCostsObject(state.manualCosts.sterilEquipmentCosts)

        const maintenanceTotal = calculateTotalFromCostsObject(state.manualCosts.maintenanceCosts)
        const maintenanceCost = maintenanceTotal / 12 / state.productionLines / (state.dailyProduction * 30)

        const productionTotal = calculateTotalFromCostsObject(state.manualCosts.productionCosts)
        const productionCost = productionTotal / 2250

        const farmCostPerHour = state.manualCosts.personnelCosts.salarioFarmaceutico / 230
        const nurseCostPerHour = state.manualCosts.personnelCosts.salarioEnfermeria / 230
        const personnelCost =
          farmCostPerHour * state.manualCosts.personnelCosts.horasFarmaceutico +
          nurseCostPerHour * state.manualCosts.personnelCosts.horasEnfermeria

        return (
          materialCost + protectionCost + hygieneCost + sterilCost + maintenanceCost + productionCost + personnelCost
        )
      },

      calculateAutomatedAdultTotal: () => {
        const state = get()

        // Costo de materiales para adultos
        const materialCost = calculateTotalFromCostsObject(state.automatedCosts.adultMaterialCosts)

        // Costos de equipos automatizados
        const equipmentCost = calculateTotalFromCostsObject(state.automatedCosts.automatedEquipmentCosts)

        // Costos comunes
        const protectionCost = calculateTotalFromCostsObject(state.automatedCosts.protectionMaterialCosts)
        const hygieneCost = calculateTotalFromCostsObject(state.automatedCosts.hygieneMaterialCosts)
        const sterilCost = calculateTotalFromCostsObject(state.automatedCosts.sterilEquipmentCosts)

        // Costos de mantenimiento (distribuido por NPT)
        const maintenanceTotal = calculateTotalFromCostsObject(state.automatedCosts.maintenanceCosts)
        const maintenanceCost = maintenanceTotal / 12 / state.productionLines / (state.dailyProduction * 30)

        // Costos de producción (distribuido por NPT)
        const productionTotal = calculateTotalFromCostsObject(state.automatedCosts.productionCosts)
        const productionCost = productionTotal / 2250

        // Costos de personal
        const farmCostPerHour = state.automatedCosts.personnelCosts.salarioFarmaceutico / 230
        const nurseCostPerHour = state.automatedCosts.personnelCosts.salarioEnfermeria / 230
        const personnelCost =
          farmCostPerHour * state.automatedCosts.personnelCosts.horasFarmaceutico +
          nurseCostPerHour * state.automatedCosts.personnelCosts.horasEnfermeria

        return (
          materialCost +
          equipmentCost +
          protectionCost +
          hygieneCost +
          sterilCost +
          maintenanceCost +
          productionCost +
          personnelCost
        )
      },

      calculateAutomatedPediatricTotal: () => {
        const state = get()

        // Similar al cálculo para adultos pero usando costos pediátricos
        const materialCost = calculateTotalFromCostsObject(state.automatedCosts.pediatricMaterialCosts)

        const equipmentCost = calculateTotalFromCostsObject(state.automatedCosts.automatedEquipmentCosts)

        const protectionCost = calculateTotalFromCostsObject(state.automatedCosts.protectionMaterialCosts)
        const hygieneCost = calculateTotalFromCostsObject(state.automatedCosts.hygieneMaterialCosts)
        const sterilCost = calculateTotalFromCostsObject(state.automatedCosts.sterilEquipmentCosts)

        const maintenanceTotal = calculateTotalFromCostsObject(state.automatedCosts.maintenanceCosts)
        const maintenanceCost = maintenanceTotal / 12 / state.productionLines / (state.dailyProduction * 30)

        const productionTotal = calculateTotalFromCostsObject(state.automatedCosts.productionCosts)
        const productionCost = productionTotal / 2250

        const farmCostPerHour = state.automatedCosts.personnelCosts.salarioFarmaceutico / 230
        const nurseCostPerHour = state.automatedCosts.personnelCosts.salarioEnfermeria / 230
        const personnelCost =
          farmCostPerHour * state.automatedCosts.personnelCosts.horasFarmaceutico +
          nurseCostPerHour * state.automatedCosts.personnelCosts.horasEnfermeria

        return (
          materialCost +
          equipmentCost +
          protectionCost +
          hygieneCost +
          sterilCost +
          maintenanceCost +
          productionCost +
          personnelCost
        )
      },

      calculateAutomatedNeonatalTotal: () => {
        const state = get()

        // Similar al cálculo para adultos pero usando costos neonatales
        const materialCost = calculateTotalFromCostsObject(state.automatedCosts.neonatalMaterialCosts)

        const equipmentCost = calculateTotalFromCostsObject(state.automatedCosts.automatedEquipmentCosts)

        const protectionCost = calculateTotalFromCostsObject(state.automatedCosts.protectionMaterialCosts)
        const hygieneCost = calculateTotalFromCostsObject(state.automatedCosts.hygieneMaterialCosts)
        const sterilCost = calculateTotalFromCostsObject(state.automatedCosts.sterilEquipmentCosts)

        const maintenanceTotal = calculateTotalFromCostsObject(state.automatedCosts.maintenanceCosts)
        const maintenanceCost = maintenanceTotal / 12 / state.productionLines / (state.dailyProduction * 30)

        const productionTotal = calculateTotalFromCostsObject(state.automatedCosts.productionCosts)
        const productionCost = productionTotal / 2250

        // Costos de personal
        const farmCostPerHour = state.automatedCosts.personnelCosts.salarioFarmaceutico / 230
        const nurseCostPerHour = state.automatedCosts.personnelCosts.salarioEnfermeria / 230
        const personnelCost =
          farmCostPerHour * state.automatedCosts.personnelCosts.horasFarmaceutico +
          nurseCostPerHour * state.automatedCosts.personnelCosts.horasEnfermeria

        return (
          materialCost +
          equipmentCost +
          protectionCost +
          hygieneCost +
          sterilCost +
          maintenanceCost +
          productionCost +
          personnelCost
        )
      },

      calculateResults: () => {
        const state = get()

        // Calcular los totales por tipo de población
        const manualAdultTotal = state.calculateManualAdultTotal()
        const manualPediatricTotal = state.calculateManualPediatricTotal()
        const manualNeonatalTotal = state.calculateManualNeonatalTotal()
        const automatedAdultTotal = state.calculateAutomatedAdultTotal()
        const automatedPediatricTotal = state.calculateAutomatedPediatricTotal()
        const automatedNeonatalTotal = state.calculateAutomatedNeonatalTotal()

        // Calcular los totales manuales y automatizados por NPT
        const manualTotal =
          (manualAdultTotal * state.adultPercentage +
            manualPediatricTotal * state.pediatricPercentage +
            manualNeonatalTotal * state.neonatalPercentage) /
          100

        const automatedTotal =
          (automatedAdultTotal * state.adultPercentage +
            automatedPediatricTotal * state.pediatricPercentage +
            automatedNeonatalTotal * state.neonatalPercentage) /
          100

        // Calcular la diferencia y el porcentaje
        const difference = manualTotal - automatedTotal
        const differencePercentage = (difference / manualTotal) * 100

        // Crear el resultado
        const result: CalculationResult = {
          id: Date.now().toString(),
          name: "Cálculo " + new Date().toLocaleDateString(),
          date: new Date().toISOString(),
          populationType: state.populationType,
          manualTotal,
          automatedTotal,
          adultTotal: (manualAdultTotal * state.adultPercentage) / 100,
          pediatricTotal: (manualPediatricTotal * state.pediatricPercentage) / 100,
          neonatalTotal: (manualNeonatalTotal * state.neonatalPercentage) / 100,
          difference,
          differencePercentage,
        }

        // Actualizar el estado
        set({
          currentResult: result,
          manualAdultTotal,
          manualPediatricTotal,
          manualNeonatalTotal,
          automatedAdultTotal,
          automatedPediatricTotal,
          automatedNeonatalTotal,
        })
      },

      setValues: (values) =>
        set((state) => {
          // Primero actualizamos los valores generales
          const newState = {
            ...state,
            ...values,
          }

          // Actualizar las cantidades de ingredientes si se proporcionan
          if (values.ingredientQuantities) {
            newState.ingredientQuantities = {
              ...state.ingredientQuantities,
              ...values.ingredientQuantities,
            }
          }

          // Actualizamos las estructuras de costos si se proporcionan
          if (values.manualCosts) {
            newState.manualCosts = {
              ...state.manualCosts,
              ...values.manualCosts,
              adultMaterialCosts: {
                ...state.manualCosts.adultMaterialCosts,
                ...values.manualCosts.adultMaterialCosts,
              },
              pediatricMaterialCosts: {
                ...state.manualCosts.pediatricMaterialCosts,
                ...values.manualCosts.pediatricMaterialCosts,
              },
              neonatalMaterialCosts: {
                ...state.manualCosts.neonatalMaterialCosts,
                ...values.manualCosts.neonatalMaterialCosts,
              },
              protectionMaterialCosts: {
                ...state.manualCosts.protectionMaterialCosts,
                ...values.manualCosts.protectionMaterialCosts,
              },
              hygieneMaterialCosts: {
                ...state.manualCosts.hygieneMaterialCosts,
                ...values.manualCosts.hygieneMaterialCosts,
              },
              sterilEquipmentCosts: {
                ...state.manualCosts.sterilEquipmentCosts,
                ...values.manualCosts.sterilEquipmentCosts,
              },
              maintenanceCosts: {
                ...state.manualCosts.maintenanceCosts,
                ...values.manualCosts.maintenanceCosts,
              },
              productionCosts: {
                ...state.manualCosts.productionCosts,
                ...values.manualCosts.productionCosts,
              },
              personnelCosts: {
                ...state.manualCosts.personnelCosts,
                ...values.manualCosts.personnelCosts,
              },
            }
          }

          if (values.automatedCosts) {
            newState.automatedCosts = {
              ...state.automatedCosts,
              ...values.automatedCosts,
              adultMaterialCosts: {
                ...state.automatedCosts.adultMaterialCosts,
                ...values.automatedCosts.adultMaterialCosts,
              },
              pediatricMaterialCosts: {
                ...state.automatedCosts.pediatricMaterialCosts,
                ...values.automatedCosts.pediatricMaterialCosts,
              },
              neonatalMaterialCosts: {
                ...state.automatedCosts.neonatalMaterialCosts,
                ...values.automatedCosts.neonatalMaterialCosts,
              },
              automatedEquipmentCosts: {
                ...state.automatedCosts.automatedEquipmentCosts,
                ...values.automatedCosts.automatedEquipmentCosts,
              },
              protectionMaterialCosts: {
                ...state.automatedCosts.protectionMaterialCosts,
                ...values.automatedCosts.protectionMaterialCosts,
              },
              hygieneMaterialCosts: {
                ...state.automatedCosts.hygieneMaterialCosts,
                ...values.automatedCosts.hygieneMaterialCosts,
              },
              sterilEquipmentCosts: {
                ...state.automatedCosts.sterilEquipmentCosts,
                ...values.automatedCosts.sterilEquipmentCosts,
              },
              maintenanceCosts: {
                ...state.automatedCosts.maintenanceCosts,
                ...values.automatedCosts.maintenanceCosts,
              },
              productionCosts: {
                ...state.automatedCosts.productionCosts,
                ...values.automatedCosts.productionCosts,
              },
              personnelCosts: {
                ...state.automatedCosts.personnelCosts,
                ...values.automatedCosts.personnelCosts,
              },
            }
          }

          return newState
        }),

      setManualCosts: (costs) =>
        set((state) => ({
          ...state,
          manualCosts: costs,
        })),

      setAutomatedCosts: (costs) =>
        set((state) => ({
          ...state,
          automatedCosts: costs,
        })),

      saveCalculation: (name) => {
        const state = get()
        if (!state.currentResult) return

        const calculation = {
          ...state.currentResult,
          name: name || state.currentResult.name,
        }

        set((state) => ({
          calculationHistory: [...state.calculationHistory, calculation],
        }))
      },

      deleteCalculation: (id) => {
        set((state) => ({
          calculationHistory: state.calculationHistory.filter((calc) => calc.id !== id),
        }))
      },

      resetForm: () => {
        set((state) => ({
          ...initialState,
          calculationHistory: state.calculationHistory,
        }))
      },

      exportToJSON: () => {
        const state = get()
        return JSON.stringify({
          differenceThreshold: state.differenceThreshold,
          productionLines: state.productionLines,
          dailyProduction: state.dailyProduction,
          adultPercentage: state.adultPercentage,
          pediatricPercentage: state.pediatricPercentage,
          neonatalPercentage: state.neonatalPercentage,
          populationType: state.populationType,
          manualCosts: state.manualCosts,
          automatedCosts: state.automatedCosts,
          calculationHistory: state.calculationHistory,
        })
      },

      importFromJSON: (json) => {
        try {
          const data = JSON.parse(json)
          set((state) => ({
            ...state,
            differenceThreshold: data.differenceThreshold || state.differenceThreshold,
            productionLines: data.productionLines || state.productionLines,
            dailyProduction: data.dailyProduction || state.dailyProduction,
            adultPercentage: data.adultPercentage || state.adultPercentage,
            pediatricPercentage: data.pediatricPercentage || state.pediatricPercentage,
            neonatalPercentage: data.neonatalPercentage || state.neonatalPercentage,
            populationType: data.populationType || state.populationType,
            manualCosts: data.manualCosts || state.manualCosts,
            automatedCosts: data.automatedCosts || state.automatedCosts,
            calculationHistory: data.calculationHistory || state.calculationHistory,
          }))
        } catch (error) {
          console.error("Error importing data:", error)
        }
      },
    }),
    {
      name: "calculator-storage",
      partialize: (state) => ({
        differenceThreshold: state.differenceThreshold,
        productionLines: state.productionLines,
        dailyProduction: state.dailyProduction,
        adultPercentage: state.adultPercentage,
        pediatricPercentage: state.pediatricPercentage,
        neonatalPercentage: state.neonatalPercentage,
        populationType: state.populationType,
        manualCosts: state.manualCosts,
        automatedCosts: state.automatedCosts,
        calculationHistory: state.calculationHistory,
      }),
    },
  ),
)
