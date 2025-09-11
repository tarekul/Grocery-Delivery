let apiUrl;

if (process.env.NODE_ENV === "development") {
  apiUrl = "http://localhost:5001"; // local dev server
} else {
  apiUrl = process.env.REACT_APP_API_URL; // production/staging env var
}

export default apiUrl;
