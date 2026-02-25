<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RPP Generator - SD Negeri 3 Kedungwungu</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.6; }
        .card { border: 1px solid #ddd; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        select, input, button { width: 100%; padding: 12px; margin: 10px 0; border-radius: 6px; border: 1px solid #ccc; box-sizing: border-box; }
        button { background-color: #2563eb; color: white; border: none; font-weight: bold; cursor: pointer; }
        button:hover { background-color: #1d4ed8; }
        #result { margin-top: 20px; background: #f9fafb; padding: 15px; border-radius: 8px; display: none; text-align: left; }
    </style>
</head>
<body>
    <div class="card">
        <img src="wawan.png" alt="Logo" style="width: 80px; display: block; margin: 0 auto;">
        <h2 style="text-align: center;">RPP Generator Cepat</h2>
        
        <label>Pilih Kelas:</label>
        <select id="kelas">
            <option value="1">Kelas 1</option>
            <option value="2">Kelas 2</option>
            <option value="3">Kelas 3</option>
            <option value="4">Kelas 4</option>
            <option value="5">Kelas 5</option>
            <option value="6">Kelas 6</option>
        </select>

        <label>Mata Pelajaran:</label>
        <input type="text" id="mapel" placeholder="Contoh: Matematika, IPAS, dll.">

        <button onclick="generateRPP()">Generate Sekarang</button>

        <div id="result">
            <h3 id="resTitle"></h3>
            <p><strong>Tujuan Pembelajaran:</strong><br><span id="resTujuan"></span></p>
            <p><strong>KKM / KKTP:</strong><br><span id="resKKM"></span></p>
        </div>
    </div>

    <script>
        async function generateRPP() {
            const kelas = document.getElementById('kelas').value;
            const mapel = document.getElementById('mapel').value;
            const resDiv = document.getElementById('result');

            if(!mapel) return alert("Isi mata pelajaran dulu, Pak!");

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kelas, mapel })
            });

            const data = await response.json();
            
            document.getElementById('resTitle').innerText = "Hasil RPP " + mapel + " Kelas " + kelas;
            document.getElementById('resTujuan').innerText = data.tujuan;
            document.getElementById('resKKM').innerText = data.kkm;
            resDiv.style.display = 'block';
        }
    </script>
</body>
</html>
