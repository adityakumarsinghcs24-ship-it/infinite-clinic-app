import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

/**
 * A single card component to display doctor/consultation information.
 * @param {object} props - Component props
 * @param {object} props.consultation - The consultation object { docname, specialization, price }
 */
const DoctorCard = ({ consultation }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Dr. {consultation.docname}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {consultation.specialization || "General Practitioner"}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Typography
          variant="h6"
          component="p"
          sx={{ fontWeight: "bold", color: "#000" }}
        >
          ₹{consultation.price}
        </Typography>
        <Button
          variant="contained"
          startIcon={<BookOnlineIcon />}
          sx={{
            bgcolor: "#000",
            color: "#fff",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#333",
            },
          }}
        >
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default DoctorCard;
