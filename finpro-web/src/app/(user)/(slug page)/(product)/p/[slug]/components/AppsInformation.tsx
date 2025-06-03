import * as React from "react";

export default function AppsInfoComponent() {
  const appInfo = [
    {
      title: "Alfagift, Toko Belanja Online Grocery Terlengkap dari Alfamart",
      description:
        `Alfamart adalah salah satu perusahaan ritel minimarket terkemuka yang telah hadir memberikan kemudahan dan kenyamanan berbelanja selama puluhan tahun untuk masyarakat Indonesia. Berbekal pengalaman tersebut dan kemauan untuk terus berkembang memberikan yang terbaik bagi pelanggan setianya, lahirlah Alfagift, toko online yang jual puluhan ribu pilihan produk kebutuhan sehari-hari dengan kategori yang beragam. Misalnya, makanan dan minuman, bahan masakan, perlengkapan bayi dan anak, perlengkapan rumah tangga, produk kecantikan dan kesehatan, dan masih banyak lagi. Toko Alfamart online Alfagift akan menjadi tempat belanja online grocery yang terlengkap dan terpercaya di Indonesia.`,
    },
    {
      title: "Cara Belanja di Alfagift",
      description:
        `Menyenangkan rasanya ketika bisa memenuhi kebutuhan sehari-hari hanya dengan menggerakkan jari di layar smartphone atau laptop dari rumah. Tidak perlu lagi menghabiskan waktu lama dan menghadapi kemacetan di jalan untuk membeli produk belanja bulanan karena Alfagift hadir untuk membuat belanja online jadi dekat. Sembari bersantai dan menikmati momen bersama keluarga, belanja kebutuhan sehari-hari dapat dilakukan dengan beberapa klik melalui desktop atau pun aplikasi Alfagift user friendly yang dapat dengan mudah diunduh atau didownload di Google Playstore dan Apple App Store. Semua dapat dilakukan dari hampir seluruh daerah di penjuru Indonesia karena toko Alfamart telah hadir di ribuan titik nusantara. Menjadikannya payment point, pickup point, hingga warehouse yang melayani pengiriman sehingga pesanan dapat sampai jauh lebih cepat. Didukung layanan pengiriman cepat same day dan gratis ongkir.`,
    },
    {
      title: "Beragam Promo Alfagift Super Hemat",
      description: `Ada begitu banyak program promo dan diskon produk menarik yang dapat dinikmati setiap hari di toko online terpercaya Alfagift. Membantu Anda untuk lebih hemat dan cermat dalam mengatur pengeluaran. Seluruh promo yang bisa dinikmati di toko, seperti JSM Alfamart, promo dwi mingguan (PDM), dan voucher Alfamart yang hemat juga dapat dinikmati di Alfagift dengan keuntungan yang sama. Selain itu, juga ada promo member, official store, promo payday, promo bank, ramadhan, liburan, lebaran, natal, tahun baru, harga spesial, kupon belanja, dan cashback yang bisa dinikmati oleh seluruh pelanggan.`,
    },
    {
      title: "Kemudahan Bertransaksi di Online Shop Alfagift",
      description: `Bersama dengan semua itu, Alfagift juga menyediakan kemudahan bertransaksi melalui kartu kredit (Visa, Master Card, dan JCB), transfer via ATM, internet, dan online banking, GoPay, ShopeePay, dan Virgo. Lengkap dengan fasilitas menarik lainnya, seperti bayar di tempat atau cash on delivery (COD) dan pay at store (PAS), gratis ongkir, ambil di toko, hingga layanan pesan antar Alfamart yang memungkinkan pesanan diterima di hari yang sama. Informasi lengkap lainnya bisa diakses dengan mudah melalui blog Alfamart yang juga memuat artikel / tips dengan topik dan tema menarik setiap hari.`,
    },
  ];
  return <div className="my-24">
    {appInfo.map((item, index) => (
      <div key={index} className="my-6 px-2 text-gray-500">
        <h1 className="text-base font-bold mb-2">{item.title}</h1>
        <p className="text-sm">{item.description}</p>
      </div>
    ))}
  </div>;
}
