import React, { useState } from "react";
import { Plus, GripVertical, Edit2, Trash2, CheckSquare, Square, X, FileText, FileUp, ArrowRight } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { todayStr, fmtDate } from "../../utils/date";
import { itemHataKodu } from "../../utils/hataKodu";
import { useAppData } from "../../context/AppDataContext";
import { NoteQuickModal } from "../common/NoteQuickModal";
import { EEKontrolModal } from "../vehicleFlow/EEKontrolModal";
import { FinalKontrolModal } from "../vehicleFlow/FinalKontrolModal";
import { AkisData, AkisVehicle, User, Uygunsuzluk, VehicleFormResult, FormMadde } from "../../types";

interface DepoAkisiViewProps {
  depoAkisi: AkisData;
  onUpdate: (v: AkisData) => void;
  currentUser: User;
  onAddUygunsuzluk?: (u: Uygunsuzluk) => void;
}

type DepoFormTip = "ee" | "final";
const FORM_KEY_OF: Record<DepoFormTip, string> = { ee: "eeKontrol", final: "finalKontrol" };
const FORM_TITLE_OF: Record<DepoFormTip, string> = { ee: "Depo Akışı — EE Kontrol", final: "Depo Akışı — Final Kontrol" };
const isFail = (sonuc: string) => sonuc === "NOK" || sonuc === "Uygun Değil";

/**
 * Depo Kontrol — Sürüş Testi → Sızdırmazlık Testi → EE Kontrol → Final
 * Kontrol akışı. Araç Kontrol Takibi'nden BAĞIMSIZ kendi veri seti
 * (depoAkisi) üzerinde çalışır; EE Kontrol ve Final Kontrol gerçek
 * KY.FR-17/KY.FR-19 formlarını araç bazlı doldurtur.
 */
