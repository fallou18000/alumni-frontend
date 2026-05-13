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
  Filter, MapPin, Star, Award, ChevronRight,
  Zap, BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

/* ─── CSS ─── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cabinet+Grotesk:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

.rs3*,.rs3*::before,.rs3*::after{box-sizing:border-box;margin:0;padding:0;}
.rs3 ::-webkit-scrollbar{width:4px;height:4px;}
.rs3 ::-webkit-scrollbar-thumb{background:rgba(99,102,241,.18);border-radius:4px;}
.rs3 ::-webkit-scrollbar-track{background:transparent;}

:where(.rs3){
  --indigo:#5b5bd6;
  --indigo2:#818cf8;
  --indigo3:rgba(91,91,214,.09);
  --sky:#0ea5e9;
  --emerald:#10b981;
  --amber:#f59e0b;
  --rose:#f43f5e;
  --violet:#8b5cf6;
  --ink0:#050814;
  --ink1:#0f172a;
  --ink2:#1e293b;
  --ink3:#475569;
  --ink4:#94a3b8;
  --ink5:#cbd5e1;
  --ink6:#e2e8f0;
  --bg:#f0f4ff;
  --bg2:#f8faff;
  --white:#fff;
  --card:#fff;
  --sb:#fff;
  --border:rgba(15,23,42,.07);
  --border2:rgba(15,23,42,.12);
  --sh0:0 1px 3px rgba(15,23,42,.06),0 1px 2px rgba(15,23,42,.04);
  --sh1:0 4px 16px rgba(15,23,42,.07),0 1px 4px rgba(15,23,42,.04);
  --sh2:0 12px 40px rgba(15,23,42,.1),0 4px 12px rgba(15,23,42,.06);
  --sh3:0 24px 72px rgba(15,23,42,.14),0 8px 24px rgba(15,23,42,.08);
  --r:18px;--r2:13px;--r3:10px;
  --ff:'Cabinet Grotesk',sans-serif;
  --fs:'Instrument Serif',serif;
  --mono:'DM Mono',monospace;
}

.rs3{
  display:flex;min-height:100vh;
  font-family:var(--ff);font-size:13.5px;
  background:var(--bg);color:var(--ink2);
}

/* ═══ SIDEBAR ═══ */
.rs3 .sb{
  width:260px;flex-shrink:0;
  background:var(--sb);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;
  overflow:hidden;
  box-shadow:2px 0 16px rgba(15,23,42,.04);
}
.rs3 .sb-accent{
  height:3px;
  background:linear-gradient(90deg,var(--indigo),var(--violet),var(--sky));
}

/* ─ Profile animé ─ */
.rs3 .sb-profile{
  padding:26px 20px 22px;
  border-bottom:1px solid var(--border);
  display:flex;flex-direction:column;align-items:center;gap:12px;
  position:relative;
}
.rs3 .av-stage{
  position:relative;
  width:90px;height:90px;
  display:flex;align-items:center;justify-content:center;
}

/* Cercles tournants */
.rs3 .av-ring1{
  position:absolute;inset:0;border-radius:50%;
  border:1.5px dashed rgba(91,91,214,.25);
  animation:rs3-spin1 14s linear infinite;
}
.rs3 .av-ring2{
  position:absolute;inset:-7px;border-radius:50%;
  border:1px dashed rgba(139,92,246,.18);
  animation:rs3-spin1 20s linear infinite reverse;
}
.rs3 .av-ring3{
  position:absolute;inset:-14px;border-radius:50%;
  border:1px dashed rgba(14,165,233,.12);
  animation:rs3-spin1 28s linear infinite;
}

/* Petits satellites sur les rings */
.rs3 .av-sat{
  position:absolute;
  width:7px;height:7px;border-radius:50%;
  top:50%;left:0;transform:translateY(-50%);
}
.rs3 .av-sat1{background:var(--indigo);box-shadow:0 0 8px rgba(91,91,214,.6);}
.rs3 .av-sat2{background:var(--violet);box-shadow:0 0 8px rgba(139,92,246,.6);}
.rs3 .av-sat3{background:var(--sky);box-shadow:0 0 8px rgba(14,165,233,.6);width:5px;height:5px;}

@keyframes rs3-spin1{to{transform:rotate(360deg);}}

.rs3 .av-core{
  position:relative;z-index:2;
  width:62px;height:62px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fs);font-size:22px;font-weight:400;
  font-style:italic;color:#fff;
  background:linear-gradient(145deg,#4f46e5,#7c3aed 50%,#0ea5e9);
  box-shadow:0 0 0 4px rgba(99,102,241,.12),0 8px 24px rgba(91,91,214,.35);
}
.rs3 .av-status{
  position:absolute;bottom:4px;right:4px;z-index:3;
  width:13px;height:13px;border-radius:50%;
  background:var(--emerald);border:2.5px solid #fff;
  box-shadow:0 0 8px rgba(16,185,129,.5);
  animation:rs3-pulse 2.5s ease-in-out infinite;
}
@keyframes rs3-pulse{
  0%,100%{box-shadow:0 0 8px rgba(16,185,129,.5);}
  50%{box-shadow:0 0 14px rgba(16,185,129,.85);}
}

.rs3 .sb-name{
  font-family:var(--fs);font-size:16px;font-style:italic;
  font-weight:400;color:var(--ink1);text-align:center;
  line-height:1.2;
}
.rs3 .sb-role{font-size:10.5px;color:var(--ink4);text-align:center;}
.rs3 .sb-chip{
  font-size:9px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;
  color:var(--amber);background:rgba(245,158,11,.09);
  border:1px solid rgba(245,158,11,.22);
  padding:3px 10px;border-radius:20px;
}

