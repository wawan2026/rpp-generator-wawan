// generate.js

async function generateAI() {
    const dataIn = {
        kelas: document.getElementById('kelas').value,
        mapel: document.getElementById('mapel').value,
        namaGuru: document.getElementById('namaGuru').value,
        nip: document.getElementById('nipGuru').value,
        namaSekolah: document.getElementById('namaSekolah').value
    };

    const btn = document.getElementById('btnGen');
    const loader = document.getElementById('loader');
    const btnText = document.getElementById('btnText');
    const resArea = document.getElementById('printableArea');

    if (!dataIn.mapel) return alert("Pak Wawan, mohon pilih mata pelajaran dulu!");

    btn.disabled = true;
    loader.style.display = 'inline-block';
    btnText.innerText = "SEDANG MENYUSUN...";

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataIn)
        });

        const data = await response.json();

        // Format teks untuk tampilan preview
        const formattedText = `
RENCANA PEMBELAJARAN MENDALAM (DEEP LEARNING)
Guru: ${dataIn.namaGuru} | NIP: ${dataIn.nip}
Sekolah: ${dataIn.namaSekolah}

1. TUJUAN PEMBELAJARAN (TP):
${data.tp}

2. KKTP:
${data.kktp}

3. DESAIN PEMBELAJARAN:
- Pendahuluan: ${data.langkah_pendahuluan}
- Memahami: ${data.langkah_memahami}
- Aplikasi: ${data.langkah_aplikasi}
- Refleksi: ${data.langkah_refleksi}

4. LEMBAR KERJA (LKPD):
${data.lkpd_tugas}

5. RUBRIK PENILAIAN:
${data.rubrik}
        `.trim();

        document.getElementById('outputDisplay').value = formattedText;
        resArea.style.display = 'block';
        document.getElementById('btnDownload').style.display = 'inline-block';

    } catch (err) {
        alert("Sistem sibuk, silakan coba lagi beberapa saat lagi.");
    } finally {
        btn.disabled = false;
        loader.style.display = 'none';
        btnText.innerText = "GENERATE RPP & LKPD";
    }
}

function downloadWord() {
    const content = document.getElementById('outputDisplay').value;
    // Mengubah line break menjadi <br> agar rapi di Word
    const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'>
        <style>body{font-family:'Times New Roman'; font-size:12pt;}</style></head>
        <body>${content.replace(/\n/g, '<br>')}</body>
        </html>`;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RPP_${document.getElementById('mapel').value}_Kelas${document.getElementById('kelas').value}.doc`;
    link.click();
}
