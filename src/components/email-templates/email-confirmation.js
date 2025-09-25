// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: 'dpa9be0aj',
  folder: '', // No folder needed since your image is at root
  version: 'v1758793213'
};

// Generate Cloudinary URL - FIXED VERSION
const getCloudinaryImageUrl = (publicId, options = {}) => {
  const {
    width = 160,
    height = 80,
    format = 'png', // Changed from 'auto' to 'png'
    quality = '80',
    crop = 'scale'
  } = options;

  // Correct URL structure: version comes right after /upload/
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${CLOUDINARY_CONFIG.version}/w_${width},h_${height},c_${crop},f_${format},q_${quality}/${publicId}`;
};

// Logo URL with optimizations for email
const logoUrl = getCloudinaryImageUrl('logo-single_gcztpt', {
  width: 160,
  height: 80,
  format: 'png',
  quality: '80'
});

// Full Payment Confirmation Template
export function fullPaymentConfirmationTemplate(order) {
  const {
    id: confirmationNo,
    createdAt,
    serviceDate,
    inputType,
    session,
    lineItems = [],
    requests = [],
    note,
    pricing = {},
    delivery = {},
    customer = {}
  } = order;

  // Format date
  const orderDate = new Date(createdAt).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Build items array from lineItems
  const items = lineItems.map(item => ({
    quantity: item.quantity,
    name: `${item.productName}${item.option?.value ? ` - ${item.option.value}` : ''}`,
    dateSelected: serviceDate,
    gst: `$${(item.lineTotal * 0.09 / 1.09).toFixed(2)}`, // 9% GST inclusive
    price: item.lineTotal.toFixed(2)
  }));

  // Format special requests
  const specialRequests = [];
  if (requests?.length > 0) {
    specialRequests.push(...requests.map(req => req.code || req.value));
  }
  if (note?.trim()) {
    specialRequests.push(note.trim());
  }

  // Build delivery address
  const deliveryAddress = `${delivery.addressLine || ''}${delivery.floor ? `, #${delivery.floor}` : ''}${delivery.unit ? `-${delivery.unit}` : ''}, Singapore ${delivery.postalCode || ''}`.trim();

  return `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 700px; margin: auto; margin-bottom: 24px; margin-top: 24px;">
      <img src="${logoUrl}" 
           alt="Chilli Padi Confinement Logo" 
           style="height: 80px; width: auto; margin-bottom: 16px; display: block;"
           width="160" 
           height="80" />

      <div style="margin-bottom: 8px;">
        <div>
          Blk 3015 Bedok North Street 5 #04-19 <br/>
          Shimei East Kitchen <br/>
          Singapore 486350
        </div>
        <div style="float: right; text-align: right;">
          <div>Order Created on ${orderDate}</div>
          <div>Order ID : ${confirmationNo}</div>
          <div>UEN: 200301089E</div>
        </div>
        <div style="clear: both;"></div>
      </div>
      
      <hr />

      <h3 style="margin-bottom: 4px;">Delivery Details</h3>
      <div><strong>Name:</strong> ${delivery.fullName || customer.name || ''}</div>
      <div><strong>Contact:</strong> ${delivery.phone || customer.phone || ''}</div>
      <div><strong>Email:</strong> ${delivery.email || customer.email || ''}</div>
      <div><strong>Address:</strong> ${deliveryAddress}</div>

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
                <strong>${item.name}</strong> <br/>
                <span style="font-size: 13px;">Date Selected: ${item.dateSelected}</span>
              </td>
              <td>${item.gst}</td>
              <td>$${item.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-bottom: 12px;">
        <strong>Service Type:</strong> ${inputType === 'EDD' ? 'Expected Delivery Date' : 'Confirmed Start Date'}<br/>
        <strong>Session:</strong> ${session ? session.charAt(0).toUpperCase() + session.slice(1).toLowerCase() : 'All Day'}
        ${specialRequests.length > 0 ? `<br/><strong>Special Requests:</strong> ${specialRequests.join('; ')}` : ''}
      </div>

      <h3 style="margin-bottom: 4px;">Payment Details</h3>
      <table width="100%" style="border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">$${(pricing.subtotal || 0).toFixed(2)}</td>
          </tr>
          ${pricing.discounts?.length > 0 ? pricing.discounts.map(discount => `
            <tr>
              <td>Discount (${discount.code}):</td>
              <td align="right" style="color: #d32f2f;">-$${discount.amount.toFixed(2)}</td>
            </tr>
          `).join('') : ''}
          <tr>
            <td>Total tax (GST 9% inclusive):</td>
            <td align="right">$${((pricing.total || 0) * 0.09 / 1.09).toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; border-top: 2px solid #222;">
            <td>Total price:</td>
            <td align="right">$${(pricing.total || 0).toFixed(2)}</td>
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
export function partialPaymentTemplate(order) {
  const {
    id: confirmationNo,
    createdAt,
    serviceDate,
    inputType,
    session,
    lineItems = [],
    requests = [],
    note,
    pricing = {},
    delivery = {},
    customer = {}
  } = order;

  // Format date
  const orderDate = new Date(createdAt).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Build items array from lineItems
  const items = lineItems.map(item => ({
    quantity: item.quantity,
    name: `${item.productName}${item.option?.value ? ` - ${item.option.value}` : ''}`,
    dateSelected: serviceDate,
    gst: `$${(item.lineTotal * 0.09 / 1.09).toFixed(2)}`, // 9% GST inclusive
    price: item.lineTotal.toFixed(2)
  }));

  // Format special requests
  const specialRequests = [];
  if (requests?.length > 0) {
    specialRequests.push(...requests.map(req => req.code || req.value));
  }
  if (note?.trim()) {
    specialRequests.push(note.trim());
  }

  // Build delivery address
  const deliveryAddress = `${delivery.addressLine || ''}${delivery.floor ? `, #${delivery.floor}` : ''}${delivery.unit ? `-${delivery.unit}` : ''}, Singapore ${delivery.postalCode || ''}`.trim();

  return `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 700px; margin: auto;">
      <img src="${logoUrl}" 
           alt="Chilli Padi Confinement Logo" 
           style="height: 80px; width: auto; margin-bottom: 16px; display: block;"
           width="160" 
           height="80" />
      
      <div style="margin-bottom: 8px;">
        <div>
          Blk 3015 Bedok North Street 5 #04-19<br/>
          Shimei East Kitchen<br/>
          Singapore 486350
        </div>
        <div style="float: right; text-align: right;">
          <div>Order Created on ${orderDate}</div>
          <div>Order ID : ${confirmationNo}</div>
          <div>UEN: 200301089E</div>
        </div>
        <div style="clear: both;"></div>
      </div>
      
      <hr />

      <h3 style="margin-bottom: 4px;">Delivery Details</h3>
      <div><strong>Name:</strong> ${delivery.fullName || customer.name || ''}</div>
      <div><strong>Contact:</strong> ${delivery.phone || customer.phone || ''}</div>
      <div><strong>Email:</strong> ${delivery.email || customer.email || ''}</div>
      <div><strong>Address:</strong> ${deliveryAddress}</div>

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
        <strong>Service Type:</strong> ${inputType === 'EDD' ? 'Expected Delivery Date' : 'Confirmed Start Date'}<br/>
        <strong>Session:</strong> ${session ? session.charAt(0).toUpperCase() + session.slice(1).toLowerCase() : 'All Day'}
        ${specialRequests.length > 0 ? `<br/><strong>Special Requests:</strong> ${specialRequests.join('; ')}` : ''}
      </div>

      <h3 style="margin-bottom: 4px;">Payment Details</h3>
      <table width="100%" style="border-collapse: collapse;">
        <tbody>
          <tr>
            <td>Subtotal price:</td>
            <td align="right">$${(pricing.subtotal || 0).toFixed(2)}</td>
          </tr>
          ${pricing.discounts?.length > 0 ? pricing.discounts.map(discount => `
            <tr>
              <td>Discount (${discount.code}):</td>
              <td align="right" style="color: #d32f2f;">-$${discount.amount.toFixed(2)}</td>
            </tr>
          `).join('') : ''}
          <tr>
            <td>Total tax (GST 9% inclusive):</td>
            <td align="right">$${((pricing.total || 0) * 0.09 / 1.09).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Amount Paid (Deposit):</td>
            <td align="right">$${(pricing.paid || 0).toFixed(2)}</td>
          </tr>
          <tr style="color: #d32f2f; font-weight: bold;">
            <td>Outstanding Balance:</td>
            <td align="right">$${(pricing.remaining || 0).toFixed(2)}</td>
          </tr>
          <tr style="font-weight: bold; border-top: 2px solid #222;">
            <td>Total price:</td>
            <td align="right">$${(pricing.total || 0).toFixed(2)}</td>
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