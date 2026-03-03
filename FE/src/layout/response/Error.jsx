import React from "react";
import svgPaths from "../../imports/svg-365gze3ima";
import { AnnouncementBar, StoreHeader, Breadcrumb, StoreFooter } from "../components/StoreLayout";

/* ─── Green Checkmark Circle ─── */
function CheckCircle() {
  return (
    <div className="w-[100px] h-[100px] bg-[#3ac318] rounded-full flex items-center justify-center shrink-0">
      <svg width="86" height="75" viewBox="0 0 100 89" fill="none">
        <path d={svgPaths.pfbc2480} fill="white" />
      </svg>
    </div>
  );
}

const Error = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <AnnouncementBar />
      <StoreHeader navLinks={["Home", "Products"]} />

      {/* Breadcrumb */}
      <div className="max-w-[1170px] mx-auto px-4 w-full mt-6">
        <Breadcrumb crumbs={["Home", "Order success"]} />
      </div>

      {/* ── Success Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center gap-10 py-20">
        {/* Checkmark + Success text side by side */}
        <div className="flex items-center gap-6">
          <CheckCircle />
          <h1
            className="text-black tracking-wide select-none"
            style={{ fontSize: "110px", lineHeight: "1.05", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
          >
            Success
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-base text-black">Thank iu for your order &lt;3</p>

        {/* Continue shopping button */}
        <button className="bg-[#db4444] text-white text-base px-20 py-4 rounded hover:bg-[#c03c3c] transition-colors mt-4">
          Continue shopping
        </button>
      </main>

      <StoreFooter />
    </div>
  );
}

export default Error;
