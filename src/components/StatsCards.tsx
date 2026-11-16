import React from 'react';
import { 
  Package, 
  Coins, 
  Activity, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { AssetItem, AssetCategory } from '../types/asset';
import { formatRupiah, formatNumber } from '../utils/formatters';

interface StatsCardsProps {
  assets: AssetItem[];
  currentCategory: AssetCategory;
  totalAllAssetsCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  assets,
  currentCategory,
  totalAllAssetsCount
}) => {
  const totalCount = assets.length;
  const totalValue = assets.reduce((sum, item) => sum + (item.total || 0), 0);
  const avgValue = totalCount > 0 ? totalValue / totalCount : 0;

  // Active vs Disposed/Broken count within current selection
  const activeCount = assets.filter(a => a.category === 'KIB_B').length;
  const damagedCount = assets.filter(a => a.category === 'KIB_J').length;
  const mpsaCount = assets.filter(a => a.category === 'MPSA').length;

  // Highest value asset in selection
  const maxAsset = assets.reduce<AssetItem | null>((max, curr) => {
    if (!max || curr.total > max.total) return curr;
    return max;
  }, null);

  const percentageOfTotal = totalAllAssetsCount > 0 
    ? ((totalCount / totalAllAssetsCount) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* Card 1: Total Unit */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Volume Aset
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {formatNumber(totalCount)}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              unit barang
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentCategory === 'ALL' 
              ? 'Seluruh aset di SMKN 40' 
              : `${percentageOfTotal}% dari total 3.313 barang inventaris`}
          </p>
        </div>
      </div>

      {/* Card 2: Total Nilai Aset */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Total Nilai Perolehan
          </span>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums truncate" title={formatRupiah(totalValue)}>
            {formatRupiah(totalValue)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Rata-rata: <span className="font-mono tabular-nums font-medium text-slate-700 dark:text-slate-300">{formatRupiah(avgValue)}</span> / unit
          </p>
        </div>
      </div>

      {/* Card 3: Komposisi Kondisi */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Distribusi Status
          </span>
          <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Aktif (KIB B)
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
              {formatNumber(activeCount)} ({totalCount > 0 ? ((activeCount/totalCount)*100).toFixed(0) : 0}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              Rusak (KIB J)
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
              {formatNumber(damagedCount)} ({totalCount > 0 ? ((damagedCount/totalCount)*100).toFixed(0) : 0}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Penghapusan (MPSA)
            </span>
            <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
              {formatNumber(mpsaCount)} ({totalCount > 0 ? ((mpsaCount/totalCount)*100).toFixed(0) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Card 4: Nilai Tertinggi */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Aset Nilai Tertinggi
          </span>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-sm font-bold text-slate-900 dark:text-white truncate" title={maxAsset?.jenisBarang}>
            {maxAsset?.jenisBarang || 'Tidak ada'}
          </div>
          <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
            {maxAsset ? formatRupiah(maxAsset.total) : 'Rp 0'}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
            {maxAsset ? `${maxAsset.categoryLabel} · Reg ${maxAsset.reg}` : '-'}
          </p>
        </div>
      </div>

    </div>
  );
};
