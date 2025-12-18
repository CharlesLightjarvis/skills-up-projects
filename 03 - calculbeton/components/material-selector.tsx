"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MaterialSelectorProps {
  title: string
  materials: Array<{
    name: string
    fck?: number
    fyk?: number
    gammaC?: number
    gammaS?: number
  }>
  selectedMaterial: string
  onMaterialChange: (value: string) => void
  unit: string
  resistanceLabel: string
  coefficientLabel: string
}

export function MaterialSelector({
  title = "matériau",
  materials,
  selectedMaterial,
  onMaterialChange,
  unit,
  resistanceLabel,
  coefficientLabel,
}: MaterialSelectorProps) {
  const selected = materials.find((m) => m.name === selectedMaterial)

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${(title || "").toLowerCase()}-select`} className="text-sm font-medium">
            Classe/Type
          </Label>
          <Select value={selectedMaterial} onValueChange={onMaterialChange}>
            <SelectTrigger id={`${(title || "").toLowerCase()}-select`}>
              <SelectValue placeholder={`Sélectionner ${(title || "").toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {materials.map((material) => (
                <SelectItem key={material.name} value={material.name}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selected && (
          <div className="space-y-3 pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{resistanceLabel}</span>
              <Badge variant="secondary" className="font-mono">
                {selected.fck || selected.fyk} {unit}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{coefficientLabel}</span>
              <Badge variant="outline" className="font-mono">
                {selected.gammaC || selected.gammaS}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
