import React, { useState } from "react";
import { Plus, CheckSquare, Square, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { todayStr, fmtDate } from "../../utils/date";
import { Todo, User } from "../../types";

interface TodoListViewProps {
  todos: Todo[];
  setTodos: (v: Todo[] | ((p: Todo[]) => Todo[])) => void;
  currentUser: Pick<User, "name">;
}

export function TodoListView({ todos, setTodos, currentUser }: TodoListViewProps) {
  const [newText, setNewText] = useState("");
  const [priority, setPriority] = useState<Todo["priority"]>("Normal");
  const [dueDate, setDueDate] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subText, setSubText] = useState("");
  const [devText, setDevText] = useState("");

  const myTodos = todos.filter((t) => t.user === currentUser.name);
  const today = todayStr();

  const priorityColor = (p: string) => (p === "Kritik" ? "#EF4444" : p === "Yüksek" ? "#F59E0B" : "#94A3B8");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    const item: Todo = { id: uid(), user: currentUser.name, text: newText.trim(), done: false, priority, dueDate: dueDate || "", subtasks: [], developments: [] };
    setTodos([item, ...todos]);
    setNewText("");
    setDueDate("");
  };

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}>
        <div><h1 style={styles.viewTitle}>Kişisel Yapılacaklar (To-Do List)</h1><p style={styles.viewSub}>Notlarınızı, son tarihlerinizi ve ilerleme kayıtlarınızı buradan yönetin.</p></div>
      </div>

      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <form onSubmit={handleAddTodo} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input style={{ ...styles.mainInput, flex: 3, minWidth: 160 }} placeholder="Yeni yapılacak iş..." value={newText} onChange={(e) => setNewText(e.target.value)} />
          <input type="date" style={{ ...styles.selectInput, flex: 1, minWidth: 130 }} value={dueDate} onChange={(e) => setDueDate(e.target.value)} title="Son tarih (opsiyonel)" />
          <select style={{ ...styles.selectInput, flex: 1, minWidth: 110 }} value={priority} onChange={(e) => setPriority(e.target.value as Todo["priority"])}>
            <option value="Normal">Normal</option>
            <option value="Yüksek">Yüksek ⚡</option>
            <option value="Kritik">Kritik 🔥</option>
          </select>
          <button type="submit" style={styles.primaryActionBtn}><Plus size={16} /> Ekle</button>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 650, overflowY: "auto" }}>
          {myTodos.length === 0 ? <div style={{ color: "#64748B", textAlign: "center", padding: 30 }}>Henüz To-Do kaydınız yok.</div> : myTodos.map((t) => {
            const isLate = !!(t.dueDate && !t.done && t.dueDate < today);
            const isOpen = selectedId === t.id;
            return (
              <div key={t.id} style={{ background: "#0F172A", borderRadius: 10, border: isLate ? "1px solid #EF4444" : (isOpen ? "1px solid #F59E0B" : "1px solid #334155"), overflow: "hidden" }}>
                <div className="todo-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", cursor: "pointer" }} onClick={() => setSelectedId(isOpen ? null : t.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <span onClick={(e) => { e.stopPropagation(); setTodos(todos.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x))); }} style={{ display: "flex", padding: 4, margin: -4 }}>
                      {t.done ? <CheckSquare size={20} color="#10B981" /> : <Square size={20} color="#F59E0B" />}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ textDecoration: t.done ? "line-through" : "none", color: t.done ? "#64748B" : "#F8FAFC", fontSize: 13, fontWeight: 600 }}>{t.text}</span>
                      <div style={{ display: "flex", gap: 8, marginTop: 3, alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: priorityColor(t.priority) }}>{t.priority}</span>
                        {t.dueDate && <span style={{ fontSize: 10, color: isLate ? "#EF4444" : "#94A3B8" }}>📅 {fmtDate(t.dueDate)}{isLate ? " (gecikti)" : ""}</span>}
                        {(t.subtasks || []).length > 0 && <span style={{ fontSize: 10, color: "#64748B" }}>· {t.subtasks!.filter((s) => s.done).length}/{t.subtasks!.length} alt adım</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                    {isOpen ? <ChevronDown size={16} color="#F59E0B" /> : <ChevronRight size={16} color="#64748B" />}
                    <Trash2 size={14} color="#EF4444" style={{ cursor: "pointer", padding: 4, margin: -4 }} onClick={(e) => { e.stopPropagation(); setTodos(todos.filter((x) => x.id !== t.id)); }} />
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid #1E293B", marginTop: 2, paddingTop: 14 }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={styles.inputLabel}>Son Tarih</label>
                        <input type="date" style={styles.selectInput} value={t.dueDate || ""} onChange={(e) => setTodos(todos.map((x) => (x.id === t.id ? { ...x, dueDate: e.target.value } : x)))} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={styles.inputLabel}>Öncelik</label>
                        <select style={styles.selectInput} value={t.priority} onChange={(e) => setTodos(todos.map((x) => (x.id === t.id ? { ...x, priority: e.target.value as Todo["priority"] } : x)))}>
                          <option value="Normal">Normal</option>
                          <option value="Yüksek">Yüksek ⚡</option>
                          <option value="Kritik">Kritik 🔥</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ background: "#1E293B", padding: 12, borderRadius: 10 }}>
                      <label style={styles.inputLabel}>Alt Adımlar</label>
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        <input style={styles.mainInput} placeholder="Alt adım..." value={subText} onChange={(e) => setSubText(e.target.value)} />
                        <button style={styles.addInlineBtn} onClick={() => { if (!subText.trim()) return; setTodos(todos.map((x) => (x.id === t.id ? { ...x, subtasks: [...(x.subtasks || []), { id: uid(), text: subText.trim(), done: false }] } : x))); setSubText(""); }}>Ekle</button>
                      </div>
                      {(t.subtasks || []).map((s) => (
                        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", background: "#0F172A", padding: "6px 8px", borderRadius: 6, fontSize: 12, marginBottom: 4 }}>
                          <span onClick={() => setTodos(todos.map((x) => (x.id === t.id ? { ...x, subtasks: x.subtasks!.map((s2) => (s2.id === s.id ? { ...s2, done: !s2.done } : s2)) } : x)))} style={{ textDecoration: s.done ? "line-through" : "none", cursor: "pointer" }}>{s.text}</span>
                          <Trash2 size={12} color="#EF4444" style={{ cursor: "pointer" }} onClick={() => setTodos(todos.map((x) => (x.id === t.id ? { ...x, subtasks: x.subtasks!.filter((s2) => s2.id !== s.id) } : x)))} />
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "#1E293B", padding: 12, borderRadius: 10 }}>
                      <label style={styles.inputLabel}>Gelişmeler (ilerleme notları)</label>
                      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                        <input style={styles.mainInput} placeholder="Bir ilerleme notu yazın..." value={devText} onChange={(e) => setDevText(e.target.value)} />
                        <button
                          style={styles.addInlineBtn}
                          onClick={() => {
                            if (!devText.trim()) return;
                            const entry = { id: uid(), text: devText.trim(), date: new Date().toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) };
                            setTodos(todos.map((x) => (x.id === t.id ? { ...x, developments: [entry, ...(x.developments || [])] } : x)));
                            setDevText("");
                          }}
                        >
                          Ekle
                        </button>
                      </div>
                      {(t.developments || []).length === 0 && <div style={{ fontSize: 11, color: "#64748B", fontStyle: "italic" }}>Henüz gelişme notu yok.</div>}
                      {(t.developments || []).map((d) => (
                        <div key={d.id} style={{ background: "#0F172A", padding: "8px 10px", borderRadius: 6, fontSize: 12, marginBottom: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ flex: 1 }}>{d.text}</span>
                            <Trash2 size={12} color="#EF4444" style={{ cursor: "pointer", flexShrink: 0, marginTop: 2 }} onClick={() => setTodos(todos.map((x) => (x.id === t.id ? { ...x, developments: x.developments!.filter((d2) => d2.id !== d.id) } : x)))} />
                          </div>
                          <div style={{ fontSize: 10, color: "#64748B", marginTop: 3 }}>{d.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
