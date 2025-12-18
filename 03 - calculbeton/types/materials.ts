export interface ConcreteClass {
  name: string;
  fck: number;
  gammaC: number;
}

export interface SteelType {
  name: string;
  fyk: number;
  gammaS: number;
}

export interface ColumnData {
  freeLength: number;
  sectionWidth: number;
  sectionHeight: number;
  connectionType:
    | "articule-encastre"
    | "articule-articule"
    | "encastre-encastre";
  Ned: number;
}

export interface FlambementResults {
  lf: number;
  lambda: number;
  alpha: number | null;
  alphaCondition: string;
  Kh?: number;
  Ks?: number;
  Ac?: number;
  As?: number;
  Asmin?: number;
  Asmax?: number;
  AsVerif?: number;
}

export interface CalculationResults {
  fcd: number;
  fyd: number;
  flambement?: FlambementResults;
}
