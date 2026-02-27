import React from "react";
import Header from "../../layout/client/Header";
import Footer from "../../layout/client/Footer";
import ProductCard from "../../layout/client/ProductCard";
import SectionTag from "../../layout/client/SectionTag";
import ViewAllButton from "../../layout/client/ViewAllButton";

// --- Image URLs ---
const imgGamepad = "https://placehold.co/400x400/f5f5f5/333333/png?text=HAVIT+Gamepad";
const imgKeyboard = "https://placehold.co/400x400/f5f5f5/333333/png?text=AK-900+Keyboard";
const imgMonitor = "https://placehold.co/400x400/f5f5f5/333333/png?text=Gaming+Monitor";
const imgChair = "https://placehold.co/400x400/f5f5f5/333333/png?text=Comfort+Chair";
const imgCoat = "https://placehold.co/400x400/f5f5f5/333333/png?text=North+Coat";
const imgBag = "https://placehold.co/400x400/f5f5f5/333333/png?text=Gucci+Bag";
const imgCooler = "https://placehold.co/400x400/f5f5f5/333333/png?text=CPU+Cooler";
const imgBookshelf = "https://placehold.co/400x400/f5f5f5/333333/png?text=Small+Bookshelf";

/* ─────────────── Data ─────────────── */
const newProducts = [
    { id: 1, name: "HAVIT HV-G92 Gamepad", price: "$120", oldPrice: "$160", discount: "-40%", stars: 5, reviews: 88, image: imgGamepad },
    { id: 2, name: "AK-900 Wired Keyboard", price: "$960", oldPrice: "$1160", discount: "-35%", stars: 4, reviews: 75, image: imgKeyboard, showAddToCart: true },
    { id: 3, name: "IPS LCD Gaming Monitor", price: "$370", oldPrice: "$400", discount: "-30%", stars: 5, reviews: 99, image: imgMonitor },
    { id: 4, name: "S-Series Comfort Chair", price: "$375", oldPrice: "$400", discount: "-25%", stars: 4, reviews: 99, image: imgChair },
];

const bestSelling = [
    { id: 5, name: "The north coat", price: "$260", oldPrice: "$360", stars: 5, reviews: 65, image: imgCoat },
    { id: 6, name: "Gucci duffle bag", price: "$960", oldPrice: "$1160", stars: 4, reviews: 65, image: imgBag },
    { id: 7, name: "RGB liquid CPU Cooler", price: "$160", oldPrice: "$170", stars: 4, reviews: 65, image: imgCooler },
    { id: 8, name: "Small BookSelf", price: "$360", stars: 5, reviews: 65, image: imgBookshelf },
];

/* ─────────────── Main Page ─────────────── */
export default function ECommerceHomePage() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Header />

            <main className="max-w-[1170px] mx-auto px-4">
                {/* ── New Products ── */}
                <section className="mt-20">
                    <div className="flex flex-col gap-6 mb-10">
                        <SectionTag label="This week" />
                        <h2 className="text-[36px] font-semibold tracking-wide text-black leading-[1.2]">
                            New Products
                        </h2>
                    </div>
                    <div className="grid grid-cols-4 gap-[30px]">
                        {newProducts.map((p) => (
                            <ProductCard key={p.id} {...p} />
                        ))}
                    </div>
                    <ViewAllButton />
                </section>

                {/* ── Best Selling ── */}
                <section className="mt-20 mb-20">
                    <div className="flex flex-col gap-5 mb-10">
                        <SectionTag label="This Month" />
                        <h2 className="text-[36px] font-semibold tracking-wide text-black leading-[1.2]">
                            Best Selling Products
                        </h2>
                    </div>
                    <div className="grid grid-cols-4 gap-[30px]">
                        {bestSelling.map((p) => (
                            <ProductCard key={p.id} {...p} />
                        ))}
                    </div>
                    <ViewAllButton />
                </section>
            </main>

            <Footer />
        </div>
    );
}