/* ─ Nav ─ */
.rs3 .sb-nav{flex:1;padding:14px 10px;overflow-y:auto;}
.rs3 .sb-grp{
  font-size:8px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
  color:var(--ink5);padding:10px 12px 5px;
}
.rs3 .sb-ni{
  display:flex;align-items:center;gap:9px;padding:9px 13px;
  border-radius:10px;cursor:pointer;
  font-size:12.5px;font-weight:600;color:var(--ink3);
  transition:all .18s;margin-bottom:1px;position:relative;
}
.rs3 .sb-ni:hover{background:var(--indigo3);color:var(--indigo);}
.rs3 .sb-ni.on{background:var(--indigo3);color:var(--indigo);font-weight:700;}
.rs3 .sb-ni.on::before{
  content:'';position:absolute;left:0;top:18%;bottom:18%;
  width:3px;border-radius:0 3px 3px 0;
  background:linear-gradient(to bottom,var(--indigo),var(--violet));
}
.rs3 .sb-ni-ico{
  width:30px;height:30px;border-radius:9px;
  display:flex;align-items:center;justify-content:center;
  background:rgba(15,23,42,.04);transition:all .18s;
}
.rs3 .sb-ni.on .sb-ni-ico,.rs3 .sb-ni:hover .sb-ni-ico{
  background:rgba(91,91,214,.12);color:var(--indigo);
}
.rs3 .sb-sep{height:1px;background:var(--border);margin:8px 12px;}
.rs3 .sb-ft{padding:8px 10px 20px;border-top:1px solid var(--border);}

/* ═══ MAIN ═══ */
.rs3 .main{flex:1;display:flex;flex-direction:column;min-height:100vh;overflow:hidden;}

/* ─ Topbar ─ */
.rs3 .topbar{
  display:flex;align-items:center;gap:10px;padding:0 26px;height:64px;
  background:rgba(255,255,255,.96);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:40;backdrop-filter:blur(20px);
  box-shadow:0 1px 4px rgba(15,23,42,.06);flex-shrink:0;
}
.rs3 .topbar-title{
  flex:1;font-size:16px;font-weight:800;letter-spacing:-.3px;color:var(--ink1);
  display:flex;align-items:center;gap:8px;
}
.rs3 .crumb{
  font-size:10px;color:var(--ink4);font-weight:500;
  background:var(--bg);padding:2px 9px;border-radius:20px;
  border:1px solid var(--border);
}
.rs3 .srch{
  display:flex;align-items:center;gap:8px;
  background:var(--bg);border:1.5px solid var(--border);
  border-radius:var(--r2);padding:7px 12px;width:210px;transition:all .22s;
}
.rs3 .srch:focus-within{
  border-color:rgba(91,91,214,.3);
  box-shadow:0 0 0 3px rgba(91,91,214,.07);
  background:#fff;width:250px;
}
.rs3 .srch input{background:none;border:none;outline:none;font-size:12.5px;font-family:var(--ff);color:var(--ink2);width:100%;}
.rs3 .srch input::placeholder{color:var(--ink5);}
.rs3 .top-date{
  font-size:10.5px;color:var(--ink4);background:var(--bg);
  border:1px solid var(--border);border-radius:var(--r2);
  padding:5px 10px;white-space:nowrap;font-family:var(--mono);
}
.rs3 .bell-btn{
  width:38px;height:38px;border-radius:var(--r2);
  background:var(--bg);border:1.5px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .18s;
}
.rs3 .bell-btn:hover{border-color:rgba(91,91,214,.3);color:var(--indigo);}

