import faqData from "../../functions/faqData";
import "./faq.styles.css";

const FAQ = () => {
  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>
      {faqData.map((item, index) => (
        <div className="faq-item" key={index}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
