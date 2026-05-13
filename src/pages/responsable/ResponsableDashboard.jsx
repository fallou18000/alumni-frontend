import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Search, Eye, Download, X, Users, Briefcase,
  TrendingUp, GraduationCap, Mail, Calendar,
  LayoutDashboard, LogOut, Bell, CheckCircle,
  AlertCircle, FileText, Sparkles, Building2,
  SlidersHorizontal, ChevronDown, Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000";

/* ─── CSS: même design system que AdminDashboard ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

.rs2 *, .rs2 *::before, .rs2 *::after { box-sizing: border-box; margin: 0; padding: 0; }
.rs2 ::-webkit-scrollbar { width: 4px; height: 4px; }
.rs2 ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.2); border-radius: 4px; }
.rs2 ::-webkit-scrollbar-track { background: transparent; }

.rs2 {
  display: flex; min-height: 100vh;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13.5px;
  background: #f0f2f9;
  color: #1e293b;
}

:where(.rs2) {
  --primary: #6366f1;
  --primary2: #818cf8;
  --primary-light: rgba(99,102,241,0.08);
  --primary-border: rgba(99,102,241,0.2);
  --teal: #0ea5e9;
  --green: #10b981;
  --gold: #f59e0b;
  --rose: #f43f5e;
  --violet: #8b5cf6;
  --ink1: #0f172a;
  --ink2: #1e293b;
  --ink3: #475569;
  --ink4: #94a3b8;
  --ink5: #cbd5e1;
  --bg: #f0f2f9;
  --bg2: #f8faff;
  --white: #ffffff;
  --card: #ffffff;
  --sidebar: #ffffff;
  --border: rgba(15,23,42,0.07);
  --border2: rgba(15,23,42,0.11);
  --shadow-sm: 0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04);
  --shadow: 0 4px 16px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.05);
  --shadow-md: 0 8px 30px rgba(15,23,42,0.10), 0 2px 8px rgba(15,23,42,0.06);
  --shadow-lg: 0 20px 60px rgba(15,23,42,0.14), 0 4px 16px rgba(15,23,42,0.08);
  --r: 16px; --r2: 12px; --r3: 9px;
  --font: 'Plus Jakarta Sans', sans-serif;
  --mono: 'DM Mono', monospace;
}

/* ══ SIDEBAR ══ */
.rs2 .rs2-sb {
  width: 248px; flex-shrink: 0;
  background: var(--sidebar);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh;
  overflow: hidden;
  box-shadow: 2px 0 12px rgba(15,23,42,0.04);
}
.rs2 .rs2-sb-top-accent {
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--violet), var(--teal));
  flex-shrink: 0;
}
.rs2 .rs2-profile {
  padding: 22px 18px 18px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 12px;
}
.rs2 .rs2-av-ring {
  padding: 2px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--violet));
  display: inline-flex; flex-shrink: 0;
}
.rs2 .rs2-av {
  width: 40px; height: 40px; border-radius: 50%;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 800; color: var(--primary);
  letter-spacing: -.3px;
}
.rs2 .rs2-profile-info { flex: 1; min-width: 0; }
.rs2 .rs2-name {
  font-size: 13px; font-weight: 700; color: var(--ink1);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.rs2 .rs2-subrole { font-size: 10.5px; color: var(--ink4); margin-top: 2px; }
.rs2 .rs2-chip {
  display: inline-block; margin-top: 4px;
  font-size: 9px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase;
  color: var(--gold); background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.22);
  padding: 2px 8px; border-radius: 20px;
}
.rs2 .rs2-nav { flex: 1; padding: 14px 10px 10px; overflow-y: auto; }
.rs2 .rs2-grp {
  font-size: 8px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
  color: var(--ink5); padding: 10px 12px 5px;
}
.rs2 .rs2-ni {
  display: flex; align-items: center; gap: 9px; padding: 9px 12px;
  border-radius: var(--r3); cursor: pointer;
  font-size: 12.5px; font-weight: 500; color: var(--ink3);
  transition: all .18s; margin-bottom: 1px; user-select: none; position: relative;
}
.rs2 .rs2-ni:hover { background: var(--primary-light); color: var(--primary); }
.rs2 .rs2-ni.on { background: var(--primary-light); color: var(--primary); font-weight: 700; }
.rs2 .rs2-ni.on::before {
  content: ''; position: absolute; left: 0; top: 18%; bottom: 18%;
  width: 3px; border-radius: 0 3px 3px 0;
  background: linear-gradient(to bottom, var(--primary), var(--violet));
}
.rs2 .rs2-ni-ico {
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  background: rgba(15,23,42,0.04); transition: all .18s; color: var(--ink3);
}
.rs2 .rs2-ni:hover .rs2-ni-ico,
.rs2 .rs2-ni.on .rs2-ni-ico { background: rgba(99,102,241,0.12); color: var(--primary); }
.rs2 .rs2-sep { height: 1px; background: var(--border); margin: 6px 12px; }
.rs2 .rs2-sb-ft { padding: 8px 10px 18px; border-top: 1px solid var(--border); }

/* ══ MAIN ══ */
.rs2 .rs2-main { flex: 1; display: flex; flex-direction: column; min-height: 100vh; overflow: hidden; }