/* ─ Buttons ─ */
.rs3 .btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 16px;border-radius:var(--r2);
  font-size:12px;font-weight:700;font-family:var(--ff);
  cursor:pointer;border:none;transition:all .18s;white-space:nowrap;
}
.rs3 .btn-indigo{
  background:linear-gradient(135deg,var(--indigo),var(--violet));
  color:#fff;box-shadow:0 2px 12px rgba(91,91,214,.25);
}
.rs3 .btn-indigo:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 20px rgba(91,91,214,.35);}
.rs3 .btn-ghost{
  background:var(--bg);border:1.5px solid var(--border);color:var(--ink3);
}
.rs3 .btn-ghost:hover{border-color:rgba(91,91,214,.3);color:var(--indigo);}
.rs3 .btn-amber{background:linear-gradient(135deg,var(--amber),#e67e22);color:#fff;box-shadow:0 2px 10px rgba(245,158,11,.2);}
.rs3 .btn-amber:hover{opacity:.9;transform:translateY(-1px);}

/* ═══ CONTENT ═══ */
.rs3 .content{flex:1;padding:24px 28px;overflow-y:auto;display:flex;flex-direction:column;gap:22px;}

/* ─ Banner ─ */
.rs3 .banner{
  background:linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4338ca 70%,#0284c7 100%);
  border-radius:var(--r);padding:30px 34px;
  display:flex;align-items:center;justify-content:space-between;
  position:relative;overflow:hidden;
  box-shadow:0 12px 40px rgba(67,56,202,.3);
}
.rs3 .banner-mesh{
  position:absolute;inset:0;pointer-events:none;
  background-image:
    radial-gradient(circle at 15% 85%,rgba(139,92,246,.25) 0%,transparent 45%),
    radial-gradient(circle at 85% 15%,rgba(14,165,233,.2) 0%,transparent 45%);
}
.rs3 .banner-grid{
  position:absolute;inset:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
  background-size:32px 32px;
}
.rs3 .banner-dots{
  position:absolute;right:240px;top:0;bottom:0;width:160px;pointer-events:none;
  background-image:radial-gradient(circle,rgba(255,255,255,.13) 1.5px,transparent 1.5px);
  background-size:16px 16px;
}
.rs3 .banner-left{position:relative;z-index:1;}
.rs3 .banner-eye{
  font-size:9.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
  color:rgba(199,210,254,.7);margin-bottom:8px;display:flex;align-items:center;gap:6px;
}
.rs3 .banner-title{
  font-family:var(--fs);font-size:30px;font-style:italic;
  color:#fff;line-height:1.15;margin-bottom:6px;letter-spacing:-.3px;
}
.rs3 .banner-sub{font-size:13px;color:rgba(255,255,255,.45);}
.rs3 .banner-right{
  position:relative;z-index:1;display:flex;
  background:rgba(255,255,255,.09);border-radius:var(--r2);
  border:1px solid rgba(255,255,255,.14);overflow:hidden;
  backdrop-filter:blur(10px);
}
.rs3 .bstat{padding:18px 24px;text-align:center;border-right:1px solid rgba(255,255,255,.1);}
.rs3 .bstat:last-child{border-right:none;}
.rs3 .bsv{font-family:var(--ff);font-size:32px;font-weight:900;color:#fff;letter-spacing:-2px;line-height:1;}
.rs3 .bsl{font-size:9.5px;color:rgba(255,255,255,.45);margin-top:5px;letter-spacing:.7px;text-transform:uppercase;}

/* ─ Stat cards ─ */
.rs3 .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.rs3 .stat{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);padding:22px 20px 16px;
  position:relative;overflow:hidden;transition:all .25s;
  box-shadow:var(--sh0);
}
.rs3 .stat:hover{transform:translateY(-4px);box-shadow:var(--sh2);border-color:rgba(91,91,214,.15);}
.rs3 .stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
.rs3 .stat-ico{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;}
.rs3 .stat-trend{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;font-family:var(--mono);}
.rs3 .stat-trend.up{background:rgba(16,185,129,.1);color:var(--emerald);}
.rs3 .stat-trend.dn{background:rgba(244,63,94,.1);color:var(--rose);}
.rs3 .stat-lbl{font-size:9.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink4);margin-bottom:5px;}
.rs3 .stat-val{font-size:32px;font-weight:900;letter-spacing:-2px;line-height:1;margin-bottom:4px;color:var(--ink0);}
.rs3 .stat-sub{font-size:11px;color:var(--ink4);}
.rs3 .stat-stripe{position:absolute;bottom:0;left:0;right:0;height:3px;}

/* ─ Chart cards ─ */
.rs3 .charts{display:grid;grid-template-columns:1.6fr 1fr;gap:14px;}
.rs3 .cc{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);padding:22px 24px;box-shadow:var(--sh0);
}
.rs3 .cc-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;}
.rs3 .cc-title{font-size:14.5px;font-weight:800;color:var(--ink1);letter-spacing:-.2px;}
.rs3 .cc-sub{font-size:11px;color:var(--ink4);margin-top:2px;}
.rs3 .cc-pill{font-size:9.5px;font-weight:700;padding:3px 10px;border-radius:20px;}

