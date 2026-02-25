module.exports = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method !== 'POST') return res.status(405).send('Metode Harus POST');
  if (!apiKey) return res.status(500).json({ error: "API Key Belum Terpasang di Vercel Settings" });

  try {
    const { mode, mataPelajaran, kelas, tujuanPembelajaran } = req.body;
    let promptText = "";

    if (mode === "CARI_TP") {
      promptText = `Berikan 5 pilihan Tujuan Pembelajaran (TP) untuk Mapel ${mataPelajaran} Kelas ${kelas} SD Kurikulum Merdeka. Format harus JSON murni: {"pilihanTP": ["isi TP 1", "isi TP 2", "isi TP 3", "isi TP 4", "isi TP 5"]}`;
    } else {
      promptText = `Buat RPP JSON materi ${mataPelajaran} TP: ${tujuanPembelajaran}. Format: {"identifikasi":{"siswa":"..."},"pengalaman":{"pendahuluan":"...","memahami":"...","mengaplikasi":"...","refleksi":"..."}}`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json(JSON.parse(data.candidates[0].content.parts[0].text));
    } else {
      res.status(500).json({ error: "AI tidak memberikan jawaban", detail: data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
