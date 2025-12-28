import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import TestCard from "./TestCard";

/**
 * Renders a grid of TestCard components.
 * @param {object} props - Component props
 * @param {Array} props.tests - Array of test objects to display
 */
const TestGrid = ({ tests }) => {
  if (!tests || tests.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No tests found matching your search.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {tests.map((test) => (
        <Grid item key={test.id} xs={12} sm={6} md={4}>
          <TestCard test={test} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TestGrid;
