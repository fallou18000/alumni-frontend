import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, Users, UserCheck, Shield,
  Search, Bell, Plus, Trash2, Edit, X,
  Download, ChevronRight, GraduationCap,
  Building2, BookOpen, Settings, LogOut,
  Filter, ChevronDown, Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ═══════════════════════════════════════
   CSS — all scoped under .adm
═══════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

.adm *,.adm *::before,.adm *::after{box-sizing:border-box;margin:0;padding:0;}
.adm ::-webkit-scrollbar{width:3px;height:3px;}
.adm ::-webkit-scrollbar-thumb{background:rgba(139,92,246,0.2);border-radius:3px;}
.adm ::-webkit-scrollbar-track{background:transparent;}

.adm{
  display:flex;min-height:100vh;font-size:13.5px;
  background:#060c1a;color:#e2e8f0;
  font-family:'DM Sans',sans-serif;
}

:where(.adm){
  --g1:#00d4a0;--g2:#00b4d8;--g3:#0077ff;
  --violet:#8b5cf6;--violet2:rgba(139,92,246,0.12);
  --gold:#f5a623;--rose:#ff6b6b;
  --ink3:#64748b;--ink4:#94a3b8;
  --bg:#060c1a;--bg2:#0d1526;--bg3:#111d30;
  --card:#0d1526;--card2:#111d30;
  --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
  --sbtext:rgba(255,255,255,0.38);
  --font:'DM Sans',sans-serif;
  --display:'Syne',sans-serif;
  --mono:'DM Mono',monospace;
  --r:14px;--r2:10px;--r3:8px;
  --sh:0 1px 3px rgba(0,0,0,0.3),0 4px 16px rgba(0,0,0,0.2);
  --sh2:0 8px 32px rgba(0,0,0,0.4);
  --sh3:0 20px 60px rgba(0,0,0,0.6);
}

