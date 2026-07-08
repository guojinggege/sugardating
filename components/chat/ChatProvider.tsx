"use client";
// Global Chat state — anywhere calling openChatWith(creator) triggers <ChatDrawer/>
import { createContext, useCallback, useContext, useState } from "react";

export interface ChatTarget {
  slug: string;
  name: string;
  avatar?: string;
  languages?: ("zh" | "en" | "th" | "vi" | "fil")[];
  online?: boolean;
}

interface ChatCtx {
  target: ChatTarget | null;
  open: boolean;
  openChatWith: (t: ChatTarget) => void;
  closeChat: () => void;
}

const Ctx = createContext<ChatCtx | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<ChatTarget | null>(null);
  const [open, setOpen] = useState(false);

  const openChatWith = useCallback((t: ChatTarget) => {
    setTarget(t);
    setOpen(true);
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);

  return (
    <Ctx.Provider value={{ target, open, openChatWith, closeChat }}>
      {children}
    </Ctx.Provider>
  );
}

export function useChat(): ChatCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useChat must be inside <ChatProvider>");
  return v;
}
