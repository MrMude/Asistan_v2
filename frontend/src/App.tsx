import React, { useEffect, useState } from "react";
import {
  ShieldCheck, LayoutDashboard, ListTodo, FileSpreadsheet, Users, Zap, Truck,
  BarChart3, AlertTriangle, AlertCircle, Lock, Bell, Key, LogOut,
} from "lucide-react";
import { styles } from "./styles/theme";
import { uid } from "./utils/id";
import { todayStr } from "./utils/date";
import { useAuth } from "./context/AuthContext";
import { useAppData } from "./context/AppDataContext";
import { usePermissions } from "./hooks/usePermissions";
import { getAllSectionIds, TOPLANTI_MODULE_IDS, UYGUNSUZLUK_YONETIMI_ITEMS } from "./constants/navigation";
import { MODULE_META } from "./constants/moduleMeta";

import { LoginScreen } from "./components/auth/LoginScreen";
import { PasswordSetupScreen } from "./components/auth/PasswordSetupScreen";
import { LockScreen } from "./components/auth/LockScreen";
import { ChangePasswordModal } from "./components/auth/ChangePasswordModal";
import { NavGroup } from "./components/layout/NavGroup";
import { NotificationsModal } from "./components/layout/NotificationsModal";
import { DashboardView } from "./components/dashboard/DashboardView";
import { DailyBriefingModal } from "./components/dashboard/DailyBriefingModal";
import { TodoListView } from "./components/todo/TodoListView";
import { KanbanBoardView } from "./components/tasks/KanbanBoardView";
import { TaskDetailModal } from "./components/tasks/TaskDetailModal";
import { ReportsView } from "./components/vehicleFlow/ReportsView";
import { FabrikaAkisiView } from "./components/fabrikaKontrol/FabrikaAkisiView";
import { DepoAkisiView } from "./components/depoKontrol/DepoAkisiView";
import { GrafikYonetimiView } from "./components/grafik/GrafikYonetimiView";
import { UygunsuzlukTakipView } from "./components/uygunsuzluk/UygunsuzlukTakipView";
import { HataKodlariView } from "./components/uygunsuzluk/HataKodlariView";
import { UygunsuzlukIstatistikView } from "./components/uygunsuzluk/UygunsuzlukIstatistikView";
import { AdminPermissionsView } from "./components/admin/AdminPermissionsView";
import { ChatBar } from "./components/chat/ChatBar";
import { Task, Uygunsuzluk } from "./types";

