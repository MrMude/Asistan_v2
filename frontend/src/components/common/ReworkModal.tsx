import React, { useRef, useState } from "react";
import { X, FileUp } from "lucide-react";
import { styles } from "../../styles/theme";

interface ReworkModalProps {
  vehicle: { no: string };
  onClose: () => void;
  onSave: (data: { text: string; gorsel: string | null }) => void;
}

/**
 * Rework / hata bildirimi — açıklama + opsiyonel görsel (yüklenirken
 * otomatik olarak küçültülüp sıkıştırılır, ~480px genişliğe kadar).
 * Kaydedilen kayıt, çağıran ekran tarafından Uygunsuzluk Yönetimi'ne de
 * otomatik olarak yansıtılır (bkz. ReportDetail/FabrikaAkisiView/DepoAkisiView).
 */
export function ReworkModal({ vehicle, onClose, onSave }: ReworkModalProps) {
  const [text, setText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 480;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) { height = Math.round(height * (maxDim / width)); width = maxDim; }
        else if (height > maxDim) { width = Math.round(width * (maxDim / height)); height = maxDim; }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        setImageDataUrl(canvas.toDataURL("image/jpeg", 0.7));
        setProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const save = () => { if (!text.trim()) return; onSave({ text, gorsel: imageDataUrl }); };

  return (
    <div style={styles.modalOverlay}>
      <div style={{ ...styles.createModalContent, maxWidth: 460 }}>
        <div style={styles.drawerHeader}>
          <h2 style={styles.formTitle}>Rework / Hata Bildir — Araç #{vehicle.no}</h2>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
          <div>
            <label style={styles.inputLabel}>Açıklama</label>
            <input style={styles.mainInput} placeholder="Hata / rework açıklaması..." value={text} onChange={(e) => setText(e.target.value)} autoFocus />
          </div>
          <div>
            <label style={styles.inputLabel}>Hata Görseli (opsiyonel)</label>
            {imageDataUrl ? (
              <div style={{ position: "relative", display: "inline-block", marginTop: 4 }}>
                <img src={imageDataUrl} alt="Hata görseli" style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8, border: "1px solid #334155", display: "block" }} />
                <button type="button" style={{ position: "absolute", top: 6, right: 6, background: "#EF4444", border: "none", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setImageDataUrl(null)}><X size={13} color="#fff" /></button>
              </div>
            ) : (
              <button type="button" style={{ ...styles.ghostBtn, width: "100%", padding: "18px 0", borderStyle: "dashed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }} onClick={() => fileInputRef.current?.click()} disabled={processing}>
                <FileUp size={16} /> {processing ? "Yükleniyor..." : "Görsel Seç"}
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>
          <div style={{ fontSize: 10, color: "#64748B" }}>Bu kayıt görseliyle birlikte otomatik olarak Uygunsuzluk Takip listesine de eklenir.</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.ghostBtn} onClick={onClose}>Vazgeç</button>
            <button style={styles.primaryActionBtn} onClick={save}>Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  );
}
