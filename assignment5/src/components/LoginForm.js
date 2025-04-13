import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const backendEndpoint = "http://127.0.0.1:5000/login";

    try {
      // const response = await fetch(
      //   "https://jsonplaceholder.typicode.com/users"
      // );
      // const users = await response.json();
      const response = await fetch(backendEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();
      // const validUser = users.find(
      //   (u) => u.username === username && u.email === password
      // );

      // if (validUser) {
      if (data["success"]) {
        login(data["user"]);
        localStorage.setItem("studentID", data["user"]["id"])
        // Redirect after 2 seconds
        document.getElementById("loginMessage").textContent = data["message"];
        setTimeout(() => {
          navigate("/courses");
        }, 2000);
      } else {
        setError("Invalid username or password!");
      }
    } catch (err) {
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="username"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="password"
          style={{ display: "block", marginBottom: "5px" }}
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {error && (
        <div
          style={{
            color: "#D32F2F",
            backgroundColor: "#FFEBEE",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: isLoading ? "#BDBDBD" : "#004080",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Authenticating..." : "Login"}
      </button>
      <div id="loginMessage"></div>
    </form>
  );
};

export default LoginForm;
