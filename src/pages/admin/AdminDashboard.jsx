import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, Users, UserCheck, Shield,
  Search, Bell, Plus, Trash2, Edit, X,
  Download, ChevronRight, GraduationCap,
  Building2, BookOpen, Settings, LogOut,
  Filter, ChevronDown, Sparkles, Mail, Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

/* ════════════════════════════════════════
   CSS — même design system que ResponsableDashboard
════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Cabinet+Grotesk:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

.adm2*,.adm2*::before,.adm2*::after{box-sizing:border-box;margin:0;padding:0;}
.adm2 ::-webkit-scrollbar{width:4px;height:4px;}
.adm2 ::-webkit-scrollbar-thumb{background:rgba(99,102,241,.18);border-radius:4px;}
.adm2 ::-webkit-scrollbar-track{background:transparent;}

:where(.adm2){
  --p:#6366f1;
  --p2:#818cf8;
  --pl:rgba(99,102,241,.09);
  --pb:rgba(99,102,241,.2);
  --sky:#0ea5e9;
  --em:#10b981;
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
  --bg:#f0f2f9;
  --bg2:#f8faff;
  --white:#fff;
  --border:rgba(15,23,42,.07);
  --border2:rgba(15,23,42,.12);
  --sh0:0 1px 3px rgba(15,23,42,.06),0 1px 2px rgba(15,23,42,.04);
  --sh1:0 4px 16px rgba(15,23,42,.07),0 1px 4px rgba(15,23,42,.04);
  --sh2:0 12px 40px rgba(15,23,42,.10),0 4px 12px rgba(15,23,42,.06);
  --sh3:0 24px 72px rgba(15,23,42,.14),0 8px 24px rgba(15,23,42,.08);
  --r:18px;--r2:13px;--r3:10px;
  --ff:'Cabinet Grotesk',sans-serif;
  --fs:'Instrument Serif',serif;
  --mono:'DM Mono',monospace;
}

.adm2{
  display:flex;min-height:100vh;
  font-family:var(--ff);font-size:13.5px;
  background:var(--bg);color:var(--ink2);
}

/* ═══ SIDEBAR ═══ */
.adm2 .sb{
  width:260px;flex-shrink:0;
  background:var(--white);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;
  overflow:hidden;
  box-shadow:2px 0 16px rgba(15,23,42,.04);
}
.adm2 .sb-accent{
  height:3px;
  background:linear-gradient(90deg,var(--p),var(--violet),var(--sky));
}

/* ─ Profil animé ─ */
.adm2 .sb-profile{
  padding:26px 20px 22px;
  border-bottom:1px solid var(--border);
  display:flex;flex-direction:column;align-items:center;gap:12px;
}
.adm2 .av-stage{
  position:relative;width:90px;height:90px;
  display:flex;align-items:center;justify-content:center;
}
.adm2 .av-ring1{
  position:absolute;inset:0;border-radius:50%;
  border:1.5px dashed rgba(99,102,241,.22);
  animation:adm2-spin 13s linear infinite;
}
.adm2 .av-ring2{
  position:absolute;inset:-7px;border-radius:50%;
  border:1px dashed rgba(139,92,246,.16);
  animation:adm2-spin 19s linear infinite reverse;
}
.adm2 .av-ring3{
  position:absolute;inset:-14px;border-radius:50%;
  border:1px dashed rgba(244,63,94,.1);
  animation:adm2-spin 27s linear infinite;
}
.adm2 .av-sat{
  position:absolute;border-radius:50%;
  top:50%;transform:translateY(-50%);
}
.adm2 .av-sat1{width:7px;height:7px;left:-3px;background:var(--p);box-shadow:0 0 8px rgba(99,102,241,.65);}
.adm2 .av-sat2{width:7px;height:7px;right:-3px;left:auto;background:var(--violet);box-shadow:0 0 8px rgba(139,92,246,.65);}
.adm2 .av-sat3{width:5px;height:5px;left:50%;transform:translate(-50%,-200%);background:var(--rose);box-shadow:0 0 7px rgba(244,63,94,.65);}
@keyframes adm2-spin{to{transform:rotate(360deg);}}

.adm2 .av-core{
  position:relative;z-index:2;
  width:62px;height:62px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fs);font-size:22px;font-style:italic;color:#fff;
  background:linear-gradient(145deg,#4f46e5,#7c3aed 50%,#f43f5e);
  box-shadow:0 0 0 4px rgba(99,102,241,.12),0 8px 24px rgba(99,102,241,.35);
}
.adm2 .av-status{
  position:absolute;bottom:4px;right:4px;z-index:3;
  width:13px;height:13px;border-radius:50%;
  background:var(--em);border:2.5px solid #fff;
  box-shadow:0 0 8px rgba(16,185,129,.5);
  animation:adm2-pulse 2.5s ease-in-out infinite;
}
@keyframes adm2-pulse{
  0%,100%{box-shadow:0 0 8px rgba(16,185,129,.5);}
  50%{box-shadow:0 0 14px rgba(16,185,129,.85);}
}

.adm2 .sb-name{
  font-family:var(--fs);font-size:16px;font-style:italic;
  color:var(--ink1);text-align:center;line-height:1.2;
}
.adm2 .sb-role{font-size:10.5px;color:var(--ink4);text-align:center;margin-top:1px;}
.adm2 .sb-chip{
  font-size:9px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;
  color:var(--rose);background:rgba(244,63,94,.08);
  border:1px solid rgba(244,63,94,.2);
  padding:3px 10px;border-radius:20px;
}

/* ─ Nav ─ */
.adm2 .sb-nav{flex:1;padding:14px 10px;overflow-y:auto;}
.adm2 .sb-grp{
  font-size:8px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
  color:var(--ink5);padding:10px 12px 5px;
}
.adm2 .sb-ni{
  display:flex;align-items:center;gap:9px;padding:9px 13px;
  border-radius:10px;cursor:pointer;
  font-size:12.5px;font-weight:600;color:var(--ink3);
  transition:all .18s;margin-bottom:1px;position:relative;
}
.adm2 .sb-ni:hover{background:var(--pl);color:var(--p);}
.adm2 .sb-ni.on{background:var(--pl);color:var(--p);font-weight:700;}
.adm2 .sb-ni.on::before{
  content:'';position:absolute;left:0;top:18%;bottom:18%;
  width:3px;border-radius:0 3px 3px 0;
  background:linear-gradient(to bottom,var(--p),var(--violet));
}
.adm2 .sb-ni-ico{
  width:30px;height:30px;border-radius:9px;
  display:flex;align-items:center;justify-content:center;
  background:rgba(15,23,42,.04);transition:all .18s;
}
.adm2 .sb-ni.on .sb-ni-ico,.adm2 .sb-ni:hover .sb-ni-ico{
  background:rgba(99,102,241,.12);color:var(--p);
}
.adm2 .sb-badge{
  margin-left:auto;font-size:10px;font-weight:700;
  background:var(--rose);color:#fff;padding:1px 6px;
  border-radius:20px;min-width:20px;text-align:center;
}
.adm2 .sb-sep{height:1px;background:var(--border);margin:8px 12px;}
.adm2 .sb-ft{padding:8px 10px 20px;border-top:1px solid var(--border);}

/* ═══ MAIN ═══ */
.adm2 .main{flex:1;display:flex;flex-direction:column;min-height:100vh;overflow:hidden;}

