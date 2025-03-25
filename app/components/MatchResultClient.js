"use client"; // This marks the component as a client-side component

import React, { useEffect, useState } from "react";
import { CircularProgress, Box, Typography, Card, CardContent, CardMedia, IconButton, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Confetti from "react-confetti"; // Optional: For the confetti effect

const MatchResultClient = ({ matchId }) => {
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const theme = useTheme();

  // Handle dynamic window size for Confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchMatchedDog = async () => {
      try {
        const res = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([matchId]),
        });

        if (!res.ok) throw new Error("Failed to fetch matched dog");

        const data = await res.json();
        setDog(data[0]);
      } catch (error) {
        console.error("Error fetching matched dog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedDog();
  }, [matchId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!dog) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 5 }}>
        <Typography variant="h4" color="error">
          ❌ No match found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: theme.palette.background.default,
        padding: 2,
        position: "relative", // For the position of the favorite button
      }}
    >
      {/* Favorite Icon - Positioned Top Right */}
      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <IconButton color="error" href="/favorites">
          <FavoriteIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>

      {/* Congrats Message */}
      <Typography
        variant="h5"
        color={theme.palette.primary.main}
        fontWeight="bold"
        sx={{
          textShadow: "3px 4px 10px rgba(106, 13, 103, 0.5)",
          position: "absolute",
          top: 5,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Soft background for readability
          padding: "10px 20px",
          borderRadius: 5,
        }}
      >
        🎉 Congratulations! Your Perfect Match!
      </Typography>

      {/* Card for Dog Information */}
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          boxShadow: 10, // Subtle shadow for depth
          borderRadius: 3, // Rounded corners for a smoother look
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.15)",
          },
          position: "relative",
          marginTop: 10, // Spacing for congrats message
        }}
      >
        <CardMedia
          component="img"
          alt={dog.name}
          height="400"
          image={dog.img || "/default-dog.jpg"}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ textAlign: "center", paddingBottom: 4 }}>
          {/* Dog Information */}
          <Typography variant="h4" color={theme.palette.text.primary} fontWeight="bold">
            {dog.name}
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary} sx={{ marginTop: 1 }}>
            <strong>Breed:</strong> {dog.breed}
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary} sx={{ marginTop: 1 }}>
            <strong>Age:</strong> {dog.age} years
          </Typography>
          <Typography variant="body1" color={theme.palette.text.secondary} sx={{ marginTop: 1 }}>
            <strong>Location:</strong> {dog.zip_code}
          </Typography>
        </CardContent>
      </Card>

      {/* Confetti Celebration */}
      {windowSize.width && windowSize.height && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      {/* Optional Try Again Button */}
    
    </Box>
  );
};

export default MatchResultClient;
