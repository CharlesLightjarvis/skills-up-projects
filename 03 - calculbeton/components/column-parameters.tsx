"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ColumnData } from "../types/materials"
import { CONNECTION_TYPES } from "../constants/materials"

interface ColumnParametersProps {
  columnData: ColumnData
  onColumnDataChange: (data: ColumnData) => void
}

export function ColumnParameters({ columnData, onColumnDataChange }: ColumnParametersProps) {
  const handleInputChange = (field: keyof ColumnData, value: string | number) => {
    onColumnDataChange({
      ...columnData,
      [field]: value,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Paramètres du Poteau</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="free-length">Longueur libre (m)</Label>
            <Input
              id="free-length"
              type="number"
              step="0.1"
              value={columnData.freeLength}
              onChange={(e) => handleInputChange("freeLength", Number.parseFloat(e.target.value) || 0)}
              placeholder="Ex: 3.0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="connection-type">Nature de la liaison</Label>
            <Select
              value={columnData.connectionType}
              onValueChange={(value) => handleInputChange("connectionType", value)}
            >
              <SelectTrigger id="connection-type">
                <SelectValue placeholder="Type de liaison" />
              </SelectTrigger>
              <SelectContent>
                {CONNECTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label} (k = {type.coefficient})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Section du poteau (cm)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="section-width" className="text-xs text-gray-500">
                Largeur
              </Label>
              <Input
                id="section-width"
                type="number"
                value={columnData.sectionWidth}
                onChange={(e) => handleInputChange("sectionWidth", Number.parseFloat(e.target.value) || 0)}
                placeholder="20"
              />
            </div>
            <div>
              <Label htmlFor="section-height" className="text-xs text-gray-500">
                Hauteur
              </Label>
              <Input
                id="section-height"
                type="number"
                value={columnData.sectionHeight}
                onChange={(e) => handleInputChange("sectionHeight", Number.parseFloat(e.target.value) || 0)}
                placeholder="40"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Section: {columnData.sectionWidth} × {columnData.sectionHeight} cm
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
