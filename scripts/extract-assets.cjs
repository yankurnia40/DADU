const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

const bahanMap = {
  '1': 'Kayu',
  '2': 'Besi',
  '3': 'Rotan',
  '4': 'Jok',
  '5': 'Plastik',
  '6': 'Gelas/Kaca/Beling',
  '7': 'Fiberglass',
  '10': 'Alumunium',
  '11': 'Tembaga',
  '12': 'Mika',
  '13': 'Kain',
  '14': 'Akrilik',
  '15': 'Kertas',
  '19': 'Busa',
  '26': 'Logam',
  '39': 'Melamin',
  '40': 'Metal',
  '51': 'Kabel',
  '52': 'Campuran',
  '53': 'Lainnya'
};

const asalOlehMap = {
  '1': 'Pengadaan APBD',
  '2': 'Hibah/Sumbangan',
  '3': 'Pelaksanaan Kontrak',
  '4': 'Peraturan Perundangan',
  '5': 'Putusan Pengadilan',
  '6': 'Divestasi',
  '7': 'Hasil Inventarisasi',
  '8': 'Tukar Menukar',
  '9': 'Pembatalan Penghapusan',
  '10': 'Perolehan Lainnya'
};

function getGroupCategory(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('meja') || n.includes('bangku') || n.includes('kursi')) return 'Mebel & Kursi/Meja';
  if (n.includes('p.c') || n.includes('cpu') || n.includes('laptop') || n.includes('lap top') || n.includes('note book') || n.includes('monitor') || n.includes('server') || n.includes('hard disk') || n.includes('tablet pc')) return 'Komputer & IT';
  if (n.includes('switch') || n.includes('router') || n.includes('hub') || n.includes('acces point') || n.includes('telepon') || n.includes('telephone') || n.includes('pabx') || n.includes('modem') || n.includes('handy talky') || n.includes('ht')) return 'Jaringan & Telekomunikasi';
  if (n.includes('camera') || n.includes('kamera') || n.includes('projector') || n.includes('infocus') || n.includes('sound') || n.includes('loudspeaker') || n.includes('speaker') || n.includes('microphone') || n.includes('mic') || n.includes('tripod') || n.includes('televisi') || n.includes('dvr') || n.includes('cctv')) return 'Audio Visual & Multimedia';
  if (n.includes('printer') || n.includes('scanner') || n.includes('fotocopy') || n.includes('stensil') || n.includes('pencetak label') || n.includes('penghancur kertas') || n.includes('mesin ketik') || n.includes('kas register') || n.includes('mesin hitung') || n.includes('white board') || n.includes('whiteboard') || n.includes('papan') || n.includes('lemari') || n.includes('filing cabinet') || n.includes('rak ') || n.includes('brandkas') || n.includes('tong sampah') || n.includes('tempat sampah')) return 'Peralatan Kantor & Penyimpanan';
  if (n.includes('a.c') || n.includes('ac split') || n.includes('kipas') || n.includes('vacuum') || n.includes('penghisap debu') || n.includes('blower') || n.includes('genset') || n.includes('pompa air') || n.includes('dispenser') || n.includes('kompresor') || n.includes('lemari es') || n.includes('mesin bor') || n.includes('mesin pres')) return 'Mesin, Tata Udara & Utilitas';
  return 'Pendidikan, Olahraga & Medis';
}

