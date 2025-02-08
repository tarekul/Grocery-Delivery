import "./cancel-order.styles.css";

const CancelOrder = () => {
  return (
    <div>
      <div className="cancel-order-instructions">
        <h3>Cancel Your Order</h3>
        <p>
          An order can only be cancelled up to <strong>5 minutes</strong> after
          it was placed.
        </p>
        <p>
          Please enter your <strong>Order ID</strong> to receive the
          confirmation code. You can find your Order ID in the order summary
          provided in the email after your order was placed.
        </p>
        <p>
          A confirmation code will be sent to the email address you used when
          placing the order.
        </p>
      </div>
      <div>
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Order ID" />
        <button class="cancel-order-button">Send Confirmation Code</button>
      </div>
      <div>
        <input type="text" placeholder="Confirmation Code" />
        <button class="cancel-order-button">Cancel Order</button>
      </div>
    </div>
  );
};

export default CancelOrder;
