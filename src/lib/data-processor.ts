/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { EndesData } from '../types';

export async function processFile(file: File): Promise<EndesData[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as EndesData[]);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  } else if (['xls', 'xlsx', 'xlsm'].includes(extension || '')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as EndesData[];
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  } else {
    throw new Error('Formato de archivo no soportado. Use CSV o Excel.');
  }
}

export function calculateStats(data: EndesData[]) {
  if (data.length === 0) return null;

  const total = data.length;
  const sumIMC = data.reduce((acc, curr) => acc + (curr.imc || 0), 0);
  const hypertensionCount = data.filter(d => d.hipertension_medida === 'Sí' || d.diag_hta === 'Sí').length;
  const diabetesCount = data.filter(d => d.diabetes_dx === 'Sí').length;
  const sumAge = data.reduce((acc, curr) => acc + (curr.edad || 0), 0);
  const obesityCount = data.filter(d => (d.imc || 0) >= 30).length;

  return {
    totalRecords: total,
    avgIMC: sumIMC / total,
    hypertensionPrevalence: (hypertensionCount / total) * 100,
    diabetesPrevalence: (diabetesCount / total) * 100,
    avgAge: sumAge / total,
    obesityRate: (obesityCount / total) * 100,
  };
}
