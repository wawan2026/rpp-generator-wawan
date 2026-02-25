module.exports = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Gunakan POST' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Buatlah RPP JSON materi ${req.body.materiPelajaran} tujuan ${req.body.tujuanPembelajaran}. Format: {"identifikasi":{"siswa":"..."},"pengalaman":{"pendahuluan":"...","memahami":"...","mengaplikasi":"...","refleksi":"..."},"asesmen":{"akhir":"..."},"lkpd":{"judulAktivitas":"...","tujuanEksplorasi":"...","petunjukKerja":"..."}}` }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const resultText = data.candidates[0].content.parts[0].text;
      res.status(200).json(JSON.parse(resultText));
    } else {
      res.status(500).json({ error: "Data AI tidak ditemukan", detail: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Kesalahan: " + error.message });
  }
};
