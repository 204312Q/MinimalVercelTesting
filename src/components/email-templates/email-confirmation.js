import * as React from 'react';

// Full Payment Confirmation Component
export function FullPaymentConfirmationTemplate({
  date,
  confirmationNo,
  delivery,
  items,
  startType,
  startWith,
  subtotal,
  discount,
  tax,
  total,
}) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#222', maxWidth: '700px', margin: 'auto' }}>
      <img
        src="https://minimal-vercel-testing.vercel.app/logo/logo-single(2).png"
        alt="Chilli Padi Confinement Logo"
        style={{ height: '80px', width: 'auto', marginBottom: '16px' }}
      />

      <div style={{ marginBottom: '8px' }}>
        <div>
          Blk 3015 Bedok North Street 5 #04-19<br />
          Shimei East Kitchen<br />
          Singapore 486350
        </div>
        <div style={{ float: 'right', textAlign: 'right' }}>
          <div>Order Created on {date}</div>
          <div>Order ID : {confirmationNo}</div>
          <div>UEN: 200301089E</div>
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>

      <hr />

      <h3 style={{ marginBottom: '4px' }}>Delivery Details</h3>
      <div><strong>Name:</strong> {delivery.name}</div>
      <div><strong>Contact:</strong> {delivery.contact}</div>
      <div><strong>Address:</strong> {delivery.address}</div>

      <h3 style={{ marginTop: '24px', marginBottom: '4px' }}>Order Details</h3>
      <table width="100%" style={{ borderCollapse: 'collapse', marginBottom: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #222' }}>
            <th align="left">Quantity</th>
            <th align="left">Item</th>
            <th align="left">GST (Inclusive)</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.quantity} x</td>
              <td>
                <strong>{item.name}</strong><br />
                <span style={{ fontSize: '13px' }}>Date Selected: {item.dateSelected}</span>
              </td>
              <td>{item.gst}</td>
              <td>${item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginBottom: '12px' }}>
        <strong>Start Type:</strong> {startType || '-'}<br />
        <strong>Start With:</strong> {startWith || '-'}
      </div>

      <h3 style={{ marginBottom: '4px' }}>Payment Details</h3>
      <table width="100%" style={{ borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">${subtotal}</td>
          </tr>
          {discount && Number(discount) > 0 && (
            <tr>
              <td>Discount:</td>
              <td align="right" style={{ color: '#d32f2f' }}>-${discount}</td>
            </tr>
          )}
          <tr>
            <td>Total tax:</td>
            <td align="right">${tax}</td>
          </tr>
          <tr style={{ fontWeight: 'bold', borderTop: '2px solid #222' }}>
            <td>Total price:</td>
            <td align="right">${total}</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <div style={{ fontSize: '13px', marginTop: '12px' }}>
        If you have any questions, please send an email to{' '}
        <a href="mailto:confinement@chillipadi.com.sg">confinement@chillipadi.com.sg</a>
      </div>
    </div>
  );
}

// Partial Payment Confirmation Component
export function PartialPaymentConfirmationTemplate({
  date,
  confirmationNo,
  delivery,
  items,
  startType,
  startWith,
  subtotal,
  discount,
  tax,
  total,
  amountPaid,
  outstanding,
}) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#222', maxWidth: '700px', margin: 'auto' }}>
      <img
        src="https://minimal-vercel-testing.vercel.app/logo/logo-single(2).png"
        alt="Chilli Padi Confinement Logo"
        style={{ height: '80px', width: 'auto', marginBottom: '16px' }}
      />

      <div style={{ marginBottom: '8px' }}>
        <div>
          Blk 3015 Bedok North Street 5 #04-19<br />
          Shimei East Kitchen<br />
          Singapore 486350
        </div>
        <div style={{ float: 'right', textAlign: 'right' }}>
          <div>Order Created on {date}</div>
          <div>Order ID : {confirmationNo}</div>
          <div>UEN: 200301089E</div>
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>

      <hr />

      <h3 style={{ marginBottom: '4px' }}>Delivery Details</h3>
      <div><strong>Name:</strong> {delivery.name}</div>
      <div><strong>Contact:</strong> {delivery.contact}</div>
      <div><strong>Address:</strong> {delivery.address}</div>

      <h3 style={{ marginTop: '24px', marginBottom: '4px' }}>Order Details</h3>
      <table width="100%" style={{ borderCollapse: 'collapse', marginBottom: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #222' }}>
            <th align="left">Quantity</th>
            <th align="left">Item</th>
            <th align="left">GST (Inclusive)</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.quantity} x</td>
              <td>
                <strong>{item.name}</strong><br />
                <span style={{ fontSize: '13px' }}>Date Selected: {item.dateSelected}</span>
              </td>
              <td>{item.gst}</td>
              <td>${item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginBottom: '12px' }}>
        <strong>Start Type:</strong> {startType || '-'}<br />
        <strong>Start With:</strong> {startWith || '-'}
      </div>

      <h3 style={{ marginBottom: '4px' }}>Payment Details</h3>
      <table width="100%" style={{ borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">${subtotal}</td>
          </tr>
          {discount && Number(discount) > 0 && (
            <tr>
              <td>Discount:</td>
              <td align="right" style={{ color: '#d32f2f' }}>-${discount}</td>
            </tr>
          )}
          <tr>
            <td>Total tax:</td>
            <td align="right">${tax}</td>
          </tr>
          <tr>
            <td>Amount Paid (Deposit):</td>
            <td align="right">${amountPaid}</td>
          </tr>
          <tr style={{ color: '#d32f2f', fontWeight: 'bold' }}>
            <td>Outstanding Balance:</td>
            <td align="right">${outstanding}</td>
          </tr>
          <tr style={{ fontWeight: 'bold', borderTop: '2px solid #222' }}>
            <td>Total price:</td>
            <td align="right">${total}</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <div style={{ fontSize: '13px', marginTop: '12px' }}>
        If you have any questions, please send an email to{' '}
        <a href="mailto:confinement@chillipadi.com.sg">confinement@chillipadi.com.sg</a>
      </div>
    </div>
  );
}

// Simple Welcome Template (like your example)
export function EmailTemplate({ firstName }) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  );
}