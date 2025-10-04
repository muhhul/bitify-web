# Bitify Web

# 1. Nama dan Deskripsi Program
Bitify Web adalah antarmuka pengguna berbasis web yang modern dan interaktif untuk layanan steganografi Bitify. Aplikasi ini memungkinkan pengguna untuk dengan mudah mengunggah file audio dan file rahasia, mengatur parameter steganografi, serta melihat hasil penyisipan dan ekstraksi secara visual.

# 2. Kumpulan Teknologi (Tech Stack)
* Framework: Next.js (React)
* Bahasa: TypeScript
* Styling: Tailwind CSS
* UI Components: shadcn/ui
* Linting: ESLint

# 3. Dependensi
Beberapa dependensi utama yang digunakan pada frontend antara lain:
* next
* react & react-dom
* tailwindcss
* lucide-react (untuk ikon)
* cmdk (untuk command palette)
* recharts (untuk grafik)
* vaul (untuk drawer)

Untuk daftar lengkap, silakan merujuk ke file [package.json](/package.json).

# 4. Tata Cara Menjalankan Program
### a. Instalasi Dependensi

Pastikan Anda memiliki Node.js dan npm (atau yarn/pnpm) terinstal. Buka terminal di direktori bitify-web dan jalankan:
```
npm install
```

### b. Menjalankan Server Development

Setelah semua dependensi terinstal, jalankan server pengembangan dengan perintah:
```
npm run dev
```