# Design Moodboard Project Inception

Dokumen ini merangkum arah visual dari moodboard yang dikirim desainer untuk Project Inception. Tujuannya adalah menjadi referensi cepat agar implementasi UI tetap konsisten, baik saat membuat halaman baru maupun saat menyamakan tampilan komponen yang sudah ada.

## Inti Arah Visual

Moodboard ini bergerak ke tema:

- Space / outer space
- Galaxy / nebula
- Minimalist modern
- Neon glow yang hangat, bukan futuristik dingin

Arah ini memberi kesan:

- misterius
- premium
- imersif
- modern
- sedikit playful tanpa kehilangan struktur

Kesimpulan penting: tampilan harus terasa seperti ruang angkasa yang elegan, bukan sekadar dark UI biasa.

## Keyword Desain

Gunakan empat keyword ini sebagai filter saat mendesain atau menilai UI:

- Space
- Galaxy
- Nebula
- Minimalist Modern

Kalau elemen desain tidak mendukung salah satu keyword di atas, biasanya elemen tersebut terlalu jauh dari konsep.

## Palet Warna

Moodboard menampilkan kombinasi ungu gelap, ungu terang, kuning emas, dan putih hangat. Kombinasi ini membentuk kontras yang kuat antara latar kosmik dan aksen bercahaya.

### Warna Utama

```css
:root {
    --inception-purple-900: #37005c;
    --inception-purple-500: #b13bff;
    --inception-gold-500: #ffcc00;
    --inception-cream-100: #f7f4e9;
}
```

### Fungsi Warna

- `#37005C` dipakai untuk latar terdalam, panel bayangan, atau area yang harus terasa sangat dalam.
- `#B13BFF` dipakai sebagai aksen utama bernuansa neon, highlight, dan elemen identitas visual.
- `#FFCC00` dipakai untuk judul, penekanan, atau elemen yang harus langsung menarik perhatian.
- `#F7F4E9` dipakai untuk teks di area gelap, kartu terang, dan bidang netral hangat.

### Aturan Penggunaan

- Jangan memakai ungu terang sebagai warna dominan seluruh halaman.
- Jangan menggabungkan kuning dengan putih murni secara berlebihan, karena efek glow akan hilang.
- Pertahankan kontras tinggi antara background gelap dan teks terang.
- Pakai warna emas sebagai aksen, bukan warna isi utama seluruh blok.

## Background dan Atmosfer

Background pada moodboard bukan bidang polos. Ia dibangun dari beberapa lapisan atmosfer:

- gradasi gelap ke ungu tua
- bintik-bintik seperti bintang
- kabut / nebula lembut
- cahaya blur di beberapa titik
- streak cahaya diagonal seperti meteor atau sinar komet

### Rekomendasi Implementasi

- Gunakan gradient radial dan linear untuk menciptakan kedalaman.
- Tambahkan noise atau star field halus agar background tidak terasa flat.
- Pakai blur besar dengan opacity rendah untuk efek nebula.
- Hindari efek yang terlalu ramai; background harus mendukung konten, bukan bersaing dengannya.

## Tipografi

Tipografi di moodboard terbagi dua fungsi:

1. Heading display yang besar, tebal, dan bercahaya.
2. Body text yang ringan, rapi, dan sangat mudah dibaca.

### Karakter Heading

- huruf besar atau title case yang tegas
- bobot tebal
- spacing rapat tapi tetap jelas
- diberi glow emas atau bayangan cahaya hangat
- terasa seperti judul poster / film sci-fi

### Karakter Body

- sans-serif modern yang bersih
- ukuran cukup kecil tapi readable
- line-height longgar
- warna cenderung krem atau putih lembut

### Arah Font

Jika ingin meniru rasa visual pada moodboard, gunakan pairing berikut:

- font display: font geometrik atau display tebal dengan bentuk unik
- font isi: sans-serif modern yang netral dan bersih

Catatan dari desainer pada moodboard: asset utama tetap mengikuti file Figma. Artinya, font atau ornament yang dipakai boleh disesuaikan tooling-nya, tetapi komposisi dan rasa visual harus tetap refer ke source design.

