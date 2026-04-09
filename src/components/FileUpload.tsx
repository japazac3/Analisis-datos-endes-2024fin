/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Upload } from 'lucide-react';
import React, { useCallback } from 'react';

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

import { processFile } from '../lib/data-processor';

export function FileUpload({ onDataLoaded, isLoading, setIsLoading }: FileUploadProps) {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const data = await processFile(file);
      onDataLoaded(data);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error al procesar el archivo. Verifique el formato.');
    } finally {
      setIsLoading(false);
    }
  }, [onDataLoaded, setIsLoading]);

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
      <Upload className="w-12 h-12 text-zinc-400 mb-4" />
      <h3 className="text-lg font-medium text-zinc-900 mb-2">Cargar datos de ENDES 2024</h3>
      <p className="text-sm text-zinc-500 mb-6 text-center max-w-xs">
        Sube tu archivo Excel (.xls, .xlsx, .xlsm) o CSV con las columnas correspondientes.
      </p>

      <div className="relative">
        <input
          type="file"
          accept=".csv, .xls, .xlsx, .xlsm"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        {/* BOTÓN REEMPLAZADO */}
        <button
          disabled={isLoading}
          className="px-8 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isLoading ? 'Procesando...' : 'Seleccionar Archivo'}
        </button>
      </div>
    </div>
  );
}
