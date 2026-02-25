module.exports = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { mode, mataPelajaran, kelas, tujuanPembelajaran } = req.body;
    let prompt = "";

    // JIKA GURU KLIK "CARI TUJUAN"
    if (mode === "CARI_TP") {
      prompt = `Berikan 5 pilihan Tujuan Pembelajaran (TP) yang paling sering digunakan untuk Mata Pelajaran ${mataPelajaran} di ${kelas} SD Kurikulum Merdeka. Format harus JSON: {"pilihanTP": ["TP 1", "TP 2", "TP 3", "TP 4", "TP 5"]}`;
    } 
    // JIKA GURU KLIK "SUSUN RPP SEKARANG"
    else {
      prompt = `Buatlah RPP JSON materi ${mataPelajaran} dengan TP: ${tujuanPembelajaran}. Format: {"identifikasi":{"siswa":"..."},"pengalaman":{"pendahuluan":"...","memahami":"...","mengaplikasi":"...","refleksi":"..."}}`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    res.status(200).json(JSON.parse(resultText));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
