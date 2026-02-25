export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { kelas, mapel } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Anda adalah asisten kurikulum SD di Indonesia. Buatlah ringkasan RPP untuk mata pelajaran ${mapel} di Kelas ${kelas} SD sesuai Kurikulum Merdeka. 
  Berikan jawaban dalam format JSON murni: 
  {
    "tujuan": "Berikan 3-4 poin tujuan pembelajaran (TP) dengan awalan simbol •",
    "kktp": "Berikan deskripsi Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) dengan awalan simbol •"
  }`;

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
    
    if (!data.candidates || !data.candidates[0].content) {
      throw new Error("Jawaban AI tidak lengkap");
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = JSON.parse(rawText.trim());
    
    res.status(200).json(cleanJson);
  } catch (error) {
    res.status(200).json({ 
      tujuan: "• Maaf, sistem sedang sibuk. Silakan klik tombol lagi.", 
      kktp: "• Sistem sedang menyegarkan koneksi." 
    });
  }
}