/* ══ TOPBAR ══ */
.rs2 .rs2-topbar {
  display: flex; align-items: center; gap: 10px; padding: 0 24px; height: 62px;
  background: rgba(255,255,255,0.95); border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 40; backdrop-filter: blur(20px); flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(15,23,42,0.06);
}
.rs2 .rs2-topbar-title {
  flex: 1; font-size: 15.5px; font-weight: 800;
  letter-spacing: -.3px; color: var(--ink1);
  display: flex; align-items: center; gap: 8px;
}
.rs2 .rs2-crumb {
  font-size: 10px; color: var(--ink4); font-weight: 500;
  background: var(--bg); padding: 2px 9px; border-radius: 20px;
  border: 1px solid var(--border); letter-spacing: .2px;
}
.rs2 .rs2-srch {
  display: flex; align-items: center; gap: 8px; background: var(--bg);
  border: 1.5px solid var(--border); border-radius: var(--r2);
  padding: 7px 12px; width: 200px; transition: all .22s;
}
.rs2 .rs2-srch:focus-within {
  border-color: var(--primary-border);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.07);
  background: var(--white); width: 240px;
}
.rs2 .rs2-srch input {
  background: none; border: none; outline: none;
  font-size: 12.5px; font-family: var(--font); color: var(--ink2); width: 100%;
}
.rs2 .rs2-srch input::placeholder { color: var(--ink5); }
.rs2 .rs2-date {
  font-size: 10.5px; color: var(--ink4); background: var(--bg);
  border: 1px solid var(--border); border-radius: var(--r2);
  padding: 5px 10px; white-space: nowrap; font-family: var(--mono); letter-spacing: .3px;
}
.rs2 .rs2-bell {
  width: 38px; height: 38px; border-radius: var(--r2);
  background: var(--bg); border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink3); transition: all .18s;
}
.rs2 .rs2-bell:hover { border-color: var(--primary-border); color: var(--primary); background: var(--primary-light); }

/* ══ BUTTONS ══ */
.rs2 .btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 15px; border-radius: var(--r2);
  font-size: 12px; font-weight: 700; font-family: var(--font);
  cursor: pointer; border: none; transition: all .18s; white-space: nowrap;
}
.rs2 .btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--violet));
  color: #fff; box-shadow: 0 2px 12px rgba(99,102,241,0.25);
}
.rs2 .btn-primary:hover { opacity: .9; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.35); }
.rs2 .btn-teal { background: linear-gradient(135deg, var(--green), var(--teal)); color: #fff; box-shadow: 0 2px 10px rgba(16,185,129,0.2); }
.rs2 .btn-teal:hover { opacity: .9; transform: translateY(-1px); }
.rs2 .btn-ghost {
  background: var(--bg); border: 1.5px solid var(--border); color: var(--ink3);
}
.rs2 .btn-ghost:hover { border-color: var(--primary-border); color: var(--primary); background: var(--primary-light); }
.rs2 .btn-gold { background: linear-gradient(135deg, var(--gold), #e67e22); color: #fff; box-shadow: 0 2px 10px rgba(245,158,11,0.2); }
.rs2 .btn-gold:hover { opacity: .9; transform: translateY(-1px); }

/* ══ CONTENT ══ */
.rs2 .rs2-content {
  flex: 1; padding: 22px 24px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 20px;
}

/* ══ BANNER ══ */
.rs2 .rs2-banner {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #0ea5e9 100%);
  border-radius: var(--r); padding: 28px 30px;
  display: flex; align-items: center; justify-content: space-between;
  position: relative; overflow: hidden; box-shadow: 0 8px 32px rgba(79,70,229,0.28);
}
.rs2 .rs2-banner-pattern {
  position: absolute; inset: 0; pointer-events: none;
  background-image: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%);
}
.rs2 .rs2-banner-dots {
  position: absolute; right: 200px; top: 0; bottom: 0; width: 200px; pointer-events: none;
  background-image: radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px);
  background-size: 18px 18px;
}
.rs2 .rs2-banner-left { position: relative; z-index: 1; }
.rs2 .rs2-banner-eyebrow {
  font-size: 9.5px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase;
  color: rgba(255,255,255,0.65); margin-bottom: 7px;
  display: flex; align-items: center; gap: 6px;
}
.rs2 .rs2-banner-title { font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -.5px; margin-bottom: 5px; }
.rs2 .rs2-banner-sub { font-size: 13px; color: rgba(255,255,255,0.55); }
.rs2 .rs2-banner-right {
  position: relative; z-index: 1; display: flex;
  background: rgba(255,255,255,0.1); border-radius: var(--r2);
  border: 1px solid rgba(255,255,255,0.15); overflow: hidden; backdrop-filter: blur(8px);
}
.rs2 .rs2-bstat { padding: 16px 22px; text-align: center; border-right: 1px solid rgba(255,255,255,0.12); }
.rs2 .rs2-bstat:last-child { border-right: none; }
.rs2 .rs2-bsv { font-size: 30px; font-weight: 800; color: #fff; letter-spacing: -1.5px; line-height: 1; }
.rs2 .rs2-bsl { font-size: 9.5px; color: rgba(255,255,255,0.5); margin-top: 5px; letter-spacing: .7px; text-transform: uppercase; }

/* ══ STAT CARDS ══ */
.rs2 .rs2-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.rs2 .rs2-stat {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r); padding: 20px 20px 16px;
  position: relative; overflow: hidden; transition: all .22s; cursor: default;
  box-shadow: var(--shadow-sm);
}
.rs2 .rs2-stat:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--primary-border); }
.rs2 .rs2-stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.rs2 .rs2-stat-ico { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.rs2 .rs2-stat-trend { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; font-family: var(--mono); }
.rs2 .rs2-stat-trend.up { background: rgba(16,185,129,0.1); color: var(--green); }
.rs2 .rs2-stat-trend.dn { background: rgba(244,63,94,0.1); color: var(--rose); }
.rs2 .rs2-stat-lbl { font-size: 9.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ink4); margin-bottom: 5px; }
.rs2 .rs2-stat-val { font-size: 30px; font-weight: 800; letter-spacing: -1.5px; line-height: 1; margin-bottom: 4px; color: var(--ink1); }
.rs2 .rs2-stat-sub { font-size: 11px; color: var(--ink4); }
.rs2 .rs2-stat-stripe { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }

