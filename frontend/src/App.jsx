import { useState, useEffect } from "react";
import axios from "axios";
import PlaceCard from "./components/PlaceCard";
import AddPlaceForm from "./components/AddPlaceForm";
import "./App.css";

const CITIES = ["Hamısı","Bakı","Abşeron","Gəncə","Şəki","Quba","Lənkəran"];

function App() {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Hamısı");
  const [mood, setMood] = useState("Hamısı");
  const [city, setCity] = useState("Hamısı");
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/places`);
      setPlaces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPlaces(); }, []);

  const handleAdminClick = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      const pass = prompt("Admin şifrəsi:");
      if (pass === "baki2024") setIsAdmin(true);
      else alert("Şifrə yanlışdır!");
    }
  };

  const filtered = places
    .filter(p => p.name !== "Tural Bileceri")
    .filter(p => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
      const matchCat  = category === "Hamısı" || p.category === category;
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
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Hamısı">🏷️ Kateqoriya</option>
            <option>Restoran</option>
            <option>Park</option>
            <option>Tarixi yer</option>
            <option>Kafe</option>
            <option>Gizli yer</option>
          </select>
          <select value={city} onChange={e => setCity(e.target.value)}>
            <option value="Hamısı">🏙️ Şəhər</option>
            <option>Abşeron</option>
            <option>Bakı</option>
            <option>Gəncə</option>
            <option>Göygöl</option>
            <option>İsmayıllı</option>
            <option>Lerik</option>
            <option>Lənkəran</option>
            <option>Masallı</option>
            <option>Oğuz</option>
            <option>Qaz</option>
            <option>Qəbələ</option>
            <option>Quba</option>
            <option>Qusar</option>
            <option>Şamaxı</option>
            <option>Şəki</option>
            <option>Tovuz</option>
            <option>Zaqatala</option>
          </select>
          <select value={mood} onChange={e => setMood(e.target.value)}>
            <option value="Hamısı">🎭 Əhval</option>
            <option>Romantik</option>
            <option>Ailə</option>
            <option>Tək</option>
            <option>Dostlarla</option>
          </select>
          <button onClick={() => setShowForm(!showForm)}>+ Yer əlavə et</button>
        </div>

        {showForm && <AddPlaceForm onAdd={() => { fetchPlaces(); setShowForm(false); }} />}

        <div className="grid">
          {filtered.map(place => (
            <PlaceCard key={place._id} place={place} onDelete={fetchPlaces} isAdmin={isAdmin} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;