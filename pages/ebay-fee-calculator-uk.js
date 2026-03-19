import { useState } from 'react';

export default function EbayFeeCalculator() {
  const [itemPrice, setItemPrice] = useState('');
  const [postage, setPostage] = useState('');
  const [totalFee, setTotalFee] = useState(null);
  const [profit, setProfit] = useState(null);

  const calculateFees = () => {
    const price = parseFloat(itemPrice);
    const shipping = parseFloat(postage);

    if (isNaN(price) || isNaN(shipping)) {
      alert('Please enter valid numbers for price and postage');
      return;
    }

    // eBay fees approx: 12.8% final value + £0.30 per order
    const fee = (price + shipping) * 0.128 + 0.30;
    const netProfit = price + shipping - fee;

    setTotalFee(fee.toFixed(2));
    setProfit(netProfit.toFixed(2));
  };

  const reset = () => {
    setItemPrice('');
    setPostage('');
    setTotalFee(null);
    setProfit(null);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>eBay Fee Calculator (UK)</h1>
      <p>Estimate your eBay fees and net profit for a sale in the UK.</p>

      <div style={{ marginBottom: '10px' }}>
        <label>Item Price (£): </label>
        <input
          type="number"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Postage (£): </label>
        <input
          type="number"
          value={postage}
          onChange={(e) => setPostage(e.target.value)}
        />
      </div>

      <button onClick={calculateFees} style={{ marginRight: '10px' }}>Calculate</button>
      <button onClick={reset}>Reset</button>

      {totalFee !== null && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Total eBay Fees:</strong> £{totalFee}</p>
          <p><strong>Estimated Net Profit:</strong> £{profit}</p>
        </div>
      )}

      <p style={{ fontSize: '12px', marginTop: '20px' }}>
        Note: Fees are approximate. eBay final value fee in the UK is currently 12.8% + £0.30 per order.
      </p>
    </div>
  );
}