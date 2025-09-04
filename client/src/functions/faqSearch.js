import Fuse from "fuse.js";
import faqData from "./faqData";

const fuse = new Fuse(faqData, {
  keys: ["question", "answer"],
  threshold: 0.4,
});

export const searchFAQ = (query) => {
  const result = fuse.search(query);
  return result.length ? result[0].item.answer : null;
};
