Buatkan PRD untuk webapp pencatatan laundry dengan tampilan epic, modern responsive user story, dan activity diagram dalam bahasa indonesia.

Nama aplikasi : LaundryKu v1.0

Pengguna :
1. SuperAdmin sebagai administrator utama yang dapat mengelola seluruh fitur aplikasi. juga memiliki hak akses untuk menambah, mengedit, dan menghapus data admin (pemilik laundry), serta hak akses mendaftar kan WA tertaut guna mempermudah super admin untuk memberi info kepada admin (pemilik Laundry), dan juga dapat melihat data admin (pemilik Laundry) sebatas masa aktif admin (agar bisa memberi info ketika masa aktif akun admin akan berakhir melalui pesan whatsaap).
2. admin sebagai pemilik laundry yang mengelola data karyawan, menambah, mengedit, dan menghapus data karyawan, menambah, mengedit, dan menghapus data paket,  menambah, mengedit, menghapus data pelanggan, serta dasboard utama tentang pendapatan, diagram grafik berdasarkan hari, bulan, dan tahun, diagram grafik berdasarkan paket, statistik karyawan tentang pengerjaan cucian yang diselesaikan oleh karyawan. akses halaman pairing whatsapp untuk menautkan whatsapp toko.
3. Karyawan sebagai karyawan dari admin, memiliki akses ke halaman data cucian global, halaman pencatatan cucian, dan dapat update status cucian.

Fitur Utama :
1. Pencatatan cucian perdasarkan jenis cucian, kategori paket, kuantitas, harga, dan catatan penting, dan dicatat berdasarkan tanggal. catat juga nama pelanggan dan nomor whatsapp. untuk pengecekan status cucian dari whatsapp toko.
2. Dasboard utama yang menampilkan data total cucian, total pendapatan, cucian masuk hari ini/pilih berdasarkan tanggal, cucian yang akan diambil hari ini sesuai dengan tenggat waktu, dan riwayat cucian keluar masuk.
3. Halaman paket yang menampilkan daftar paket yang tersedia, dapat tambah, edit, dan hapus paket.
4. Halaman karyawan yang menampilkan daftar karyawan, dapat tambah, edit, dan hapus karyawan.
5. Halaman data cucian global menampilkan data cucian, status, tanggal masuk, tanggal keluar, total harga, jumlah cucian, nama pelanggan, nomor whatsapp, dapat edit status cucian (Diambil Pelanggan, Sedang dikerjakan, Selesai, bayar/belum)
6. Halaman pairing whatsapp untuk menautkan whatsapp toko dengan status connect, disconnect. bisa membuat pesan templat/custom untuk dikirim ke pelanggan via whatsapp (setiap pengiriman pesan gunakan jeda 10 detik agar aman)
7. Halaman pengguna superadmin yang menampilkan daftar admin, dapat tambah, edit, dan hapus admin.
8. Halaman admin superadmin yang menampilkan data admin, dapat menambah, mengedit, dan menghapus admin, status admin dan masa aktifnya, menambah masa aktif admin, dan informasi pairing whatsapp admin (connect/disconnect)
9. Halaman Karyawan dapat mencatat cucian, mengupdate status cucian, dan melihat status cucian. (notifikasi WA otomatis ke pelanggan dari nomor wa admin toko, ketika cucian masuk, ketika ada update status cucian, dan ketika cucian sudah bisa diambil/sudah diambil).
10. Halaman landingpage untuk seluruh pengguna (daftar, login, informasi seputar LaundryKu v1.0) cara daftar yang auto direk ke superadmin via whatsapp dengan pesan template.
11. Halaman Login / Daftar/Logout untuk ketiga pengguna tersebut above (superadmin, admin, karyawan)
12. halaman lupa password.

Buat dengan desain frontend yang responsdif dan modern gunakan skill antigravity-design-expert dan cc-skill-frontend-patterns. Pisahkan antara frontend dan backend agar meudah dalam scaling app atau memisahkan fronted dan backend. frontend gunakan next js dan backend gunakan node js, pisahkan database sql dan database whatsapp (no-sql) dan redis untuk caching.
untuk setiap penulisan code script gunakan skill cc-skill-coding-standards. pisahkan alur kerja dari frontend dan backend agar mudah dalam memilih model tambahkan fitur atau halaman terkait aplikasi yang mungkin belum saya sertakan terutama halaman atau fitur penting yang mendukung fitur/ halaman lain berfungsi dengan lebih baik.