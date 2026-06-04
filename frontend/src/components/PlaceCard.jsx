import axios from "axios";

function PlaceCard({ place, onDelete, isAdmin, onClick }) {
  const handleDelete = async () => {
    await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/places/${place._id}`);
    onDelete();
  };

  return (
    <div className="card" onClick={onClick}>
      {place.photo && <img src={place.photo} alt={place.name} />}
      <div className="card-body">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span className="card-category">{place.category}</span>
          {place.city && <span style={{ fontSize:"0.75rem", color:"#888" }}>📍 {place.city}</span>}
        </div>
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <p>📍 {place.address}</p>
        {place.price && <p style={{ color:"#4caf50", fontWeight:"bold" }}>{place.price}</p>}
        <div className="card-footer">
          <span className="rating">{"⭐".repeat(place.rating || 1)}</span>
          {isAdmin && <button className="delete-btn" onClick={handleDelete}>🗑</button>}
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;