async function extractAll() {
  const files = [
    {
      category: 'KIB_B',
      categoryLabel: 'KIB B (Aset Aktif)',
      status: 'Aktif',
      sourceDoc: 'KIB B 2026 - Aset Tetap Rekon Semester 2',
      fileName: 'KIBB2026_091126_90874a8c.pdf',
      path: path.join(__dirname, '../public/assets/aistudio/KIBB2026_091126_90874a8c.pdf')
    },
    {
      category: 'KIB_J',
      categoryLabel: 'KIB J (Aset Rusak)',
      status: 'Rusak Berat',
      sourceDoc: 'KIB J (KIB B Rusak Berat) Rekon Semester 2',
      fileName: 'KIBJ2026_091126_5664ea45.pdf',
      path: path.join(__dirname, '../public/assets/aistudio/KIBJ2026_091126_5664ea45.pdf')
    },
    {
      category: 'MPSA',
      categoryLabel: 'MPSA (Penetapan Majelis)',
      status: 'Proses Penghapusan',
      sourceDoc: 'MPSA - Majelis Penetapan Status Aset Rekon Semester 2',
      fileName: 'MPSA_091126_a4aec3ce.pdf',
      path: path.join(__dirname, '../public/assets/aistudio/MPSA_091126_a4aec3ce.pdf')
    }
  ];

  const allAssets = [];

  for (const f of files) {
    const buf = new Uint8Array(fs.readFileSync(f.path));
    const parser = new PDFParse(buf);
    const res = await parser.getText();
    const lines = res.text.split('\n');
    const rowRegex = /^(\d+)\s+(\d{12})\s+(\d{6})\s+(.+)$/;

    let count = 0;
    let sumTotal = 0;

    for (const line of lines) {
      const m = line.trim().match(rowRegex);
      if (!m) continue;
      count++;
      const no = parseInt(m[1], 10);
      const kodeBarang = m[2];
      const reg = m[3];
      const rest = m[4].trim();

      const endMatch = rest.match(/(?:(\d+)\s+)?([\d,]+\.\d{2})\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$/);
      if (!endMatch) {
        console.error('Error parsing row:', line);
        continue;
      }

      const asalOlehCode = endMatch[1] || '';
      const harga = parseFloat(endMatch[2].replace(/,/g, ''));
      const kapitalisasi = parseFloat(endMatch[3].replace(/,/g, ''));
      const total = parseFloat(endMatch[4].replace(/,/g, ''));
      sumTotal += total;

      const middle = rest.slice(0, endMatch.index).trim();
      const dateMatch = middle.match(/(\d{2}\/\d{2}\/\d{4})/);
      let tglOleh = '';
      let beforeDate = middle;
      let afterDate = '';

      if (dateMatch) {
        tglOleh = dateMatch[1];
        beforeDate = middle.slice(0, dateMatch.index).trim();
        afterDate = middle.slice(dateMatch.index + dateMatch[0].length).trim();
      }

      const beforeDateMatch = beforeDate.match(/^(.+?)\s+(\d+|-)\s+(BH|UN|-)$/i);
      let jenisBarang = beforeDate;
      let ukuran = '1';
      let satuan = 'BH';
      if (beforeDateMatch) {
        jenisBarang = beforeDateMatch[1].trim();
        ukuran = beforeDateMatch[2];
        satuan = beforeDateMatch[3];
      }

      const afterDateMatch = afterDate.match(/^(\d+|-)\s*(.*)$/);
      let bahanCode = '';
      let merekType = afterDate;
      if (afterDateMatch) {
        bahanCode = afterDateMatch[1];
        merekType = afterDateMatch[2].trim();
      }

      const tahunOleh = tglOleh ? parseInt(tglOleh.split('/')[2], 10) : null;
      const id = `${f.category}_${kodeBarang}_${reg}`;

      allAssets.push({
        id,
        category: f.category,
        categoryLabel: f.categoryLabel,
        status: f.status,
        sourceDoc: f.sourceDoc,
        fileName: f.fileName,
        no,
        kodeBarang,
        reg,
        jenisBarang,
        groupCategory: getGroupCategory(jenisBarang),
        ukuran,
        satuan: satuan === '-' ? 'UN' : satuan,
        tglOleh,
        tahunOleh,
        bahanCode: bahanCode || '-',
        bahanNama: bahanMap[bahanCode] || (bahanCode === '-' || !bahanCode ? 'Tidak Diketahui' : `Bahan #${bahanCode}`),
        merekType: merekType || '-',
        asalOlehCode: asalOlehCode || '-',
        asalOlehNama: asalOlehMap[asalOlehCode] || (asalOlehCode === '-' || !asalOlehCode ? 'Lain-lain' : `Asal #${asalOlehCode}`),
        harga,
        kapitalisasi,
        total
      });
    }

    console.log(f.category, 'Extracted count:', count, 'Total Nilai: Rp', sumTotal.toLocaleString('id-ID'));
  }

  console.log('Total All Assets Extracted:', allAssets.length);
  const outDir = path.resolve(__dirname, '../src/data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'assets.json'), JSON.stringify(allAssets, null, 2));
  console.log('Written to src/data/assets.json successfully! File size:', (fs.statSync(path.join(outDir, 'assets.json')).size / 1024).toFixed(1), 'KB');
}

extractAll().catch(console.error);
