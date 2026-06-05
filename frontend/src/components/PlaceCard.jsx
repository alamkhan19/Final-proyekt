import axios from "axios";

const FOOD_CATEGORIES = ["Restoran", "Kafe", "Restaurant", "Cafe"];

function PlaceCard({ place, onDelete, isAdmin, onClick, lang, onEdit, isFavorite, onFavoriteChange }) {
  const toggleLike = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = isFavorite
      ? favorites.filter(id => id !== place._id)
      : [...favorites, place._id];
    localStorage.setItem("favorites", JSON.stringify(updated));
    onFavoriteChange?.(updated);
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
          {place.city && <span className="card-city" style={{ fontSize: "0.85rem", opacity: 0.8 }}>🏙️ {place.city}</span>}
        </div>
        <h3>{displayName}</h3>
        <p>{displayDesc}</p>
        <p>📍 {place.address}</p>
        {FOOD_CATEGORIES.includes(place.category) && place.price && (
          <p style={{ color:"#4caf50", fontWeight:"bold" }}>{place.price}</p>
        )}
        <div className="card-footer">
          <span className="rating">{"⭐".repeat(place.rating || 1)}</span>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <button onClick={toggleLike} style={{
              background: "none", border: "none",
              fontSize: "1.3rem", cursor: "pointer",
              transition: "transform 0.2s"
            }}>
              {isFavorite ? "❤️" : "🤍"}
            </button>
            {isAdmin && (
              <button
                className="delete-btn"
                onClick={e => { e.stopPropagation(); onEdit(place); }}
                style={{ background:"none", border:"none", fontSize:"1.1rem", cursor:"pointer" }}
              >
                ✏️
              </button>
            )}
            {isAdmin && (
              <button
                className="delete-btn"
                onClick={e => { e.stopPropagation(); handleDelete(); }}
              >
                🗑
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;
