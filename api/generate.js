module.exports = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. Cek jika yang masuk bukan data POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 2. Langsung panggil Google Gemini tanpa alat tambahan (Library)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Buatlah RPP JSON untuk materi ${req.body.materiPelajaran} dengan tujuan ${req.body.tujuanPembelajaran}. Format JSON harus: {"identifikasi":{"siswa":"..."},"pengalaman":{"pendahuluan":"...","memahami":"...","mengaplikasi":"...","refleksi":"..."},"asesmen":{"akhir":"..."},"lkpd":{"judulAktivitas":"...","tujuanEksplorasi":"...","petunjukKerja":"..."}}` }] }],
        generationConfig: { 
          response_mime_type: "application/json",
          temperature: 0.7
        }
      })
    });

    const data = await response.json();
    
    // 3. Kirim hasil balik ke aplikasi Bapak
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const resultText = data.candidates[0].content.parts[0].text;
      res.status(200).json(JSON.parse(resultText));
    } else {
      res.status(500).json({ error: "Respon AI tidak valid", detail: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Kesalahan Server: " + error.message });
  }
};