/* ─ Filter bar ─ */
.rs3 .filter-bar{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);padding:18px 22px;
  box-shadow:var(--sh0);display:flex;align-items:center;gap:10px;flex-wrap:wrap;
}
.rs3 .fi{
  background:var(--bg);border:1.5px solid var(--border);
  border-radius:var(--r2);padding:8px 12px;
  font-size:12.5px;font-family:var(--ff);color:var(--ink2);
  outline:none;transition:all .18s;
}
.rs3 .fi:focus{border-color:rgba(91,91,214,.3);box-shadow:0 0 0 3px rgba(91,91,214,.07);background:#fff;}
.rs3 .fi::placeholder{color:var(--ink5);}
select.fi{
  appearance:none;cursor:pointer;padding-right:28px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2394a3b8'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;
}
select.fi option{background:#fff;color:#1e293b;}

/* ═══ CARDS ALUMNI — le pièce de résistance ═══ */
.rs3 .cards-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:16px;
}

.rs3 .alumni-card{
  background:var(--white);
  border:1px solid var(--border);
  border-radius:var(--r);
  overflow:hidden;
  position:relative;
  box-shadow:var(--sh0);
  transition:all .28s cubic-bezier(.4,0,.2,1);
  cursor:default;
}
.rs3 .alumni-card:hover{
  transform:translateY(-6px);
  box-shadow:var(--sh2);
  border-color:rgba(91,91,214,.18);
}

/* Bande couleur haut */
.rs3 .ac-stripe{
  height:4px;
  background:linear-gradient(90deg,var(--indigo),var(--violet),var(--sky));
}

.rs3 .ac-body{padding:20px 20px 16px;}

/* Avatar carte */
.rs3 .ac-head{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
.rs3 .ac-av-wrap{position:relative;flex-shrink:0;}
.rs3 .ac-av{
  width:52px;height:52px;border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fs);font-size:18px;font-style:italic;
  font-weight:400;color:#fff;
  box-shadow:0 4px 14px rgba(91,91,214,.25);
}
.rs3 .ac-av-badge{
  position:absolute;bottom:-3px;right:-3px;
  width:16px;height:16px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:#fff;border:2px solid #fff;
  box-shadow:0 2px 6px rgba(15,23,42,.12);
  font-size:7px;font-weight:900;color:var(--emerald);
}
.rs3 .ac-info{flex:1;min-width:0;}
.rs3 .ac-name{
  font-size:14.5px;font-weight:800;color:var(--ink1);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  letter-spacing:-.2px;margin-bottom:3px;
}
.rs3 .ac-promo{
  display:inline-flex;align-items:center;gap:5px;
  font-size:10.5px;font-weight:600;color:var(--indigo);
  background:rgba(91,91,214,.08);border:1px solid rgba(91,91,214,.15);
  padding:2px 8px;border-radius:20px;
}

/* Infos lignes */
.rs3 .ac-rows{display:flex;flex-direction:column;gap:7px;margin-bottom:16px;}
.rs3 .ac-row{
  display:flex;align-items:center;gap:8px;
  font-size:12px;color:var(--ink3);
}
.rs3 .ac-row-ico{
  width:24px;height:24px;border-radius:7px;
  background:var(--bg);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;color:var(--ink4);
}
.rs3 .ac-row-val{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;}
.rs3 .ac-row-val.accent{color:var(--indigo);font-weight:700;}

/* Tags emploi / statut */
.rs3 .ac-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.rs3 .ac-tag{
  display:inline-flex;align-items:center;gap:5px;
  font-size:10px;font-weight:700;padding:4px 9px;border-radius:20px;
  letter-spacing:.2px;
}
.rs3 .ac-tag::before{content:'';width:5px;height:5px;border-radius:50%;}
.rs3 .tag-emerald{background:rgba(16,185,129,.09);color:var(--emerald);border:1px solid rgba(16,185,129,.2);}
.rs3 .tag-emerald::before{background:var(--emerald);}
.rs3 .tag-rose{background:rgba(244,63,94,.08);color:var(--rose);border:1px solid rgba(244,63,94,.18);}
.rs3 .tag-rose::before{background:var(--rose);}
.rs3 .tag-amber{background:rgba(245,158,11,.09);color:var(--amber);border:1px solid rgba(245,158,11,.2);}
.rs3 .tag-amber::before{background:var(--amber);}
.rs3 .tag-indigo{background:rgba(91,91,214,.09);color:var(--indigo);border:1px solid rgba(91,91,214,.18);}
.rs3 .tag-indigo::before{background:var(--indigo);}

/* Séparateur & footer card */
.rs3 .ac-footer{
  display:flex;align-items:center;justify-content:space-between;
  padding:12px 20px;
  border-top:1px solid var(--border);
  background:rgba(248,250,255,.7);
}
.rs3 .ac-email{font-size:11px;color:var(--ink4);font-family:var(--mono);letter-spacing:-.2px;}
.rs3 .ac-actions{display:flex;gap:6px;}
.rs3 .ac-btn{
  width:30px;height:30px;border-radius:9px;
  border:1.5px solid var(--border);background:none;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .16s;
}
.rs3 .ac-btn:hover{border-color:rgba(91,91,214,.3);color:var(--indigo);background:rgba(91,91,214,.07);}
.rs3 .ac-btn.pdf:hover{border-color:rgba(245,158,11,.35);color:var(--amber);background:rgba(245,158,11,.07);}

/* Cards header */
.rs3 .cards-hd{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:4px;
}
.rs3 .cards-hd-title{
  font-size:15px;font-weight:800;color:var(--ink1);letter-spacing:-.2px;
  display:flex;align-items:center;gap:8px;
}
.rs3 .cards-ct{
  font-size:11px;font-weight:700;color:var(--indigo);
  background:rgba(91,91,214,.09);border:1px solid rgba(91,91,214,.18);
  padding:3px 10px;border-radius:20px;font-family:var(--mono);
}
.rs3 .cards-empty{
  grid-column:1/-1;padding:64px 20px;text-align:center;color:var(--ink4);
  display:flex;flex-direction:column;align-items:center;gap:12px;
}

/* Entreprises top */
.rs3 .ent-row{
  display:flex;align-items:center;gap:12px;padding:10px 14px;
  border-radius:var(--r3);transition:background .14s;
}
.rs3 .ent-row:hover{background:var(--bg);}
.rs3 .ent-rank{width:20px;text-align:center;font-family:var(--mono);font-size:10px;font-weight:700;color:var(--ink4);}
.rs3 .ent-logo{
  width:32px;height:32px;border-radius:9px;
  background:rgba(91,91,214,.09);border:1px solid rgba(91,91,214,.15);
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:800;color:var(--indigo);flex-shrink:0;
}
.rs3 .ent-info{flex:1;min-width:0;}
.rs3 .ent-name{font-size:12.5px;font-weight:700;color:var(--ink2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rs3 .ent-bar-wrap{height:3px;background:rgba(15,23,42,.06);border-radius:2px;margin-top:5px;overflow:hidden;}
.rs3 .ent-bar{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--indigo),var(--sky));}
.rs3 .ent-ct{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--indigo);}

