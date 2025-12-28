import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

/**
 * Reusable modal for checkout confirmation.
 * @param {object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Callback to close the modal
 * @param {function} props.onConfirm - Callback to execute on confirmation
 */
const CheckoutModal = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Checkout</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to proceed with the checkout process? This
          action will finalize your order.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          sx={{
            bgcolor: "#000",
            color: "#fff",
            "&:hover": { bgcolor: "#333" },
            textTransform: "none",
          }}
          autoFocus
        >
          Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckoutModal;
