export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { kelas, mapel } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key tidak ditemukan" });
  }

  const prompt = `Buatlah administrasi Kurikulum Merdeka untuk Kelas ${kelas} Mata Pelajaran ${mapel}. Berikan Tujuan Pembelajaran (TP), KKTP, dan draf LKPD singkat. Jawab hanya dalam format JSON murni: {"tujuan": "isi", "kktp": "isi", "lkpd": "isi"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();
    console.log("Respon Gemini:", JSON.stringify(data, null, 2));

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("Respon AI kosong atau format tidak sesuai");
    }

    const cleanJson = JSON.parse(rawText.trim());
    res.status(200).json(cleanJson);

  } catch (error) {
    console.error("Error generate:", error);
    res.status(500).json({
      tujuan: "Maaf Pak, terjadi kesalahan.",
      kktp: "Silakan coba klik tombol lagi.",
      lkpd: "Sedang refresh..."
    });
  }
}
