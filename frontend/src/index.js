import React from "react";
import ReactDOM from "react-dom/client";
import keycloak from "./keycloak";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const initOptions = {
  checkLoginIframe: false, // 👈 evita el error de 3p-cookies/step1.html
  pkceMethod: "S256",
  flow: "standard",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
    <App />
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
