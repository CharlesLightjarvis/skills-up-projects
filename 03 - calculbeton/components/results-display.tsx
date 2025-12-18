import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, CheckCircle } from "lucide-react";
import type { CalculationResults } from "../types/materials";

interface ResultsDisplayProps {
  results: CalculationResults | null;
  isCalculated: boolean;
}

export function ResultsDisplay({ results, isCalculated }: ResultsDisplayProps) {
  if (!isCalculated || !results) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Calculator className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 font-medium">Résultats des calculs</p>
          <p className="text-sm text-gray-400">
            Sélectionnez les matériaux et cliquez sur Calculer
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résultats des matériaux */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg font-semibold text-green-800">
              Résistances des Matériaux
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Résistance de calcul du béton
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-xs text-gray-500 mb-1">fcd = fck / γc</div>
                <div className="text-2xl font-bold text-blue-600">
                  {results.fcd}{" "}
                  <span className="text-sm font-normal text-gray-500">MPa</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Limite de calcul de lacier
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-xs text-gray-500 mb-1">fyd = fyk / γs</div>
                <div className="text-2xl font-bold text-orange-600">
                  {results.fyd}{" "}
                  <span className="text-sm font-normal text-gray-500">MPa</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats de flambement */}
      {results.flambement && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg font-semibold text-purple-800">
                Calculs de Flambement
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700">
                  Longueur de flambement
                </span>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-xs text-gray-500 mb-1">lf = k × l₀</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {results.flambement.lf}{" "}
                    <span className="text-sm font-normal text-gray-500">m</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700">
                  Élancement
                </span>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-xs text-gray-500 mb-1">
                    λ = lf × √12 / a
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {results.flambement.lambda}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium text-gray-700">
                  Coefficient α
                </span>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-xs text-gray-500 mb-1">
                    {results.flambement.lambda < 60
                      ? "α = 0.86/(1+(λ/62)²)"
                      : results.flambement.lambda < 120
                      ? "α = (32/λ)^1.3"
                      : "Non applicable"}
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {results.flambement.alpha !== null
                      ? results.flambement.alpha
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-200">
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Condition appliquée :
                </div>
                <div className="text-sm text-gray-600 font-mono">
                  {results.flambement.alphaCondition}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">Formules utilisées</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">
              Résistances des matériaux
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Résistance de calcul du béton :</strong>
                <div className="font-mono mt-1">fcd = fck / γc</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Limite de calcul de lacier :</strong>
                <div className="font-mono mt-1">fyd = fyk / γs</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">
              Calculs de flambement
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <strong>Longueur de flambement :</strong>
                <div className="font-mono mt-1">lf = k × l₀</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Élancement :</strong>
                <div className="font-mono mt-1">λ = lf × √12 / a</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <strong>Coefficient α :</strong>
                <div className="font-mono mt-1 text-xs">
                  Si λ &lt; 60 : α = 0.86/(1+(λ/62)²)
                  <br />
                  Si 60≤λ&lt;120 : α = (32/λ)^1.3
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span>Calculs effectués selon les normes Eurocodes</span>
        </div>
      </div>
    </div>
  );
}
