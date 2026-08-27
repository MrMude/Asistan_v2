import React, { useState } from "react";
import { Plus, Search, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";
import { styles } from "../../styles/theme";
import { todayStr, fmtDate } from "../../utils/date";
import { MODULE_META } from "../../constants/moduleMeta";
import { useAppData } from "../../context/AppDataContext";
import { CreateTaskModal, NewTaskInput } from "./CreateTaskModal";
import { Task, AppModule, User } from "../../types";

interface KanbanBoardViewProps {
  activeModule: string;
  modules: AppModule[];
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  currentUser: User;
  onOpenDetail: (task: Task) => void;
  onMoveStage: (taskId: string, stageId: string) => void;
  onCreateTask: (input: NewTaskInput) => void;
  onDeleteTask: (id: string) => void;
  usersList: User[];
  contacts: string[];
  personOptions: string[];
}

export function KanbanBoardView({
  activeModule, modules, tasks, searchQuery, setSearchQuery, currentUser,
  onOpenDetail, onMoveStage, onCreateTask, onDeleteTask, usersList, contacts, personOptions,
}: KanbanBoardViewProps) {
  const { constants } = useAppData();
  const kanbanStages = constants?.kanbanStages ?? [];
  const [showModal, setShowModal] = useState(false);
  const currentModObj = modules.find((m) => m.id === activeModule) || modules[0];
  const CurrentModIcon = MODULE_META[currentModObj.id]?.icon || ShieldCheck;
  const currentModColor = MODULE_META[currentModObj.id]?.color || "#94A3B8";
  const filtered = tasks.filter(
    (t) => t.baslik.toLowerCase().includes(searchQuery.toLowerCase()) || (t.etiketler || []).some((e) => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><CurrentModIcon size={24} color={currentModColor} /><h1 style={styles.viewTitle}>{currentModObj.label}</h1></div>
        <button style={styles.primaryActionBtn} onClick={() => setShowModal(true)}><Plus size={16} /> Görev Ekle</button>
      </div>
      <div style={styles.filterToolbar}>
        <div style={styles.searchWrapper}><Search size={15} color="#F59E0B" /><input style={styles.searchInput} placeholder="Ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
      </div>
      <div style={styles.kanbanGrid}>
        {kanbanStages.map((stage) => {
          const stageTasks = filtered.filter((t) => t.durum === stage.id);
          return (
            <div key={stage.id} style={styles.kanbanColumn} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData("text"); if (id) onMoveStage(id, stage.id); }}>
              <div style={{ ...styles.kanbanColumnHeader, borderTopColor: stage.color }}><span style={{ fontWeight: 800, fontSize: 13, color: stage.color }}>{stage.label}</span><span style={styles.kanbanBadge}>{stageTasks.length}</span></div>
              <div style={styles.kanbanCardsList}>
                {stageTasks.map((task) => {
                  const isOverdue = task.durum !== "tamam" && !!task.vade && task.vade < todayStr();
                  return (
                    <div key={task.id} style={{ ...styles.kanbanCard, ...(isOverdue ? { borderColor: "#EF4444" } : {}) }} className="hover-lift" draggable onDragStart={(e) => e.dataTransfer.setData("text", task.id)}>
                      <div style={styles.cardHeaderRow}><span style={styles.taskCodeBadge}>{task.kod}</span><button style={styles.deleteIconBtn} onClick={() => onDeleteTask(task.id)}><Trash2 size={12} /></button></div>
                      <div style={styles.kanbanCardTitle} onClick={() => onOpenDetail(task)}>{task.baslik}</div>
                      {(task.etiketler || []).length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                          {task.etiketler!.map((e) => <span key={e} style={styles.keywordChip}>#{e}</span>)}
                        </div>
                      )}
                      <div style={styles.kanbanCardFooter}>
                        <span>👤 {task.sorumlu}{(task.ekipUyeleri || []).length > 0 ? ` +${task.ekipUyeleri.length}` : ""}</span>
                        <span style={isOverdue ? { color: "#EF4444", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 } : {}}>{isOverdue && <AlertTriangle size={11} />} 📅 {fmtDate(task.vade)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {showModal && <CreateTaskModal activeModule={activeModule} usersList={usersList} contacts={contacts} personOptions={personOptions} currentUser={currentUser} onClose={() => setShowModal(false)} onCreate={onCreateTask} />}
    </div>
  );
}
