const { Resend } = require("resend");
const dotenv = require("dotenv");

const emailTemplate = require("./templates/emailTemplate");

dotenv.config();

const orderConfirmationEmail = ({
  orderId,
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
      html: emailTemplate(
        orderId,
        name,
        email,
        address,
        city,
        state,
        zipcode,
        items,
        total_price
      ),
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = orderConfirmationEmail;
