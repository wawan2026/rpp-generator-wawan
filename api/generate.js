export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (req.method === 'POST') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Buatlah RPP JSON untuk materi ${req.body.materiPelajaran} dengan tujuan ${req.body.tujuanPembelajaran}. Format JSON harus sesuai dengan: {"identifikasi":{"siswa":"..."},"pengalaman":{"pendahuluan":"...","memahami":"...","mengaplikasi":"...","refleksi":"..."},"asesmen":{"akhir":"..."},"lkpd":{"judulAktivitas":"...","tujuanEksplorasi":"...","petunjukKerja":"..."}}` }] }],
          generationConfig: { response_mime_type: "application/json" }
        })
      });

      const data = await response.json();
      const resultText = data.candidates[0].content.parts[0].text;
      res.status(200).json(JSON.parse(resultText));
    } catch (error) {
      res.status(500).json({ error: "Gagal memproses AI. Cek API Key Anda." });
    }
  } else {
    res.status(405).json({ message: 'Gunakan metode POST' });
  }
}
