export function fullPaymentConfirmationTemplate({
  date,
  confirmationNo,
  delivery,
  items,
  startType, // <-- added
  startWith, // <-- added
  subtotal,
  discount,
  tax,
  total,
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 700px; margin: auto;">
    <img src="https://minimal-vercel-testing.vercel.app/logo/logo-full.png" alt="Chilli Padi Confinement Logo" style="height: 48px; margin-bottom: 16px;" />
      <div style="margin-bottom: 8px;">
        <div>Blk 3015 Bedok North Street 5 #04-19<br/>Shimei East Kitchen<br/>Singapore 486350</div>
        <div style="float: right; text-align: right;">
          <div>Order Created on ${date}</div>
          <div>Order ID : ${confirmationNo}</div>
          <div>UEN: 200301089E</div>
        </div>
        <div style="clear: both;"></div>
      </div>
      <hr />

      <h3 style="margin-bottom: 4px;">Delivery Details</h3>
      <div><strong>Name:</strong> ${delivery.name}</div>
      <div><strong>Contact:</strong> ${delivery.contact}</div>
      <div><strong>Address:</strong> ${delivery.address}</div>

      <h3 style="margin-top: 24px; margin-bottom: 4px;">Order Details</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="6" style="border-collapse: collapse; margin-bottom: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid #222;">
            <th align="left">Quantity</th>
            <th align="left">Item</th>
            <th align="left">GST (Inclusive)</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.quantity} x</td>
              <td>
                <strong>${item.name}</strong><br/>
                <span style="font-size: 13px;">Date Selected: ${item.dateSelected}</span>
              </td>
              <td>${item.gst}</td>
              <td>$${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-bottom: 12px;">
        <strong>Start Type:</strong> ${startType || '-'}<br/>
        <strong>Start With:</strong> ${startWith || '-'}
      </div>

      <h3 style="margin-bottom: 4px;">Payment Details</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="6" style="border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">$${subtotal}</td>
          </tr>
          ${discount && Number(discount) > 0
      ? `<tr>
                  <td>Discount:</td>
                  <td align="right" style="color: #d32f2f;">-$${discount}</td>
                </tr>`
      : ''
    }
          <tr>
            <td>Total tax:</td>
            <td align="right">$${tax}</td>
          </tr>
          <tr style="font-weight: bold; border-top: 2px solid #222;">
            <td>Total price:</td>
            <td align="right">$${total}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div style="font-size: 13px; margin-top: 12px;">
        If you have any questions, please send an email to <a href="mailto:confinement@chillipadi.com.sg">confinement@chillipadi.com.sg</a>
      </div>
    </div>
  `;
}

export function partialPaymentTemplate({
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
  return `
      <div style="font-family: Arial, sans-serif; color: #222; max-width: 700px; margin: auto;">
      <img src="https://minimal-vercel-testing.vercel.app/logo/logo-full.png" alt="Chilli Padi Confinement Logo" style="height: 48px; margin-bottom: 16px;" />
      <div style="margin-bottom: 8px;">
        <div>Blk 3015 Bedok North Street 5 #04-19<br/>Shimei East Kitchen<br/>Singapore 486350</div>
        <div style="float: right; text-align: right;">
          <div>Order Created on ${date}</div>
          <div>Order ID : ${confirmationNo}</div>
          <div>UEN: 200301089E</div>
        </div>
        <div style="clear: both;"></div>
      </div>
      <hr />

      <h3 style="margin-bottom: 4px;">Delivery Details</h3>
      <div><strong>Name:</strong> ${delivery.name}</div>
      <div><strong>Contact:</strong> ${delivery.contact}</div>
      <div><strong>Address:</strong> ${delivery.address}</div>

      <h3 style="margin-top: 24px; margin-bottom: 4px;">Order Details</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="6" style="border-collapse: collapse; margin-bottom: 12px;">
        <thead>
          <tr style="border-bottom: 1px solid #222;">
            <th align="left">Quantity</th>
            <th align="left">Item</th>
            <th align="left">GST (Inclusive)</th>
            <th align="left">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.quantity} x</td>
              <td>
                <strong>${item.name}</strong><br/>
                <span style="font-size: 13px;">Date Selected: ${item.dateSelected}</span>
              </td>
              <td>${item.gst}</td>
              <td>$${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-bottom: 12px;">
        <strong>Start Type:</strong> ${startType || '-'}<br/>
        <strong>Start With:</strong> ${startWith || '-'}
      </div>

      <h3 style="margin-bottom: 4px;">Payment Details</h3>
      <table width="100%" border="0" cellspacing="0" cellpadding="6" style="border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">$${subtotal}</td>
          </tr>
          ${discount && Number(discount) > 0
      ? `<tr>
                  <td>Discount:</td>
                  <td align="right" style="color: #d32f2f;">-$${discount}</td>
                </tr>`
      : ''
    }
          <tr>
            <td>Total tax:</td>
            <td align="right">$${tax}</td>
          </tr>
          <tr>
            <td>Amount Paid (Deposit):</td>
            <td align="right">$${amountPaid}</td>
          </tr>
          <tr style="color: #d32f2f; font-weight: bold;">
            <td>Outstanding Balance:</td>
            <td align="right">$${outstanding}</td>
          </tr>
          <tr style="font-weight: bold; border-top: 2px solid #222;">
            <td>Total price:</td>
            <td align="right">$${total}</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div style="font-size: 13px; margin-top: 12px;">
        If you have any questions, please send an email to <a href="mailto:confinement@chillipadi.com.sg">confinement@chillipadi.com.sg</a>
      </div>
    </div>
  `;
}