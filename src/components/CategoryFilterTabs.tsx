import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, Layers } from 'lucide-react';
import { AssetCategory } from '../types/asset';
import { formatRupiah, formatNumber } from '../utils/formatters';

interface CategoryFilterTabsProps {
  selectedCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
  counts: {
    ALL: { count: number; value: number };
    KIB_B: { count: number; value: number };
    KIB_J: { count: number; value: number };
    MPSA: { count: number; value: number };
  };
}

export const CategoryFilterTabs: React.FC<CategoryFilterTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  counts
}) => {
  const tabs = [
    {
      id: 'ALL' as AssetCategory,
      title: 'Semua Status Aset',
      shortTitle: 'Semua',
      desc: 'Total seluruh data inventaris mesin & peralatan SMKN 40',
      icon: Layers,
      count: counts.ALL.count,
      value: counts.ALL.value,
      badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      borderActiveClass: 'border-slate-800 dark:border-white ring-1 ring-slate-800 dark:ring-white',
      accentColor: 'text-slate-700 dark:text-slate-300'
    },
    {
      id: 'KIB_B' as AssetCategory,
      title: 'KIB B · Aset Aktif',
      shortTitle: 'KIB B (Aktif)',
      desc: 'Peralatan & mesin yang masih aktif & siap digunakan operasional',
      icon: CheckCircle2,
      count: counts.KIB_B.count,
      value: counts.KIB_B.value,
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
      borderActiveClass: 'border-emerald-600 dark:border-emerald-500 ring-2 ring-emerald-600 dark:ring-emerald-500',
      accentColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'KIB_J' as AssetCategory,
      title: 'KIB J · Aset Rusak',
      shortTitle: 'KIB J (Rusak)',
      desc: 'Peralatan & mesin kondisi rusak berat / tidak dapat difungsikan',
      icon: AlertTriangle,
      count: counts.KIB_J.count,
      value: counts.KIB_J.value,
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
      borderActiveClass: 'border-rose-600 dark:border-rose-500 ring-2 ring-rose-600 dark:ring-rose-500',
      accentColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      id: 'MPSA' as AssetCategory,
      title: 'MPSA · Penetapan Majelis',
      shortTitle: 'MPSA (Penetapan)',
      desc: 'Aset dalam proses penghapusan & menunggu penetapan majelis status aset',
      icon: Clock,
      count: counts.MPSA.count,
      value: counts.MPSA.value,
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
      borderActiveClass: 'border-amber-600 dark:border-amber-500 ring-2 ring-amber-600 dark:ring-amber-500',
      accentColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white uppercase">
            Filter Status Kategori Aset
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pilih status aset untuk memfilter daftar barang inventaris dan nilai total
          </p>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
          Total Terpilih: {formatNumber(counts[selectedCategory]?.count || 0)} Unit
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedCategory === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectCategory(tab.id)}
              className={`text-left p-3.5 rounded-xl transition-all relative border ${
                isSelected
                  ? `bg-white dark:bg-slate-900 shadow-sm ${tab.borderActiveClass}`
                  : 'bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-slate-100 dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                    <Icon className={`w-4 h-4 ${tab.accentColor}`} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {tab.title}
                    </h3>
                  </div>
                </div>

                <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md tabular-nums ${tab.badgeClass}`}>
                  {formatNumber(tab.count)} unit
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-1">
                {tab.desc}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium">
                  Total Nilai Buku
                </span>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatRupiah(tab.value)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
