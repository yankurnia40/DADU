import * as XLSX from 'xlsx';
import { AssetItem } from '../types/asset';

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function exportToExcel(data: AssetItem[], fileName = 'Inventaris_Aset_SMKN40'): void {
  const exportRows = data.map((item, idx) => ({
    'No. Urut': idx + 1,
    'Kategori Aset': item.categoryLabel,
    'Status Kondisi': item.status,
    'Kode Barang': item.kodeBarang,
    'No. Register': item.reg,
    'Jenis / Nama Barang': item.jenisBarang,
    'Kelompok Barang': item.groupCategory,
    'Ukuran': item.ukuran,
    'Satuan': item.satuan,
    'Tgl. Perolehan': item.tglOleh,
    'Tahun Perolehan': item.tahunOleh || '',
    'Bahan': item.bahanNama,
    'Merek / Tipe': item.merekType,
    'Asal Usul': item.asalOlehNama,
    'Harga (Rp)': item.harga,
    'Kapitalisasi / Renovasi (Rp)': item.kapitalisasi,
    'Nilai Total (Rp)': item.total,
    'Dokumen Sumber': item.sourceDoc
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Aset');

  // Auto-width columns
  const colWidths = Object.keys(exportRows[0] || {}).map(key => ({
    wch: Math.max(key.length + 4, 14)
  }));
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportToCSV(data: AssetItem[], fileName = 'Inventaris_Aset_SMKN40'): void {
  const headers = [
    'No',
    'Kategori',
    'Status',
    'Kode Barang',
    'No. Register',
    'Jenis Barang',
    'Kelompok',
    'Satuan',
    'Tgl. Perolehan',
    'Bahan',
    'Merek / Tipe',
    'Asal Usul',
    'Harga (Rp)',
    'Total (Rp)'
  ];

  const rows = data.map((item, idx) => [
    idx + 1,
    `"${item.categoryLabel}"`,
    `"${item.status}"`,
    `"${item.kodeBarang}"`,
    `"${item.reg}"`,
    `"${item.jenisBarang.replace(/"/g, '""')}"`,
    `"${item.groupCategory}"`,
    `"${item.satuan}"`,
    `"${item.tglOleh}"`,
    `"${item.bahanNama}"`,
    `"${item.merekType.replace(/"/g, '""')}"`,
    `"${item.asalOlehNama}"`,
    item.harga,
    item.total
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
