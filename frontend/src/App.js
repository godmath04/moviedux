import "./App.css";
import "./styles.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MoviesGrid from "./components/MoviesGrid";
import Watchlist from "./components/Watchlist";
import AddMovie from "./components/AddMovie";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

import { useKeycloak } from "@react-keycloak/web";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const { keycloak, initialized } = useKeycloak();
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const isAdmin =
    keycloak.tokenParsed?.realm_access?.roles?.includes("Administrador");
  const isUser = keycloak.tokenParsed?.realm_access?.roles?.includes("Usuario");

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => {
        console.error("Error al cargar películas desde el backend:", error);
      });
  }, []);

  if (!initialized) return <p>Cargando autenticación...</p>;

  const toggleWatchlist = (movieId) => {
    setWatchlist((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  return (
    <div className="App">
      <div className="container">
        <Header />

        <div className="user-info">
          {!keycloak.authenticated ? (
            <button onClick={() => keycloak.login()}>Iniciar sesión</button>
          ) : (
            <>
              <p>Bienvenido, {keycloak.tokenParsed?.preferred_username}</p>
              <button onClick={() => keycloak.logout()}>Cerrar sesión</button>
            </>
          )}
        </div>

        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              {isUser && (
                <li>
                  <Link to="/watchlist">Watchlist</Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link to="/admin/add">Añadir Película</Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link to="/admin/create-user">Crear Usuario</Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link to="/admin/users">Ver Usuarios</Link>
                </li>
              )}
            </ul>
          </nav>

          <Routes>
            <Route
              path="/"
              element={
                <>
                  {!keycloak.authenticated && (
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: "1.2rem",
                        marginTop: "1rem",
                      }}
                    >
                      Inicia sesión para acceder a las películas y a tu
                      watchlist 🎬
                    </p>
                  )}

                  {keycloak.authenticated && (
                    <MoviesGrid
                      watchlist={watchlist}
                      movies={movies}
                      toggleWatchlist={toggleWatchlist}
                    />
                  )}
                </>
              }
            />

            <Route
              path="/watchlist"
              element={
                isUser ? (
                  <Watchlist
                    watchlist={watchlist}
                    movies={movies}
                    toggleWatchlist={toggleWatchlist}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/admin/add"
              element={
                isAdmin ? (
                  <AddMovie onMovieAdded={() => (window.location.href = "/")} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/admin/create-user"
              element={
                isAdmin ? (
                  <UserForm token={keycloak.token} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/admin/users"
              element={
                isAdmin ? (
                  <UserList token={keycloak.token} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </Router>

        <Footer />
      </div>
    </div>
  );
}

export default App;
