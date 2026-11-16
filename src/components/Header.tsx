import React from 'react';
import { 
  Building2, 
  Table, 
  BarChart3, 
  GitCompare, 
  Printer, 
  FileSpreadsheet, 
  FileText,
  Moon,
  Sun
} from 'lucide-react';
import { AssetItem } from '../types/asset';
import { exportToExcel, exportToCSV } from '../utils/formatters';

interface HeaderProps {
  currentTab: 'table' | 'analytics' | 'comparison' | 'kibPrint';
  setCurrentTab: (tab: 'table' | 'analytics' | 'comparison' | 'kibPrint') => void;
  filteredAssets: AssetItem[];
  isDark: boolean;
  toggleTheme: () => void;
  onOpenPdfModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  filteredAssets,
  isDark,
  toggleTheme,
  onOpenPdfModal
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  SMKN 40 JAKARTA
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  51817
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:block">
                Sistem Inventaris KIB B · KIB J · MPSA BPAD DKI
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'table'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Data &amp; Pencarian</span>
            </button>

            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'analytics'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analisis &amp; Grafik</span>
            </button>

            <button
              onClick={() => setCurrentTab('comparison')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'comparison'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Bandingkan Status</span>
            </button>

            <button
              onClick={() => setCurrentTab('kibPrint')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                currentTab === 'kibPrint'
                  ? 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Format KIB Cetak</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenPdfModal}
              title="Lihat Berkas PDF Asli"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>Dokumen PDF</span>
            </button>

            <button
              onClick={() => exportToExcel(filteredAssets, `Aset_SMKN40_${filteredAssets.length}_data`)}
              title="Unduh Data Excel (.xlsx)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>

            <button
              onClick={toggleTheme}
              aria-label="Ganti Mode Tampilan"
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setCurrentTab('table')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Data &amp; Cari
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'analytics' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Analisis
          </button>
          <button
            onClick={() => setCurrentTab('comparison')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'comparison' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Bandingkan
          </button>
          <button
            onClick={() => setCurrentTab('kibPrint')}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              currentTab === 'kibPrint' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            KIB Cetak
          </button>
          <button
            onClick={onOpenPdfModal}
            className="px-2.5 py-1 rounded whitespace-nowrap font-medium text-slate-600 dark:text-slate-300"
          >
            PDF Sumber
          </button>
        </div>
      </div>
    </header>
  );
};
