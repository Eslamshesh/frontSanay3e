import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  MapPin, Navigation, Phone, Star, Clock, 
  Wrench, Route, ChevronRight, ExternalLink,
  Loader, AlertCircle, Users, Ruler
} from 'lucide-react';

const CraftsmanMap = ({ craftsman, nearbyCraftsmen = [], userLocation = null }) => {
  const { darkMode } = useTheme();
  const [lang, setLang] = useState('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [distance, setDistance] = useState(null);
  const [showNearby, setShowNearby] = useState(false);
  const [activeView, setActiveView] = useState('map'); // 'map' or 'list'

  // Language initialization
  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLang(savedLang);
    
    const handleLanguageChange = () => {
      const currentLang = localStorage.getItem('language') || 'ar';
      setLang(currentLang);
    };
    
    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [craftsman]);

  // Calculate distance if user location is available
  useEffect(() => {
    if (userLocation && craftsman?.latitude && craftsman?.longitude) {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        craftsman.latitude,
        craftsman.longitude
      );
      setDistance(dist);
    }
  }, [userLocation, craftsman]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (deg) => deg * (Math.PI / 180);

  // Format distance
  const formatDistance = (dist) => {
    if (!dist) return '';
    return dist < 1 
      ? `${Math.round(dist * 1000)} ${lang === 'ar' ? 'متر' : 'm'}`
      : `${dist.toFixed(1)} ${lang === 'ar' ? 'كم' : 'km'}`;
  };

  // Translations
  const t = {
    location: lang === 'ar' ? 'الموقع على الخريطة' : 'Location on Map',
    nearby: lang === 'ar' ? 'الحرفيين القريبين' : 'Nearby Craftsmen',
    distance: lang === 'ar' ? 'المسافة' : 'Distance',
    away: lang === 'ar' ? 'عنك' : 'away',
    viewOnMap: lang === 'ar' ? 'عرض على الخريطة' : 'View on Map',
    getDirections: lang === 'ar' ? 'الاتجاهات' : 'Directions',
    map: lang === 'ar' ? 'الخريطة' : 'Map',
    list: lang === 'ar' ? 'القائمة' : 'List',
    noNearby: lang === 'ar' ? 'لا يوجد حرفيين قريبين' : 'No nearby craftsmen',
    loading: lang === 'ar' ? 'جاري تحميل الخريطة...' : 'Loading map...',
    error: lang === 'ar' ? 'تعذر تحميل الخريطة' : 'Failed to load map',
    rate: lang === 'ar' ? 'تقييم' : 'Rating',
    years: lang === 'ar' ? 'سنوات الخبرة' : 'Years Exp',
    contact: lang === 'ar' ? 'اتصال' : 'Call',
    estimatedTime: lang === 'ar' ? 'الوقت التقريبي' : 'Est. Time',
    minutes: lang === 'ar' ? 'دقيقة' : 'min',
  };

  // Get location for map
  const location = craftsman?.city || craftsman?.location || 'القاهرة';
  const fullLocation = craftsman?.district 
    ? `${craftsman.district}, ${craftsman.city}` 
    : location;
  const encodedLocation = encodeURIComponent(fullLocation);

  // Dynamic colors
  const cardBg = darkMode ? '#1e293b' : '#ffffff';
  const textColor = darkMode ? '#f1f5f9' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderColor = darkMode ? '#334155' : '#e2e8f0';
  const mapBg = darkMode ? '#1e293b' : '#f1f5f9';
  const accentColor = '#3b82f6';

  return (
    <div style={{ 
      marginTop: '24px',
      fontFamily: "'Cairo', sans-serif",
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.4s ease forwards;
        }
        
        .map-container {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .map-container:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        
        .nearby-card {
          transition: all 0.3s ease;
        }
        
        .nearby-card:hover {
          transform: translateX(-4px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        
        .skeleton {
          background: linear-gradient(90deg, ${darkMode ? '#334155' : '#e2e8f0'} 25%, ${darkMode ? '#1e293b' : '#f1f5f9'} 50%, ${darkMode ? '#334155' : '#e2e8f0'} 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        @media (max-width: 768px) {
          .map-iframe {
            height: 250px !important;
          }
        }
      `}</style>

      {/* Header with Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: textColor,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <MapPin size={20} style={{ color: '#ef4444' }} />
          {t.location}
          
          {distance && (
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#059669',
              background: darkMode ? 'rgba(5,150,105,0.1)' : '#d1fae5',
              padding: '4px 10px',
              borderRadius: '20px',
              marginLeft: '8px',
            }}>
              {formatDistance(distance)} {t.away}
            </span>
          )}
        </h3>

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          background: darkMode ? '#0f172a' : '#f1f5f9',
          borderRadius: '10px',
          padding: '3px',
          gap: '2px',
        }}>
          <button
            onClick={() => setActiveView('map')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              fontFamily: "'Cairo', sans-serif",
              background: activeView === 'map' ? accentColor : 'transparent',
              color: activeView === 'map' ? 'white' : textSecondary,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <MapPin size={14} />
            {t.map}
          </button>
          <button
            onClick={() => setActiveView('list')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              fontFamily: "'Cairo', sans-serif",
              background: activeView === 'list' ? accentColor : 'transparent',
              color: activeView === 'list' ? 'white' : textSecondary,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Users size={14} />
            {t.list}
          </button>
        </div>
      </div>

      {/* Map View */}
      {activeView === 'map' && (
        <div>
          {isLoading ? (
            <div className="skeleton" style={{
              borderRadius: '16px',
              height: '350px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: textSecondary,
            }}>
              <Loader size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ marginLeft: '8px' }}>{t.loading}</span>
            </div>
          ) : (
            <div className="map-container" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              border: `1px solid ${borderColor}`,
              background: mapBg,
            }}>
              {/* Map iframe */}
              <iframe
                title={`${craftsman?.name || ''} - ${fullLocation}`}
                width="100%"
                height="350"
                className="map-iframe"
                style={{ 
                  border: 'none',
                  display: 'block',
                  filter: darkMode ? 'invert(0.9) hue-rotate(180deg)' : 'none',
                }}
                src={`https://maps.google.com/maps?q=${encodedLocation}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
                loading="lazy"
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />

              {/* Map Overlay Info */}
              <div style={{
                padding: '16px 20px',
                background: cardBg,
                borderTop: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: textColor,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}>
                  <MapPin size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <span>{craftsman?.name || ''} - {fullLocation}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Directions Button */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: '#059669',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      fontFamily: "'Cairo', sans-serif",
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(5,150,105,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(5,150,105,0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(5,150,105,0.3)';
                    }}
                  >
                    <Navigation size={16} />
                    {t.getDirections}
                  </a>

                  {/* Open in Google Maps */}
                  <a
                    href={`https://www.google.com/maps/place/${encodedLocation}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: darkMode ? '#334155' : '#f1f5f9',
                      color: textColor,
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      fontFamily: "'Cairo', sans-serif",
                      border: `1px solid ${borderColor}`,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = accentColor;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = borderColor;
                    }}
                  >
                    <ExternalLink size={16} />
                    {t.viewOnMap}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View - Nearby Craftsmen */}
      {activeView === 'list' && (
        <div className="animate-fade-in">
          <h4 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: textColor,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Users size={18} style={{ color: accentColor }} />
            {t.nearby}
          </h4>

          {nearbyCraftsmen && nearbyCraftsmen.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}>
              {/* Current Craftsman */}
              <div className="nearby-card animate-slide-up" style={{
                background: cardBg,
                borderRadius: '14px',
                padding: '16px',
                border: `2px solid ${accentColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: 'pointer',
                position: 'relative',
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <MapPin size={24} color="white" />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: textColor,
                    marginBottom: '4px',
                  }}>
                    {craftsman?.name}
                    <span style={{
                      fontSize: '0.7rem',
                      background: '#3b82f6',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      marginLeft: '8px',
                    }}>
                      {lang === 'ar' ? 'الحالي' : 'Current'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: textSecondary }}>
                    📍 {fullLocation}
                  </div>
                </div>

                <ChevronRight size={20} style={{ color: textSecondary, flexShrink: 0 }} />
              </div>

              {/* Nearby Craftsmen */}
              {nearbyCraftsmen
                .filter(c => c.id !== craftsman?.id)
                .slice(0, 5)
                .map((nearby, index) => {
                  const dist = craftsman?.latitude && nearby?.latitude
                    ? calculateDistance(
                        craftsman.latitude,
                        craftsman.longitude,
                        nearby.latitude,
                        nearby.longitude
                      )
                    : null;

                  return (
                    <div 
                      key={nearby.id || index}
                      className="nearby-card animate-slide-up"
                      style={{
                        background: cardBg,
                        borderRadius: '14px',
                        padding: '16px',
                        border: `1px solid ${borderColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: darkMode ? '#334155' : '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        position: 'relative',
                      }}>
                        <Wrench size={22} style={{ color: accentColor }} />
                        <span style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                          color: 'white',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {index + 2}
                        </span>
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: textColor,
                          marginBottom: '4px',
                        }}>
                          {nearby.name}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '0.8rem',
                          color: textSecondary,
                        }}>
                          <span>📍 {nearby.city || nearby.location}</span>
                          {dist && (
                            <span style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#059669',
                              fontWeight: 600,
                            }}>
                              <Route size={12} />
                              {formatDistance(dist)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {nearby.rating && (
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#f59e0b',
                          }}>
                            <Star size={14} fill="#f59e0b" />
                            {nearby.rating}
                          </span>
                        )}
                        <ChevronRight size={20} style={{ color: textSecondary, flexShrink: 0 }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: textSecondary,
              background: cardBg,
              borderRadius: '14px',
              border: `1px solid ${borderColor}`,
            }}>
              <MapPin size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '0.95rem' }}>{t.noNearby}</p>
            </div>
          )}
        </div>
      )}

      {/* Location Info Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '12px',
        fontSize: '0.8rem',
        color: textSecondary,
        flexWrap: 'wrap',
      }}>
        <MapPin size={14} style={{ color: '#ef4444' }} />
        <span>{fullLocation}</span>
        
        {distance && (
          <>
            <span style={{ opacity: 0.5 }}>•</span>
            <Route size={14} style={{ color: '#059669' }} />
            <span style={{ color: '#059669', fontWeight: 600 }}>
              {formatDistance(distance)} {t.away}
            </span>
          </>
        )}
        
        {craftsman?.rating && (
          <>
            <span style={{ opacity: 0.5 }}>•</span>
            <Star size={14} style={{ color: '#f59e0b' }} fill="#f59e0b" />
            <span style={{ fontWeight: 600, color: '#f59e0b' }}>
              {craftsman.rating}
            </span>
          </>
        )}
      </div>

      {/* Usage Instructions (for development) */}
      {!craftsman?.latitude && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '10px',
          background: darkMode ? 'rgba(59,130,246,0.1)' : '#eff6ff',
          border: '1px solid rgba(59,130,246,0.2)',
          fontSize: '0.8rem',
          color: '#3b82f6',
        }}>
          <AlertCircle size={14} style={{ display: 'inline', marginRight: '6px' }} />
          {lang === 'ar' 
            ? 'لتفعيل حساب المسافات، أضف latitude و longitude للصنايعي.'
            : 'To enable distance calculation, add latitude & longitude to craftsman.'}
        </div>
      )}
    </div>
  );
};

export default CraftsmanMap;