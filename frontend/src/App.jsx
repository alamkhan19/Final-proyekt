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
  const res = await axios.get("http://localhost:5000/api/places");
  
  const query = `
    [out:json];
    (
      node["amenity"="restaurant"](40.35,49.75,40.45,49.95);
      node["amenity"="cafe"](40.35,49.75,40.45,49.95);
      node["tourism"="attraction"](40.35,49.75,40.45,49.95);
      node["leisure"="park"](40.35,49.75,40.45,49.95);
    );
    out 30;
  `;
  
  const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  });
  const overpassData = await overpassRes.json();
  
  const overpassPlaces = overpassData.elements
    .filter(el => el.tags?.name)
    .map(el => ({
      _id: `osm-${el.id}`,
      name: el.tags.name,
      category: el.tags.amenity === "restaurant" ? "Restoran" :
                el.tags.amenity === "cafe" ? "Kafe" :
                el.tags.tourism ? "Tarixi yer" : "Park",
      description: el.tags["cuisine"] || "",
      address: el.tags["addr:street"] || "Bakı",
      rating: 4,
      photo: ""
    }));

  setPlaces([...res.data, ...overpassPlaces]);
};

  useEffect(() => {
    fetchPlaces();
  }, []);

  const filtered = places.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Hamısı" || p.category === category;
    const matchMood = mood === "Hamısı" || p.mood === mood;
    return matchSearch && matchCat && matchMood;
  });

  return (
    <div className="app">
      <header>
        <h1>🗺️ Bakı Gəzinti Rəhbəri</h1>
        <p>Bakının ən gözəl yerlərini kəşf et</p>
      </header>

      <div className="filters">
        <input placeholder="🔍 Axtar..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {["Hamısı","Restoran","Park","Tarixi yer","Kafe","Gizli yer"].map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={mood} onChange={e => setMood(e.target.value)}>
          {["Hamısı","Romantik","Ailə","Tək","Dostlarla"].map(m => <option key={m}>{m}</option>)}
        </select>
        <button onClick={() => setShowForm(!showForm)}>+ Yer əlavə et</button>
      </div>

      {showForm && <AddPlaceForm onAdd={() => { fetchPlaces(); setShowForm(false); }} />}

      <div className="grid">
        {filtered.map(place => <PlaceCard key={place._id} place={place} onDelete={fetchPlaces} />)}
      </div>
    </div>
  );
}

export default App;