"use client"

import { useState, useCallback } from "react"
import type { ConcreteClass, SteelType, CalculationResults, FlambementResults, ColumnData } from "../types/materials"
import { CONNECTION_TYPES } from "../constants/materials"

export function useCalculations() {
  const [results, setResults] = useState<CalculationResults | null>(null)

  const calculateFlambement = useCallback((columnData: ColumnData): FlambementResults => {
    // 1. Coefficient de flambement : lf = k * lo
    const connectionType = CONNECTION_TYPES.find((type) => type.value === columnData.connectionType)
    const k = connectionType?.coefficient || 1.0
    const lf = k * columnData.freeLength

    // 2. Coefficient d'élancement : λ = lf * √12 / a
    const a = Math.min(columnData.sectionWidth, columnData.sectionHeight)
    const lambda = (lf * Math.sqrt(12)) / a

    // 3. Coefficient alpha avec conditions
    let alpha: number | null = null
    let alphaCondition = ""

    if (lambda < 60) {
      alpha = 0.86 / (1 + Math.pow(lambda / 62, 2))
      alphaCondition = "λ < 60 : α = 0.86 / (1 + (λ/62)²)"
    } else if (lambda >= 60 && lambda < 120) {
      alpha = Math.pow(32 / lambda, 1.3)
      alphaCondition = "60 ≤ λ < 120 : α = (32/λ)^1.3"
    } else {
      alpha = null
      alphaCondition = "λ ≥ 120 : Calcul non applicable"
    }

    return {
      lf: Number(lf.toFixed(3)),
      lambda: Number(lambda.toFixed(2)),
      alpha: alpha ? Number(alpha.toFixed(4)) : null,
      alphaCondition,
    }
  }, [])

  const calculateResistances = useCallback(
    (concreteClass: ConcreteClass, steelType: SteelType, columnData: ColumnData) => {
      // Résistance de calcul du béton : fcd = fck / γc
      const fcd = concreteClass.fck / concreteClass.gammaC

      // Limite de calcul de l'acier : fyd = fyk / γs
      const fyd = steelType.fyk / steelType.gammaS

      // Nouveaux calculs de flambement
      const flambement = calculateFlambement(columnData)

      const newResults: CalculationResults = {
        fcd: Number(fcd.toFixed(2)),
        fyd: Number(fyd.toFixed(2)),
        flambement,
      }

      setResults(newResults)
      return newResults
    },
    [calculateFlambement],
  )

  return {
    results,
    calculateResistances,
  }
}
