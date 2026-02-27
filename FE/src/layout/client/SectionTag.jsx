export default function SectionTag({ label }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-5 h-10 bg-[#db4444] rounded" />
            <span className="text-[#db4444] text-base font-bold">{label}</span>
        </div>
    );
}
