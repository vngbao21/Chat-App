"use client";

import MessageList from "../components/MessageList";
import { ChatProvider } from "../context/ChatContext";
import Composer from "../components/Composer";


export default function Home() {
  return (
    <ChatProvider>
      <div className="h-dvh bg-gray-50 dark:bg-black/20">
        <div className="max-w-[720px] mx-auto h-full p-2 sm:p-4">
          <div className="grid grid-rows-[auto_1fr_auto] h-full border border-black/20 dark:border-white/10 shadow bg-white dark:bg-black/40">
            <header className="p-4 border-b border-black/10 dark:border-white/10 shadow-md flex items-center gap-3" style={{ boxShadow: "2px 2px 6px rgba(0,0,0,0.2)" }}>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">M</div>
              <div>
                <div className="font-extrabold">User A</div>
                <div className="text-xs font-semibold">Creative Director</div>
              </div>
            </header>
            <div className="min-h-0">
              <MessageList />
            </div>
            <div className="flex-shrink-0">
              <Composer />
            </div>

          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
