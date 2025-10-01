
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[720px] mx-auto flex flex-col gap-4 p-4">
        <header className="p-5 border border-black/10 bg-white rounded-lg shadow-md flex items-center gap-3" style={{ boxShadow: "2px 2px 6px rgba(0,0,0,0.2)" }}>
          < div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">M</div >
          <div>
            <div className="font-extrabold">User A</div>
            <div className="text-xs font-semibold">Creative Director</div>
          </div>
        </header >
      </div>
    </div >
  );
}
