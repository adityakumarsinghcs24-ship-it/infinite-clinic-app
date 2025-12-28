import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

/**
 * A single card component to display test information.
 * @param {object} props - Component props
 * @param {object} props.test - The test object { name, description, price }
 */
const TestCard = ({ test }) => {
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
          {test.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {test.description || "No description available."}
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
          ₹{test.price}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddShoppingCartIcon />}
          sx={{
            bgcolor: "#000",
            color: "#fff",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#333",
            },
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default TestCard;
