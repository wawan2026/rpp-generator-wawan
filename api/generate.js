module.exports = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Gunakan POST' });
  }

  try {
    if (req.body.mode === "CARI_TP") {
      // Panggil Gemini untuk daftar TP
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Buatkan 5 pilihan Tujuan Pembelajaran untuk mata pelajaran ${req.body.mataPelajaran} kelas ${req.body.kelas}. Format JSON: {"pilihanTP":["...","..."]}` }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });
      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return res.status(200).json(JSON.parse(resultText));
    }

    if (req.body.mode === "GENERATE_RPP") {
      // Panggil Gemini untuk RPP
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Buatlah RPP JSON materi ${req.body.mataPelajaran} tujuan ${req.body.tujuanPembelajaran}. Format: {"identifikasi":{"siswa":"..."},"pengalaman":{"pendahuluan":"...","memahami":"...","mengaplikasi":"...","refleksi":"..."},"asesmen":{"akhir":"..."},"lkpd":{"judulAktivitas":"...","tujuanEksplorasi":"...","petunjukKerja":"..."}}` }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });
      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return res.status(200).json(JSON.parse(resultText));
    }

    return res.status(400).json({ error: "Mode tidak dikenali" });
  } catch (error) {
    res.status(500).json({ error: "Kesalahan: " + error.message });
  }
};
