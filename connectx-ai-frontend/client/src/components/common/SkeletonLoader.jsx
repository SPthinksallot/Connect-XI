import React from "react";

export function ChatListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4 border-b border-[#E9E6DF] dark:border-[#2A2F45]">
          <div className="w-12 h-12 rounded-full skeleton shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 skeleton rounded-md" />
              <div className="h-3 w-12 skeleton rounded-md" />
            </div>
            <div className="h-3.5 w-3/4 skeleton rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MessageSkeleton({ isMine }) {
  return (
    <div className={`flex flex-col gap-1 mb-4 ${isMine ? "items-end" : "items-start"}`}>
      <div
        className={`h-10 skeleton rounded-2xl ${
          isMine ? "w-[200px] rounded-br-sm" : "w-[240px] rounded-bl-sm"
        }`}
      />
    </div>
  );
}
