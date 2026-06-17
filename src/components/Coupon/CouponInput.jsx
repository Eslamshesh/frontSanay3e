import React, { useState } from 'react';

const CouponInput = ({ onApply, total }) => {
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [error, setError] = useState('');

  const coupons = {
    'WELCOME20': { discount: 20, type: 'percent' },
    'SALE50': { discount: 50, type: 'fixed' },
    'FIRST10': { discount: 10, type: 'percent' },
    'NEWUSER': { discount: 30, type: 'fixed' }
  };

  const handleApply = () => {
    setError('');
    setDiscount(null);

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      setError('كود الخصم غير صالح');
      return;
    }

    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = Math.round(total * coupon.discount / 100);
    } else {
      discountAmount = coupon.discount;
    }

    setDiscount({
      code: code.toUpperCase(),
      amount: discountAmount,
      finalTotal: total - discountAmount
    });

    if (onApply) onApply(discountAmount);
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="أدخل كود الخصم"
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #e8ecf1',
            borderRadius: '10px',
            fontSize: '0.95em',
            outline: 'none',
            textAlign: 'right'
          }}
        />
        <button
          onClick={handleApply}
          style={{
            padding: '12px 24px',
            background: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.95em'
          }}
        >
          تطبيق
        </button>
      </div>

      {error && (
        <p style={{ color: '#dc3545', fontSize: '0.85em', marginTop: '8px' }}>{error}</p>
      )}

      {discount && (
        <div style={{
          background: '#e8f5e9',
          padding: '12px',
          borderRadius: '8px',
          marginTop: '10px',
          color: '#28a745',
          fontWeight: '600'
        }}>
          ✅ تم تطبيق الخصم: {discount.amount} جنيه | الإجمالي الجديد: {discount.finalTotal} جنيه
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '0.85em', color: '#888' }}>
        <p style={{ fontWeight: '600', marginBottom: '5px' }}>كوبونات تجريبية:</p>
        <p>WELCOME20 - خصم 20% | SALE50 - خصم 50 جنيه | FIRST10 - خصم 10% | NEWUSER - خصم 30 جنيه</p>
      </div>
    </div>
  );
};

export default CouponInput;