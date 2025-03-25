"use client"
import { Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";

export default function NotFoundPage() {
 

  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h1" sx={{ fontSize: 100, fontWeight: "bold", color: "#f44336" }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Oops! The page you're looking for doesn't exist.
        </Typography>
      
      </div>
    </Container>
  );
}
