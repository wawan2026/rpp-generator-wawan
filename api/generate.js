export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { kelas, mapel } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Prompt instruksi khusus Gemini 2.0 Flash
  const prompt = `Anda asisten kurikulum SD. Buatlah TP, KKTP, dan draf LKPD singkat untuk mata pelajaran ${mapel} di Kelas ${kelas} SD Kurikulum Merdeka. 
  Balas HANYA dengan format JSON murni: 
  {"tujuan": "Isi poin TP", "kktp": "Isi kriteria", "lkpd": "Isi tugas siswa"}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = JSON.parse(rawText.trim());
    
    res.status(200).json(cleanJson);
  } catch (error) {
    res.status(200).json({ tujuan: "Gagal memuat TP", kktp: "Gagal memuat KKTP", lkpd: "Gagal memuat LKPD" });
  }
}
