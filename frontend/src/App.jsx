import { useState, useEffect, useRef } from "react";
import axios from "axios";
import PlaceCard from "./components/PlaceCard";
import AddPlaceForm from "./components/AddPlaceForm";
import PlaceDetail from "./components/PlaceDetail";
import "./App.css";

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
        {value === "Hamısı" ? placeholder : value}
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

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/places`);
      setPlaces(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchPlaces(); }, []);

  const handleAdminClick = () => {
    if (isAdmin) { setIsAdmin(false); }
    else {
      const pass = prompt("Admin şifrəsi:");
      if (pass === "baki2024") setIsAdmin(true);
      else alert("Şifrə yanlışdır!");
    }
  };

  const filtered = places
    .filter(p => p.name !== "Tural Bileceri")
    .filter(p => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Hamısı" || p.category === category;
      const matchMood = mood === "Hamısı" || p.mood === mood;
      const matchCity = city === "Hamısı" || p.city === city;
      return matchSearch && matchCat && matchMood && matchCity;
    });

  return (
    <div className="app">
      <header>
        <h1>Şəhər Sirləri</h1>
        <p className="subtitle">Bakının gizli qaldığı yerləri kəşf et</p>
        <span className="scroll-hint">↓ Aşağı bax</span>
        <button onClick={handleAdminClick} style={{
          position:"absolute", top:"20px", right:"20px",
          background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.3)",
          color:"white", padding:"8px 16px", borderRadius:"8px",
          cursor:"pointer", fontSize:"0.85rem", backdropFilter:"blur(4px)"
        }}>
          {isAdmin ? "🔓 Admin" : "🔒"}
        </button>
      </header>

      <div className="main-content">
        <div className="filters">
          <input placeholder="🔍 Axtar..." value={search} onChange={e => setSearch(e.target.value)} />
          <Dropdown
            value={category}
            onChange={setCategory}
            placeholder="🏷️ Kateqoriya"
            options={["Hamısı","Restoran","Park","Tarixi yer","Kafe","Gizli yer"]}
          />
          <Dropdown
            value={city}
            onChange={setCity}
            placeholder="🏙️ Şəhər"
            options={["Hamısı","Abşeron","Bakı","Gəncə","Göygöl","İsmayıllı","Lerik","Lənkəran","Masallı","Oğuz","Qəbələ","Quba","Qusar","Şamaxı","Şəki","Tovuz","Zaqatala"]}
          />
          <Dropdown
            value={mood}
            onChange={setMood}
            placeholder="🎭 Əhval"
            options={["Hamısı","Romantik","Ailə","Tək","Dostlarla"]}
          />
          <button onClick={() => setShowForm(!showForm)}>+ Yer əlavə et</button>
        </div>

        {showForm && <AddPlaceForm onAdd={() => { fetchPlaces(); setShowForm(false); }} onClose={() => setShowForm(false)} />}

        <div className="grid">
          {filtered.map(place => (
            <PlaceCard
              key={place._id}
              place={place}
              onDelete={fetchPlaces}
              isAdmin={isAdmin}
              onClick={() => setSelectedPlace(place)}
            />
          ))}
        </div>
      </div>

      {selectedPlace && (
        <PlaceDetail
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  );
}

export default App;