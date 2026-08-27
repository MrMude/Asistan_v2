import React, { useState } from "react";
import { Printer, X, Edit3, Plus, GripVertical, Edit2, Trash2, CheckSquare, Square, ArrowRight, FileText, FileUp } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { todayStr, fmtDate } from "../../utils/date";
import { KONUM_META } from "../../constants/konumMeta";
import { itemHataKodu } from "../../utils/hataKodu";
import { getAdvanceInfo } from "../../utils/vehicleFlow";
import { useAppData } from "../../context/AppDataContext";
import { EEKontrolModal } from "./EEKontrolModal";
import { FinalKontrolModal } from "./FinalKontrolModal";
import { VehicleChecklistModal } from "./VehicleChecklistModal";
import { ReworkModal } from "../common/ReworkModal";
import { Report, Vehicle, User, Uygunsuzluk, VehicleFormResult } from "../../types";

interface ReportDetailProps {
  report: Report;
  onUpdate: (report: Report) => void;
  onClose: () => void;
  currentUser: User;
  onAddUygunsuzluk?: (u: Uygunsuzluk) => void;
}

type FormTip = "ee" | "final" | "ee-fabrika" | "suruş";
const FORM_KEY_MAP: Record<FormTip, string> = { ee: "eeKontrol", final: "finalKontrol", "ee-fabrika": "eeKontrolFabrika", "suruş": "suruşTesti" };
const FORM_TITLES: Record<FormTip, string> = { ee: "Depo — EE Kontrol", final: "Depo — Final Kontrol", "ee-fabrika": "Fabrika 1 — EE Kontrol", "suruş": "Fabrika 1 — Sürüş Testi" };
const isFail = (sonuc: string) => sonuc === "NOK" || sonuc === "Uygun Değil";

