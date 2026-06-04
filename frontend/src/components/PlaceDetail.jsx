import { useEffect } from "react";

function PlaceDetail({ place, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!place) return null;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-card" onClick={e => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>✕</button>
        
        {place.photo && (
          <img src={place.photo} alt={place.name} className="detail-img" />
        )}

        <div className="detail-body">
          <div className="detail-tags">
            <span className="card-category">{place.category}</span>
            {place.city && <span className="detail-city">🏙️ {place.city}</span>}
            {place.price && <span className="detail-price">{place.price}</span>}
            {place.mood && <span className="detail-city">🎭 {place.mood}</span>}
          </div>

          <h2 className="detail-title">{place.name}</h2>

          <p className="detail-description">
            {place.description || "Ətraflı məlumat yoxdur."}
          </p>

          <div className="detail-info">
            {place.address && (
              <div className="detail-info-row">
                <span>📍</span>
                <span>{place.address}</span>
              </div>
            )}
            {place.phone && (
              <div className="detail-info-row">
                <span>📞</span>
                <a href={`tel:${place.phone}`} style={{color:"#b5813a"}}>{place.phone}</a>
              </div>
            )}
            {place.hours && (
              <div className="detail-info-row">
                <span>🕐</span>
                <span>{place.hours}</span>
              </div>
            )}
            <div className="detail-info-row">
              <span>⭐</span>
              <span>{"⭐".repeat(place.rating || 1)} ({place.rating || 1}/5)</span>
            </div>
          </div>

          {place.mapLink && (
            <a 
              href={place.mapLink} 
              target="_blank" 
              rel="noreferrer"
              style={{
                display: "block",
                marginTop: "16px",
                padding: "12px",
                background: "linear-gradient(135deg, #7a9e5f, #b5813a)",
                color: "white",
                borderRadius: "10px",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: "600"
              }}
            >
              🗺️ Google Maps-də aç
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceDetail;