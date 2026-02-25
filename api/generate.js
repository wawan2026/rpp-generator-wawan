export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { kelas, mapel } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Buatlah ringkasan RPP untuk mata pelajaran ${mapel} di Kelas ${kelas} SD sesuai Kurikulum Merdeka. 
  Berikan jawaban dalam format JSON murni tanpa tanda petik kode: 
  {
    "tujuan": "isi poin tujuan pembelajaran",
    "kktp": "isi deskripsi KKTP"
  }`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Validasi apakah AI memberikan jawaban yang benar
    if (!data.candidates || !data.candidates[0].content) {
      throw new Error("Jawaban AI tidak lengkap");
    }

    let rawText = data.candidates[0].content.parts[0].text;
    
    // Pembersihan ekstra agar tidak undefined
    const cleanText = rawText.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleanText);
    
    res.status(200).json({
      tujuan: result.tujuan || "Tujuan tidak ditemukan",
      kktp: result.kktp || "KKTP tidak ditemukan"
    });

  } catch (error) {
    console.error("Detail Error:", error.message);
    res.status(200).json({ 
      tujuan: "Maaf, server sedang sibuk. Silakan coba klik tombol Generate lagi.", 
      kktp: "Sistem sedang refresh." 
    });
  }
}
