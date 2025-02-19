const Mailjet = require("node-mailjet");
const dotenv = require("dotenv");
const emailTemplate = require("./templates/emailTemplate");
dotenv.config();

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

const orderConfirmationEmail = async ({
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
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "grocerygo98@gmail.com",
            Name: "Grocery Go",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: "Order Confirmation",
          HTMLPart: emailTemplate(
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
        },
      ],
    });

    const result = await request;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = orderConfirmationEmail;
