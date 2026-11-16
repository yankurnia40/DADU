import React from 'react';
import { X, FileText, ExternalLink, Download, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface PdfSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PdfSourceModal: React.FC<PdfSourceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pdfFiles = [
    {
      title: 'KIB B 2026 (Aset Peralatan & Mesin Aktif)',
      fileName: 'KIBB2026_091126_90874a8c.pdf',
      path: '/assets/aistudio/KIBB2026_091126_90874a8c.pdf',
      itemCount: 2440,
      totalValue: 'Rp 10.535.480.428,00',
      status: 'Aset Aktif / Operasional',
      badgeColor: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle2,
      desc: 'Kartu Inventaris Barang KIB B memuat seluruh inventaris peralatan dan mesin yang masih aktif beroperasi di SMK Negeri 40 Jakarta pada Semester 2 Tahun 2026.'
    },
    {
      title: 'KIB J (Aset Rusak Berat)',
      fileName: 'KIBJ2026_091126_5664ea45.pdf',
      path: '/assets/aistudio/KIBJ2026_091126_5664ea45.pdf',
      itemCount: 201,
      totalValue: 'Rp 1.834.106.575,00',
      status: 'Aset Rusak Berat',
      badgeColor: 'text-rose-700 bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800',
      icon: AlertTriangle,
      desc: 'Daftar inventaris peralatan dan mesin yang sudah dalam kondisi rusak berat dan tidak dapat digunakan lagi dalam proses belajar mengajar atau operasional.'
    },
    {
      title: 'MPSA (Majelis Penetapan Status Aset)',
      fileName: 'MPSA_091126_a4aec3ce.pdf',
      path: '/assets/aistudio/MPSA_091126_a4aec3ce.pdf',
      itemCount: 672,
      totalValue: 'Rp 3.628.553.776,00',
      status: 'Proses Penghapusan / Penetapan Majelis',
      badgeColor: 'text-amber-700 bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800',
      icon: Clock,
      desc: 'Aset inventaris dalam proses penyelesaian Majelis Penetapan Status Aset (MPSA) untuk penghapusan resmi dari neraca aset daerah.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Dokumen Sumber PDF Resmi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                3 Berkas laporan inventaris yang diunggah dan terintegrasi dalam sistem
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

        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
          {pdfFiles.map((file) => {
            const Icon = file.icon;
            return (
              <div 
                key={file.fileName}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0 text-slate-700 dark:text-slate-300" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {file.title}
                    </h3>
                  </div>

                  <span className={`text-[11px] font-semibold font-mono px-2 py-0.5 rounded border self-start sm:self-auto ${file.badgeColor}`}>
                    {file.itemCount} Barang
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {file.desc}
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="font-mono text-slate-700 dark:text-slate-300">
                    Nilai Dokumen: <strong className="text-slate-900 dark:text-white">{file.totalValue}</strong>
                  </div>

                  <a
                    href={file.path}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors self-start sm:self-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka PDF di Tab Baru</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
