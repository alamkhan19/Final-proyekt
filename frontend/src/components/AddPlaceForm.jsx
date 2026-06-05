import { useState } from "react";
import axios from "axios";

const CITIES = ["Bakı","Abşeron","Gəncə","Göygöl","İsmayıllı","Lerik","Lənkəran","Masallı","Oğuz","Qəbələ","Quba","Qusar","Şamaxı","Şəki","Tovuz","Zaqatala"];
const PRICES = ["₼ (ucuz)","₼₼ (orta)","₼₼₼ (bahalı)"];

function AddPlaceForm({ onAdd, onClose }) {
  const [form, setForm] = useState({
    name: "", nameEn: "", category: "Restoran", description: "", descriptionEn: "",
    address: "", rating: 5, photo: "", mood: "Ailə",
    city: "Bakı", price: "₼ (ucuz)", phone: "", hours: "", mapLink: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = { ...form };
    if (data.category !== "Restoran" && data.category !== "Kafe") delete data.price;
    await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/places`, data);
    onAdd();
  };

  return (
    <div className="form-overlay">
      <div className="form-card" style={{position: "relative"}}>
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "none", border: "none", fontSize: "1.5rem",
          cursor: "pointer", color: "#888"
        }}>✕</button>

        <h2>Yeni Yer Əlavə Et</h2>

        <input name="name" placeholder="Yerin adı * (Azərbaycan dilində)" value={form.name} onChange={handleChange} />
        <input name="nameEn" placeholder="Place name (English) - istəyə bağlı" value={form.nameEn} onChange={handleChange} />

        <select name="category" value={form.category} onChange={handleChange}>
          {["Restoran","Park","Tarixi yer","Kafe","Gizli yer"].map(c => <option key={c}>{c}</option>)}
        </select>

        <select name="city" value={form.city} onChange={handleChange}>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <select name="mood" value={form.mood} onChange={handleChange}>
          {["Ailə","Romantik","Tək","Dostlarla"].map(m => <option key={m}>{m}</option>)}
        </select>

        <input name="address" placeholder="Ünvan" value={form.address} onChange={handleChange} />

        <textarea name="description" placeholder="Ətraflı təsvir (Azərbaycan dilində)" value={form.description} onChange={handleChange} rows={3} />
        <textarea name="descriptionEn" placeholder="Description in English (optional)" value={form.descriptionEn} onChange={handleChange} rows={3} />

        <input name="photo" placeholder="Foto URL (istəyə bağlı)" value={form.photo} onChange={handleChange} />
        <input name="phone" placeholder="Telefon nömrəsi (istəyə bağlı)" value={form.phone} onChange={handleChange} />
        <input name="hours" placeholder="İş saatları (məs: 09:00 - 22:00)" value={form.hours} onChange={handleChange} />
        <input name="mapLink" placeholder="Google Maps linki (istəyə bağlı)" value={form.mapLink} onChange={handleChange} />

        <select name="rating" value={form.rating} onChange={handleChange}>
          {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ⭐</option>)}
        </select>

        {(form.category === "Restoran" || form.category === "Kafe") && (
          <select name="price" value={form.price} onChange={handleChange}>
            {PRICES.map(p => <option key={p}>{p}</option>)}
          </select>
        )}

        <button type="submit" onClick={handleSubmit}>Əlavə et ✅</button>
      </div>
    </div>
  );
}

export default AddPlaceForm;