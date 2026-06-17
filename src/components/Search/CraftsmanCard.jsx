import React from 'react';
import { Link } from 'react-router-dom';

const CraftsmanCard = ({ craftsman }) => {
  return (
    <div style={styles.card}>
      {/* صورة الحرفي */}
      <div style={styles.imageContainer}>
        <div style={styles.imagePlaceholder}>
          {craftsman.name[0]}
        </div>
        {/* تقييم */}
        <span style={styles.ratingBadge}>⭐ {craftsman.rating}</span>
      </div>

      {/* معلومات الحرفي */}
      <div style={styles.info}>
        <h3 style={styles.name}>{craftsman.name}</h3>
        <p style={styles.job}>{craftsman.job}</p>
        
        <div style={styles.details}>
          <span>📍 {craftsman.location}</span>
          <span>💵 {craftsman.price} جنيه </span>
        </div>

        <div style={styles.stats}>
          <span>📊 {craftsman.completed} خدمة</span>
          <span>💬 {craftsman.reviews} مراجعة</span>
        </div>

        {/* أزرار الإجراءات */}
        <div style={styles.actions}>
          <Link to={`/craftsman/${craftsman.id}`} style={styles.viewBtn}>
            عرض الملف
          </Link>
          <Link to={`/booking/${craftsman.id}`} style={styles.bookBtn}>
            احجز الآن
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: '0.3s',
    cursor: 'pointer'
  },
  imageContainer: {
    position: 'relative',
    height: '160px',
    background: 'linear-gradient(135deg, #0d6efd, #4b3fcf)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imagePlaceholder: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.3)',
    color: 'white',
    fontSize: '2em',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(255,255,255,0.95)',
    padding: '4px 10px',
    borderRadius: '15px',
    fontSize: '0.85em',
    fontWeight: '700'
  },
  info: {
    padding: '18px'
  },
  name: {
    fontSize: '1.1em',
    fontWeight: '700',
    marginBottom: '4px'
  },
  job: {
    color: '#0d6efd',
    fontWeight: '600',
    fontSize: '0.9em',
    marginBottom: '10px'
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85em',
    color: '#666',
    marginBottom: '8px'
  },
  stats: {
    display: 'flex',
    gap: '15px',
    fontSize: '0.8em',
    color: '#888',
    marginBottom: '15px'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  viewBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '10px',
    background: '#f0f0f0',
    color: '#333',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9em',
    transition: '0.2s'
  },
  bookBtn: {
    flex: 1,
    textAlign: 'center',
    padding: '10px',
    background: 'linear-gradient(135deg, #0d6efd, #4b3fcf)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9em',
    transition: '0.2s'
  }
};

export default CraftsmanCard;