/* Modal */
.rs3 .overlay{
  position:fixed;inset:0;background:rgba(15,23,42,.45);
  backdrop-filter:blur(10px);z-index:300;
  display:flex;align-items:center;justify-content:center;
}
.rs3 .modal{
  background:#fff;border:1px solid var(--border2);
  border-radius:22px;width:530px;max-height:90vh;
  display:flex;flex-direction:column;box-shadow:var(--sh3);overflow:hidden;
}
.rs3 .m-hero{
  padding:24px 26px 20px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:16px;
  background:linear-gradient(135deg,rgba(91,91,214,.05),rgba(139,92,246,.03));
  position:relative;
}
.rs3 .m-av{
  width:56px;height:56px;border-radius:18px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fs);font-size:20px;font-style:italic;color:#fff;
  background:linear-gradient(145deg,#4f46e5,#7c3aed);
  box-shadow:0 6px 18px rgba(91,91,214,.3);
}
.rs3 .m-name{font-size:20px;font-weight:900;letter-spacing:-.4px;color:var(--ink1);}
.rs3 .m-job{font-size:12px;color:var(--ink4);display:flex;align-items:center;gap:5px;margin-top:3px;}
.rs3 .m-close{
  position:absolute;top:16px;right:18px;
  background:none;border:1.5px solid var(--border);border-radius:9px;
  width:30px;height:30px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .15s;
}
.rs3 .m-close:hover{border-color:rgba(244,63,94,.3);color:var(--rose);}
.rs3 .m-body{padding:20px 26px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:14px;}
.rs3 .m-sect{
  font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  color:var(--ink5);display:flex;align-items:center;gap:6px;
}
.rs3 .m-sect::after{content:'';flex:1;height:1px;background:var(--border);}
.rs3 .m-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.rs3 .m-item{
  background:var(--bg2);border:1.5px solid var(--border);
  border-radius:var(--r2);padding:12px 14px;transition:border-color .15s;
}
.rs3 .m-item:hover{border-color:rgba(91,91,214,.25);}
.rs3 .m-lbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink5);margin-bottom:5px;}
.rs3 .m-val{font-size:14px;font-weight:700;color:var(--ink1);}
.rs3 .m-val.muted{color:var(--ink4);font-weight:400;font-style:italic;font-size:13px;}
.rs3 .m-ft{
  padding:14px 26px;border-top:1px solid var(--border);
  display:flex;gap:8px;justify-content:flex-end;
  background:var(--bg);flex-shrink:0;
}

/* Toasts */
.rs3 .toasts{
  position:fixed;bottom:22px;right:22px;z-index:600;
  display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none;
}
.rs3 .toast{
  display:flex;align-items:center;gap:9px;
  background:#fff;border:1.5px solid var(--border2);
  border-radius:13px;padding:11px 15px;min-width:240px;
  font-size:12.5px;font-weight:600;box-shadow:var(--sh2);pointer-events:all;
  color:var(--ink2);
}
.rs3 .td{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.rs3 .td.s{background:var(--emerald);}
.rs3 .td.e{background:var(--rose);}
.rs3 .td.i{background:var(--amber);}

@media(max-width:1100px){
  .rs3 .stats{grid-template-columns:repeat(2,1fr);}
  .rs3 .charts{grid-template-columns:1fr;}
}
@media(max-width:768px){
  .rs3 .sb{display:none;}
  .rs3 .cards-grid{grid-template-columns:1fr;}
}
`;

if (typeof document !== "undefined" && !document.getElementById("rs3-css")) {
  const s = document.createElement("style"); s.id = "rs3-css"; s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── HELPERS ─── */
const AV_GRADS = [
  "linear-gradient(145deg,#4f46e5,#7c3aed)",
  "linear-gradient(145deg,#0284c7,#6366f1)",
  "linear-gradient(145deg,#f59e0b,#ef4444)",
  "linear-gradient(145deg,#10b981,#0ea5e9)",
  "linear-gradient(145deg,#8b5cf6,#ec4899)",
  "linear-gradient(145deg,#06b6d4,#3b82f6)",
];
const avC = id => AV_GRADS[(id || 0) % AV_GRADS.length];
const ini = u => ((u?.first_name?.[0] || "") + (u?.last_name?.[0] || "")).toUpperCase() || "?";
const iniStr = s => (s || "?")[0].toUpperCase();
const PIE_COLORS = ["#5b5bd6", "#f43f5e", "#f59e0b", "#0ea5e9"];
const C = { indigo: "#5b5bd6", emerald: "#10b981", rose: "#f43f5e", amber: "#f59e0b", sky: "#0ea5e9", violet: "#8b5cf6" };

const enrichAlumni = (rawList, entreprisesList) =>
  rawList.map(u => ({
    ...u,
    profile: u.profile ? {
      ...u.profile,
      entreprise: u.profile.entreprise?.nom
        ? u.profile.entreprise
        : entreprisesList.find(e => e.id === u.profile?.entreprise_id) || null,
    } : u.profile,
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
  doc.setFillColor(255, 255, 255); doc.circle(M + 12, 25, 12, "F");
  doc.setTextColor(79, 70, 229); doc.setFontSize(14); doc.setFont("helvetica", "bold");
  doc.text(ini(user), M + 12, 28.5, { align: "center" });
  doc.setFontSize(18); doc.setTextColor(255, 255, 255);
  doc.text(`${user.first_name} ${user.last_name}`, M + 30, 23);
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
  field("Entreprise", user.profile?.entreprise?.nom || "", M, 125);
  field("Statut", user.status === "approved" ? "Approuvé" : "En attente", M + 90, 125);
  doc.setFillColor(79, 70, 229); doc.rect(0, 275, W, 22, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(180, 190, 220);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} — Portail Alumni`, M, 288);
  doc.setTextColor(200, 200, 255); doc.text("CONFIDENTIEL", W - M, 288, { align: "right" });
  doc.save(`fiche_${user.first_name}_${user.last_name}.pdf`);
};

