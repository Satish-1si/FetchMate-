"use client";

import { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Button, TextField, Container, Typography } from "@mui/material";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 3 }}>
        Login
      </Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
          Login
        </Button>
      </form>
    </Container>
  );
}
