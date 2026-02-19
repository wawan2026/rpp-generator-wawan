export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const data = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Instruksi Deep Learning Bapak saya masukkan di sini
  const prompt = `
    Anda adalah ahli desain kurikulum Deep Learning (Pembelajaran Mendalam) di Indonesia. 
    Buatlah Rencana Pembelajaran Mendalam dan LKPD yang komprehensif.
    
    KONTEKS INPUT:
    - Satuan Pendidikan: ${data.namaSatuanPendidikan}
    - Mata Pelajaran: ${data.mataPelajaran}
    - Kelas/Jenjang: ${data.kelas} (${data.jenjang})
    - Capaian Pembelajaran: ${data.capaianPembelajaran}
    - Tujuan Pembelajaran: ${data.tujuanPembelajaran}
    - Materi Utama: ${data.materiPelajaran}
    - KKTP: ${data.kktp}
    - Praktik Pedagogis: ${data.praktikPedagogis.join(', ')}
    - Jumlah Pertemuan: ${data.jumlahPertemuan} Pertemuan
    
    Balas WAJIB dalam format JSON murni sesuai skema yang diminta.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const result = await response.json();
    const resultText = result.candidates[0].content.parts[0].text;
    res.status(200).json(JSON.parse(resultText));
  } catch (error) {
    res.status(500).json({ error: "Gagal menyusun RPP" });
  }
}
