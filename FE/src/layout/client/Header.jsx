export default function Header() {
    return (
        <header className="w-full border-b border-gray-200 bg-white">
            <div className="max-w-[1170px] mx-auto px-4 py-5 flex items-center justify-between">
                {/* Logo + Nav */}
                <div className="flex items-center gap-40">
                    <span className="text-2xl font-bold text-black tracking-wider">Exclusive</span>
                    <nav className="flex items-center gap-12">
                        <a href="#" className="text-black text-base hover:text-[#db4444] transition-colors">Home</a>
                        <a href="#" className="text-black text-base hover:text-[#db4444] transition-colors">Products</a>
                    </nav>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    {/* Cart Icon */}
                    <button className="relative p-1 hover:opacity-70 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                    {/* User Icon */}
                    <button className="p-1 hover:opacity-70 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}
