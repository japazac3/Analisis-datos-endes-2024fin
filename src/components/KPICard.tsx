/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function KPICard({ title, value, description, icon, trend }: KPICardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-500">{title}</CardTitle>
        <div className="text-zinc-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-900">{value}</div>
        {description && (
          <p className="text-xs text-zinc-500 mt-1">
            {description}
            {trend && (
              <span className={`ml-1 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