/* ─ Topbar ─ */
.adm2 .topbar{
  display:flex;align-items:center;gap:10px;padding:0 26px;height:64px;
  background:rgba(255,255,255,.96);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:40;backdrop-filter:blur(20px);
  box-shadow:0 1px 4px rgba(15,23,42,.06);flex-shrink:0;
}
.adm2 .topbar-title{
  flex:1;font-size:16px;font-weight:800;letter-spacing:-.3px;color:var(--ink1);
  display:flex;align-items:center;gap:8px;
}
.adm2 .crumb{
  font-size:10px;color:var(--ink4);font-weight:500;
  background:var(--bg);padding:2px 9px;border-radius:20px;border:1px solid var(--border);
}
.adm2 .srch{
  display:flex;align-items:center;gap:8px;
  background:var(--bg);border:1.5px solid var(--border);
  border-radius:var(--r2);padding:7px 12px;width:210px;transition:all .22s;
}
.adm2 .srch:focus-within{
  border-color:var(--pb);box-shadow:0 0 0 3px rgba(99,102,241,.07);
  background:#fff;width:250px;
}
.adm2 .srch input{background:none;border:none;outline:none;font-size:12.5px;font-family:var(--ff);color:var(--ink2);width:100%;}
.adm2 .srch input::placeholder{color:var(--ink5);}

.adm2 .role-filter{
  display:flex;align-items:center;gap:7px;
  background:var(--bg);border:1.5px solid var(--border);
  border-radius:var(--r2);padding:7px 11px;cursor:pointer;transition:all .2s;
}
.adm2 .role-filter:hover{border-color:var(--pb);}
.adm2 .role-filter select{
  background:transparent;border:none;outline:none;
  font-size:12px;font-family:var(--ff);color:var(--ink2);
  cursor:pointer;appearance:none;min-width:90px;
}
.adm2 .count-pill{
  font-size:11px;color:var(--p);font-weight:700;
  background:var(--pl);border:1px solid var(--pb);
  border-radius:20px;padding:3px 10px;white-space:nowrap;
}
.adm2 .top-date{
  font-size:10.5px;color:var(--ink4);background:var(--bg);
  border:1px solid var(--border);border-radius:var(--r2);
  padding:5px 10px;white-space:nowrap;font-family:var(--mono);
}
.adm2 .bell-wrap{position:relative;}
.adm2 .bell-btn{
  width:38px;height:38px;border-radius:var(--r2);
  background:var(--bg);border:1.5px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .18s;
}
.adm2 .bell-btn:hover{border-color:var(--pb);color:var(--p);}
.adm2 .bell-dot{
  position:absolute;top:-5px;right:-5px;
  background:var(--rose);color:#fff;border-radius:50%;
  width:18px;height:18px;font-size:9.5px;font-weight:700;
  display:flex;align-items:center;justify-content:center;
  border:2px solid #fff;
}

/* Notif panel */
.adm2 .notif-panel{
  position:absolute;right:0;top:48px;width:320px;
  background:var(--white);border:1px solid var(--border2);
  border-radius:var(--r);box-shadow:var(--sh3);z-index:100;overflow:hidden;
}
.adm2 .notif-head{
  padding:14px 18px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  background:linear-gradient(135deg,rgba(99,102,241,.04),rgba(139,92,246,.02));
}
.adm2 .notif-head-title{font-size:13px;font-weight:800;color:var(--ink1);}
.adm2 .notif-item{
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 18px;border-bottom:1px solid var(--border);
  transition:background .15s;gap:10px;
}
.adm2 .notif-item:hover{background:var(--bg);}
.adm2 .notif-item:last-child{border-bottom:none;}
.adm2 .notif-name{font-size:12.5px;font-weight:700;color:var(--ink1);}
.adm2 .notif-sub{font-size:10.5px;color:var(--ink4);margin-top:2px;}
.adm2 .approve-btn{
  background:linear-gradient(135deg,var(--em),var(--sky));color:#fff;border:none;
  padding:5px 12px;border-radius:8px;font-size:11px;font-weight:700;
  cursor:pointer;font-family:var(--ff);white-space:nowrap;flex-shrink:0;
}
.adm2 .approve-btn:hover{opacity:.85;}
.adm2 .notif-empty{padding:28px;text-align:center;color:var(--ink4);font-size:13px;}

/* ─ Buttons ─ */
.adm2 .btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 16px;border-radius:var(--r2);
  font-size:12px;font-weight:700;font-family:var(--ff);
  cursor:pointer;border:none;transition:all .18s;white-space:nowrap;
}
.adm2 .btn-primary{
  background:linear-gradient(135deg,var(--p),var(--violet));
  color:#fff;box-shadow:0 2px 12px rgba(99,102,241,.25);
}
.adm2 .btn-primary:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 20px rgba(99,102,241,.35);}
.adm2 .btn-teal{background:linear-gradient(135deg,var(--em),var(--sky));color:#fff;box-shadow:0 2px 10px rgba(16,185,129,.2);}
.adm2 .btn-teal:hover{opacity:.9;transform:translateY(-1px);}
.adm2 .btn-ghost{background:var(--bg);border:1.5px solid var(--border);color:var(--ink3);}
.adm2 .btn-ghost:hover{border-color:var(--pb);color:var(--p);background:var(--pl);}

/* ═══ CONTENT ═══ */
.adm2 .content{flex:1;padding:24px 28px;overflow-y:auto;display:flex;flex-direction:column;gap:22px;}

/* ─ Banner ─ */
.adm2 .banner{
  background:linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4338ca 70%,#0284c7 100%);
  border-radius:var(--r);padding:30px 34px;
  display:flex;align-items:center;justify-content:space-between;
  position:relative;overflow:hidden;
  box-shadow:0 12px 40px rgba(67,56,202,.3);
}
.adm2 .banner-mesh{
  position:absolute;inset:0;pointer-events:none;
  background-image:
    radial-gradient(circle at 15% 85%,rgba(139,92,246,.22) 0%,transparent 45%),
    radial-gradient(circle at 85% 15%,rgba(14,165,233,.18) 0%,transparent 45%);
}
.adm2 .banner-grid{
  position:absolute;inset:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);
  background-size:32px 32px;
}
.adm2 .banner-dots{
  position:absolute;right:240px;top:0;bottom:0;width:160px;pointer-events:none;
  background-image:radial-gradient(circle,rgba(255,255,255,.13) 1.5px,transparent 1.5px);
  background-size:16px 16px;
}
.adm2 .banner-left{position:relative;z-index:1;}
.adm2 .banner-eye{
  font-size:9.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
  color:rgba(199,210,254,.7);margin-bottom:8px;display:flex;align-items:center;gap:6px;
}
.adm2 .banner-title{
  font-family:var(--fs);font-size:30px;font-style:italic;
  color:#fff;line-height:1.15;margin-bottom:6px;letter-spacing:-.3px;
}
.adm2 .banner-sub{font-size:13px;color:rgba(255,255,255,.45);}
.adm2 .banner-right{
  position:relative;z-index:1;display:flex;
  background:rgba(255,255,255,.09);border-radius:var(--r2);
  border:1px solid rgba(255,255,255,.14);overflow:hidden;backdrop-filter:blur(10px);
}
.adm2 .bstat{padding:18px 24px;text-align:center;border-right:1px solid rgba(255,255,255,.1);}
.adm2 .bstat:last-child{border-right:none;}
.adm2 .bsv{font-family:var(--ff);font-size:32px;font-weight:900;color:#fff;letter-spacing:-2px;line-height:1;}
.adm2 .bsl{font-size:9.5px;color:rgba(255,255,255,.45);margin-top:5px;letter-spacing:.7px;text-transform:uppercase;}

/* ─ Stat cards ─ */
.adm2 .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
.adm2 .stat{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);padding:22px 20px 16px;
  position:relative;overflow:hidden;transition:all .25s;
  box-shadow:var(--sh0);
}
.adm2 .stat:hover{transform:translateY(-4px);box-shadow:var(--sh2);border-color:var(--pb);}
.adm2 .stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px;}
.adm2 .stat-ico{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;}
.adm2 .stat-trend{font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;font-family:var(--mono);}
.adm2 .stat-trend.up{background:rgba(16,185,129,.1);color:var(--em);}
.adm2 .stat-lbl{font-size:9.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink4);margin-bottom:5px;}
.adm2 .stat-val{font-size:32px;font-weight:900;letter-spacing:-2px;line-height:1;margin-bottom:4px;color:var(--ink0);}
.adm2 .stat-sub{font-size:11px;color:var(--ink4);}
.adm2 .stat-stripe{position:absolute;bottom:0;left:0;right:0;height:3px;}

