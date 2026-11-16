import React, { useState, useMemo } from 'react';
import { Printer, Download, Eye, Layers } from 'lucide-react';
import { AssetItem, AssetCategory } from '../types/asset';
import { formatRupiah, formatNumber, exportToExcel } from '../utils/formatters';

interface KibPrintViewProps {
  allAssets: AssetItem[];
  onSelectAsset: (asset: AssetItem) => void;
}

export const KibPrintView: React.FC<KibPrintViewProps> = ({ allAssets, onSelectAsset }) => {
  const [selectedFormat, setSelectedFormat] = useState<AssetCategory>('KIB_B');
  const [printPage, setPrintPage] = useState(1);
  const itemsPerPage = 50;

  const currentDataset = useMemo(() => {
    if (selectedFormat === 'ALL') return allAssets;
    return allAssets.filter(a => a.category === selectedFormat);
  }, [allAssets, selectedFormat]);

  const totalPages = Math.max(1, Math.ceil(currentDataset.length / itemsPerPage));
  const currentPageItems = currentDataset.slice((printPage - 1) * itemsPerPage, printPage * itemsPerPage);
  const totalValue = currentDataset.reduce((sum, a) => sum + a.total, 0);

  const getSubTitle = () => {
    switch (selectedFormat) {
      case 'KIB_B':
        return 'Aset Tetap Rekon Semester 2 Tahun 2026 (Peralatan dan Mesin - Masih Aktif)';
      case 'KIB_J':
        return 'Aset Rusak Berat Rekon Semester 2 Tahun 2026 (KIB B Rusak Berat)';
      case 'MPSA':
        return 'Aset Dalam Proses Penyelesaian Majelis Penetapan Status Aset Rekon Semester 2 Tahun 2026';
      default:
        return 'Rekapitulasi Gabungan Seluruh Aset Peralatan dan Mesin SMKN 40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Control bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm no-print">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pilih Dokumen KIB:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => { setSelectedFormat('KIB_B'); setPrintPage(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedFormat === 'KIB_B' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                KIB B (Aktif - 2.440)
              </button>
              <button
                onClick={() => { setSelectedFormat('KIB_J'); setPrintPage(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedFormat === 'KIB_J' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                KIB J (Rusak - 201)
              </button>
              <button
                onClick={() => { setSelectedFormat('MPSA'); setPrintPage(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedFormat === 'MPSA' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                MPSA (Majelis - 672)
              </button>
              <button
                onClick={() => { setSelectedFormat('ALL'); setPrintPage(1); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedFormat === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-bold' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Semua (3.313)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToExcel(currentDataset, `KIB_Official_${selectedFormat}`)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak KIB Resmi</span>
            </button>
          </div>
        </div>

        {/* Pagination in print view */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <span>
            Halaman {printPage} dari {totalPages} ({currentDataset.length} total unit, Total Nilai: {formatRupiah(totalValue)})
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPrintPage(p => Math.max(1, p - 1))}
              disabled={printPage <= 1}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPrintPage(p => Math.min(totalPages, p + 1))}
              disabled={printPage >= totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Official KIB Document Page Representation */}
      <div className="bg-white text-slate-900 p-8 rounded-xl border border-slate-300 shadow-md font-sans text-xs print:p-0 print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="text-xl font-extrabold tracking-wider uppercase text-slate-900">
                KARTU INVENTARIS BARANG
              </div>
              <div className="text-sm font-semibold tracking-wide text-slate-700">
                KIB B (Peralatan dan Mesin)
              </div>
              <div className="text-xs italic text-slate-600">
                {getSubTitle()}
              </div>
            </div>

            <div className="text-right">
              <div className="font-extrabold text-sm tracking-wider text-slate-900">
                BPAD DKI JAKARTA
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                Badan Pengelolaan Aset Daerah
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                JAYA RAYA
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-4 pt-3 border-t border-slate-300 text-xs">
            <div className="flex">
              <span className="w-40 font-semibold text-slate-600">PROVINSI</span>
              <span>: DKI JAKARTA</span>
            </div>
            <div className="flex">
              <span className="w-40 font-semibold text-slate-600">SUB UNIT ORGANISASI</span>
              <span className="font-bold">: SMK NEGERI 40</span>
            </div>
            <div className="flex">
              <span className="w-40 font-semibold text-slate-600">UNIT ORGANISASI</span>
              <span>: SUKU DINAS PENDIDIKAN WILAYAH 1 KOTA - JAKTIM</span>
            </div>
            <div className="flex">
              <span className="w-40 font-semibold text-slate-600">KODE SKPD/UKPD</span>
              <span className="font-mono font-bold">: 51817</span>
            </div>
          </div>
        </div>

        {/* Table of items */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                <th className="border border-slate-300 p-1.5 text-center w-8">NO</th>
                <th className="border border-slate-300 p-1.5 w-24">KODE BARANG</th>
                <th className="border border-slate-300 p-1.5 w-16">REG.</th>
                <th className="border border-slate-300 p-1.5">JENIS BARANG</th>
                <th className="border border-slate-300 p-1.5 w-8 text-center">UK</th>
                <th className="border border-slate-300 p-1.5 w-10 text-center">SAT</th>
                <th className="border border-slate-300 p-1.5 w-20 text-center">TGL OLEH</th>
                <th className="border border-slate-300 p-1.5 w-12 text-center">BHN</th>
                <th className="border border-slate-300 p-1.5">MEREK / TYPE</th>
                <th className="border border-slate-300 p-1.5 w-10 text-center">ASAL</th>
                <th className="border border-slate-300 p-1.5 text-right w-24">HARGA (Rp)</th>
                <th className="border border-slate-300 p-1.5 text-right w-24">TOTAL (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.map((item, idx) => (
                <tr 
                  key={item.id} 
                  onClick={() => onSelectAsset(item)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{item.no}</td>
                  <td className="border border-slate-300 p-1.5 font-mono">{item.kodeBarang}</td>
                  <td className="border border-slate-300 p-1.5 font-mono font-semibold">{item.reg}</td>
                  <td className="border border-slate-300 p-1.5 font-medium">{item.jenisBarang}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{item.ukuran}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{item.satuan}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{item.tglOleh}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{item.bahanCode}</td>
                  <td className="border border-slate-300 p-1.5 truncate max-w-[140px]">{item.merekType}</td>
                  <td className="border border-slate-300 p-1.5 text-center font-mono">{item.asalOlehCode}</td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono tabular-nums">{formatNumber(item.harga)}</td>
                  <td className="border border-slate-300 p-1.5 text-right font-mono font-bold tabular-nums">{formatNumber(item.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <td colSpan={10} className="border border-slate-300 p-2 text-right">
                  TOTAL KESELURUHAN DOKUMEN:
                </td>
                <td colSpan={2} className="border border-slate-300 p-2 text-right font-mono text-xs tabular-nums">
                  {formatRupiah(totalValue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Official Signatures matching the original PDF footer */}
        <div className="mt-12 pt-6 grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-16">
            <div>
              <p className="font-semibold text-slate-800">Mengetahui,</p>
              <p className="font-semibold text-slate-800">Kepala SKPD / UKPD / UPB</p>
            </div>
            <div>
              <p className="font-bold underline text-slate-900 text-sm">Rugiyanto, M.Pd</p>
              <p className="font-mono text-slate-600">NIP. 197310142000031006</p>
            </div>
          </div>

          <div className="space-y-16">
            <div>
              <p className="font-semibold text-slate-800">Jakarta, 31 Desember 2026</p>
              <p className="font-semibold text-slate-800">Pengurus Barang SMKN 40</p>
            </div>
            <div>
              <p className="font-bold underline text-slate-900 text-sm">Patar Marulitua Lumban Tobing, S.P., M.M</p>
              <p className="font-mono text-slate-600">NIP. 197301042022211001</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
