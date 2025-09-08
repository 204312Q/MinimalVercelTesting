const logoBase64 = "data:image/png;base64,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"; // Your actual base64 string

// Full Payment Confirmation Template
export function fullPaymentConfirmationTemplate({
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
  return `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 700px; margin: auto; margin-bottom: 24px; margin-top: 24px;">
      <img src="${logoBase64}" 
           alt="Chilli Padi Confinement Logo" 
           style="height: 80px; width: auto; margin-bottom: 16px;" />

      <div style="margin-bottom: 8px;">
        <div>
          Blk 3015 Bedok North Street 5 #04-19<br/>
          Shimei East Kitchen<br/>
          Singapore 486350
        </div>
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
      <table width="100%" style="border-collapse: collapse; margin-bottom: 12px;">
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
      <table width="100%" style="border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">$${subtotal}</td>
          </tr>
          ${discount && Number(discount) > 0 ? `
            <tr>
              <td>Discount:</td>
              <td align="right" style="color: #d32f2f;">-$${discount}</td>
            </tr>
          ` : ''}
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
        If you have any questions, please send an email to 
        <a href="mailto:confinement@chillipadi.com.sg">confinement@chillipadi.com.sg</a>
      </div>
    </div>
  `;
}

// Partial Payment Confirmation Template
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
            <img src="${logoBase64}" 
           alt="Chilli Padi Confinement Logo" 
           style="height: 80px; width: auto; margin-bottom: 16px;" />
      
      <div style="margin-bottom: 8px;">
        <div>
          Blk 3015 Bedok North Street 5 #04-19<br/>
          Shimei East Kitchen<br/>
          Singapore 486350
        </div>
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
      <table width="100%" style="border-collapse: collapse; margin-bottom: 12px;">
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
      <table width="100%" style="border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">$${subtotal}</td>
          </tr>
          ${discount && Number(discount) > 0 ? `
            <tr>
              <td>Discount:</td>
              <td align="right" style="color: #d32f2f;">-$${discount}</td>
            </tr>
          ` : ''}
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
        If you have any questions, please send an email to 
        <a href="mailto:confinement@chillipadi.com.sg">confinement@chillipadi.com.sg</a>
      </div>
    </div>
  `;
}