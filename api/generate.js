import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Hanya menerima metode POST' });
  }

  const { prompt } = req.body;

  // Inisialisasi Google AI dengan API Key Bapak dari Environment Variable
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // MENGGUNAKAN MODEL FLASH LITE UNTUK MENGHEMAT KUOTA (Sesuai Limit di Gambar)
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  try {
    const result = await model.generateContent(`
      Bertindaklah sebagai pakar Kurikulum Merdeka. 
      ${prompt}. 
      Berikan respon dalam format JSON murni tanpa kata-kata pembuka.
      Struktur JSON:
      {
        "tujuan": "isi tujuan pembelajaran",
        "langkah": "isi langkah-langkah kegiatan inti"
      }
    `);

    const response = await result.response;
    const text = response.text();
    
    // Membersihkan teks jika AI memberikan markdown (```json ... ```)
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menyusun RPP. Limit API mungkin tercapai." });
  }
}
