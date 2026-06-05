import { useState } from "react";
import axios from "axios";

import { CITIES } from "../constants";
const PRICES = ["₼ (ucuz)","₼₼ (orta)","₼₼₼ (bahalı)"];

function EditPlaceForm({ place, onClose, onSave }) {
  const [form, setForm] = useState({
    name: place.name || "",
    nameEn: place.nameEn || "",
    category: place.category || "Restoran",
    description: place.description || "",
    descriptionEn: place.descriptionEn || "",
    address: place.address || "",
    rating: place.rating || 5,
    photo: place.photo || "",
    mood: place.mood || "Ailə",
    city: place.city || "",
    price: place.price || "₼ (ucuz)",
    phone: place.phone || "",
    hours: place.hours || "",
    mapLink: place.mapLink || ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const id = place._id;
    console.log("Saxla basıldı, ID:", id);
    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/places/${id}`;
      console.log("PUT URL:", url);
      const res = await axios.put(url, form);
      console.log("Cavab:", res.data);
      onSave();
    } catch (err) {
      console.error("Xəta:", err);
      alert("Xəta: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-card" style={{position: "relative"}}>
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "none", border: "none", fontSize: "1.5rem",
          cursor: "pointer", color: "#888"
        }}>✕</button>

        <h2>Yeri Düzəlt ✏️</h2>

        <input name="name" placeholder="Yerin adı (Azərbaycan dilində)" value={form.name} onChange={handleChange} />
        <input name="nameEn" placeholder="Place name (English)" value={form.nameEn} onChange={handleChange} />

        <select name="category" value={form.category} onChange={handleChange}>
          {["Restoran","Park","Tarixi yer","Kafe","Gizli yer"].map(c => <option key={c}>{c}</option>)}
        </select>

        <select name="city" value={form.city} onChange={handleChange}>
          <option value="">Şəhər seç</option>
          {CITIES.slice(1).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select name="mood" value={form.mood} onChange={handleChange}>
          <option value="">Əhval seç</option>
          {["Ailə", "Romantik", "Tək", "Dostlarla"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input name="address" placeholder="Ünvan" value={form.address} onChange={handleChange} />

        <textarea name="description" placeholder="Təsvir (Azərbaycan dilində)" value={form.description} onChange={handleChange} rows={3} />
        <textarea name="descriptionEn" placeholder="Description (English)" value={form.descriptionEn} onChange={handleChange} rows={3} />

        <input name="photo" placeholder="Foto URL" value={form.photo} onChange={handleChange} />
        <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} />
        <input name="hours" placeholder="İş saatları" value={form.hours} onChange={handleChange} />
        <input name="mapLink" placeholder="Google Maps linki" value={form.mapLink} onChange={handleChange} />

        <select name="rating" value={form.rating} onChange={handleChange}>
          {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ⭐</option>)}
        </select>

        {(form.category === "Restoran" || form.category === "Kafe") && (
          <select name="price" value={form.price} onChange={handleChange}>
            {PRICES.map(p => <option key={p}>{p}</option>)}
          </select>
        )}

        <button onClick={handleSubmit}>Saxla ✅</button>
      </div>
    </div>
  );
}

export default EditPlaceForm;