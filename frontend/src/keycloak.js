import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "CetiaGlassesRealm",
  clientId: "moviedux-react",
});

export default keycloak;
