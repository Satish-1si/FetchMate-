"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const MatchResult = () => {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId");
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchMatchedDog = async () => {
      if (!matchId) return;
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
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
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

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100%",
        padding: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        backdropFilter: "blur(8px)",
        transition: "background 0.5s ease-in-out",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{
          color: "#FFD700",
          textShadow: "3px 4px 10px rgba(106, 13, 103, 0.5)",
          textAlign: "center",
          marginBottom: 3,
        }}
      >
        🎉 Congratulations! Your Perfect Match!
      </Typography>

      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <Box sx={{ position: "absolute", top: 20, right: 20 }}>
        <IconButton color="error" href="/favorites">
          <FavoriteIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05, rotate: 2 }}
      >
        <Card
          sx={{
            width: 400,
            height: 600,
            margin: "auto",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0px 12px 35px rgba(0, 0, 0, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.25)",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            transition: "all 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0px 18px 40px rgba(0, 0, 0, 0.35)",
            },
          }}
        >
          <CardMedia
            component="img"
            height="320"
            image={dog.img || "/default-dog.jpg"}
            alt={dog.name}
            sx={{ objectFit: "cover", width: "100%" }}
          />
          <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
            <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
              {dog.name}
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary} sx={{ marginTop: 1 }}>
              <strong>🐶 Breed:</strong> {dog.breed}
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary}>
              <strong>📅 Age:</strong> {dog.age} years
            </Typography>
            <Typography variant="body1" color={theme.palette.text.secondary}>
              <strong>📍 Location:</strong> {dog.zip_code}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  );
};

export default MatchResult;
