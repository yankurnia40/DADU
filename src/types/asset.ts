export type AssetCategory = 'ALL' | 'KIB_B' | 'KIB_J' | 'MPSA';

export type AssetStatus = 'Aktif' | 'Rusak Berat' | 'Proses Penghapusan';

export interface AssetItem {
  id: string;
  category: 'KIB_B' | 'KIB_J' | 'MPSA';
  categoryLabel: string;
  status: string;
  sourceDoc: string;
  fileName: string;
  no: number;
  kodeBarang: string;
  reg: string;
  jenisBarang: string;
  groupCategory: string;
  ukuran: string;
  satuan: string;
  tglOleh: string;
  tahunOleh: number | null;
  bahanCode: string;
  bahanNama: string;
  merekType: string;
  asalOlehCode: string;
  asalOlehNama: string;
  harga: number;
  kapitalisasi: number;
  total: number;
}

export interface FilterState {
  category: AssetCategory;
  search: string;
  groupCategory: string;
  bahanNama: string;
  asalOlehNama: string;
  yearRange: [number, number];
  priceRange: string; // 'all' | '<100k' | '100k-1m' | '1m-10m' | '10m-50m' | '>50m'
  satuan: string;
  sortBy: 'no' | 'nama' | 'harga' | 'tahun' | 'kode' | 'reg';
  sortOrder: 'asc' | 'desc';
}

export interface CategorySummary {
  key: AssetCategory;
  title: string;
  shortDesc: string;
  statusText: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  count: number;
  totalValue: number;
  iconName: string;
}
