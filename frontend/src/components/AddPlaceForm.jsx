import { useState } from "react";
import axios from "axios";

function AddPlaceForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "", category: "Restoran", description: "",
    address: "", rating: 5, photo: "", mood: "Ailə"
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/places", form);
    onAdd();
  };

  return (
    <div className="form-container">
      <h2>Yeni Yer Əlavə Et</h2>
      <div className="form">
        <input name="name" placeholder="Yerin adı *" value={form.name} onChange={handleChange} />
        <select name="category" value={form.category} onChange={handleChange}>
          {["Restoran","Park","Tarixi yer","Kafe","Gizli yer"].map(c => <option key={c}>{c}</option>)}
        </select>
        <select name="mood" value={form.mood} onChange={handleChange}>
          {["Ailə","Romantik","Tək","Dostlarla"].map(m => <option key={m}>{m}</option>)}
        </select>
        <input name="address" placeholder="Ünvan" value={form.address} onChange={handleChange} />
        <textarea name="description" placeholder="Təsvir" value={form.description} onChange={handleChange} />
        <input name="photo" placeholder="Foto URL (istəyə bağlı)" value={form.photo} onChange={handleChange} />
        <select name="rating" value={form.rating} onChange={handleChange}>
          {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} ⭐</option>)}
        </select>
        <button onClick={handleSubmit}>Əlavə et ✅</button>
      </div>
    </div>
  );
}

export default AddPlaceForm;