/* ─── TOOLTIP ─── */
const LightTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(15,23,42,.1)",
      borderRadius: 10, padding: "8px 13px", fontSize: 11,
      color: "#1e293b", boxShadow: "0 4px 16px rgba(15,23,42,.1)",
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
    <div className={`sb-ni ${active ? "on" : ""}`} onClick={onClick}>
      <div className="sb-ni-ico"><Icon size={14} strokeWidth={2} /></div>
      {label}
    </div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ title, value, color, icon: Icon, sub, trend }) {
  return (
    <div className="stat">
      <div className="stat-top">
        <div className="stat-ico" style={{ background: color + "14", color }}>
          <Icon size={18} strokeWidth={2} />
        </div>
        {trend != null && (
          <span className={`stat-trend ${trend > 0 ? "up" : "dn"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="stat-lbl">{title}</div>
      <div className="stat-val">{value ?? 0}</div>
      <div className="stat-sub">{sub}</div>
      <div className="stat-stripe" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  );
}

/* ─── CHART CARD ─── */
function ChartCard({ title, sub, badge, bColor, height = 220, children }) {
  return (
    <div className="cc">
      <div className="cc-head">
        <div>
          <div className="cc-title">{title}</div>
          {sub && <div className="cc-sub">{sub}</div>}
        </div>
        {badge && (
          <span className="cc-pill" style={{ background: (bColor || C.indigo) + "14", color: bColor || C.indigo }}>
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
    <div className="cc" style={{ flex: 1 }}>
      <div className="cc-head">
        <div>
          <div className="cc-title">Top entreprises</div>
          <div className="cc-sub">Par nombre d'alumni</div>
        </div>
        <span className="cc-pill" style={{ background: C.sky + "14", color: C.sky }}>
          {sorted.length} entreprises
        </span>
      </div>
      {sorted.length === 0 ? (
        <div style={{ padding: "20px", textAlign: "center", color: "var(--ink4)", fontSize: 12 }}>
          Aucune donnée
        </div>
      ) : sorted.map(([nom, count], i) => (
        <div className="ent-row" key={nom}>
          <span className="ent-rank">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
          <div className="ent-logo">{iniStr(nom)}</div>
          <div className="ent-info">
            <div className="ent-name">{nom}</div>
            <div className="ent-bar-wrap">
              <div className="ent-bar" style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </div>
          <span className="ent-ct">{count}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── ALUMNI CARD ─── */
function AlumniCard({ u, onView, onPDF, index }) {
  const hasJob = !!u.profile?.job_title;
  const approved = u.status === "approved";
  return (
    <motion.div
      className="alumni-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: .96 }}
      transition={{ duration: .22, delay: index * 0.03 }}
    >
      <div className="ac-stripe" />
      <div className="ac-body">
        {/* Head */}
        <div className="ac-head">
          <div className="ac-av-wrap">
            <div className="ac-av" style={{ background: avC(u.id) }}>{ini(u)}</div>
            <div className="ac-av-badge" style={{ color: approved ? "var(--emerald)" : "var(--amber)" }}>
              {approved ? "✓" : "~"}
            </div>
          </div>
          <div className="ac-info">
            <div className="ac-name">{u.first_name} {u.last_name}</div>
            {u.profile?.promotion && (
              <div className="ac-promo">
                <GraduationCap size={9} />
                Promo {u.profile.promotion}
              </div>
            )}
          </div>
        </div>

        {/* Rows */}
        <div className="ac-rows">
          {u.profile?.job_title && (
            <div className="ac-row">
              <div className="ac-row-ico"><Briefcase size={12} /></div>
              <span className="ac-row-val accent">{u.profile.job_title}</span>
            </div>
          )}
          {u.profile?.entreprise?.nom && (
            <div className="ac-row">
              <div className="ac-row-ico"><Building2 size={12} /></div>
              <span className="ac-row-val">{u.profile.entreprise.nom}</span>
            </div>
          )}
          {u.profile?.graduation_year && (
            <div className="ac-row">
              <div className="ac-row-ico"><Calendar size={12} /></div>
              <span className="ac-row-val">Diplômé en {u.profile.graduation_year}</span>
            </div>
          )}
          {u.profile?.degree_level && (
            <div className="ac-row">
              <div className="ac-row-ico"><Award size={12} /></div>
              <span className="ac-row-val">{u.profile.degree_level}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="ac-tags">
          <span className={`ac-tag ${hasJob ? "tag-emerald" : "tag-rose"}`}>
            {hasJob ? "En poste" : "Sans emploi"}
          </span>
          <span className={`ac-tag ${approved ? "tag-indigo" : "tag-amber"}`}>
            {approved ? "Approuvé" : "En attente"}
          </span>
          {u.profile?.status && u.profile.status !== u.status && (
            <span className="ac-tag tag-indigo">{u.profile.status}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="ac-footer">
        <span className="ac-email">{u.email}</span>
        <div className="ac-actions">
          <button className="ac-btn" title="Voir profil" onClick={() => onView(u.id)}>
            <Eye size={13} />
          </button>
          <button className="ac-btn pdf" title="Télécharger PDF" onClick={() => onPDF(u)}>
            <FileText size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── CARDS GRID ─── */
function AlumniCards({ users, onView, onPDF, full }) {
  return (
    <div>
      <div className="cards-hd">
        <div className="cards-hd-title">
          {full ? "Tous les Alumni" : "Aperçu récent"}
          <span className="cards-ct">{users.length} résultat{users.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <div style={{ height: 14 }} />
      <div className="cards-grid">
        <AnimatePresence>
          {users.length === 0 ? (
            <div className="cards-empty">
              <Users size={36} style={{ opacity: .12 }} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>Aucun alumni trouvé</div>
              <div style={{ fontSize: 11, color: "var(--ink5)" }}>Modifiez vos filtres pour voir des résultats</div>
            </div>
          ) : users.map((u, i) => (
            <AlumniCard key={u.id ?? u.email} u={u} onView={onView} onPDF={onPDF} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   ROOT
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

  const [stats,       setStats]       = useState({});
  const [users,       setUsers]       = useState([]);
  const [allUsers,    setAllUsers]    = useState([]);
  const [growth,      setGrowth]      = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [search,      setSearch]      = useState("");
  const [filters,     setFilters]     = useState({ status: "", promotion: "", job_title: "", graduation_year: "", entreprise_id: "" });
  const [selUser,     setSelUser]     = useState(null);
  const [open,        setOpen]        = useState(false);
  const [view,        setView]        = useState("dashboard");

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
      Object.keys(filters).forEach(k => { if (filters[k]) params[k] = filters[k]; });
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
      setUsers(enrichAlumni(raw, entreprises));
    } catch { toast("Erreur réinitialisation", "e"); }
  };

  const exportExcel = async () => {
    try {
      const res = await axios.get(`${API}/api/responsable/export`, { headers, params: filters });
      const data = res.data.map(u => ({
        Nom: u.first_name, Prénom: u.last_name, Email: u.email,
        Promotion: u.profile?.promotion, Poste: u.profile?.job_title,
        Entreprise: u.profile?.entreprise?.nom || "",
        Année: u.profile?.graduation_year, Statut: u.status,
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
      setSelUser(enriched); setOpen(true);
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

  return (
    <div className="rs3">

      {/* ── SIDEBAR ── */}
      <aside className="sb">
        <div className="sb-accent" />

        {/* Profil animé */}
        <div className="sb-profile">
          <div className="av-stage">
            <div className="av-ring3">
              <div className="av-sat av-sat3" style={{ top: "15%", left: "50%", transform: "translateX(-50%)" }} />
            </div>
            <div className="av-ring2">
              <div className="av-sat av-sat2" style={{ top: "50%", right: "-3px", left: "auto", transform: "translateY(-50%)" }} />
            </div>
            <div className="av-ring1">
              <div className="av-sat av-sat1" />
            </div>
            <div className="av-core">{respInitials}</div>
            <div className="av-status" />
          </div>
          <div className="sb-name">{respName}</div>
          <div className="sb-role">Responsable académique</div>
          <div className="sb-chip">Responsable</div>
        </div>

        <nav className="sb-nav">
          <div className="sb-grp">Principal</div>
          <NI icon={LayoutDashboard} label="Tableau de bord" active={view === "dashboard"} onClick={() => setView("dashboard")} />
          <NI icon={Users}           label="Alumni"          active={view === "alumni"}    onClick={() => setView("alumni")} />
        </nav>
        <div className="sb-ft">
          <NI icon={LogOut} label="Déconnexion" active={false} onClick={() => navigate("/login")} />
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">
            {view === "dashboard" ? "Tableau de bord" : "Alumni"}
            <span className="crumb">{view === "dashboard" ? "Tableau de bord" : "Alumni"}</span>
          </div>
          <div className="srch">
            <Search size={12} style={{ color: "var(--ink5)", flexShrink: 0 }} strokeWidth={2} />
            <input placeholder="Nom, email, entreprise…" value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <span style={{ cursor: "pointer", color: "var(--ink4)", flexShrink: 0 }} onClick={() => setSearch("")}>
                <X size={11} />
              </span>
            )}
          </div>
          <span className="top-date">{today}</span>
          <div className="bell-btn"><Bell size={14} strokeWidth={2} /></div>
          <button className="btn btn-indigo" onClick={exportExcel}>
            <Download size={12} /> Exporter
          </button>
        </div>

        {/* Content */}
        <div className="content">

          {/* ══ DASHBOARD ══ */}
          {view === "dashboard" && (
            <motion.div style={{ display: "flex", flexDirection: "column", gap: 22 }}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>

              {/* Banner */}
              <div className="banner">
                <div className="banner-mesh" />
                <div className="banner-grid" />
                <div className="banner-dots" />
                <div className="banner-left">
                  <div className="banner-eye"><Sparkles size={10} /> Espace Responsable</div>
                  <div className="banner-title">Bonjour, {storedUser.first_name || "Responsable"}</div>
                  <div className="banner-sub">Vue en temps réel de votre réseau Alumni</div>
                </div>
                <div className="banner-right">
                  <div className="bstat">
                    <div className="bsv">{stats.total ?? 0}</div>
                    <div className="bsl">Alumni</div>
                  </div>
                  <div className="bstat">
                    <div className="bsv">{stats.insertion_rate ?? 0}%</div>
                    <div className="bsl">Insertion</div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats">
                <StatCard title="Total Alumni"   value={stats.total}       color={C.indigo}  icon={Users}       sub="inscrits"     trend={4} />
                <StatCard title="Avec emploi"    value={stats.with_job}    color={C.emerald} icon={Briefcase}   sub="placés"       trend={2} />
                <StatCard title="Sans emploi"    value={stats.without_job} color={C.rose}    icon={AlertCircle} sub="en recherche" trend={-1} />
                <StatCard title="Taux insertion" value={stats.insertion_rate ? `${stats.insertion_rate}%` : "—"} color={C.amber} icon={TrendingUp} sub="taux global" />
              </div>

              {/* Charts */}
              <div className="charts">
                <ChartCard title="Évolution des inscriptions" sub="Croissance cumulée" badge="Tendance" bColor={C.indigo}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="rs3-g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.indigo} stopOpacity={0.16} />
                        <stop offset="100%" stopColor={C.indigo} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<LightTip />} />
                    <Area type="monotone" dataKey="total" stroke={C.indigo} strokeWidth={2.5}
                      fill="url(#rs3-g1)" dot={false} activeDot={{ r: 4, fill: C.indigo }} isAnimationActive={false} />
                  </AreaChart>
                </ChartCard>
                <ChartCard title="Emploi vs Sans emploi" sub="Répartition actuelle">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={82} innerRadius={46}
                      paddingAngle={4} cx="50%" cy="50%" isAnimationActive={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<LightTip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} iconType="circle" iconSize={8} />
                  </PieChart>
                </ChartCard>
              </div>

              {/* Bar + top ent */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
                <ChartCard title="Inscriptions récentes" sub="8 dernières périodes" badge="Histogramme" bColor={C.sky}>
                  <BarChart data={barData} barSize={18}>
                    <defs>
                      <linearGradient id="rs3-g2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.indigo} />
                        <stop offset="100%" stopColor={C.sky} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<LightTip />} />
                    <Bar dataKey="inscrits" fill="url(#rs3-g2)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ChartCard>
                <TopEntreprises users={allUsers} />
              </div>

              <AlumniCards users={filtered.slice(0, 6)} onView={viewProfile} onPDF={handlePDF} />
            </motion.div>
          )}

          {/* ══ ALUMNI ══ */}
          {view === "alumni" && (
            <motion.div style={{ display: "flex", flexDirection: "column", gap: 18 }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>

              {/* Filters */}
              <div className="filter-bar">
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "8.5px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--ink4)" }}>
                  <Filter size={11} /> Filtres
                </div>
                <select className="fi" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                  <option value="">Tous les statuts</option>
                  <option value="approved">Approuvé</option>
                  <option value="pending">En attente</option>
                </select>
                <input className="fi" placeholder="Promotion (ex: 2022)" value={filters.promotion}
                  onChange={e => setFilters({ ...filters, promotion: e.target.value })} />
                <input className="fi" placeholder="Poste / métier" value={filters.job_title}
                  onChange={e => setFilters({ ...filters, job_title: e.target.value })} />
                <input className="fi" placeholder="Année diplôme" value={filters.graduation_year}
                  onChange={e => setFilters({ ...filters, graduation_year: e.target.value })} />
                <select className="fi" value={filters.entreprise_id}
                  onChange={e => setFilters({ ...filters, entreprise_id: e.target.value })}>
                  <option value="">Toutes les entreprises</option>
                  {entreprises.map(ent => <option key={ent.id} value={ent.id}>{ent.nom}</option>)}
                </select>
                <button className="btn btn-indigo" onClick={applyFilter}>Appliquer</button>
                <button className="btn btn-ghost" onClick={resetFilter}>Réinitialiser</button>
              </div>

              {filters.entreprise_id && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "9px 15px",
                  borderRadius: "var(--r3)", background: "rgba(91,91,214,.07)",
                  border: "1px solid rgba(91,91,214,.18)", fontSize: 12, color: "var(--indigo)", fontWeight: 600,
                }}>
                  <Building2 size={13} />
                  Filtré par : <strong>{entreprises.find(e => String(e.id) === String(filters.entreprise_id))?.nom || "Entreprise"}</strong>
                  <button onClick={resetFilter} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--indigo)", display: "flex" }}>
                    <X size={12} />
                  </button>
                </div>
              )}

              <AlumniCards users={filtered} onView={viewProfile} onPDF={handlePDF} full />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── MODAL PROFIL ── */}
      <AnimatePresence>
        {open && selUser && (
          <motion.div className="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setOpen(false)}>
            <motion.div className="modal"
              initial={{ opacity: 0, scale: .95, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .97 }}
              transition={{ duration: .22 }}>
              <div className="m-hero">
                <div className="m-av">{ini(selUser)}</div>
                <div>
                  <div className="m-name">{selUser.first_name} {selUser.last_name}</div>
                  <div className="m-job"><Briefcase size={10} />{selUser.profile?.job_title || "Poste non renseigné"}</div>
                </div>
                <button className="m-close" onClick={() => setOpen(false)}><X size={13} /></button>
              </div>
              <div className="m-body">
                <div className="m-sect"><Mail size={9} /> Coordonnées</div>
                <div className="m-grid">
                  <div className="m-item" style={{ gridColumn: "span 2" }}>
                    <div className="m-lbl">Email</div>
                    <div className="m-val">{selUser.email || "—"}</div>
                  </div>
                </div>
                <div className="m-sect"><GraduationCap size={9} /> Parcours</div>
                <div className="m-grid">
                  <div className="m-item">
                    <div className="m-lbl">Promotion</div>
                    <div className={`m-val ${!selUser.profile?.promotion ? "muted" : ""}`}>{selUser.profile?.promotion || "Non renseignée"}</div>
                  </div>
                  <div className="m-item">
                    <div className="m-lbl">Année diplôme</div>
                    <div className={`m-val ${!selUser.profile?.graduation_year ? "muted" : ""}`}>{selUser.profile?.graduation_year || "Non renseignée"}</div>
                  </div>
                </div>
                <div className="m-sect"><Briefcase size={9} /> Situation pro</div>
                <div className="m-grid">
                  <div className="m-item">
                    <div className="m-lbl">Poste</div>
                    <div className={`m-val ${!selUser.profile?.job_title ? "muted" : ""}`}>{selUser.profile?.job_title || "Non renseigné"}</div>
                  </div>
                  <div className="m-item">
                    <div className="m-lbl">Statut</div>
                    <div className="m-val">
                      <span className={`ac-tag ${selUser.status === "approved" ? "tag-emerald" : "tag-amber"}`}
                        style={{ display: "inline-flex" }}>
                        {selUser.status === "approved" ? "Approuvé" : "En attente"}
                      </span>
                    </div>
                  </div>
                  {selUser.profile?.entreprise && (
                    <div className="m-item" style={{ gridColumn: "span 2" }}>
                      <div className="m-lbl">Entreprise</div>
                      <div className="m-val">{selUser.profile.entreprise.nom || "—"}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="m-ft">
                <button className="btn btn-ghost" onClick={() => setOpen(false)}>Fermer</button>
                <button className="btn btn-amber" onClick={() => { handlePDF(selUser); setOpen(false); }}>
                  <FileText size={12} /> Télécharger PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOASTS ── */}
      <div className="toasts">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div className="toast" key={t.id}
              initial={{ opacity: 0, x: 28, scale: .95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: .2 }}>
              <div className={`td ${t.type}`} />
              <span>{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}