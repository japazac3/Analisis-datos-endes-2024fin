/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Activity, 
  Users, 
  MapPin, 
  Heart, 
  Filter,
  Download,
  Search,
  ChevronDown
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { EndesData } from '../types';
import { calculateStats } from '../lib/data-processor';
import { KPICard } from './KPICard';
import { DistributionChart, ProportionChart } from './Charts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DashboardProps {
  data: EndesData[];
}

export function Dashboard({ data }: DashboardProps) {
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [sexFilter, setSexFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesRegion = regionFilter === 'all' || item.region === regionFilter;
      const matchesSex = sexFilter === 'all' || item.sexo === sexFilter;
      const matchesSearch = item.HHID.toString().toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSex && matchesSearch;
    });
  }, [data, regionFilter, sexFilter, searchQuery]);

  const stats = useMemo(() => calculateStats(filteredData), [filteredData]);

  const regions = useMemo(() => {
    const unique = Array.from(new Set(data.map(d => d.region))).filter(Boolean);
    return unique.sort();
  }, [data]);

  const regionDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(d => {
      counts[d.region] = (counts[d.region] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);
  }, [filteredData]);

  const sexDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(d => {
      counts[d.sexo] = (counts[d.sexo] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const imcDistribution = useMemo(() => {
    const categories = {
      'Bajo Peso': 0,
      'Normal': 0,
      'Sobrepeso': 0,
      'Obesidad': 0
    };
    filteredData.forEach(d => {
      if (!d.imc) return;
      if (d.imc < 18.5) categories['Bajo Peso']++;
      else if (d.imc < 25) categories['Normal']++;
      else if (d.imc < 30) categories['Sobrepeso']++;
      else categories['Obesidad']++;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-zinc-100">
        <div className="flex items-center gap-2 text-zinc-500">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtros:</span>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Buscar por HHID..." 
              className="pl-10 bg-zinc-50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-[180px] bg-zinc-50 border-none">
            <SelectValue placeholder="Región" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Regiones</SelectItem>
            {regions.map(r => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sexFilter} onValueChange={setSexFilter}>
          <SelectTrigger className="w-[150px] bg-zinc-50 border-none">
            <SelectValue placeholder="Sexo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Masculino">Masculino</SelectItem>
            <SelectItem value="Femenino">Femenino</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 px-3 py-1">
          {filteredData.length} registros encontrados
        </Badge>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Encuestados" 
          value={stats.totalRecords.toLocaleString()} 
          icon={<Users className="w-5 h-5" />}
          description="Personas en la muestra"
        />
        <KPICard 
          title="IMC Promedio" 
          value={stats.avgIMC.toFixed(1)} 
          icon={<Activity className="w-5 h-5" />}
          description="Índice de Masa Corporal"
        />
        <KPICard 
          title="Prevalencia HTA" 
          value={`${stats.hypertensionPrevalence.toFixed(1)}%`} 
          icon={<Heart className="w-5 h-5" />}
          description="Hipertensión Arterial"
        />
        <KPICard 
          title="Prevalencia Diabetes" 
          value={`${stats.diabetesPrevalence.toFixed(1)}%`} 
          icon={<Activity className="w-5 h-5" />}
          description="Diabetes Mellitus"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribución por Región (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionChart 
              data={regionDistribution} 
              dataKey="value" 
              nameKey="name" 
              title="Cantidad de personas por región"
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Estado Nutricional (IMC)</CardTitle>
          </CardHeader>
          <CardContent>
            <ProportionChart 
              data={imcDistribution} 
              dataKey="value" 
              nameKey="name" 
              title="Distribución de categorías de IMC"
            />
          </CardContent>
        </Card>
      </div>

      {/* Data Table Section */}
      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Resumen de Datos</CardTitle>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border border-zinc-100">
            <Table>
              <TableHeader className="bg-zinc-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[100px]">HHID</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Región</TableHead>
                  <TableHead>IMC</TableHead>
                  <TableHead>HTA</TableHead>
                  <TableHead>Diabetes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.slice(0, 100).map((item) => (
                  <TableRow key={item.HHID}>
                    <TableCell className="font-medium">{item.HHID}</TableCell>
                    <TableCell>{item.edad}</TableCell>
                    <TableCell>{item.sexo}</TableCell>
                    <TableCell>{item.region}</TableCell>
                    <TableCell>
                      <Badge variant={item.imc >= 30 ? "destructive" : item.imc >= 25 ? "outline" : "secondary"}>
                        {item.imc?.toFixed(1) || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.hipertension_medida || item.diag_hta || '-'}</TableCell>
                    <TableCell>{item.diabetes_dx || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
