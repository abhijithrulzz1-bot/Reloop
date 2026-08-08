import { useState, useMemo } from "react";
import {
  Search, Heart, MapPin, Star, ArrowLeftRight, X, ChevronLeft,
  ChevronRight, Home, Compass, MessageCircle, User, Plus,
  Smartphone, Laptop, Car, Bike, Gamepad2, Camera, Sofa, Watch,
  Shirt, Package, SlidersHorizontal, Check, BadgeCheck, TrendingUp
} from "lucide-react";

// ---------- THEME ----------
const T = {
  bg: "#0B0F0E",
  surface: "#141A18",
  surfaceRaised: "#1C2422",
  border: "#28322F",
  ink: "#F3F5F2",
  inkMuted: "#93A099",
  give: "#FF7A59",
  giveDim: "#3A2620",
  get: "#4ADE9E",
  getDim: "#173028",
  gold: "#E8C468",
};

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .f-display { font-family: 'Fraunces', serif; }
    .f-body { font-family: 'Inter', sans-serif; }
    .f-mono { font-family: 'IBM Plex Mono', monospace; }
    * { box-sizing: border-box; }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: #2A332F; border-radius: 4px; }
    .card-hover { transition: transform .25s ease, border-color .25s ease; }
    .card-hover:hover { transform: translateY(-3px); border-color: #3A443F; }
    .fade-in { animation: fadeIn .35s ease; }
    @keyframes fadeIn { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:none;} }
    input:focus, button:focus { outline: 2px solid #4ADE9E; outline-offset: 2px; }
    input::placeholder { color: #6B756F; }
  `}</style>
);

// ---------- MOCK DATA ----------
const CATEGORIES = [
  { name: "Phones", icon: Smartphone },
  { name: "Electronics", icon: Laptop },
  { name: "Cars", icon: Car },
  { name: "Bikes", icon: Bike },
  { name: "Gaming", icon: Gamepad2 },
  { name: "Cameras", icon: Camera },
  { name: "Furniture", icon: Sofa },
  { name: "Watches", icon: Watch },
  { name: "Fashion", icon: Shirt },
  { name: "Other", icon: Package },
];

const ITEMS = [
  { id: 1, title: "iPhone 14 Pro, 256GB", cat: "Phones", value: 62000, condition: "Excellent", loc: "Thiruvananthapuram", posted: "2h ago", swap: true, rating: 4.8, seed: "iphone14", wants: ["Samsung S24", "MacBook Air", "Cash offers"], desc: "Barely used, always in a case with screen protector. Comes with original box, charger, and unused earphones. Battery health 96%." },
  { id: 2, title: "Samsung Galaxy S23 Ultra", cat: "Phones", value: 58000, condition: "Good", loc: "Kochi", posted: "5h ago", swap: true, rating: 4.6, seed: "s23ultra", wants: ["iPhone 14/15", "iPad"], desc: "One minor scratch on the frame, screen is flawless. S-Pen included. Great camera phone." },
  { id: 3, title: "MacBook Air M2, 8/256", cat: "Electronics", value: 78000, condition: "Excellent", loc: "Bangalore", posted: "1d ago", swap: true, rating: 4.9, seed: "macair", wants: ["Gaming laptop", "PS5 + cash"], desc: "Midnight color, used mainly for browsing and docs. No dents, works perfectly. AppleCare active till next year." },
  { id: 4, title: "Sony PlayStation 5", cat: "Gaming", value: 42000, condition: "Like New", loc: "Chennai", posted: "3h ago", swap: true, rating: 4.7, seed: "ps5", wants: ["Xbox Series X", "Gaming PC", "Cash"], desc: "Disc edition with 2 controllers and 4 games. Barely used, kept in a dust-free cabinet." },
  { id: 5, title: "Royal Enfield Classic 350", cat: "Bikes", value: 145000, condition: "Good", loc: "Kollam", posted: "6h ago", swap: true, rating: 4.5, seed: "re350", wants: ["Another bike + cash", "Cash offers"], desc: "2021 model, single owner, all papers clear. Recently serviced, new tyres fitted." },
  { id: 6, title: "Canon EOS R10 + Kit Lens", cat: "Cameras", value: 68000, condition: "Excellent", loc: "Kochi", posted: "1d ago", swap: true, rating: 4.8, seed: "canonr10", wants: ["Sony mirrorless", "Cash"], desc: "Mirrorless camera, shutter count under 3,000. Comes with bag, extra battery, 64GB card." },
  { id: 7, title: "Apple Watch Series 9", cat: "Watches", value: 28000, condition: "Excellent", loc: "Thiruvananthapuram", posted: "8h ago", swap: true, rating: 4.9, seed: "awatch9", wants: ["Galaxy Watch", "Cash"], desc: "GPS + Cellular, 45mm, with two extra bands. Screen is pristine." },
  { id: 8, title: "Gaming PC — RTX 4060, i5", cat: "Gaming", value: 72000, condition: "Good", loc: "Bangalore", posted: "12h ago", swap: true, rating: 4.4, seed: "gamingpc", wants: ["MacBook", "PS5 + cash"], desc: "Custom build, runs everything at 1080p high settings smoothly. RGB case, 16GB RAM, 1TB SSD." },
  { id: 9, title: "AirPods Pro 2nd Gen", cat: "Electronics", value: 16000, condition: "Like New", loc: "Kollam", posted: "4h ago", swap: true, rating: 4.7, seed: "airpodspro", wants: ["Sony earbuds", "Cash"], desc: "USB-C case, used for two months. All ear tip sizes included." },
  { id: 10, title: "Wooden 3-Seater Sofa", cat: "Furniture", value: 24000, condition: "Good", loc: "Kochi", posted: "2d ago", swap: true, rating: 4.3, seed: "sofa", wants: ["Recliner", "Dining set"], desc: "Solid wood frame, removable cushion covers, no stains or damage. Moving out sale." },
  { id: 11, title: "TVS Apache RTR 160", cat: "Bikes", value: 68000, condition: "Fair", loc: "Chennai", posted: "1d ago", swap: true, rating: 4.2, seed: "apache160", wants: ["Scooter + cash", "Cash"], desc: "2019 model, minor cosmetic wear, engine in great condition. Recently serviced." },
  { id: 12, title: "Nikon D5600 DSLR", cat: "Cameras", value: 34000, condition: "Good", loc: "Thiruvananthapuram", posted: "9h ago", swap: true, rating: 4.5, seed: "nikond5600", wants: ["Mirrorless camera", "Cash"], desc: "18-55mm kit lens, low shutter count, includes tripod and bag." },
];

const MY_ITEMS = [
  { id: 101, title: "iPhone 13, 128GB", value: 34000, seed: "iphone13" },
  { id: 102, title: "OnePlus 11", value: 28000, seed: "oneplus11" },
  { id: 103, title: "Bose QC45 Headphones", value: 15000, seed: "bose" },
];

const img = (seed) => `https://picsum.photos/seed/${seed}/640/480`;
const inr = (n) => `\u20b9${n.toLocaleString("en-IN")}`;

// ---------- SMALL COMPONENTS ----------
function Logo({ size = 22 }) {
  return (
    <div className="f-display" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: size, fontWeight: 600, color: T.ink, letterSpacing: "-0.01em" }}>
      <span style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <ArrowLeftRight size={size * 0.62} color={T.get} strokeWidth={2.6} />
      </span>
      Reloop
    </div>
  );
}

