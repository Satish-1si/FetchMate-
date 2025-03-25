"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Drawer,
  IconButton,
  LinearProgress, // Import LinearProgress component
  TextField,
  Pagination,
  Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import ClearIcon from "@mui/icons-material/Clear"; // Import the Clear icon
import DogCard from "../components/DogCard";

export default function SearchPage() {
  const [dogs, setDogs] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Search term for dog name
  const [age, setAge] = useState(""); // Age filter
  const [zipCode, setZipCode] = useState(""); // Zip code filter
  const [latitude, setLatitude] = useState(""); // Latitude filter
  const [longitude, setLongitude] = useState(""); // Longitude filter
  const [city, setCity] = useState(""); // City filter
  const [state, setState] = useState(""); // State filter
  const [county, setCounty] = useState(""); // County filter
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1); // Pagination state
  const [total, setTotal] = useState(0); // Total dogs count
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error handling state
  const [sortOption, setSortOption] = useState(""); // Sorting state

  const router = useRouter();

  // Fetch Breeds on Mount
  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true); // Set loading to true while fetching breeds
      setError(""); // Clear previous error
      try {
        const res = await fetch("https://frontend-take-home-service.fetch.com/dogs/breeds", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch breeds.");
        const breedsData = await res.json();
        setBreeds(breedsData);
      } catch (err) {
        console.error("Breed fetch error:", err);
        setError("Failed to load dog breeds. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false once fetching breeds is done
      }
    };
    fetchBreeds();
  }, []);

  // Fetch Dogs with Applied Filters
  const fetchDogs = async () => {
    setLoading(true);
    setError("");
  
    try {
      let queryParams = new URLSearchParams();
  
      // Apply filters only if they have a value
      if (selectedBreed) queryParams.append("breeds", selectedBreed);
      if (zipCode) queryParams.append("zipCodes", zipCode);
      if (latitude) queryParams.append("latitude", latitude);
      if (longitude) queryParams.append("longitude", longitude);
      if (city) queryParams.append("city", city);
      if (state) queryParams.append("state", state);
      if (county) queryParams.append("county", county);
  
      const size = 10; // Number of items per page
      const from = (page - 1) * size; // Calculate offset
  
      queryParams.append("size", size);
      queryParams.append("from", from);
  
      if (sortOption) queryParams.append("sort", sortOption);
  
      // Fetch matching dog IDs
      const res = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`,
        { credentials: "include" }
      );
  
      if (!res.ok) throw new Error("Failed to fetch dogs.");
  
      const { resultIds, total } = await res.json();
      setTotal(total); // Use API-provided total count
  
      if (!resultIds || resultIds.length === 0) {
        setDogs([]);
        return;
      }
  
      // Fetch dog details using the result IDs
      const dogDetailsRes = await fetch("https://frontend-take-home-service.fetch.com/dogs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultIds),
      });
  
      if (!dogDetailsRes.ok) throw new Error("Failed to fetch dog details.");
  
      let dogDetails = await dogDetailsRes.json();
  
      // Apply frontend filtering only on name and age
      if (searchTerm) {
        dogDetails = dogDetails.filter((dog) =>
          dog.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
  
      if (age) {
        dogDetails = dogDetails.filter((dog) => dog.age == age);
      }
  
      setDogs(dogDetails);
    } catch (err) {
      console.error("Error fetching dogs:", err);
      setError("Failed to load dogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchDogs();
  }, [selectedBreed, searchTerm, age, zipCode, latitude, longitude, city, state, county, page, sortOption]);

  // Load Favorites from localStorage on Mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Toggle Favorites and Store in localStorage
  const toggleFavorite = (dog) => {
    const updatedFavorites = favorites.includes(dog.id)
      ? favorites.filter((id) => id !== dog.id)
      : [...favorites, dog.id];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Save to localStorage
  };

  // Page navigation handlers
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Reset Filters handler
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBreed("");
    setAge("");
    setZipCode("");
    setLatitude("");
    setLongitude("");
    setCity("");
    setState("");
    setCounty("");
    setSortOption(""); // Reset sorting option
    setPage(1); // Reset page to 1 on filter reset
  };

  const pageCount = Math.ceil(total / 10); // Calculate the total number of pages

  // Logout handler
  const handleLogout = () => {
    fetch("https://frontend-take-home-service.fetch.com/logout", {
      credentials: "include",
    }).then(() => {
      router.push("/"); // Redirect to login page after logout
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
  {/* Title & Controls */}
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
    <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4caf50" }}>🐾 Find Your Perfect Dog</Typography>

    {/* View Mode Toggle & Favorites */}
    <Box>
      <IconButton onClick={() => setFilterOpen(true)} color="secondary">
        <ViewListIcon /> 
      </IconButton>
      <IconButton onClick={() => router.push("/favorites")} color="secondary">
        ❤️
      </IconButton>
      <Button onClick={handleLogout} color="error">Logout</Button>
    </Box>
  </Box>

  {/* Error Handling */}
  {error && (
    <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
      <Typography variant="h6" color="error">{error}</Typography>
    </Box>
  )}

  {/* Loading Indicator */}
  {loading && (
    <Box sx={{ width: "100%", mt: 1 }}>
      <LinearProgress />
    </Box>
  )}

  {/* No Data Found Message */}
  {!loading && dogs.length === 0 && !error && (
    <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
      <Typography variant="h6">No dogs found. Please try adjusting your filters.</Typography>
    </Box>
  )}

  {/* Pagination Controls */}
  {!loading && dogs.length > 0 && (
    <Box display="flex" justifyContent="right" sx={{ mt: 3 }}>
      <Pagination
        count={pageCount}
        page={page}
        onChange={handlePageChange}
        siblingCount={1}
        boundaryCount={1}
        color="primary"
      />
    </Box>
  )}

  {/* Sidebar for Filters */}
  <Drawer anchor="left" open={filterOpen} onClose={() => setFilterOpen(false)}>
    <Box sx={{ width: 300, p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={resetFilters} color="error">
          <ClearIcon />
        </IconButton>
      </Box>
      
      {/* Search & Filters Section */}
      <Box mt={2}>
        <TextField
          label="Search by Name"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ my: 2 }}
        />

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Filter by Breed</InputLabel>
          <Select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
            <MenuItem value="">All Breeds</MenuItem>
            {breeds.map((breed) => (
              <MenuItem key={breed} value={breed}>{breed}</MenuItem>
            ))}
          </Select>
        </FormControl>

           
        <Box display="flex" flexDirection="column" sx={{ my: 2 }}>
          <TextField
            label="Zip Code"
            fullWidth
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
                {/* Sorting Filter */}
                <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Filter By</InputLabel>
          <Select value={sortOption} label="Filter By" onChange={(e) => setSortOption(e.target.value)}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="name:asc">Name (A-Z)</MenuItem>
            <MenuItem value="name:desc">Name (Z-A)</MenuItem>
            <MenuItem value="age:asc">Age (Ascending)</MenuItem>
            <MenuItem value="age:desc">Age (Descending)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Age"
          fullWidth
          value={age}
          onChange={(e) => setAge(e.target.value)}
          sx={{ my: 2 }}
        />
     
          {/* <TextField
            label="Latitude"
            fullWidth
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            label="Longitude"
            fullWidth
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            sx={{ mt: 1 }}
          /> */}
        </Box>

        {/* <Box display="flex" flexDirection="column" sx={{ my: 2 }}>
          <TextField
            label="City"
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            label="State"
            fullWidth
            value={state}
            onChange={(e) => setState(e.target.value)}
            sx={{ mt: 1 }}
          />
          <TextField
            label="County"
            fullWidth
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            sx={{ mt: 1 }}
          />
        </Box> */}


      </Box>
    </Box>
  </Drawer>

  {/* Dog List */}
  <Grid container spacing={3} sx={{ mt: 3 }}>
    {dogs.map((dog) => (
      <Grid item key={dog.id} xs={viewMode === "grid" ? 12 : 6} sm={6} md={4}>
        <DogCard dog={dog} isFavorite={favorites.includes(dog.id)} onFavoriteToggle={toggleFavorite} />
      </Grid>
    ))}
  </Grid>

  
</Container>

  );
}
