import React from "react";

export default function Pagination({ current, total, onChange }) {
    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button
                onClick={() => onChange(Math.max(1, current - 1))}
                disabled={current === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors border border-transparent hover:border-gray-200"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            {Array.from({ length: total }).map((_, i) => {
                const page = i + 1;
                return (
                    <button
                        key={page}
                        onClick={() => onChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${page === current
                            ? "bg-[#db4444] text-white shadow-md"
                            : "text-black hover:bg-gray-100 border border-transparent hover:border-gray-200"
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onChange(Math.min(total, current + 1))}
                disabled={current === total}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors border border-transparent hover:border-gray-200"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
}