/* SIDEBAR */
.adm .adm-sb{
  width:240px;flex-shrink:0;background:var(--bg2);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;overflow:hidden;
}
.adm .adm-sb-glow{position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--violet),var(--g1));}
.adm .adm-profile{
  padding:28px 18px 22px;border-bottom:1px solid var(--border);
  display:flex;flex-direction:column;align-items:center;gap:10px;position:relative;
}
.adm .adm-av-ring{padding:2.5px;border-radius:50%;background:linear-gradient(135deg,var(--violet),var(--g1));display:inline-flex;}
.adm .adm-av{
  width:48px;height:48px;border-radius:50%;background:var(--bg3);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--display);font-size:16px;font-weight:700;color:#fff;letter-spacing:-.5px;
}
.adm .adm-name{font-family:var(--display);font-size:13.5px;font-weight:700;color:#fff;text-align:center;letter-spacing:-.2px;}
.adm .adm-email{font-size:10px;color:var(--sbtext);text-align:center;}
.adm .adm-chip{
  font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
  color:var(--rose);background:rgba(255,107,107,0.1);
  border:1px solid rgba(255,107,107,0.2);padding:3px 10px;border-radius:20px;
}
.adm .adm-nav{flex:1;padding:12px 8px 10px;overflow-y:auto;}
.adm .adm-nav::-webkit-scrollbar{width:0;}
.adm .adm-grp{
  font-size:8.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
  color:rgba(255,255,255,0.14);padding:12px 14px 5px;
}
.adm .adm-ni{
  display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:var(--r3);
  cursor:pointer;font-size:12.5px;font-weight:500;color:var(--sbtext);
  transition:all .18s;margin-bottom:1px;user-select:none;position:relative;
}
.adm .adm-ni:hover{background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);}
.adm .adm-ni.on{background:rgba(139,92,246,0.1);color:#fff;font-weight:600;}
.adm .adm-ni.on::before{
  content:'';position:absolute;left:0;top:22%;bottom:22%;
  width:2px;border-radius:0 2px 2px 0;
  background:linear-gradient(to bottom,var(--violet),var(--g1));
}
.adm .adm-ni-ico{
  width:26px;height:26px;border-radius:7px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  background:rgba(255,255,255,0.04);transition:all .18s;
}
.adm .adm-ni.on .adm-ni-ico{background:rgba(139,92,246,0.18);color:var(--violet);}
.adm .adm-ni-badge{
  margin-left:auto;font-size:10px;font-weight:700;
  background:var(--rose);color:#fff;padding:1px 6px;border-radius:20px;min-width:20px;text-align:center;
}
.adm .adm-sep{height:1px;background:var(--border);margin:6px 10px;}
.adm .adm-sb-ft{padding:8px 8px 18px;border-top:1px solid var(--border);}

/* MAIN */
.adm .adm-main{flex:1;display:flex;flex-direction:column;min-height:100vh;overflow:hidden;}
.adm .adm-topbar{
  display:flex;align-items:center;gap:10px;padding:0 26px;height:62px;
  background:rgba(6,12,26,0.95);border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:40;backdrop-filter:blur(24px);flex-shrink:0;
}
.adm .adm-topbar-title{
  flex:1;font-family:var(--display);font-size:16px;font-weight:700;
  letter-spacing:-.3px;color:#fff;display:flex;align-items:center;gap:8px;
}
.adm .adm-crumb{
  font-family:var(--font);font-size:10.5px;color:var(--ink3);font-weight:400;
  background:var(--bg3);padding:2px 9px;border-radius:20px;
  border:1px solid var(--border);letter-spacing:.3px;
}
.adm .adm-srch{
  display:flex;align-items:center;gap:8px;background:var(--bg3);
  border:1px solid var(--border);border-radius:var(--r2);padding:7px 12px;width:200px;transition:all .22s;
}
.adm .adm-srch:focus-within{
  border-color:rgba(139,92,246,0.4);box-shadow:0 0 0 3px rgba(139,92,246,0.07);
  background:var(--bg2);width:230px;
}
.adm .adm-srch input{background:none;border:none;outline:none;font-size:12.5px;font-family:var(--font);color:#e2e8f0;width:100%;}
.adm .adm-srch input::placeholder{color:rgba(148,163,184,0.4);}
.adm .adm-role-filter{
  display:flex;align-items:center;gap:7px;background:var(--bg3);
  border:1px solid var(--border);border-radius:var(--r2);padding:7px 11px;cursor:pointer;transition:all .2s;
}
.adm .adm-role-filter:hover{border-color:rgba(139,92,246,0.35);}
.adm .adm-role-filter select{
  background:transparent;border:none;outline:none;font-size:12px;font-family:var(--font);
  color:#e2e8f0;cursor:pointer;padding-right:2px;appearance:none;min-width:90px;
}
.adm .adm-role-filter select option{background:#111d30;color:#e2e8f0;}
.adm .adm-count-pill{
  font-size:11px;color:var(--violet);font-weight:600;
  background:var(--violet2);border:1px solid rgba(139,92,246,0.2);
  border-radius:20px;padding:3px 10px;white-space:nowrap;
}
.adm .adm-top-date{
  font-size:10.5px;color:var(--ink4);background:var(--bg3);border:1px solid var(--border);
  border-radius:var(--r2);padding:5px 10px;white-space:nowrap;font-family:var(--mono);letter-spacing:.4px;
}

/* BUTTONS */
.adm .btn{
  display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r2);
  font-size:12px;font-weight:600;font-family:var(--font);cursor:pointer;border:none;
  transition:all .18s;white-space:nowrap;
}
.adm .btn-primary{background:linear-gradient(135deg,var(--violet),var(--g3));color:#fff;box-shadow:0 2px 12px rgba(139,92,246,0.25);}
.adm .btn-primary:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 18px rgba(139,92,246,0.35);}
.adm .btn-teal{background:linear-gradient(135deg,var(--g1),var(--g3));color:#060c1a;box-shadow:0 2px 10px rgba(0,212,160,0.2);}
.adm .btn-teal:hover{opacity:.9;transform:translateY(-1px);}
.adm .btn-ghost{background:var(--bg3);border:1px solid var(--border);color:rgba(255,255,255,0.55);}
.adm .btn-ghost:hover{border-color:rgba(139,92,246,0.35);color:var(--violet);}
.adm .btn-danger{background:rgba(255,107,107,0.08);color:var(--rose);border:1px solid rgba(255,107,107,0.2);}
.adm .btn-danger:hover{background:var(--rose);color:#fff;}

/* BELL */
.adm .bell-wrap{position:relative;}
.adm .bell-btn{
  width:38px;height:38px;border-radius:var(--r2);background:var(--bg3);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink4);transition:all .18s;
}
.adm .bell-btn:hover{border-color:rgba(139,92,246,0.4);color:var(--violet);}
.adm .bell-dot{
  position:absolute;top:-5px;right:-5px;background:var(--rose);color:#fff;border-radius:50%;
  width:18px;height:18px;font-size:9.5px;font-weight:700;
  display:flex;align-items:center;justify-content:center;border:2px solid var(--bg);
}
.adm .notif-panel{
  position:absolute;right:0;top:48px;width:310px;background:var(--card2);
  border:1px solid var(--border2);border-radius:var(--r);box-shadow:var(--sh3);z-index:100;overflow:hidden;
}
.adm .notif-head{
  padding:14px 18px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
}
.adm .notif-head-title{font-family:var(--display);font-size:12.5px;font-weight:700;color:#fff;}
.adm .notif-item{
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 18px;border-bottom:1px solid var(--border);transition:background .15s;gap:10px;
}
.adm .notif-item:hover{background:rgba(255,255,255,0.025);}
.adm .notif-item:last-child{border-bottom:none;}
.adm .notif-name{font-size:12.5px;font-weight:600;color:#e2e8f0;}
.adm .notif-sub{font-size:10.5px;color:var(--ink4);margin-top:2px;}
.adm .approve-btn{
  background:linear-gradient(135deg,var(--g1),var(--g2));color:#060c1a;border:none;
  padding:5px 11px;border-radius:7px;font-size:11px;font-weight:700;cursor:pointer;
  font-family:var(--font);white-space:nowrap;flex-shrink:0;
}
.adm .approve-btn:hover{opacity:.85;}
.adm .notif-empty{padding:24px;text-align:center;color:var(--ink4);font-size:13px;}

/* CONTENT */
.adm .adm-content{flex:1;padding:22px 26px;overflow-y:auto;display:flex;flex-direction:column;gap:20px;}

/* BANNER */
.adm .adm-banner{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r);
  padding:26px 28px;display:flex;align-items:center;justify-content:space-between;
  position:relative;overflow:hidden;
}
.adm .adm-banner-bg{
  position:absolute;inset:0;
  background:radial-gradient(ellipse at 90% 50%,rgba(139,92,246,0.09),transparent 60%),
             radial-gradient(ellipse at 10% 80%,rgba(0,119,255,0.06),transparent 55%);
  pointer-events:none;
}
.adm .adm-banner-grid{
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,0.022) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(255,255,255,0.022) 1px,transparent 1px);
  background-size:38px 38px;pointer-events:none;
}
.adm .adm-banner-left{position:relative;z-index:1;}
.adm .adm-banner-eyebrow{
  font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
  color:var(--violet);margin-bottom:7px;display:flex;align-items:center;gap:6px;
}
.adm .adm-banner-eyebrow::before{content:'';width:16px;height:1.5px;background:var(--violet);}
.adm .adm-banner-title{font-family:var(--display);font-size:26px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:5px;}
.adm .adm-banner-sub{font-size:13px;color:rgba(255,255,255,0.35);}
.adm .adm-banner-right{
  position:relative;z-index:1;display:flex;
  background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;
}
.adm .adm-bstat{padding:14px 20px;text-align:center;border-right:1px solid var(--border);}
.adm .adm-bstat:last-child{border-right:none;}
.adm .adm-bsv{font-family:var(--display);font-size:28px;font-weight:800;color:#fff;letter-spacing:-1.5px;line-height:1;}
.adm .adm-bsl{font-size:9.5px;color:rgba(255,255,255,0.32);margin-top:4px;letter-spacing:.7px;text-transform:uppercase;}

/* STAT CARDS */
.adm .adm-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.adm .adm-stat{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r);
  padding:18px 18px 14px;position:relative;overflow:hidden;transition:all .22s;cursor:default;
}
.adm .adm-stat:hover{transform:translateY(-3px);box-shadow:var(--sh2);border-color:rgba(139,92,246,0.18);}
.adm .adm-stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;}
.adm .adm-stat-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.adm .adm-stat-trend{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;font-family:var(--mono);}
.adm .adm-stat-trend.up{background:rgba(0,212,160,0.12);color:var(--g1);}
.adm .adm-stat-lbl{font-size:9.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink4);margin-bottom:5px;}
.adm .adm-stat-val{font-family:var(--display);font-size:28px;font-weight:800;letter-spacing:-1.2px;line-height:1;margin-bottom:3px;color:#fff;}
.adm .adm-stat-sub{font-size:10.5px;color:var(--ink3);}
.adm .adm-stat-stripe{position:absolute;bottom:0;left:0;right:0;height:2px;opacity:.55;}

/* CHARTS */
.adm .adm-charts{display:grid;grid-template-columns:1.5fr 1fr;gap:12px;}
.adm .adm-cc{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:18px 20px;}
.adm .adm-cc-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
.adm .adm-cc-title{font-family:var(--display);font-size:13.5px;font-weight:700;color:#fff;letter-spacing:-.2px;}
.adm .adm-cc-sub{font-size:11px;color:var(--ink4);margin-top:2px;}
.adm .adm-cc-pill{font-size:9.5px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:.3px;}

/* TABLE */
.adm .adm-tbl{background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;}
.adm .adm-tbl-hd{
  display:flex;align-items:center;justify-content:space-between;padding:14px 20px;
  border-bottom:1px solid var(--border);flex-wrap:wrap;gap:10px;
}
.adm .adm-tbl-title{font-family:var(--display);font-size:13.5px;font-weight:700;letter-spacing:-.2px;color:#fff;display:flex;align-items:center;gap:8px;}
.adm .adm-tbl-ct{font-size:10.5px;color:var(--ink4);font-weight:500;background:var(--bg3);padding:2px 8px;border-radius:20px;border:1px solid var(--border);font-family:var(--mono);}
.adm .adm-tbl-actions{display:flex;gap:8px;}
.adm .adm-thead{display:grid;grid-template-columns:2fr 1.8fr 1fr 1fr 110px;padding:8px 20px;background:var(--bg3);border-bottom:1px solid var(--border);}
.adm .adm-th{font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:rgba(148,163,184,0.55);}
.adm .adm-trow{display:grid;grid-template-columns:2fr 1.8fr 1fr 1fr 110px;padding:11px 20px;border-bottom:1px solid var(--border);align-items:center;transition:background .14s;}
.adm .adm-trow:last-child{border-bottom:none;}
.adm .adm-trow:hover{background:rgba(255,255,255,0.022);}
.adm .adm-uc{display:flex;align-items:center;gap:10px;}
.adm .adm-av{width:34px;height:34px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:11.5px;font-weight:700;color:#fff;}
.adm .adm-uname{font-size:13px;font-weight:600;color:#e2e8f0;letter-spacing:-.1px;}
.adm .adm-usub{font-size:10.5px;color:var(--ink4);margin-top:1px;font-family:var(--mono);}
.adm .adm-td{font-size:12px;color:var(--ink3);}
.adm .adm-badge{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:.2px;}
.adm .adm-badge::before{content:'';width:4px;height:4px;border-radius:50%;flex-shrink:0;}
.adm .b-approved{background:rgba(0,212,160,0.1);color:var(--g1);border:1px solid rgba(0,212,160,0.2);}
.adm .b-approved::before{background:var(--g1);}
.adm .b-pending{background:rgba(245,158,11,0.1);color:var(--gold);border:1px solid rgba(245,158,11,0.18);}
.adm .b-pending::before{background:var(--gold);}
.adm .b-admin{background:rgba(255,107,107,0.1);color:var(--rose);border:1px solid rgba(255,107,107,0.18);}
.adm .b-admin::before{background:var(--rose);}
.adm .b-alumni{background:rgba(139,92,246,0.1);color:var(--violet);border:1px solid rgba(139,92,246,0.18);}
.adm .b-alumni::before{background:var(--violet);}
.adm .b-resp{background:rgba(245,158,11,0.1);color:var(--gold);border:1px solid rgba(245,158,11,0.18);}
.adm .b-resp::before{background:var(--gold);}
.adm .adm-ra{display:flex;gap:4px;}
.adm .adm-ib{
  width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:none;
  display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink4);transition:all .15s;
}
.adm .adm-ib:hover{border-color:rgba(139,92,246,0.4);color:var(--violet);background:rgba(139,92,246,0.07);}
.adm .adm-ib.del:hover{border-color:rgba(255,107,107,0.4);color:var(--rose);background:rgba(255,107,107,0.07);}
.adm .adm-ib.app:hover{border-color:rgba(0,212,160,0.4);color:var(--g1);background:rgba(0,212,160,0.07);}
.adm .adm-empty{padding:52px 20px;text-align:center;color:var(--ink4);}

/* STRUCT */
.adm .struct-wrap{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r);
  padding:28px 30px;max-width:520px;position:relative;overflow:hidden;
}
.adm .struct-eye{font-size:9.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--g1);margin-bottom:6px;}
.adm .struct-title{font-family:var(--display);font-size:22px;font-weight:800;letter-spacing:-.5px;margin-bottom:22px;color:#fff;}
.adm .struct-fld{display:flex;flex-direction:column;gap:6px;margin-bottom:14px;}
.adm .struct-fld label{font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink4);}
.adm .struct-fld input,.adm .struct-fld select{
  background:var(--bg3);border:1px solid var(--border);border-radius:var(--r2);
  padding:11px 14px;font-size:13px;font-family:var(--font);color:#e2e8f0;
  outline:none;transition:all .18s;width:100%;
}
.adm .struct-fld input:focus,.adm .struct-fld select:focus{border-color:rgba(0,212,160,0.4);box-shadow:0 0 0 3px rgba(0,212,160,0.07);}
.adm .struct-fld input::placeholder{color:rgba(148,163,184,0.35);}
.adm .struct-fld select option{background:#111d30;color:#e2e8f0;}
.adm .struct-fld select:disabled{opacity:.4;cursor:not-allowed;}

/* MODAL */
.adm .adm-overlay{
  position:fixed;inset:0;background:rgba(4,8,18,0.8);backdrop-filter:blur(12px);
  z-index:200;display:flex;align-items:center;justify-content:center;
}
.adm .adm-modal{
  background:var(--card2);border:1px solid var(--border2);border-radius:20px;
  width:500px;max-height:90vh;display:flex;flex-direction:column;box-shadow:var(--sh3);overflow:hidden;
}
.adm .adm-modal-hd{
  padding:22px 24px 18px;border-bottom:1px solid var(--border);
  display:flex;align-items:flex-start;justify-content:space-between;
  background:linear-gradient(135deg,rgba(139,92,246,0.06),rgba(0,212,160,0.03));
}
.adm .adm-modal-eye{font-size:9.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--violet);margin-bottom:5px;}
.adm .adm-modal-ttl{font-family:var(--display);font-size:19px;font-weight:800;letter-spacing:-.4px;color:#fff;}
.adm .adm-modal-x{
  background:none;border:1px solid var(--border);border-radius:8px;
  width:28px;height:28px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .15s;margin-top:2px;
}
.adm .adm-modal-x:hover{border-color:rgba(255,107,107,0.4);color:var(--rose);background:rgba(255,107,107,0.06);}
.adm .adm-modal-body{padding:18px 24px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:12px;}
.adm .adm-modal-ft{padding:14px 24px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;background:rgba(0,0,0,0.15);}
.adm .row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.adm .fld{display:flex;flex-direction:column;gap:5px;}
.adm .fld label{font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink4);}
.adm .fld input,.adm .fld select{
  background:var(--bg3);border:1px solid var(--border);border-radius:var(--r2);
  padding:10px 13px;font-size:13px;font-family:var(--font);color:#e2e8f0;
  outline:none;transition:all .18s;width:100%;
}
.adm .fld input:focus,.adm .fld select:focus{border-color:rgba(139,92,246,0.4);box-shadow:0 0 0 3px rgba(139,92,246,0.07);}
.adm .fld input:disabled,.adm .fld select:disabled{opacity:.4;cursor:not-allowed;}
.adm .fld input::placeholder{color:rgba(148,163,184,0.3);}
.adm .fld select option{background:#111d30;color:#e2e8f0;}

/* TOASTS */
.adm .adm-toasts{position:fixed;bottom:20px;right:20px;z-index:500;display:flex;flex-direction:column;gap:7px;align-items:flex-end;pointer-events:none;}
.adm .adm-toast{
  display:flex;align-items:center;gap:9px;background:var(--bg2);border:1px solid var(--border2);
  border-radius:10px;padding:10px 14px;min-width:230px;color:#e2e8f0;font-size:12.5px;
  box-shadow:var(--sh2);pointer-events:all;
}
.adm .adm-toast-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.adm .adm-toast-dot.success{background:var(--g1);}
.adm .adm-toast-dot.error{background:var(--rose);}
.adm .adm-toast-dot.info{background:var(--gold);}
`;

if (typeof document !== "undefined" && !document.getElementById("adm-css-dark")) {
  const s = document.createElement("style");
  s.id = "adm-css-dark";
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── PALETTE ─── */
const C = {
  violet: "#8b5cf6",
  g1: "#00d4a0", g2: "#00b4d8", g3: "#0077ff",
  gold: "#f5a623", rose: "#ff6b6b",
  border: "rgba(255,255,255,0.04)", ink3: "#64748b",
};
const PIE_COLORS = [C.g1, C.gold, C.rose];

const ROLE_LABEL   = { 1: "Admin", 2: "Alumni", 3: "Responsable" };
const STATUS_LABEL = { approved: "Approuvé", pending: "En attente" };

const AV_GRADS = [
  "linear-gradient(135deg,#8b5cf6,#3b82f6)",
  "linear-gradient(135deg,#00d4a0,#3b82f6)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#ec4899,#8b5cf6)",
  "linear-gradient(135deg,#10b981,#00d4a0)",
];
const avColor = id => AV_GRADS[(id || 0) % AV_GRADS.length];
const initials = u =>
  ((u?.first_name?.[0] || "") + (u?.last_name?.[0] || "")).toUpperCase() || "?";

/* ─── TOAST HOOK ─── */
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
    <div className="adm-toasts">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div className="adm-toast" key={t.id}
            initial={{ opacity: 0, x: 28, scale: .95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: .2 }}>
            <div className={`adm-toast-dot ${t.type}`} />
            <span style={{ flex: 1, fontWeight: 500 }}>{t.msg}</span>
            <span style={{ cursor: "pointer", color: "var(--ink4)" }} onClick={() => remove(t.id)}>
              <X size={11} />
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── BADGES ─── */
function StatusBadge({ status }) {
  return (
    <span className={`adm-badge ${status === "approved" ? "b-approved" : "b-pending"}`}>
      {status === "approved" ? "Approuvé" : "En attente"}
    </span>
  );
}
function RoleBadge({ roleId }) {
  const map = {
    1: { cls: "b-admin",  label: "Admin" },
    2: { cls: "b-alumni", label: "Alumni" },
    3: { cls: "b-resp",   label: "Responsable" },
  };
  const r = map[roleId] || { cls: "b-alumni", label: "—" };
  return <span className={`adm-badge ${r.cls}`}>{r.label}</span>;
}

/* ─── NAV ITEM ─── */
function NavItem({ icon: Icon, label, badge, active, onClick }) {
  return (
    <div className={`adm-ni ${active ? "on" : ""}`} onClick={onClick}>
      <div className="adm-ni-ico"><Icon size={14} strokeWidth={2} /></div>
      {label}
      {badge != null && <span className="adm-ni-badge">{badge}</span>}
    </div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ title, value, color, icon: Icon, sub, trend }) {
  return (
    <div className="adm-stat">
      <div className="adm-stat-top">
        <div className="adm-stat-ico" style={{ background: color + "18", color }}>
          <Icon size={17} strokeWidth={2} />
        </div>
        {trend != null && <span className="adm-stat-trend up">↑ {trend}%</span>}
      </div>
      <div className="adm-stat-lbl">{title}</div>
      <div className="adm-stat-val">{value ?? 0}</div>
      <div className="adm-stat-sub">{sub}</div>
      <div className="adm-stat-stripe" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  );
}

/* ─── CHART CARD ─── */
function ChartCard({ title, sub, badge, badgeColor, height = 220, children }) {
  return (
    <div className="adm-cc">
      <div className="adm-cc-head">
        <div>
          <div className="adm-cc-title">{title}</div>
          {sub && <div className="adm-cc-sub">{sub}</div>}
        </div>
        {badge && (
          <span className="adm-cc-pill"
            style={{ background: (badgeColor || C.violet) + "16", color: badgeColor || C.violet }}>
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

/* ─── CUSTOM TOOLTIP ─── */
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#111d30", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 9, padding: "8px 12px", fontSize: 11, color: "#e2e8f0",
    }}>
      <div style={{ color: "#94a3b8", marginBottom: 3 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

/* ─── USER MODAL ─── */
function UserModal({
  title, form, setForm,
  ufrs, departements, filieres,
  onUfrChange, onDeptChange,
  onSave, onClose, saveLabel = "Enregistrer",
}) {
  return (
    <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="adm-modal"
        initial={{ opacity: 0, scale: .96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: .96 }}
        transition={{ duration: .2 }}>
        <div className="adm-modal-hd">
          <div>
            <div className="adm-modal-eye">Gestion · Utilisateurs</div>
            <div className="adm-modal-ttl">{title}</div>
          </div>
          <button className="adm-modal-x" onClick={onClose}><X size={13} /></button>
        </div>
        <div className="adm-modal-body">
          <div className="row2">
            <div className="fld">
              <label>Prénom</label>
              <input value={form.first_name || ""} placeholder="Amina"
                onChange={e => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div className="fld">
              <label>Nom</label>
              <input value={form.last_name || ""} placeholder="Diallo"
                onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </div>
          </div>
          <div className="fld">
            <label>Email</label>
            <input type="email" value={form.email || ""} placeholder="amina.diallo@univ-thies.sn"
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="row2">
            <div className="fld">
              <label>N° dossier</label>
              <input value={form.numero_dossier || ""} placeholder="2024-INF-001"
                onChange={e => setForm({ ...form, numero_dossier: e.target.value })} />
            </div>
            <div className="fld">
              <label>Rôle</label>
              <select value={form.role_id || ""}
                onChange={e => setForm({ ...form, role_id: Number(e.target.value) })}>
                <option value="">Choisir rôle</option>
                <option value={1}>Admin</option>
                <option value={2}>Alumni</option>
                <option value={3}>Responsable</option>
              </select>
            </div>
          </div>

          {/* UFR → Département → Filière en cascade */}
          <div className="fld">
            <label>UFR</label>
            <select value={form.ufr_id || ""} onChange={e => onUfrChange(e.target.value)}>
              <option value="">Choisir une UFR</option>
              {ufrs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
            </select>
          </div>
          <div className="row2">
            <div className="fld">
              <label>Département</label>
              <select
                value={form.departement_id || ""}
                disabled={!form.ufr_id || departements.length === 0}
                onChange={e => onDeptChange(e.target.value)}>
                <option value="">
                  {!form.ufr_id ? "Choisir d'abord une UFR" : "Choisir un département"}
                </option>
                {departements.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
              </select>
            </div>
            <div className="fld">
              <label>Filière</label>
              <select
                value={form.filiere_id || ""}
                disabled={!form.departement_id || filieres.length === 0}
                onChange={e => setForm({ ...form, filiere_id: e.target.value })}>
                <option value="">
                  {!form.departement_id ? "Choisir d'abord un département" : "Choisir une filière"}
                </option>
                {filieres.map(f => <option key={f.id} value={f.id}>{f.name || f.nom}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="adm-modal-ft">
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
    <div className="adm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div className="adm-modal"
        initial={{ opacity: 0, scale: .96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: .2 }}>
        <div className="adm-modal-hd">
          <div>
            <div className="adm-modal-eye">Profil utilisateur</div>
            <div className="adm-modal-ttl">{profile.first_name} {profile.last_name}</div>
          </div>
          <button className="adm-modal-x" onClick={onClose}><X size={13} /></button>
        </div>
        <div className="adm-modal-body">
          <div className="row2">
            <div className="fld">
              <label>Prénom</label>
              <input value={profile.first_name || ""}
                onChange={e => setProfile({ ...profile, first_name: e.target.value })} />
            </div>
            <div className="fld">
              <label>Email</label>
              <input value={profile.email || ""}
                onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </div>
          </div>
          <div className="fld">
            <label>Filière (ID)</label>
            <input placeholder="Filière" value={profile.profile?.filiere_id || ""}
              onChange={e => setProfile({
                ...profile,
                profile: { ...(profile.profile || {}), filiere_id: e.target.value },
              })} />
          </div>
          <div className="row2">
            <div className="fld">
              <label>Promotion</label>
              <input placeholder="ex : 2023" value={profile.profile?.promotion || ""}
                onChange={e => setProfile({
                  ...profile,
                  profile: { ...profile.profile, promotion: e.target.value },
                })} />
            </div>
            <div className="fld">
              <label>Poste</label>
              <input placeholder="Ingénieur..." value={profile.profile?.job_title || ""}
                onChange={e => setProfile({
                  ...profile,
                  profile: { ...profile.profile, job_title: e.target.value },
                })} />
            </div>
          </div>
        </div>
        <div className="adm-modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>Fermer</button>
          <button className="btn btn-teal" onClick={onSave}>Sauvegarder</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── STRUCT VIEW ─── */
// Cascade UFR → Département gérée localement dans ce composant
function StructView({
  type, ufrs,
  ufrForm, setUfrForm,
  deptForm, setDeptForm,
  filiereForm, setFiliereForm,
  onCreateUfr, onCreateDept, onCreateFiliere,
}) {
  const API = import.meta.env.VITE_API_URL;

  // Départements filtrés par UFR pour le formulaire "Département"
  const [deptUfrDepts, setDeptUfrDepts] = useState([]);
  // Départements filtrés par UFR pour le formulaire "Filière"
  const [filUfrDepts, setFilUfrDepts]   = useState([]);

  const loadDeptsByUfr = async (ufrId, setter) => {
    if (!ufrId) { setter([]); return; }
    try {
      const res = await axios.get(`${API}/api/departements-by-ufr/${ufrId}`);
      setter(res.data);
    } catch { setter([]); }
  };

  const COLORS = { ufr: C.g1, departement: C.violet, filiere: C.gold };
  const color  = COLORS[type] || C.g1;

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
            <input placeholder="ex : Informatique"
              value={deptForm.nom || ""}
              onChange={e => setDeptForm({ ...deptForm, nom: e.target.value })} />
          </div>
          <div className="struct-fld">
            <label>UFR parente</label>
            <select
              value={deptForm.ufr_id || ""}
              onChange={e => {
                setDeptForm({ ...deptForm, ufr_id: e.target.value });
                // pas besoin de charger des depts ici, le dept n'a pas de filière
              }}>
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
            <input placeholder="ex : Génie Logiciel"
              value={filiereForm.nom || ""}
              onChange={e => setFiliereForm({ ...filiereForm, nom: e.target.value })} />
          </div>
          <div className="struct-fld">
            <label>UFR (pour filtrer les départements)</label>
            <select
              onChange={e => {
                setFiliereForm({ ...filiereForm, departement_id: "" });
                loadDeptsByUfr(e.target.value, setFilUfrDepts);
              }}>
              <option value="">Choisir une UFR</option>
              {ufrs.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
            </select>
          </div>
          <div className="struct-fld">
            <label>Département parent</label>
            <select
              value={filiereForm.departement_id || ""}
              disabled={filUfrDepts.length === 0}
              onChange={e => setFiliereForm({ ...filiereForm, departement_id: e.target.value })}>
              <option value="">
                {filUfrDepts.length === 0 ? "Choisir d'abord une UFR" : "Choisir un département"}
              </option>
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .25 }}>
      <div className="struct-eye">{cfg.eye}</div>
      <div className="struct-title" style={{ color }}>{cfg.title}</div>
      {cfg.fields}
      <div style={{ marginTop: 6 }}>
        <button className="btn btn-primary"
          style={{ background: `linear-gradient(135deg,${color},${C.g3})` }}
          onClick={cfg.action}>
          {cfg.label}
        </button>
      </div>
    </motion.div>
  );
}

/* ─── USER TABLE ─── */
function UserTable({ users, onEdit, onDelete, onView, onApprove, onExport, full }) {
  return (
    <div className="adm-tbl">
      <div className="adm-tbl-hd">
        <div className="adm-tbl-title">
          {full ? "Liste des utilisateurs" : "Derniers utilisateurs"}
          <span className="adm-tbl-ct">{users.length} résultat{users.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="adm-tbl-actions">
          <button className="btn btn-ghost" onClick={onExport}>
            <Download size={12} /> Exporter
          </button>
        </div>
      </div>
      <div className="adm-thead">
        <div className="adm-th">Utilisateur</div>
        <div className="adm-th">Email</div>
        <div className="adm-th">Rôle</div>
        <div className="adm-th">Statut</div>
        <div className="adm-th">Actions</div>
      </div>
      <AnimatePresence>
        {users.length === 0 ? (
          <div className="adm-empty">
            <Users size={30} style={{ opacity: .15, marginBottom: 8 }} />
            <div style={{ fontSize: 13 }}>Aucun utilisateur trouvé</div>
          </div>
        ) : users.map((u, i) => (
          <motion.div className="adm-trow" key={u.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .15, delay: i * 0.02 }}>
            <div className="adm-uc">
              <div className="adm-av" style={{ background: avColor(u.id) }}>{initials(u)}</div>
              <div>
                <div className="adm-uname">{u.first_name} {u.last_name}</div>
                <div className="adm-usub">{u.numero_dossier || "—"}</div>
              </div>
            </div>
            <div className="adm-td">{u.email}</div>
            <div className="adm-td"><RoleBadge roleId={u.role_id} /></div>
            <div className="adm-td"><StatusBadge status={u.status} /></div>
            <div className="adm-ra">
              <button className="adm-ib" title="Modifier" onClick={() => onEdit(u)}>
                <Edit size={11} />
              </button>
              <button className="adm-ib del" title="Supprimer" onClick={() => onDelete(u.id)}>
                <Trash2 size={11} />
              </button>
              <button className="adm-ib" title="Voir profil" onClick={() => onView(u)}>
                <ChevronRight size={11} />
              </button>
              {u.status === "pending" && (
                <button className="adm-ib app" title="Approuver" onClick={() => onApprove(u.id)}>
                  <UserCheck size={11} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════ */
export default function AdminDashboard() {
  const API     = import.meta.env.VITE_API_URL;
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

  // Départements et filières pour le modal "Créer"
  const [departements, setDepartements] = useState([]);
  const [filieres,     setFilieres]     = useState([]);

  // Départements et filières pour le modal "Modifier"
  const [editDepts,    setEditDepts]    = useState([]);
  const [editFilieres, setEditFilieres] = useState([]);

  const [ufrForm,     setUfrForm]     = useState({ nom: "" });
  const [deptForm,    setDeptForm]    = useState({ nom: "", ufr_id: "" });
  const [filiereForm, setFiliereForm] = useState({ nom: "", departement_id: "" });
  const [view,        setView]        = useState("dashboard");

  const adminName     = localStorage.getItem("admin_name") || "Super Admin";
  const adminEmail    = localStorage.getItem("admin_email") || "";
  const adminInitials = adminName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "SA";

  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "",
    role_id: "", numero_dossier: "",
    ufr_id: "", departement_id: "", filiere_id: "",
  });

  // ── Chargement initial : dashboard + UFRs uniquement ──
  useEffect(() => {
    load();
    fetchUfrs();
  }, []);

  const fetchUfrs = async () => {
    try {
      const res = await axios.get(`${API}/api/ufrs`);
      setUfrs(res.data);
    } catch {
      toast("Erreur chargement UFR", "error");
    }
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
    } catch (err) {
      console.error("Erreur load:", err.response?.data || err.message);
      toast("Erreur de chargement des données", "error");
    }
  };

  // ── Cascade UFR → Département → Filière (modal Créer) ──
  const handleUfrChange = async (id) => {
    setForm(f => ({ ...f, ufr_id: id, departement_id: "", filiere_id: "" }));
    setDepartements([]);
    setFilieres([]);
    if (!id) return;
    try {
      const res = await axios.get(`${API}/api/departements-by-ufr/${id}`);
      setDepartements(res.data);
    } catch { toast("Erreur chargement départements", "error"); }
  };

  const handleDeptChange = async (id) => {
    setForm(f => ({ ...f, departement_id: id, filiere_id: "" }));
    setFilieres([]);
    if (!id) return;
    try {
      const res = await axios.get(`${API}/api/filieres-by-departement/${id}`);
      setFilieres(res.data);
    } catch { toast("Erreur chargement filières", "error"); }
  };

  // ── Cascade UFR → Département → Filière (modal Modifier) ──
  const handleEditUfrChange = async (id) => {
    setSelectedUser(u => ({ ...u, ufr_id: id, departement_id: "", filiere_id: "" }));
    setEditDepts([]);
    setEditFilieres([]);
    if (!id) return;
    try {
      const res = await axios.get(`${API}/api/departements-by-ufr/${id}`);
      setEditDepts(res.data);
    } catch { toast("Erreur chargement départements", "error"); }
  };

  const handleEditDeptChange = async (id) => {
    setSelectedUser(u => ({ ...u, departement_id: id, filiere_id: "" }));
    setEditFilieres([]);
    if (!id) return;
    try {
      const res = await axios.get(`${API}/api/filieres-by-departement/${id}`);
      setEditFilieres(res.data);
    } catch { toast("Erreur chargement filières", "error"); }
  };

  // ── Quand on ouvre le modal Modifier, recharger les listes liées ──
  const openEdit = async (user) => {
    setSelectedUser(user);
    setEditDepts([]);
    setEditFilieres([]);
    // Pré-charger les départements si l'utilisateur a déjà une UFR
    if (user.ufr_id) {
      try {
        const rd = await axios.get(`${API}/api/departements-by-ufr/${user.ufr_id}`);
        setEditDepts(rd.data);
        // Pré-charger les filières si l'utilisateur a déjà un département
        if (user.departement_id) {
          const rf = await axios.get(`${API}/api/filieres-by-departement/${user.departement_id}`);
          setEditFilieres(rf.data);
        }
      } catch { /* silencieux */ }
    }
    setEditOpen(true);
  };

  const viewProfile = async (u) => {
    try {
      const res = await axios.get(`${API}/api/admin/profile/${u.id}`, { headers });
      setProfile(res.data);
      setProfileOpen(true);
    } catch { toast("Erreur chargement profil", "error"); }
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        `${API}/api/admin/profile/${profile.id}`,
        {
          job_title:  profile.profile?.job_title,
          promotion:  profile.profile?.promotion,
          filiere_id: profile.profile?.filiere_id,
        },
        { headers }
      );
      setProfileOpen(false);
      load();
      toast("Profil mis à jour", "success");
    } catch { toast("Erreur mise à jour profil", "error"); }
  };

  const createUser = async () => {
    try {
      await axios.post(`${API}/api/admin/create-user`, {
        first_name:     form.first_name,
        last_name:      form.last_name,
        email:          form.email,
        role_id:        Number(form.role_id),
        numero_dossier: form.numero_dossier || null,
        ufr_id:         form.ufr_id         || null,
        departement_id: form.departement_id  || null,
        filiere_id:     form.filiere_id      || null,
      }, { headers });
      setOpen(false);
      setForm({ first_name: "", last_name: "", email: "", role_id: "", numero_dossier: "", ufr_id: "", departement_id: "", filiere_id: "" });
      setDepartements([]);
      setFilieres([]);
      load();
      toast(`${form.first_name} ${form.last_name} créé avec succès.`, "success");
    } catch (err) {
      toast(err.response?.data?.message || "Erreur de validation", "error");
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`${API}/api/admin/update/${selectedUser.id}`, selectedUser, { headers });
      setEditOpen(false);
      setSelectedUser(null);
      setEditDepts([]);
      setEditFilieres([]);
      load();
      toast("Utilisateur modifié.", "success");
    } catch { toast("Erreur modification", "error"); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${API}/api/admin/delete/${id}`, { headers });
      load();
      toast("Utilisateur supprimé.", "success");
    } catch { toast("Erreur suppression", "error"); }
  };

  const approveUser = async (id) => {
    try {
      await axios.put(`${API}/api/admin/approve/${id}`, {}, { headers });
      load();
      toast("Utilisateur approuvé.", "success");
    } catch { toast("Erreur approbation", "error"); }
  };

  const createUfr = async () => {
    if (!ufrForm.nom?.trim()) { toast("Nom de l'UFR requis", "error"); return; }
    try {
      await axios.post(`${API}/api/ufrs`, ufrForm, { headers });
      setUfrForm({ nom: "" });
      fetchUfrs();
      toast("UFR créée avec succès.", "success");
    } catch { toast("Erreur création UFR", "error"); }
  };

  const createDepartement = async () => {
    if (!deptForm.nom?.trim() || !deptForm.ufr_id) {
      toast("Nom et UFR requis", "error"); return;
    }
    try {
      await axios.post(`${API}/api/departements`, deptForm, { headers });
      setDeptForm({ nom: "", ufr_id: "" });
      toast("Département créé avec succès.", "success");
    } catch { toast("Erreur création département", "error"); }
  };

  const createFiliere = async () => {
    if (!filiereForm.nom?.trim() || !filiereForm.departement_id) {
      toast("Nom et département requis", "error"); return;
    }
    try {
      await axios.post(`${API}/api/filieres`, filiereForm, { headers });
      setFiliereForm({ nom: "", departement_id: "" });
      toast("Filière créée avec succès.", "success");
    } catch { toast("Erreur création filière", "error"); }
  };

  // ── Export Excel ──
  const exportExcel = () => {
    const data = filtered.map(u => ({
      Prénom:           u.first_name      || "",
      Nom:              u.last_name       || "",
      Email:            u.email           || "",
      "N° Dossier":     u.numero_dossier  || "—",
      Rôle:             ROLE_LABEL[u.role_id]  || "—",
      Statut:           STATUS_LABEL[u.status] || "—",
      "Date création":  u.created_at
        ? new Date(u.created_at).toLocaleDateString("fr-FR")
        : "—",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws["!cols"] = [
      { wch: 14 }, { wch: 14 }, { wch: 30 },
      { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 16 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Utilisateurs");
    const label    = roleFilter ? `_${ROLE_LABEL[roleFilter] || roleFilter}` : "";
    const filename = `utilisateurs${label}_${new Date().toLocaleDateString("fr-FR").replace(/\//g, "-")}.xlsx`;
    saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]), filename);
    toast(`Export téléchargé (${data.length} ligne${data.length > 1 ? "s" : ""})`, "success");
  };

  // ── Filtrage local ──
  const filtered = users.filter(u => {
    const q = search.toLowerCase().trim();
    const matchName = !q ||
      String(u.first_name     || "").toLowerCase().includes(q) ||
      String(u.last_name      || "").toLowerCase().includes(q) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
      String(u.email          || "").toLowerCase().includes(q) ||
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
    <div className="adm">

      {/* SIDEBAR */}
      <aside className="adm-sb" style={{ position: "relative" }}>
        <div className="adm-sb-glow" />
        <div className="adm-profile">
          <div className="adm-av-ring"><div className="adm-av">{adminInitials}</div></div>
          <div className="adm-name">{adminName}</div>
          {adminEmail && <div className="adm-email">{adminEmail}</div>}
          <div className="adm-chip">Admin</div>
        </div>

        <nav className="adm-nav">
          <div className="adm-grp">Principal</div>
          <NavItem icon={LayoutDashboard} label="Tableau de bord"
            active={view === "dashboard"} onClick={() => setView("dashboard")} />
          <NavItem icon={Users} label="Utilisateurs"
            active={view === "users"} onClick={() => setView("users")}
            badge={users.length || null} />
          <NavItem icon={Bell} label="Notifications"
            badge={pendingUsers.length || null}
            active={false}
            onClick={() => setNotifOpen(o => !o)} />
          <div className="adm-sep" />
          <div className="adm-grp">Structure</div>
          <NavItem icon={GraduationCap} label="UFR"
            active={view === "ufr"} onClick={() => setView("ufr")} />
          <NavItem icon={Building2} label="Département"
            active={view === "departement"} onClick={() => setView("departement")} />
          <NavItem icon={BookOpen} label="Filière"
            active={view === "filiere"} onClick={() => setView("filiere")} />
        </nav>

        <div className="adm-sb-ft">
          <NavItem icon={LogOut} label="Déconnexion" active={false}
            onClick={() => navigate("/login")} />
        </div>
      </aside>

      {/* MAIN */}
      <div className="adm-main">

        {/* TOPBAR */}
        <div className="adm-topbar">
          <div className="adm-topbar-title">
            {viewLabels[view] || "Dashboard"}
            <span className="adm-crumb">{viewLabels[view]}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="adm-srch">
              <Search size={12} style={{ color: "rgba(148,163,184,0.4)", flexShrink: 0 }} strokeWidth={2} />
              <input placeholder="Nom, email, dossier…"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <span style={{ cursor: "pointer", color: "var(--ink4)", flexShrink: 0 }}
                  onClick={() => setSearch("")}>
                  <X size={11} />
                </span>
              )}
            </div>
            <div className="adm-role-filter">
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
              <span className="adm-count-pill">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <span className="adm-top-date">{today}</span>

          {/* Bell + notification panel */}
          <div className="bell-wrap">
            <div className="bell-btn" onClick={() => setNotifOpen(o => !o)}>
              <Bell size={15} strokeWidth={2} />
            </div>
            {pendingUsers.length > 0 && (
              <div className="bell-dot">{pendingUsers.length}</div>
            )}
            <AnimatePresence>
              {notifOpen && (
                <motion.div className="notif-panel"
                  initial={{ opacity: 0, y: -8, scale: .97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .16 }}>
                  <div className="notif-head">
                    <span className="notif-head-title">En attente de validation</span>
                    <span style={{ cursor: "pointer", color: "var(--ink4)" }}
                      onClick={() => setNotifOpen(false)}>
                      <X size={13} />
                    </span>
                  </div>
                  {pendingUsers.length === 0 ? (
                    <div className="notif-empty">Aucune notification</div>
                  ) : pendingUsers.map(u => (
                    <div className="notif-item" key={u.id}>
                      <div>
                        <div className="notif-name">{u.first_name} {u.last_name}</div>
                        <div className="notif-sub">{u.email}</div>
                      </div>
                      <button className="approve-btn"
                        onClick={() => { approveUser(u.id); setNotifOpen(false); }}>
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

        {/* CONTENT */}
        <div className="adm-content">

          {/* DASHBOARD */}
          {view === "dashboard" && (
            <motion.div style={{ display: "flex", flexDirection: "column", gap: 20 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .35 }}>

              <div className="adm-banner">
                <div className="adm-banner-bg" />
                <div className="adm-banner-grid" />
                <div className="adm-banner-left">
                  <div className="adm-banner-eyebrow">
                    <Sparkles size={10} /> Espace Administrateur
                  </div>
                  <div className="adm-banner-title">Bonjour, {adminName.split(" ")[0]}</div>
                  <div className="adm-banner-sub">Vue d'ensemble de la plateforme Alumni UIDT</div>
                </div>
                <div className="adm-banner-right">
                  <div className="adm-bstat">
                    <div className="adm-bsv">{stats.total_users ?? 0}</div>
                    <div className="adm-bsl">Utilisateurs</div>
                  </div>
                  <div className="adm-bstat">
                    <div className="adm-bsv">{pendingUsers.length}</div>
                    <div className="adm-bsl">En attente</div>
                  </div>
                </div>
              </div>

              <div className="adm-stats">
                <StatCard title="Utilisateurs"   value={stats.total_users}        color={C.violet} icon={Users}     sub="comptes enregistrés" trend={8} />
                <StatCard title="Alumni"          value={stats.total_alumni}       color={C.g1}     icon={UserCheck} sub="diplômés actifs"      trend={5} />
                <StatCard title="Responsables"    value={stats.total_responsables} color={C.gold}   icon={Shield}    sub="encadrants"           trend={2} />
                <StatCard title="Administrateurs" value={stats.total_admins}       color={C.rose}   icon={Settings}  sub="accès complet"        trend={1} />
              </div>

              <div className="adm-charts">
                <ChartCard title="Inscriptions par période" sub="8 dernières périodes"
                  badge="Histogramme" badgeColor={C.violet}>
                  <BarChart data={barData} barSize={18}>
                    <defs>
                      <linearGradient id="adm-barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.violet} />
                        <stop offset="100%" stopColor={C.g3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.ink3, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: C.ink3, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="inscrits" fill="url(#adm-barGrad)" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ChartCard>

                <ChartCard title="Distribution des rôles" sub="Proportion par type">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={82} innerRadius={46}
                      paddingAngle={4} cx="50%" cy="50%" isAnimationActive={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<DarkTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8", fontFamily: "DM Sans" }}
                      iconType="circle" iconSize={8} />
                  </PieChart>
                </ChartCard>
              </div>

              <UserTable
                users={filtered.slice(0, 8)}
                onEdit={openEdit} onDelete={deleteUser}
                onView={viewProfile} onApprove={approveUser}
                onExport={exportExcel}
              />
            </motion.div>
          )}

          {/* USERS */}
          {view === "users" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .3 }}>
              <UserTable
                users={filtered}
                onEdit={openEdit} onDelete={deleteUser}
                onView={viewProfile} onApprove={approveUser}
                onExport={exportExcel} full
              />
            </motion.div>
          )}

          {/* STRUCT */}
          {(view === "ufr" || view === "departement" || view === "filiere") && (
            <StructView
              type={view}
              ufrs={ufrs}
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

      {/* MODALS */}
      <AnimatePresence>
        {open && (
          <UserModal
            title="Créer un utilisateur"
            form={form} setForm={setForm}
            ufrs={ufrs}
            departements={departements}
            filieres={filieres}
            onUfrChange={handleUfrChange}
            onDeptChange={handleDeptChange}
            onSave={createUser}
            onClose={() => {
              setOpen(false);
              setDepartements([]);
              setFilieres([]);
              setForm({ first_name: "", last_name: "", email: "", role_id: "", numero_dossier: "", ufr_id: "", departement_id: "", filiere_id: "" });
            }}
            saveLabel="Créer"
          />
        )}
        {editOpen && selectedUser && (
          <UserModal
            title="Modifier l'utilisateur"
            form={selectedUser} setForm={setSelectedUser}
            ufrs={ufrs}
            departements={editDepts}
            filieres={editFilieres}
            onUfrChange={handleEditUfrChange}
            onDeptChange={handleEditDeptChange}
            onSave={updateUser}
            onClose={() => {
              setEditOpen(false);
              setSelectedUser(null);
              setEditDepts([]);
              setEditFilieres([]);
            }}
            saveLabel="Modifier"
          />
        )}
        {profileOpen && profile && (
          <ProfileModal
            profile={profile} setProfile={setProfile}
            onSave={updateProfile}
            onClose={() => setProfileOpen(false)}
          />
        )}
      </AnimatePresence>

      <ToastStack toasts={toasts} remove={removeToast} />
    </div>
  );
}