function Pill({ children, active, onClick, style }) {
  return (
    <button
      onClick={onClick}
      className="f-body"
      style={{
        padding: "8px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 600,
        border: `1px solid ${active ? T.get : T.border}`,
        background: active ? T.getDim : "transparent",
        color: active ? T.get : T.inkMuted,
        cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SwapMeter({ pct }) {
  // pct: 0-100, how good the match / value balance is
  return (
    <div style={{ width: "100%" }}>
      <div style={{ height: 5, borderRadius: 999, background: T.border, overflow: "hidden", display: "flex" }}>
        <div style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${T.give}, ${T.get})`, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "18px 20px", flex: 1, minWidth: 130 }}>
      <div className="f-mono" style={{ fontSize: 26, fontWeight: 500, color: accent || T.ink }}>{value}</div>
      <div className="f-body" style={{ fontSize: 12.5, color: T.inkMuted, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ---------- ITEM CARD ----------
function ItemCard({ item, onOpen, saved, onToggleSave }) {
  const matchPct = 60 + (item.id * 7) % 35;
  return (
    <div
      className="card-hover fade-in"
      onClick={() => onOpen(item)}
      style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden", cursor: "pointer" }}
    >
      <div style={{ position: "relative" }}>
        <img src={img(item.seed)} alt={item.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(item.id); }}
          style={{
            position: "absolute", top: 10, right: 10, width: 32, height: 32, borderRadius: "50%",
            background: "rgba(11,15,14,0.65)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          <Heart size={16} color={saved ? T.give : "#fff"} fill={saved ? T.give : "none"} />
        </button>
        {item.swap && (
          <div className="f-body" style={{ position: "absolute", bottom: 10, left: 10, background: T.getDim, color: T.get, fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeftRight size={11} /> OPEN TO SWAP
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div className="f-body" style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, marginBottom: 4, lineHeight: 1.3 }}>{item.title}</div>
        <div className="f-mono" style={{ fontSize: 16, color: T.gold, marginBottom: 8 }}>{inr(item.value)}</div>
        <div className="f-body" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: T.inkMuted, marginBottom: 10 }}>
          <MapPin size={12} /> {item.loc} · {item.posted}
        </div>
        <div style={{ marginBottom: 8 }}>
          <div className="f-body" style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.inkMuted, marginBottom: 4 }}>
            <span>Match score</span><span className="f-mono" style={{ color: T.get }}>{matchPct}%</span>
          </div>
          <SwapMeter pct={matchPct} />
        </div>
        <div className="f-body" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5, color: T.inkMuted }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={12} color={T.gold} fill={T.gold} /> {item.rating}</span>
          <span style={{ color: T.ink, fontWeight: 600 }}>{item.condition}</span>
        </div>
      </div>
    </div>
  );
}

// ---------- OFFER MODAL ----------
function OfferModal({ item, onClose, onSend }) {
  const [selectedMine, setSelectedMine] = useState(MY_ITEMS[0].id);
  const [cashMode, setCashMode] = useState("none"); // none | add | want
  const [cashAmt, setCashAmt] = useState(0);
  const [sent, setSent] = useState(false);
  const mine = MY_ITEMS.find((m) => m.id === selectedMine);
  const rawDiff = item.value - mine.value;

  const diff = cashMode === "add" ? cashAmt : cashMode === "want" ? -cashAmt : rawDiff;

  if (sent) {
    return (
      <Overlay onClose={onClose}>
        <div className="fade-in" style={{ padding: "40px 32px", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.getDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
            <Check size={26} color={T.get} />
          </div>
          <div className="f-display" style={{ fontSize: 22, color: T.ink, marginBottom: 8 }}>Offer sent</div>
          <p className="f-body" style={{ color: T.inkMuted, fontSize: 14, marginBottom: 24 }}>
            The owner of "{item.title}" has been notified. You'll hear back once they respond.
          </p>
          <button onClick={onClose} className="f-body" style={{ background: T.get, color: "#08130E", border: "none", borderRadius: 12, padding: "12px 28px", fontWeight: 700, cursor: "pointer" }}>
            Done
          </button>
        </div>
      </Overlay>
    );
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "26px 26px 22px", borderBottom: `1px solid ${T.border}` }}>
        <div className="f-display" style={{ fontSize: 20, color: T.ink }}>Make an offer</div>
        <div className="f-body" style={{ fontSize: 13, color: T.inkMuted, marginTop: 2 }}>for {item.title}</div>
      </div>

      <div style={{ padding: "22px 26px", maxHeight: "55vh", overflowY: "auto" }}>
        <div className="f-body" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", color: T.inkMuted, marginBottom: 10 }}>YOU OFFER</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {MY_ITEMS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMine(m.id)}
              className="f-body"
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
                border: `1px solid ${selectedMine === m.id ? T.give : T.border}`,
                background: selectedMine === m.id ? T.giveDim : "transparent", cursor: "pointer", textAlign: "left",
              }}
            >
              <img src={img(m.seed)} alt={m.title} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: T.ink, fontWeight: 600 }}>{m.title}</div>
                <div className="f-mono" style={{ fontSize: 12, color: T.inkMuted }}>{inr(m.value)}</div>
              </div>
              {selectedMine === m.id && <Check size={16} color={T.give} />}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0 22px" }}>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <ArrowLeftRight size={16} color={T.inkMuted} />
          <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>

        <div className="f-body" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", color: T.inkMuted, marginBottom: 10 }}>FOR</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, border: `1px solid ${T.get}`, background: T.getDim, marginBottom: 22 }}>
          <img src={img(item.seed)} alt={item.title} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
          <div>
            <div className="f-body" style={{ fontSize: 13.5, color: T.ink, fontWeight: 600 }}>{item.title}</div>
            <div className="f-mono" style={{ fontSize: 12, color: T.inkMuted }}>{inr(item.value)}</div>
          </div>
        </div>

        <div className="f-body" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", color: T.inkMuted, marginBottom: 10 }}>CASH ADJUSTMENT</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[["none", "No cash"], ["add", "I'll add"], ["want", "I want"]].map(([k, label]) => (
            <Pill key={k} active={cashMode === k} onClick={() => { setCashMode(k); if (k === "none") setCashAmt(0); }} style={{ flex: 1, textAlign: "center" }}>{label}</Pill>
          ))}
        </div>
        {cashMode !== "none" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span className="f-mono" style={{ color: T.inkMuted, fontSize: 14 }}>₹</span>
            <input
              type="number" min={0} value={cashAmt}
              onChange={(e) => setCashAmt(Math.max(0, Number(e.target.value)))}
              className="f-mono"
              style={{ flex: 1, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 12px", color: T.ink, fontSize: 14 }}
            />
          </div>
        )}

        <div style={{ marginTop: 20, background: T.surfaceRaised, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px" }}>
          <div className="f-body" style={{ fontSize: 12, color: T.inkMuted, marginBottom: 6 }}>Estimated deal difference</div>
          <div className="f-mono" style={{ fontSize: 22, fontWeight: 500, color: diff === 0 ? T.ink : diff > 0 ? T.give : T.get }}>
            {diff === 0 ? "Even swap" : diff > 0 ? `You pay ${inr(diff)}` : `You receive ${inr(Math.abs(diff))}`}
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 26px", borderTop: `1px solid ${T.border}` }}>
        <button
          onClick={() => { setSent(true); onSend && onSend(); }}
          className="f-body"
          style={{ width: "100%", background: T.get, color: "#08130E", border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 700, fontSize: 14.5, cursor: "pointer" }}
        >
          Send Offer
        </button>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(5,7,6,0.72)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-in"
        style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, position: "relative", maxHeight: "88vh", display: "flex", flexDirection: "column" }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: "50%", background: T.surfaceRaised, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}>
          <X size={15} color={T.inkMuted} />
        </button>
        {children}
      </div>
    </div>
  );
}

// ---------- ITEM DETAIL ----------
function ItemDetail({ item, onBack, onOffer, saved, onToggleSave }) {
  const matches = ITEMS.filter((i) => i.id !== item.id && i.cat === item.cat).slice(0, 3);
  return (
    <div className="fade-in" style={{ maxWidth: 920, margin: "0 auto", padding: "24px 20px 100px" }}>
      <button onClick={onBack} className="f-body" style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: T.inkMuted, cursor: "pointer", marginBottom: 18, fontSize: 13.5 }}>
        <ChevronLeft size={16} /> Back to browse
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 32 }}>
        <div>
          <img src={img(item.seed)} alt={item.title} style={{ width: "100%", height: 340, objectFit: "cover", borderRadius: 18, border: `1px solid ${T.border}` }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[item.seed + "a", item.seed + "b", item.seed + "c"].map((s) => (
              <img key={s} src={img(s)} style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 8, border: `1px solid ${T.border}` }} />
            ))}
          </div>
          <div className="f-body" style={{ marginTop: 26 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", color: T.inkMuted, marginBottom: 8 }}>DESCRIPTION</div>
            <p style={{ fontSize: 14, color: T.ink, lineHeight: 1.6 }}>{item.desc}</p>
          </div>
          <div className="f-body" style={{ marginTop: 22 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", color: T.inkMuted, marginBottom: 8 }}>LOOKING FOR</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {item.wants.map((w) => <Pill key={w} style={{ cursor: "default" }}>{w}</Pill>)}
            </div>
          </div>
        </div>

        <div>
          <div className="f-body" style={{ fontSize: 12, color: T.get, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
            <ArrowLeftRight size={13} /> OPEN TO SWAP
          </div>
          <h1 className="f-display" style={{ fontSize: 27, color: T.ink, fontWeight: 600, marginBottom: 10, lineHeight: 1.2 }}>{item.title}</h1>
          <div className="f-mono" style={{ fontSize: 26, color: T.gold, marginBottom: 14 }}>{inr(item.value)}</div>
          <div className="f-body" style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: T.inkMuted, marginBottom: 20 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={13} /> {item.loc}</span>
            <span>{item.condition}</span>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <div className="f-body" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.surfaceRaised, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={18} color={T.inkMuted} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13.5, color: T.ink, fontWeight: 600 }}>
                  Priya M. <BadgeCheck size={14} color={T.get} />
                </div>
                <div style={{ fontSize: 12, color: T.inkMuted, display: "flex", alignItems: "center", gap: 4 }}>
                  <Star size={11} color={T.gold} fill={T.gold} /> {item.rating} · Member since 2023
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onOffer(item)} className="f-body" style={{ flex: 1, background: T.get, color: "#08130E", border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Make an Offer
            </button>
            <button onClick={() => onToggleSave(item.id)} className="f-body" style={{ width: 48, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Heart size={18} color={saved ? T.give : T.inkMuted} fill={saved ? T.give : "none"} />
            </button>
          </div>
          <button className="f-body" style={{ width: "100%", marginTop: 10, background: "transparent", border: `1px solid ${T.border}`, color: T.ink, borderRadius: 12, padding: "12px 0", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <MessageCircle size={16} /> Chat with owner
          </button>
        </div>
      </div>

      {matches.length > 0 && (
        <div style={{ marginTop: 44 }}>
          <div className="f-display" style={{ fontSize: 19, color: T.ink, marginBottom: 14 }}>Possible swap matches</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
            {matches.map((m) => (
              <div key={m.id} onClick={() => onBack(m)} style={{ cursor: "pointer" }}>
                <ItemCard item={m} onOpen={() => onBack(m)} saved={false} onToggleSave={() => {}} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- NAVBAR ----------
function Navbar({ page, setPage }) {
  const links = ["Browse", "Categories", "Find My Match", "How It Works"];
  return (
    <div style={{ borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, background: "rgba(11,15,14,0.9)", backdropFilter: "blur(8px)", zIndex: 30 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", gap: 32 }}>
        <div onClick={() => setPage("home")} style={{ cursor: "pointer" }}><Logo /></div>
        <div className="f-body" style={{ display: "flex", gap: 22, flex: 1 }}>
          {links.map((l) => (
            <span key={l} onClick={() => setPage(l === "Browse" ? "browse" : "home")} style={{ fontSize: 13.5, color: T.inkMuted, cursor: "pointer", fontWeight: 500 }}>{l}</span>
          ))}
        </div>
        <div className="f-body" style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "none", color: T.inkMuted, cursor: "pointer", display: "flex" }}><MessageCircle size={18} /></button>
          <button onClick={() => setPage("dashboard")} className="f-body" style={{ background: T.get, color: "#08130E", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={15} /> List an Item
          </button>
          <button onClick={() => setPage("dashboard")} style={{ width: 34, height: 34, borderRadius: "50%", background: T.surfaceRaised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <User size={16} color={T.inkMuted} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ page, setPage }) {
  const items = [["home", Home, "Home"], ["browse", Compass, "Explore"], ["__list", Plus, ""], ["dashboard", MessageCircle, "Messages"], ["dashboard", User, "Profile"]];
  return (
    <div style={{ display: "none", position: "fixed", bottom: 0, left: 0, right: 0, background: T.surface, borderTop: `1px solid ${T.border}`, padding: "10px 16px", zIndex: 40 }} className="mobile-nav">
      {items.map(([key, Icon, label], i) => (
        <button key={i} onClick={() => setPage(key === "__list" ? "dashboard" : key)} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: page === key ? T.get : T.inkMuted, cursor: "pointer", flex: 1 }}>
          {key === "__list"
            ? <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.get, display: "flex", alignItems: "center", justifyContent: "center", marginTop: -18 }}><Plus size={20} color="#08130E" /></div>
            : <Icon size={19} />}
          <span className="f-body" style={{ fontSize: 10 }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

// ---------- HOME ----------
function HomePage({ setPage, search, setSearch }) {
  return (
    <div className="fade-in">
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "70px 20px 40px", textAlign: "center" }}>
        <div className="f-body" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: T.get, background: T.getDim, border: `1px solid ${T.get}33`, padding: "6px 14px", borderRadius: 999, marginBottom: 24, fontWeight: 600 }}>
          <TrendingUp size={13} /> 12,400+ successful swaps this year
        </div>
        <h1 className="f-display" style={{ fontSize: "clamp(34px, 5vw, 58px)", color: T.ink, fontWeight: 600, lineHeight: 1.08, marginBottom: 18, letterSpacing: "-0.02em" }}>
          Swap what you have.<br />Get what you <span style={{ color: T.get }}>want.</span>
        </h1>
        <p className="f-body" style={{ fontSize: 16.5, color: T.inkMuted, maxWidth: 520, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Trade your unused items for something you actually want — with cash adjustments when the value doesn't quite match.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40, flexWrap: "wrap" }}>
          <button onClick={() => setPage("browse")} className="f-body" style={{ background: T.get, color: "#08130E", border: "none", borderRadius: 12, padding: "13px 26px", fontWeight: 700, fontSize: 14.5, cursor: "pointer" }}>
            Explore Items
          </button>
          <button onClick={() => setPage("dashboard")} className="f-body" style={{ background: "transparent", color: T.ink, border: `1px solid ${T.border}`, borderRadius: 12, padding: "13px 26px", fontWeight: 600, fontSize: 14.5, cursor: "pointer" }}>
            List an Item
          </button>
        </div>

        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ position: "relative" }}>
            <Search size={17} color={T.inkMuted} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setPage("browse"); }}
              placeholder="Search phones, laptops, bikes, cameras, furniture..."
              className="f-body"
              style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "15px 16px 15px 46px", color: T.ink, fontSize: 14.5 }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 30 }}>
          {CATEGORIES.map((c) => (
            <button key={c.name} onClick={() => setPage("browse")} className="f-body" style={{ display: "flex", alignItems: "center", gap: 7, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: "9px 15px", color: T.ink, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <c.icon size={14} color={T.get} /> {c.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 20px 80px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
          <div className="f-display" style={{ fontSize: 22, color: T.ink }}>Recently listed</div>
          <span onClick={() => setPage("browse")} className="f-body" style={{ color: T.get, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>View all →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {ITEMS.slice(0, 4).map((it) => (
            <ItemCard key={it.id} item={it} onOpen={() => setPage("browse")} saved={false} onToggleSave={() => {}} />
          ))}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, background: T.surface }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "60px 20px" }}>
          <div className="f-display" style={{ fontSize: 24, color: T.ink, textAlign: "center", marginBottom: 40 }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24 }}>
            {[
              ["List", "Upload an item you no longer need."],
              ["Discover", "Find items you actually want."],
              ["Offer", "Offer your item, cash, or both."],
              ["Agree", "Negotiate and accept the deal."],
              ["Exchange", "Meet or arrange delivery."],
              ["Review", "Complete the deal and rate each other."],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="f-display" style={{ fontSize: 17, color: T.get, marginBottom: 6 }}>{t}</div>
                <div className="f-body" style={{ fontSize: 13, color: T.inkMuted, lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- BROWSE ----------
function BrowsePage({ search, setSearch, onOpen, savedIds, onToggleSave }) {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const filtered = useMemo(() => {
    let list = ITEMS.filter((i) => (cat === "All" || i.cat === cat) && i.title.toLowerCase().includes(search.toLowerCase()));
    if (sort === "Lowest value") list = [...list].sort((a, b) => a.value - b.value);
    if (sort === "Highest value") list = [...list].sort((a, b) => b.value - a.value);
    if (sort === "Newest") list = [...list].reverse();
    return list;
  }, [cat, sort, search]);

  return (
    <div className="fade-in" style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 20px 100px" }}>
      <div style={{ position: "relative", marginBottom: 18, maxWidth: 460 }}>
        <Search size={16} color={T.inkMuted} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search items..." className="f-body"
          style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "11px 14px 11px 40px", color: T.ink, fontSize: 14 }} />
      </div>

      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 6, marginBottom: 10 }}>
        <Pill active={cat === "All"} onClick={() => setCat("All")}>All</Pill>
        {CATEGORIES.map((c) => <Pill key={c.name} active={cat === c.name} onClick={() => setCat(c.name)}>{c.name}</Pill>)}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <span className="f-body" style={{ fontSize: 13, color: T.inkMuted }}>{filtered.length} items</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <SlidersHorizontal size={14} color={T.inkMuted} />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="f-body" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 10px", color: T.ink, fontSize: 12.5 }}>
            {["Recommended", "Newest", "Lowest value", "Highest value"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: T.inkMuted }} className="f-body">
          No items match your search. Try a different keyword or category.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {filtered.map((it) => (
            <ItemCard key={it.id} item={it} onOpen={onOpen} saved={savedIds.includes(it.id)} onToggleSave={onToggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- DASHBOARD ----------
function DashboardPage({ savedIds, offersSent }) {
  const [tab, setTab] = useState("overview");
  const tabs = ["overview", "listings", "offers", "wishlist"];
  return (
    <div className="fade-in" style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 20px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.surfaceRaised, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <User size={24} color={T.inkMuted} />
        </div>
        <div>
          <div className="f-display" style={{ fontSize: 20, color: T.ink, display: "flex", alignItems: "center", gap: 6 }}>Abhi <BadgeCheck size={16} color={T.get} /></div>
          <div className="f-body" style={{ fontSize: 12.5, color: T.inkMuted, display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={11} /> Thiruvananthapuram · <Star size={11} color={T.gold} fill={T.gold} /> 4.9 · Member since 2024
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 26 }}>
        <StatCard label="Active listings" value="5" />
        <StatCard label="Offers received" value="12" accent={T.get} />
        <StatCard label="Offers sent" value={String(offersSent)} accent={T.give} />
        <StatCard label="Wishlist items" value={String(savedIds.length)} />
      </div>

      <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="f-body" style={{ background: "none", border: "none", borderBottom: `2px solid ${tab === t ? T.get : "transparent"}`, color: tab === t ? T.ink : T.inkMuted, padding: "10px 4px", marginRight: 18, fontSize: 13.5, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="f-body" style={{ color: T.inkMuted, fontSize: 13.5, lineHeight: 1.7 }}>
          <p>This is your control center for everything happening on Reloop — new offers, active swaps, and saved items all live here.</p>
          <div style={{ marginTop: 18, background: T.surface, border: `1px dashed ${T.border}`, borderRadius: 14, padding: 20, fontSize: 13 }}>
            <strong style={{ color: T.ink }}>Backend not connected.</strong> Auth, real listings, and live offer data will appear here once the account and database service is wired up.
          </div>
        </div>
      )}
      {tab === "listings" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 14 }}>
          {MY_ITEMS.map((m) => (
            <div key={m.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
              <img src={img(m.seed)} style={{ width: "100%", height: 110, objectFit: "cover" }} />
              <div style={{ padding: 12 }}>
                <div className="f-body" style={{ fontSize: 13, color: T.ink, fontWeight: 600 }}>{m.title}</div>
                <div className="f-mono" style={{ fontSize: 13, color: T.gold }}>{inr(m.value)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "offers" && (
        <div className="f-body" style={{ fontSize: 13.5, color: T.inkMuted }}>
          {offersSent > 0 ? `You've sent ${offersSent} offer(s) this session — track their status here once responses come in.` : "You haven't sent any offers yet. Browse items and tap “Make an Offer” to start."}
        </div>
      )}
      {tab === "wishlist" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 14 }}>
          {ITEMS.filter((i) => savedIds.includes(i.id)).map((it) => (
            <ItemCard key={it.id} item={it} onOpen={() => {}} saved onToggleSave={() => {}} />
          ))}
          {savedIds.length === 0 && <div className="f-body" style={{ fontSize: 13.5, color: T.inkMuted }}>Nothing saved yet — tap the heart on any item to add it here.</div>}
        </div>
      )}
    </div>
  );
}

