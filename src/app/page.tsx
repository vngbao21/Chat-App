"use client";

import MessageList from "../components/MessageList";
import { ChatProvider } from "../context/ChatContext";


export default function Home() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[720px] mx-auto p-4">
          <div className="flex flex-col border border-black/20 min-h-[560px]">
            <header className="p-4 border-b border-black/10 bg-white shadow-md flex items-center gap-3" style={{ boxShadow: "2px 2px 6px rgba(0,0,0,0.2)" }}>
              < div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">M</div >
              <div>
                <div className="font-extrabold">User A</div>
                <div className="text-xs font-semibold">Creative Director</div>
              </div>
            </header >
            <MessageList />
          </div>
        </div>
      </div >
    </ChatProvider>
  );
}