/* ─ Charts ─ */
.adm2 .charts{display:grid;grid-template-columns:1.5fr 1fr;gap:14px;}
.adm2 .cc{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);padding:22px 24px;box-shadow:var(--sh0);
}
.adm2 .cc-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;}
.adm2 .cc-title{font-size:14.5px;font-weight:800;color:var(--ink1);letter-spacing:-.2px;}
.adm2 .cc-sub{font-size:11px;color:var(--ink4);margin-top:2px;}
.adm2 .cc-pill{font-size:9.5px;font-weight:700;padding:3px 10px;border-radius:20px;}

/* ═══ USER CARDS ═══ */
.adm2 .cards-wrap{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);overflow:hidden;box-shadow:var(--sh0);
}
.adm2 .cards-hd{
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 24px;border-bottom:1px solid var(--border);
  flex-wrap:wrap;gap:10px;
  background:linear-gradient(135deg,rgba(99,102,241,.025),rgba(139,92,246,.015));
}
.adm2 .cards-title{
  font-size:14.5px;font-weight:800;letter-spacing:-.2px;color:var(--ink1);
  display:flex;align-items:center;gap:8px;
}
.adm2 .cards-ct{
  font-size:10.5px;color:var(--p);font-weight:700;
  background:var(--pl);padding:2px 9px;
  border-radius:20px;border:1px solid var(--pb);font-family:var(--mono);
}
.adm2 .cards-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(280px,1fr));
  gap:14px;padding:18px 20px;
}
.adm2 .cards-empty{
  padding:56px 20px;text-align:center;color:var(--ink4);
  display:flex;flex-direction:column;align-items:center;gap:12px;
}

/* ─ Chaque carte user ─ */
.adm2 .user-card{
  background:var(--bg2);border:1.5px solid var(--border);
  border-radius:var(--r2);overflow:hidden;
  transition:all .28s cubic-bezier(.4,0,.2,1);
  position:relative;
}
.adm2 .user-card:hover{
  transform:translateY(-5px);
  box-shadow:var(--sh2);border-color:var(--pb);
  background:var(--white);
}
.adm2 .uc-stripe{height:4px;}
.adm2 .uc-body{padding:16px 16px 14px;}
.adm2 .uc-head{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.adm2 .uc-av-wrap{position:relative;flex-shrink:0;}
.adm2 .uc-av{
  width:48px;height:48px;border-radius:14px;
  display:flex;align-items:center;justify-content:center;
  font-family:var(--fs);font-size:17px;font-style:italic;color:#fff;
  box-shadow:0 4px 12px rgba(99,102,241,.22);
}
.adm2 .uc-av-badge{
  position:absolute;bottom:-3px;right:-3px;
  width:15px;height:15px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  background:#fff;border:2px solid #fff;
  box-shadow:0 2px 6px rgba(15,23,42,.12);
  font-size:7px;font-weight:900;
}
.adm2 .uc-info{flex:1;min-width:0;}
.adm2 .uc-name{
  font-size:14px;font-weight:800;color:var(--ink1);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.2px;
  margin-bottom:4px;
}
.adm2 .uc-num{
  display:flex;align-items:center;gap:4px;
  font-size:10.5px;color:var(--ink4);font-family:var(--mono);
}

/* Lignes meta */
.adm2 .uc-rows{display:flex;flex-direction:column;gap:6px;margin-bottom:13px;}
.adm2 .uc-row{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--ink3);}
.adm2 .uc-row-ico{
  width:22px;height:22px;border-radius:6px;
  background:var(--bg);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;color:var(--ink4);
}
.adm2 .uc-row-val{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;}

/* Tags */
.adm2 .uc-tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:13px;}
.adm2 .uc-tag{
  display:inline-flex;align-items:center;gap:4px;
  font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:.15px;
}
.adm2 .uc-tag::before{content:'';width:5px;height:5px;border-radius:50%;}
.adm2 .tag-ok{background:rgba(16,185,129,.09);color:var(--em);border:1px solid rgba(16,185,129,.2);}
.adm2 .tag-ok::before{background:var(--em);}
.adm2 .tag-pend{background:rgba(245,158,11,.09);color:var(--amber);border:1px solid rgba(245,158,11,.2);}
.adm2 .tag-pend::before{background:var(--amber);}
.adm2 .tag-admin{background:rgba(244,63,94,.09);color:var(--rose);border:1px solid rgba(244,63,94,.18);}
.adm2 .tag-admin::before{background:var(--rose);}
.adm2 .tag-alumni{background:rgba(99,102,241,.09);color:var(--p);border:1px solid rgba(99,102,241,.18);}
.adm2 .tag-alumni::before{background:var(--p);}
.adm2 .tag-resp{background:rgba(245,158,11,.09);color:var(--amber);border:1px solid rgba(245,158,11,.18);}
.adm2 .tag-resp::before{background:var(--amber);}

/* Footer carte */
.adm2 .uc-footer{
  display:flex;align-items:center;justify-content:flex-end;
  padding:10px 16px;border-top:1px solid var(--border);
  background:rgba(248,250,255,.7);gap:5px;
}
.adm2 .uc-btn{
  width:30px;height:30px;border-radius:9px;
  border:1.5px solid var(--border);background:none;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .16s;
}
.adm2 .uc-btn:hover{border-color:var(--pb);color:var(--p);background:var(--pl);}
.adm2 .uc-btn.del:hover{border-color:rgba(244,63,94,.3);color:var(--rose);background:rgba(244,63,94,.07);}
.adm2 .uc-btn.app:hover{border-color:rgba(16,185,129,.3);color:var(--em);background:rgba(16,185,129,.07);}

