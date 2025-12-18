import type { ConcreteClass, SteelType } from "../types/materials"

export const CONCRETE_CLASSES: ConcreteClass[] = [
  { name: "C16/20", fck: 16, gammaC: 1.5 },
  { name: "C20/25", fck: 20, gammaC: 1.5 },
  { name: "C25/30", fck: 25, gammaC: 1.5 },
  { name: "C30/37", fck: 30, gammaC: 1.5 },
  { name: "C35/45", fck: 35, gammaC: 1.5 },
  { name: "C40/50", fck: 40, gammaC: 1.5 },
]

export const STEEL_TYPES: SteelType[] = [
  { name: "A400", fyk: 400, gammaS: 1.15 },
  { name: "B500", fyk: 500, gammaS: 1.15 },
  { name: "C600", fyk: 600, gammaS: 1.15 },
]

export const CONNECTION_TYPES = [
  { value: "articule-encastre", label: "Articulé-Encastré", coefficient: 0.7 },
  { value: "articule-articule", label: "Articulé-Articulé", coefficient: 1.0 },
  { value: "encastre-encastre", label: "Encastré-Encastré", coefficient: 0.5 },
] as const
