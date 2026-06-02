import axios from "axios";

function PlaceCard({ place, onDelete }) {
  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/places/${place._id}`);
    onDelete();
  };

  return (
    <div className="card">
      {place.photo && <img src={place.photo} alt={place.name} />}
      <div className="card-body">
        <span className="category">{place.category}</span>
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <p>📍 {place.address}</p>
        <div className="card-footer">
          <span className="rating">{"⭐".repeat(place.rating || 1)}</span>
          <button className="delete-btn" onClick={handleDelete}>🗑️</button>
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;