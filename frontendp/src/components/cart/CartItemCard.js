import React from "react";
import {
  Typography,
  IconButton,
  Box,
  Paper,
  Grid,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ScienceIcon from "@mui/icons-material/Science"; // Icon for Tests
import PersonIcon from "@mui/icons-material/Person"; // Icon for Consults

/**
 * Displays a single aggregated item in the cart.
 * @param {object} props - Component props
 * @param {object} props.item - The aggregated cart item object
 * @param {function} props.onRemove - Callback to remove all instances of this item
 */
const CartItemCard = ({ item, onRemove }) => {
  const itemDetail = item.item_type === "consult" ? item.consult : item.test;
  const itemPrice = itemDetail ? parseFloat(itemDetail.price) : 0;
  const subtotal = itemPrice * item.quantity;

  if (!itemDetail) {
    return (
      <Paper
        sx={{
          mb: 2,
          p: 2,
          border: "1px solid #e0e0e0",
          boxShadow: "none",
          borderRadius: 2,
        }}
      >
        <Typography color="error">Invalid item in cart.</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        boxShadow: "none",
        "&:last-child": { mb: 0 },
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        {/* Image/Icon */}
        <Grid item>
          <Avatar
            sx={{
              bgcolor: "#f0f0f0",
              color: "#333",
              width: 56,
              height: 56,
              borderRadius: "8px", // Make avatar squared
            }}
            variant="rounded"
          >
            {item.item_type === "consult" ? <PersonIcon /> : <ScienceIcon />}
          </Avatar>
        </Grid>

        {/* Item Details */}
        <Grid item xs>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {item.item_name}
          </Typography>
          {item.item_type === "consult" && (
            <Typography variant="body2" color="text.secondary">
              Dr. {itemDetail.docname} - {itemDetail.specialization}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Unit Price: ₹{itemPrice.toFixed(2)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Quantity: {item.quantity}
          </Typography>
        </Grid>

        {/* Price and Remove Button */}
        <Grid item sx={{ textAlign: "right" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            ₹{subtotal.toFixed(2)}
          </Typography>
          <IconButton
            aria-label="Remove item"
            color="error"
            onClick={onRemove} // Use the onRemove prop directly
            size="small"
            sx={{
              border: "1px solid rgba(211, 47, 47, 0.5)",
              borderRadius: "4px",
              "&:hover": { bgcolor: "rgba(211, 47, 47, 0.04)" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartItemCard;
