import { useState, useEffect } from "react";
import axios from "axios";
import PlaceCard from "./components/PlaceCard";
import AddPlaceForm from "./components/AddPlaceForm";
import "./App.css";

function App() {
  const [places, setPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Hamısı");
  const [mood, setMood] = useState("Hamısı");
  const [showForm, setShowForm] = useState(false);

  const fetchPlaces = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/places`);
    setPlaces(res.data);
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    fetchPlaces();
  }, []);

  const filtered = places
    .filter(p => p.name !== "Tural Bileceri")
    .filter(p => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Hamısı" || p.category === category;
      const matchMood = mood === "Hamısı" || p.mood === mood;
      return matchSearch && matchCat && matchMood;
    });

  return (
  <div className="app">
    <header>
      <h1>Şəhər Sirləri</h1>
      <p className="subtitle">Bakının gizli qaldığı yerləri kəşf et</p>
      <span className="scroll-hint">↓ Aşağı bax</span>
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
        {filtered.map(place => <PlaceCard key={place._id} place={place} onDelete={fetchPlaces} />)}
      </div>
    </div>
  </div>
);
}

export default App;