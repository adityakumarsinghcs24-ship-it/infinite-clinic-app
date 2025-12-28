import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import DoctorCard from "./DoctorCard";

/**
 * Renders a grid of DoctorCard components.
 * @param {object} props - Component props
 * @param {Array} props.consultations - Array of consultation objects to display
 */
const DoctorGrid = ({ consultations }) => {
  if (!consultations || consultations.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No doctors found matching your search.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {consultations.map((consultation) => (
        <Grid item key={consultation.id} xs={12} sm={6} md={4}>
          <DoctorCard consultation={consultation} />
        </Grid>
      ))}
    </Grid>
  );
};

export default DoctorGrid;
