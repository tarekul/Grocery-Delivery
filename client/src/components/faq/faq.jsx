import "./faq.styles.css";

const FAQ = () => {
  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-item">
        <h3>What is the delivery area for your service?</h3>
        <p>
          We currently offer delivery to the following zip codes 11416, 11414,
          11418, 11419, 11421, 11208
        </p>
      </div>
      <div className="faq-item">
        <h3>Can I order from your service anytime?</h3>
        <p>
          Yes, you can order from our service at any time as long as a delivery
          driver is available.
        </p>
      </div>
      <div className="faq-item">
        <h3>What store does your service deliver from?</h3>
        <p>We deliver from Mannan supermarket located in Ozone Park.</p>
      </div>
      <div className="faq-item">
        <h3>Why are the checkout price estimated?</h3>
        <p>
          The checkout price is estimated based on the items in your cart.The
          actual price of items in store might vary. The delivery driver will
          confirm your order receipt before arrival.
        </p>
      </div>
      <div className="faq-item">
        <h3>How do I place an order?</h3>
        <p>
          Simply browse our inventory, add items to your cart, and check out.
        </p>
      </div>
      <div className="faq-item">
        <h3>Can I cancel my order?</h3>
        <p>
          Yes, you can cancel your order as long as it has not been more than 5
          minutes since your order was placed. Please visit the "Cancel Order"
          section on our website to initiate the cancellation.
        </p>
      </div>
      <div className="faq-item">
        <h3>What payment methods do you accept?</h3>
        <p>
          As of now we accept only cash on delivery payments. Feel free to pay
          driver in digital payments such as Zelle, Venmo on delivery. In the
          future we will be adding other payment options.
        </p>
      </div>
      <div className="faq-item">
        <h3>Are you affiliated with the store?</h3>
        <p>
          No, we are not affiliated with the store. We are a separate entity
          providing the delivery service.
        </p>
      </div>
      <div className="faq-item">
        <h3>How can I contact customer support?</h3>
        <p>
          You can reach our customer support team via email at{" "}
          <i>grocerygo98@gmail.com</i>.
        </p>
      </div>
      <div className="faq-item">
        <h3>What should I do if my order is late?</h3>
        <p>
          If your order is delayed, please call the delivery driver that is
          handling your order. The delivery driver info should be sent available
          in the email you used to place the order.
        </p>
      </div>
      <div className="faq-item">
        <h3>Can I cancel order if it is already in processing?</h3>
        <p>
          Yes, we offer cancellation of orders in processing. Please visit the
          "Cancel Order" section on our website to initiate the cancellation. If
          you need to cancel an order and it has been more than 5 minutes since
          your order was placed, please reach out via email to cancel the order
          or call assigned driver to cancel order.
        </p>
      </div>
      <div className="faq-item">
        <h3>Can I change my delivery address after placing an order?</h3>
        <p>
          No, currently we don't have that option. However feel free to call
          assigned delivery person to change the delivery address.
        </p>
      </div>
      <div className="faq-item">
        <h3>What if there are no shoppers available? Can I still place an order?</h3>
        <p>
          Yes you can still place an order. However, it will be processed when there
          is a shopper available.
        </p>
      </div>
    </div>
  );
};

export default FAQ;
