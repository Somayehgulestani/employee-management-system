import React from "react";
import ReactDom from "react-dom/client";
import "./tailwind.css";
import App from "./empolyee.js";

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
