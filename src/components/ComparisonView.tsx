import React, { useState, useMemo } from 'react';
import { 
  GitCompare, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { AssetItem } from '../types/asset';
import { formatRupiah, formatNumber } from '../utils/formatters';

interface ComparisonViewProps {
  allAssets: AssetItem[];
  onSelectAsset: (asset: AssetItem) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ allAssets, onSelectAsset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('Meja Sekolah');

  // Aggregated data per jenisBarang across all 3 categories
  const comparisonData = useMemo(() => {
    const map = new Map<string, {
      name: string;
      group: string;
      totalCount: number;
      totalVal: number;
      kibBCount: number;
      kibBVal: number;
      kibJCount: number;
      kibJVal: number;
      mpsaCount: number;
      mpsaVal: number;
    }>();

    allAssets.forEach(a => {
      const name = a.jenisBarang;
      const existing = map.get(name) || {
        name,
        group: a.groupCategory,
        totalCount: 0,
        totalVal: 0,
        kibBCount: 0,
        kibBVal: 0,
        kibJCount: 0,
        kibJVal: 0,
        mpsaCount: 0,
        mpsaVal: 0
      };

      existing.totalCount++;
      existing.totalVal += a.total;

      if (a.category === 'KIB_B') {
        existing.kibBCount++;
        existing.kibBVal += a.total;
      } else if (a.category === 'KIB_J') {
        existing.kibJCount++;
        existing.kibJVal += a.total;
      } else if (a.category === 'MPSA') {
        existing.mpsaCount++;
        existing.mpsaVal += a.total;
      }

      map.set(name, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.totalCount - a.totalCount);
  }, [allAssets]);

  const filteredComparison = useMemo(() => {
    if (!searchTerm) return comparisonData;
    const q = searchTerm.toLowerCase();
    return comparisonData.filter(item => 
      item.name.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)
    );
  }, [comparisonData, searchTerm]);

  // Selected item list of individual records
  const selectedItemRecords = useMemo(() => {
    return allAssets.filter(a => a.jenisBarang === selectedType);
  }, [allAssets, selectedType]);

  const activeRecords = selectedItemRecords.filter(a => a.category === 'KIB_B');
  const damagedRecords = selectedItemRecords.filter(a => a.category === 'KIB_J');
  const mpsaRecords = selectedItemRecords.filter(a => a.category === 'MPSA');

  return (
    <div className="space-y-6">
      
      {/* Overview explanation banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Rekonsiliasi &amp; Komparasi Status Aset Lintas Dokumen</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Membandingkan jenis peralatan yang sama apakah posisinya masih Aktif (KIB B), sudah Rusak Berat (KIB J), atau sedang dalam Proses Penghapusan (MPSA).
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter nama barang komparasi..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Matriks Komparasi Jenis Barang ({filteredComparison.length} jenis ditemukan)
          </h3>
          <span className="text-xs text-slate-400">
            Klik baris untuk melihat rincian unit per status
          </span>
        </div>

        <div className="overflow-x-auto max-h-[420px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3.5 font-semibold">Jenis Barang</th>
                <th className="py-2.5 px-3.5 font-semibold text-center text-emerald-700 dark:text-emerald-400">
                  KIB B (Aktif)
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-center text-rose-700 dark:text-rose-400">
                  KIB J (Rusak)
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-center text-amber-700 dark:text-amber-400">
                  MPSA (Penghapusan)
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-right">
                  Total Unit
                </th>
                <th className="py-2.5 px-3.5 font-semibold text-right">
                  Total Nilai (Rp)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComparison.map(row => {
                const isSelected = selectedType === row.name;

                return (
                  <tr
                    key={row.name}
                    onClick={() => setSelectedType(row.name)}
                    className={`cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-medium'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {row.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-mono">
                            Dipilih
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">{row.group}</span>
                    </td>

                    {/* KIB B Aktif */}
                    <td className="py-2.5 px-3.5 text-center font-mono tabular-nums">
                      {row.kibBCount > 0 ? (
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                          {formatNumber(row.kibBCount)}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">0</span>
                      )}
                    </td>

                    {/* KIB J Rusak */}
                    <td className="py-2.5 px-3.5 text-center font-mono tabular-nums">
                      {row.kibJCount > 0 ? (
                        <span className="font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded">
                          {formatNumber(row.kibJCount)}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">0</span>
                      )}
                    </td>

                    {/* MPSA Penghapusan */}
                    <td className="py-2.5 px-3.5 text-center font-mono tabular-nums">
                      {row.mpsaCount > 0 ? (
                        <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded">
                          {formatNumber(row.mpsaCount)}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">0</span>
                      )}
                    </td>

                    {/* Total Unit */}
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatNumber(row.totalCount)}
                    </td>

                    {/* Total Nilai */}
                    <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatRupiah(row.totalVal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Item Breakdown Drilldown */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              Rincian Komparasi per Item
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {selectedType} ({selectedItemRecords.length} unit total terdata)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            Total Nilai: {formatRupiah(selectedItemRecords.reduce((acc, a) => acc + a.total, 0))}
          </span>
        </div>

        {/* 3 Columns Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Column 1: KIB B Aktif */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>KIB B (Masih Aktif)</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {activeRecords.length} unit
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Nilai: <strong className="font-mono text-slate-800 dark:text-slate-200">{formatRupiah(activeRecords.reduce((s, a) => s + a.total, 0))}</strong>
            </p>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/80 text-[11px]">
              {activeRecords.length === 0 ? (
                <p className="py-4 text-center text-slate-400 italic">Tidak ada item di KIB B</p>
              ) : (
                activeRecords.slice(0, 15).map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => onSelectAsset(a)}
                    className="py-1.5 flex items-center justify-between hover:text-emerald-600 cursor-pointer"
                  >
                    <span className="font-mono text-slate-700 dark:text-slate-300">Reg: {a.reg}</span>
                    <span className="text-slate-500 truncate max-w-[120px]">{a.merekType || a.tglOleh}</span>
                  </div>
                ))
              )}
              {activeRecords.length > 15 && (
                <p className="pt-2 text-[10px] text-slate-400 italic text-center">
                  +{activeRecords.length - 15} unit lainnya (lihat di tabel)
                </p>
              )}
            </div>
          </div>

          {/* Column 2: KIB J Rusak */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>KIB J (Kondisi Rusak)</span>
              </span>
              <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400">
                {damagedRecords.length} unit
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Nilai: <strong className="font-mono text-slate-800 dark:text-slate-200">{formatRupiah(damagedRecords.reduce((s, a) => s + a.total, 0))}</strong>
            </p>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/80 text-[11px]">
              {damagedRecords.length === 0 ? (
                <p className="py-4 text-center text-slate-400 italic">Tidak ada item di KIB J</p>
              ) : (
                damagedRecords.slice(0, 15).map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => onSelectAsset(a)}
                    className="py-1.5 flex items-center justify-between hover:text-rose-600 cursor-pointer"
                  >
                    <span className="font-mono text-slate-700 dark:text-slate-300">Reg: {a.reg}</span>
                    <span className="text-slate-500 truncate max-w-[120px]">{a.merekType || a.tglOleh}</span>
                  </div>
                ))
              )}
              {damagedRecords.length > 15 && (
                <p className="pt-2 text-[10px] text-slate-400 italic text-center">
                  +{damagedRecords.length - 15} unit lainnya (lihat di tabel)
                </p>
              )}
            </div>
          </div>

          {/* Column 3: MPSA Penghapusan */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>MPSA (Penetapan Majelis)</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                {mpsaRecords.length} unit
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Nilai: <strong className="font-mono text-slate-800 dark:text-slate-200">{formatRupiah(mpsaRecords.reduce((s, a) => s + a.total, 0))}</strong>
            </p>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-200/60 dark:divide-slate-800/80 text-[11px]">
              {mpsaRecords.length === 0 ? (
                <p className="py-4 text-center text-slate-400 italic">Tidak ada item di MPSA</p>
              ) : (
                mpsaRecords.slice(0, 15).map(a => (
                  <div 
                    key={a.id} 
                    onClick={() => onSelectAsset(a)}
                    className="py-1.5 flex items-center justify-between hover:text-amber-600 cursor-pointer"
                  >
                    <span className="font-mono text-slate-700 dark:text-slate-300">Reg: {a.reg}</span>
                    <span className="text-slate-500 truncate max-w-[120px]">{a.merekType || a.tglOleh}</span>
                  </div>
                ))
              )}
              {mpsaRecords.length > 15 && (
                <p className="pt-2 text-[10px] text-slate-400 italic text-center">
                  +{mpsaRecords.length - 15} unit lainnya (lihat di tabel)
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