/* ─ Struct ─ */
.adm2 .struct-wrap{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);padding:30px 32px;max-width:520px;
  box-shadow:var(--sh0);position:relative;overflow:hidden;
}
.adm2 .struct-wrap::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--p),var(--violet));
}
.adm2 .struct-eye{font-size:9.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--p);margin-bottom:6px;}
.adm2 .struct-title{font-family:var(--fs);font-size:22px;font-style:italic;letter-spacing:-.3px;margin-bottom:24px;color:var(--ink1);}
.adm2 .struct-fld{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
.adm2 .struct-fld label{font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink3);}
.adm2 .struct-fld input,.adm2 .struct-fld select{
  background:var(--bg);border:1.5px solid var(--border);border-radius:var(--r2);
  padding:11px 14px;font-size:13px;font-family:var(--ff);color:var(--ink1);
  outline:none;transition:all .18s;width:100%;
}
.adm2 .struct-fld input:focus,.adm2 .struct-fld select:focus{
  border-color:var(--pb);box-shadow:0 0 0 3px rgba(99,102,241,.08);background:var(--white);
}
.adm2 .struct-fld input::placeholder{color:var(--ink5);}
.adm2 .struct-fld select:disabled{opacity:.4;cursor:not-allowed;}

/* ─ Modal ─ */
.adm2 .overlay{
  position:fixed;inset:0;background:rgba(15,23,42,.45);
  backdrop-filter:blur(10px);z-index:300;
  display:flex;align-items:center;justify-content:center;
}
.adm2 .modal{
  background:#fff;border:1px solid var(--border2);
  border-radius:22px;width:500px;max-height:90vh;
  display:flex;flex-direction:column;box-shadow:var(--sh3);overflow:hidden;
}
.adm2 .modal-hd{
  padding:22px 24px 18px;border-bottom:1px solid var(--border);
  display:flex;align-items:flex-start;justify-content:space-between;
  background:linear-gradient(135deg,rgba(99,102,241,.05),rgba(139,92,246,.03));
}
.adm2 .modal-eye{font-size:9.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--p);margin-bottom:5px;}
.adm2 .modal-ttl{font-family:var(--fs);font-size:19px;font-style:italic;color:var(--ink1);}
.adm2 .modal-x{
  background:none;border:1.5px solid var(--border);border-radius:9px;
  width:30px;height:30px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .15s;margin-top:2px;
}
.adm2 .modal-x:hover{border-color:rgba(244,63,94,.3);color:var(--rose);}
.adm2 .modal-body{padding:20px 24px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:13px;}
.adm2 .modal-ft{
  padding:14px 24px;border-top:1px solid var(--border);
  display:flex;gap:8px;justify-content:flex-end;background:var(--bg);
}
.adm2 .row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.adm2 .fld{display:flex;flex-direction:column;gap:5px;}
.adm2 .fld label{font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink3);}
.adm2 .fld input,.adm2 .fld select{
  background:var(--bg);border:1.5px solid var(--border);border-radius:var(--r2);
  padding:10px 13px;font-size:13px;font-family:var(--ff);color:var(--ink1);
  outline:none;transition:all .18s;width:100%;
}
.adm2 .fld input:focus,.adm2 .fld select:focus{border-color:var(--pb);box-shadow:0 0 0 3px rgba(99,102,241,.08);background:#fff;}
.adm2 .fld input:disabled,.adm2 .fld select:disabled{opacity:.4;cursor:not-allowed;}
.adm2 .fld input::placeholder{color:var(--ink5);}

/* ─ Toasts ─ */
.adm2 .toasts{
  position:fixed;bottom:22px;right:22px;z-index:600;
  display:flex;flex-direction:column;gap:8px;align-items:flex-end;pointer-events:none;
}
.adm2 .toast{
  display:flex;align-items:center;gap:9px;
  background:#fff;border:1.5px solid var(--border2);
  border-radius:13px;padding:11px 15px;min-width:240px;
  font-size:12.5px;font-weight:600;box-shadow:var(--sh2);pointer-events:all;color:var(--ink2);
}
.adm2 .td{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.adm2 .td.success{background:var(--em);}
.adm2 .td.error{background:var(--rose);}
.adm2 .td.info{background:var(--amber);}

@media(max-width:1100px){
  .adm2 .stats{grid-template-columns:repeat(2,1fr);}
  .adm2 .charts{grid-template-columns:1fr;}
}
@media(max-width:768px){
  .adm2 .sb{display:none;}
  .adm2 .cards-grid{grid-template-columns:1fr;}
}
`;

if (typeof document !== "undefined" && !document.getElementById("adm2-css")) {
  const s = document.createElement("style"); s.id = "adm2-css"; s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── PALETTE ─── */
const C = {
  p: "#6366f1", violet: "#8b5cf6",
  sky: "#0ea5e9", em: "#10b981",
  amber: "#f59e0b", rose: "#f43f5e",
};
const PIE_COLORS = [C.p, C.amber, C.rose];
const ROLE_LABEL   = { 1: "Admin", 2: "Alumni", 3: "Responsable" };
const STATUS_LABEL = { approved: "Approuvé", pending: "En attente" };
const AV_GRADS = [
  "linear-gradient(145deg,#6366f1,#8b5cf6)",
  "linear-gradient(145deg,#0ea5e9,#6366f1)",
  "linear-gradient(145deg,#f59e0b,#f43f5e)",
  "linear-gradient(145deg,#10b981,#0ea5e9)",
  "linear-gradient(145deg,#8b5cf6,#ec4899)",
];
const avColor = id => AV_GRADS[(id || 0) % AV_GRADS.length];
const initials = u => ((u?.first_name?.[0] || "") + (u?.last_name?.[0] || "")).toUpperCase() || "?";

/* ─── TOASTS ─── */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [{ id, msg, type }, ...t]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  };
  const remove = id => setToasts(t => t.filter(x => x.id !== id));
  return { toasts, push, remove };
}

function ToastStack({ toasts, remove }) {
  return (
    <div className="toasts">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div className="toast" key={t.id}
            initial={{ opacity: 0, x: 28, scale: .95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: .2 }}>
            <div className={`td ${t.type}`} />
            <span style={{ flex: 1 }}>{t.msg}</span>
            <span style={{ cursor: "pointer", color: "var(--ink4)" }} onClick={() => remove(t.id)}><X size={11} /></span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── TOOLTIP ─── */
const LightTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: "1px solid rgba(15,23,42,.1)",
      borderRadius: 10, padding: "8px 13px", fontSize: 11,
      color: "#1e293b", boxShadow: "0 4px 16px rgba(15,23,42,.1)",
    }}>
      <div style={{ color: "#94a3b8", marginBottom: 3, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color, fontWeight: 700 }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

/* ─── NAV ITEM ─── */
function NavItem({ icon: Icon, label, badge, active, onClick }) {
  return (
    <div className={`sb-ni ${active ? "on" : ""}`} onClick={onClick}>
      <div className="sb-ni-ico"><Icon size={14} strokeWidth={2} /></div>
      {label}
      {badge != null && <span className="sb-badge">{badge}</span>}
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
        {trend != null && <span className="stat-trend up">↑ {trend}%</span>}
      </div>
      <div className="stat-lbl">{title}</div>
      <div className="stat-val">{value ?? 0}</div>
      <div className="stat-sub">{sub}</div>
      <div className="stat-stripe" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  );
}

/* ─── CHART CARD ─── */
function ChartCard({ title, sub, badge, badgeColor, height = 220, children }) {
  return (
    <div className="cc">
      <div className="cc-head">
        <div>
          <div className="cc-title">{title}</div>
          {sub && <div className="cc-sub">{sub}</div>}
        </div>
        {badge && (
          <span className="cc-pill" style={{ background: (badgeColor || C.p) + "14", color: badgeColor || C.p }}>
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

/* ─── USER CARDS PANEL ─── */
function UserCardsPanel({ users, onEdit, onDelete, onView, onApprove, onExport, full }) {
  const roleTagMap = {
    1: { cls: "tag-admin",  label: "Admin" },
    2: { cls: "tag-alumni", label: "Alumni" },
    3: { cls: "tag-resp",   label: "Responsable" },
  };

  return (
    <div className="cards-wrap">
      <div className="cards-hd">
        <div className="cards-title">
          {full ? "Liste des utilisateurs" : "Derniers utilisateurs"}
          <span className="cards-ct">{users.length} résultat{users.length !== 1 ? "s" : ""}</span>
        </div>
        <button className="btn btn-ghost" onClick={onExport}>
          <Download size={12} /> Exporter
        </button>
      </div>

      {users.length === 0 ? (
        <div className="cards-empty">
          <Users size={34} style={{ opacity: .12 }} />
          <div style={{ fontSize: 13, fontWeight: 600 }}>Aucun utilisateur trouvé</div>
          <div style={{ fontSize: 11, color: "var(--ink5)" }}>Modifiez vos critères de recherche</div>
        </div>
      ) : (
        <div className="cards-grid">
          <AnimatePresence>
            {users.map((u, i) => {
              const grad = avColor(u.id);
              const colLine = u.role_id === 1 ? C.rose : u.role_id === 3 ? C.amber : C.p;
              const approved = u.status === "approved";
              const roleTag = roleTagMap[u.role_id] || { cls: "tag-alumni", label: "—" };
              return (
                <motion.div className="user-card" key={u.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: .96 }}
                  transition={{ duration: .2, delay: i * 0.025 }}>

                  {/* Stripe top couleur par rôle */}
                  <div className="uc-stripe"
                    style={{ background: `linear-gradient(90deg,${colLine},${colLine}55)` }} />

                  <div className="uc-body">
                    {/* Head */}
                    <div className="uc-head">
                      <div className="uc-av-wrap">
                        <div className="uc-av" style={{ background: grad }}>{initials(u)}</div>
                        <div className="uc-av-badge"
                          style={{ color: approved ? "var(--em)" : "var(--amber)" }}>
                          {approved ? "✓" : "~"}
                        </div>
                      </div>
                      <div className="uc-info">
                        <div className="uc-name">{u.first_name} {u.last_name}</div>
                        <div className="uc-num">
                          <Hash size={9} />
                          {u.numero_dossier || "—"}
                        </div>
                      </div>
                    </div>

                    {/* Meta row email */}
                    <div className="uc-rows">
                      <div className="uc-row">
                        <div className="uc-row-ico"><Mail size={11} /></div>
                        <span className="uc-row-val">{u.email}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="uc-tags">
                      <span className={`uc-tag ${roleTag.cls}`}>{roleTag.label}</span>
                      <span className={`uc-tag ${approved ? "tag-ok" : "tag-pend"}`}>
                        {approved ? "Approuvé" : "En attente"}
                      </span>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="uc-footer">
                    <button className="uc-btn" title="Modifier" onClick={() => onEdit(u)}>
                      <Edit size={12} />
                    </button>
                    <button className="uc-btn del" title="Supprimer" onClick={() => onDelete(u.id)}>
                      <Trash2 size={12} />
                    </button>
                    <button className="uc-btn" title="Voir profil" onClick={() => onView(u)}>
                      <ChevronRight size={12} />
                    </button>
                    {u.status === "pending" && (
                      <button className="uc-btn app" title="Approuver" onClick={() => onApprove(u.id)}>
                        <UserCheck size={12} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/* ─── USER MODAL ─── */
function UserModal({ title, form, setForm, ufrs, departements, filieres, onUfrChange, onDeptChange, onSave, onClose, saveLabel = "Enregistrer" }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal"
        initial={{ opacity: 0, scale: .96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: .96 }}
        transition={{ duration: .2 }}>
        <div className="modal-hd">
          <div>
            <div className="modal-eye">Gestion · Utilisateurs</div>
            <div className="modal-ttl">{title}</div>
          </div>
          <button className="modal-x" onClick={onClose}><X size={13} /></button>
        </div>
        <div className="modal-body">
          <div className="row2">
            <div className="fld"><label>Prénom</label>
              <input value={form.first_name || ""} placeholder="Amina"
                onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
            <div className="fld"><label>Nom</label>
              <input value={form.last_name || ""} placeholder="Diallo"
                onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
          </div>
          <div className="fld"><label>Email</label>
            <input type="email" value={form.email || ""} placeholder="amina@univ-thies.sn"
              onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="row2">
            <div className="fld"><label>N° dossier</label>
              <input value={form.numero_dossier || ""} placeholder="2024-INF-001"
                onChange={e => setForm({ ...form, numero_dossier: e.target.value })} /></div>
            <div className="fld"><label>Rôle</label>
              <select value={form.role_id || ""} onChange={e => setForm({ ...form, role_id: Number(e.target.value) })}>
                <option value="">Choisir rôle</option>
                <option value={1}>Admin</option>
                <option value={2}>Alumni</option>
                <option value={3}>Responsable</option>
              </select></div>
          </div>
          <div className="fld"><label>UFR</label>
            <select value={form.ufr_id || ""} onChange={e => onUfrChange(e.target.value)}>
              <option value="">Choisir une UFR</option>
              {ufrs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
            </select></div>
          <div className="row2">
            <div className="fld"><label>Département</label>
              <select value={form.departement_id || ""}
                disabled={!form.ufr_id || departements.length === 0}
                onChange={e => onDeptChange(e.target.value)}>
                <option value="">{!form.ufr_id ? "Choisir d'abord une UFR" : "Département"}</option>
                {departements.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
              </select></div>
            <div className="fld"><label>Filière</label>
              <select value={form.filiere_id || ""}
                disabled={!form.departement_id || filieres.length === 0}
                onChange={e => setForm({ ...form, filiere_id: e.target.value })}>
                <option value="">{!form.departement_id ? "Choisir d'abord un dép." : "Filière"}</option>
                {filieres.map(f => <option key={f.id} value={f.id}>{f.name || f.nom}</option>)}
              </select></div>
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={onSave}>{saveLabel}</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── PROFILE MODAL ─── */
function ProfileModal({ profile, setProfile, onSave, onClose }) {
  if (!profile) return null;
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="modal"
        initial={{ opacity: 0, scale: .96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .2 }}>
        <div className="modal-hd">
          <div>
            <div className="modal-eye">Profil utilisateur</div>
            <div className="modal-ttl">{profile.first_name} {profile.last_name}</div>
          </div>
          <button className="modal-x" onClick={onClose}><X size={13} /></button>
        </div>
        <div className="modal-body">
          <div className="row2">
            <div className="fld"><label>Prénom</label>
              <input value={profile.first_name || ""}
                onChange={e => setProfile({ ...profile, first_name: e.target.value })} /></div>
            <div className="fld"><label>Email</label>
              <input value={profile.email || ""}
                onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
          </div>
          <div className="fld"><label>Filière (ID)</label>
            <input placeholder="Filière" value={profile.profile?.filiere_id || ""}
              onChange={e => setProfile({ ...profile, profile: { ...(profile.profile || {}), filiere_id: e.target.value } })} /></div>
          <div className="row2">
            <div className="fld"><label>Promotion</label>
              <input placeholder="ex : 2023" value={profile.profile?.promotion || ""}
                onChange={e => setProfile({ ...profile, profile: { ...profile.profile, promotion: e.target.value } })} /></div>
            <div className="fld"><label>Poste</label>
              <input placeholder="Ingénieur..." value={profile.profile?.job_title || ""}
                onChange={e => setProfile({ ...profile, profile: { ...profile.profile, job_title: e.target.value } })} /></div>
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>Fermer</button>
          <button className="btn btn-teal" onClick={onSave}>Sauvegarder</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── STRUCT VIEW ─── */
function StructView({ type, ufrs, ufrForm, setUfrForm, deptForm, setDeptForm, filiereForm, setFiliereForm, onCreateUfr, onCreateDept, onCreateFiliere }) {
  const [filUfrDepts, setFilUfrDepts] = useState([]);

  const loadDeptsByUfr = async (ufrId) => {
    if (!ufrId) { setFilUfrDepts([]); return; }
    try {
      const res = await axios.get(`${API}/api/departements-by-ufr/${ufrId}`);
      setFilUfrDepts(res.data);
    } catch { setFilUfrDepts([]); }
  };

  const configs = {
    ufr: {
      eye: "Structure Académique", title: "Nouvelle UFR",
      fields: (
        <div className="struct-fld">
          <label>Nom de l'UFR</label>
          <input placeholder="ex : Faculté des Sciences et Techniques"
            value={ufrForm.nom || ""}
            onChange={e => setUfrForm({ nom: e.target.value })} />
        </div>
      ),
      action: onCreateUfr, label: "Créer l'UFR",
    },
    departement: {
      eye: "Structure Académique", title: "Nouveau Département",
      fields: (
        <>
          <div className="struct-fld">
            <label>Nom du département</label>
            <input placeholder="ex : Informatique" value={deptForm.nom || ""}
              onChange={e => setDeptForm({ ...deptForm, nom: e.target.value })} />
          </div>
          <div className="struct-fld">
            <label>UFR parente</label>
            <select value={deptForm.ufr_id || ""}
              onChange={e => setDeptForm({ ...deptForm, ufr_id: e.target.value })}>
              <option value="">Choisir une UFR</option>
              {ufrs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
            </select>
          </div>
        </>
      ),
      action: onCreateDept, label: "Créer le département",
    },
    filiere: {
      eye: "Structure Académique", title: "Nouvelle Filière",
      fields: (
        <>
          <div className="struct-fld">
            <label>Nom de la filière</label>
            <input placeholder="ex : Génie Logiciel" value={filiereForm.nom || ""}
              onChange={e => setFiliereForm({ ...filiereForm, nom: e.target.value })} />
          </div>
          <div className="struct-fld">
            <label>UFR (pour filtrer)</label>
            <select onChange={e => { setFiliereForm({ ...filiereForm, departement_id: "" }); loadDeptsByUfr(e.target.value); }}>
              <option value="">Choisir une UFR</option>
              {ufrs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
            </select>
          </div>
          <div className="struct-fld">
            <label>Département parent</label>
            <select value={filiereForm.departement_id || ""}
              disabled={filUfrDepts.length === 0}
              onChange={e => setFiliereForm({ ...filiereForm, departement_id: e.target.value })}>
              <option value="">{filUfrDepts.length === 0 ? "Choisir d'abord une UFR" : "Département"}</option>
              {filUfrDepts.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
            </select>
          </div>
        </>
      ),
      action: onCreateFiliere, label: "Créer la filière",
    },
  };

  const cfg = configs[type];
  if (!cfg) return null;

  return (
    <motion.div className="struct-wrap"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
      <div className="struct-eye">{cfg.eye}</div>
      <div className="struct-title">{cfg.title}</div>
      {cfg.fields}
      <div style={{ marginTop: 8 }}>
        <button className="btn btn-primary" onClick={cfg.action}>{cfg.label}</button>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════
   ROOT COMPONENT
════════════════════════════════════════ */
export default function AdminDashboard() {
  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();
  const { toasts, push: toast, remove: removeToast } = useToasts();

  const [notifOpen,    setNotifOpen]    = useState(false);
  const [stats,        setStats]        = useState({});
  const [growth,       setGrowth]       = useState([]);
  const [users,        setUsers]        = useState([]);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("");
  const [open,         setOpen]         = useState(false);
  const [editOpen,     setEditOpen]     = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [profile,      setProfile]      = useState(null);
  const [ufrs,         setUfrs]         = useState([]);
  const [departements, setDepartements] = useState([]);
  const [filieres,     setFilieres]     = useState([]);
  const [editDepts,    setEditDepts]    = useState([]);
  const [editFilieres, setEditFilieres] = useState([]);
  const [ufrForm,      setUfrForm]      = useState({ nom: "" });
  const [deptForm,     setDeptForm]     = useState({ nom: "", ufr_id: "" });
  const [filiereForm,  setFiliereForm]  = useState({ nom: "", departement_id: "" });
  const [view,         setView]         = useState("dashboard");

  const adminName     = localStorage.getItem("admin_name") || "Super Admin";
  const adminInitials = adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "SA";

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    role_id: "", numero_dossier: "",
    ufr_id: "", departement_id: "", filiere_id: "",
  });

  useEffect(() => { load(); fetchUfrs(); }, []);

  const fetchUfrs = async () => {
    try { const r = await axios.get(`${API}/api/ufrs`); setUfrs(r.data); }
    catch { toast("Erreur chargement UFR", "error"); }
  };

  const load = async () => {
    try {
      const [s, g, u, p] = await Promise.all([
        axios.get(`${API}/api/admin/dashboard`,   { headers }),
        axios.get(`${API}/api/admin/user-growth`, { headers }),
        axios.get(`${API}/api/admin/users`,       { headers }),
        axios.get(`${API}/api/admin/pending`,     { headers }),
      ]);
      setStats(s.data);
      setGrowth(g.data);
      setUsers(u.data.data ?? u.data ?? []);
      setPendingUsers(p.data.pending_alumni ?? p.data ?? []);
    } catch { toast("Erreur de chargement des données", "error"); }
  };

  const handleUfrChange = async (id) => {
    setForm(f => ({ ...f, ufr_id: id, departement_id: "", filiere_id: "" }));
    setDepartements([]); setFilieres([]);
    if (!id) return;
    try { const r = await axios.get(`${API}/api/departements-by-ufr/${id}`); setDepartements(r.data); }
    catch {}
  };
  const handleDeptChange = async (id) => {
    setForm(f => ({ ...f, departement_id: id, filiere_id: "" }));
    setFilieres([]);
    if (!id) return;
    try { const r = await axios.get(`${API}/api/filieres-by-departement/${id}`); setFilieres(r.data); }
    catch {}
  };
  const handleEditUfrChange = async (id) => {
    setSelectedUser(u => ({ ...u, ufr_id: id, departement_id: "", filiere_id: "" }));
    setEditDepts([]); setEditFilieres([]);
    if (!id) return;
    try { const r = await axios.get(`${API}/api/departements-by-ufr/${id}`); setEditDepts(r.data); }
    catch {}
  };
  const handleEditDeptChange = async (id) => {
    setSelectedUser(u => ({ ...u, departement_id: id, filiere_id: "" }));
    setEditFilieres([]);
    if (!id) return;
    try { const r = await axios.get(`${API}/api/filieres-by-departement/${id}`); setEditFilieres(r.data); }
    catch {}
  };

  const openEdit = async (user) => {
    setSelectedUser(user); setEditDepts([]); setEditFilieres([]);
    if (user.ufr_id) {
      try {
        const rd = await axios.get(`${API}/api/departements-by-ufr/${user.ufr_id}`);
        setEditDepts(rd.data);
        if (user.departement_id) {
          const rf = await axios.get(`${API}/api/filieres-by-departement/${user.departement_id}`);
          setEditFilieres(rf.data);
        }
      } catch {}
    }
    setEditOpen(true);
  };

  const viewProfile = async (u) => {
    try {
      const res = await axios.get(`${API}/api/admin/profile/${u.id}`, { headers });
      setProfile(res.data); setProfileOpen(true);
    } catch { toast("Erreur chargement profil", "error"); }
  };

  const updateProfile = async () => {
    try {
      await axios.put(`${API}/api/admin/profile/${profile.id}`,
        { job_title: profile.profile?.job_title, promotion: profile.profile?.promotion, filiere_id: profile.profile?.filiere_id },
        { headers });
      setProfileOpen(false); load(); toast("Profil mis à jour", "success");
    } catch { toast("Erreur mise à jour profil", "error"); }
  };

  const createUser = async () => {
    try {
      await axios.post(`${API}/api/admin/create-user`, {
        first_name: form.first_name, last_name: form.last_name, email: form.email,
        role_id: Number(form.role_id), numero_dossier: form.numero_dossier || null,
        ufr_id: form.ufr_id || null, departement_id: form.departement_id || null, filiere_id: form.filiere_id || null,
      }, { headers });
      setOpen(false);
      setForm({ first_name: "", last_name: "", email: "", role_id: "", numero_dossier: "", ufr_id: "", departement_id: "", filiere_id: "" });
      setDepartements([]); setFilieres([]);
      load(); toast(`${form.first_name} ${form.last_name} créé avec succès.`, "success");
    } catch (err) { toast(err.response?.data?.message || "Erreur de validation", "error"); }
  };

  const updateUser = async () => {
    try {
      await axios.put(`${API}/api/admin/update/${selectedUser.id}`, selectedUser, { headers });
      setEditOpen(false); setSelectedUser(null);
      load(); toast("Utilisateur modifié.", "success");
    } catch { toast("Erreur modification", "error"); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${API}/api/admin/delete/${id}`, { headers });
      load(); toast("Utilisateur supprimé.", "success");
    } catch { toast("Erreur suppression", "error"); }
  };

  const approveUser = async (id) => {
    try {
      await axios.put(`${API}/api/admin/approve/${id}`, {}, { headers });
      load(); toast("Utilisateur approuvé.", "success");
    } catch { toast("Erreur approbation", "error"); }
  };

  const createUfr = async () => {
    if (!ufrForm.nom?.trim()) { toast("Nom de l'UFR requis", "error"); return; }
    try { await axios.post(`${API}/api/ufrs`, ufrForm, { headers }); setUfrForm({ nom: "" }); fetchUfrs(); toast("UFR créée.", "success"); }
    catch { toast("Erreur création UFR", "error"); }
  };
  const createDepartement = async () => {
    if (!deptForm.nom?.trim() || !deptForm.ufr_id) { toast("Nom et UFR requis", "error"); return; }
    try { await axios.post(`${API}/api/departements`, deptForm, { headers }); setDeptForm({ nom: "", ufr_id: "" }); toast("Département créé.", "success"); }
    catch { toast("Erreur création département", "error"); }
  };
  const createFiliere = async () => {
    if (!filiereForm.nom?.trim() || !filiereForm.departement_id) { toast("Nom et département requis", "error"); return; }
    try { await axios.post(`${API}/api/filieres`, filiereForm, { headers }); setFiliereForm({ nom: "", departement_id: "" }); toast("Filière créée.", "success"); }
    catch { toast("Erreur création filière", "error"); }
  };

  const exportExcel = () => {
    const data = filtered.map(u => ({
      Prénom: u.first_name || "", Nom: u.last_name || "", Email: u.email || "",
      "N° Dossier": u.numero_dossier || "—",
      Rôle: ROLE_LABEL[u.role_id] || "—", Statut: STATUS_LABEL[u.status] || "—",
      "Date création": u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 16 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Utilisateurs");
    const label = roleFilter ? `_${ROLE_LABEL[roleFilter] || roleFilter}` : "";
    saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]),
      `utilisateurs${label}_${new Date().toLocaleDateString("fr-FR").replace(/\//g, "-")}.xlsx`);
    toast(`Export téléchargé (${data.length} ligne${data.length > 1 ? "s" : ""})`, "success");
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase().trim();
    const matchName = !q ||
      String(u.first_name || "").toLowerCase().includes(q) ||
      String(u.last_name || "").toLowerCase().includes(q) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      String(u.email || "").toLowerCase().includes(q) ||
      String(u.numero_dossier || "").toLowerCase().includes(q);
    const matchRole = !roleFilter || String(u.role_id) === String(roleFilter);
    return matchName && matchRole;
  });

  const barData = growth.slice(-8).map(g => ({ date: g.date, inscrits: g.total }));
  const pieData = [
    { name: "Alumni",       value: stats.total_alumni       || 0 },
    { name: "Responsables", value: stats.total_responsables || 0 },
    { name: "Admins",       value: stats.total_admins       || 0 },
  ];
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
  const viewLabels = {
    dashboard: "Tableau de bord", users: "Utilisateurs",
    ufr: "UFR", departement: "Département", filiere: "Filière",
  };

  return (
    <div className="adm2">

      {/* ══ SIDEBAR ══ */}
      <aside className="sb">
        <div className="sb-accent" />

        {/* Profil animé */}
        <div className="sb-profile">
          <div className="av-stage">
            <div className="av-ring3">
              <div className="av-sat" style={{ ...{ width:5, height:5, top:"15%", left:"50%", transform:"translate(-50%,-50%)", background:"var(--rose)", boxShadow:"0 0 7px rgba(244,63,94,.65)", borderRadius:"50%", position:"absolute" } }} />
            </div>
            <div className="av-ring2">
              <div className="av-sat av-sat2" />
            </div>
            <div className="av-ring1">
              <div className="av-sat av-sat1" />
            </div>
            <div className="av-core">{adminInitials}</div>
            <div className="av-status" />
          </div>
          <div className="sb-name">{adminName}</div>
          <div className="sb-role">Administrateur système</div>
          <div className="sb-chip">Admin</div>
        </div>

        <nav className="sb-nav">
          <div className="sb-grp">Principal</div>
          <NavItem icon={LayoutDashboard} label="Tableau de bord" active={view === "dashboard"} onClick={() => setView("dashboard")} />
          <NavItem icon={Users}   label="Utilisateurs" active={view === "users"}   onClick={() => setView("users")} badge={users.length || null} />
          <NavItem icon={Bell}    label="Notifications" badge={pendingUsers.length || null} active={false} onClick={() => setNotifOpen(o => !o)} />
          <div className="sb-sep" />
          <div className="sb-grp">Structure</div>
          <NavItem icon={GraduationCap} label="UFR"         active={view === "ufr"}         onClick={() => setView("ufr")} />
          <NavItem icon={Building2}     label="Département" active={view === "departement"} onClick={() => setView("departement")} />
          <NavItem icon={BookOpen}      label="Filière"     active={view === "filiere"}     onClick={() => setView("filiere")} />
        </nav>
        <div className="sb-ft">
          <NavItem icon={LogOut} label="Déconnexion" active={false} onClick={() => navigate("/login")} />
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">
            {viewLabels[view] || "Dashboard"}
            <span className="crumb">{viewLabels[view]}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="srch">
              <Search size={12} style={{ color: "var(--ink5)", flexShrink: 0 }} strokeWidth={2} />
              <input placeholder="Nom, email, dossier…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <span style={{ cursor: "pointer", color: "var(--ink4)", flexShrink: 0 }} onClick={() => setSearch("")}><X size={11} /></span>}
            </div>
            <div className="role-filter">
              <Filter size={11} style={{ color: "var(--ink4)" }} />
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                <option value="">Tous les rôles</option>
                <option value="1">Admin</option>
                <option value="2">Alumni</option>
                <option value="3">Responsable</option>
              </select>
              <ChevronDown size={10} style={{ color: "var(--ink4)" }} />
            </div>
            {(search || roleFilter) && (
              <span className="count-pill">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
            )}
          </div>
          <span className="top-date">{today}</span>

          {/* Bell */}
          <div className="bell-wrap">
            <div className="bell-btn" onClick={() => setNotifOpen(o => !o)}>
              <Bell size={15} strokeWidth={2} />
            </div>
            {pendingUsers.length > 0 && <div className="bell-dot">{pendingUsers.length}</div>}
            <AnimatePresence>
              {notifOpen && (
                <motion.div className="notif-panel"
                  initial={{ opacity: 0, y: -8, scale: .97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .16 }}>
                  <div className="notif-head">
                    <span className="notif-head-title">En attente de validation</span>
                    <span style={{ cursor: "pointer", color: "var(--ink4)" }} onClick={() => setNotifOpen(false)}><X size={13} /></span>
                  </div>
                  {pendingUsers.length === 0 ? (
                    <div className="notif-empty">Aucune notification</div>
                  ) : pendingUsers.map(u => (
                    <div className="notif-item" key={u.id}>
                      <div>
                        <div className="notif-name">{u.first_name} {u.last_name}</div>
                        <div className="notif-sub">{u.email}</div>
                      </div>
                      <button className="approve-btn" onClick={() => { approveUser(u.id); setNotifOpen(false); }}>
                        ✔ Approuver
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus size={12} /> Créer
          </button>
        </div>

        {/* Content */}
        <div className="content">

          {/* ══ DASHBOARD ══ */}
          {view === "dashboard" && (
            <motion.div style={{ display: "flex", flexDirection: "column", gap: 22 }}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>

              <div className="banner">
                <div className="banner-mesh" />
                <div className="banner-grid" />
                <div className="banner-dots" />
                <div className="banner-left">
                  <div className="banner-eye"><Sparkles size={10} /> Espace Administrateur</div>
                  <div className="banner-title">Bonjour, {adminName.split(" ")[0]}</div>
                  <div className="banner-sub">Vue d'ensemble de la plateforme Alumni UIDT</div>
                </div>
                <div className="banner-right">
                  <div className="bstat">
                    <div className="bsv">{stats.total_users ?? 0}</div>
                    <div className="bsl">Utilisateurs</div>
                  </div>
                  <div className="bstat">
                    <div className="bsv">{pendingUsers.length}</div>
                    <div className="bsl">En attente</div>
                  </div>
                </div>
              </div>

              <div className="stats">
                <StatCard title="Utilisateurs"   value={stats.total_users}        color={C.p}     icon={Users}     sub="comptes enregistrés" trend={8} />
                <StatCard title="Alumni"          value={stats.total_alumni}       color={C.em}    icon={UserCheck} sub="diplômés actifs"      trend={5} />
                <StatCard title="Responsables"    value={stats.total_responsables} color={C.amber} icon={Shield}    sub="encadrants"           trend={2} />
                <StatCard title="Administrateurs" value={stats.total_admins}       color={C.rose}  icon={Settings}  sub="accès complet"        trend={1} />
              </div>

              <div className="charts">
                <ChartCard title="Inscriptions par période" sub="8 dernières périodes" badge="Histogramme" badgeColor={C.p}>
                  <BarChart data={barData} barSize={18}>
                    <defs>
                      <linearGradient id="adm2-bg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.p} />
                        <stop offset="100%" stopColor={C.sky} stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<LightTooltip />} />
                    <Bar dataKey="inscrits" fill="url(#adm2-bg)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ChartCard>
                <ChartCard title="Distribution des rôles" sub="Proportion par type">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={82} innerRadius={46}
                      paddingAngle={4} cx="50%" cy="50%" isAnimationActive={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<LightTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} iconType="circle" iconSize={8} />
                  </PieChart>
                </ChartCard>
              </div>

              <UserCardsPanel
                users={filtered.slice(0, 8)}
                onEdit={openEdit} onDelete={deleteUser}
                onView={viewProfile} onApprove={approveUser}
                onExport={exportExcel}
              />
            </motion.div>
          )}

          {/* ══ USERS ══ */}
          {view === "users" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
              <UserCardsPanel
                users={filtered}
                onEdit={openEdit} onDelete={deleteUser}
                onView={viewProfile} onApprove={approveUser}
                onExport={exportExcel} full
              />
            </motion.div>
          )}

          {/* ══ STRUCT ══ */}
          {(view === "ufr" || view === "departement" || view === "filiere") && (
            <StructView type={view} ufrs={ufrs}
              ufrForm={ufrForm}         setUfrForm={setUfrForm}
              deptForm={deptForm}       setDeptForm={setDeptForm}
              filiereForm={filiereForm} setFiliereForm={setFiliereForm}
              onCreateUfr={createUfr}
              onCreateDept={createDepartement}
              onCreateFiliere={createFiliere}
            />
          )}
        </div>
      </div>

      {/* ══ MODALS ══ */}
      <AnimatePresence>
        {open && (
          <UserModal title="Créer un utilisateur"
            form={form} setForm={setForm}
            ufrs={ufrs} departements={departements} filieres={filieres}
            onUfrChange={handleUfrChange} onDeptChange={handleDeptChange}
            onSave={createUser} saveLabel="Créer"
            onClose={() => {
              setOpen(false); setDepartements([]); setFilieres([]);
              setForm({ first_name: "", last_name: "", email: "", role_id: "", numero_dossier: "", ufr_id: "", departement_id: "", filiere_id: "" });
            }} />
        )}
        {editOpen && selectedUser && (
          <UserModal title="Modifier l'utilisateur"
            form={selectedUser} setForm={setSelectedUser}
            ufrs={ufrs} departements={editDepts} filieres={editFilieres}
            onUfrChange={handleEditUfrChange} onDeptChange={handleEditDeptChange}
            onSave={updateUser} saveLabel="Modifier"
            onClose={() => { setEditOpen(false); setSelectedUser(null); setEditDepts([]); setEditFilieres([]); }} />
        )}
        {profileOpen && profile && (
          <ProfileModal profile={profile} setProfile={setProfile}
            onSave={updateProfile} onClose={() => setProfileOpen(false)} />
        )}
      </AnimatePresence>

      <ToastStack toasts={toasts} remove={removeToast} />
    </div>
  );
}