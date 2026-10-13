"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Home, Files, MessageCircle, Video, Bot, CalendarDays, Users, UserRound,
  Search, Bell, Bookmark, UploadCloud, ChevronLeft, Star, Download, Eye,
  Moon, Settings, CircleHelp, FileText, Clock3, Sparkles, BookOpen, Send,
  Menu, X, Languages, ShieldCheck
} from "lucide-react";

type Note = { id: number; title: string; course: string; teacher: string; major: string; term: string; author: string; rating: number; downloads: string; views: string; tags: string[]; color: string; };
const notes: Note[] = [
  { id: 1, title: "جزوه فیزیک ۱", course: "فیزیک عمومی", teacher: "دکتر احمدی", major: "مهندسی کامپیوتر", term: "ترم ۱", author: "Mahdi_1378", rating: 4.8, downloads: "2.4k", views: "5.8k", tags: ["فیزیک", "مکانیک"], color: "paper" },
  { id: 2, title: "جزوه حسابان ۱", course: "ریاضی عمومی", teacher: "دکتر رضایی", major: "مهندسی برق", term: "ترم ۱", author: "Sara_m", rating: 4.7, downloads: "1.9k", views: "4.2k", tags: ["ریاضی", "تحلیلی"], color: "paper pink" },
  { id: 3, title: "برنامه‌نویسی C++", course: "مبانی برنامه‌نویسی", teacher: "مهندس کریمی", major: "مهندسی کامپیوتر", term: "ترم ۲", author: "ReraDev", rating: 4.9, downloads: "1.6k", views: "7.6k", tags: ["کامپیوتر", "برنامه‌نویسی"], color: "chalk" },
  { id: 4, title: "جزوه شیمی آلی", course: "شیمی پایه", teacher: "دکتر نادری", major: "شیمی", term: "ترم ۲", author: "Negin", rating: 4.6, downloads: "1.4k", views: "3.8k", tags: ["شیمی", "آلی"], color: "paper" },
  { id: 5, title: "آمار و احتمال", course: "آمار", teacher: "دکتر موسوی", major: "ریاضی", term: "ترم ۳", author: "Alireza", rating: 4.5, downloads: "1.1k", views: "2.9k", tags: ["آمار", "احتمال"], color: "paper pink" },
];

const aiTools = [
  { name: "ChatGPT", desc: "دستیار عمومی", url: "https://chatgpt.com", mark: "✳", tint: "mint" },
  { name: "Claude", desc: "نوشتن و تحلیل", url: "https://claude.ai", mark: "✺", tint: "orange" },
  { name: "Gemini", desc: "تحلیل PDF و عکس", url: "https://gemini.google.com", mark: "✦", tint: "blue" },
  { name: "DeepSeek", desc: "ریاضی و کدنویسی", url: "https://chat.deepseek.com", mark: "◈", tint: "purple" },
  { name: "Copilot", desc: "دستیار مایکروسافت", url: "https://copilot.microsoft.com", mark: "∞", tint: "blue" },
  { name: "Perplexity", desc: "جست‌وجو با منبع", url: "https://www.perplexity.ai", mark: "✧", tint: "mint" },
  { name: "Mistral", desc: "دستیار متنی", url: "https://chat.mistral.ai", mark: "M", tint: "orange" },
  { name: "Grok", desc: "دستیار xAI", url: "https://grok.com", mark: "◉", tint: "purple" },
];

const navItems = [
  { label: "خانه", icon: Home }, { label: "جزوه‌ها", icon: Files }, { label: "پرسش و پاسخ", icon: CircleHelp },
  { label: "تماس تصویری", icon: Video }, { label: "چت", icon: MessageCircle }, { label: "دستیارهای هوش مصنوعی", icon: Bot },
  { label: "تقویم دانشگاهی", icon: CalendarDays }, { label: "ارزیابی استاد و درس", icon: ShieldCheck },
  { label: "برنامه‌ریزی مطالعه", icon: Clock3 }, { label: "انجمن", icon: Users }, { label: "پروفایل", icon: UserRound },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeNav, setActiveNav] = useState("خانه");
  const [saved, setSaved] = useState<number[]>([2]);
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [formText, setFormText] = useState("");
  const [localItems, setLocalItems] = useState<{title:string; detail:string; kind:string}[]>([]);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<{from:string; text:string}[]>([
    {from:"ShahinLearn", text:"به فضای گفت‌وگوی محلی خوش آمدی. پیام‌ها فعلاً فقط روی همین مرورگر ذخیره می‌شوند."}
  ]);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState("25");
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [authStep, setAuthStep] = useState<"profile" | "otp">("profile");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [authError, setAuthError] = useState("");
  const [demoOtpVisible, setDemoOtpVisible] = useState(false);
  const filteredNotes = useMemo(() => notes.filter(n => `${n.title} ${n.course} ${n.teacher} ${n.major} ${n.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const toggleSaved = (id: number) => setSaved(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
  const action = (label: string) => {
    setActiveNav(label);
    setWorkspace(label);
    setFormText("");
    setNotice("");
    setMobileNav(false);
  };
  useEffect(() => {
    try {
      const savedUser = window.localStorage.getItem("shahinlearn_demo_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setFirstName(parsed.firstName || "");
        setLastName(parsed.lastName || "");
        setPhone(parsed.phone || "");
        setAuthenticated(true);
      }
    } catch {}
    setAuthLoaded(true);
  }, []);
  const requestDemoOtp = () => {
    const normalizedPhone = phone.replace(/[\s()-]/g, "");
    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      setAuthError("لطفاً نام و نام خانوادگی را کامل وارد کن."); return;
    }
    if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)) {
      setAuthError("شماره تلفن معتبر وارد کن (۱۰ تا ۱۵ رقم، با کد کشور اختیاری)."); return;
    }
    setPhone(normalizedPhone);
    setAuthError(""); setAuthStep("otp"); setDemoOtpVisible(true);
  };
  const verifyDemoOtp = () => {
    if (otp !== "123456") { setAuthError("کد آزمایشی نادرست است. کد ۱۲۳۴۵۶ را وارد کن."); return; }
    const user = { firstName: firstName.trim(), lastName: lastName.trim(), phone };
    window.localStorage.setItem("shahinlearn_demo_user", JSON.stringify(user));
    setAuthenticated(true); setAuthError(""); setNotice(`خوش آمدی ${user.firstName} عزیز!`);
  };
  const logoutDemo = () => {
    window.localStorage.removeItem("shahinlearn_demo_user");
    setAuthenticated(false); setAuthStep("profile"); setOtp(""); setNotice("");
  };
  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => setTimerSeconds(v => {
      if (v <= 1) { setTimerRunning(false); setNotice("زمان تمرکز تمام شد! کمی استراحت کن."); return 0; }
      return v - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);
  const addLocalItem = (kind: string, title: string, detail = "") => {
    if (!title.trim()) return;
    setLocalItems(old => [{kind, title:title.trim(), detail:detail.trim()}, ...old]);
    setFormText("");
    setNotice(`${kind} با موفقیت در همین مرورگر ثبت شد.`);
  };
  const sendChat = () => {
    if (!chatText.trim()) return;
    setChatMessages(old => [...old, {from:"شاهین بهاری", text:chatText.trim()}]);
    setChatText("");
  };
  const timerDisplay = `${String(Math.floor(timerSeconds / 60)).padStart(2,"0")}:${String(timerSeconds % 60).padStart(2,"0")}`;

  if (!authLoaded) return <div className="auth-loading" dir="rtl">در حال آماده‌سازی ShahinLearn…</div>;
  if (!authenticated) return (
    <main className="auth-screen" dir="rtl">
      <section className="auth-card">
        <div className="auth-brand"><div className="brand-icon"><BookOpen size={24}/></div><span>Shahin<span className="brand-accent">Learn</span></span></div>
        <span className="auth-kicker"><ShieldCheck size={15}/> ورود امن به فضای یادگیری</span>
        <h1>{authStep === "profile" ? "به شاهین‌لرن خوش اومدی" : "تأیید شماره تلفن"}</h1>
        <p className="auth-subtitle">{authStep === "profile" ? "برای ورود، نام و نام خانوادگی و شماره تلفنت رو وارد کن." : `کد تأیید آزمایشی برای ${phone} را وارد کن.`}</p>
        {authStep === "profile" ? <form onSubmit={e => {e.preventDefault(); requestDemoOtp();}} className="auth-form">
          <label>نام<input autoComplete="given-name" value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="مثلاً شاهین" required minLength={2}/></label>
          <label>نام خانوادگی<input autoComplete="family-name" value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="مثلاً بهاری" required minLength={2}/></label>
          <label>شماره تلفن<input autoComplete="tel" inputMode="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="مثلاً 09123456789" required/></label>
          <button className="btn-primary auth-submit" type="submit">دریافت کد ورود <ChevronLeft size={17}/></button>
        </form> : <form onSubmit={e=>{e.preventDefault();verifyDemoOtp();}} className="auth-form">
          <label>کد ۶ رقمی<input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g, "").slice(0,6))} placeholder="۱۲۳۴۵۶" required/></label>
          {demoOtpVisible && <div className="demo-otp"><strong>حالت رایگان آزمایشی</strong><span>کد ورود شما: <bdi>123456</bdi></span><small>پیامک واقعی ارسال نشده؛ این کد فقط برای آزمایش ورود روی همین دستگاه است.</small></div>}
          <button className="btn-primary auth-submit" type="submit">تأیید و ورود به سایت <ChevronLeft size={17}/></button>
          <button className="auth-back" type="button" onClick={()=>{setAuthStep("profile");setOtp("");setAuthError("");}}>ویرایش اطلاعات</button>
        </form>}
        {authError && <div className="auth-error" role="alert">{authError}</div>}
        <div className="auth-privacy">با ورود، اطلاعاتت فعلاً فقط در مرورگر همین دستگاه ذخیره می‌شود؛ هنوز حساب کاربری سروری ساخته نمی‌شود.</div>
        <div className="auth-slogan">با هم یاد بگیر، قوی‌تر شو، آینده‌ات رو بساز!</div>
      </section>
    </main>
  );
  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-icon"><BookOpen size={22}/></div><span>Shahin<span className="brand-accent">Learn</span></span><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="بستن منو"><X/></button></div>
        <div className="campus-chip"><span className="status-dot"/><span>فضای دانشجویی</span><span className="chip-live">آنلاین</span></div>
        <nav>{navItems.map(({label, icon: Icon}) => <button key={label} onClick={() => action(label)} className={`nav-item ${activeNav === label ? "active" : ""}`}><Icon size={18}/><span>{label}</span>{label === "چت" && <b className="nav-count">3</b>}</button>)}</nav>
        <div className="sidebar-bottom"><button className="nav-item" onClick={() => setLang(lang === "fa" ? "en" : "fa")}><Languages size={18}/><span>{lang === "fa" ? "English" : "فارسی"}</span></button><button className="nav-item" onClick={() => action("تنظیمات")}><Settings size={18}/><span>تنظیمات</span></button><div className="profile-mini"><div className="avatar avatar-user">ش</div><div><strong>{firstName && lastName ? `${firstName} ${lastName}` : "شاهین بهاری"}</strong><small>عضو ShahinLearn</small></div><span className="online-dot"/></div></div>
      </aside>

      {mobileNav && <button className="mobile-backdrop" onClick={() => setMobileNav(false)} aria-label="بستن منو"/>}

      <section className="main-content">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setMobileNav(true)} aria-label="باز کردن منو"><Menu/></button>
          <div className="search-wrap"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="جست‌وجوی جزوه، درس، استاد یا موضوع..." /><kbd>Ctrl K</kbd></div>
          <div className="top-actions"><button className="icon-button" aria-label="نشانک‌ها" onClick={() => action("علاقه‌مندی‌ها")}><Bookmark size={19}/></button><button className="icon-button has-notification" aria-label="اعلان‌ها" onClick={() => action("اعلان‌ها")}><Bell size={19}/><i/></button><div className="top-user"><div className="avatar avatar-user">{(firstName || "ش").slice(0,1)}</div><div><strong>{firstName ? `خوش اومدی ${firstName}!` : "خوش اومدی!"}</strong><small>{phone}</small></div></div><button className="icon-button" title="خروج از حساب" onClick={logoutDemo}><X size={17}/></button></div>
        </header>

        {notice && <div className="toast">{notice}</div>}

        <section className="hero">
          <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
          <div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> مسیر یادگیری هوشمند</span><h1>با هم یاد بگیر،<br/><span>قوی‌تر شو!</span></h1><p>آینده‌ات رو بساز! از هر رشته‌ای که باشی، اینجا جای توئه؛ یاد بگیر، دانسته‌هات رو به اشتراک بذار و با دانشجوهای دیگه همراه شو.</p><div className="hero-actions"><button className="btn-primary" onClick={() => action("جزوه‌ها")}><Files size={16}/> کشف جزوه‌ها <ChevronLeft size={16}/></button><button className="btn-ghost" onClick={() => action("اتاق‌های مطالعه")}><Video size={16}/> ورود به اتاق مطالعه</button></div></div>
          <div className="hero-art"><div className="hero-ring ring-a"/><div className="hero-ring ring-b"/><div className="hero-book"><BookOpen size={76} strokeWidth={1.1}/></div><div className="float-card float-card-a"><div className="float-icon"><Star size={16} fill="currentColor"/></div><div><strong>۴.۹ از ۵</strong><small>جزوه‌های برتر</small></div></div><div className="float-card float-card-b"><div className="float-icon purple"><Users size={16}/></div><div><strong>۱,۲۴۰+</strong><small>دانشجوی فعال</small></div></div><span className="spark spark-a">✦</span><span className="spark spark-b">✧</span></div>
          <div className="hero-bottom"><span><span className="status-dot"/> ۲۴۸ دانشجو در حال مطالعه</span><span className="hero-separator"/> <span>ترم پاییز ۱۴۰۵</span></div>
        </section>

        <section className="quick-grid">
          {[
            {title:"آپلود جزوه",desc:"دانسته‌هات رو به اشتراک بذار",icon:UploadCloud,cls:"blue",nav:"آپلود جزوه"},
            {title:"تماس تصویری",desc:"مرور درس با دوستان",icon:Video,cls:"purple",nav:"تماس تصویری"},
            {title:"چت گروهی",desc:"برای هر درس و گروه",icon:MessageCircle,cls:"cyan",nav:"چت"},
            {title:"سؤال از هوش مصنوعی",desc:"کمک برای یادگیری بهتر",icon:Bot,cls:"pink",nav:"دستیارهای هوش مصنوعی"},
          ].map(item => <button className="quick-card" key={item.title} onClick={() => action(item.nav)}><div className={`quick-icon ${item.cls}`}><item.icon size={22}/></div><div className="quick-text"><strong>{item.title}</strong><span>{item.desc}</span></div><ChevronLeft className="quick-arrow" size={17}/></button>)}
        </section>

        <section className="section-block">
          <div className="section-heading"><div><span className="section-kicker">کتابخانه‌ی دانش</span><h2>تازه‌ترین جزوه‌ها <span className="heading-count">{filteredNotes.length}</span></h2></div><button className="text-link" onClick={() => action("همه‌ی جزوه‌ها")}>مشاهده همه <ChevronLeft size={16}/></button></div>
          <div className="notes-grid">{filteredNotes.map(note => <article className="note-card" key={note.id}><div className={`note-preview ${note.color}`}><div className="paper-lines"/><span className="note-file"><FileText size={16}/> PDF</span><button className={`save-button ${saved.includes(note.id) ? "is-saved" : ""}`} onClick={() => toggleSaved(note.id)} aria-label="ذخیره جزوه"><Bookmark size={16} fill={saved.includes(note.id) ? "currentColor" : "none"}/></button><div className="preview-equation">{note.id === 3 ? "int main() { }" : note.id === 4 ? "H₂O + CO₂" : note.id === 5 ? "P(A ∩ B)" : "∑  f(x) dx"}</div></div><div className="note-body"><div className="tag-row">{note.tags.map(t => <span className="tag" key={t}>{t}</span>)}<span className="tag muted">{note.term}</span></div><h3>{note.title}</h3><p className="note-course">{note.course} <span>·</span> {note.teacher}</p><div className="note-author"><div className="avatar avatar-small">{note.author.slice(0,1)}</div><span>{note.author}</span><span className="rating"><Star size={13} fill="currentColor"/>{note.rating}</span></div><div className="note-stats"><span><Download size={13}/>{note.downloads}</span><span><Eye size={13}/>{note.views}</span><button onClick={() => action(`نمایش ${note.title}`)}>پیش‌نمایش <ChevronLeft size={13}/></button></div></div></article>)}</div>
          {filteredNotes.length === 0 && <div className="empty-state"><Search size={26}/><strong>جزوه‌ای پیدا نشد</strong><span>عبارت دیگری را جست‌وجو کن.</span></div>}
        </section>

        <section className="lower-grid">
          <div className="panel ai-panel"><div className="section-heading"><div><span className="section-kicker">همراه مطالعه‌ی تو</span><h2>دستیارهای هوش مصنوعی <Sparkles size={18} className="inline-spark"/></h2></div><button className="icon-button" onClick={() => action("مدیریت ابزارهای هوش مصنوعی")}><ChevronLeft size={18}/></button></div><p className="panel-description">ابزار مناسب برای هر سؤال، فقط با یک کلیک.</p><div className="ai-grid">{aiTools.map(tool => <a href={tool.url} target="_blank" rel="noopener noreferrer" className="ai-card" key={tool.name}><span className={`ai-mark ${tool.tint}`}>{tool.mark}</span><strong>{tool.name}</strong><small>{tool.desc}</small><span className="ai-open">باز کردن ↗</span></a>)}</div><p className="ai-note">این سرویس‌ها مستقل‌اند و ممکن است برای استفاده به حساب کاربری جداگانه نیاز داشته باشند.</p></div>
          <div className="panel calendar-panel"><div className="section-heading"><div><span className="section-kicker">برنامه‌ی تو</span><h2>تقویم دانشگاهی</h2></div><button className="icon-button" onClick={() => action("تقویم دانشگاهی")}><CalendarDays size={18}/></button></div><div className="calendar-month"><button onClick={() => action("ماه قبل")}>‹</button><strong>مهر ۱۴۰۵</strong><button onClick={() => action("ماه بعد")}>›</button></div><div className="calendar-days">{["ش","ی","د","س","چ","پ","ج"].map((d,i)=><span key={i} className="day-name">{d}</span>)}{Array.from({length:35},(_,i)=>{const day=i-1; return <button key={i} className={`day ${day===20?"today": [7,14,25].includes(day)?"has-event":""}`} onClick={() => action(`رویداد روز ${day}`)}>{day>0&&day<=30?day:""}</button>})}</div><div className="event-list"><div className="event-dot blue-dot"/><div><strong>تحویل پروژه پایگاه داده</strong><small>فردا · ساعت ۲۳:۵۹</small></div><span className="event-label">پروژه</span></div><div className="event-list"><div className="event-dot orange-dot"/><div><strong>کوییز ریاضی عمومی</strong><small>پنجشنبه · ساعت ۱۰:۰۰</small></div><span className="event-label orange-label">امتحان</span></div><button className="calendar-add" onClick={() => action("افزودن رویداد")}>+ افزودن رویداد جدید</button></div>
          <div className="panel pomodoro-panel"><div className="section-heading"><div><span className="section-kicker">تمرکز عمیق</span><h2>تایمر مطالعه</h2></div><Clock3 size={18} className="muted-icon"/></div><div className="timer-ring"><div><strong>{timerDisplay}</strong><small>{timerRunning ? "در حال تمرکز" : "زمان تمرکز"}</small></div></div><div className="timer-controls"><button className="btn-primary" onClick={() => setTimerRunning(v => !v)}>{timerRunning ? "⏸ مکث" : "▶ شروع"}</button><button className="btn-ghost" onClick={() => {setTimerRunning(false); setTimerSeconds(25*60);}}>بازنشانی</button></div><div className="pomodoro-progress"><span style={{width:"45%"}}/></div><div className="pomodoro-caption"><span>جلسه‌ی امروز</span><strong>۲ از ۴</strong></div></div>
        </section>

        {workspace && <div className="workspace-overlay" role="presentation" onClick={() => setWorkspace("")}>
          <section className="workspace-modal" role="dialog" aria-modal="true" aria-label={workspace} onClick={e => e.stopPropagation()}>
            <div className="workspace-head"><div><span className="section-kicker">فضای کاری ShahinLearn</span><h2>{workspace}</h2></div><button className="icon-button" onClick={() => setWorkspace("")} aria-label="بستن"><X size={20}/></button></div>
            {["جزوه‌ها","همه‌ی جزوه‌ها","علاقه‌مندی‌ها","نمایش جزوه فیزیک ۱","نمایش جزوه حسابان ۱","نمایش جزوه برنامه‌نویسی C++","نمایش جزوه شیمی آلی","نمایش جزوه آمار و احتمال"].includes(workspace) ? <div className="workspace-content">
              <p>جزوه‌های موجود در این نسخه را جست‌وجو و نشانک‌گذاری کن. برای افزودن فایل واقعی از بخش «آپلود جزوه» استفاده کن.</p>
              <div className="workspace-list">{notes.filter(n => workspace !== "علاقه‌مندی‌ها" || saved.includes(n.id)).map(n => <div className="workspace-list-item" key={n.id}><div><strong>{n.title}</strong><small>{n.course} · {n.teacher}</small></div><button className="text-link" onClick={() => {setWorkspace("نمایش "+n.title);}}>باز کردن</button></div>)}</div>
            </div> :
            ["آپلود جزوه"].includes(workspace) ? <div className="workspace-content"><p>فایل را انتخاب کن و عنوان جزوه را وارد کن. در این نسخه فایل فقط برای انتخاب محلی دریافت می‌شود و روی سرور آپلود نمی‌شود.</p><label className="workspace-label">عنوان جزوه<input value={formText} onChange={e=>setFormText(e.target.value)} placeholder="مثلاً جزوه ساختمان داده"/></label><label className="workspace-label">انتخاب فایل<input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg"/></label><button className="btn-primary" onClick={()=>addLocalItem("جزوه",formText,"فایل انتخاب‌شده (ذخیره محلی نیست)")}>ثبت در فهرست این نشست</button></div> :
            ["چت","چت گروهی","پرسش و پاسخ","انجمن"].includes(workspace) ? <div className="workspace-content"><p>گفت‌وگوی محلی برای تست رابط کاربری؛ پیام‌ها هنوز به دانشجویان دیگر ارسال نمی‌شوند.</p><div className="chat-log">{chatMessages.map((m,i)=><div className="chat-message" key={i}><strong>{m.from}</strong><span>{m.text}</span></div>)}</div><div className="workspace-compose"><input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="پیامت را بنویس..." onKeyDown={e=>{if(e.key==="Enter")sendChat();}}/><button className="btn-primary" onClick={sendChat}><Send size={16}/> ارسال</button></div></div> :
            ["تقویم دانشگاهی","افزودن رویداد","ماه قبل","ماه بعد"].includes(workspace) ? <div className="workspace-content"><p>رویداد جدید به فهرست محلی اضافه می‌شود.</p><label className="workspace-label">عنوان رویداد<input value={formText} onChange={e=>setFormText(e.target.value)} placeholder="مثلاً امتحان پایگاه داده"/></label><button className="btn-primary" onClick={()=>addLocalItem("رویداد",formText,"رویداد دانشگاهی")}>+ افزودن رویداد</button><div className="workspace-list">{localItems.filter(x=>x.kind==="رویداد").map((x,i)=><div className="workspace-list-item" key={i}><strong>{x.title}</strong><small>ثبت‌شده در این مرورگر</small></div>)}</div></div> :
            ["برنامه‌ریزی مطالعه","شروع تایمر","تنظیم تایمر","اتاق‌های مطالعه"].includes(workspace) ? <div className="workspace-content"><p>تایمر تمرکز واقعی همین صفحه را می‌توانی از کارت تایمر کنترل کنی.</p><div className="timer-settings"><label className="workspace-label">مدت تمرکز (دقیقه)<input type="number" min="1" max="180" value={timerMinutes} onChange={e=>setTimerMinutes(e.target.value)}/></label><button className="btn-primary" onClick={()=>{const mins=Math.max(1,Math.min(180,Number(timerMinutes)||25));setTimerSeconds(mins*60);setTimerRunning(false);setWorkspace("");}}>اعمال زمان</button></div><p>اتاق مطالعه‌ی گروهی و تماس تصویری تا زمان اتصال سرویس سرور و WebRTC در دسترس واقعی نیستند.</p></div> :
            ["دستیارهای هوش مصنوعی","سؤال از هوش مصنوعی","مدیریت ابزارهای هوش مصنوعی"].includes(workspace) ? <div className="workspace-content"><p>برای استفاده از دستیارها، یکی از سرویس‌های مستقل زیر را باز کن. ورود و اشتراک‌گذاری اطلاعات تابع قوانین همان سرویس است.</p><div className="workspace-ai-list">{aiTools.map(t=><a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer">{t.name} ↗ <small>{t.desc}</small></a>)}</div></div> :
            <div className="workspace-content"><p>این بخش در حال آماده‌سازی برای اتصال به سامانه‌ی واقعی است. می‌توانی یک یادداشت محلی اضافه کنی تا تعاملات رابط را آزمایش کنی.</p><label className="workspace-label">یادداشت<input value={formText} onChange={e=>setFormText(e.target.value)} placeholder="متن موردنظر..."/></label><button className="btn-primary" onClick={()=>addLocalItem(workspace,formText)}>ثبت یادداشت</button><div className="workspace-list">{localItems.filter(x=>x.kind===workspace).map((x,i)=><div className="workspace-list-item" key={i}><strong>{x.title}</strong><small>{x.detail}</small></div>)}</div></div>}
            <p className="workspace-footnote">توجه: اطلاعات این بخش فعلاً محلی و آزمایشی است؛ برای استفاده‌ی چندکاربره به پایگاه داده و بک‌اند نیاز داریم.</p>
          </section>
        </div>}
        <footer className="footer"><span>© ۱۴۰۵ ShahinLearn</span><span>ساخته‌شده برای یادگیری بهتر <span className="footer-heart">♥</span></span><div><button onClick={() => action("قوانین و حریم خصوصی")}>قوانین و حریم خصوصی</button><button onClick={() => action("پشتیبانی")}>پشتیبانی</button></div></footer>
      </section>
    </main>
  );
}
