"use client";
import HeroCarousel from "../../components/HeroCarousel";
import ProductList from "../../components/product/ProductList";
import StoreSelector from "../../components/StoreSelector";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <StoreSelector />
      <main className="flex-grow">
        <div className="max-w-7xl sm:mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Hero Carousel */}
          <HeroCarousel />

          {/* Product List */}
          <ProductList />
        </div>
      </main>
    </div>
  );
}

// "use client";

// import Image from "next/image";

// export default function HomePage() {
//   return (
//     <div>
//       {/* Header */}
//       <header className="bg-red-600 text-white p-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">Alfagift</h1>
//         <input
//           type="text"
//           placeholder="Temukan produk favoritmu disini"
//           className="input input-bordered w-full max-w-xs text-black"
//         />
//       </header>

//       {/* Carousel */}
//       <section className="mt-4 px-4">
//         <div className="carousel w-full rounded-xl">
//           <div id="slide1" className="carousel-item relative w-full">
//             <Image src="/banner1.jpg" alt="promo1" width={800} height={400} className="w-full object-cover" />
//             <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//               <a href="#slide3" className="btn btn-circle">
//                 ❮
//               </a>
//               <a href="#slide2" className="btn btn-circle">
//                 ❯
//               </a>
//             </div>
//           </div>
//           <div id="slide2" className="carousel-item relative w-full">
//             <Image src="/banner2.jpg" alt="promo2" width={800} height={400} className="w-full object-cover" />
//             <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//               <a href="#slide1" className="btn btn-circle">
//                 ❮
//               </a>
//               <a href="#slide3" className="btn btn-circle">
//                 ❯
//               </a>
//             </div>
//           </div>
//           <div id="slide3" className="carousel-item relative w-full">
//             <Image src="/banner3.jpg" alt="promo3" width={800} height={400} className="w-full object-cover" />
//             <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
//               <a href="#slide2" className="btn btn-circle">
//                 ❮
//               </a>
//               <a href="#slide1" className="btn btn-circle">
//                 ❯
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       Banner Promo
//       <section className="mt-4 px-4">
//         <Image src="/banner-alfa.jpg" alt="download banner" width={800} height={200} className="rounded-xl" />
//       </section>

//       {/* Produk Rekomendasi */}
//       <section className="mt-6 px-4">
//         <h2 className="text-lg font-semibold mb-2">Produk Rekomendasi</h2>
//         <div className="grid grid-cols-2 gap-4">
//           {[
//             { name: "Teh Botol Sosro", price: "Rp 5.000", image: "/tehbotol.jpg" },
//             { name: "Kopi ABC Susu", price: "Rp 2.500", image: "/kopiabc.jpg" },
//             { name: "Indomie Goreng", price: "Rp 3.000", image: "/indomie.jpg" },
//             { name: "Chitato Sapi Panggang", price: "Rp 7.500", image: "/chitato.jpg" },
//           ].map((product, i) => (
//             <div key={i} className="card bg-base-100 shadow-md">
//               <figure>
//                 <Image src={product.image} alt={product.name} width={150} height={150} className="object-cover" />
//               </figure>
//               <div className="card-body p-4">
//                 <h2 className="text-sm font-medium">{product.name}</h2>
//                 <p className="text-red-600 font-semibold">{product.price}</p>
//                 <div className="card-actions justify-end">
//                   <button className="btn btn-sm btn-error text-white">Beli</button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
