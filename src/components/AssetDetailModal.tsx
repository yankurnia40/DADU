import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Building2, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  FileText,
  Barcode
} from 'lucide-react';
import { AssetItem } from '../types/asset';
import { formatRupiah } from '../utils/formatters';

interface AssetDetailModalProps {
  asset: AssetItem | null;
  onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const copyData = () => {
    const text = `KARTU INVENTARIS BARANG (KIB) - SMKN 40 JAKARTA
Kode Barang: ${asset.kodeBarang}
No. Register: ${asset.reg}
Jenis Barang: ${asset.jenisBarang}
Merek / Tipe: ${asset.merekType}
Status: ${asset.status} (${asset.categoryLabel})
Tgl. Perolehan: ${asset.tglOleh}
Bahan: ${asset.bahanNama}
Asal Perolehan: ${asset.asalOlehNama}
Harga: ${formatRupiah(asset.harga)}
Kapitalisasi: ${formatRupiah(asset.kapitalisasi)}
Total Nilai: ${formatRupiah(asset.total)}
Sumber Dokumen: ${asset.sourceDoc}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printSingleCard = () => {
    window.print();
  };

  const getStatusBadge = () => {
    switch (asset.category) {
      case 'KIB_B':
        return (
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>KIB B · Aset Aktif &amp; Beroperasi</span>
          </div>
        );
      case 'KIB_J':
        return (
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>KIB J · Aset Rusak Berat</span>
          </div>
        );
      case 'MPSA':
        return (
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>MPSA · Menunggu Penetapan Majelis Status Aset</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold font-mono tracking-wider px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded">
                  REG: {asset.reg}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Kode: {asset.kodeBarang}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1 leading-tight">
                {asset.jenisBarang}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                SMK Negeri 40 Jakarta · Kode UKPD 51817
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          
          {/* Status Alert Banner */}
          {getStatusBadge()}

          {/* Barcode & Inventory Tag Card */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
                Label Inventaris Resmi BPAD DKI Jakarta
              </span>
              <div className="font-mono text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                {asset.kodeBarang} · {asset.reg}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {asset.merekType !== '-' && asset.merekType ? asset.merekType : asset.jenisBarang}
              </div>
            </div>

            <div className="flex flex-col items-center p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs">
              <Barcode className="w-24 h-7 text-slate-800 dark:text-slate-200" />
              <span className="text-[10px] font-mono tracking-widest text-slate-500 mt-1">
                {asset.reg}
              </span>
            </div>
          </div>

          {/* Grid Info Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="p-3.5 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Spesifikasi &amp; Klasifikasi
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Kelompok:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">{asset.groupCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Merek / Type:</span>
                  <span className="font-semibold font-mono text-slate-900 dark:text-white text-right">{asset.merekType || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Bahan Baku:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">{asset.bahanNama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Ukuran / Satuan:</span>
                  <span className="font-semibold font-mono text-slate-900 dark:text-white text-right">{asset.ukuran} {asset.satuan}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Asal &amp; Waktu Perolehan
              </span>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tgl Perolehan:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white text-right">{asset.tglOleh || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tahun Perolehan:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white text-right">{asset.tahunOleh || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Asal Usul:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-right">{asset.asalOlehNama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">No. Urut Dokumen:</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white text-right">#{asset.no}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Nilai Keuangan / Buku */}
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 space-y-2.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-800 dark:text-emerald-400">
              Rincian Nilai Perolehan &amp; Kapitalisasi
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Harga Perolehan</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {formatRupiah(asset.harga)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Nilai Kapitalisasi</span>
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {formatRupiah(asset.kapitalisasi)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Nilai Buku</span>
                <span className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatRupiah(asset.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Source Document Reference */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Dokumen Sumber: <strong>{asset.sourceDoc}</strong> ({asset.fileName})</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={copyData}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Data'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={printSingleCard}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