// ---------- APP ----------
export default function App() {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [offerItem, setOfferItem] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [offersSent, setOffersSent] = useState(0);

  const toggleSave = (id) => setSavedIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const openItem = (item) => { setSelected(item); setPage("detail"); window.scrollTo?.(0, 0); };

  return (
    <div className="f-body" style={{ minHeight: "100vh", background: T.bg, color: T.ink }}>
      {FONTS}
      <Navbar page={page} setPage={setPage} />

      {page === "home" && <HomePage setPage={setPage} search={search} setSearch={setSearch} />}
      {page === "browse" && <BrowsePage search={search} setSearch={setSearch} onOpen={openItem} savedIds={savedIds} onToggleSave={toggleSave} />}
      {page === "detail" && selected && (
        <ItemDetail
          item={selected}
          onBack={(maybeItem) => (maybeItem && maybeItem.id ? openItem(maybeItem) : setPage("browse"))}
          onOffer={(it) => setOfferItem(it)}
          saved={savedIds.includes(selected.id)}
          onToggleSave={toggleSave}
        />
      )}
      {page === "dashboard" && <DashboardPage savedIds={savedIds} offersSent={offersSent} />}

      {offerItem && (
        <OfferModal item={offerItem} onClose={() => setOfferItem(null)} onSend={() => setOffersSent((n) => n + 1)} />
      )}

      <BottomNav page={page} setPage={setPage} />
      <style>{`@media (max-width: 720px){ .mobile-nav{ display:flex !important; } }`}</style>

      <div style={{ borderTop: `1px solid ${T.border}`, padding: "30px 20px", textAlign: "center" }}>
        <div className="f-body" style={{ fontSize: 12, color: T.inkMuted }}>
          Reloop MVP preview · demo data · Thiruvananthapuram, Kerala
        </div>
      </div>
    </div>
  );
}
