import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DoctorGrid from "./DoctorGrid";
import AxiosInstance from "../Axios"; // Using your custom Axios instance

const DoctorsPage = () => {
  const [allConsultations, setAllConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultations from the API on component mount
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        // Using the /consultations/ endpoint as per your urls.py
        const response = await AxiosInstance.get("/consultations/");
        setAllConsultations(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch consultations:", err);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  // Memoized filtering of doctors based on search term
  const filteredConsultations = useMemo(() => {
    return allConsultations.filter(
      (consultation) =>
        consultation.docname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.specialization
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [allConsultations, searchTerm]);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Page Title */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Our Doctors
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or specialization..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Content Area */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", my: 5 }}>
          {error}
        </Typography>
      ) : (
        <DoctorGrid consultations={filteredConsultations} />
      )}
    </Container>
  );
};

export default DoctorsPage;
