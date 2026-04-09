/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EndesData {
  HHID: string;
  edad: number;
  sexo: string;
  nivel_educativo: string;
  estado_civil: string;
  region: string;
  area: string;
  altitud_cluster: number;
  estrato: string;
  quintil_riqueza: string;
  score_riqueza: number;
  midieron_pa: string;
  diag_hta: string;
  midieron_glucosa: string;
  fumo_12m: string;
  fumo_30d: string;
  fuma_diario: string;
  alcohol_vida: string;
  alcohol_12m: string;
  alcohol_12dias: string;
  alcohol_30d: string;
  peso_kg: number;
  talla_cm: number;
  cintura_cm: number;
  imc: number;
  presion_sistolica_prom: number;
  presion_diastolica_prom: number;
  hipertension_medida: string;
  diabetes_dx: string;
  // Additional fields for filters (requested but maybe not in original data)
  fecha?: string;
  pais?: string;
  canal?: string;
  vendedor?: string;
  producto?: string;
  forma_pago?: string;
}

export interface DashboardStats {
  totalRecords: number;
  avgIMC: number;
  hypertensionPrevalence: number;
  diabetesPrevalence: number;
  avgAge: number;
  obesityRate: number;
}
