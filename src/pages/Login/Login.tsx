import React, { useState } from "react";
import { loginSuccess } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("datos", data);
        const { token } = data;

        localStorage.setItem("jwt", token);

        if (token) {
          dispatch(loginSuccess(token));
        } else {
          console.log("Login failed");
        }

        console.log("Login successful!");
      } else {
        console.log("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.cardContainer}>
        <h3>Iniciar Sesion</h3>
        <form style={styles.form} onSubmit={handleLogin}>
          <label style={styles.label}>
            Correo
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.button}>
            Iniciar Sesion
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    backgroundColor: "#FF5858",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    maxWidth: "578px", // Add max-width to limit card width
    width: "80%", // Set a default width
    padding: "20px", // Add padding for better spacing
  },
  label: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    margin: "10px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    marginTop: "20px",
  },
  input: {
    padding: "8px",
    fontSize: "16px",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    width: "100%", // Make the input width 100%
    maxWidth: "300px", // Limit the input width
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%", // Make the button width 100%
    maxWidth: "200px", // Limit the button width
    backgroundColor: "#FF5858",
    color: "#ffffff",
    marginTop: "20px",
    alignSelf: "center",
  },
};

// Media queries for responsiveness
const mediaQueries = {
  '@media (max-width: 768px)': {
    styles: {
      cardContainer: {
        width: '90%', // Adjust width for smaller screens
      },
    },
  },
};

const mergedStyles = {
  ...styles,
  ...mediaQueries.styles,
};

export default LoginPage;
