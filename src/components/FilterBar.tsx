import React, { useRef } from 'react';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { FilterState } from '../types/asset';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  groupCategories: string[];
  bahanList: string[];
  asalList: string[];
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  groupCategories,
  bahanList,
  asalList,
  totalResults
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters = 
    filter.search !== '' ||
    filter.groupCategory !== 'all' ||
    filter.bahanNama !== 'all' ||
    filter.asalOlehNama !== 'all' ||
    filter.priceRange !== 'all' ||
    filter.yearRange[0] !== 1977 ||
    filter.yearRange[1] !== 2026 ||
    filter.satuan !== 'all';

  const resetFilters = () => {
    setFilter(prev => ({
      ...prev,
      search: '',
      groupCategory: 'all',
      bahanNama: 'all',
      asalOlehNama: 'all',
      priceRange: 'all',
      yearRange: [1977, 2026],
      satuan: 'all',
      sortBy: 'no',
      sortOrder: 'asc'
    }));
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
      
      {/* Top Search & Primary Sorting */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Cari jenis barang, kode barang, no. register, merek, atau spesifikasi tipe..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-colors"
          />
          {filter.search && (
            <button
              onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Sorting Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Urutkan:</span>
          </div>
          <select
            value={`${filter.sortBy}-${filter.sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
              setFilter(prev => ({ ...prev, sortBy: by, sortOrder: order }));
            }}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
          >
            <option value="no-asc">No. Urut (Terkecil - Terbesar)</option>
            <option value="no-desc">No. Urut (Terbesar - Terkecil)</option>
            <option value="nama-asc">Nama Barang (A - Z)</option>
            <option value="nama-desc">Nama Barang (Z - A)</option>
            <option value="harga-desc">Nilai Total (Tertinggi ke Rendah)</option>
            <option value="harga-asc">Nilai Total (Terendah ke Tinggi)</option>
            <option value="tahun-desc">Tahun Perolehan (Terbaru)</option>
            <option value="tahun-asc">Tahun Perolehan (Terlama)</option>
            <option value="kode-asc">Kode Barang (0 - 9)</option>
            <option value="reg-asc">Nomor Register (0 - 9)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Row 2: Secondary Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
        
        {/* Kelompok Barang */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Kelompok Barang
          </label>
          <select
            value={filter.groupCategory}
            onChange={(e) => setFilter(prev => ({ ...prev, groupCategory: e.target.value }))}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 truncate"
          >
            <option value="all">Semua Kelompok</option>
            {groupCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Bahan */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Bahan Material
          </label>
          <select
            value={filter.bahanNama}
            onChange={(e) => setFilter(prev => ({ ...prev, bahanNama: e.target.value }))}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 truncate"
          >
            <option value="all">Semua Bahan</option>
            {bahanList.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Asal Usul */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Asal Perolehan
          </label>
          <select
            value={filter.asalOlehNama}
            onChange={(e) => setFilter(prev => ({ ...prev, asalOlehNama: e.target.value }))}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 truncate"
          >
            <option value="all">Semua Asal</option>
            {asalList.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Rentang Nilai */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Rentang Nilai Aset
          </label>
          <select
            value={filter.priceRange}
            onChange={(e) => setFilter(prev => ({ ...prev, priceRange: e.target.value }))}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 truncate"
          >
            <option value="all">Semua Nilai</option>
            <option value="<100k">&lt; Rp 100.000</option>
            <option value="100k-1m">Rp 100 Rb - Rp 1 Jt</option>
            <option value="1m-10m">Rp 1 Jt - Rp 10 Jt</option>
            <option value="10m-50m">Rp 10 Jt - Rp 50 Jt</option>
            <option value=">50m">&gt; Rp 50.000.000</option>
          </select>
        </div>

        {/* Satuan */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
            Satuan Barang
          </label>
          <select
            value={filter.satuan}
            onChange={(e) => setFilter(prev => ({ ...prev, satuan: e.target.value }))}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md p-1.5 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500 truncate"
          >
            <option value="all">Semua Satuan</option>
            <option value="BH">BH (Buah)</option>
            <option value="UN">UN (Unit)</option>
          </select>
        </div>

      </div>

      {/* Filter status summary bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            Ditemukan <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{totalResults}</strong> aset sesuai filter
          </span>
          {filter.search && (
            <span>
              kata kunci: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">"{filter.search}"</strong>
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
          Klik baris pada tabel untuk melihat rincian inventaris lengkap
        </div>
      </div>

    </div>
  );
};
