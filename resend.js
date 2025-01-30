const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const orderConfirmationEmail = ({
  firstName,
  lastName,
  email,
  address,
  city,
  state,
  zipcode,
  items,
  totalPrice,
}) => {
  try {
    const name = `${firstName} ${lastName}`;
    const total_price = parseFloat(totalPrice);

    const resend = new Resend(process.env.RESEND_API_KEY);
    resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Order Confirmation",
      html: `<p>Hello ${name},</p>
      <p>Thank you for your order!</p>
      <p>Here are the details of your order:</p>
      <ul>
        <li>Name: ${name}</li>
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
      <p>Thank you for your order!</p>`,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = orderConfirmationEmail;
