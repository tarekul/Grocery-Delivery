const emailTemplate = (
  orderId,
  name,
  email,
  address,
  city,
  state,
  zipcode,
  items,
  total_price
) => {
  return `<p>Hello ${name},</p>
      <p>Thank you for your order!</p>
      <p>Here are the details of your order:</p>
      <p>Order ID: <strong>${orderId}</strong></p>
      <ul>
        <li>Email: ${email}</li>
        <li>Address: ${address}</li>
        <li>City: ${city}</li>
        <li>State: ${state}</li>
        <li>Zipcode: ${zipcode}</li>
      </ul>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background-color: #f8f8f8;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Quantity</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
            </tr>
        </thead>
        <tbody>
            ${items
              .map(
                (item) => `
                <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${
                  item.item.name
                }</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${
                  item.quantity
                }</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${(
                  parseFloat(item.item.price) * parseInt(item.quantity)
                ).toFixed(2)}</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
      </table>
      <p>Total Price: $${total_price}</p>
      <p>Thank you for your order!</p>
      <a href="https://grocery-go.netlify.app">View Order</a>`;
};

module.exports = emailTemplate;
