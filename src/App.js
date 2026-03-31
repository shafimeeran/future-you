import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔑 YOUR SUPABASE KEYS
const SUPABASE_URL = "https://fcyxwmlerqjymamhyjua.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_e65uf00EX8gDEClliir7XQ_fKFntYK8";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORIES = [
  { name: "Food", emoji: "🍔", color: "#FF6B6B" },
  { name: "Transport", emoji: "🚗", color: "#4ECDC4" },
  { name: "Shopping", emoji: "🛍️", color: "#FFE66D" },
  { name: "Bills", emoji: "💡", color: "#A78BFA" },
  { name: "Fun", emoji: "🎉", color: "#F97316" },
  { name: "Salary", emoji: "💰", color: "#4ADE80" },
  { name: "Other", emoji: "✨", color: "#60A5FA" },
];

const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const getLast7Days = (transactions) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = d.toLocaleDateString("en-US");
    const total = transactions
      .filter(t => t.type === "expense" && t.date === dateStr)
      .reduce((s, t) => s + t.amount, 0);
    days.push({ label, total });
  }
  return days;
};

// ─────────────────────────────────────────
// 🔐 AUTH SCREEN (Login / Signup)
// ─────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); }
      else { setSuccess("✅ Account created! Check your email to confirm, then log in."); setMode("login"); }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); }
      else { onAuth(data.user); }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#667eea 0%,#f093fb 50%,#f5576c 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif", padding: 20 }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        .btn { border:none; border-radius:14px; font-family:'Nunito',sans-serif; font-weight:800; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; }
        .btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.18); }
        input { border:2.5px solid #e5e7eb; border-radius:12px; padding:12px 16px; font-family:'Nunito',sans-serif; font-size:15px; outline:none; transition:border 0.2s; width:100%; background:#fafafa; }
        input:focus { border-color:#667eea; background:#fff; }
        .slide-in { animation:slideIn 0.5s cubic-bezier(.22,1,.36,1) both; }
        @keyframes slideIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="slide-in" style={{ background: "rgba(255,255,255,0.95)", borderRadius: 28, padding: "40px 32px", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48 }}>🌟</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 30, fontWeight: 800, letterSpacing: -1, marginTop: 8 }}>Future You</div>
          <div style={{ color: "#888", fontSize: 14, marginTop: 4, fontWeight: 600 }}>Your colorful money tracker</div>
        </div>

        {/* Mode Toggle */}
        <div style={{ display: "flex", background: "#f0f0f5", borderRadius: 16, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(m => (
            <button key={m} className="btn" onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              style={{ flex: 1, padding: "10px", fontSize: 14, background: mode === m ? "linear-gradient(135deg,#667eea,#f093fb)" : "transparent", color: mode === m ? "#fff" : "#888", boxShadow: mode === m ? "0 4px 12px rgba(0,0,0,0.15)" : "none" }}>
              {m === "login" ? "🔑 Log In" : "✨ Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 800, color: "#555", marginBottom: 6, display: "block" }}>Email</label>
            <input type="email" placeholder="you@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 800, color: "#555", marginBottom: 6, display: "block" }}>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>

          {error && <div style={{ background: "#fff0f0", color: "#F87171", padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>❌ {error}</div>}
          {success && <div style={{ background: "#f0fff4", color: "#4ADE80", padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>{success}</div>}

          <button className="btn" onClick={handleSubmit} disabled={loading}
            style={{ padding: "16px", fontSize: 16, marginTop: 4, background: loading ? "#e5e7eb" : "linear-gradient(135deg,#667eea,#f093fb)", color: loading ? "#aaa" : "#fff" }}>
            {loading ? "Please wait..." : mode === "login" ? "Log In 🚀" : "Create Account ✨"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#aaa", fontWeight: 600 }}>
          {mode === "login" ? "No account yet? " : "Already have one? "}
          <span style={{ color: "#667eea", cursor: "pointer", fontWeight: 800 }} onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}>
            {mode === "login" ? "Sign up free" : "Log in"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 💰 MAIN APP
// ─────────────────────────────────────────
export default function FutureYou() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [form, setForm] = useState({ desc: "", amount: "", category: "Food", type: "expense" });
  const [budgetInputs, setBudgetInputs] = useState({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 CHECK IF USER IS ALREADY LOGGED IN
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ☁️ FETCH DATA WHEN USER LOGS IN
  useEffect(() => {
    if (user) fetchAll();
    else { setTransactions([]); setBudgets({}); }
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setTransactions(txData || []);

      const { data: budgetData } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id);
      const budgetMap = {};
      (budgetData || []).forEach(b => { budgetMap[b.category] = b.amount; });
      setBudgets(budgetMap);
    } catch (err) {
      showToast("❌ Failed to load data", "#F87171");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast("👋 Logged out!");
  };

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;

  const getCategorySpend = (catName) =>
    transactions.filter(t => t.category === catName && t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

  const showToast = (msg, color = "#4ADE80") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const addTransaction = async () => {
    if (!form.desc || !form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      showToast("⚠️ Please fill in all fields!", "#F87171"); return;
    }
    const newTx = {
      description: form.desc,
      amount: parseFloat(form.amount),
      category: form.category,
      type: form.type,
      date: new Date().toLocaleDateString("en-US"),
      user_id: user.id, // 🔐 link to logged-in user
    };
    const { data, error } = await supabase.from("transactions").insert([newTx]).select().single();
    if (error) { showToast("❌ Failed to save!", "#F87171"); return; }

    const updated = [data, ...transactions];
    setTransactions(updated);
    if (form.type === "expense" && budgets[form.category]) {
      const newTotal = updated.filter(t => t.category === form.category && t.type === "expense").reduce((s, t) => s + t.amount, 0);
      showToast(newTotal > budgets[form.category] ? `🚨 Over budget on ${form.category}!` : "✅ Saved!", newTotal > budgets[form.category] ? "#F97316" : "#4ADE80");
    } else {
      showToast("✅ Saved to cloud!");
    }
    setForm({ desc: "", amount: "", category: "Food", type: "expense" });
  };

  const deleteTransaction = async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) { showToast("❌ Failed to delete!", "#F87171"); return; }
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast("🗑️ Deleted", "#60A5FA");
  };

  const saveBudget = async (catName) => {
    const val = parseFloat(budgetInputs[catName]);
    if (!val || val <= 0) return;
    const { error } = await supabase.from("budgets")
      .upsert({ category: catName, amount: val, user_id: user.id }, { onConflict: "category,user_id" });
    if (error) { showToast("❌ Failed to save budget!", "#F87171"); return; }
    setBudgets(prev => ({ ...prev, [catName]: val }));
    showToast(`🎯 Budget set for ${catName}!`);
    setBudgetInputs(prev => ({ ...prev, [catName]: "" }));
  };

  const chartData = getLast7Days(transactions);
  const maxChart = Math.max(...chartData.map(d => d.total), 1);
  const catSpending = CATEGORIES.map(cat => ({
    ...cat, total: getCategorySpend(cat.name), budget: budgets[cat.name] || 0,
  })).filter(c => c.total > 0 || c.budget > 0);
  const overspentCats = catSpending.filter(c => c.budget > 0 && c.total > c.budget);

  // Show loading spinner while checking auth
  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#667eea,#f093fb,#f5576c)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Nunito',sans-serif", color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800 }}>🌟 Future You</div>
      <div style={{ marginTop: 20, width: 40, height: 40, border: "4px solid rgba(255,255,255,0.3)", borderTop: "4px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  // Show login screen if not logged in
  if (!user) return <AuthScreen onAuth={setUser} />;

  // Show main app if logged in
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#667eea 0%,#f093fb 50%,#f5576c 100%)", fontFamily: "'Nunito',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        .card { background:rgba(255,255,255,0.93); backdrop-filter:blur(12px); border-radius:24px; box-shadow:0 8px 32px rgba(0,0,0,0.12); }
        .btn { border:none; border-radius:14px; font-family:'Nunito',sans-serif; font-weight:800; cursor:pointer; transition:transform 0.15s,box-shadow 0.15s; }
        .btn:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.18); }
        .btn:active { transform:translateY(0); }
        input,select { border:2.5px solid #e5e7eb; border-radius:12px; padding:10px 14px; font-family:'Nunito',sans-serif; font-size:15px; outline:none; transition:border 0.2s; width:100%; background:#fafafa; }
        input:focus,select:focus { border-color:#667eea; background:#fff; }
        .tab { padding:10px 16px; border-radius:50px; font-weight:800; font-size:13px; cursor:pointer; border:none; transition:all 0.2s; }
        .tab-active { background:#fff; color:#667eea; box-shadow:0 4px 14px rgba(0,0,0,0.13); }
        .tab-inactive { background:transparent; color:rgba(255,255,255,0.8); }
        .slide-in { animation:slideIn 0.45s cubic-bezier(.22,1,.36,1) both; }
        @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .tx-row { display:flex; align-items:center; gap:12px; padding:13px 16px; border-radius:16px; margin-bottom:8px; background:#f8f8fc; transition:background 0.2s; }
        .tx-row:hover { background:#f0f0ff; }
        .pulse { animation:pulse 1.5s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, left:"50%", transform:"translateX(-50%)", background:toast.color, color:"#fff", padding:"12px 24px", borderRadius:50, fontWeight:800, fontSize:14, zIndex:999, boxShadow:"0 8px 24px rgba(0,0,0,0.2)", animation:"slideIn 0.3s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ padding:"24px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", maxWidth:480, margin:"0 auto" }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800, color:"#fff", letterSpacing:-1 }}>🌟 Future You</div>
          <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, fontWeight:600, marginTop:2 }}>
            👤 {user.email}
          </div>
        </div>
        <button className="btn" onClick={handleLogout}
          style={{ background:"rgba(255,255,255,0.2)", color:"#fff", padding:"8px 16px", fontSize:13 }}>
          Log Out
        </button>
      </div>

      {/* Overspend Alert */}
      {overspentCats.length > 0 && (
        <div style={{ margin:"0 16px 12px", maxWidth:448, marginLeft:"auto", marginRight:"auto", background:"rgba(249,115,22,0.95)", borderRadius:18, padding:"14px 18px", color:"#fff" }}>
          <div style={{ fontWeight:900, fontSize:14 }} className="pulse">🚨 Budget Alert!</div>
          {overspentCats.map(c => (
            <div key={c.name} style={{ fontSize:13, marginTop:4, fontWeight:700 }}>
              {c.emoji} {c.name}: spent {formatMoney(c.total)} of {formatMoney(c.budget)} limit
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display:"flex", justifyContent:"center", gap:4, padding:"0 20px 16px", flexWrap:"wrap" }}>
        {["dashboard","add","budget","history"].map(tab => (
          <button key={tab} className={`tab ${activeTab===tab?"tab-active":"tab-inactive"}`} onClick={() => setActiveTab(tab)}>
            {tab==="dashboard"?"📊 Dashboard":tab==="add"?"➕ Add":tab==="budget"?"🎯 Budgets":"📋 History"}
          </button>
        ))}
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"0 16px 40px" }}>

        {loading && (
          <div style={{ textAlign:"center", padding:40, color:"rgba(255,255,255,0.8)", fontWeight:700 }}>
            Loading your data... ☁️
          </div>
        )}

        {!loading && activeTab==="dashboard" && (
          <div className="slide-in">
            <div className="card" style={{ padding:"28px 24px", marginBottom:16, background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff" }}>
              <div style={{ fontSize:13, fontWeight:700, opacity:0.8, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Total Balance</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:44, fontWeight:800, letterSpacing:-2 }}>{formatMoney(balance)}</div>
              <div style={{ display:"flex", gap:14, marginTop:20 }}>
                <div style={{ flex:1, background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"12px 16px" }}>
                  <div style={{ fontSize:12, opacity:0.8, fontWeight:700 }}>💚 INCOME</div>
                  <div style={{ fontSize:20, fontWeight:900, marginTop:4 }}>{formatMoney(income)}</div>
                </div>
                <div style={{ flex:1, background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"12px 16px" }}>
                  <div style={{ fontSize:12, opacity:0.8, fontWeight:700 }}>🔴 SPENT</div>
                  <div style={{ fontSize:20, fontWeight:900, marginTop:4 }}>{formatMoney(expenses)}</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding:"20px", marginBottom:16 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, marginBottom:16 }}>📈 Last 7 Days Spending</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100 }}>
                {chartData.map((d,i) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ fontSize:9, color:"#888", fontWeight:700 }}>{d.total>0?`$${d.total.toFixed(0)}`:""}</div>
                    <div style={{ width:"100%", borderRadius:"8px 8px 4px 4px", height:`${Math.max((d.total/maxChart)*80,d.total>0?8:2)}px`, background:d.total>0?"linear-gradient(180deg,#f093fb,#f5576c)":"#f0f0f5", transition:"height 0.6s cubic-bezier(.22,1,.36,1)", minHeight:4 }} />
                    <div style={{ fontSize:11, color:"#888", fontWeight:700 }}>{d.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {catSpending.length > 0 ? (
              <div className="card" style={{ padding:"20px" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, marginBottom:16 }}>Spending vs Budget</div>
                {catSpending.map(cat => {
                  const pct = cat.budget>0 ? Math.min((cat.total/cat.budget)*100,100) : null;
                  const over = cat.budget>0 && cat.total>cat.budget;
                  return (
                    <div key={cat.name} style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontWeight:700, fontSize:14 }}>
                        <span>{cat.emoji} {cat.name}</span>
                        <span>
                          <span style={{ color:over?"#F97316":cat.color, fontWeight:900 }}>{formatMoney(cat.total)}</span>
                          {cat.budget>0&&<span style={{ color:"#aaa", fontSize:12 }}> / {formatMoney(cat.budget)}</span>}
                        </span>
                      </div>
                      <div style={{ background:"#f0f0f5", borderRadius:50, height:10, overflow:"hidden" }}>
                        <div style={{ width:`${pct!==null?pct:(cat.total/Math.max(...catSpending.map(c=>c.total)))*100}%`, height:"100%", background:over?"linear-gradient(90deg,#F97316,#ef4444)":cat.color, borderRadius:50, transition:"width 0.6s cubic-bezier(.22,1,.36,1)" }} />
                      </div>
                      {over&&<div style={{ fontSize:11, color:"#F97316", fontWeight:800, marginTop:3 }}>⚠️ Over by {formatMoney(cat.total-cat.budget)}</div>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card" style={{ padding:28, textAlign:"center", color:"#aaa" }}>
                <div style={{ fontSize:40 }}>🎯</div>
                <div style={{ fontWeight:700, marginTop:8 }}>No transactions yet!</div>
                <div style={{ fontSize:13, marginTop:4 }}>Tap ➕ Add to get started</div>
              </div>
            )}
          </div>
        )}

        {!loading && activeTab==="add" && (
          <div className="card slide-in" style={{ padding:"28px 24px" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, marginBottom:22 }}>➕ Add Transaction</div>
            <div style={{ display:"flex", background:"#f0f0f5", borderRadius:16, padding:4, marginBottom:20 }}>
              {["expense","income"].map(type => (
                <button key={type} className="btn" onClick={() => setForm(f=>({...f,type}))}
                  style={{ flex:1, padding:"10px", fontSize:14, background:form.type===type?(type==="income"?"#4ADE80":"#F87171"):"transparent", color:form.type===type?"#fff":"#888", boxShadow:form.type===type?"0 4px 12px rgba(0,0,0,0.15)":"none" }}>
                  {type==="expense"?"🔴 Expense":"💚 Income"}
                </button>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:800, color:"#555", marginBottom:6, display:"block" }}>Description</label>
                <input placeholder="e.g. Lunch, Netflix, Salary..." value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addTransaction()} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:800, color:"#555", marginBottom:6, display:"block" }}>Amount ($)</label>
                <input type="number" placeholder="0.00" min="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addTransaction()} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:800, color:"#555", marginBottom:6, display:"block" }}>Category</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                  {CATEGORIES.map(c=><option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                </select>
              </div>
              <button className="btn" onClick={addTransaction}
                style={{ padding:"16px", fontSize:16, marginTop:6, background:"linear-gradient(135deg,#667eea,#f093fb)", color:"#fff" }}>
                Save to Cloud 🚀
              </button>
            </div>
          </div>
        )}

        {!loading && activeTab==="budget" && (
          <div className="slide-in">
            <div className="card" style={{ padding:"20px" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, marginBottom:6 }}>🎯 Monthly Budgets</div>
              <div style={{ fontSize:13, color:"#888", marginBottom:20 }}>Private to your account only 🔐</div>
              {CATEGORIES.filter(c=>c.name!=="Salary").map(cat => {
                const spent = getCategorySpend(cat.name);
                const budget = budgets[cat.name];
                const over = budget && spent > budget;
                const near = budget && !over && spent >= budget * 0.8;
                return (
                  <div key={cat.name} style={{ marginBottom:18, padding:"16px", background:over?"#fff5f0":near?"#fffbf0":"#f8f8fc", borderRadius:16, border:`2px solid ${over?"#F97316":near?"#FFE66D":"#f0f0f5"}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <div style={{ fontWeight:800, fontSize:15 }}>{cat.emoji} {cat.name}</div>
                      <div style={{ fontSize:13, fontWeight:700, color:over?"#F97316":"#888" }}>
                        {budget?`${formatMoney(spent)} / ${formatMoney(budget)}`:`Spent: ${formatMoney(spent)}`}
                        {over&&" 🚨"}{near&&!over&&" ⚠️"}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <input type="number" placeholder={budget?`Current: $${budget}`:"Set limit e.g. 300"} value={budgetInputs[cat.name]||""} onChange={e=>setBudgetInputs(prev=>({...prev,[cat.name]:e.target.value}))} style={{ flex:1 }} />
                      <button className="btn" onClick={()=>saveBudget(cat.name)} style={{ padding:"10px 16px", background:cat.color, color:cat.name==="Shopping"?"#333":"#fff", fontSize:14, whiteSpace:"nowrap" }}>
                        {budget?"Update":"Set"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && activeTab==="history" && (
          <div className="slide-in">
            <div className="card" style={{ padding:"20px" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, marginBottom:16 }}>
                📋 All Transactions {transactions.length>0&&<span style={{ color:"#aaa", fontSize:14 }}>({transactions.length})</span>}
              </div>
              {transactions.length===0?(
                <div style={{ textAlign:"center", color:"#aaa", padding:"24px 0" }}>
                  <div style={{ fontSize:36 }}>📭</div>
                  <div style={{ fontWeight:700, marginTop:8 }}>No transactions yet</div>
                </div>
              ):transactions.map(t => {
                const cat = CATEGORIES.find(c=>c.name===t.category);
                return (
                  <div key={t.id} className="tx-row">
                    <div style={{ fontSize:24 }}>{cat?.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, fontSize:14 }}>{t.description}</div>
                      <div style={{ fontSize:12, color:"#888" }}>{t.category} · {t.date}</div>
                    </div>
                    <div style={{ fontWeight:900, color:t.type==="income"?"#4ADE80":"#F87171", fontSize:15, marginRight:8 }}>
                      {t.type==="income"?"+":"-"}{formatMoney(t.amount)}
                    </div>
                    <button className="btn" onClick={()=>deleteTransaction(t.id)} style={{ background:"#fff0f0", color:"#F87171", padding:"6px 10px", fontSize:14 }}>🗑️</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}