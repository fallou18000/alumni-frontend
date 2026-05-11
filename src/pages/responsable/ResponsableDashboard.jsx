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
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8000";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --g1:#00d4a0;--g2:#00b4d8;--g3:#0077ff;
  --gold:#f5a623;--rose:#ff6b6b;
  --ink:#0a0f1e;--ink2:#1e2a3a;--ink3:#64748b;--ink4:#94a3b8;
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
  --glow:0 0 20px rgba(0,212,160,0.15);
}

html,body{height:100%;font-family:var(--font);background:var(--bg);color:#e2e8f0;}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-thumb{background:rgba(0,212,160,0.2);border-radius:3px;}
::-webkit-scrollbar-track{background:transparent;}

.rs{display:flex;min-height:100vh;font-size:13.5px;}

/* SIDEBAR */
.rs-sb{
  width:240px;flex-shrink:0;
  background:var(--bg2);
  border-right:1px solid var(--border);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;
  overflow:hidden;
}
.rs-sb-glow{
  position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg,var(--g1),var(--g2),var(--g3));
}
.rs-profile{
  padding:28px 18px 22px;
  border-bottom:1px solid var(--border);
  display:flex;flex-direction:column;align-items:center;gap:10px;
  position:relative;
}
.rs-av-ring{padding:2.5px;border-radius:50%;background:linear-gradient(135deg,var(--g1),var(--g3));display:inline-flex;}
.rs-av{
  width:48px;height:48px;border-radius:50%;
  background:var(--bg3);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--display);font-size:16px;font-weight:700;
  color:#fff;letter-spacing:-.5px;
}
.rs-name{font-family:var(--display);font-size:13.5px;font-weight:700;color:#fff;text-align:center;letter-spacing:-.2px;line-height:1.2;}
.rs-subrole{font-size:10px;color:var(--sbtext);text-align:center;letter-spacing:.5px;}
.rs-chip{
  font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
  color:var(--g1);background:rgba(0,212,160,0.1);
  border:1px solid rgba(0,212,160,0.2);
  padding:3px 10px;border-radius:20px;
}
.rs-nav{flex:1;padding:12px 8px 10px;overflow-y:auto;}
.rs-nav::-webkit-scrollbar{width:0;}
.rs-grp{
  font-size:8.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
  color:rgba(255,255,255,0.14);padding:12px 14px 5px;
}
.rs-ni{
  display:flex;align-items:center;gap:9px;
  padding:8px 12px;border-radius:var(--r3);
  cursor:pointer;font-size:12.5px;font-weight:500;
  color:var(--sbtext);transition:all .18s;
  margin-bottom:1px;user-select:none;position:relative;
}
.rs-ni:hover{background:rgba(255,255,255,0.04);color:rgba(255,255,255,0.7);}
.rs-ni.on{background:rgba(0,212,160,0.1);color:#fff;font-weight:600;}
.rs-ni.on::before{
  content:'';position:absolute;left:0;top:22%;bottom:22%;
  width:2px;border-radius:0 2px 2px 0;
  background:linear-gradient(to bottom,var(--g1),var(--g2));
}
.rs-ico{
  width:26px;height:26px;border-radius:7px;
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  background:rgba(255,255,255,0.04);transition:all .18s;
}
.rs-ni.on .rs-ico{background:rgba(0,212,160,0.18);color:var(--g1);}
.rs-sep{height:1px;background:var(--border);margin:6px 10px;}
.rs-sb-ft{padding:8px 8px 18px;border-top:1px solid var(--border);}

/* TOPBAR */
.rs-main{flex:1;display:flex;flex-direction:column;min-height:100vh;overflow:auto;}
.rs-top{
  display:flex;align-items:center;gap:10px;
  padding:0 26px;height:60px;
  background:rgba(6,12,26,0.92);
  border-bottom:1px solid var(--border);
  position:sticky;top:0;z-index:40;
  backdrop-filter:blur(24px);flex-shrink:0;
}
.rs-top-title{
  flex:1;font-family:var(--display);
  font-size:16px;font-weight:700;
  letter-spacing:-.3px;color:#fff;
  display:flex;align-items:center;gap:8px;
}
.rs-crumb{
  font-family:var(--font);font-size:10.5px;color:var(--ink3);
  font-weight:400;background:var(--bg3);
  padding:2px 9px;border-radius:20px;
  border:1px solid var(--border);letter-spacing:.3px;
}
.rs-srch{
  display:flex;align-items:center;gap:8px;
  background:var(--bg3);border:1px solid var(--border);
  border-radius:var(--r2);padding:7px 12px;width:200px;
  transition:all .22s;
}
.rs-srch:focus-within{
  border-color:rgba(0,212,160,0.4);
  box-shadow:0 0 0 3px rgba(0,212,160,0.07);
  background:var(--bg2);width:230px;
}
.rs-srch input{background:none;border:none;outline:none;font-size:12.5px;font-family:var(--font);color:#e2e8f0;width:100%;}
.rs-srch input::placeholder{color:rgba(148,163,184,0.4);}
.rs-date{
  font-size:10.5px;color:var(--ink4);font-family:var(--mono);
  background:var(--bg3);border:1px solid var(--border);
  border-radius:var(--r2);padding:5px 10px;white-space:nowrap;letter-spacing:.4px;
}
.rs-bell{
  width:36px;height:36px;border-radius:var(--r2);
  background:var(--bg3);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .18s;
}
.rs-bell:hover{border-color:rgba(0,212,160,0.4);color:var(--g1);}

/* BUTTONS */
.btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 14px;border-radius:var(--r2);
  font-size:12px;font-weight:600;font-family:var(--font);
  cursor:pointer;border:none;transition:all .18s;white-space:nowrap;
}
.btn-g{background:linear-gradient(135deg,var(--g1),var(--g2));color:#060c1a;box-shadow:0 2px 12px rgba(0,212,160,0.25);}
.btn-g:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 4px 18px rgba(0,212,160,0.35);}
.btn-ghost{background:var(--bg3);border:1px solid var(--border);color:rgba(255,255,255,0.55);}
.btn-ghost:hover{border-color:rgba(0,212,160,0.35);color:var(--g1);}
.btn-gold{background:linear-gradient(135deg,var(--gold),#e67e22);color:#fff;box-shadow:0 2px 12px rgba(245,166,35,0.25);}
.btn-gold:hover{opacity:.9;transform:translateY(-1px);}
.btn-rose{background:linear-gradient(135deg,var(--rose),#e74c3c);color:#fff;box-shadow:0 2px 12px rgba(255,107,107,0.25);}
.btn-rose:hover{opacity:.9;transform:translateY(-1px);}

/* CONTENT */
.rs-content{flex:1;padding:24px 26px;overflow-y:auto;display:flex;flex-direction:column;gap:20px;}

/* BANNER */
.rs-banner{
  background:var(--card);border:1px solid var(--border);border-radius:var(--r);
  padding:28px 30px;
  display:flex;align-items:center;justify-content:space-between;
  position:relative;overflow:hidden;box-shadow:var(--sh2);
}
.rs-banner-bg{
  position:absolute;inset:0;
  background:radial-gradient(ellipse at 90% 50%,rgba(0,212,160,0.08),transparent 60%),radial-gradient(ellipse at 10% 80%,rgba(0,119,255,0.06),transparent 55%);
  pointer-events:none;
}
.rs-banner-grid{
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
  background-size:40px 40px;pointer-events:none;
}
.rs-banner-left{position:relative;z-index:1;}
.rs-banner-eyebrow{
  font-size:9.5px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;
  color:var(--g1);margin-bottom:8px;display:flex;align-items:center;gap:6px;
}
.rs-banner-eyebrow::before{content:'';width:18px;height:1.5px;background:var(--g1);}
.rs-banner-title{font-family:var(--display);font-size:28px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:6px;line-height:1.1;}
.rs-banner-sub{font-size:13px;color:rgba(255,255,255,0.38);font-weight:300;}
.rs-banner-right{
  position:relative;z-index:1;display:flex;gap:0;
  background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;
}
.rs-banner-stat{padding:16px 24px;text-align:center;border-right:1px solid var(--border);}
.rs-banner-stat:last-child{border-right:none;}
.rs-bsv{font-family:var(--display);font-size:30px;font-weight:800;color:#fff;letter-spacing:-1.5px;line-height:1;}
.rs-bsl{font-size:10px;color:rgba(255,255,255,0.35);margin-top:4px;letter-spacing:.8px;text-transform:uppercase;}

/* STAT CARDS */
.rs-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.rs-stat{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--r);padding:18px 18px 14px;
  box-shadow:var(--sh);position:relative;overflow:hidden;
  transition:all .22s;cursor:default;
}
.rs-stat:hover{transform:translateY(-3px);box-shadow:var(--sh2),var(--glow);border-color:rgba(0,212,160,0.18);}
.rs-stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px;}
.rs-stat-ico{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.rs-stat-trend{font-size:10px;font-weight:700;padding:2px 7px;border-radius:20px;display:flex;align-items:center;gap:2px;font-family:var(--mono);}
.rs-stat-trend.up{background:rgba(0,212,160,0.12);color:var(--g1);}
.rs-stat-trend.dn{background:rgba(255,107,107,0.12);color:var(--rose);}
.rs-stat-lbl{font-size:9.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink4);margin-bottom:5px;}
.rs-stat-val{font-family:var(--display);font-size:28px;font-weight:800;letter-spacing:-1.2px;line-height:1;margin-bottom:3px;color:#fff;}
.rs-stat-sub{font-size:10.5px;color:var(--ink3);}
.rs-stat-spark{margin-top:10px;height:36px;width:100%;min-width:0;}
.rs-stat-stripe{position:absolute;bottom:0;left:0;right:0;height:2px;opacity:.6;}

/* CHARTS */
.rs-charts{display:grid;grid-template-columns:1.6fr 1fr;gap:12px;}
.rs-cc{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:18px 20px;box-shadow:var(--sh);}
.rs-cc-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
.rs-cc-title{font-family:var(--display);font-size:13.5px;font-weight:700;color:#fff;letter-spacing:-.2px;}
.rs-cc-sub{font-size:11px;color:var(--ink4);margin-top:2px;}
.rs-cc-pill{font-size:9.5px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:.3px;}

/* FILTER */
.rs-filter{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--r);padding:16px 20px;
  box-shadow:var(--sh);display:flex;align-items:center;gap:10px;flex-wrap:wrap;
}
.rs-fl{font-size:9.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink3);display:flex;align-items:center;gap:6px;white-space:nowrap;}
.rs-fi{
  background:var(--bg3);border:1px solid var(--border);
  border-radius:var(--r3);padding:7px 11px;
  font-size:12.5px;font-family:var(--font);
  color:#e2e8f0;outline:none;transition:all .18s;
}
.rs-fi:focus{border-color:rgba(0,212,160,0.4);box-shadow:0 0 0 3px rgba(0,212,160,0.07);}
.rs-fi::placeholder{color:rgba(148,163,184,0.3);}
select.rs-fi{
  appearance:none;cursor:pointer;padding-right:26px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%2364748b'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 9px center;
}
select.rs-fi option{background:#111d30;color:#e2e8f0;}

/* TABLE */
.rs-tbl{background:var(--card);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden;}
.rs-tbl-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:10px;}
.rs-tbl-title{font-family:var(--display);font-size:13.5px;font-weight:700;letter-spacing:-.2px;color:#fff;display:flex;align-items:center;gap:8px;}
.rs-tbl-ct{font-size:10.5px;color:var(--ink4);font-weight:500;background:var(--bg3);padding:2px 8px;border-radius:20px;border:1px solid var(--border);font-family:var(--mono);}
.rs-thead{display:grid;grid-template-columns:2fr 1.6fr 1fr 1.2fr 1.2fr 80px;padding:8px 20px;background:var(--bg3);border-bottom:1px solid var(--border);}
.rs-th{font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:rgba(148,163,184,0.6);}
.rs-tr{display:grid;grid-template-columns:2fr 1.6fr 1fr 1.2fr 1.2fr 80px;padding:11px 20px;border-bottom:1px solid var(--border);align-items:center;transition:background .14s;}
.rs-tr:last-child{border-bottom:none;}
.rs-tr:hover{background:rgba(255,255,255,0.025);}
.rs-uc{display:flex;align-items:center;gap:10px;}
.rs-av-sm{width:34px;height:34px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:11.5px;font-weight:700;color:#fff;}
.rs-uname{font-size:13px;font-weight:600;color:#e2e8f0;letter-spacing:-.1px;}
.rs-usub{font-size:10.5px;color:var(--ink4);margin-top:1px;}
.rs-td{font-size:12px;color:var(--ink3);}
.bk{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:.2px;}
.bk::before{content:'';width:4px;height:4px;border-radius:50%;flex-shrink:0;}
.bk-ok{background:rgba(0,212,160,0.1);color:var(--g1);border:1px solid rgba(0,212,160,0.2);}
.bk-ok::before{background:var(--g1);}
.bk-no{background:rgba(255,107,107,0.1);color:var(--rose);border:1px solid rgba(255,107,107,0.2);}
.bk-no::before{background:var(--rose);}
.bk-pend{background:rgba(245,166,35,0.1);color:var(--gold);border:1px solid rgba(245,166,35,0.2);}
.bk-pend::before{background:var(--gold);}
.rs-ib{
  width:28px;height:28px;border-radius:7px;
  border:1px solid var(--border);background:none;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--ink4);transition:all .15s;
}
.rs-ib:hover{border-color:rgba(0,212,160,0.4);color:var(--g1);background:rgba(0,212,160,0.07);}
.rs-ib.pdf:hover{border-color:rgba(245,166,35,0.4);color:var(--gold);background:rgba(245,166,35,0.07);}
.rs-empty{padding:52px 20px;text-align:center;color:var(--ink4);}

/* MODAL */
.rs-overlay{position:fixed;inset:0;background:rgba(4,8,18,0.8);backdrop-filter:blur(12px);z-index:200;display:flex;align-items:center;justify-content:center;}
.rs-modal{background:var(--card2);border:1px solid var(--border2);border-radius:20px;width:520px;max-height:88vh;display:flex;flex-direction:column;box-shadow:var(--sh3);overflow:hidden;}
.rs-m-hero{min-height:120px;position:relative;background:linear-gradient(145deg,#060c1a 0%,#0d1a2e 60%,#081828 100%);display:flex;align-items:flex-end;overflow:hidden;}
.rs-m-hero-mesh{position:absolute;inset:0;background-image:radial-gradient(circle at 85% 35%,rgba(0,212,160,0.14),transparent 55%),radial-gradient(circle at 15% 75%,rgba(0,119,255,0.1),transparent 50%);}
.rs-m-hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:28px 28px;}
.rs-m-hero-ct{position:relative;z-index:1;padding:18px 22px;display:flex;align-items:flex-end;gap:14px;width:100%;}
.rs-m-av{width:54px;height:54px;border-radius:50%;flex-shrink:0;background:rgba(255,255,255,0.08);border:2px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-size:18px;font-weight:800;color:#fff;}
.rs-m-name{font-family:var(--display);font-size:20px;font-weight:800;color:#fff;letter-spacing:-.3px;margin-bottom:3px;}
.rs-m-job{font-size:12px;color:rgba(255,255,255,0.5);display:flex;align-items:center;gap:5px;}
.rs-m-close{position:absolute;top:12px;right:12px;z-index:2;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:7px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.6);transition:all .14s;}
.rs-m-close:hover{background:rgba(255,255,255,0.14);color:#fff;}
.rs-m-body{padding:20px 22px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:14px;}
.rs-m-sect{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(148,163,184,0.5);display:flex;align-items:center;gap:6px;}
.rs-m-sect::after{content:'';flex:1;height:1px;background:var(--border);}
.rs-m-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.rs-m-item{background:var(--bg3);border:1px solid var(--border);border-radius:9px;padding:11px 13px;transition:border-color .15s;}
.rs-m-item:hover{border-color:var(--border2);}
.rs-m-lbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(148,163,184,0.5);margin-bottom:5px;display:flex;align-items:center;gap:4px;}
.rs-m-val{font-size:13.5px;font-weight:600;color:#e2e8f0;}
.rs-m-val.muted{color:var(--ink3);font-weight:400;font-style:italic;font-size:12.5px;}
.rs-m-ft{padding:13px 22px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end;background:rgba(0,0,0,0.15);flex-shrink:0;}

/* TOASTS */
.rs-toasts{position:fixed;bottom:20px;right:20px;z-index:600;display:flex;flex-direction:column;gap:7px;align-items:flex-end;pointer-events:none;}
.rs-toast{display:flex;align-items:center;gap:9px;background:var(--bg2);border:1px solid var(--border2);border-radius:10px;padding:10px 14px;min-width:220px;color:#e2e8f0;font-size:12.5px;box-shadow:var(--sh2);pointer-events:all;}
.rs-td2{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.rs-td2.s{background:var(--g1);}
.rs-td2.e{background:var(--rose);}
.rs-td2.i{background:var(--gold);}

/* TOP ENTREPRISES */
.top-ent-row{
  display:flex;align-items:center;gap:12px;
  padding:10px 14px;border-radius:var(--r3);
  transition:background .14s;cursor:default;
}
.top-ent-row:hover{background:rgba(255,255,255,0.03);}
.top-ent-rank{
  width:20px;text-align:center;
  font-family:var(--mono);font-size:10px;font-weight:700;
  color:var(--ink3);flex-shrink:0;
}
.top-ent-rank.gold{color:var(--gold);}
.top-ent-rank.silver{color:#94a3b8;}
.top-ent-rank.bronze{color:#cd7f32;}
.top-ent-logo{
  width:32px;height:32px;border-radius:8px;
  background:var(--bg3);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;font-family:var(--display);
  color:var(--g1);flex-shrink:0;
}
.top-ent-info{flex:1;min-width:0;}
.top-ent-name{font-size:12.5px;font-weight:600;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.top-ent-bar-wrap{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin-top:5px;overflow:hidden;}
.top-ent-bar{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--g1),var(--g2));}
.top-ent-ct{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--g1);flex-shrink:0;}
`;

if (typeof document !== "undefined" && !document.getElementById("rs-css")) {
  const s = document.createElement("style"); s.id = "rs-css"; s.textContent = CSS;
  document.head.appendChild(s);
}

/* ─── HELPERS ─── */
const AV_GRADS = [
  "linear-gradient(135deg,#00d4a0,#00b4d8)",
  "linear-gradient(135deg,#0077ff,#00b4d8)",
  "linear-gradient(135deg,#7c3aed,#00d4a0)",
  "linear-gradient(135deg,#ff6b6b,#f5a623)",
  "linear-gradient(135deg,#0077ff,#7c3aed)",
];
const avC = id => AV_GRADS[(id || 0) % AV_GRADS.length];
const ini = u => ((u?.first_name?.[0] || "") + (u?.last_name?.[0] || "")).toUpperCase() || "?";
const iniStr = s => (s || "?")[0].toUpperCase();
const PIE_COLORS = ["#00d4a0", "#ff6b6b", "#f5a623", "#0077ff"];

/* ─── Enrichissement alumni avec objet entreprise ─── */
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
  doc.setFillColor(6, 12, 26); doc.rect(0, 0, W, 48, "F");
  doc.setFillColor(0, 212, 160); doc.rect(0, 0, W, 3, "F");
  doc.setFillColor(13, 21, 38); doc.circle(M + 12, 25, 12, "F");
  doc.setTextColor(255, 255, 255); doc.setFontSize(14); doc.setFont("helvetica", "bold");
  doc.text(ini(user), M + 12, 28.5, { align: "center" });
  doc.setFontSize(18); doc.text(`${user.first_name} ${user.last_name}`, M + 30, 23);
  doc.setFontSize(10); doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 212, 160); doc.text(user.profile?.job_title || "Poste non renseigné", M + 30, 31);
  doc.setTextColor(148, 163, 184); doc.setFontSize(9); doc.text(user.email || "", M + 30, 38);
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
  doc.setFillColor(6, 12, 26); doc.rect(0, 275, W, 22, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 100, 110);
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")} — Portail Alumni`, M, 288);
  doc.setTextColor(0, 212, 160); doc.text("CONFIDENTIEL", W - M, 288, { align: "right" });
  doc.save(`fiche_${user.first_name}_${user.last_name}.pdf`);
};

/* ─── NAV ITEM ─── */
function NI({ icon: Icon, label, active, onClick }) {
  return (
    <div className={`rs-ni ${active ? "on" : ""}`} onClick={onClick}>
      <div className="rs-ico"><Icon size={14} strokeWidth={2} /></div>
      {label}
    </div>
  );
}

/* ─── SPARKLINE ─── */
function SparkLine({ data, color, title }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);
  if (!ready || !data?.length) return <div style={{ height: 36 }} />;
  return (
    <div style={{ height: 36, width: "100%", minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={36} minWidth={0}>
        <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="total" stroke={color} strokeWidth={1.8}
            fill={`url(#spark-${title})`} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── STAT CARD ─── */
function StatCard({ title, value, color, icon: Icon, sub, trend, sparkData }) {
  return (
    <div className="rs-stat">
      <div className="rs-stat-top">
        <div className="rs-stat-ico" style={{ background: color + "18", color }}>
          <Icon size={16} strokeWidth={2} />
        </div>
        {trend != null && (
          <span className={`rs-stat-trend ${trend > 0 ? "up" : "dn"}`}>
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="rs-stat-lbl">{title}</div>
      <div className="rs-stat-val">{value ?? 0}</div>
      <div className="rs-stat-sub">{sub}</div>
      {sparkData?.length > 0 && (
        <div className="rs-stat-spark">
          <SparkLine data={sparkData} color={color} title={title} />
        </div>
      )}
      <div className="rs-stat-stripe" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
    </div>
  );
}

/* ─── CHART CARD ─── */
function CC({ title, sub, badge, bColor, height = 210, children }) {
  return (
    <div className="rs-cc">
      <div className="rs-cc-head">
        <div>
          <div className="rs-cc-title">{title}</div>
          {sub && <div className="rs-cc-sub">{sub}</div>}
        </div>
        {badge && (
          <span className="rs-cc-pill" style={{ background: (bColor || "#00d4a0") + "16", color: bColor || "#00d4a0" }}>
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

/* ─── TOP ENTREPRISES WIDGET ─── */
function TopEntreprises({ users }) {
  const counts = {};
  users.forEach(u => {
    const nom = u.profile?.entreprise?.nom;
    if (nom) counts[nom] = (counts[nom] || 0) + 1;
  });
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const max = sorted[0]?.[1] || 1;
  const rankClass = (i) => i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";

  return (
    <div className="rs-cc" style={{ flex: 1 }}>
      <div className="rs-cc-head">
        <div>
          <div className="rs-cc-title">Top entreprises</div>
          <div className="rs-cc-sub">Par nombre d'alumni</div>
        </div>
        <span className="rs-cc-pill" style={{ background: "#0077ff16", color: "#0077ff" }}>
          {sorted.length} entreprises
        </span>
      </div>
      {sorted.length === 0 ? (
        <div className="rs-empty" style={{ padding: "20px 0" }}>
          <Building2 size={24} style={{ opacity: .15, marginBottom: 8 }} />
          <div style={{ fontSize: 12 }}>Aucune donnée</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {sorted.map(([nom, count], i) => (
            <div className="top-ent-row" key={nom}>
              <span className={`top-ent-rank ${rankClass(i)}`}>
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

/* ══════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════ */
export default function ResponsableDashboard() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();
  const { toasts, push: toast } = useToasts();

  const storedUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const respName = storedUser.first_name && storedUser.last_name
    ? `${storedUser.first_name} ${storedUser.last_name}`
    : "Responsable";
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
    } catch {
      toast("Erreur de chargement", "e");
    }
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
  const pieData   = [{ name: "Avec emploi", value: stats.with_job || 0 }, { name: "Sans emploi", value: stats.without_job || 0 }];
  const today     = new Date().toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const labels    = { dashboard: "Tableau de bord", alumni: "Alumni" };

  return (
    <div className="rs">

      {/* ── SIDEBAR ── */}
      <aside className="rs-sb">
        <div className="rs-sb-glow" />
        <div className="rs-profile">
          <div className="rs-av-ring"><div className="rs-av">{respInitials}</div></div>
          <div className="rs-name">{respName}</div>
          <div className="rs-subrole">Responsable académique</div>
          <div className="rs-chip">Responsable</div>
        </div>
        <nav className="rs-nav">
          <div className="rs-grp">Principal</div>
          <NI icon={LayoutDashboard} label="Tableau de bord" active={view === "dashboard"} onClick={() => setView("dashboard")} />
          <NI icon={Users}           label="Alumni"          active={view === "alumni"}    onClick={() => setView("alumni")} />
        </nav>
        <div className="rs-sb-ft">
          <NI icon={LogOut} label="Déconnexion" active={false} onClick={() => navigate("/login")} />
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="rs-main">
        <div className="rs-top">
          <div className="rs-top-title">
            {labels[view]}
            <span className="rs-crumb">{labels[view]}</span>
          </div>
          <div className="rs-srch">
            <Search size={13} style={{ color: "rgba(148,163,184,0.4)", flexShrink: 0 }} />
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
          <span className="rs-date">{today}</span>
          <div className="rs-bell"><Bell size={14} strokeWidth={2} /></div>
          <button className="btn btn-g" onClick={exportExcel}><Download size={12} /> Exporter</button>
        </div>

        <div className="rs-content">

          {/* ══ DASHBOARD VIEW ══ */}
          {view === "dashboard" && (
            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .35 }}
            >
              <div className="rs-banner">
                <div className="rs-banner-bg" /><div className="rs-banner-grid" />
                <div className="rs-banner-left">
                  <div className="rs-banner-eyebrow"><Sparkles size={10} /> Espace Responsable</div>
                  <div className="rs-banner-title">Bonjour, {storedUser.first_name || respName}</div>
                  <div className="rs-banner-sub">Voici un aperçu en temps réel de votre réseau Alumni</div>
                </div>
                <div className="rs-banner-right">
                  <div className="rs-banner-stat">
                    <div className="rs-bsv">{stats.total ?? 0}</div>
                    <div className="rs-bsl">Total Alumni</div>
                  </div>
                  <div className="rs-banner-stat">
                    <div className="rs-bsv">{stats.insertion_rate ?? 0}%</div>
                    <div className="rs-bsl">Taux insertion</div>
                  </div>
                </div>
              </div>

              <div className="rs-stats">
                <StatCard title="Total Alumni"   value={stats.total}       color="#00d4a0" icon={Users}       sub="inscrits"     trend={4}  sparkData={chartData} />
                <StatCard title="Avec emploi"    value={stats.with_job}    color="#0077ff" icon={Briefcase}   sub="placés"       trend={2}  sparkData={chartData} />
                <StatCard title="Sans emploi"    value={stats.without_job} color="#ff6b6b" icon={AlertCircle} sub="en recherche" trend={-1} sparkData={chartData} />
                <StatCard title="Taux insertion" value={stats.insertion_rate ? `${stats.insertion_rate}%` : "—"} color="#f5a623" icon={TrendingUp} sub="taux global" sparkData={chartData} />
              </div>

              <div className="rs-charts">
                <CC title="Évolution des inscriptions" sub="Croissance cumulée" badge="Tendance" bColor="#00d4a0">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="gc1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d4a0" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="#00d4a0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "#111d30", fontSize: 11, color: "#e2e8f0" }} />
                    <Area type="monotone" dataKey="total" stroke="#00d4a0" strokeWidth={2} fill="url(#gc1)" dot={false} activeDot={{ r: 4, fill: "#00d4a0" }} isAnimationActive={false} />
                  </AreaChart>
                </CC>
                <CC title="Emploi vs Sans emploi" sub="Répartition actuelle">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={80} innerRadius={44} paddingAngle={4} cx="50%" cy="50%" isAnimationActive={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "#111d30", fontSize: 11, color: "#e2e8f0" }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  </PieChart>
                </CC>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12 }}>
                <CC title="Inscriptions récentes" sub="8 dernières périodes" badge="Histogramme" bColor="#0077ff">
                  <BarChart data={barData} barSize={14}>
                    <defs>
                      <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00d4a0" /><stop offset="100%" stopColor="#0077ff" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "#111d30", fontSize: 11, color: "#e2e8f0" }} />
                    <Bar dataKey="inscrits" fill="url(#bg2)" radius={[5, 5, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </CC>
                <TopEntreprises users={allUsers} />
              </div>

              <AlumniTable users={filtered.slice(0, 8)} onView={viewProfile} onPDF={handlePDF} />
            </motion.div>
          )}

          {/* ══ ALUMNI VIEW ══ */}
          {view === "alumni" && (
            <motion.div
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .3 }}
            >
              <div className="rs-filter">
                <div className="rs-fl"><SlidersHorizontal size={11} /> Filtres</div>

                <select className="rs-fi" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                  <option value="">Tous les statuts</option>
                  <option value="approved">Approuvé</option>
                  <option value="pending">En attente</option>
                </select>

                <input className="rs-fi" placeholder="Promotion (ex: 2022)" value={filters.promotion}
                  onChange={e => setFilters({ ...filters, promotion: e.target.value })} />

                <input className="rs-fi" placeholder="Poste / métier" value={filters.job_title}
                  onChange={e => setFilters({ ...filters, job_title: e.target.value })} />

                <input className="rs-fi" placeholder="Année diplôme" value={filters.graduation_year}
                  onChange={e => setFilters({ ...filters, graduation_year: e.target.value })} />

                <select className="rs-fi" value={filters.entreprise_id}
                  onChange={e => setFilters({ ...filters, entreprise_id: e.target.value })}>
                  <option value="">Toutes les entreprises</option>
                  {entreprises.map(ent => (
                    <option key={ent.id} value={ent.id}>{ent.nom}</option>
                  ))}
                </select>

                <button className="btn btn-g" onClick={applyFilter}>Appliquer</button>
                <button className="btn btn-ghost" onClick={resetFilter}>Réinitialiser</button>
              </div>

              {filters.entreprise_id && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: "var(--r3)",
                  background: "rgba(0,212,160,0.08)", border: "1px solid rgba(0,212,160,0.2)",
                  fontSize: 12, color: "var(--g1)"
                }}>
                  <Building2 size={13} />
                  Filtré par : <strong>{entreprises.find(ent => String(ent.id) === String(filters.entreprise_id))?.nom || "Entreprise sélectionnée"}</strong>
                  <button onClick={resetFilter} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--g1)", display: "flex" }}>
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
          <motion.div className="rs-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setOpen(false)}>
            <motion.div className="rs-modal"
              initial={{ opacity: 0, scale: .94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .96 }}
              transition={{ duration: .22 }}>
              <div className="rs-m-hero">
                <div className="rs-m-hero-mesh" /><div className="rs-m-hero-grid" />
                <div className="rs-m-hero-ct">
                  <div className="rs-m-av">{ini(selUser)}</div>
                  <div>
                    <div className="rs-m-name">{selUser.first_name} {selUser.last_name}</div>
                    <div className="rs-m-job">
                      <Briefcase size={10} />
                      {selUser.profile?.job_title || "Poste non renseigné"}
                    </div>
                  </div>
                </div>
                <button className="rs-m-close" onClick={() => setOpen(false)}><X size={12} /></button>
              </div>

              <div className="rs-m-body">
                <div className="rs-m-sect"><Mail size={9} /> Coordonnées</div>
                <div className="rs-m-grid">
                  <div className="rs-m-item" style={{ gridColumn: "span 2" }}>
                    <div className="rs-m-lbl"><Mail size={8} /> Email</div>
                    <div className="rs-m-val">{selUser.email || "—"}</div>
                  </div>
                </div>

                <div className="rs-m-sect" style={{ marginTop: 2 }}><GraduationCap size={9} /> Parcours</div>
                <div className="rs-m-grid">
                  <div className="rs-m-item">
                    <div className="rs-m-lbl"><GraduationCap size={8} /> Promotion</div>
                    <div className={`rs-m-val ${!selUser.profile?.promotion ? "muted" : ""}`}>{selUser.profile?.promotion || "Non renseignée"}</div>
                  </div>
                  <div className="rs-m-item">
                    <div className="rs-m-lbl"><Calendar size={8} /> Année diplôme</div>
                    <div className={`rs-m-val ${!selUser.profile?.graduation_year ? "muted" : ""}`}>{selUser.profile?.graduation_year || "Non renseignée"}</div>
                  </div>
                </div>

                <div className="rs-m-sect" style={{ marginTop: 2 }}><Briefcase size={9} /> Situation pro</div>
                <div className="rs-m-grid">
                  <div className="rs-m-item">
                    <div className="rs-m-lbl"><Briefcase size={8} /> Poste</div>
                    <div className={`rs-m-val ${!selUser.profile?.job_title ? "muted" : ""}`}>{selUser.profile?.job_title || "Non renseigné"}</div>
                  </div>
                  <div className="rs-m-item">
                    <div className="rs-m-lbl"><CheckCircle size={8} /> Statut</div>
                    <div className="rs-m-val">
                      <span className={`bk ${selUser.status === "approved" ? "bk-ok" : "bk-pend"}`}>
                        {selUser.status === "approved" ? "Approuvé" : "En attente"}
                      </span>
                    </div>
                  </div>
                  {selUser.profile?.entreprise && (
                    <div className="rs-m-item" style={{ gridColumn: "span 2" }}>
                      <div className="rs-m-lbl"><Building2 size={8} /> Entreprise</div>
                      <div className="rs-m-val">{selUser.profile.entreprise.nom || selUser.profile.entreprise_id}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rs-m-ft">
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
      <div className="rs-toasts">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div className="rs-toast" key={t.id}
              initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} transition={{ duration: .2 }}>
              <div className={`rs-td2 ${t.type}`} />
              <span style={{ flex: 1, fontWeight: 500 }}>{t.msg}</span>
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
    <div className="rs-tbl">
      <div className="rs-tbl-hd">
        <div className="rs-tbl-title">
          {full ? "Liste des Alumni" : "Aperçu récent"}
          <span className="rs-tbl-ct">{users.length} résultat{users.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
      <div className="rs-thead">
        <div className="rs-th">Nom</div>
        <div className="rs-th">Email</div>
        <div className="rs-th">Promotion</div>
        <div className="rs-th">Emploi</div>
        <div className="rs-th">Entreprise</div>
        <div className="rs-th">Actions</div>
      </div>
      <AnimatePresence>
        <>
          {users.length === 0 ? (
            <div className="rs-empty">
              <Users size={30} style={{ opacity: .15, marginBottom: 8 }} />
              <div style={{ fontSize: 13 }}>Aucun alumni trouvé</div>
            </div>
          ) : users.map((u) => (
            <motion.div
              className="rs-tr"
              key={u.id ?? u.email}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .14 }}
            >
              <div className="rs-uc">
                <div className="rs-av-sm" style={{ background: avC(u.id) }}>{ini(u)}</div>
                <div>
                  <div className="rs-uname">{u.first_name} {u.last_name}</div>
                  <div className="rs-usub">{u.profile?.promotion || "—"}</div>
                </div>
              </div>
              <div className="rs-td">{u.email}</div>
              <div className="rs-td">{u.profile?.promotion || <span style={{ color: "#334155" }}>—</span>}</div>
              <div className="rs-td">
                {u.profile?.job_title
                  ? <span className="bk bk-ok">{u.profile.job_title}</span>
                  : <span className="bk bk-no">Sans emploi</span>}
              </div>
              <div className="rs-td">
                {u.profile?.entreprise?.nom
                  ? <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8" }}>
                      <Building2 size={11} style={{ opacity: .6 }} />
                      {u.profile.entreprise.nom}
                    </span>
                  : <span style={{ color: "#334155" }}>—</span>}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button className="rs-ib" title="Voir profil" onClick={() => onView(u.id)}>
                  <Eye size={12} />
                </button>
                <button className="rs-ib pdf" title="Télécharger PDF" onClick={() => onPDF(u)}>
                  <FileText size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </>
      </AnimatePresence>
    </div>
  );
}