/* ══ CHARTS ══ */
.rs2 .rs2-charts { display: grid; grid-template-columns: 1.6fr 1fr; gap: 12px; }
.rs2 .rs2-cc {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r); padding: 20px 22px; box-shadow: var(--shadow-sm);
}
.rs2 .rs2-cc-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
.rs2 .rs2-cc-title { font-size: 14px; font-weight: 800; color: var(--ink1); letter-spacing: -.2px; }
.rs2 .rs2-cc-sub { font-size: 11px; color: var(--ink4); margin-top: 2px; }
.rs2 .rs2-cc-pill { font-size: 9.5px; font-weight: 700; padding: 3px 9px; border-radius: 20px; }

/* ══ FILTER PANEL ══ */
.rs2 .rs2-filter {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r); padding: 16px 20px;
  box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.rs2 .rs2-fl {
  font-size: 8.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  color: var(--ink4); display: flex; align-items: center; gap: 5px; white-space: nowrap;
}
.rs2 .rs2-fi {
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: var(--r2); padding: 7px 11px;
  font-size: 12.5px; font-family: var(--font);
  color: var(--ink2); outline: none; transition: all .18s;
}
.rs2 .rs2-fi:focus { border-color: var(--primary-border); box-shadow: 0 0 0 3px rgba(99,102,241,0.07); background: var(--white); }
.rs2 .rs2-fi::placeholder { color: var(--ink5); }
select.rs2-fi {
  appearance: none; cursor: pointer; padding-right: 26px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 9px center;
}
select.rs2-fi option { background: #fff; color: #1e293b; }

/* ══ TABLE ══ */
.rs2 .rs2-tbl {
  background: var(--white); border: 1px solid var(--border);
  border-radius: var(--r); box-shadow: var(--shadow-sm); overflow: hidden;
}
.rs2 .rs2-tbl-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; border-bottom: 1px solid var(--border); flex-wrap: wrap; gap: 10px;
  background: linear-gradient(135deg, rgba(99,102,241,0.02), rgba(139,92,246,0.01));
}
.rs2 .rs2-tbl-title {
  font-size: 14px; font-weight: 800; letter-spacing: -.2px; color: var(--ink1);
  display: flex; align-items: center; gap: 8px;
}
.rs2 .rs2-tbl-ct {
  font-size: 10px; color: var(--primary); font-weight: 700;
  background: var(--primary-light); padding: 2px 9px;
  border-radius: 20px; border: 1px solid var(--primary-border); font-family: var(--mono);
}
.rs2 .rs2-thead {
  display: grid; grid-template-columns: 2fr 1.6fr 1fr 1.2fr 1.2fr 80px;
  padding: 9px 22px; background: var(--bg); border-bottom: 1px solid var(--border);
}
.rs2 .rs2-th { font-size: 9px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: var(--ink5); }
.rs2 .rs2-tr {
  display: grid; grid-template-columns: 2fr 1.6fr 1fr 1.2fr 1.2fr 80px;
  padding: 12px 22px; border-bottom: 1px solid var(--border); align-items: center; transition: background .14s;
}
.rs2 .rs2-tr:last-child { border-bottom: none; }
.rs2 .rs2-tr:hover { background: rgba(99,102,241,0.02); }
.rs2 .rs2-uc { display: flex; align-items: center; gap: 10px; }
.rs2 .rs2-av-sm {
  width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff;
}
.rs2 .rs2-uname { font-size: 13px; font-weight: 700; color: var(--ink1); letter-spacing: -.1px; }
.rs2 .rs2-usub { font-size: 10.5px; color: var(--ink4); margin-top: 1px; }
.rs2 .rs2-td { font-size: 12px; color: var(--ink3); }
.rs2 .bk {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px; letter-spacing: .2px;
}
.rs2 .bk::before { content: ''; width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0; }
.rs2 .bk-ok { background: rgba(16,185,129,0.1); color: var(--green); border: 1px solid rgba(16,185,129,0.2); }
.rs2 .bk-ok::before { background: var(--green); }
.rs2 .bk-no { background: rgba(244,63,94,0.08); color: var(--rose); border: 1px solid rgba(244,63,94,0.18); }
.rs2 .bk-no::before { background: var(--rose); }
.rs2 .bk-pend { background: rgba(245,158,11,0.1); color: var(--gold); border: 1px solid rgba(245,158,11,0.2); }
.rs2 .bk-pend::before { background: var(--gold); }
.rs2 .rs2-ib {
  width: 28px; height: 28px; border-radius: 8px;
  border: 1.5px solid var(--border); background: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink4); transition: all .15s;
}
.rs2 .rs2-ib:hover { border-color: var(--primary-border); color: var(--primary); background: var(--primary-light); }
.rs2 .rs2-ib.pdf:hover { border-color: rgba(245,158,11,0.35); color: var(--gold); background: rgba(245,158,11,0.07); }
.rs2 .rs2-empty { padding: 52px 20px; text-align: center; color: var(--ink4); }

