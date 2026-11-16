import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Award, 
  PackageCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { AssetItem, AssetCategory } from '../types/asset';
import { formatRupiah, formatNumber } from '../utils/formatters';

interface AnalyticsViewProps {
  assets: AssetItem[];
  onSelectAsset: (asset: AssetItem) => void;
  onFilterByCategory: (cat: AssetCategory) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  assets,
  onSelectAsset,
  onFilterByCategory
}) => {
  // 1. Category Distribution
  const categoryStats = useMemo(() => {
    const kibB = assets.filter(a => a.category === 'KIB_B');
    const kibJ = assets.filter(a => a.category === 'KIB_J');
    const mpsa = assets.filter(a => a.category === 'MPSA');

    const totalVal = assets.reduce((acc, a) => acc + a.total, 0);

    return [
      {
        key: 'KIB_B' as AssetCategory,
        label: 'KIB B (Aset Aktif)',
        desc: 'Peralatan & mesin masih aktif beroperasi',
        count: kibB.length,
        val: kibB.reduce((acc, a) => acc + a.total, 0),
        color: 'bg-emerald-500',
        textColor: 'text-emerald-700 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-800'
      },
      {
        key: 'KIB_J' as AssetCategory,
        label: 'KIB J (Aset Rusak)',
        desc: 'Peralatan & mesin kondisi rusak berat',
        count: kibJ.length,
        val: kibJ.reduce((acc, a) => acc + a.total, 0),
        color: 'bg-rose-500',
        textColor: 'text-rose-700 dark:text-rose-400',
        borderColor: 'border-rose-200 dark:border-rose-800'
      },
      {
        key: 'MPSA' as AssetCategory,
        label: 'MPSA (Penetapan Majelis)',
        desc: 'Proses penghapusan menunggu majelis',
        count: mpsa.length,
        val: mpsa.reduce((acc, a) => acc + a.total, 0),
        color: 'bg-amber-500',
        textColor: 'text-amber-700 dark:text-amber-400',
        borderColor: 'border-amber-200 dark:border-amber-800'
      }
    ];
  }, [assets]);

  // 2. Group Category Breakdown
  const groupStats = useMemo(() => {
    const map = new Map<string, { count: number; val: number }>();
    assets.forEach(a => {
      const g = a.groupCategory || 'Lainnya';
      const existing = map.get(g) || { count: 0, val: 0 };
      map.set(g, { count: existing.count + 1, val: existing.val + a.total });
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.val - a.val);
  }, [assets]);

  // 3. Acquisition Era Breakdown
  const eraStats = useMemo(() => {
    const eras: Record<string, { count: number; val: number }> = {
      '1977 - 1999 (Perintis)': { count: 0, val: 0 },
      '2000 - 2009 (Dekade 2000)': { count: 0, val: 0 },
      '2010 - 2015 (Modernisasi)': { count: 0, val: 0 },
      '2016 - 2020 (Digitalisasi)': { count: 0, val: 0 },
      '2021 - 2026 (Pengadaan Terkini)': { count: 0, val: 0 }
    };

    assets.forEach(a => {
      const y = a.tahunOleh;
      if (!y || y <= 1999) {
        eras['1977 - 1999 (Perintis)'].count++;
        eras['1977 - 1999 (Perintis)'].val += a.total;
      } else if (y <= 2009) {
        eras['2000 - 2009 (Dekade 2000)'].count++;
        eras['2000 - 2009 (Dekade 2000)'].val += a.total;
      } else if (y <= 2015) {
        eras['2010 - 2015 (Modernisasi)'].count++;
        eras['2010 - 2015 (Modernisasi)'].val += a.total;
      } else if (y <= 2020) {
        eras['2016 - 2020 (Digitalisasi)'].count++;
        eras['2016 - 2020 (Digitalisasi)'].val += a.total;
      } else {
        eras['2021 - 2026 (Pengadaan Terkini)'].count++;
        eras['2021 - 2026 (Pengadaan Terkini)'].val += a.total;
      }
    });

    return Object.entries(eras).map(([label, data]) => ({ label, ...data }));
  }, [assets]);

  // 4. Top 10 Most Valuable Assets
  const topValuable = useMemo(() => {
    return [...assets]
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [assets]);

  // 5. Top 8 Most Common Item Types
  const topTypes = useMemo(() => {
    const map = new Map<string, { count: number; val: number }>();
    assets.forEach(a => {
      const existing = map.get(a.jenisBarang) || { count: 0, val: 0 };
      map.set(a.jenisBarang, { count: existing.count + 1, val: existing.val + a.total });
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [assets]);

  const totalAssetsCount = assets.length;
  const totalAssetsValue = assets.reduce((sum, a) => sum + a.total, 0);

  return (
    <div className="space-y-6">
      
      {/* Category Breakdown Spotlight */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Perbandingan Status Kategori Aset (KIB B vs KIB J vs MPSA)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Proporsi jumlah unit dan nilai buku peralatan mesin di SMKN 40
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white tabular-nums">
            Total: {formatRupiah(totalAssetsValue)}
          </span>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden flex">
            {categoryStats.map(cat => {
              const pct = totalAssetsValue > 0 ? (cat.val / totalAssetsValue) * 100 : 0;
              return (
                <div
                  key={cat.key}
                  style={{ width: `${pct}%` }}
                  className={`${cat.color} h-full transition-all`}
                  title={`${cat.label}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {categoryStats.map(cat => {
            const countPct = totalAssetsCount > 0 ? ((cat.count / totalAssetsCount) * 100).toFixed(1) : '0';
            const valPct = totalAssetsValue > 0 ? ((cat.val / totalAssetsValue) * 100).toFixed(1) : '0';

            return (
              <div
                key={cat.key}
                onClick={() => onFilterByCategory(cat.key)}
                className={`p-4 rounded-xl border ${cat.borderColor} bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${cat.textColor}`}>
                    {cat.label}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {formatNumber(cat.count)} unit ({countPct}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {cat.desc}
                </p>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Nilai Aset
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      {formatRupiah(cat.val)}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {valPct}% dari total nilai
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row: Group Category & Acquisition Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kelompok Barang */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Distribusi per Kelompok Barang
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Klasifikasi jenis peruntukan peralatan sekolah
            </p>
          </div>

          <div className="space-y-3">
            {groupStats.map(item => {
              const maxVal = groupStats[0]?.val || 1;
              const barWidth = Math.max(8, (item.val / maxVal) * 100);

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        {formatNumber(item.count)} unit
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums w-28">
                        {formatRupiah(item.val)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${barWidth}%` }}
                      className="h-full bg-emerald-500/80 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Perolehan Era */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Linimasa Pengadaan Aset (1977 - 2026)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historis perolehan aset berdasarkan dekade dan periode
            </p>
          </div>

          <div className="space-y-3.5">
            {eraStats.map(era => {
              const maxEraVal = Math.max(...eraStats.map(e => e.val)) || 1;
              const barWidth = Math.max(6, (era.val / maxEraVal) * 100);

              return (
                <div key={era.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {era.label}
                    </span>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        {formatNumber(era.count)} unit
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums w-28">
                        {formatRupiah(era.val)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${barWidth}%` }}
                      className="h-full bg-blue-500/80 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Row: Top Expensive Assets & Top Frequent Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 8 Nilai Tertinggi */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>8 Aset dengan Nilai Buku Tertinggi</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {topValuable.map((asset, idx) => (
              <div 
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-slate-400 dark:text-slate-500 font-bold tabular-nums w-4">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {asset.jenisBarang}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                      {asset.categoryLabel} · Reg {asset.reg} · {asset.merekType}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatRupiah(asset.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 8 Item Populer */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-500" />
              <span>8 Jenis Barang Terbanyak</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {topTypes.map((item, idx) => (
              <div 
                key={item.name}
                className="py-2.5 flex items-center justify-between gap-3 px-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-slate-400 dark:text-slate-500 font-bold tabular-nums w-4">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </span>
                </div>

                <div className="text-right shrink-0 flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatNumber(item.count)} unit
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums text-[11px] w-24">
                    {formatRupiah(item.val)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
