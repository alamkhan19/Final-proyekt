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
        photo: (() => {
          const restaurantPhotos = [
            "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/2290070/pexels-photo-2290070.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/776538/pexels-photo-776538.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/음식/pexels-photo-3338407.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&w=400&h=300",
          ];
          const cafePhotos = [
            "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1813466/pexels-photo-1813466.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/683039/pexels-photo-683039.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1187317/pexels-photo-1187317.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/2159600/pexels-photo-2159600.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/4349744/pexels-photo-4349744.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/3020919/pexels-photo-3020919.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/1024359/pexels-photo-1024359.jpeg?auto=compress&w=400&h=300",
            "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg?auto=compress&w=400&h=300",
          ];
          const idx = el.id % 20;
          if (el.tags.amenity === "restaurant") return restaurantPhotos[idx % restaurantPhotos.length];
          if (el.tags.amenity === "cafe") return cafePhotos[idx % cafePhotos.length];
          if (el.tags.tourism) return "https://images.pexels.com/photos/3214972/pexels-photo-3214972.jpeg?auto=compress&w=400&h=300";
          return "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&w=400&h=300";
        })()
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
          {["Hamısı", "Restoran", "Park", "Tarixi yer", "Kafe", "Gizli yer"].map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={mood} onChange={e => setMood(e.target.value)}>
          {["Hamısı", "Romantik", "Ailə", "Tək", "Dostlarla"].map(m => <option key={m}>{m}</option>)}
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