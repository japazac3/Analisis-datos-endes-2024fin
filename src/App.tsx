/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { EndesData } from './types';
import { LayoutDashboard, Database, Info, Settings } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<EndesData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-zinc-200 z-20 hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">ENDES</h1>
              <p className="text-xs text-zinc-500 font-medium tracking-wider uppercase">Analítica 2024</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
            <NavItem icon={<Database className="w-5 h-5" />} label="Explorador" />
            <NavItem icon={<Info className="w-5 h-5" />} label="Metodología" />
            <NavItem icon={<Settings className="w-5 h-5" />} label="Configuración" />
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-200" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Analista ENDES</p>
              <p className="text-xs text-zinc-500 truncate">japazac3@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Análisis de Datos ENDES 2024</h2>
            <p className="text-zinc-500 mt-1">Encuesta Demográfica y de Salud Familiar - Procesamiento Automático</p>
          </div>
          {data && (
            <button 
              onClick={() => setData(null)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Cargar otro archivo
            </button>
          )}
        </header>

        {!data ? (
          <div className="max-w-2xl mx-auto mt-20">
            <FileUpload 
              onDataLoaded={setData} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                title="Procesamiento Rápido" 
                description="Soporte para Excel y CSV con detección automática de columnas."
              />
              <FeatureCard 
                title="Visualización Dinámica" 
                description="Gráficos interactivos y KPIs en tiempo real."
              />
              <FeatureCard 
                title="Privacidad Total" 
                description="Tus datos se procesan localmente en el navegador."
              />
            </div>
          </div>
        ) : (
          <Dashboard data={data} />
        )}
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-blue-50 text-blue-600 shadow-sm' 
          : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
      }`}
    >
      {icon}
      {label}
    </a>
  );
}

function FeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm">
      <h4 className="font-bold text-zinc-900 mb-2">{title}</h4>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

import { Activity } from 'lucide-react';
