import { useState, useEffect } from 'react';

export default function EbayFeeCalculator() {
  const [theme, setTheme] = useState('light');
  const [itemPrice, setItemPrice] = useState('');
  const [buyerShipping, setBuyerShipping] = useState('');
  const [itemCost, setItemCost] = useState('');
  const [sellerShipping, setSellerShipping] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('default');
  const [storeType, setStoreType] = useState('none');
  const [includePayPal, setIncludePayPal] = useState(false);
  const [promotedFee, setPromotedFee] = useState('');
  const [results, setResults] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#202124' : '#fff';
    document.body.style.color = theme === 'dark' ? '#e8eaed' : '#202124';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Category-specific eBay fees
  const categoryFees = {
    default: 0.128, antiques: 0.12, art: 0.12, baby: 0.128, books_magazines: 0.10,
    business_industrial: 0.128, cameras_photo: 0.128, cellphones_accessories: 0.128,
    clothing_shoes_accessories: 0.11, coins_paper_money: 0.12, collectibles: 0.12,
    computers_tablets_networking: 0.128, consumer_electronics: 0.128, crafts: 0.128,
    dolls_bears: 0.128, entertainment_memorabilia: 0.12, gift_cards_coupons: 0.128,
    health_beauty: 0.128, home_garden: 0.128, jewelry_watches: 0.128, movies_tv: 0.10,
    music: 0.10, musical_instruments: 0.128, pet_supplies: 0.128, pottery_glass: 0.128,
    sporting_goods: 0.128, sports_mem_cards: 0.128, stamps: 0.128, toys_hobbies: 0.128,
    travel: 0.128, video_games_consoles: 0.128
  };

  const calculate = () => {
    const p = parseFloat(itemPrice);
    const bs = parseFloat(buyerShipping);
    const ic = parseFloat(itemCost) || 0;
    const ss = parseFloat(sellerShipping) || 0;
    const q = parseInt(quantity);
    const pf = parseFloat(promotedFee) || 0;

    if (isNaN(p) || isNaN(bs) || isNaN(q) || q < 1) {
      alert('Please enter valid numbers for price, shipping, and quantity');
      return;
    }

    const revenue = (p + bs) * q;

    // Dynamic category + store fee
    let baseFee = categoryFees[category] || 0.128;
    if (storeType === 'basic') baseFee -= 0.02;
    if (storeType === 'premium') baseFee -= 0.03;

    const ebayFee = revenue * baseFee + 0.30 * q;
    const paypalFee = includePayPal ? revenue * 0.029 + 0.30 * q : 0;
    const otherCosts = ic + ss + pf;
    const netProfit = revenue - (ebayFee + paypalFee + otherCosts);

    setResults({ revenue: revenue.toFixed(2), ebayFee: ebayFee.toFixed(2), paypalFee: paypalFee.toFixed(2), otherCosts: otherCosts.toFixed(2), netProfit: netProfit.toFixed(2) });
  };

  const reset = () => {
    setItemPrice(''); setBuyerShipping(''); setItemCost(''); setSellerShipping('');
    setQuantity(1); setCategory('default'); setStoreType('none'); setIncludePayPal(false);
    setPromotedFee(''); setResults(null);
  };

  return (
    <div style={containerStyle(theme)}>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button onClick={toggleTheme} style={themeToggleStyle(theme)}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</button>
      </div>
      <h1 style={headingStyle}>eBay Fee Calculator (UK)</h1>
      <p style={subheadingStyle(theme)}>Quickly estimate your fees and net profit for each sale.</p>

      <div style={{ marginBottom: '15px' }}><label>Item Price (£):</label><input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} style={inputStyle(theme)} /></div>
      <div style={{ marginBottom: '15px' }}><label>Buyer Paid Shipping (£):</label><input type="number" value={buyerShipping} onChange={(e) => setBuyerShipping(e.target.value)} style={inputStyle(theme)} /></div>
      <div style={{ marginBottom: '15px' }}><label>Item Cost (£):</label><input type="number" value={itemCost} onChange={(e) => setItemCost(e.target.value)} style={inputStyle(theme)} /></div>
      <div style={{ marginBottom: '15px' }}><label>Seller Paid Shipping (£):</label><input type="number" value={sellerShipping} onChange={(e) => setSellerShipping(e.target.value)} style={inputStyle(theme)} /></div>
      <div style={{ marginBottom: '15px' }}><label>Quantity:</label><input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} style={inputStyle(theme)} /></div>

      <button onClick={() => setShowAdvanced(!showAdvanced)} style={advancedToggleStyle}>{showAdvanced ? 'Hide Advanced Options ▲' : 'Show Advanced Options ▼'}</button>

      {showAdvanced && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>eBay Category:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle(theme)}>
              {Object.keys(categoryFees).map((cat) => (
                <option key={cat} value={cat}>{cat.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Store Subscription:</label>
            <select value={storeType} onChange={(e) => setStoreType(e.target.value)} style={inputStyle(theme)}>
              <option value="none">None</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label><input type="checkbox" checked={includePayPal} onChange={() => setIncludePayPal(!includePayPal)} />&nbsp;Include PayPal Fee (2.9% + £0.30)</label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Promoted Listings Fee (£):</label>
            <input type="number" value={promotedFee} onChange={(e) => setPromotedFee(e.target.value)} style={inputStyle(theme)} />
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={calculate} style={calcButtonStyle}>Calculate</button>
        <button onClick={reset} style={resetButtonStyle(theme)}>Reset</button>
      </div>

      {results && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Total Revenue:</strong> £{results.revenue}</p>
          <p><strong>eBay Fees:</strong> £{results.ebayFee}</p>
          <p><strong>PayPal Fees:</strong> £{results.paypalFee}</p>
          <p><strong>Other Costs:</strong> £{results.otherCosts}</p>
          <p><strong>Estimated Net Profit:</strong> £{results.netProfit}</p>
        </div>
      )}

      <p style={{ fontSize: '12px', marginTop: '30px', color: theme === 'dark' ? '#bdc1c6' : '#5f6368' }}>
        Note: Fees are approximate. eBay final value fee in the UK varies by category. PayPal fee is 2.9% + £0.30 per transaction.
      </p>
    </div>
  );
}

// Styles
const containerStyle = (theme) => ({
  maxWidth: '600px', margin: '60px auto', padding: '30px', borderRadius: '12px',
  backgroundColor: theme === 'dark' ? '#303134' : '#fff',
  boxShadow: theme === 'dark' ? '0 8px 20px rgba(0,0,0,0.7)' : '0 8px 20px rgba(0,0,0,0.1)',
  fontFamily: "'Inter', Arial, sans-serif", transition: 'all 0.3s ease'
});

const inputStyle = (theme) => ({
  width: '100%', boxSizing: 'border-box', padding: '10px', borderRadius: '6px',
  border: '1px solid #dadce0', backgroundColor: theme === 'dark' ? '#5f6368' : '#f5f5f5',
  color: theme === 'dark' ? '#e8eaed' : '#202124', fontSize: '16px', marginTop: '4px', marginBottom: '8px'
});

const headingStyle = { fontSize: '24px', marginBottom: '10px' };
const subheadingStyle = (theme) => ({ fontSize: '14px', marginBottom: '20px', color: theme === 'dark' ? '#bdc1c6' : '#5f6368' });
const themeToggleStyle = (theme) => ({ cursor: 'pointer', padding: '6px 12px', borderRadius: '20px', border: 'none', backgroundColor: theme === 'dark' ? '#5f6368' : '#e8eaed', color: theme === 'dark' ? '#e8eaed' : '#202124', fontWeight: 'bold', transition: 'all 0.3s ease' });
const advancedToggleStyle = { marginBottom: '15px', cursor: 'pointer', background: 'none', border: 'none', color: '#1a73e8', fontWeight: 'bold' };
const calcButtonStyle = { padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#1a73e8', color: '#fff', fontWeight: 'bold', marginRight: '10px', transition: 'background-color 0.3s ease' };
const resetButtonStyle = (theme) => ({ padding: '10px 20px', borderRadius: '6px', border: '1px solid #dadce0', backgroundColor: theme === 'dark' ? '#5f6368' : '#fff', color: theme === 'dark' ? '#e8eaed' : '#202124', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' });
