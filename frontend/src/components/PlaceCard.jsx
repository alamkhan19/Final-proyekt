import { useState, useEffect } from "react";
import axios from "axios";

function PlaceCard({ place, onDelete, isAdmin, onClick, lang }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setLiked(favorites.includes(place._id));
  }, [place._id]);

  const toggleLike = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let updated;
    if (liked) {
      updated = favorites.filter(id => id !== place._id);
    } else {
      updated = [...favorites, place._id];
    }
    localStorage.setItem("favorites", JSON.stringify(updated));
    setLiked(!liked);
  };

  const handleDelete = async () => {
    await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/places/${place._id}`);
    onDelete();
  };

  const displayName = lang === "en" && place.nameEn ? place.nameEn : place.name;
  const displayDesc = lang === "en" && place.descriptionEn ? place.descriptionEn : place.description;

  return (
    <div className="card" onClick={onClick}>
      {place.photo && <img src={place.photo} alt={place.name} />}
      <div className="card-body">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span className="card-category">{place.category}</span>
          {place.city && <span style={{ fontSize:"0.75rem", color:"#888" }}>📍 {place.city}</span>}
        </div>
        <h3>{displayName}</h3>
        <p>{displayDesc}</p>
        <p>📍 {place.address}</p>
        {place.price && <p style={{ color:"#4caf50", fontWeight:"bold" }}>{place.price}</p>}
        <div className="card-footer">
          <span className="rating">{"⭐".repeat(place.rating || 1)}</span>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <button
              onClick={toggleLike}
              style={{
                background: "none", border: "none",
                fontSize: "1.3rem", cursor: "pointer",
                transition: "transform 0.2s"
              }}
            >
              {liked ? "❤️" : "🤍"}
            </button>
            {isAdmin && <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(); }}>🗑</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;