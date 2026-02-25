export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Metode tidak diizinkan" });
  }

  const { kelas, mapel } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Kita ambil dari setting Vercel nanti

  const prompt = `Anda adalah asisten kurikulum di Indonesia. Buatlah ringkasan RPP untuk mata pelajaran ${mapel} di Kelas ${kelas} SD. 
  Berikan output dalam format JSON dengan dua kunci: 
  1. "tujuan": Berisi poin-poin Tujuan Pembelajaran (TP) yang relevan.
  2. "kkm": Berisi Kriteria Ketuntasan Minimal (KKM) atau KKTP yang disarankan (berupa angka dan penjelasan singkat).
  Gunakan bahasa Indonesia yang formal.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const data = await response.json();
    const content = JSON.parse(data.candidates[0].content.parts[0].text);
    
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: "Gagal memproses AI. Pastikan API Key sudah disetting." });
  }
}
