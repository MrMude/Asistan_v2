import React, { useState } from "react";
import { Plus, GripVertical, Edit2, Trash2, CheckSquare, Square, X, FileText, FileUp, ArrowRight } from "lucide-react";
import { styles } from "../../styles/theme";
import { uid } from "../../utils/id";
import { todayStr, fmtDate } from "../../utils/date";
import { itemHataKodu } from "../../utils/hataKodu";
import { useAppData } from "../../context/AppDataContext";
import { NoteQuickModal } from "../common/NoteQuickModal";
import { VehicleChecklistModal } from "../vehicleFlow/VehicleChecklistModal";
import { AkisData, AkisVehicle, User, Uygunsuzluk, VehicleFormResult, FormMadde } from "../../types";

interface FabrikaAkisiViewProps {
  fabrikaAkisi: AkisData;
  onUpdate: (v: AkisData) => void;
  currentUser: User;
  onAddUygunsuzluk?: (u: Uygunsuzluk) => void;
}

type FabrikaFormTip = "ee-fabrika" | "suruş";
const FORM_KEY_OF: Record<FabrikaFormTip, string> = { "ee-fabrika": "eeKontrolFabrika", "suruş": "suruşTesti" };
const FORM_TITLE_OF: Record<FabrikaFormTip, string> = { "ee-fabrika": "Fabrika Akışı — EE Kontrolleri", "suruş": "Fabrika Akışı — EOL Sürüş Testi" };
const isFail = (sonuc: string) => sonuc === "NOK" || sonuc === "Uygun Değil";

/**
 * Fabrika Kontrol — 1'den 8'e istasyon akışı. Araç Kontrol Takibi'nden
 * BAĞIMSIZ kendi veri seti (fabrikaAkisi) üzerinde çalışır; İstasyon 5 (EE
 * Kontrolleri) ve İstasyon 8 (EOL/Sürüş Testi) gerçek KY.FR-18/KY.FR-13
 * formlarını araç bazlı doldurtur.
 */
export function FabrikaAkisiView({ fabrikaAkisi, onUpdate, currentUser, onAddUygunsuzluk }: FabrikaAkisiViewProps) {
  const { constants } = useAppData();
  const stages = constants?.fabrikaKontrolItems ?? [];

  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [vehForm, setVehForm] = useState({ no: "", detay: "", tarih: todayStr() });
  const [editingVehId, setEditingVehId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ no: "", detay: "" });
  const [noteModalFor, setNoteModalFor] = useState<string | null>(null);
  const [formModalFor, setFormModalFor] = useState<{ vehId: string; tip: FabrikaFormTip } | null>(null);

  const araclar = fabrikaAkisi?.araclar || [];
  const shortLabel = (label: string) => label.replace(/^İstasyon \d+ — /, "");

  const moveVehicle = (vehId: string, istasyonId: string) => onUpdate({ ...fabrikaAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, istasyonId, tarih: todayStr() } : a)) });

  const addVehicle = () => {
    if (!vehForm.no.trim() || !addingTo) return;
    const yeni: AkisVehicle = { id: uid(), no: vehForm.no.trim(), istasyonId: addingTo, detay: vehForm.detay.trim(), tarih: vehForm.tarih, notlar: [], formVerisi: {} };
    onUpdate({ ...fabrikaAkisi, araclar: [...araclar, yeni] });
    setVehForm({ no: "", detay: "", tarih: todayStr() });
    setAddingTo(null);
  };
  const removeVehicle = (id: string) => onUpdate({ ...fabrikaAkisi, araclar: araclar.filter((a) => a.id !== id) });
  const openEditForm = (v: AkisVehicle) => { setEditingVehId(v.id); setEditForm({ no: v.no, detay: v.detay }); };
  const saveEdit = () => { onUpdate({ ...fabrikaAkisi, araclar: araclar.map((a) => (a.id === editingVehId ? { ...a, ...editForm } : a)) }); setEditingVehId(null); };

  const addNote = (vehId: string, text: string) => onUpdate({ ...fabrikaAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, notlar: [...(a.notlar || []), { id: uid(), text, tarih: todayStr(), done: false }] } : a)) });
  const toggleNote = (vehId: string, noteId: string) => onUpdate({ ...fabrikaAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, notlar: a.notlar.map((n) => (n.id === noteId ? { ...n, done: !n.done } : n)) } : a)) });
  const removeNote = (vehId: string, noteId: string) => onUpdate({ ...fabrikaAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, notlar: a.notlar.filter((n) => n.id !== noteId) } : a)) });

  const saveVehicleForm = (vehId: string, tip: FabrikaFormTip, data: VehicleFormResult) => {
    const vehicle = araclar.find((a) => a.id === vehId);
    const formKey = FORM_KEY_OF[tip];
    const previousData = vehicle?.formVerisi?.[formKey];
    const previousFailIdx = new Set((previousData?.maddeler || []).map((m: FormMadde, i: number) => (isFail(m.sonuc) ? i : null)).filter((i): i is number => i !== null));

    onUpdate({ ...fabrikaAkisi, araclar: araclar.map((a) => (a.id === vehId ? { ...a, formVerisi: { ...(a.formVerisi || {}), [formKey]: data } } : a)) });

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
        <div><h1 style={styles.viewTitle}>Fabrika Kontrol — Fabrika Araç Akışı</h1><p style={styles.viewSub}>İstasyon 1'den 8'e araç akışı — araçları sürükleyerek ilerletin, akışı aksatan bir sorun varsa not ekleyin.</p></div>
      </div>

      <div style={styles.aracKanbanScroll}>
        {stages.map((stage, idx) => {
          const stageVehicles = araclar.filter((a) => a.istasyonId === stage.id);
          const nextStage = stages[idx + 1];
          const hasForm = stage.id === "fk-ee" || stage.id === "fk-suruş";
          const formKey = stage.id === "fk-ee" ? "eeKontrolFabrika" : "suruşTesti";
          const formTip: FabrikaFormTip = stage.id === "fk-ee" ? "ee-fabrika" : "suruş";
          return (
            <div key={stage.id} style={styles.aracKanbanCol} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={(e) => { e.preventDefault(); const vehId = e.dataTransfer.getData("text"); if (vehId) moveVehicle(vehId, stage.id); }}>
              <div style={{ ...styles.aracKanbanColHeader, borderTopColor: "#38BDF8" }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#38BDF8" }}>{stage.label}</span>
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
                          <FileText size={11} /> {formTip === "ee-fabrika" ? "EE Kontrol" : "Sürüş Testi"}: {v.formVerisi[formKey].genelSonuc}
                        </button>
                      ) : (
                        <button style={{ ...styles.formResultBadge, borderColor: "#F59E0B", color: "#F59E0B" }} onClick={() => setFormModalFor({ vehId: v.id, tip: formTip })}>
                          <FileUp size={11} /> Formu Doldur
                        </button>
                      )
                    )}

                    {nextStage && (
                      <button style={styles.aracAdvanceBtn} onClick={() => moveVehicle(v.id, nextStage.id)}>{shortLabel(nextStage.label)} <ArrowRight size={11} /></button>
                    )}
                    {!nextStage && <div style={styles.aracServeBadge}>✓ Hat sonu — 8 istasyon tamamlandı</div>}
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
          onSave={(data) => { saveVehicleForm(formModalFor.vehId, "ee-fabrika", data); setFormModalFor(null); }}
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
          onSave={(data) => { saveVehicleForm(formModalFor.vehId, "suruş", data); setFormModalFor(null); }}
        />
      )}
    </div>
  );
}