export function ReportDetail({ report, onUpdate, onClose, currentUser, onAddUygunsuzluk }: ReportDetailProps) {
  const { constants } = useAppData();
  const fabrika1Stages = constants?.fabrika1Stages ?? [];
  const depoStages = constants?.depoStages ?? [];
  const aracKanbanColumns = [
    ...fabrika1Stages.map((asama) => ({ konum: "fabrika1" as const, asama })),
    ...depoStages.map((asama) => ({ konum: "depo" as const, asama })),
  ];

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(report.baslik);
  const [addingTo, setAddingTo] = useState<{ konum: "fabrika1" | "depo"; asama: string } | null>(null);
  const [vehForm, setVehForm] = useState({ no: "", detay: "", tarih: todayStr() });
  const [editingVehId, setEditingVehId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ no: "", asama: "", detay: "", tarih: "" });
  const [reworkModalFor, setReworkModalFor] = useState<string | null>(null);
  const [formModalFor, setFormModalFor] = useState<{ vehId: string; tip: FormTip } | null>(null);

  const araclar = report.araclar || [];
  const fabrikaCount = araclar.filter((a) => a.konum === "fabrika1").length;
  const depoCount = araclar.filter((a) => a.konum === "depo" && a.asama !== "Serbestlik").length;
  const serbestCount = araclar.filter((a) => a.asama === "Serbestlik").length;

  const saveTitle = () => {
    onUpdate({ ...report, baslik: titleDraft.trim() || report.baslik });
    setEditingTitle(false);
  };

  const updateMeta = (patch: Partial<Report>) => onUpdate({ ...report, ...patch });

  const openAddForm = (konum: "fabrika1" | "depo", asama: string) => {
    setVehForm({ no: "", detay: "", tarih: todayStr() });
    setAddingTo({ konum, asama });
    setEditingVehId(null);
  };

  const addVehicle = () => {
    if (!vehForm.no.trim() || !addingTo) return;
    const v: Vehicle = { id: uid(), no: vehForm.no.trim(), konum: addingTo.konum, asama: addingTo.asama, detay: vehForm.detay.trim(), tarih: vehForm.tarih, reworklar: [] };
    onUpdate({ ...report, araclar: [...araclar, v] });
    setAddingTo(null);
  };

  const openEditForm = (v: Vehicle) => {
    setEditForm({ no: v.no, asama: v.asama, detay: v.detay, tarih: v.tarih });
    setEditingVehId(v.id);
    setAddingTo(null);
  };

  const saveEdit = () => {
    onUpdate({ ...report, araclar: araclar.map((a) => (a.id === editingVehId ? { ...a, no: editForm.no.trim(), asama: editForm.asama, detay: editForm.detay.trim(), tarih: editForm.tarih } : a)) });
    setEditingVehId(null);
  };

  const removeVehicle = (id: string) => onUpdate({ ...report, araclar: araclar.filter((a) => a.id !== id) });

  const advanceVehicle = (v: Vehicle) => {
    const info = getAdvanceInfo(v, fabrika1Stages, depoStages);
    if (!info) return;
    onUpdate({ ...report, araclar: araclar.map((a) => (a.id === v.id ? { ...a, konum: info.next.konum, asama: info.next.asama, tarih: todayStr() } : a)) });
  };

  // Çek-bırak: bir araç kartı herhangi bir sütuna sürüklenip bırakılabilir —
  // ileri VEYA geri (işlemi geri almak için). "Sonraki Aşama" butonuyla
  // aynı güncellemeyi yapar, sadece hedef aşamayı kullanıcı seçer.
  const moveVehicleToColumn = (vehId: string, konum: "fabrika1" | "depo", asama: string) => {
    onUpdate({ ...report, araclar: araclar.map((a) => (a.id === vehId ? { ...a, konum, asama, tarih: todayStr() } : a)) });
  };

  const addRework = (vehId: string, { text, gorsel }: { text: string; gorsel: string | null }) => {
    if (!text.trim()) return;
    const vehicle = araclar.find((a) => a.id === vehId);
    const rwId = uid();
    onUpdate({ ...report, araclar: araclar.map((a) => (a.id === vehId ? { ...a, reworklar: [...(a.reworklar || []), { id: rwId, text: text.trim(), tarih: todayStr(), done: false, gorsel: gorsel || null }] } : a)) });
    if (onAddUygunsuzluk && vehicle) {
      onAddUygunsuzluk({
        id: uid(),
        tarih: todayStr(),
        saat: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
        yer: `${KONUM_META[vehicle.konum]?.label || vehicle.konum} — ${vehicle.asama}`,
        aracVin: vehicle.no,
        aciklama: text.trim(),
        tespitEden: currentUser?.name || "—",
        oncelik: "Orta",
        durum: "acik",
        aksiyon: "",
        kapatan: null,
        kapanmaTarihi: null,
        gorsel: gorsel || null,
        kaynakReworkId: rwId,
      });
    }
    setReworkModalFor(null);
  };

  const toggleRework = (vehId: string, rwId: string) => onUpdate({ ...report, araclar: araclar.map((a) => (a.id === vehId ? { ...a, reworklar: a.reworklar.map((r) => (r.id === rwId ? { ...r, done: !r.done } : r)) } : a)) });

  const removeRework = (vehId: string, rwId: string) => onUpdate({ ...report, araclar: araclar.map((a) => (a.id === vehId ? { ...a, reworklar: a.reworklar.filter((r) => r.id !== rwId) } : a)) });

  const saveVehicleForm = (vehId: string, tip: FormTip, data: VehicleFormResult) => {
    const vehicle = araclar.find((a) => a.id === vehId);
    const formKey = FORM_KEY_MAP[tip];
    const previousData = vehicle?.formVerisi?.[formKey];
    // Bir öncesinde de "başarısız" olan maddelerin index'lerini tutuyoruz ki
    // her yeniden kaydetmede aynı hata için tekrar tekrar uygunsuzluk kaydı
    // oluşturulmasın — sadece YENİ başarısız olan maddeler için kayıt açılır.
    const previousFailIdx = new Set((previousData?.maddeler || []).map((m, i) => (isFail(m.sonuc) ? i : null)).filter((i): i is number => i !== null));

    onUpdate({ ...report, araclar: araclar.map((a) => (a.id === vehId ? { ...a, formVerisi: { ...(a.formVerisi || {}), [formKey]: data } } : a)) });

    if (onAddUygunsuzluk && vehicle) {
      (data.maddeler || []).forEach((m, i) => {
        if (isFail(m.sonuc) && !previousFailIdx.has(i)) {
          onAddUygunsuzluk({
            id: uid(),
            tarih: data.tarih || todayStr(),
            saat: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            yer: `${FORM_TITLES[tip]}${m.section ? " / " + m.section : ""}`,
            aracVin: vehicle.no,
            aciklama: `${m.item}${m.aciklama ? " — " + m.aciklama : ""}`,
            tespitEden: (data.kontrolEden as string) || currentUser?.name || "—",
            oncelik: "Orta",
            durum: "acik",
            aksiyon: "",
            kapatan: null,
            kapanmaTarihi: null,
            gorsel: null,
            kaynakForm: tip,
            hataKodu: itemHataKodu(tip, i) || "",
          });
        }
      });
    }
  };

  const exportPdf = () => {
    const prevTitle = document.title;
    document.title = `${report.tarih}_Kalite_Guvence_Gun_Ozet_Raporu_v${report.seq}`;
    window.print();
    setTimeout(() => { document.title = prevTitle; }, 800);
  };

  const fabrikaAraclar = araclar.filter((a) => a.konum === "fabrika1");
  const depoAraclar = araclar.filter((a) => a.konum === "depo" && a.asama !== "Serbestlik");
  const serbestAraclar = araclar.filter((a) => a.asama === "Serbestlik");

  const todayISO = todayStr();
  const startOfWeekISO = (() => {
    const d = new Date();
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diff);
    return monday.toISOString().slice(0, 10);
  })();
  const releasedToday = serbestAraclar.filter((a) => a.tarih === todayISO).length;
  const releasedThisWeek = serbestAraclar.filter((a) => a.tarih >= startOfWeekISO && a.tarih <= todayISO).length;

  const printGroup = (title: string, list: Vehicle[], color: string, showDurum: boolean) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color, marginBottom: 6, borderBottom: "1px solid #ccc", paddingBottom: 4 }}>{title} ({list.length})</div>
      {list.length === 0 ? (
        <div style={{ fontSize: 11, fontStyle: "italic" }}>Kayıt yok.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Araç No</th>
              {showDurum ? <th style={styles.th}>Serbest Tarihi</th> : <th style={styles.th}>Mevcut Aşama</th>}
              <th style={styles.th}>Detay</th>
              {showDurum && <th style={styles.th}>Durum</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((v) => (
              <tr key={v.id} style={styles.tr}>
                <td style={styles.td}>Araç #{v.no}</td>
                {showDurum ? <td style={styles.td}>{fmtDate(v.tarih)}</td> : <td style={styles.td}>{v.asama}</td>}
                <td style={styles.td}>
                  {v.detay}
                  {(v.reworklar || []).length > 0 ? ` | Rework: ${v.reworklar.map((r) => (r.done ? "[✓] " : "") + r.text).join("; ")}` : ""}
                  {v.formVerisi?.eeKontrol?.doldu ? ` | EE Kontrol: ${v.formVerisi.eeKontrol.genelSonuc} (${v.formVerisi.eeKontrol.nokSayisi} NOK)` : ""}
                  {v.formVerisi?.finalKontrol?.doldu ? ` | Final Kontrol: ${v.formVerisi.finalKontrol.genelSonuc} (${v.formVerisi.finalKontrol.nokSayisi} NOK)` : ""}
                </td>
                {showDurum && <td style={styles.td}>Serbest (OK)</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderColumn = (col: { konum: "fabrika1" | "depo"; asama: string }) => {
    const colVehicles = araclar.filter((a) => a.konum === col.konum && a.asama === col.asama);
    const color = KONUM_META[col.konum].color;
    const colKey = `${col.konum}-${col.asama}`;
    return (
      <div
        key={colKey}
        style={styles.aracKanbanCol}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
        onDrop={(e) => { e.preventDefault(); const vehId = e.dataTransfer.getData("text"); if (vehId) moveVehicleToColumn(vehId, col.konum, col.asama); }}
      >
        <div style={{ ...styles.aracKanbanColHeader, borderTopColor: color }}>
          <div style={{ fontSize: 9, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>{KONUM_META[col.konum].label}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color }}>{col.asama}</span>
            <span style={styles.kanbanBadge}>{colVehicles.length}</span>
          </div>
        </div>
        <div style={styles.aracKanbanColBody}>
          <button style={styles.aracAddColBtn} onClick={() => openAddForm(col.konum, col.asama)}><Plus size={11} /> Araç Ekle</button>
          {addingTo && addingTo.konum === col.konum && addingTo.asama === col.asama && (
            <div style={styles.aracVehCard}>
              <input style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px" }} placeholder="Araç No" value={vehForm.no} onChange={(e) => setVehForm((f) => ({ ...f, no: e.target.value }))} autoFocus />
              <input style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px", marginTop: 4 }} placeholder="Detay" value={vehForm.detay} onChange={(e) => setVehForm((f) => ({ ...f, detay: e.target.value }))} />
              <input type="date" style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px", marginTop: 4 }} value={vehForm.tarih} onChange={(e) => setVehForm((f) => ({ ...f, tarih: e.target.value }))} />
              <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                <button style={{ ...styles.addInlineBtn, flex: 1, fontSize: 11 }} onClick={addVehicle}>Ekle</button>
                <button style={{ ...styles.ghostBtn, flex: 1, fontSize: 11, padding: "6px 0" }} onClick={() => setAddingTo(null)}>Vazgeç</button>
              </div>
            </div>
          )}
          {colVehicles.map((v) => {
            const advance = getAdvanceInfo(v, fabrika1Stages, depoStages);
            return editingVehId === v.id ? (
              <div key={v.id} style={styles.aracVehCard}>
                <input style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px" }} value={editForm.no} onChange={(e) => setEditForm((f) => ({ ...f, no: e.target.value }))} />
                <select style={{ ...styles.selectInput, fontSize: 11, padding: "5px 8px", marginTop: 4 }} value={editForm.asama} onChange={(e) => setEditForm((f) => ({ ...f, asama: e.target.value }))}>
                  {(v.konum === "fabrika1" ? fabrika1Stages : depoStages).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px", marginTop: 4 }} placeholder="Detay" value={editForm.detay} onChange={(e) => setEditForm((f) => ({ ...f, detay: e.target.value }))} />
                <input type="date" style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px", marginTop: 4 }} value={editForm.tarih} onChange={(e) => setEditForm((f) => ({ ...f, tarih: e.target.value }))} />
                <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                  <button style={{ ...styles.addInlineBtn, flex: 1, fontSize: 11 }} onClick={saveEdit}>Kaydet</button>
                  <button style={{ ...styles.ghostBtn, flex: 1, fontSize: 11, padding: "6px 0" }} onClick={() => setEditingVehId(null)}>Vazgeç</button>
                </div>
              </div>
            ) : (
              <div
                key={v.id}
                style={styles.aracVehCard}
                className="hover-lift"
                draggable
                onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text", v.id); }}
                title="Başka bir aşamaya sürükleyip bırakabilirsiniz"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><GripVertical size={11} color="#475569" /><span style={styles.reportRowNo}>#{v.no}</span></span>
                  <div style={{ display: "flex", gap: 5 }}>
                    <Edit2 size={11} color="#38BDF8" style={{ cursor: "pointer" }} onClick={() => openEditForm(v)} />
                    <Trash2 size={11} color="#EF4444" style={{ cursor: "pointer" }} onClick={() => removeVehicle(v.id)} />
                  </div>
                </div>
                {v.detay && <div style={{ fontSize: 11, color: "#CBD5E1", marginTop: 4 }}>{v.detay}</div>}
                <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>{fmtDate(v.tarih)}</div>
                {(v.reworklar || []).map((rw) => (
                  <div key={rw.id} style={{ fontSize: 10, marginTop: 4, display: "flex", alignItems: "flex-start", gap: 5, cursor: "pointer" }} onClick={() => toggleRework(v.id, rw.id)}>
                    {rw.done ? <CheckSquare size={11} color="#10B981" style={{ flexShrink: 0, marginTop: 1 }} /> : <Square size={11} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />}
                    {rw.gorsel && <img src={rw.gorsel} alt="Hata görseli" style={{ width: 28, height: 28, objectFit: "cover", borderRadius: 4, border: "1px solid #334155", flexShrink: 0 }} />}
                    <span style={{ color: rw.done ? "#64748B" : "#FCA5A5", textDecoration: rw.done ? "line-through" : "none", flex: 1 }}>🔧 {rw.text}</span>
                    <X size={9} style={{ cursor: "pointer", flexShrink: 0, marginTop: 2 }} onClick={(e) => { e.stopPropagation(); removeRework(v.id, rw.id); }} />
                  </div>
                ))}
                <button style={styles.aracReworkBtn} onClick={() => setReworkModalFor(v.id)}>+ Rework / Hata Bildir</button>
                {advance && (
                  <button style={styles.aracAdvanceBtn} onClick={() => advanceVehicle(v)}>{advance.label} <ArrowRight size={11} /></button>
                )}
                {!advance && v.asama === "Serbestlik" && <div style={styles.aracServeBadge}>✓ Serbest — müşteriye gidebilir</div>}

                {col.konum === "depo" && col.asama === "EE Kontrol" && (
                  v.formVerisi?.eeKontrol?.doldu ? (
                    <button style={{ ...styles.formResultBadge, borderColor: v.formVerisi.eeKontrol.genelSonuc === "Geçti" ? "#10B981" : "#EF4444", color: v.formVerisi.eeKontrol.genelSonuc === "Geçti" ? "#10B981" : "#EF4444" }} onClick={() => setFormModalFor({ vehId: v.id, tip: "ee" })}>
                      <FileText size={11} /> EE Kontrol: {v.formVerisi.eeKontrol.genelSonuc} ({v.formVerisi.eeKontrol.nokSayisi} NOK)
                    </button>
                  ) : (
                    <button style={{ ...styles.formResultBadge, borderColor: "#F59E0B", color: "#F59E0B" }} onClick={() => setFormModalFor({ vehId: v.id, tip: "ee" })}>
                      <FileUp size={11} /> EE Kontrol Formunu Doldur
                    </button>
                  )
                )}
                {col.konum === "depo" && col.asama === "Final Kontrol" && (
                  v.formVerisi?.finalKontrol?.doldu ? (
                    <button style={{ ...styles.formResultBadge, borderColor: v.formVerisi.finalKontrol.genelSonuc === "Geçti" ? "#10B981" : "#EF4444", color: v.formVerisi.finalKontrol.genelSonuc === "Geçti" ? "#10B981" : "#EF4444" }} onClick={() => setFormModalFor({ vehId: v.id, tip: "final" })}>
                      <FileText size={11} /> Final Kontrol: {v.formVerisi.finalKontrol.genelSonuc} ({v.formVerisi.finalKontrol.nokSayisi} NOK)
                    </button>
                  ) : (
                    <button style={{ ...styles.formResultBadge, borderColor: "#F59E0B", color: "#F59E0B" }} onClick={() => setFormModalFor({ vehId: v.id, tip: "final" })}>
                      <FileUp size={11} /> Final Kontrol Formunu Doldur
                    </button>
                  )
                )}
                {col.konum === "fabrika1" && col.asama === "EE Kontrol" && (
                  v.formVerisi?.eeKontrolFabrika?.doldu ? (
                    <button style={{ ...styles.formResultBadge, borderColor: v.formVerisi.eeKontrolFabrika.genelSonuc === "Geçti" ? "#10B981" : "#EF4444", color: v.formVerisi.eeKontrolFabrika.genelSonuc === "Geçti" ? "#10B981" : "#EF4444" }} onClick={() => setFormModalFor({ vehId: v.id, tip: "ee-fabrika" })}>
                      <FileText size={11} /> EE Kontrol: {v.formVerisi.eeKontrolFabrika.genelSonuc} ({v.formVerisi.eeKontrolFabrika.nokSayisi} Uygun Değil)
                    </button>
                  ) : (
                    <button style={{ ...styles.formResultBadge, borderColor: "#F59E0B", color: "#F59E0B" }} onClick={() => setFormModalFor({ vehId: v.id, tip: "ee-fabrika" })}>
                      <FileUp size={11} /> EE Kontrol Formunu Doldur
                    </button>
                  )
                )}
                {col.konum === "fabrika1" && col.asama === "Sürüş Testi" && (
                  v.formVerisi?.suruşTesti?.doldu ? (
                    <button style={{ ...styles.formResultBadge, borderColor: v.formVerisi.suruşTesti.genelSonuc === "Geçti" ? "#10B981" : "#EF4444", color: v.formVerisi.suruşTesti.genelSonuc === "Geçti" ? "#10B981" : "#EF4444" }} onClick={() => setFormModalFor({ vehId: v.id, tip: "suruş" })}>
                      <FileText size={11} /> Sürüş Testi: {v.formVerisi.suruşTesti.genelSonuc} ({v.formVerisi.suruşTesti.nokSayisi} Uygun Değil)
                    </button>
                  ) : (
                    <button style={{ ...styles.formResultBadge, borderColor: "#F59E0B", color: "#F59E0B" }} onClick={() => setFormModalFor({ vehId: v.id, tip: "suruş" })}>
                      <FileUp size={11} /> Sürüş Test Kartını Doldur
                    </button>
                  )
                )}
              </div>
            );
          })}
          {colVehicles.length === 0 && !(addingTo && addingTo.konum === col.konum && addingTo.asama === col.asama) && (
            <div style={{ fontSize: 10, color: "#475569", fontStyle: "italic", textAlign: "center", padding: "10px 0" }}>Boş</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 14, padding: 20 }} id="print-area">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          {editingTitle ? (
            <input autoFocus style={{ ...styles.mainInput, fontSize: 16, fontWeight: 800 }} value={titleDraft} onChange={(e) => setTitleDraft(e.target.value)} onBlur={saveTitle} onKeyDown={(e) => e.key === "Enter" && saveTitle()} />
          ) : (
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B", cursor: "pointer" }} onClick={() => { setTitleDraft(report.baslik); setEditingTitle(true); }} title="Düzenlemek için tıklayın">{report.baslik} <Edit3 size={13} className="no-print" style={{ opacity: 0.6 }} /></h2>
          )}
          <div style={{ display: "flex", gap: 14, marginTop: 6, flexWrap: "wrap" }} className="no-print">
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Tarih: <input type="date" style={{ ...styles.selectInput, padding: "3px 6px", fontSize: 11, width: 130 }} value={report.tarih} onChange={(e) => updateMeta({ tarih: e.target.value })} /></span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Hazırlayan: <input style={{ ...styles.selectInput, padding: "3px 6px", fontSize: 11, width: 160 }} value={report.hazirlayan} onChange={(e) => updateMeta({ hazirlayan: e.target.value })} /></span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>Bölüm: <input style={{ ...styles.selectInput, padding: "3px 6px", fontSize: 11, width: 140 }} value={report.bolum} onChange={(e) => updateMeta({ bolum: e.target.value })} /></span>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{fmtDate(report.tarih)} — v{report.seq}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }} className="no-print">
          <button style={styles.printBtn} onClick={exportPdf}><Printer size={14} /> PDF Olarak İndir</button>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
      </div>

      <div style={{ marginBottom: 10 }} className="no-print">
        <label style={styles.inputLabel}>Son Durum Özeti</label>
        <textarea
          style={{ ...styles.mainInput, minHeight: 64, resize: "vertical", fontFamily: "inherit", padding: "8px 10px" }}
          placeholder="Örn: Yeni Eklenenler: #149, #151... | Hazır Durumdakiler: ... | Rework Devam Eden: ..."
          value={report.sonDurumOzeti || ""}
          onChange={(e) => updateMeta({ sonDurumOzeti: e.target.value })}
        />
      </div>

      <div style={{ display: "flex", gap: 16 }} className="no-print">
        <div style={styles.vertStatRail}>
          <div style={styles.vertStatItem}><div style={{ ...styles.vertStatDot, background: "#94A3B8" }} /><div><div style={styles.vertStatValue}>{araclar.length}</div><div style={styles.vertStatLabel}>Toplam Araç</div></div></div>
          <div style={styles.vertStatItem}><div style={{ ...styles.vertStatDot, background: "#38BDF8" }} /><div><div style={styles.vertStatValue}>{fabrikaCount}</div><div style={styles.vertStatLabel}>Fabrika 1</div></div></div>
          <div style={styles.vertStatItem}><div style={{ ...styles.vertStatDot, background: "#F59E0B" }} /><div><div style={styles.vertStatValue}>{depoCount}</div><div style={styles.vertStatLabel}>Depodaki</div></div></div>
          <div style={styles.vertStatItem}><div style={{ ...styles.vertStatDot, background: "#10B981" }} /><div><div style={styles.vertStatValue}>{serbestCount}</div><div style={styles.vertStatLabel}>Serbest Kalan (Toplam)</div></div></div>
          <div style={{ borderTop: "1px solid #1E293B", margin: "2px 0" }} />
          <div style={styles.vertStatItem}><div style={{ ...styles.vertStatDot, background: "#34D399" }} /><div><div style={styles.vertStatValue}>{releasedToday}</div><div style={styles.vertStatLabel}>Bugün Serbest Kalan</div></div></div>
          <div style={styles.vertStatItem}><div style={{ ...styles.vertStatDot, background: "#6EE7B7" }} /><div><div style={styles.vertStatValue}>{releasedThisWeek}</div><div style={styles.vertStatLabel}>Bu Hafta Serbest Kalan</div></div></div>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={styles.kanbanRowLabel}><span style={{ color: KONUM_META.fabrika1.color }}>●</span> Fabrika 1 (Şube)</div>
            <div style={styles.aracKanbanScroll}>
              {aracKanbanColumns.filter((c) => c.konum === "fabrika1").map(renderColumn)}
            </div>
          </div>
          <div>
            <div style={styles.kanbanRowLabel}><span style={{ color: KONUM_META.depo.color }}>●</span> Depo</div>
            <div style={styles.aracKanbanScroll}>
              {aracKanbanColumns.filter((c) => c.konum === "depo").map(renderColumn)}
            </div>
          </div>
        </div>
      </div>

      {/* Sadece yazdırırken görünen sade görünüm — orijinal PDF rapor
          yapısıyla (başlık + özet sayılar + akış satırı + 3 numaralı
          bölüm) birebir aynı. */}
      <div className="print-only">
        <div style={{ fontSize: 18, fontWeight: 800, textAlign: "center", marginBottom: 4 }}>{report.baslik.toUpperCase()}</div>
        <div style={{ fontSize: 11, textAlign: "center", marginBottom: 14 }}>
          Tarih: {fmtDate(report.tarih)} | Hazırlayan: {report.hazirlayan} | Bölüm: {report.bolum}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: 11, fontWeight: 700, marginBottom: 10, flexWrap: "wrap" }}>
          <span>FABRİKA 1: {fabrikaAraclar.length} Araç</span>
          <span>DEPO (İŞLEM/TEST/KONTROL): {depoAraclar.length} Araç</span>
          <span>SERBEST BIRAKILAN: {serbestAraclar.length} Araç</span>
          <span>TOPLAM TAKİP: {araclar.length} Araç</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: 11, marginBottom: 10, flexWrap: "wrap" }}>
          <span>Bugün Serbest Kalan: {releasedToday} Araç</span>
          <span>Bu Hafta Serbest Kalan: {releasedThisWeek} Araç</span>
        </div>
        <div style={{ fontSize: 10, textAlign: "center", marginBottom: 18, fontStyle: "italic" }}>
          KALİTE KONTROL STANDART AKIŞI (Fabrika 1): {fabrika1Stages.join(" ➔ ")} ➔ Depoya Sevk<br />
          KALİTE KONTROL STANDART AKIŞI (Depo): {depoStages.join(" ➔ ")}
        </div>
        {report.sonDurumOzeti && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 4 }}>Son Durum Özeti ({fmtDate(report.tarih)})</div>
            <div style={{ fontSize: 11, whiteSpace: "pre-line" }}>{report.sonDurumOzeti}</div>
          </div>
        )}
        {printGroup("1. Fabrika 1 Araçları", fabrikaAraclar, "#0369A1", false)}
        {printGroup("2. Depodaki Araçlar (İşlem ve Rework Sürecindekiler)", depoAraclar, "#B45309", false)}
        {printGroup("3. Serbest Bırakılan Araçlar", serbestAraclar, "#047857", true)}
      </div>

      {formModalFor && formModalFor.tip === "ee" && (
        <EEKontrolModal vehicle={araclar.find((a) => a.id === formModalFor.vehId)!} onClose={() => setFormModalFor(null)} onSave={(data) => saveVehicleForm(formModalFor.vehId, "ee", data)} />
      )}
      {formModalFor && formModalFor.tip === "final" && (
        <FinalKontrolModal vehicle={araclar.find((a) => a.id === formModalFor.vehId)!} onClose={() => setFormModalFor(null)} onSave={(data) => saveVehicleForm(formModalFor.vehId, "final", data)} />
      )}
      {formModalFor && formModalFor.tip === "ee-fabrika" && (
        <VehicleChecklistModal
          vehicle={araclar.find((a) => a.id === formModalFor.vehId)!}
          title="E/E Kontrol Formu (Fabrika 1 / Şube)"
          formNo="KY.FR-18"
          sections={constants?.formTemplates.eeKontrolSubeSections ?? []}
          headerFields={[
            { key: "kontrolEden", label: "Kontrol Eden" },
            { key: "tarih", label: "Tarih", type: "date", default: todayStr() },
            { key: "vinNo", label: "VIN No" },
            { key: "uretimIsEmriNo", label: "Üretim İş Emri No" },
          ]}
          existing={araclar.find((a) => a.id === formModalFor.vehId)?.formVerisi?.eeKontrolFabrika}
          onClose={() => setFormModalFor(null)}
          onSave={(data) => saveVehicleForm(formModalFor.vehId, "ee-fabrika", data)}
        />
      )}
      {formModalFor && formModalFor.tip === "suruş" && (
        <VehicleChecklistModal
          vehicle={araclar.find((a) => a.id === formModalFor.vehId)!}
          title="EOL Sürüş Test Kartı"
          formNo="KY.FR-13"
          sections={constants?.formTemplates.suruşTestSections ?? []}
          headerFields={[
            { key: "kontrolEden", label: "Sürücü" },
            { key: "tarih", label: "Tarih", type: "date", default: todayStr() },
            { key: "vinNo", label: "VIN / Plaka" },
            { key: "baslangicSaat", label: "Başlangıç Saat", type: "time" },
            { key: "bitisSaat", label: "Bitiş Saat", type: "time" },
            { key: "socBaslangic", label: "SOC Başlangıç (%)" },
            { key: "socBitis", label: "SOC Bitiş (%)" },
            { key: "odoBaslangic", label: "Odo Başlangıç (km)" },
            { key: "odoBitis", label: "Odo Bitiş (km)" },
          ]}
          existing={araclar.find((a) => a.id === formModalFor.vehId)?.formVerisi?.suruşTesti}
          onClose={() => setFormModalFor(null)}
          onSave={(data) => saveVehicleForm(formModalFor.vehId, "suruş", data)}
        />
      )}
      {reworkModalFor && (
        <ReworkModal
          vehicle={araclar.find((a) => a.id === reworkModalFor)!}
          onClose={() => setReworkModalFor(null)}
          onSave={(data) => addRework(reworkModalFor, data)}
        />
      )}
    </div>
  );
}
