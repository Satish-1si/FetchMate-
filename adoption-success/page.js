import { Typography, Box, Container, Paper, Button } from "@mui/material";
import { useRouter } from "next/router";

const AdoptionSuccess = () => {
  const router = useRouter();
  
  // Retrieve the adopted dog data from localStorage or router
  const adoptedDog = JSON.parse(localStorage.getItem("adoptedDog"));

  const handleGoHome = () => {
    router.push("/"); // Navigate to the homepage or other desired page
  };

  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Paper sx={{ padding: 4, width: "100%", textAlign: "center", borderRadius: 3, boxShadow: 3, backgroundColor: "#f7f7f7" }}>
        <Typography variant="h3" color="primary" gutterBottom>
          Adoption Successful! 🎉
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ marginBottom: 3 }}>
          Thank you for adopting a dog! You made a wonderful choice!
        </Typography>

        <Box sx={{ marginBottom: 3 }}>
          <img src={adoptedDog.img || "/placeholder.jpg"} alt="Happy dog" width="200" style={{ borderRadius: "8px", objectFit: "cover" }} />
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: 3 }}>
          Your new furry friend is lucky to have you. Start your journey together with lots of love and fun!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ borderRadius: 20, textTransform: "none" }}
          onClick={handleGoHome}
        >
          Go to Home Page
        </Button>
      </Paper>
    </Container>
  );
};

export default AdoptionSuccess;
