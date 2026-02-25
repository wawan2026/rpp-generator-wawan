export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { kelas, mapel } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Instruksi tajam untuk Gemini 2.0 Flash agar hasil RPP & LKPD berkualitas tinggi
  const prompt = `Anda adalah pakar Kurikulum Merdeka tingkat SD.
  Buatlah administrasi lengkap untuk:
  - Mata Pelajaran: ${mapel}
  - Kelas: ${kelas}

  Berikan jawaban dalam JSON dengan struktur:
  1. "tujuan": Berikan 3-4 Tujuan Pembelajaran (TP) yang mencakup kompetensi dan konten materi.
  2. "kktp": Berikan Kriteria Ketercapaian (KKTP) dalam bentuk indikator deskriptif atau interval.
  3. "lkpd": Susun draf Lembar Kerja Peserta Didik yang terdiri dari Petunjuk Kerja, 3 soal HOTS, dan 1 tugas refleksi singkat.

  PENTING: Jawab hanya berupa JSON murni tanpa kata pembuka atau tanda petik kode.`;

  try {
    // Memanggil Model Gemini 2.0 Flash terbaru
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    // Validasi jawaban AI agar tidak undefined
    if (!data.candidates || !data.candidates[0].content) {
      throw new Error("AI tidak memberikan respon.");
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = JSON.parse(rawText.trim());
    
    res.status(200).json({
      tujuan: cleanJson.tujuan || "Tujuan gagal disusun.",
      kktp: cleanJson.kktp || "KKTP gagal disusun.",
      lkpd: cleanJson.lkpd || "LKPD gagal disusun."
    });

  } catch (error) {
    console.error("Error Detail:", error);
    res.status(200).json({ 
      tujuan: "Gagal memuat. Silakan klik tombol 'Generate' lagi.", 
      kktp: "Sistem sedang menyegarkan koneksi ke Gemini 2.0.",
      lkpd: "Coba beberapa saat lagi."
    });
  }
}
