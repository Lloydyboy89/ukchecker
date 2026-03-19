import { useState, useEffect } from 'react';

export default function EbayFeeCalculator() {
  const [itemPrice, setItemPrice] = useState('');
  const [postage, setPostage] = useState('');
  const [totalFee, setTotalFee] = useState(null);
  const [profit, setProfit] = useState(null);
  const [theme, setTheme] = useState('light');

  // Persist theme across page reloads
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'dark' ? '#202124' : '#fff';
    document.body.style.color = theme === 'dark' ? '#e8eaed' : '#202124';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const calculateFees = () => {
    const price = parseFloat(itemPrice);
    const shipping = parseFloat(postage);

    if (isNaN(price) || isNaN(shipping)) {
      alert('Please enter valid numbers for price and postage');
      return;
    }

    const fee = (price + shipping) * 0.128 + 0.30;
    const netProfit = price + shipping - fee;

    setTotalFee(fee.toFixed(2));
    setProfit(netProfit.toFixed(2));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') calculateFees();
  };

  const reset = () => {
    setItemPrice('');
    setPostage('');
    setTotalFee(null);
    setProfit(null);
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '60px auto',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        borderRadius: '10px',
        boxShadow:
          theme === 'dark'
            ? '0 4px 12px rgba(0,0,0,0.7)'
            : '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: theme === 'dark' ? '#303134' : '#fff',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          onClick={toggleTheme}
          style={{
            cursor: 'pointer',
            padding: '6px 12px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: theme === 'dark' ? '#5f6368' : '#e8eaed',
            color: theme === 'dark' ? '#e8eaed' : '#202124',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>

      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
        eBay Fee Calculator (UK)
      </h1>
      <p style={{ fontSize: '14px', marginBottom: '20px', color: theme === 'dark' ? '#bdc1c6' : '#5f6368' }}>
        Quickly estimate your eBay fees and net profit before listing.
      </p>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Item Price (£):</label>
        <input
          type="number"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #dadce0',
            backgroundColor: theme === 'dark' ? '#5f6368' : '#fff',
            color: theme === 'dark' ? '#e8eaed' : '#202124',
            fontSize: '16px',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>Postage (£):</label>
        <input
          type="number"
          value={postage}
          onChange={(e) => setPostage(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #dadce0',
            backgroundColor: theme === 'dark' ? '#5f6368' : '#fff',
            color: theme === 'dark' ? '#e8eaed' : '#202124',
            fontSize: '16px',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={calculateFees}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#1a73e8',
            color: '#fff',
            fontWeight: 'bold',
            marginRight: '10px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#1558b0')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#1a73e8')}
        >
          Calculate
        </button>

        <button
          onClick={reset}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: '1px solid #dadce0',
            backgroundColor: theme === 'dark' ? '#5f6368' : '#fff',
            color: theme === 'dark' ? '#e8eaed' : '#202124',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = theme === 'dark' ? '#6e7074' : '#f1f3f4')}
          onMouseOut={(e) => (e.target.style.backgroundColor = theme === 'dark' ? '#5f6368' : '#fff')}
        >
          Reset
        </button>
      </div>

      {totalFee !== null && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Total eBay Fees:</strong> £{totalFee}</p>
          <p><strong>Estimated Net Profit:</strong> £{profit}</p>
        </div>
      )}

      <p style={{ fontSize: '12px', marginTop: '30px', color: theme === 'dark' ? '#bdc1c6' : '#5f6368' }}>
        Note: Fees are approximate. eBay final value fee in the UK is currently 12.8% + £0.30 per order.
      </p>
    </div>
  );
}