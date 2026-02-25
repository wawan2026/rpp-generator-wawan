// Ganti bagian prompt di api/generate.js
const prompt = `Anda adalah asisten kurikulum SD. Buatlah ringkasan RPP untuk mata pelajaran ${mapel} di Kelas ${kelas} SD sesuai Kurikulum Merdeka. 
Berikan jawaban dalam format JSON murni: 
{
  "tujuan": "Sebutkan 3-4 tujuan pembelajaran dengan awalan poin (•).",
  "kktp": "Berikan kriteria ketercapaian dalam bentuk poin-poin deskriptif (•)."
}`;
