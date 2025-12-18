"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Building2, CheckCircle } from "lucide-react";

import {
  CONCRETE_CLASSES,
  STEEL_TYPES,
  CONNECTION_TYPES,
} from "../constants/materials";
import type {
  ColumnData,
  CalculationResults,
  FlambementResults,
  SteelType,
} from "../types/materials";

// Tableau des armatures (diamètre en mm, sections en cm² pour 1 à 10 barres)
const ARMATURE_TABLE = [
  {
    diam: 5,
    sections: [0.19, 0.39, 0.59, 0.78, 0.98, 1.17, 1.37, 1.57, 1.76, 1.96],
  },
  {
    diam: 6,
    sections: [0.28, 0.56, 0.85, 1.13, 1.41, 1.7, 1.98, 2.26, 2.54, 2.82],
  },
  {
    diam: 8,
    sections: [0.5, 1.0, 1.5, 2.01, 2.51, 3.01, 3.51, 4.02, 4.52, 5.02],
  },
  {
    diam: 10,
    sections: [0.78, 1.57, 2.35, 3.14, 3.92, 4.71, 5.49, 6.28, 7.06, 7.85],
  },
  {
    diam: 12,
    sections: [1.13, 2.26, 3.39, 4.52, 5.65, 6.78, 7.92, 9.05, 10.18, 11.31],
  },
  {
    diam: 14,
    sections: [1.54, 3.08, 4.62, 6.16, 7.67, 9.23, 10.7, 12.31, 13.85, 15.39],
  },
  {
    diam: 16,
    sections: [2.01, 4.02, 6.03, 8.04, 10.05, 12.06, 14.07, 16.08, 18.09, 20.1],
  },
  {
    diam: 20,
    sections: [
      3.14, 6.28, 9.42, 12.56, 15.7, 18.84, 21.99, 25.13, 28.27, 31.41,
    ],
  },
  {
    diam: 25,
    sections: [
      4.91, 9.82, 14.73, 19.63, 24.54, 29.45, 34.36, 39.27, 44.08, 49.09,
    ],
  },
  {
    diam: 32,
    sections: [
      8.04, 16.08, 24.12, 32.17, 40.21, 48.25, 56.28, 64.34, 72.38, 80.42,
    ],
  },
  {
    diam: 40,
    sections: [
      12.56, 25.13, 37.7, 50.26, 62.83, 75.33, 87.96, 100.53, 113.08, 125.64,
    ],
  },
];

