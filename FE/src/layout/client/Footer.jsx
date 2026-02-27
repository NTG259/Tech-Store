export default function Footer() {
    return (
        <footer className="bg-black text-[#fafafa] mt-20">
            <div className="max-w-[1170px] mx-auto px-4 py-20">
                <div className="grid grid-cols-5 gap-16">
                    {/* Col 1 – Brand */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <p className="text-2xl font-bold tracking-wider mb-6">Exclusive</p>
                            <p className="text-xl mb-4">Subscribe</p>
                            <p className="text-base opacity-80">Get 10% off your first order</p>
                        </div>
                    </div>

                    {/* Col 2 – Support */}
                    <div className="flex flex-col gap-6">
                        <p className="text-xl font-medium">Support</p>
                        <div className="flex flex-col gap-4 text-base opacity-80">
                            <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
                            <p>exclusive@gmail.com</p>
                            <p>+88015-88888-9999</p>
                        </div>
                    </div>

                    {/* Col 3 – Account */}
                    <div className="flex flex-col gap-6">
                        <p className="text-xl font-medium">Account</p>
                        <div className="flex flex-col gap-4 text-base opacity-80">
                            {["My Account", "Login / Register", "Cart", "Wishlist", "Shop"].map((item) => (
                                <a key={item} href="#" className="hover:opacity-100 transition-opacity">{item}</a>
                            ))}
                        </div>
                    </div>

                    {/* Col 4 – Quick Link */}
                    <div className="flex flex-col gap-6">
                        <p className="text-xl font-medium">Quick Link</p>
                        <div className="flex flex-col gap-4 text-base opacity-80">
                            {["Privacy Policy", "Terms Of Use", "FAQ", "Contact"].map((item) => (
                                <a key={item} href="#" className="hover:opacity-100 transition-opacity">{item}</a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider + Copyright */}
                <div className="mt-16 border-t border-white border-opacity-20 pt-6 flex justify-center">
                    <div className="flex items-center gap-2 opacity-60">
                        <span className="text-base text-white">© Copyright Rimel 2022. All right reserved</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
