import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Eye, 
  Copy, 
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { AssetItem, FilterState } from '../types/asset';
import { formatRupiah, formatNumber } from '../utils/formatters';

interface AssetTableProps {
  assets: AssetItem[];
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  onSelectAsset: (asset: AssetItem) => void;
  onResetFilters: () => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  filter,
  setFilter,
  onSelectAsset,
  onResetFilters
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sorting
  const handleSort = (field: FilterState['sortBy']) => {
    if (filter.sortBy === field) {
      setFilter(prev => ({
        ...prev,
        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setFilter(prev => ({
        ...prev,
        sortBy: field,
        sortOrder: field === 'harga' ? 'desc' : 'asc'
      }));
    }
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalItems = assets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedAssets = assets.slice(startIndex, endIndex);

  const copyToClipboard = (text: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSortIcon = (field: FilterState['sortBy']) => {
    if (filter.sortBy !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600 inline ml-1" />;
    }
    return filter.sortOrder === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 inline ml-1" />
      : <ArrowDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400 inline ml-1" />;
  };

  const getStatusBadge = (category: string) => {
    switch (category) {
      case 'KIB_B':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            KIB B · Aktif
          </span>
        );
      case 'KIB_J':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            KIB J · Rusak
          </span>
        );
      case 'MPSA':
        return (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            MPSA · Penghapusan
          </span>
        );
      default:
        return <span>{category}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 select-none">
              <th 
                onClick={() => handleSort('no')}
                className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 whitespace-nowrap text-center w-12"
              >
                No {getSortIcon('no')}
              </th>
              <th className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                Status Kategori
              </th>
              <th 
                onClick={() => handleSort('kode')}
                className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 whitespace-nowrap"
              >
                Kode &amp; Reg {getSortIcon('kode')}
              </th>
              <th 
                onClick={() => handleSort('nama')}
                className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 whitespace-nowrap"
              >
                Jenis / Nama Barang {getSortIcon('nama')}
              </th>
              <th className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                Merek / Spesifikasi Tipe
              </th>
              <th 
                onClick={() => handleSort('tahun')}
                className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 whitespace-nowrap"
              >
                Tgl Perolehan {getSortIcon('tahun')}
              </th>
              <th className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                Bahan &amp; Asal
              </th>
              <th 
                onClick={() => handleSort('harga')}
                className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 whitespace-nowrap text-right"
              >
                Total Nilai (Rp) {getSortIcon('harga')}
              </th>
              <th className="py-3 px-3.5 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap text-center w-20">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {paginatedAssets.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-slate-500 dark:text-slate-400">
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      Tidak ada aset yang sesuai kriteria pencarian
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Coba sesuaikan kata kunci pencarian, ubah status kategori aset, atau reset seluruh filter.
                    </p>
                    <button
                      onClick={onResetFilters}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                      Reset Filter
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAssets.map((asset, idx) => {
                const globalIndex = startIndex + idx + 1;
                const isSelectedCopy = copiedId === asset.id;

                return (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    {/* No */}
                    <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 dark:text-slate-500 tabular-nums">
                      {globalIndex}
                    </td>

                    {/* Status Kategori */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {getStatusBadge(asset.category)}
                    </td>

                    {/* Kode Barang & Register */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {asset.kodeBarang}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded text-[10px]">
                          {asset.reg}
                        </span>
                        <button
                          onClick={(e) => copyToClipboard(`${asset.kodeBarang} ${asset.reg}`, asset.id, e)}
                          title="Salin Kode & Register"
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-opacity"
                        >
                          {isSelectedCopy ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Jenis Barang */}
                    <td className="py-2.5 px-3.5">
                      <div className="font-medium text-slate-900 dark:text-white leading-snug">
                        {asset.jenisBarang}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <span>{asset.groupCategory}</span>
                        <span aria-hidden="true">·</span>
                        <span>{asset.ukuran} {asset.satuan}</span>
                      </div>
                    </td>

                    {/* Merek / Tipe */}
                    <td className="py-2.5 px-3.5">
                      <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                        {asset.merekType !== '-' && asset.merekType ? asset.merekType : <span className="text-slate-400">-</span>}
                      </span>
                    </td>

                    {/* Tgl Perolehan */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 tabular-nums">
                        {asset.tglOleh || '-'}
                      </span>
                    </td>

                    {/* Bahan & Asal */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      <div className="text-slate-800 dark:text-slate-200">
                        {asset.bahanNama}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {asset.asalOlehNama}
                      </div>
                    </td>

                    {/* Total Nilai (Rp) */}
                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatRupiah(asset.total)}
                      </div>
                      {asset.kapitalisasi > 0 && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                          +Kap: {formatRupiah(asset.kapitalisasi)}
                        </div>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset);
                        }}
                        title="Lihat Rincian Kartu Inventaris"
                        className="p-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium hidden lg:inline">Detail</span>
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Status Footer */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left: Range and Page Size */}
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <span>
            Menampilkan <strong className="font-mono text-slate-900 dark:text-white tabular-nums">{totalItems > 0 ? startIndex + 1 : 0}</strong> - <strong className="font-mono text-slate-900 dark:text-white tabular-nums">{endIndex}</strong> dari <strong className="font-mono text-slate-900 dark:text-white tabular-nums">{formatNumber(totalItems)}</strong> aset
          </span>

          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-700">
            <span className="hidden sm:inline">Baris:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-slate-800 dark:text-slate-200 font-mono"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
            </select>
          </div>
        </div>

        {/* Right: Page Navigation Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={safeCurrentPage <= 1}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Halaman Pertama"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safeCurrentPage <= 1}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Halaman Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 py-1 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums">
            Hal {safeCurrentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage >= totalPages}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Halaman Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={safeCurrentPage >= totalPages}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Halaman Terakhir"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