export default function CivilEngineeringCalculator() {
  const [selectedConcrete, setSelectedConcrete] = useState("C20/25");
  const [selectedSteel, setSelectedSteel] = useState("B500");
  const [isCalculated, setIsCalculated] = useState(false);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [columnData, setColumnData] = useState<ColumnData>({
    freeLength: 3.0,
    sectionWidth: 20,
    sectionHeight: 40,
    connectionType: "articule-encastre",
    Ned: 0,
  });

  // Saisie manuelle pour la proposition d'armature personnalisée
  const [userLongNb, setUserLongNb] = useState(4);
  const [userLongDiam, setUserLongDiam] = useState(12);
  const [userCadres, setUserCadres] = useState(1);
  const [userEtriers, setUserEtriers] = useState(2);
  const [userTransvDiam, setUserTransvDiam] = useState(6);
  const [userEnrobage, setUserEnrobage] = useState(2.5);
  const [userFace, setUserFace] = useState("largeur"); // largeur ou hauteur
  const largeur = columnData.sectionWidth;
  const hauteur = columnData.sectionHeight;
  const faceLength = userFace === "largeur" ? largeur : hauteur;

  // Section unitaire et totale des aciers longitudinaux
  const diamRow = ARMATURE_TABLE.find((row) => row.diam === userLongDiam);
  const sectionUnitaire = diamRow ? diamRow.sections[0] : 0;
  const sectionTotale = userLongNb * sectionUnitaire;

  // Nombre total de brins transversaux
  const nbBrinsTransv = 2 * userCadres + 2 * userEtriers;

  // Calcul de l'espacement réel
  const dLong = userLongDiam / 10; // cm
  const dTransv = userTransvDiam / 10; // cm
  const longueurUtile =
    faceLength -
    2 * userEnrobage -
    userLongNb * dLong -
    nbBrinsTransv * dTransv;
  const espacement = userLongNb > 1 ? longueurUtile / (userLongNb - 1) : 0;

  const calculateKh = (h: number) => {
    const h_m = h / 100;
    return (0.75 + 0.5 * h_m) * 0.95;
  };

  const calculateKs = (fyk: number) => {
    return fyk <= 500 ? 1 : undefined;
  };

  const calculateFlambement = (
    data: ColumnData,
    steelType?: SteelType,
    alpha?: number,
    fcd?: number
  ): FlambementResults => {
    const connectionType = CONNECTION_TYPES.find(
      (type) => type.value === data.connectionType
    );
    const k = connectionType?.coefficient || 1.0;
    const lf = k * data.freeLength;

    // a en cm, on convertit en m
    const a_cm = Math.min(data.sectionWidth, data.sectionHeight);
    const a = a_cm / 100; // conversion en mètres
    const lambda = (lf * Math.sqrt(12)) / a;

    let alphaValue: number | null = null;
    let alphaCondition = "";

    if (lambda < 60) {
      alphaValue = 0.86 / (1 + Math.pow(lambda / 62, 2));
      alphaCondition = "λ < 60 : α = 0.86 / (1 + (λ/62)²)";
    } else if (lambda >= 60 && lambda < 120) {
      alphaValue = Math.pow(32 / lambda, 1.3);
      alphaCondition = "60 ≤ λ < 120 : α = (32/λ)^1.3";
    } else {
      alphaValue = null;
      alphaCondition = "λ ≥ 120 : Calcul non applicable";
    }

    const Kh = calculateKh(data.sectionHeight);
    const Ks = steelType ? calculateKs(steelType.fyk) : undefined;

    // Calcul de la section brute Ac (en m²)
    const largeur_m = data.sectionWidth / 100;
    const hauteur_m = data.sectionHeight / 100;
    const Ac = largeur_m * hauteur_m;

    // Calcul de la section théorique As
    let As = undefined;
    if (
      data.Ned > 0 &&
      Kh !== undefined &&
      Ks !== undefined &&
      alphaValue !== null &&
      Ac > 0 &&
      fcd !== undefined &&
      results &&
      results.fyd > 0
    ) {
      As = (data.Ned / (Kh * Ks * alphaValue) - Ac * fcd) / results.fyd;
    }

    // Calcul Asmin et Asmax
    let Asmin = undefined;
    let Asmax = undefined;
    if (steelType && data.Ned > 0 && Ac > 0 && results && results.fyd > 0) {
      Asmin = Math.max((0.1 * data.Ned) / results.fyd, 0.002 * Ac);
      Asmax = 0.04 * Ac;
    }

    // Vérification théorique
    let AsVerif = undefined;
    if (As !== undefined && Asmin !== undefined && Asmax !== undefined) {
      if (As <= Asmin) {
        AsVerif = Asmin;
      } else if (As >= Asmax) {
        AsVerif = Asmax;
      } else {
        AsVerif = As;
      }
    }

    return {
      lf: Number(lf.toFixed(3)),
      lambda: Number(lambda.toFixed(2)),
      alpha: alphaValue ? Number(alphaValue.toFixed(4)) : null,
      alphaCondition,
      Kh: Kh !== undefined ? Number(Kh.toFixed(4)) : undefined,
      Ks: Ks !== undefined ? Ks : undefined,
      Ac: Ac !== undefined ? Number(Ac.toFixed(6)) : undefined,
      As: As !== undefined ? Number(As.toFixed(6)) : undefined,
      Asmin: Asmin !== undefined ? Number(Asmin.toFixed(6)) : undefined,
      Asmax: Asmax !== undefined ? Number(Asmax.toFixed(6)) : undefined,
      AsVerif: AsVerif !== undefined ? Number(AsVerif.toFixed(6)) : undefined,
    };
  };

  const handleCalculate = () => {
    const concreteClass = CONCRETE_CLASSES.find(
      (c) => c.name === selectedConcrete
    );
    const steelType = STEEL_TYPES.find((s) => s.name === selectedSteel);

    if (concreteClass && steelType) {
      const fcd = concreteClass.fck / concreteClass.gammaC;
      const fyd = steelType.fyk / steelType.gammaS;
      const flambement = calculateFlambement(
        columnData,
        steelType,
        undefined,
        fcd
      );

      const newResults: CalculationResults = {
        fcd: Number(fcd.toFixed(2)),
        fyd: Number(fyd.toFixed(2)),
        flambement,
      };

      setResults(newResults);
      setIsCalculated(true);
    }
  };

  const handleReset = () => {
    setIsCalculated(false);
    setResults(null);
    setSelectedConcrete("C20/25");
    setSelectedSteel("B500");
    setColumnData({
      freeLength: 3.0,
      sectionWidth: 20,
      sectionHeight: 40,
      connectionType: "articule-encastre",
      Ned: 0,
    });
  };

  const selectedConcreteData = CONCRETE_CLASSES.find(
    (c) => c.name === selectedConcrete
  );
  const selectedSteelData = STEEL_TYPES.find((s) => s.name === selectedSteel);

  const sectionVerifieeCm2 = results?.flambement?.AsVerif
    ? results.flambement.AsVerif * 10000
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Calculateur Génie Civil
              </h1>
              <p className="text-sm text-gray-600">
                Calculs de résistance des matériaux
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Parameters Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Béton */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Béton
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="concrete-select"
                    className="text-sm font-medium"
                  >
                    Classe/Type
                  </Label>
                  <Select
                    value={selectedConcrete}
                    onValueChange={setSelectedConcrete}
                  >
                    <SelectTrigger id="concrete-select">
                      <SelectValue placeholder="Sélectionner béton" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONCRETE_CLASSES.map((concrete) => (
                        <SelectItem key={concrete.name} value={concrete.name}>
                          {concrete.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedConcreteData && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        fck (résistance)
                      </span>
                      <Badge variant="secondary" className="font-mono">
                        {selectedConcreteData.fck} MPa
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        γc (sécurité)
                      </span>
                      <Badge variant="outline" className="font-mono">
                        {selectedConcreteData.gammaC}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acier */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Acier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="steel-select" className="text-sm font-medium">
                    Classe/Type
                  </Label>
                  <Select
                    value={selectedSteel}
                    onValueChange={setSelectedSteel}
                  >
                    <SelectTrigger id="steel-select">
                      <SelectValue placeholder="Sélectionner acier" />
                    </SelectTrigger>
                    <SelectContent>
                      {STEEL_TYPES.map((steel) => (
                        <SelectItem key={steel.name} value={steel.name}>
                          {steel.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSteelData && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        fyk (limite élastique)
                      </span>
                      <Badge variant="secondary" className="font-mono">
                        {selectedSteelData.fyk} MPa
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        γs (sécurité)
                      </span>
                      <Badge variant="outline" className="font-mono">
                        {selectedSteelData.gammaS}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Paramètres du Poteau */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Paramètres du Poteau
                </CardTitle>
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
                      onChange={(e) =>
                        setColumnData({
                          ...columnData,
                          freeLength: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 3.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="connection-type">
                      Nature de la liaison
                    </Label>
                    <Select
                      value={columnData.connectionType}
                      onValueChange={(value) =>
                        setColumnData({
                          ...columnData,
                          connectionType: value as ColumnData["connectionType"],
                        })
                      }
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

                  <div className="space-y-2">
                    <Label htmlFor="ned">Effort agissant Ned (MN)</Label>
                    <Input
                      id="ned"
                      type="number"
                      step="0.01"
                      value={columnData.Ned}
                      onChange={(e) =>
                        setColumnData({
                          ...columnData,
                          Ned: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 1.25"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Section du poteau (cm)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label
                        htmlFor="section-width"
                        className="text-xs text-gray-500"
                      >
                        Largeur
                      </Label>
                      <Input
                        id="section-width"
                        type="number"
                        value={columnData.sectionWidth}
                        onChange={(e) =>
                          setColumnData({
                            ...columnData,
                            sectionWidth:
                              Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="section-height"
                        className="text-xs text-gray-500"
                      >
                        Hauteur
                      </Label>
                      <Input
                        id="section-height"
                        type="number"
                        value={columnData.sectionHeight}
                        onChange={(e) =>
                          setColumnData({
                            ...columnData,
                            sectionHeight:
                              Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="40"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Section: {columnData.sectionWidth} ×{" "}
                    {columnData.sectionHeight} cm
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleCalculate}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculer les Résistances
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg">
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {!isCalculated || !results ? (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 font-medium">
                  Résultats des calculs
                </p>
                <p className="text-sm text-gray-400">
                  Sélectionnez les matériaux et cliquez sur Calculer
                </p>
              </CardContent>
            </Card>
          ) : (
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
                      <span className="text-sm font-medium text-gray-700">
                        Résistance de calcul du béton
                      </span>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">
                          fcd = fck / γc
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {results.fcd}{" "}
                          <span className="text-sm font-normal text-gray-500">
                            MPa
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-sm font-medium text-gray-700">
                        Limite de calcul de lacier
                      </span>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">
                          fyd = fyk / γs
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          {results.fyd}{" "}
                          <span className="text-sm font-normal text-gray-500">
                            MPa
                          </span>
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
                          <div className="text-xs text-gray-500 mb-1">
                            lf = k × l₀
                          </div>
                          <div className="text-2xl font-bold text-purple-600">
                            {results.flambement.lf}{" "}
                            <span className="text-sm font-normal text-gray-500">
                              m
                            </span>
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

                    <div className="space-y-3">
                      <span className="text-sm font-medium text-gray-700">
                        Coefficient Kh
                      </span>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">
                          Kh = (0.75 + 0.5 × h) × 0.95
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {results.flambement.Kh !== undefined
                            ? results.flambement.Kh
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-sm font-medium text-gray-700">
                        Coefficient Ks
                      </span>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-xs text-gray-500 mb-1">
                          Ks = 1 si fyk ≤ 500
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {results.flambement.Ks !== undefined
                            ? results.flambement.Ks
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    {results.flambement.Ac !== undefined && (
                      <div className="space-y-3">
                        <span className="text-sm font-medium text-gray-700">
                          Section brute Ac (m²)
                        </span>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">
                            Ac = largeur × hauteur (en m²)
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {results.flambement.Ac}
                            <span className="ml-2 text-base text-gray-500">
                              ⇒{" "}
                              {results.flambement.Ac !== undefined
                                ? (results.flambement.Ac * 10000).toFixed(2)
                                : "-"}{" "}
                              cm²
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.flambement.As !== undefined && (
                      <div className="space-y-3">
                        <span className="text-sm font-medium text-gray-700">
                          Section théorique As (m²)
                        </span>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">
                            As = (Ned / (Kh × Ks × α ) - Ac × fcd) / fyd
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {results.flambement.As}
                            <span className="ml-2 text-base text-gray-500">
                              ⇒{" "}
                              {results.flambement.As !== undefined
                                ? (results.flambement.As * 10000).toFixed(2)
                                : "-"}{" "}
                              cm²
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.flambement.Asmin !== undefined && (
                      <div className="space-y-3">
                        <span className="text-sm font-medium text-gray-700">
                          Section dacier minimale Asmin (m²)
                        </span>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">
                            Détail : max(0.1 × {columnData.Ned} / {results.fyd}{" "}
                            ; 0.002 × {results.flambement.Ac}) ={" "}
                            {results.flambement.Asmin}
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {results.flambement.Asmin}
                            <span className="ml-2 text-base text-gray-500">
                              ⇒{" "}
                              {results.flambement.Asmin !== undefined
                                ? (results.flambement.Asmin * 10000).toFixed(2)
                                : "-"}{" "}
                              cm²
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.flambement.Asmax !== undefined && (
                      <div className="space-y-3">
                        <span className="text-sm font-medium text-gray-700">
                          Section dacier maximale Asmax (m²)
                        </span>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">
                            Asmax = 0.04 × Ac
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {results.flambement.Asmax}
                            <span className="ml-2 text-base text-gray-500">
                              ⇒{" "}
                              {results.flambement.Asmax !== undefined
                                ? (results.flambement.Asmax * 10000).toFixed(2)
                                : "-"}{" "}
                              cm²
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {results.flambement.AsVerif !== undefined && (
                      <div className="space-y-3">
                        <span className="text-sm font-medium text-gray-700">
                          Section dacier vérifiée (m²)
                        </span>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="text-xs text-gray-500 mb-1">
                            Vérification :
                            <br />
                            - Si As ≤ Asmin, on prend Asmin
                            <br />
                            - Si As ≥ Asmax, on prend Asmax
                            <br />- Sinon, As compris entre Asmin et Asmax
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="text-2xl font-bold text-green-600">
                              {results.flambement.AsVerif}
                              <span className="ml-2 text-base text-gray-500">
                                ⇒{" "}
                                {results.flambement.AsVerif !== undefined
                                  ? (
                                      results.flambement.AsVerif * 10000
                                    ).toFixed(2)
                                  : "-"}{" "}
                                cm²
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Section de saisie manuelle d'armature personnalisée */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Saisie personnalisée de larmature
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div>
                      <Label>Face à étudier</Label>
                      <Select value={userFace} onValueChange={setUserFace}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="largeur">
                            Largeur ({largeur} cm)
                          </SelectItem>
                          <SelectItem value="hauteur">
                            Hauteur ({hauteur} cm)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nombre daciers longitudinaux</Label>
                      <Input
                        type="number"
                        min={2}
                        max={28}
                        value={userLongNb}
                        onChange={(e) => setUserLongNb(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <div>
                      <Label>Diamètre aciers longitudinaux (mm)</Label>
                      <Select
                        value={userLongDiam.toString()}
                        onValueChange={(v) => setUserLongDiam(Number(v))}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ARMATURE_TABLE.filter((row) => row.diam >= 10).map(
                            (row) => (
                              <SelectItem
                                key={row.diam}
                                value={row.diam.toString()}
                              >
                                {row.diam}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nombre de cadres</Label>
                      <Input
                        type="number"
                        min={0}
                        value={userCadres}
                        onChange={(e) => setUserCadres(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <div>
                      <Label>Nombre détriers</Label>
                      <Input
                        type="number"
                        min={0}
                        value={userEtriers}
                        onChange={(e) => setUserEtriers(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                    <div>
                      <Label>Diamètre aciers transversaux (mm)</Label>
                      <Input
                        type="number"
                        min={4}
                        max={16}
                        value={userTransvDiam}
                        onChange={(e) =>
                          setUserTransvDiam(Number(e.target.value))
                        }
                        className="w-24"
                      />
                    </div>
                    <div>
                      <Label>Enrobage (cm)</Label>
                      <Input
                        type="number"
                        min={2}
                        max={5}
                        step={0.1}
                        value={userEnrobage}
                        onChange={(e) =>
                          setUserEnrobage(Number(e.target.value))
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="text-sm text-gray-700">
                      Section unitaire (longitudinal) :{" "}
                      <b>{sectionUnitaire} cm²</b>
                    </div>
                    <div className="text-sm text-gray-700">
                      Section totale (longitudinal) : <b>{sectionTotale} cm²</b>
                    </div>
                    <div className="text-sm text-gray-700">
                      Nombre total de brins transversaux :{" "}
                      <b>{nbBrinsTransv}</b> (cadres et étriers)
                    </div>
                    <div className="text-sm text-gray-700">
                      Espacement réel entre barres :{" "}
                      <b>{espacement > 0 ? espacement.toFixed(2) : "-"} cm</b>
                    </div>
                    <div className="text-xs text-gray-500">
                      Formule : Longueur utile = L - 2×enrobage - nBarres×dLong
                      - nBrins×dTransv
                    </div>
                    <div className="text-xs text-gray-500">
                      Résumé : {userCadres} cadre(s) ({2 * userCadres} brins),{" "}
                      {userEtriers} étrier(s) ({2 * userEtriers} brins),{" "}
                      {userLongNb} aciers longitudinaux de {userLongDiam} mm
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full shadow">
                      {userLongNb}HA{userLongDiam} + {userCadres} cadre(s) +{" "}
                      {userEtriers} étrier(s) de diamètre {userTransvDiam} mm
                      avec un enrobage de {userEnrobage} cm
                    </span>
                  </div>
                  {sectionVerifieeCm2 !== undefined && (
                    <div className="flex justify-end mt-2">
                      {sectionTotale >= sectionVerifieeCm2 ? (
                        <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full shadow">
                          Choix approuvé
                        </span>
                      ) : (
                        <span className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-4 py-2 rounded-full shadow">
                          Veuillez reproposer une section darmature
                          longitudinale suffisante.
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
                      {"Si λ < 60: α = 0.86/(1+(λ/62)²)"}
                      <br />
                      {"Si 60≤λ<120: α = (32/λ)^1.3"}
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
      </main>
    </div>
  );
}
