import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { ChatThread, ChatBubble, User, Task } from "../../types";

interface ChatBarProps {
  chats: ChatThread[];
  setChats: (v: ChatThread[] | ((p: ChatThread[]) => ChatThread[])) => void;
  currentUser: Pick<User, "name">;
  usersList: User[];
  tasks: Task[];
}

export function ChatBar({ chats, setChats, currentUser, usersList }: ChatBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "direct">("general");
  const [selectedTargetUser, setSelectedTargetUser] = useState<string | null>(null);
  const [msgText, setMsgText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, isOpen, activeTab, selectedTargetUser]);

  const generalChat: ChatThread = chats.find((c) => c.type === "general") || { id: "chat-genel", type: "general", title: "Genel Ekip Sohbeti", messages: [] };

  const getDirectChat = (targetName: string | null): ChatThread => {
    let found = chats.find((c) => c.type === "direct" && c.participants?.includes(currentUser.name) && c.participants?.includes(targetName ?? ""));
    if (!found) {
      found = { id: `direct-${uid()}`, type: "direct", participants: [currentUser.name, targetName ?? ""], title: targetName ?? "", messages: [] };
      setChats((prev) => [...prev, found as ChatThread]);
    }
    return found;
  };

  const currentActiveChat = activeTab === "general" ? generalChat : getDirectChat(selectedTargetUser);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: ChatBubble = { id: uid(), sender: currentUser.name, text: msgText.trim(), time: timeStr };

    if (activeTab === "general") {
      const updated = { ...generalChat, messages: [...generalChat.messages, newMsg] };
      setChats((prev) => prev.map((c) => (c.id === generalChat.id ? updated : c)));
    } else {
      const direct = getDirectChat(selectedTargetUser);
      const updated = { ...direct, messages: [...direct.messages, newMsg] };
      setChats((prev) => prev.map((c) => (c.id === direct.id ? updated : c)));
    }
    setMsgText("");
  };

  return (
    <>
      {!isOpen && (
        <button
          className="no-print"
          onClick={() => setIsOpen(true)}
          style={{ position: "fixed", bottom: 20, right: 20, background: "#F59E0B", color: "#0F172A", border: "none", borderRadius: "50%", width: 56, height: 56, boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          title="Ekip Sohbeti"
        >
          <MessageCircle size={28} />
          {generalChat.messages.length > 0 && (
            <span style={{ position: "absolute", top: 0, right: 0, background: "#EF4444", color: "#FFF", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: "50%" }}>
              {generalChat.messages.length}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className="no-print" style={{ position: "fixed", bottom: 20, right: 20, width: 360, height: 480, background: "#1E293B", border: "1px solid #F59E0B", borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", zIndex: 1001, overflow: "hidden" }}>
          <div style={{ background: "#0F172A", padding: "10px 14px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...styles.periodBtn, ...(activeTab === "general" ? styles.periodBtnActive : {}) }} onClick={() => setActiveTab("general")}>🌐 Genel</button>
              <button
                style={{ ...styles.periodBtn, ...(activeTab === "direct" ? styles.periodBtnActive : {}) }}
                onClick={() => {
                  setActiveTab("direct");
                  if (!selectedTargetUser) {
                    const first = usersList.find((u) => u.name !== currentUser.name);
                    if (first) setSelectedTargetUser(first.name);
                  }
                }}
              >
                👤 Bireysel
              </button>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}><X size={18} /></button>
          </div>

          {activeTab === "direct" && (
            <div style={{ background: "#161E2E", padding: "6px 12px", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>Kişi:</span>
              <select style={{ ...styles.selectInput, fontSize: 11, padding: "4px 8px" }} value={selectedTargetUser || ""} onChange={(e) => setSelectedTargetUser(e.target.value)}>
                {usersList.filter((u) => u.name !== currentUser.name).map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
            </div>
          )}

          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {currentActiveChat?.messages?.map((m) => {
              const isMe = m.sender === currentUser.name;
              return (
                <div key={m.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                  <div style={{ fontSize: 9, color: "#94A3B8", marginBottom: 2, textAlign: isMe ? "right" : "left" }}>{m.sender} • {m.time}</div>
                  <div style={{ background: isMe ? "#F59E0B" : "#0F172A", color: isMe ? "#0F172A" : "#F8FAFC", padding: "8px 12px", borderRadius: 10, fontSize: 12, fontWeight: isMe ? 700 : 400 }}>{m.text}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ padding: 10, background: "#0F172A", borderTop: "1px solid #334155", display: "flex", gap: 8 }}>
            <input style={{ ...styles.mainInput, fontSize: 11, padding: "8px 10px" }} placeholder="Mesaj yazın..." value={msgText} onChange={(e) => setMsgText(e.target.value)} autoFocus />
            <button type="submit" style={{ ...styles.primaryActionBtn, padding: "8px 12px" }}><Send size={14} /></button>
          </form>
        </div>
      )}
    </>
  );
}