/* ══ TOP ENTREPRISES ══ */
.rs2 .top-ent-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-radius: var(--r3);
  transition: background .14s; cursor: default;
}
.rs2 .top-ent-row:hover { background: var(--bg); }
.rs2 .top-ent-rank {
  width: 20px; text-align: center;
  font-family: var(--mono); font-size: 10px; font-weight: 700;
  color: var(--ink4); flex-shrink: 0;
}
.rs2 .top-ent-logo {
  width: 32px; height: 32px; border-radius: 8px;
  background: var(--primary-light); border: 1px solid var(--primary-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; font-family: var(--font);
  color: var(--primary); flex-shrink: 0;
}
.rs2 .top-ent-info { flex: 1; min-width: 0; }
.rs2 .top-ent-name { font-size: 12.5px; font-weight: 600; color: var(--ink2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rs2 .top-ent-bar-wrap { height: 4px; background: rgba(15,23,42,0.06); border-radius: 2px; margin-top: 5px; overflow: hidden; }
.rs2 .top-ent-bar { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--primary), var(--teal)); }
.rs2 .top-ent-ct { font-family: var(--mono); font-size: 11px; font-weight: 700; color: var(--primary); flex-shrink: 0; }

/* ══ MODAL ══ */
.rs2 .rs2-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.45);
  backdrop-filter: blur(8px); z-index: 200;
  display: flex; align-items: center; justify-content: center;
}
.rs2 .rs2-modal {
  background: var(--white); border: 1px solid var(--border2);
  border-radius: 20px; width: 520px; max-height: 90vh;
  display: flex; flex-direction: column; box-shadow: var(--shadow-lg); overflow: hidden;
}
.rs2 .rs2-m-hero {
  padding: 22px 24px 20px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 14px;
  background: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.03));
  position: relative;
}
.rs2 .rs2-m-av {
  width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 17px; font-weight: 800; color: #fff;
  background: linear-gradient(135deg, var(--primary), var(--violet));
}
.rs2 .rs2-m-name { font-size: 19px; font-weight: 800; letter-spacing: -.3px; color: var(--ink1); }
.rs2 .rs2-m-job { font-size: 12px; color: var(--ink4); display: flex; align-items: center; gap: 5px; margin-top: 3px; }
.rs2 .rs2-m-close {
  position: absolute; top: 16px; right: 18px;
  background: none; border: 1.5px solid var(--border); border-radius: 8px;
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ink4); transition: all .15s;
}
.rs2 .rs2-m-close:hover { border-color: rgba(244,63,94,0.3); color: var(--rose); background: rgba(244,63,94,0.06); }
.rs2 .rs2-m-body { padding: 20px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }
.rs2 .rs2-m-sect {
  font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
  color: var(--ink5); display: flex; align-items: center; gap: 6px;
}
.rs2 .rs2-m-sect::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.rs2 .rs2-m-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.rs2 .rs2-m-item {
  background: var(--bg2); border: 1.5px solid var(--border);
  border-radius: var(--r2); padding: 11px 13px; transition: border-color .15s;
}
.rs2 .rs2-m-item:hover { border-color: var(--primary-border); }
.rs2 .rs2-m-lbl {
  font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  color: var(--ink5); margin-bottom: 5px; display: flex; align-items: center; gap: 4px;
}
.rs2 .rs2-m-val { font-size: 13.5px; font-weight: 600; color: var(--ink1); }
.rs2 .rs2-m-val.muted { color: var(--ink4); font-weight: 400; font-style: italic; font-size: 12.5px; }
.rs2 .rs2-m-ft {
  padding: 13px 24px; border-top: 1px solid var(--border);
  display: flex; gap: 8px; justify-content: flex-end;
  background: var(--bg); flex-shrink: 0;
}