export default function App() {
  const { currentUser, isLocked, pendingPasswordSetupUser, error, login, setInitialPassword, unlock, logout } = useAuth();
  const {
    loaded,
    usersList, setUsersList,
    tasks, setTasks,
    todos, setTodos,
    chats, setChats,
    notifications, setNotifications,
    modules, setModules,
    reports, setReports,
    contacts, setContacts,
    uygunsuzluklar, setUygunsuzluklar,
    hataKodlari, setHataKodlari,
    fabrikaAkisi, setFabrikaAkisi,
    depoAkisi, setDepoAkisi,
  } = useAppData();
  const { hasAccess } = usePermissions();

  const [activeModule, setActiveModule] = useState("dashboard");
  const [navExpanded, setNavExpanded] = useState({ toplanti: false, uygunsuzluk: false });
  const toggleNavGroup = (key: "toplanti" | "uygunsuzluk") => setNavExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showDailyBriefing, setShowDailyBriefing] = useState(false);

  // Günün ilk girişinde bir kez gösterilecek karşılama ekranı.
  useEffect(() => {
    if (!loaded || !currentUser || isLocked) return;
    const key = `karea_daily_seen_${currentUser.username}_${todayStr()}`;
    try {
      if (!localStorage.getItem(key)) {
        setShowDailyBriefing(true);
        localStorage.setItem(key, "1");
      }
    } catch {
      /* localStorage kullanılamıyorsa günlük özet sadece bu oturumda atlanır */
    }
  }, [loaded, currentUser, isLocked]);

  const addNotification = (targetName: string, text: string) => {
    setNotifications((prev) => [{ id: uid(), user: targetName, text, date: todayStr(), read: false }, ...prev]);
  };

  // Bir göreve, kayıtlı kullanıcı olmayan biri sorumlu yapıldığında adını
  // "Kişiler" listesine ekler — böylece bir daha yazılırken öneri olarak
  // çıkar ve Admin Panel'den yönetilebilir.
  const addContactIfNew = (name: string) => {
    const n = (name || "").trim();
    if (!n) return;
    const knownUser = usersList.some((u) => u.name === n);
    const knownContact = contacts.includes(n);
    if (!knownUser && !knownContact) setContacts((prev) => [...prev, n]);
  };

  const personOptions = Array.from(new Set([...usersList.map((u) => u.name), ...contacts])).sort();

  if (!loaded) {
    return (
      <div style={{ ...styles.loginOverlay }}>
        <div style={{ color: "#94A3B8", fontSize: 13 }}>Yükleniyor…</div>
      </div>
    );
  }

  if (pendingPasswordSetupUser) {
    return <PasswordSetupScreen error={error} onSave={setInitialPassword} />;
  }

  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={login}
        onRegister={(name, username, password) => {
          setUsersList((prev) => [...prev, { id: uid(), name, username, password: password || "0000", role: "user", status: "approved" }]);
        }}
        error={error}
      />
    );
  }

  if (isLocked) {
    return <LockScreen error={error} onUnlock={unlock} onSwitchAccount={logout} />;
  }

  const myNotifications = notifications.filter((n) => n.user === currentUser.name);
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const myOpenTasks = tasks.filter((t) => t.sorumlu === currentUser.name && t.durum !== "tamam");
  const myOverdue = myOpenTasks.filter((t) => t.vade && t.vade < todayStr());
  const myUpcoming = myOpenTasks.filter((t) => t.vade && t.vade >= todayStr() && t.vade <= new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));

  const onAddUygunsuzluk = (u: Uygunsuzluk) => setUygunsuzluklar((prev) => [u, ...prev]);

  return (
    <div style={styles.appShell}>
      <aside style={styles.sidebar} className="no-print">
        <div style={styles.sidebarBrand}>
          <div style={styles.logoIcon}><ShieldCheck size={22} color="#F59E0B" /></div>
          <div><div style={styles.brandName}>Karea Asistan</div><div style={styles.brandSub}>Süreç & Yetki Yönetimi</div></div>
        </div>

        <nav style={styles.navTabs}>
          {hasAccess("dashboard") && (
            <button style={{ ...styles.navTab, ...(activeModule === "dashboard" ? styles.navTabActive : {}) }} onClick={() => setActiveModule("dashboard")}><LayoutDashboard size={15} color="#F59E0B" /><span>Dashboard</span></button>
          )}
          {hasAccess("todo") && (
            <button style={{ ...styles.navTab, ...(activeModule === "todo" ? styles.navTabActive : {}) }} onClick={() => setActiveModule("todo")}><ListTodo size={15} color="#F59E0B" /><span>To-Do List</span></button>
          )}
          {hasAccess("raporlar") && (
            <button style={{ ...styles.navTab, ...(activeModule === "raporlar" ? styles.navTabActive : {}) }} onClick={() => setActiveModule("raporlar")}><FileSpreadsheet size={15} color="#10B981" /><span>Araç Kontrol Takibi</span></button>
          )}
          <div style={styles.navDivider} />

          {modules.filter((m) => !TOPLANTI_MODULE_IDS.includes(m.id) && hasAccess(m.id)).map((m) => {
            const Icon = MODULE_META[m.id]?.icon || ShieldCheck;
            const modColor = MODULE_META[m.id]?.color || "#94A3B8";
            const isActive = activeModule === m.id;
            return (
              <button key={m.id} style={{ ...styles.navTab, ...(isActive ? styles.navTabActive : {}) }} onClick={() => setActiveModule(m.id)}>
                <Icon size={15} color={isActive ? "#F59E0B" : modColor} /><span>{m.label}</span>
              </button>
            );
          })}

          {modules.some((m) => TOPLANTI_MODULE_IDS.includes(m.id) && hasAccess(m.id)) && (
            <NavGroup label="Toplantı Yönetimi" icon={Users} isOpen={navExpanded.toplanti} onToggle={() => toggleNavGroup("toplanti")}>
              {modules.filter((m) => TOPLANTI_MODULE_IDS.includes(m.id) && hasAccess(m.id)).map((m) => {
                const Icon = MODULE_META[m.id]?.icon || ShieldCheck;
                const modColor = MODULE_META[m.id]?.color || "#94A3B8";
                const isActive = activeModule === m.id;
                return (
                  <button key={m.id} style={{ ...styles.navSubTab, ...(isActive ? styles.navTabActive : {}) }} onClick={() => setActiveModule(m.id)}>
                    <Icon size={13} color={isActive ? "#F59E0B" : modColor} /><span>{m.label}</span>
                  </button>
                );
              })}
            </NavGroup>
          )}

          {hasAccess("fabrika_kontrol_akis") && (
            <button style={{ ...styles.navTab, ...(activeModule === "fabrika_kontrol_akis" ? styles.navTabActive : {}) }} onClick={() => setActiveModule("fabrika_kontrol_akis")}><Zap size={15} color="#38BDF8" /><span>Fabrika Kontrol</span></button>
          )}
          {hasAccess("depo_kontrol_akis") && (
            <button style={{ ...styles.navTab, ...(activeModule === "depo_kontrol_akis" ? styles.navTabActive : {}) }} onClick={() => setActiveModule("depo_kontrol_akis")}><Truck size={15} color="#F59E0B" /><span>Depo Kontrol</span></button>
          )}

          <div style={styles.navDivider} />
          {hasAccess("grafik_yonetimi") && (
            <button style={{ ...styles.navTab, ...(activeModule === "grafik_yonetimi" ? styles.navTabActive : {}) }} onClick={() => setActiveModule("grafik_yonetimi")}><BarChart3 size={15} color="#38BDF8" /><span>Grafik Yönetimi</span></button>
          )}
          {UYGUNSUZLUK_YONETIMI_ITEMS.some((i) => hasAccess(i.id)) && (
            <NavGroup label="Uygunsuzluk Yönetimi" icon={AlertTriangle} isOpen={navExpanded.uygunsuzluk} onToggle={() => toggleNavGroup("uygunsuzluk")}>
              {UYGUNSUZLUK_YONETIMI_ITEMS.filter((i) => hasAccess(i.id)).map((item) => {
                const Icon = item.id === "uygunsuzluk_hata_kodlari" ? AlertCircle : item.id === "uygunsuzluk_istatistik" ? BarChart3 : AlertTriangle;
                return (
                  <button key={item.id} style={{ ...styles.navSubTab, ...(activeModule === item.id ? styles.navTabActive : {}) }} onClick={() => setActiveModule(item.id)}>
                    <Icon size={13} color={activeModule === item.id ? "#F59E0B" : "#94A3B8"} /><span>{item.label}</span>
                  </button>
                );
              })}
            </NavGroup>
          )}
          {currentUser.role === "admin" && (
            <button style={{ ...styles.navTab, ...(activeModule === "admin_panel" ? styles.navTabAdminActive : {}) }} onClick={() => setActiveModule("admin_panel")}><Lock size={15} color="#EF4444" /><span>Admin Panel</span></button>
          )}
        </nav>

        <div style={styles.sidebarFooter}>
          <button style={styles.notificationBellBtn} onClick={() => setShowNotificationsModal(true)} title="Bildirimler">
            <Bell size={16} color="#F59E0B" /> <span style={{ fontSize: 12 }}>Bildirimler</span>{unreadCount > 0 && <span style={styles.notificationBadge}>{unreadCount}</span>}
          </button>
          <div style={styles.userProfileBar}>
            <div style={styles.userAvatar}>{currentUser.name.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...styles.userName, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.name}</div>
              <div style={styles.userRoleTag}>{currentUser.role === "admin" ? "🔑 Admin" : "👤 Kullanıcı"}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <button style={styles.actionSmallBtn} onClick={() => setShowPasswordModal(true)} title="Şifre Değiştir"><Key size={14} color="#38BDF8" /></button>
              <button style={styles.actionSmallBtn} onClick={logout} title="Çıkış Yap"><LogOut size={14} color="#EF4444" /></button>
            </div>
          </div>
        </div>
      </aside>

      <main style={styles.mainContent}>
        {getAllSectionIds(modules).includes(activeModule) && !hasAccess(activeModule) ? (
          <div style={styles.unauthorizedBox}><Lock size={40} color="#EF4444" /><h2>Bu sekme için yetkiniz yok</h2><p style={{ fontSize: 12, color: "#64748B" }}>Erişim için admin ile görüşün.</p></div>
        ) : activeModule === "dashboard" ? (
          <DashboardView tasks={tasks} modules={modules} reports={reports} currentUser={currentUser} onOpenDetail={setSelectedTask} onNavigateModule={setActiveModule} />
        ) : activeModule === "todo" ? (
          <TodoListView todos={todos} setTodos={setTodos} currentUser={currentUser} />
        ) : activeModule === "raporlar" ? (
          <ReportsView reports={reports} setReports={setReports} currentUser={currentUser} onAddUygunsuzluk={onAddUygunsuzluk} />
        ) : activeModule === "grafik_yonetimi" ? (
          <GrafikYonetimiView tasks={tasks} />
        ) : activeModule === "uygunsuzluk_liste" ? (
          <UygunsuzlukTakipView uygunsuzluklar={uygunsuzluklar} setUygunsuzluklar={setUygunsuzluklar} currentUser={currentUser} hataKodlari={hataKodlari} />
        ) : activeModule === "uygunsuzluk_hata_kodlari" ? (
          <HataKodlariView hataKodlari={hataKodlari} setHataKodlari={setHataKodlari} />
        ) : activeModule === "uygunsuzluk_istatistik" ? (
          <UygunsuzlukIstatistikView uygunsuzluklar={uygunsuzluklar} />
        ) : activeModule === "admin_panel" ? (
          currentUser.role === "admin" ? (
            <AdminPermissionsView usersList={usersList} setUsersList={setUsersList} modules={modules} setModules={setModules} contacts={contacts} setContacts={setContacts} />
          ) : (
            <div style={styles.unauthorizedBox}><Lock size={40} color="#EF4444" /><h2>Yetkiniz Yok</h2></div>
          )
        ) : activeModule === "fabrika_kontrol_akis" ? (
          <FabrikaAkisiView fabrikaAkisi={fabrikaAkisi} onUpdate={setFabrikaAkisi} currentUser={currentUser} onAddUygunsuzluk={onAddUygunsuzluk} />
        ) : activeModule === "depo_kontrol_akis" ? (
          <DepoAkisiView depoAkisi={depoAkisi} onUpdate={setDepoAkisi} currentUser={currentUser} onAddUygunsuzluk={onAddUygunsuzluk} />
        ) : modules.some((m) => m.id === activeModule) ? (
          <KanbanBoardView
            activeModule={activeModule}
            modules={modules}
            tasks={tasks.filter((t) => t.module === activeModule)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentUser={currentUser}
            onOpenDetail={setSelectedTask}
            onMoveStage={(id, st) => setTasks(tasks.map((t) => (t.id === id ? { ...t, durum: st as Task["durum"], bitisTarihi: st === "tamam" ? todayStr() : t.bitisTarihi } : t)))}
            onCreateTask={(tData) => {
              const newId = uid();
              const prefix = (tData.module || "ask").substring(0, 3).toUpperCase();
              const newTask: Task = {
                id: newId, module: tData.module || "asakai", kod: `${prefix}-2026-${(tasks.length + 1).toString().padStart(3, "0")}`,
                baslik: tData.baslik, sorumlu: tData.sorumlu || currentUser.name, gorevTipi: "bireysel",
                ekipUyeleri: tData.ekipUyeleri || [], acilisTarihi: todayStr(), vade: tData.vade || todayStr(),
                bitisTarihi: "", durum: "acik", oncelik: "Orta", subtasks: [],
              };
              setTasks((prev) => [...prev, newTask]);
              addContactIfNew(newTask.sorumlu);
              newTask.ekipUyeleri.forEach(addContactIfNew);
              addNotification(newTask.sorumlu, `Yeni görev atandı: ${newTask.baslik}`);
            }}
            onDeleteTask={(id) => setTasks(tasks.filter((t) => t.id !== id))}
            usersList={usersList}
            contacts={contacts}
            personOptions={personOptions}
          />
        ) : (
          <DashboardView tasks={tasks} modules={modules} reports={reports} currentUser={currentUser} onOpenDetail={setSelectedTask} onNavigateModule={setActiveModule} />
        )}
      </main>

      <ChatBar chats={chats} setChats={setChats} currentUser={currentUser} usersList={usersList} tasks={tasks} />

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          currentUser={currentUser}
          usersList={usersList}
          contacts={contacts}
          personOptions={personOptions}
          onClose={() => setSelectedTask(null)}
          onSaveTask={(updated) => {
            setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
            addContactIfNew(updated.sorumlu);
            (updated.ekipUyeleri || []).forEach(addContactIfNew);
          }}
          onDeleteTask={(id) => setTasks(tasks.filter((t) => t.id !== id))}
        />
      )}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} onSave={(newPassword) => setUsersList(usersList.map((u) => (u.id === currentUser.id ? { ...u, password: newPassword } : u)))} />
      )}
      {showNotificationsModal && (
        <NotificationsModal notifications={myNotifications} onClose={() => setShowNotificationsModal(false)} onMarkAllRead={() => setNotifications(notifications.map((n) => (n.user === currentUser.name ? { ...n, read: true } : n)))} />
      )}
      {showDailyBriefing && <DailyBriefingModal currentUser={currentUser} overdue={myOverdue} upcoming={myUpcoming} onClose={() => setShowDailyBriefing(false)} />}
    </div>
  );
}