export function DepoAkisiView({ depoAkisi, onUpdate, currentUser, onAddUygunsuzluk }: DepoAkisiViewProps) {
  const { constants } = useAppData();
  const stages = constants?.depoKontrolItems ?? [];

  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [vehForm, setVehForm] = useState({ no: "", detay: "", tarih: todayStr() });
  const [editingVehId, setEditingVehId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ no: "", detay: "" });
  const [noteModalFor, setNoteModalFor] = useState<string | null>(null);
  const [formModalFor, setFormModalFor] = useState<{ vehId: string; tip: DepoFormTip } | null>(null);

  const araclar = depoAkisi?.araclar || [];

  const moveVehicle = (vehId: string, istasyonId: string) => onUpdate({ ...depoAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, istasyonId, tarih: todayStr() } : a)) });

  const addVehicle = () => {
    if (!vehForm.no.trim() || !addingTo) return;
    const yeni: AkisVehicle = { id: uid(), no: vehForm.no.trim(), istasyonId: addingTo, detay: vehForm.detay.trim(), tarih: vehForm.tarih, notlar: [], formVerisi: {} };
    onUpdate({ ...depoAkisi, araclar: [...araclar, yeni] });
    setVehForm({ no: "", detay: "", tarih: todayStr() });
    setAddingTo(null);
  };
  const removeVehicle = (id: string) => onUpdate({ ...depoAkisi, araclar: araclar.filter((a) => a.id !== id) });
  const openEditForm = (v: AkisVehicle) => { setEditingVehId(v.id); setEditForm({ no: v.no, detay: v.detay }); };
  const saveEdit = () => { onUpdate({ ...depoAkisi, araclar: araclar.map((a) => (a.id === editingVehId ? { ...a, ...editForm } : a)) }); setEditingVehId(null); };

  const addNote = (vehId: string, text: string) => onUpdate({ ...depoAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, notlar: [...(a.notlar || []), { id: uid(), text, tarih: todayStr(), done: false }] } : a)) });
  const toggleNote = (vehId: string, noteId: string) => onUpdate({ ...depoAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, notlar: a.notlar.map((n) => (n.id === noteId ? { ...n, done: !n.done } : n)) } : a)) });
  const removeNote = (vehId: string, noteId: string) => onUpdate({ ...depoAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, notlar: a.notlar.filter((n) => n.id !== noteId) } : a)) });

  const saveVehicleForm = (vehId: string, tip: DepoFormTip, data: VehicleFormResult) => {
    const vehicle = araclar.find((a) => a.id === vehId);
    const formKey = FORM_KEY_OF[tip];
    const previousData = vehicle?.formVerisi?.[formKey];
    const previousFailIdx = new Set((previousData?.maddeler || []).map((m: FormMadde, i: number) => (isFail(m.sonuc) ? i : null)).filter((i): i is number => i !== null));

    onUpdate({ ...depoAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, formVerisi: { ...(a.formVerisi || {}), [formKey]: data } } : a)) });

    if (onAddUygunsuzluk && vehicle) {
      (data.maddeler || []).forEach((m, i) => {
        if (isFail(m.sonuc) && !previousFailIdx.has(i)) {
          onAddUygunsuzluk({
            id: uid(),
            tarih: data.tarih || todayStr(),
            saat: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
            yer: `${FORM_TITLE_OF[tip]}${m.section ? " / " + m.section : ""}`,
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

  return (
    <div style={styles.viewContainer}>
      <div style={styles.yearEndHeader}>
        <div><h1 style={styles.viewTitle}>Depo Kontrol — Depo Araç Akışı</h1><p style={styles.viewSub}>Sürüş Testi'nden Final Kontrol'e depo akışı — araçları sürükleyerek ilerletin, akışı aksatan bir sorun varsa not ekleyin.</p></div>
      </div>

      <div style={styles.aracKanbanScroll}>
        {stages.map((stage, idx) => {
          const stageVehicles = araclar.filter((a) => a.istasyonId === stage.id);
          const nextStage = stages[idx + 1];
          const hasForm = stage.id === "dk-ee" || stage.id === "dk-final";
          const formKey = stage.id === "dk-ee" ? "eeKontrol" : "finalKontrol";
          const formTip: DepoFormTip = stage.id === "dk-ee" ? "ee" : "final";
          return (
            <div key={stage.id} style={styles.aracKanbanCol} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={(e) => { e.preventDefault(); const vehId = e.dataTransfer.getData("text"); if (vehId) moveVehicle(vehId, stage.id); }}>
              <div style={{ ...styles.aracKanbanColHeader, borderTopColor: "#F59E0B" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#F59E0B" }}>{stage.label}</span>
                <span style={styles.kanbanBadge}>{stageVehicles.length}</span>
              </div>
              <div style={styles.aracKanbanColBody}>
                <button style={styles.aracAddColBtn} onClick={() => setAddingTo(stage.id)}><Plus size={11} /> Araç Ekle</button>
                {addingTo === stage.id && (
                  <div style={styles.aracVehCard}>
                    <input style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px" }} placeholder="Araç No" value={vehForm.no} onChange={(e) => setVehForm((f) => ({ ...f, no: e.target.value }))} autoFocus />
                    <input style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px", marginTop: 4 }} placeholder="Detay" value={vehForm.detay} onChange={(e) => setVehForm((f) => ({ ...f, detay: e.target.value }))} />
                    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                      <button style={{ ...styles.addInlineBtn, flex: 1, fontSize: 11 }} onClick={addVehicle}>Ekle</button>
                      <button style={{ ...styles.ghostBtn, flex: 1, fontSize: 11, padding: "6px 0" }} onClick={() => setAddingTo(null)}>Vazgeç</button>
                    </div>
                  </div>
                )}
                {stageVehicles.map((v) => (editingVehId === v.id ? (
                  <div key={v.id} style={styles.aracVehCard}>
                    <input style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px" }} value={editForm.no} onChange={(e) => setEditForm((f) => ({ ...f, no: e.target.value }))} />
                    <input style={{ ...styles.mainInput, fontSize: 11, padding: "5px 8px", marginTop: 4 }} value={editForm.detay} onChange={(e) => setEditForm((f) => ({ ...f, detay: e.target.value }))} />
                    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                      <button style={{ ...styles.addInlineBtn, flex: 1, fontSize: 11 }} onClick={saveEdit}>Kaydet</button>
                      <button style={{ ...styles.ghostBtn, flex: 1, fontSize: 11, padding: "6px 0" }} onClick={() => setEditingVehId(null)}>Vazgeç</button>
                    </div>
                  </div>
                ) : (
                  <div key={v.id} style={styles.aracVehCard} className="hover-lift" draggable onDragStart={(e) => { e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text", v.id); }} title="Başka bir istasyona sürükleyip bırakabilirsiniz">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><GripVertical size={11} color="#475569" /><span style={styles.reportRowNo}>#{v.no}</span></span>
                      <div style={{ display: "flex", gap: 5 }}>
                        <Edit2 size={11} color="#38BDF8" style={{ cursor: "pointer" }} onClick={() => openEditForm(v)} />
                        <Trash2 size={11} color="#EF4444" style={{ cursor: "pointer" }} onClick={() => removeVehicle(v.id)} />
                      </div>
                    </div>
                    {v.detay && <div style={{ fontSize: 11, color: "#CBD5E1", marginTop: 4 }}>{v.detay}</div>}
                    <div style={{ fontSize: 10, color: "#64748B", marginTop: 4 }}>{fmtDate(v.tarih)}</div>
                    {(v.notlar || []).map((n) => (
                      <div key={n.id} style={{ fontSize: 10, marginTop: 4, display: "flex", alignItems: "flex-start", gap: 5, cursor: "pointer" }} onClick={() => toggleNote(v.id, n.id)}>
                        {n.done ? <CheckSquare size={11} color="#10B981" style={{ flexShrink: 0, marginTop: 1 }} /> : <Square size={11} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />}
                        <span style={{ color: n.done ? "#64748B" : "#FCA5A5", textDecoration: n.done ? "line-through" : "none", flex: 1 }}>⚠️ {n.text}</span>
                        <X size={9} style={{ cursor: "pointer", flexShrink: 0, marginTop: 2 }} onClick={(e) => { e.stopPropagation(); removeNote(v.id, n.id); }} />
                      </div>
                    ))}
                    <button style={styles.aracReworkBtn} onClick={() => setNoteModalFor(v.id)}>+ Not / Sorun Ekle</button>

                    {hasForm && (
                      v.formVerisi?.[formKey]?.doldu ? (
                        <button style={{ ...styles.formResultBadge, borderColor: v.formVerisi[formKey].genelSonuc === "Geçti" ? "#10B981" : "#EF4444", color: v.formVerisi[formKey].genelSonuc === "Geçti" ? "#10B981" : "#EF4444" }} onClick={() => setFormModalFor({ vehId: v.id, tip: formTip })}>
                          <FileText size={11} /> {formTip === "ee" ? "EE Kontrol" : "Final Kontrol"}: {v.formVerisi[formKey].genelSonuc}
                        </button>
                      ) : (
                        <button style={{ ...styles.formResultBadge, borderColor: "#F59E0B", color: "#F59E0B" }} onClick={() => setFormModalFor({ vehId: v.id, tip: formTip })}>
                          <FileUp size={11} /> Formu Doldur
                        </button>
                      )
                    )}

                    {nextStage && (
                      <button style={styles.aracAdvanceBtn} onClick={() => moveVehicle(v.id, nextStage.id)}>{nextStage.label} <ArrowRight size={11} /></button>
                    )}
                    {!nextStage && <div style={styles.aracServeBadge}>✓ Depo akışı tamamlandı</div>}
                  </div>
                )))}
                {stageVehicles.length === 0 && addingTo !== stage.id && <div style={{ fontSize: 10, color: "#475569", fontStyle: "italic", textAlign: "center", padding: "10px 0" }}>Boş</div>}
              </div>
            </div>
          );
        })}
      </div>

      {noteModalFor && (
        <NoteQuickModal vehicleNo={araclar.find((a) => a.id === noteModalFor)?.no} onClose={() => setNoteModalFor(null)} onSave={(text) => { addNote(noteModalFor, text); setNoteModalFor(null); }} />
      )}

      {formModalFor && formModalFor.tip === "ee" && (
        <EEKontrolModal
          vehicle={araclar.find((a) => a.id === formModalFor.vehId)!}
          onClose={() => setFormModalFor(null)}
          onSave={(data) => { saveVehicleForm(formModalFor.vehId, "ee", data); setFormModalFor(null); }}
        />
      )}
      {formModalFor && formModalFor.tip === "final" && (
        <FinalKontrolModal
          vehicle={araclar.find((a) => a.id === formModalFor.vehId)!}
          onClose={() => setFormModalFor(null)}
          onSave={(data) => { saveVehicleForm(formModalFor.vehId, "final", data); setFormModalFor(null); }}
        />
      )}
    </div>
  );
}
