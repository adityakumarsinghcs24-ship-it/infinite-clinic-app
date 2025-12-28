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
import TestGrid from "./TestGrid";
import AxiosInstance from "../Axios"; // Using your custom Axios instance

const TestsPage = () => {
  const [allTests, setAllTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tests from the API on component mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        // Using the /tests/ endpoint as per your urls.py
        const response = await AxiosInstance.get("/tests/");
        setAllTests(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch tests:", err);
        setError("Failed to load tests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Memoized filtering of tests based on search term
  const filteredTests = useMemo(() => {
    return allTests.filter((test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTests, searchTerm]);

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
        Available Tests
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a test..."
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
        <TestGrid tests={filteredTests} />
      )}
    </Container>
  );
};

export default TestsPage;
