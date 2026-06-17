import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Upload, X, Image, AlertCircle } from 'lucide-react';

const ImageUploader = ({ onUpload, multiple = false, maxFiles = 5 }) => {
  const { darkMode } = useTheme();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('يرجى اختيار ملفات صور فقط');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الملف يجب أن يكون أقل من 5MB');
        return false;
      }
      return true;
    });

    setError('');

    const newImages = multiple ? [...images, ...validFiles].slice(0, maxFiles) : [validFiles[0]];
    setImages(newImages);

    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);

    if (onUpload) onUpload(newImages);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    if (e.target.files?.[0]) handleFiles(e.target.files);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const bgColor = darkMode ? '#1e293b' : '#fafbfc';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const textColor = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div style={{ direction: 'rtl' }}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? '#3b82f6' : borderColor}`,
          borderRadius: '16px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragActive ? 'rgba(59,130,246,0.05)' : bgColor,
          transition: 'all 0.3s ease',
          marginBottom: '15px',
        }}
      >
        <Upload size={40} style={{ color: dragActive ? '#3b82f6' : textColor, marginBottom: '12px' }} />
        <p style={{ fontWeight: 600, color: darkMode ? '#e2e8f0' : '#475569', marginBottom: '8px' }}>
          اسحب وأفلت الصور هنا
        </p>
        <p style={{ color: textColor, fontSize: '0.9em' }}>
          أو اضغط للاختيار - PNG, JPG (حد أقصى 5MB)
        </p>
        {multiple && (
          <p style={{ color: textColor, fontSize: '0.8em', marginTop: '8px' }}>
            يمكنك رفع حتى {maxFiles} صور
          </p>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={handleChange} style={{ display: 'none' }} />

      {error && (
        <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      {previews.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '10px',
          marginTop: '15px',
        }}>
          {previews.map((preview, index) => (
            <div key={index} style={{
              position: 'relative', borderRadius: '12px',
              overflow: 'hidden', height: '140px',
              border: `1px solid ${borderColor}`,
            }}>
              <img src={preview} alt={`${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                style={{
                  position: 'absolute', top: '8px', right: '8px',
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: 'rgba(220,38,38,0.9)', color: 'white',
                  border: 'none', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;