import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PlaceCard from "./components/PlaceCard";
import AddPlaceForm from "./components/AddPlaceForm";
import EditPlaceForm from "./components/EditPlaceForm";
import PlaceDetail from "./components/PlaceDetail";
import { CITIES, MOOD_FILTER_TO_DB } from "./constants";
import "./App.css";

const TEXTS = {
  az: {
    subtitle: "Azərbaycanın gizli incilərini kəşf et",
    scrollHint: "↓ Aşağı bax",
    search: "🔍 Axtar...",
    category: "🏷️ Kateqoriya",
    city: "🏙️ Şəhər",
    mood: "🎭 Əhval",
    addPlace: "+ Yer əlavə et",
    found: "yer tapıldı",
    footerSub: "Azərbaycanın gözəl yerlərini kəşf et",
    copyright: "© 2026 Discover Azerbaijan. Bütün hüquqlar qorunur.",
    adminPass: "Admin şifrəsi:",
    wrongPass: "Şifrə yanlışdır!",
    categories: ["Hamısı","Restoran","Park","Tarixi yer","Kafe","Gizli yer"],
    moods: ["Hamısı","Romantik","Ailə","Tək","Dostlarla"],
  },
  en: {
    subtitle: "Explore the hidden gems of Azerbaijan",
    scrollHint: "↓ Scroll down",
    search: "🔍 Search...",
    category: "🏷️ Category",
    city: "🏙️ City",
    mood: "🎭 Mood",
    addPlace: "+ Add place",
    found: "places found",
    footerSub: "Discover the beautiful places of Azerbaijan",
    copyright: "© 2026 Discover Azerbaijan. All rights reserved.",
    adminPass: "Admin password:",
    wrongPass: "Wrong password!",
    categories: ["All","Restaurant","Park","Historic site","Cafe","Hidden gem"],
    moods: ["All","Romantic","Family","Solo","With friends"],
  }
};

function Dropdown({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="custom-dropdown" ref={ref}>
      <button className="dropdown-btn" onClick={() => setOpen(!open)}>
        {value === options[0] ? placeholder : value}
        <span className="dropdown-arrow">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="dropdown-menu">
          {options.map(opt => (
            <div
              key={opt}
              className={`dropdown-item ${value === opt ? "active" : ""}`}
              onClick={() => { onChange(opt); setOpen(false); }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Hamısı");
  const [mood, setMood] = useState("Hamısı");
  const [city, setCity] = useState("Hamısı");
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [editPlace, setEditPlace] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("az");
  
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(() =>
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );

  const langBtnRef = useRef();
  const darkBtnRef = useRef();
  const adminBtnRef = useRef();

  const t = TEXTS[lang];

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/places`);
      console.log("PLACES FROM DB:", res.data);
      setPlaces(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPlaces(); }, []);

  useEffect(() => {
    if (!selectedPlace) return;
    const updated = places.find(p => p._id === selectedPlace._id);
    if (updated) setSelectedPlace(updated);
  }, [places, selectedPlace?._id]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  useEffect(() => {
    const btn = langBtnRef.current;
    if (!btn) return;
    const handler = () => {
      const newLang = lang === "az" ? "en" : "az";
      setLang(newLang);
      setCategory(TEXTS[newLang].categories[0]);
      setMood(TEXTS[newLang].moods[0]);
    };
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, [lang]);

  useEffect(() => {
    const btn = darkBtnRef.current;
    if (!btn) return;
    const handler = () => setDarkMode(prev => !prev);
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const btn = adminBtnRef.current;
    if (!btn) return;
    const handler = () => {
      if (isAdmin) { setIsAdmin(false); }
      else {
        const pass = prompt(t.adminPass);
        if (pass === "baki2024") setIsAdmin(true);
        else alert(t.wrongPass);
      }
    };
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, [isAdmin, t]);

  const filtered = places
    .filter(p => p.name !== "Tural Bileceri")
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
        || (p.nameEn && p.nameEn.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "Hamısı" || category === "All" || p.category === category;
      const dbMood = MOOD_FILTER_TO_DB[mood];
      const matchMood = dbMood == null || (p.mood && p.mood.trim().toLowerCase() === dbMood.toLowerCase());
      const matchCity = city === "Hamısı" || city === "All" || p.city === city;
      const matchFav = !showFavorites || favorites.includes(p._id);
      return matchSearch && matchCat && matchMood && matchCity && matchFav;
    });

  return (
    <div className="app">
      <header>
        <h1>Discover Azerbaijan</h1>
        <p className="subtitle">{t.subtitle}</p>
        <span className="scroll-hint">{t.scrollHint}</span>
        <div className="header-actions">
          <button ref={langBtnRef} className="header-btn">
            {lang === "az" ? "🇬🇧 EN" : "🇦🇿 AZ"}
          </button>
          <button ref={darkBtnRef} className="header-btn">
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button ref={adminBtnRef} className="header-btn">
            {isAdmin ? "🔓 Admin" : "🔒"}
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="filters">
          <input placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} />
          <Dropdown value={category} onChange={setCategory} placeholder={t.category} options={t.categories} />
          <Dropdown value={city} onChange={setCity} placeholder={t.city} options={CITIES} />
          <Dropdown value={mood} onChange={setMood} placeholder={t.mood} options={t.moods} />
          
          <button 
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? "❤️ Sevimlilər" : "🤍 Sevimlilər"}
          </button>

          {isAdmin && (
            <button onClick={() => setShowForm(prev => !prev)}>
              {t.addPlace}
            </button>
          )}
        </div>

        {showForm && (
          <AddPlaceForm
            onAdd={() => { fetchPlaces(); setShowForm(false); }}
            onClose={() => setShowForm(false)}
          />
        )}

        {editPlace && (
          <EditPlaceForm
            place={editPlace}
            onClose={() => setEditPlace(null)}
            onSave={() => { fetchPlaces(); setEditPlace(null); }}
          />
        )}

        <p style={{ textAlign:"center", color:"#888", marginBottom:"16px", fontSize:"0.95rem" }}>
          🔍 {filtered.length} {t.found}
        </p>

        <div className="grid">
          {filtered.map(place => (
            <PlaceCard
              key={place._id}
              place={place}
              onDelete={fetchPlaces}
              isAdmin={isAdmin}
              lang={lang}
              isFavorite={favorites.includes(place._id)}
              onFavoriteChange={setFavorites}
              onClick={() => setSelectedPlace(place)}
              onEdit={(p) => setEditPlace(p)}
            />
          ))}
        </div>
      </div>

      {selectedPlace && (
        <PlaceDetail
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          lang={lang}
        />
      )}

      <footer style={{
        background: "#1a1a2e", color: "#e8d5a3",
        textAlign: "center", padding: "40px 20px", marginTop: "60px"
      }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "8px", color: "#f5d78e" }}>Discover Azerbaijan</h3>
        <p style={{ opacity: 0.7, marginBottom: "16px" }}>{t.footerSub}</p>
        <p style={{ opacity: 0.5, fontSize: "0.85rem" }}>{t.copyright}</p>
      </footer>
    </div>
  );
}

export default App;