import React, { useState } from 'react';

const AdvancedReviewForm = ({ craftsmanName, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photosPreviews, setPhotosPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (rating === 0) newErrors.rating = 'يرجى اختيار تقييم';
    if (!title.trim()) newErrors.title = 'يرجى إدخال عنوان';
    if (!comment.trim()) newErrors.comment = 'يرجى كتابة تعليق';
    if (comment.trim().length < 10) newErrors.comment = 'التعليق قصير (10 أحرف على الأقل)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const review = {
      rating,
      title,
      comment,
      photos: photosPreviews,
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      notHelpful: 0
    };

    onSubmit(review);
    setRating(0);
    setTitle('');
    setComment('');
    setPhotos([]);
    setPhotosPreviews([]);
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    
    const newPhotos = [...photos, ...validFiles].slice(0, 5);
    setPhotos(newPhotos);

    const newPreviews = newPhotos.map(f => URL.createObjectURL(f));
    setPhotosPreviews(newPreviews);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{
      background: 'white', borderRadius: '16px', padding: '30px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)', direction: 'rtl'
    }}>
      <h3 style={{ fontSize: '1.3em', fontWeight: '700', marginBottom: '5px' }}>
        أضف تقييمك
      </h3>
      {craftsmanName && (
        <p style={{ color: '#888', marginBottom: '20px' }}>
          تقييم {craftsmanName}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* النجوم */}
        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
          <p style={{ fontWeight: '600', marginBottom: '10px' }}>تقييمك العام</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  fontSize: '2.5em',
                  cursor: 'pointer',
                  color: star <= (hoverRating || rating) ? '#ffc107' : '#e0e0e0',
                  transition: '0.2s',
                  transform: star <= (hoverRating || rating) ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                ★
              </span>
            ))}
          </div>
          {rating > 0 && (
            <p style={{ marginTop: '8px', fontWeight: '600', color: '#ffc107' }}>
              {rating === 5 ? 'ممتاز' : rating === 4 ? 'جيد جداً' : rating === 3 ? 'جيد' : rating === 2 ? 'مقبول' : 'ضعيف'}
            </p>
          )}
          {errors.rating && <p style={{ color: '#dc3545', fontSize: '0.85em' }}>{errors.rating}</p>}
        </div>

        {/* العنوان */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>عنوان التقييم</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="لخص تجربتك في جملة"
            maxLength={100}
            style={{
              width: '100%', padding: '14px', border: '2px solid #e8ecf1',
              borderRadius: '12px', fontSize: '1em', outline: 'none', textAlign: 'right', boxSizing: 'border-box'
            }}
          />
          {errors.title && <p style={{ color: '#dc3545', fontSize: '0.85em' }}>{errors.title}</p>}
        </div>

        {/* التعليق */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>تعليقك</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شارك تجربتك بالتفصيل..."
            rows={4}
            maxLength={500}
            style={{
              width: '100%', padding: '14px', border: '2px solid #e8ecf1',
              borderRadius: '12px', fontSize: '1em', outline: 'none',
              textAlign: 'right', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
            {errors.comment && <p style={{ color: '#dc3545', fontSize: '0.85em' }}>{errors.comment}</p>}
            <small style={{ color: '#888' }}>{comment.length}/500</small>
          </div>
        </div>

        {/* رفع صور */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>صور (اختياري)</label>
          <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ marginBottom: '10px' }} />
          {photosPreviews.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {photosPreviews.map((preview, i) => (
                <div key={i} style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" onClick={() => removePhoto(i)} style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: '#dc3545', color: 'white', border: 'none',
                    cursor: 'pointer', fontSize: '0.8em', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* أزرار */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{
            flex: 1, padding: '14px', background: '#0d6efd', color: 'white',
            border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '1em'
          }}>
            نشر التقييم
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{
              padding: '14px 24px', background: '#f0f0f0', color: '#333',
              border: 'none', borderRadius: '12px', fontWeight: '600', cursor: 'pointer'
            }}>
              إلغاء
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdvancedReviewForm;