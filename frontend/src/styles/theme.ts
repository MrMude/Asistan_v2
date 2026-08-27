// ---------------------------------------------------------------------------
// theme.ts — uygulamanın tüm inline stil tanımları burada toplanır.
// Bileşenler `import { styles } from "../styles/theme"` ile kullanır.
// Bu, orijinal tek-dosya App.tsx'teki dev `styles` objesinin birebir
// (davranış değişikliği olmadan) taşınmış halidir — sadece artık kendi
// dosyasında ve tipli.
// ---------------------------------------------------------------------------
import type { CSSProperties } from "react";

export const styles = {
  "appShell": {
    "fontFamily": "'Plus Jakarta Sans', sans-serif",
    "background": "radial-gradient(circle at 15% 0%, #1a2440 0%, #0F172A 45%)",
    "color": "#F8FAFC",
    "minHeight": "100vh",
    "display": "flex",
    "flexDirection": "row"
  },
  "header": {
    "display": "flex",
    "alignItems": "center",
    "padding": "12px 24px",
    "background": "linear-gradient(90deg, #1E293B 0%, #16202f 100%)",
    "borderBottom": "2px solid #F59E0B",
    "gap": 16,
    "flexWrap": "wrap"
  },
  "sidebar": {
    "width": 232,
    "minWidth": 232,
    "background": "linear-gradient(180deg, #1E293B 0%, #131b28 100%)",
    "borderRight": "2px solid #F59E0B",
    "display": "flex",
    "flexDirection": "column",
    "height": "100vh",
    "position": "sticky",
    "top": 0,
    "flexShrink": 0
  },
  "sidebarBrand": {
    "display": "flex",
    "alignItems": "center",
    "gap": 10,
    "padding": "20px 16px 16px"
  },
  "navDivider": {
    "height": 1,
    "background": "#334155",
    "margin": "8px 4px"
  },
  "sidebarFooter": {
    "padding": 12,
    "borderTop": "1px solid #334155",
    "display": "flex",
    "flexDirection": "column",
    "gap": 8
  },
  "brand": {
    "display": "flex",
    "alignItems": "center",
    "gap": 10
  },
  "logoIcon": {
    "background": "rgba(245, 158, 11, 0.15)",
    "padding": 8,
    "borderRadius": 10,
    "display": "flex"
  },
  "brandName": {
    "fontWeight": 800,
    "fontSize": 16,
    "color": "#F59E0B"
  },
  "brandSub": {
    "fontSize": 10,
    "color": "#94A3B8"
  },
  "navTabs": {
    "display": "flex",
    "flexDirection": "column",
    "gap": 4,
    "padding": "0 12px",
    "flex": 1,
    "overflowY": "auto"
  },
  "navTab": {
    "display": "flex",
    "alignItems": "center",
    "gap": 10,
    "padding": "9px 12px",
    "borderRadius": 8,
    "border": "none",
    "background": "transparent",
    "color": "#94A3B8",
    "fontSize": 13,
    "fontWeight": 600,
    "cursor": "pointer",
    "width": "100%",
    "justifyContent": "flex-start",
    "textAlign": "left"
  },
  "navTabActive": {
    "background": "rgba(245, 158, 11, 0.15)",
    "color": "#F59E0B",
    "border": "1px solid #F59E0B"
  },
  "navTabAdminActive": {
    "background": "rgba(239, 68, 68, 0.15)",
    "color": "#EF4444",
    "border": "1px solid #EF4444"
  },
  "navGroupHeader": {
    "display": "flex",
    "alignItems": "center",
    "gap": 10,
    "padding": "9px 12px",
    "borderRadius": 8,
    "border": "none",
    "background": "transparent",
    "color": "#94A3B8",
    "fontSize": 13,
    "fontWeight": 600,
    "cursor": "pointer",
    "width": "100%"
  },
  "navGroupBody": {
    "display": "flex",
    "flexDirection": "column",
    "gap": 2,
    "paddingLeft": 14,
    "marginTop": 2,
    "marginBottom": 4,
    "borderLeft": "1px solid #334155"
  },
  "navSubTab": {
    "display": "flex",
    "alignItems": "center",
    "gap": 8,
    "padding": "7px 10px",
    "borderRadius": 6,
    "border": "none",
    "background": "transparent",
    "color": "#94A3B8",
    "fontSize": 12,
    "fontWeight": 500,
    "cursor": "pointer",
    "width": "100%",
    "justifyContent": "flex-start",
    "textAlign": "left"
  },
  "notificationBellBtn": {
    "background": "#0F172A",
    "border": "1px solid #334155",
    "borderRadius": 8,
    "padding": "8px 10px",
    "cursor": "pointer",
    "position": "relative",
    "display": "flex",
    "alignItems": "center",
    "gap": 8,
    "color": "#F8FAFC",
    "width": "100%"
  },
  "notificationBadge": {
    "position": "absolute",
    "top": -4,
    "right": -4,
    "background": "#EF4444",
    "color": "#FFF",
    "fontSize": 9,
    "fontWeight": 800,
    "padding": "2px 5px",
    "borderRadius": "50%"
  },
  "userProfileBar": {
    "display": "flex",
    "alignItems": "center",
    "gap": 8,
    "background": "#0F172A",
    "padding": "8px 10px",
    "borderRadius": 10,
    "border": "1px solid #334155"
  },
  "userAvatar": {
    "width": 30,
    "height": 30,
    "borderRadius": "50%",
    "background": "#F59E0B",
    "color": "#0F172A",
    "fontWeight": 800,
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "flexShrink": 0
  },
  "userName": {
    "fontSize": 12,
    "fontWeight": 700
  },
  "userRoleTag": {
    "fontSize": 10,
    "color": "#F59E0B"
  },
  "actionSmallBtn": {
    "background": "transparent",
    "border": "none",
    "cursor": "pointer"
  },
  "errorBar": {
    "background": "rgba(239, 68, 68, 0.2)",
    "padding": 8,
    "color": "#FCA5A5",
    "fontSize": 12,
    "textAlign": "center",
    "borderRadius": 6
  },
  "mainContent": {
    "flex": 1,
    "minWidth": 0,
    "padding": "24px 28px",
    "overflowY": "auto",
    "height": "100vh"
  },
  "viewContainer": {
    "display": "flex",
    "flexDirection": "column",
    "gap": 20
  },
  "dashboardCardGrid": {
    "display": "grid",
    "gridTemplateColumns": "repeat(auto-fit, minmax(180px, 1fr))",
    "gap": 16
  },
  "dashCard": {
    "background": "linear-gradient(155deg, #212f47 0%, #1A2536 60%)",
    "border": "1px solid #334155",
    "borderRadius": 12,
    "padding": 16,
    "borderLeft": "4px solid"
  },
  "dashCardTitle": {
    "fontSize": 11,
    "color": "#94A3B8",
    "fontWeight": 600
  },
  "dashCardValue": {
    "fontSize": 24,
    "fontWeight": 800,
    "marginTop": 6,
    "color": "#F59E0B",
    "textShadow": "0 0 18px rgba(245, 158, 11, 0.35)"
  },
  "periodBtn": {
    "background": "transparent",
    "border": "1px solid #334155",
    "color": "#94A3B8",
    "padding": "4px 10px",
    "borderRadius": 6,
    "fontSize": 11,
    "fontWeight": 700,
    "cursor": "pointer"
  },
  "periodBtnActive": {
    "background": "#F59E0B",
    "color": "#0F172A",
    "border": "1px solid #F59E0B"
  },
  "printBtn": {
    "background": "#1E293B",
    "color": "#38BDF8",
    "border": "1px solid #38BDF8",
    "padding": "6px 14px",
    "borderRadius": 8,
    "fontSize": 12,
    "fontWeight": 700,
    "cursor": "pointer"
  },
  "reportRow": {
    "display": "flex",
    "alignItems": "center",
    "gap": 10,
    "padding": "8px 10px",
    "background": "#0F172A",
    "borderRadius": 6,
    "fontSize": 12
  },
  "reportRowNo": {
    "fontFamily": "monospace",
    "fontWeight": 800,
    "color": "#F59E0B",
    "flexShrink": 0,
    "width": 44
  },
  "reportAddForm": {
    "display": "flex",
    "gap": 6,
    "marginTop": 8,
    "flexWrap": "wrap"
  },
  "addChipBtnSolid": {
    "display": "flex",
    "alignItems": "center",
    "gap": 4,
    "background": "#212934",
    "border": "1px solid #F59E0B",
    "color": "#F59E0B",
    "borderRadius": 8,
    "padding": "5px 10px",
    "fontSize": 11,
    "fontWeight": 700,
    "cursor": "pointer"
  },
  "vertStatRail": {
    "display": "flex",
    "flexDirection": "column",
    "gap": 14,
    "minWidth": 170,
    "flexShrink": 0,
    "background": "#0F172A",
    "border": "1px solid #334155",
    "borderRadius": 12,
    "padding": 16
  },
  "vertStatItem": {
    "display": "flex",
    "alignItems": "center",
    "gap": 10
  },
  "vertStatDot": {
    "width": 10,
    "height": 10,
    "borderRadius": 10,
    "flexShrink": 0
  },
  "vertStatValue": {
    "fontSize": 18,
    "fontWeight": 800
  },
  "vertStatLabel": {
    "fontSize": 10,
    "color": "#94A3B8"
  },
  "aracKanbanScroll": {
    "display": "flex",
    "gap": 18,
    "overflowX": "auto",
    "flex": 1,
    "minWidth": 0,
    "paddingBottom": 8
  },
  "aracKanbanCol": {
    "background": "#0F172A",
    "border": "1px solid #334155",
    "borderRadius": 10,
    "flexGrow": 1,
    "flexShrink": 1,
    "flexBasis": 0,
    "minWidth": 240,
    "display": "flex",
    "flexDirection": "column",
    "transition": "border-color 0.15s"
  },
  "kanbanRowLabel": {
    "fontSize": 11,
    "fontWeight": 800,
    "color": "#94A3B8",
    "textTransform": "uppercase",
    "letterSpacing": 0.5,
    "marginBottom": 8,
    "display": "flex",
    "alignItems": "center",
    "gap": 6
  },
  "aracVehCard": {
    "background": "#1E293B",
    "border": "1px solid #334155",
    "borderRadius": 8,
    "padding": 8,
    "cursor": "grab",
    "transition": "transform 0.12s, border-color 0.12s, box-shadow 0.12s"
  },
  "dashKanbanScroll": {
    "display": "flex",
    "gap": 12,
    "overflowX": "auto",
    "paddingBottom": 8
  },
  "dashKanbanCol": {
    "background": "#0F172A",
    "border": "1px solid #334155",
    "borderRadius": 10,
    "flexGrow": 1,
    "flexShrink": 1,
    "flexBasis": 0,
    "minWidth": 220,
    "display": "flex",
    "flexDirection": "column",
    "transition": "border-color 0.15s"
  },
  "aracKanbanColHeader": {
    "borderTop": "3px solid",
    "padding": "8px 10px 6px"
  },
  "aracKanbanColBody": {
    "padding": 8,
    "display": "flex",
    "flexDirection": "column",
    "gap": 6,
    "maxHeight": 480,
    "overflowY": "auto"
  },
  "aracAddColBtn": {
    "background": "transparent",
    "border": "1px dashed #334155",
    "color": "#94A3B8",
    "borderRadius": 6,
    "padding": "5px 0",
    "fontSize": 10,
    "cursor": "pointer",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "gap": 4
  },
  "aracReworkBtn": {
    "background": "transparent",
    "border": "none",
    "color": "#F59E0B",
    "fontSize": 10,
    "cursor": "pointer",
    "padding": "4px 0",
    "textAlign": "left"
  },
  "aracAdvanceBtn": {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "gap": 4,
    "width": "100%",
    "marginTop": 6,
    "background": "#212934",
    "border": "1px solid #10B981",
    "color": "#10B981",
    "borderRadius": 6,
    "padding": "5px 0",
    "fontSize": 10,
    "fontWeight": 700,
    "cursor": "pointer"
  },
  "aracServeBadge": {
    "marginTop": 6,
    "fontSize": 10,
    "color": "#10B981",
    "fontWeight": 700,
    "textAlign": "center"
  },
  "resultPill": {
    "background": "#1E293B",
    "border": "1px solid #334155",
    "color": "#94A3B8",
    "borderRadius": 6,
    "padding": "4px 9px",
    "fontSize": 10,
    "fontWeight": 700,
    "cursor": "pointer"
  },
  "resultPillOk": {
    "background": "rgba(16, 185, 129, 0.2)",
    "border": "1px solid #10B981",
    "color": "#10B981"
  },
  "resultPillNok": {
    "background": "rgba(239, 68, 68, 0.2)",
    "border": "1px solid #EF4444",
    "color": "#EF4444"
  },
  "resultPillNa": {
    "background": "rgba(148, 163, 184, 0.2)",
    "border": "1px solid #94A3B8",
    "color": "#CBD5E1"
  },
  "formResultBadge": {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "gap": 4,
    "width": "100%",
    "marginTop": 6,
    "borderRadius": 6,
    "padding": "5px 0",
    "fontSize": 10,
    "fontWeight": 700,
    "cursor": "pointer",
    "border": "1px solid"
  },
  "quickActionBtn": {
    "display": "flex",
    "alignItems": "center",
    "gap": 6,
    "background": "#1E293B",
    "border": "1px solid #334155",
    "color": "#CBD5E1",
    "borderRadius": 8,
    "padding": "7px 12px",
    "fontSize": 12,
    "fontWeight": 600,
    "cursor": "pointer"
  },
  "personalTaskCard": {
    "background": "#1E293B",
    "border": "1px solid #334155",
    "borderRadius": 14,
    "padding": 16,
    "cursor": "pointer"
  },
  "kanbanGrid": {
    "display": "grid",
    "gridTemplateColumns": "repeat(auto-fit, minmax(260px, 1fr))",
    "gap": 16
  },
  "kanbanColumn": {
    "background": "#1E293B",
    "border": "1px solid #334155",
    "borderRadius": 14,
    "padding": 14,
    "minHeight": 450
  },
  "kanbanColumnHeader": {
    "display": "flex",
    "justifyContent": "space-between",
    "borderTop": "3px solid",
    "paddingTop": 8,
    "paddingBottom": 6
  },
  "kanbanBadge": {
    "background": "#0F172A",
    "color": "#F8FAFC",
    "fontSize": 11,
    "fontWeight": 700,
    "padding": "2px 8px",
    "borderRadius": 10
  },
  "kanbanCardsList": {
    "display": "flex",
    "flexDirection": "column",
    "gap": 10,
    "marginTop": 10
  },
  "kanbanCard": {
    "background": "#0F172A",
    "border": "1px solid #334155",
    "borderRadius": 10,
    "padding": 12,
    "cursor": "grab"
  },
  "cardHeaderRow": {
    "display": "flex",
    "justifyContent": "space-between",
    "alignItems": "center"
  },
  "kanbanCardTitle": {
    "fontSize": 13,
    "fontWeight": 700,
    "cursor": "pointer",
    "marginTop": 6
  },
  "kanbanCardFooter": {
    "display": "flex",
    "justifyContent": "space-between",
    "fontSize": 11,
    "color": "#94A3B8",
    "marginTop": 8
  },
  "taskCodeBadge": {
    "fontFamily": "monospace",
    "fontSize": 10,
    "color": "#F59E0B",
    "background": "rgba(245, 158, 11, 0.15)",
    "padding": "2px 6px",
    "borderRadius": 4,
    "fontWeight": 700
  },
  "chip": {
    "background": "#0F172A",
    "border": "1px solid #334155",
    "borderRadius": 20,
    "padding": "4px 8px 4px 12px",
    "fontSize": 12,
    "display": "flex",
    "alignItems": "center",
    "gap": 6
  },
  "keywordChip": {
    "background": "rgba(56, 189, 248, 0.12)",
    "border": "1px solid #38BDF8",
    "color": "#38BDF8",
    "borderRadius": 10,
    "padding": "1px 7px",
    "fontSize": 10,
    "fontWeight": 600
  },
  "filterToolbar": {
    "display": "flex",
    "gap": 12
  },
  "searchWrapper": {
    "display": "flex",
    "alignItems": "center",
    "gap": 8,
    "background": "#1E293B",
    "padding": "8px 12px",
    "borderRadius": 8,
    "border": "1px solid #334155",
    "flex": 1
  },
  "searchInput": {
    "background": "transparent",
    "border": "none",
    "color": "#F8FAFC",
    "fontSize": 12,
    "outline": "none",
    "width": "100%"
  },
  "primaryActionBtn": {
    "background": "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
    "color": "#0F172A",
    "border": "none",
    "padding": "8px 16px",
    "borderRadius": 8,
    "fontWeight": 700,
    "fontSize": 12,
    "cursor": "pointer",
    "boxShadow": "0 2px 10px rgba(245, 158, 11, 0.25)"
  },
  "ghostBtn": {
    "background": "transparent",
    "border": "1px solid #334155",
    "color": "#94A3B8",
    "padding": "8px 16px",
    "borderRadius": 8,
    "fontSize": 12,
    "cursor": "pointer"
  },
  "yearEndHeader": {
    "display": "flex",
    "justifyContent": "space-between",
    "alignItems": "center",
    "flexWrap": "wrap",
    "gap": 12
  },
  "viewTitle": {
    "fontSize": 20,
    "fontWeight": 800
  },
  "viewSub": {
    "fontSize": 11,
    "color": "#94A3B8"
  },
  "yearEndTableCard": {
    "background": "linear-gradient(160deg, #1E293B 0%, #182233 100%)",
    "border": "1px solid #334155",
    "borderRadius": 14,
    "padding": 20,
    "overflowX": "auto"
  },
  "table": {
    "width": "100%",
    "borderCollapse": "collapse",
    "fontSize": 12,
    "textAlign": "left"
  },
  "th": {
    "borderBottom": "1px solid #334155",
    "padding": "10px 12px",
    "color": "#F59E0B",
    "fontWeight": 700
  },
  "tr": {
    "borderBottom": "1px solid #0F172A"
  },
  "td": {
    "padding": "10px 12px"
  },
  "tdTitle": {
    "padding": "10px 12px",
    "fontWeight": 700
  },
  "deleteIconBtn": {
    "background": "transparent",
    "border": "none",
    "color": "#EF4444",
    "cursor": "pointer"
  },
  "editIconBtn": {
    "background": "transparent",
    "border": "none",
    "color": "#F59E0B",
    "cursor": "pointer",
    "fontWeight": 600,
    "fontSize": 11
  },
  "loginOverlay": {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "right": 0,
    "bottom": 0,
    "background": "radial-gradient(circle at 50% 20%, #1c2947 0%, #0F172A 55%)",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "padding": 16,
    "zIndex": 1000
  },
  "loginCard": {
    "background": "#1E293B",
    "border": "1px solid #F59E0B",
    "borderRadius": 20,
    "padding": 32,
    "width": "100%",
    "maxWidth": 420,
    "display": "flex",
    "flexDirection": "column",
    "gap": 16
  },
  "loginHeader": {
    "textAlign": "center",
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center"
  },
  "loginLogo": {
    "width": 64,
    "height": 64,
    "borderRadius": 16,
    "background": "rgba(245, 158, 11, 0.15)",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "inputLabel": {
    "fontSize": 11,
    "color": "#94A3B8",
    "fontWeight": 600,
    "marginBottom": 4,
    "display": "block"
  },
  "mainInput": {
    "width": "100%",
    "background": "#0F172A",
    "border": "1px solid #334155",
    "borderRadius": 8,
    "padding": "10px 12px",
    "color": "#F8FAFC",
    "fontSize": 12,
    "outline": "none"
  },
  "selectInput": {
    "width": "100%",
    "background": "#0F172A",
    "border": "1px solid #334155",
    "borderRadius": 8,
    "padding": "8px 12px",
    "color": "#F8FAFC",
    "fontSize": 12,
    "outline": "none"
  },
  "loginSubmitBtn": {
    "background": "#F59E0B",
    "color": "#0F172A",
    "border": "none",
    "padding": "12px",
    "borderRadius": 10,
    "fontWeight": 800,
    "fontSize": 13,
    "cursor": "pointer"
  },
  "modalOverlay": {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "right": 0,
    "bottom": 0,
    "background": "rgba(0,0,0,0.8)",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "zIndex": 999,
    "padding": 16
  },
  "drawerContainer": {
    "background": "#1E293B",
    "border": "1px solid #334155",
    "borderRadius": 16,
    "width": "100%",
    "maxWidth": 540,
    "display": "flex",
    "flexDirection": "column",
    "overflow": "hidden"
  },
  "createModalContent": {
    "background": "#1E293B",
    "border": "1px solid #334155",
    "borderRadius": 16,
    "width": "100%",
    "maxWidth": 500,
    "padding": 20
  },
  "drawerHeader": {
    "display": "flex",
    "justifyContent": "space-between",
    "alignItems": "center",
    "paddingBottom": 10,
    "borderBottom": "1px solid #334155"
  },
  "drawerBody": {
    "padding": "16px 0",
    "display": "flex",
    "flexDirection": "column",
    "gap": 12
  },
  "closeBtn": {
    "background": "transparent",
    "border": "none",
    "color": "#94A3B8",
    "cursor": "pointer"
  },
  "unauthorizedBox": {
    "display": "flex",
    "flexDirection": "column",
    "alignItems": "center",
    "justifyContent": "center",
    "gap": 12,
    "padding": "80px 20px",
    "color": "#94A3B8",
    "textAlign": "center"
  },
  "subtaskSection": {
    "background": "#0F172A",
    "padding": 12,
    "borderRadius": 10
  },
  "subtaskRowInteractive": {
    "display": "flex",
    "alignItems": "center",
    "gap": 8,
    "padding": "6px 0",
    "cursor": "pointer"
  },
  "addInlineBtn": {
    "background": "#F59E0B",
    "color": "#0F172A",
    "border": "none",
    "padding": "6px 12px",
    "borderRadius": 6,
    "fontWeight": 700,
    "cursor": "pointer"
  },
  "drawerFooter": {
    "display": "flex",
    "justifyContent": "space-between",
    "paddingTop": 14,
    "borderTop": "1px solid #334155"
  },
  "deleteDangerBtn": {
    "background": "rgba(239, 68, 68, 0.15)",
    "color": "#EF4444",
    "border": "1px solid #EF4444",
    "padding": "6px 12px",
    "borderRadius": 6,
    "fontSize": 11,
    "cursor": "pointer"
  },
  "formTitle": {
    "fontSize": 16,
    "fontWeight": 800,
    "color": "#F59E0B"
  }
} satisfies Record<string, CSSProperties>;
