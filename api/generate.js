export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { kelas, mapel } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `Buatlah ringkasan RPP untuk mata pelajaran ${mapel} di Kelas ${kelas} SD. 
  Berikan jawaban dalam format JSON murni: 
  {
    "tujuan": "isi poin tujuan pembelajaran",
    "kkm": "angka dan penjelasan"
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
    
    // Mengambil teks mentah dari AI
    let rawText = data.candidates[0].content.parts[0].text;
    
    // Membersihkan karakter aneh jika ada
    const cleanJson = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    
    res.status(200).json(cleanJson);
  } catch (error) {
    console.error(error);
    res.status(200).json({ 
      tujuan: "Maaf, sistem sedang sibuk. Silakan coba klik tombol Generate lagi.", 
      kkm: "Belum tersedia" 
    });
  }
}