### Aturan Praktis

- Jangan pakai font body yang terlalu dekoratif.
- Jangan gunakan terlalu banyak jenis font dalam satu halaman.
- Maksimal dua keluarga font: satu untuk heading, satu untuk isi.
- Efek glow cukup dipakai pada heading atau elemen fokus saja.

## Layout dan Komposisi

Moodboard menunjukkan komposisi yang seimbang antara elemen informasi dan elemen dekoratif.

### Ciri Layout

- layout terasa poster-like
- banyak ruang negatif untuk memberi napas
- elemen utama dibuat besar dan dominan
- panel teks memakai bentuk kartu lembut dengan sudut membulat
- ada keseimbangan antara sisi kiri yang informatif dan sisi kanan yang visual

### Pola Komposisi yang Disarankan

- gunakan grid sederhana 2 kolom untuk halaman hero atau landing section
- sisi kiri untuk narasi, keyword, atau penjelasan
- sisi kanan untuk visual utama, diagram, atau highlight warna
- gunakan kartu transparan atau glassy surface untuk blok teks

## Komponen Visual

Beberapa elemen yang paling menonjol di moodboard:

- judul besar dengan glow emas
- kartu gelap semi-transparan
- bayangan lembut di bawah panel
- bidang warna berbentuk setengah lingkaran / pie chart untuk eksplorasi palet
- dekorasi bintang dan partikel cahaya

### Bentuk dan Radius

- gunakan radius yang lembut untuk kartu dan panel
- bentuk bulat dan setengah lingkaran cocok untuk menguatkan tema kosmik
- hindari sudut tajam yang terlalu teknis jika tidak dibutuhkan

### Efek

- glow emas untuk heading
- shadow lembut untuk depth
- blur halus untuk kartu atau nebula effect
- opacity bertingkat untuk menciptakan layer

## Tone of Voice Visual

Desain ini harus memberi kesan:

- premium, bukan ramai
- modern, bukan generik
- magis, bukan childish
- berkarakter, bukan template biasa

Saat menambah komponen baru, tanyakan tiga hal:

1. Apakah komponen ini terasa seperti bagian dari dunia space / galaxy?
2. Apakah warnanya sesuai palet utama?
3. Apakah elemen ini tetap mudah dibaca di background gelap?

Kalau jawaban salah satunya tidak, maka perlu disederhanakan.

## Do

- Pakai background gelap dengan layer cahaya halus.
- Gunakan aksen emas untuk emphasis utama.
- Pertahankan body text yang bersih dan mudah dibaca.
- Gunakan kartu semi-transparan untuk panel informasi.
- Beri ruang kosong yang cukup agar desain terasa premium.

## Don’t

- Jangan membuat background polos dan flat.
- Jangan memakai terlalu banyak warna cerah sekaligus.
- Jangan menumpuk terlalu banyak efek glow.
- Jangan membuat teks body terlalu dekoratif.
- Jangan mengorbankan keterbacaan demi estetika.

## Arah Implementasi di Project Inception

Jika moodboard ini diterjemahkan ke UI project, arah implementasinya sebaiknya seperti ini:

- halaman utama memakai dark cosmic background
- section hero menggunakan heading besar dengan highlight emas
- card informatif memakai permukaan gelap dengan opacity ringan
- ilustrasi atau grafik menggunakan ungu, emas, dan cream sebagai sistem warna utama
- elemen dekoratif dipakai hemat, sebagai aksen identitas, bukan filler

## Ringkasan Singkat

Moodboard Project Inception mengarah ke UI bertema ruang angkasa dengan karakter premium dan modern. Kekuatan utamanya ada pada kontras gelap-versus-cahaya, palet ungu dan emas, serta tipografi display yang tegas. Kuncinya adalah menjaga tampilan tetap imersif, bersih, dan mudah dibaca.

## Referensi

- Sumber visual utama: moodboard dari desainer di Figma.
- Dokumen ini adalah interpretasi operasional untuk membantu implementasi di codebase.
