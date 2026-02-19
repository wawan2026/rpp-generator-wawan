export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key belum di-set di Vercel' });
  }

  try {
    // Menggunakan model yang paling stabil: gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const prompt = `Buatlah RPP Deep Learning untuk:
    Mata Pelajaran: ${req.body.mataPelajaran}
    Materi: ${req.body.materiPelajaran}
    Tujuan: ${req.body.tujuanPembelajaran}
    Format harus JSON murni dengan struktur:
    {
      "identifikasi": {"siswa": "..."},
      "pengalaman": {"pendahuluan": "...", "memahami": "...", "mengaplikasi": "...", "refleksi": "..."},
      "asesmen": {"akhir": "..."},
      "lkpd": {"judulAktivitas": "...", "tujuanEksplorasi": "...", "petunjukKerja": "..."}
    }`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const resultText = data.candidates[0].content.parts[0].text;
      res.status(200).json(JSON.parse(resultText));
    } else {
      throw new Error('Respon AI tidak valid');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