/* ══ TOASTS ══ */
.rs2 .rs2-toasts {
  position: fixed; bottom: 20px; right: 20px; z-index: 600;
  display: flex; flex-direction: column; gap: 7px;
  align-items: flex-end; pointer-events: none;
}
.rs2 .rs2-toast {
  display: flex; align-items: center; gap: 9px;
  background: var(--white); border: 1.5px solid var(--border2);
  border-radius: 12px; padding: 11px 14px; min-width: 240px;
  color: var(--ink2); font-size: 12.5px; box-shadow: var(--shadow-md); pointer-events: all;
}
.rs2 .rs2-td2 { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.rs2 .rs2-td2.s { background: var(--green); }
.rs2 .rs2-td2.e { background: var(--rose); }
.rs2 .rs2-td2.i { background: var(--gold); }

@media (max-width: 1100px) {
  .rs2 .rs2-stats { grid-template-columns: repeat(2, 1fr); }
  .rs2 .rs2-charts { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .rs2 .rs2-sb { display: none; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("rs2-css")) {
  const s = document.createElement("style"); s.id = "rs2-css"; s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── HELPERS ─── */
const AV_GRADS = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#0ea5e9,#6366f1)",
  "linear-gradient(135deg,#f59e0b,#f43f5e)",
  "linear-gradient(135deg,#10b981,#0ea5e9)",
  "linear-gradient(135deg,#8b5cf6,#ec4899)",
];
const avC = id => AV_GRADS[(id || 0) % AV_GRADS.length];
const ini = u => ((u?.first_name?.[0] || "") + (u?.last_name?.[0] || "")).toUpperCase() || "?";
const iniStr = s => (s || "?")[0].toUpperCase();
const PIE_COLORS = ["#6366f1", "#f43f5e", "#f59e0b", "#0ea5e9"];

const C = { primary: "#6366f1", green: "#10b981", rose: "#f43f5e", gold: "#f59e0b", teal: "#0ea5e9", violet: "#8b5cf6" };

const enrichAlumni = (rawList, entreprisesList) =>
  rawList.map(u => ({
    ...u,
    profile: u.profile
      ? {
          ...u.profile,
          entreprise:
            u.profile.entreprise && u.profile.entreprise.nom
              ? u.profile.entreprise
              : entreprisesList.find(e => e.id === u.profile?.entreprise_id) || null,
        }
      : u.profile,
  }));

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (msg, type = "i") => {
    const id = Date.now();
    setToasts(t => [{ id, msg, type }, ...t]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return { toasts, push };
}

/* ─── PDF ─── */
const exportPDF = (user) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 20;
  doc.setFillColor(79, 70, 229); doc.rect(0, 0, W, 48, "F");
  doc.setFillColor(99, 102, 241); doc.rect(0, 0, W, 3, "F");
  doc.setFillColor(255, 255, 255); doc.setFillColor(99, 102, 241, 0.2);
  doc.setFillColor(255, 255, 255); doc.circle(M + 12, 25, 12, "F");
  doc.setTextColor(79, 70, 229); doc.setFontSize(14); doc.setFont("helvetica", "bold");
  doc.text(ini(user), M + 12, 28.5, { align: "center" });
  doc.setFontSize(18); doc.setTextColor(255, 255, 255); doc.text(`${user.first_name} ${user.last_name}`, M + 30, 23);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 255); doc.text(user.profile?.job_title || "Poste non renseigné", M + 30, 31);
  doc.setTextColor(180, 190, 220); doc.setFontSize(9); doc.text(user.email || "", M + 30, 38);
  doc.setFillColor(245, 247, 252); doc.rect(0, 52, W, 210, "F");
  const field = (label, value, x, y) => {
    doc.setFillColor(255, 255, 255); doc.roundedRect(x, y, 80, 22, 3, 3, "F");
    doc.setDrawColor(229, 231, 239); doc.roundedRect(x, y, 80, 22, 3, 3, "S");
    doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(130, 140, 160);
    doc.text(label.toUpperCase(), x + 5, y + 8);
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(13, 17, 23);
    doc.text(String(value || "—"), x + 5, y + 17);
  };
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 116, 139);
  doc.text("INFORMATIONS PERSONNELLES", M, 64);
  doc.setDrawColor(229, 231, 239); doc.line(M + 63, 64, W - M, 64);
  field("Email", user.email, M, 69);
  field("Promotion", user.profile?.promotion, M + 90, 69);
  field("Année diplôme", user.profile?.graduation_year, M, 97);
  field("Poste actuel", user.profile?.job_title, M + 90, 97);
  field("Entreprise", user.profile?.entreprise?.nom || user.profile?.entreprise_id, M, 125);
  field("Statut", user.status === "approved" ? "Approuvé" : "En attente", M + 90, 125);
  doc.setFillColor(79, 70, 229); doc.rect(0, 275, W, 22, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(180, 190, 220);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} — Portail Alumni`, M, 288);
  doc.setTextColor(200, 200, 255); doc.text("CONFIDENTIEL", W - M, 288, { align: "right" });
  doc.save(`fiche_${user.first_name}_${user.last_name}.pdf`);
};

/* ─── TOOLTIP CLAIR ─── */
const LightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(15,23,42,0.1)",
      borderRadius: 10, padding: "8px 13px", fontSize: 11,
      color: "#1e293b", boxShadow: "0 4px 16px rgba(15,23,42,0.1)",
    }}>
      <div style={{ color: "#94a3b8", marginBottom: 3, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 700 }}>{p.name || "total"}: {p.value}</div>
      ))}
    </div>
  );
};

/* ─── NAV ITEM ─── */
function NI({ icon: Icon, label, active, onClick }) {
  return (
    <div className={`rs2-ni ${active ? "on" : ""}`} onClick={onClick}>
      <div className="rs2-ni-ico"><Icon size={14} strokeWidth={2} /></div>
      {label}
    </div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ title, value, color, icon: Icon, sub, trend }) {
  return (
    <div className="rs2-stat">
      <div className="rs2-stat-top">
        <div className="rs2-stat-ico" style={{ background: color + "14", color }}>
          <Icon size={17} strokeWidth={2} />
        </div>
        {trend != null && (
          <span className={`rs2-stat-trend ${trend > 0 ? "up" : "dn"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="rs2-stat-lbl">{title}</div>
      <div className="rs2-stat-val">{value ?? 0}</div>
      <div className="rs2-stat-sub">{sub}</div>
      <div className="rs2-stat-stripe" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  );
}

/* ─── CHART CARD ─── */
function CC({ title, sub, badge, bColor, height = 220, children }) {
  return (
    <div className="rs2-cc">
      <div className="rs2-cc-head">
        <div>
          <div className="rs2-cc-title">{title}</div>
          {sub && <div className="rs2-cc-sub">{sub}</div>}
        </div>
        {badge && (
          <span className="rs2-cc-pill" style={{ background: (bColor || C.primary) + "14", color: bColor || C.primary }}>
            {badge}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={height} minWidth={0}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

/* ─── TOP ENTREPRISES ─── */
function TopEntreprises({ users }) {
  const counts = {};
  users.forEach(u => {
    const nom = u.profile?.entreprise?.nom;
    if (nom) counts[nom] = (counts[nom] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = sorted[0]?.[1] || 1;

  return (
    <div className="rs2-cc" style={{ flex: 1 }}>
      <div className="rs2-cc-head">
        <div>
          <div className="rs2-cc-title">Top entreprises</div>
          <div className="rs2-cc-sub">Par nombre d'alumni</div>
        </div>
        <span className="rs2-cc-pill" style={{ background: C.teal + "14", color: C.teal }}>
          {sorted.length} entreprises
        </span>
      </div>
      {sorted.length === 0 ? (
        <div className="rs2-empty" style={{ padding: "20px 0" }}>
          <Building2 size={24} style={{ opacity: .15, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
          <div style={{ fontSize: 12 }}>Aucune donnée</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sorted.map(([nom, count], i) => (
            <div className="top-ent-row" key={nom}>
              <span className="top-ent-rank">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <div className="top-ent-logo">{iniStr(nom)}</div>
              <div className="top-ent-info">
                <div className="top-ent-name">{nom}</div>
                <div className="top-ent-bar-wrap">
                  <div className="top-ent-bar" style={{ width: `${(count / max) * 100}%` }} />
                </div>
              </div>
              <span className="top-ent-ct">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════ */
export default function ResponsableDashboard() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();
  const { toasts, push: toast } = useToasts();

  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const respName = storedUser.first_name && storedUser.last_name
    ? `${storedUser.first_name} ${storedUser.last_name}` : "Responsable";
  const respInitials = respName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "RS";

  const [stats,        setStats]        = useState({});
  const [users,        setUsers]        = useState([]);
  const [allUsers,     setAllUsers]     = useState([]);
  const [growth,       setGrowth]       = useState([]);
  const [entreprises,  setEntreprises]  = useState([]);
  const [search,       setSearch]       = useState("");
  const [filters,      setFilters]      = useState({ status: "", promotion: "", job_title: "", graduation_year: "", entreprise_id: "" });
  const [selUser,      setSelUser]      = useState(null);
  const [open,         setOpen]         = useState(false);
  const [view,         setView]         = useState("dashboard");

  useEffect(() => { loadInitial(); }, []);

  const loadInitial = async () => {
    try {
      const [s, g, e] = await Promise.all([
        axios.get(`${API}/api/responsable/dashboard`, { headers }),
        axios.get(`${API}/api/responsable/growth`, { headers }),
        axios.get(`${API}/api/entreprises`, { headers }),
      ]);
      setStats(s.data);
      setGrowth(g.data);
      const entList = e.data ?? [];
      setEntreprises(entList);
      const u = await axios.get(`${API}/api/responsable/alumni`, { headers });
      const raw = u.data.data ?? [];
      const enriched = enrichAlumni(raw, entList);
      setUsers(enriched);
      setAllUsers(enriched);
    } catch { toast("Erreur de chargement", "e"); }
  };

  const applyFilter = async () => {
    try {
      const params = {};
      if (filters.status)          params.status          = filters.status;
      if (filters.promotion)       params.promotion       = filters.promotion;
      if (filters.job_title)       params.job_title       = filters.job_title;
      if (filters.graduation_year) params.graduation_year = filters.graduation_year;
      if (filters.entreprise_id)   params.entreprise_id   = filters.entreprise_id;
      const res = await axios.get(`${API}/api/responsable/alumni`, { headers, params });
      const raw = res.data.data ?? [];
      const enriched = enrichAlumni(raw, entreprises);
      setUsers(enriched);
      toast(`${enriched.length} résultat(s)`, "s");
    } catch { toast("Erreur filtre", "e"); }
  };

  const resetFilter = async () => {
    const empty = { status: "", promotion: "", job_title: "", graduation_year: "", entreprise_id: "" };
    setFilters(empty);
    try {
      const res = await axios.get(`${API}/api/responsable/alumni`, { headers });
      const raw = res.data.data ?? [];
      const enriched = enrichAlumni(raw, entreprises);
      setUsers(enriched);
    } catch { toast("Erreur réinitialisation", "e"); }
  };

  const exportExcel = async () => {
    try {
      const res = await axios.get(`${API}/api/responsable/export`, { headers, params: filters });
      const data = res.data.map(u => ({
        Nom: u.first_name, Prénom: u.last_name, Email: u.email,
        Promotion: u.profile?.promotion, Poste: u.profile?.job_title,
        Entreprise: u.profile?.entreprise?.nom || "",
        "Année": u.profile?.graduation_year, Statut: u.status,
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Alumni");
      saveAs(new Blob([XLSX.write(wb, { type: "array", bookType: "xlsx" })]), "alumni.xlsx");
      toast("Export Excel téléchargé", "s");
    } catch { toast("Erreur export", "e"); }
  };

  const viewProfile = async (id) => {
    try {
      const res = await axios.get(`${API}/api/responsable/alumni/${id}`, { headers });
      const enriched = enrichAlumni([res.data], entreprises)[0];
      setSelUser(enriched);
      setOpen(true);
    } catch { toast("Erreur chargement profil", "e"); }
  };

  const handlePDF = (user) => {
    try { exportPDF(user); toast(`PDF de ${user.first_name} généré`, "s"); }
    catch { toast("Erreur génération PDF", "e"); }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      String(u.first_name || "").toLowerCase().includes(q) ||
      String(u.last_name || "").toLowerCase().includes(q) ||
      String(u.email || "").toLowerCase().includes(q) ||
      String(u.profile?.job_title || "").toLowerCase().includes(q) ||
      String(u.profile?.promotion || "").toLowerCase().includes(q) ||
      String(u.profile?.entreprise?.nom || "").toLowerCase().includes(q)
    );
  });

  const chartData = growth.map(g => ({ date: g.date, total: g.total }));
  const barData   = growth.slice(-8).map(g => ({ date: g.date, inscrits: g.total }));
  const pieData   = [
    { name: "Avec emploi",  value: stats.with_job    || 0 },
    { name: "Sans emploi",  value: stats.without_job || 0 },
  ];
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const viewLabels = { dashboard: "Tableau de bord", alumni: "Alumni" };

  return (
    <div className="rs2">

      {/* ── SIDEBAR ── */}
      <aside className="rs2-sb">
        <div className="rs2-sb-top-accent" />
        <div className="rs2-profile">
          <div className="rs2-av-ring">
            <div className="rs2-av">{respInitials}</div>
          </div>
          <div className="rs2-profile-info">
            <div className="rs2-name">{respName}</div>
            <div className="rs2-subrole">Responsable académique</div>
            <div className="rs2-chip">Responsable</div>
          </div>
        </div>
        <nav className="rs2-nav">
          <div className="rs2-grp">Principal</div>
          <NI icon={LayoutDashboard} label="Tableau de bord" active={view === "dashboard"} onClick={() => setView("dashboard")} />
          <NI icon={Users}           label="Alumni"          active={view === "alumni"}    onClick={() => setView("alumni")} />
        </nav>
        <div className="rs2-sb-ft">
          <NI icon={LogOut} label="Déconnexion" active={false} onClick={() => navigate("/login")} />
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="rs2-main">

        {/* TOPBAR */}
        <div className="rs2-topbar">
          <div className="rs2-topbar-title">
            {viewLabels[view]}
            <span className="rs2-crumb">{viewLabels[view]}</span>
          </div>
          <div className="rs2-srch">
            <Search size={12} style={{ color: "var(--ink5)", flexShrink: 0 }} strokeWidth={2} />
            <input
              placeholder="Nom, email, entreprise…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <span style={{ cursor: "pointer", color: "var(--ink4)", flexShrink: 0 }} onClick={() => setSearch("")}>
                <X size={11} />
              </span>
            )}
          </div>
          <span className="rs2-date">{today}</span>
          <div className="rs2-bell"><Bell size={14} strokeWidth={2} /></div>
          <button className="btn btn-primary" onClick={exportExcel}>
            <Download size={12} /> Exporter
          </button>
        </div>

        {/* CONTENT */}
        <div className="rs2-content">

          {/* ══ DASHBOARD ══ */}
          {view === "dashboard" && (
            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .35 }}
            >
              {/* Banner */}
              <div className="rs2-banner">
                <div className="rs2-banner-pattern" />
                <div className="rs2-banner-dots" />
                <div className="rs2-banner-left">
                  <div className="rs2-banner-eyebrow"><Sparkles size={10} /> Espace Responsable</div>
                  <div className="rs2-banner-title">Bonjour, {storedUser.first_name || respName}</div>
                  <div className="rs2-banner-sub">Voici un aperçu en temps réel de votre réseau Alumni</div>
                </div>
                <div className="rs2-banner-right">
                  <div className="rs2-bstat">
                    <div className="rs2-bsv">{stats.total ?? 0}</div>
                    <div className="rs2-bsl">Total Alumni</div>
                  </div>
                  <div className="rs2-bstat">
                    <div className="rs2-bsv">{stats.insertion_rate ?? 0}%</div>
                    <div className="rs2-bsl">Taux insertion</div>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="rs2-stats">
                <StatCard title="Total Alumni"   value={stats.total}       color={C.primary} icon={Users}       sub="inscrits"     trend={4} />
                <StatCard title="Avec emploi"    value={stats.with_job}    color={C.green}   icon={Briefcase}   sub="placés"       trend={2} />
                <StatCard title="Sans emploi"    value={stats.without_job} color={C.rose}    icon={AlertCircle} sub="en recherche" trend={-1} />
                <StatCard title="Taux insertion" value={stats.insertion_rate ? `${stats.insertion_rate}%` : "—"} color={C.gold} icon={TrendingUp} sub="taux global" />
              </div>

              {/* Charts */}
              <div className="rs2-charts">
                <CC title="Évolution des inscriptions" sub="Croissance cumulée" badge="Tendance" bColor={C.primary}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="rs2-gc1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.primary} stopOpacity={0.18} />
                        <stop offset="100%" stopColor={C.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<LightTooltip />} />
                    <Area type="monotone" dataKey="total" stroke={C.primary} strokeWidth={2}
                      fill="url(#rs2-gc1)" dot={false} activeDot={{ r: 4, fill: C.primary }} isAnimationActive={false} />
                  </AreaChart>
                </CC>
                <CC title="Emploi vs Sans emploi" sub="Répartition actuelle">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={82} innerRadius={46}
                      paddingAngle={4} cx="50%" cy="50%" isAnimationActive={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<LightTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#64748b", fontFamily: "Plus Jakarta Sans" }} iconType="circle" iconSize={8} />
                  </PieChart>
                </CC>
              </div>

              {/* Bar + Top entreprises */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12 }}>
                <CC title="Inscriptions récentes" sub="8 dernières périodes" badge="Histogramme" bColor={C.teal}>
                  <BarChart data={barData} barSize={18}>
                    <defs>
                      <linearGradient id="rs2-bg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.primary} />
                        <stop offset="100%" stopColor={C.teal} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<LightTooltip />} />
                    <Bar dataKey="inscrits" fill="url(#rs2-bg2)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </CC>
                <TopEntreprises users={allUsers} />
              </div>

              <AlumniTable users={filtered.slice(0, 8)} onView={viewProfile} onPDF={handlePDF} />
            </motion.div>
          )}

          {/* ══ ALUMNI ══ */}
          {view === "alumni" && (
            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .3 }}
            >
              {/* Filter panel */}
              <div className="rs2-filter">
                <div className="rs2-fl"><Filter size={11} /> Filtres</div>

                <select className="rs2-fi" value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}>
                  <option value="">Tous les statuts</option>
                  <option value="approved">Approuvé</option>
                  <option value="pending">En attente</option>
                </select>

                <input className="rs2-fi" placeholder="Promotion (ex: 2022)"
                  value={filters.promotion}
                  onChange={e => setFilters({ ...filters, promotion: e.target.value })} />

                <input className="rs2-fi" placeholder="Poste / métier"
                  value={filters.job_title}
                  onChange={e => setFilters({ ...filters, job_title: e.target.value })} />

                <input className="rs2-fi" placeholder="Année diplôme"
                  value={filters.graduation_year}
                  onChange={e => setFilters({ ...filters, graduation_year: e.target.value })} />

                <select className="rs2-fi" value={filters.entreprise_id}
                  onChange={e => setFilters({ ...filters, entreprise_id: e.target.value })}>
                  <option value="">Toutes les entreprises</option>
                  {entreprises.map(ent => (
                    <option key={ent.id} value={ent.id}>{ent.nom}</option>
                  ))}
                </select>

                <button className="btn btn-primary" onClick={applyFilter}>Appliquer</button>
                <button className="btn btn-ghost" onClick={resetFilter}>Réinitialiser</button>
              </div>

              {/* Active filter badge */}
              {filters.entreprise_id && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: "var(--r3)",
                  background: "var(--primary-light)", border: "1px solid var(--primary-border)",
                  fontSize: 12, color: "var(--primary)", fontWeight: 600,
                }}>
                  <Building2 size={13} />
                  Filtré par : <strong>{entreprises.find(ent => String(ent.id) === String(filters.entreprise_id))?.nom || "Entreprise sélectionnée"}</strong>
                  <button onClick={resetFilter} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--primary)", display: "flex" }}>
                    <X size={12} />
                  </button>
                </div>
              )}

              <AlumniTable users={filtered} onView={viewProfile} onPDF={handlePDF} full />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {open && selUser && (
          <motion.div className="rs2-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setOpen(false)}>
            <motion.div className="rs2-modal"
              initial={{ opacity: 0, scale: .96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .97 }}
              transition={{ duration: .22 }}>

              <div className="rs2-m-hero">
                <div className="rs2-m-av">{ini(selUser)}</div>
                <div>
                  <div className="rs2-m-name">{selUser.first_name} {selUser.last_name}</div>
                  <div className="rs2-m-job">
                    <Briefcase size={10} />
                    {selUser.profile?.job_title || "Poste non renseigné"}
                  </div>
                </div>
                <button className="rs2-m-close" onClick={() => setOpen(false)}><X size={12} /></button>
              </div>

              <div className="rs2-m-body">
                <div className="rs2-m-sect"><Mail size={9} /> Coordonnées</div>
                <div className="rs2-m-grid">
                  <div className="rs2-m-item" style={{ gridColumn: "span 2" }}>
                    <div className="rs2-m-lbl"><Mail size={8} /> Email</div>
                    <div className="rs2-m-val">{selUser.email || "—"}</div>
                  </div>
                </div>

                <div className="rs2-m-sect"><GraduationCap size={9} /> Parcours</div>
                <div className="rs2-m-grid">
                  <div className="rs2-m-item">
                    <div className="rs2-m-lbl"><GraduationCap size={8} /> Promotion</div>
                    <div className={`rs2-m-val ${!selUser.profile?.promotion ? "muted" : ""}`}>
                      {selUser.profile?.promotion || "Non renseignée"}
                    </div>
                  </div>
                  <div className="rs2-m-item">
                    <div className="rs2-m-lbl"><Calendar size={8} /> Année diplôme</div>
                    <div className={`rs2-m-val ${!selUser.profile?.graduation_year ? "muted" : ""}`}>
                      {selUser.profile?.graduation_year || "Non renseignée"}
                    </div>
                  </div>
                </div>

                <div className="rs2-m-sect"><Briefcase size={9} /> Situation pro</div>
                <div className="rs2-m-grid">
                  <div className="rs2-m-item">
                    <div className="rs2-m-lbl"><Briefcase size={8} /> Poste</div>
                    <div className={`rs2-m-val ${!selUser.profile?.job_title ? "muted" : ""}`}>
                      {selUser.profile?.job_title || "Non renseigné"}
                    </div>
                  </div>
                  <div className="rs2-m-item">
                    <div className="rs2-m-lbl"><CheckCircle size={8} /> Statut</div>
                    <div className="rs2-m-val">
                      <span className={`bk ${selUser.status === "approved" ? "bk-ok" : "bk-pend"}`}>
                        {selUser.status === "approved" ? "Approuvé" : "En attente"}
                      </span>
                    </div>
                  </div>
                  {selUser.profile?.entreprise && (
                    <div className="rs2-m-item" style={{ gridColumn: "span 2" }}>
                      <div className="rs2-m-lbl"><Building2 size={8} /> Entreprise</div>
                      <div className="rs2-m-val">{selUser.profile.entreprise.nom || selUser.profile.entreprise_id}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rs2-m-ft">
                <button className="btn btn-ghost" onClick={() => setOpen(false)}>Fermer</button>
                <button className="btn btn-gold" onClick={() => { handlePDF(selUser); setOpen(false); }}>
                  <FileText size={12} /> Télécharger PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOASTS ── */}
      <div className="rs2-toasts">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div className="rs2-toast" key={t.id}
              initial={{ opacity: 0, x: 28, scale: .95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: .2 }}>
              <div className={`rs2-td2 ${t.type}`} />
              <span style={{ flex: 1, fontWeight: 600 }}>{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── ALUMNI TABLE ─── */
function AlumniTable({ users, onView, onPDF, full }) {
  return (
    <div className="rs2-tbl">
      <div className="rs2-tbl-hd">
        <div className="rs2-tbl-title">
          {full ? "Liste des Alumni" : "Aperçu récent"}
          <span className="rs2-tbl-ct">{users.length} résultat{users.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <div className="rs2-thead">
        <div className="rs2-th">Nom</div>
        <div className="rs2-th">Email</div>
        <div className="rs2-th">Promotion</div>
        <div className="rs2-th">Emploi</div>
        <div className="rs2-th">Entreprise</div>
        <div className="rs2-th">Actions</div>
      </div>
      <AnimatePresence>
        {users.length === 0 ? (
          <div className="rs2-empty">
            <Users size={30} style={{ opacity: .15, marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
            <div style={{ fontSize: 13 }}>Aucun alumni trouvé</div>
          </div>
        ) : users.map((u, i) => (
          <motion.div
            className="rs2-tr"
            key={u.id ?? u.email}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .14, delay: i * 0.02 }}
          >
            <div className="rs2-uc">
              <div className="rs2-av-sm" style={{ background: avC(u.id) }}>{ini(u)}</div>
              <div>
                <div className="rs2-uname">{u.first_name} {u.last_name}</div>
                <div className="rs2-usub">{u.profile?.promotion || "—"}</div>
              </div>
            </div>
            <div className="rs2-td">{u.email}</div>
            <div className="rs2-td">{u.profile?.promotion || <span style={{ color: "var(--ink5)" }}>—</span>}</div>
            <div className="rs2-td">
              {u.profile?.job_title
                ? <span className="bk bk-ok">{u.profile.job_title}</span>
                : <span className="bk bk-no">Sans emploi</span>}
            </div>
            <div className="rs2-td">
              {u.profile?.entreprise?.nom
                ? <span style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--ink3)" }}>
                    <Building2 size={11} style={{ opacity: .5 }} />
                    {u.profile.entreprise.nom}
                  </span>
                : <span style={{ color: "var(--ink5)" }}>—</span>}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className="rs2-ib" title="Voir profil" onClick={() => onView(u.id)}>
                <Eye size={12} />
              </button>
              <button className="rs2-ib pdf" title="Télécharger PDF" onClick={() => onPDF(u)}>
                <FileText size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}