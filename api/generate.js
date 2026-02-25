export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Metode tidak diizinkan" });
  }

  const { kelas, mapel } = req.body;

  // Simulasi database sederhana
  // Di masa depan, bagian ini bisa diganti dengan panggil API AI
  const databaseRPP = {
    "Matematika": {
      tujuan: "Peserta didik dapat memahami konsep penjumlahan dan pengurangan angka hingga 100 dengan tepat.",
      kkm: "75 (Kriteria Ketuntasan Minimal)"
    },
    "IPAS": {
      tujuan: "Peserta didik mampu mengidentifikasi bagian-bagian tubuh tumbuhan dan fungsinya.",
      kkm: "70 (Kriteria Ketuntasan Minimal)"
    }
  };

  const hasil = databaseRPP[mapel] || {
    tujuan: `Tujuan pembelajaran untuk ${mapel} kelas ${kelas} sedang dalam tahap sinkronisasi kurikulum merdeka.`,
    kkm: "70 (Standar Umum)"
  };

  res.status(200).json(hasil);
}
