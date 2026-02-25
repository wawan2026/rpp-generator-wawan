// api/generate.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method !== 'POST') return res.status(405).send('Metode Harus POST');

  if (!apiKey) return res.status(500).json({ error: "API Key belum diisi di Vercel Settings" });

  try {
    const { mode, mataPelajaran, kelas, tujuanPembelajaran } = req.body;
    let promptText = "";

    if (mode === "CARI_TP") {
      promptText = `Berikan 5 pilihan Tujuan Pembelajaran (TP) singkat untuk mata pelajaran ${mataPelajaran} kelas ${kelas} SD Kurikulum Merdeka. Format JSON: {"pilihanTP": ["TP 1", "TP 2", "TP 3", "TP 4", "TP 5"]}`;
    } else {
      promptText = `Buat RPP singkat materi ${mataPelajaran} dengan TP: ${tujuanPembelajaran}. Format JSON: {"identifikasi":{"siswa":"..."},"pengalaman":{"pendahuluan":"...","memahami":"...","mengaplikasi":"...","refleksi":"..."}}`;
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
      let rawText = data.candidates[0].content.parts[0].text;
      let cleanJson;
      try {
        cleanJson = JSON.parse(rawText);
        res.status(200).json(cleanJson);
      } catch (e) {
        // fallback: kirim raw text kalau bukan JSON valid
        res.status(200).json({ raw: rawText });
      }
    } else {
      res.status(500).json({ error: "AI tidak merespon dengan benar" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server Error: " + error.message });
  }
};
