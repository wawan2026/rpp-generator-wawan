async function generateAI() {
    const payload = {
        kelas: document.getElementById('kelas').value,
        mapel: document.getElementById('mapel').value,
        namaGuru: document.getElementById('namaGuru').value,
        nip: document.getElementById('nipGuru').value,
        namaSekolah: document.getElementById('namaSekolah').value
    };

    const btn = document.getElementById('btnGen');
    const load = document.getElementById('loadBox');
    
    if(!payload.mapel) return alert("Pilih mata pelajaran dulu, Pak!");
    
    btn.disabled = true;
    load.style.display = 'flex';

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        // Tampilkan hasil ke dalam format tabel di layar
        document.getElementById('resTujuan').value = data.tp;
        document.getElementById('resKKTP').value = data.kktp;
        document.getElementById('resLKPD').value = `PEMBELAJARAN DEEP LEARNING:\n\n1. Memahami: ${data.langkah_memahami}\n\n2. Aplikasi: ${data.langkah_aplikasi}\n\n3. Refleksi: ${data.langkah_refleksi}\n\nLKPD:\n${data.lkpd_tugas}\n\nRUBRIK:\n${data.rubrik}`;
        
        alert("RPP Berhasil disusun sesuai format Deep Learning!");
    } catch (err) {
        alert("Terjadi kesalahan teknis.");
    } finally {
        btn.disabled = false;
        load.style.display = 'none';
    }
}

// Fungsi Spesial Download ke Microsoft Word
function downloadDoc() {
    const guru = document.getElementById('namaGuru').value;
    const tp = document.getElementById('resTujuan').value;
    const content = `<h2>RPP MERDEKA - DEEP LEARNING</h2><p>Guru: ${guru}</p><table border="1"><tr><td>TP</td><td>${tp}</td></tr></table>`;
    
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'RPP_Pak_Wawan.doc';
    link.click();
}
