import React, { useState, useMemo, useEffect } from 'react';
import assetsRaw from './data/assets.json';
import { AssetItem, AssetCategory, FilterState } from './types/asset';
import { Header } from './components/Header';
import { CategoryFilterTabs } from './components/CategoryFilterTabs';
import { StatsCards } from './components/StatsCards';
import { FilterBar } from './components/FilterBar';
import { AssetTable } from './components/AssetTable';
import { AssetDetailModal } from './components/AssetDetailModal';
import { AnalyticsView } from './components/AnalyticsView';
import { ComparisonView } from './components/ComparisonView';
import { KibPrintView } from './components/KibPrintView';
import { PdfSourceModal } from './components/PdfSourceModal';

const allAssetsData = assetsRaw as AssetItem[];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'table' | 'analytics' | 'comparison' | 'kibPrint'>('table');
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Master Filter State
  const [filter, setFilter] = useState<FilterState>({
    category: 'ALL',
    search: '',
    groupCategory: 'all',
    bahanNama: 'all',
    asalOlehNama: 'all',
    priceRange: 'all',
    yearRange: [1977, 2026],
    satuan: 'all',
    sortBy: 'no',
    sortOrder: 'asc'
  });

  // Dark mode effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Precomputed Category Counts and Totals
  const categoryCounts = useMemo(() => {
    const kibB = allAssetsData.filter(a => a.category === 'KIB_B');
    const kibJ = allAssetsData.filter(a => a.category === 'KIB_J');
    const mpsa = allAssetsData.filter(a => a.category === 'MPSA');

    return {
      ALL: {
        count: allAssetsData.length,
        value: allAssetsData.reduce((sum, a) => sum + a.total, 0)
      },
      KIB_B: {
        count: kibB.length,
        value: kibB.reduce((sum, a) => sum + a.total, 0)
      },
      KIB_J: {
        count: kibJ.length,
        value: kibJ.reduce((sum, a) => sum + a.total, 0)
      },
      MPSA: {
        count: mpsa.length,
        value: mpsa.reduce((sum, a) => sum + a.total, 0)
      }
    };
  }, []);

  // Unique lists for dropdowns
  const groupCategories = useMemo(() => {
    const set = new Set<string>();
    allAssetsData.forEach(a => {
      if (a.groupCategory) set.add(a.groupCategory);
    });
    return Array.from(set).sort();
  }, []);

  const bahanList = useMemo(() => {
    const set = new Set<string>();
    allAssetsData.forEach(a => {
      if (a.bahanNama && a.bahanNama !== 'Tidak Diketahui') set.add(a.bahanNama);
    });
    return Array.from(set).sort();
  }, []);

  const asalList = useMemo(() => {
    const set = new Set<string>();
    allAssetsData.forEach(a => {
      if (a.asalOlehNama && a.asalOlehNama !== 'Lain-lain') set.add(a.asalOlehNama);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered Assets Pipeline
  const filteredAssets = useMemo(() => {
    return allAssetsData.filter(asset => {
      // 1. Primary Category Filter (KIB B vs KIB J vs MPSA vs ALL)
      if (filter.category !== 'ALL' && asset.category !== filter.category) {
        return false;
      }

      // 2. Search Query (full text multi-field match)
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase().trim();
        const match =
          asset.jenisBarang.toLowerCase().includes(query) ||
          asset.kodeBarang.toLowerCase().includes(query) ||
          asset.reg.toLowerCase().includes(query) ||
          (asset.merekType && asset.merekType.toLowerCase().includes(query)) ||
          asset.groupCategory.toLowerCase().includes(query) ||
          asset.bahanNama.toLowerCase().includes(query) ||
          asset.asalOlehNama.toLowerCase().includes(query) ||
          (asset.tahunOleh && asset.tahunOleh.toString().includes(query));

        if (!match) return false;
      }

      // 3. Kelompok Barang
      if (filter.groupCategory !== 'all' && asset.groupCategory !== filter.groupCategory) {
        return false;
      }

      // 4. Bahan Material
      if (filter.bahanNama !== 'all' && asset.bahanNama !== filter.bahanNama) {
        return false;
      }

      // 5. Asal Perolehan
      if (filter.asalOlehNama !== 'all' && asset.asalOlehNama !== filter.asalOlehNama) {
        return false;
      }

      // 6. Satuan
      if (filter.satuan !== 'all' && asset.satuan !== filter.satuan) {
        return false;
      }

      // 7. Rentang Nilai Aset
      if (filter.priceRange !== 'all') {
        const p = asset.total;
        if (filter.priceRange === '<100k' && p >= 100000) return false;
        if (filter.priceRange === '100k-1m' && (p < 100000 || p > 1000000)) return false;
        if (filter.priceRange === '1m-10m' && (p < 1000000 || p > 10000000)) return false;
        if (filter.priceRange === '10m-50m' && (p < 10000000 || p > 50000000)) return false;
        if (filter.priceRange === '>50m' && p <= 50000000) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting comparator
      let valA: string | number = a.no;
      let valB: string | number = b.no;

      if (filter.sortBy === 'no') {
        valA = a.no;
        valB = b.no;
      } else if (filter.sortBy === 'nama') {
        valA = a.jenisBarang.toLowerCase();
        valB = b.jenisBarang.toLowerCase();
      } else if (filter.sortBy === 'harga') {
        valA = a.total;
        valB = b.total;
      } else if (filter.sortBy === 'tahun') {
        valA = a.tahunOleh || 0;
        valB = b.tahunOleh || 0;
      } else if (filter.sortBy === 'kode') {
        valA = a.kodeBarang;
        valB = b.kodeBarang;
      } else if (filter.sortBy === 'reg') {
        valA = a.reg;
        valB = b.reg;
      }

      if (valA < valB) return filter.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return filter.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filter]);

  const handleCategorySelect = (cat: AssetCategory) => {
    setFilter(prev => ({ ...prev, category: cat }));
  };

  const handleResetFilters = () => {
    setFilter({
      category: 'ALL',
      search: '',
      groupCategory: 'all',
      bahanNama: 'all',
      asalOlehNama: 'all',
      priceRange: 'all',
      yearRange: [1977, 2026],
      satuan: 'all',
      sortBy: 'no',
      sortOrder: 'asc'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        filteredAssets={filteredAssets}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Core Category Tabs Selector (Always accessible) */}
        <section aria-label="Status Kategori Aset">
          <CategoryFilterTabs
            selectedCategory={filter.category}
            onSelectCategory={handleCategorySelect}
            counts={categoryCounts}
          />
        </section>

        {/* Tab 1: Table & Search */}
        {currentTab === 'table' && (
          <div className="space-y-6">
            <StatsCards
              assets={filteredAssets}
              currentCategory={filter.category}
              totalAllAssetsCount={allAssetsData.length}
            />

            <FilterBar
              filter={filter}
              setFilter={setFilter}
              groupCategories={groupCategories}
              bahanList={bahanList}
              asalList={asalList}
              totalResults={filteredAssets.length}
            />

            <AssetTable
              assets={filteredAssets}
              filter={filter}
              setFilter={setFilter}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Tab 2: Analytics & Visual Breakdown */}
        {currentTab === 'analytics' && (
          <AnalyticsView
            assets={filteredAssets}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
            onFilterByCategory={(cat) => {
              handleCategorySelect(cat);
              setCurrentTab('table');
            }}
          />
        )}

        {/* Tab 3: Comparison View */}
        {currentTab === 'comparison' && (
          <ComparisonView
            allAssets={allAssetsData}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
          />
        )}

        {/* Tab 4: Printable Official KIB Format */}
        {currentTab === 'kibPrint' && (
          <KibPrintView
            allAssets={allAssetsData}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              SMK Negeri 40 Jakarta · Suku Dinas Pendidikan Wilayah 1 Kota Jakarta Timur
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Badan Pengelolaan Aset Daerah (BPAD) Provinsi DKI Jakarta · Rekon Semester 2 Tahun 2026
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span>KIB B: 2.440 Aktif</span>
            <span aria-hidden="true">·</span>
            <span>KIB J: 201 Rusak</span>
            <span aria-hidden="true">·</span>
            <span>MPSA: 672 Dihapuskan</span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />

      {/* PDF Source Documents Modal */}
      <PdfSourceModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

    </div>
  );
}
