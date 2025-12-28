import { React, useEffect, useMemo, useState } from "react";
import AxiosInstance from "../Axios";
import { MaterialReactTable } from "material-react-table";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const CView = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    docname: "",
    specialization: "",
    price: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch consultations
  const fetchConsultations = () => {
    setLoading(true);
    AxiosInstance.get("consultations/")
      .then((res) => setConsultations(res.data))
      .catch((err) => {
        console.error("Error fetching consultations:", err.response?.data);
        showSnackbar("Error fetching consultations", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.docname.trim()) errors.docname = "Doctor name is required";
    if (formData.price && isNaN(formData.price))
      errors.price = "Price must be a valid number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open/Close dialog
  const handleOpen = (consultation = null) => {
    if (consultation) {
      setEditingConsultation(consultation);
      setFormData({
        docname: consultation.docname || "",
        specialization: consultation.specialization || "",
        price: consultation.price || "",
      });
    } else {
      setEditingConsultation(null);
      setFormData({
        docname: "",
        specialization: "",
        price: "",
      });
    }
    setFormErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingConsultation(null);
  };

  // Submit form
  const handleSubmit = () => {
    if (!validateForm()) return;
    setSaving(true);

    const payload = {
      docname: formData.docname,
      specialization: formData.specialization || null,
      price: formData.price ? parseFloat(formData.price) : null,
    };

    const request = editingConsultation
      ? AxiosInstance.put(`consultations/${editingConsultation.id}/`, payload)
      : AxiosInstance.post("consultations/", payload);

    request
      .then(() => {
        fetchConsultations();
        handleClose();
        showSnackbar(
          editingConsultation
            ? "Consultation updated successfully!"
            : "Consultation created successfully!"
        );
      })
      .catch((err) => {
        console.error("Error saving consultation:", err.response?.data);
        showSnackbar("Error saving consultation", "error");
      })
      .finally(() => setSaving(false));
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this consultation?")) {
      AxiosInstance.delete(`consultations/${id}/`)
        .then(() => {
          fetchConsultations();
          showSnackbar("Consultation deleted successfully!");
        })
        .catch((err) => {
          console.error("Error deleting consultation:", err.response?.data);
          showSnackbar("Failed to delete consultation", "error");
        });
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 80 },
      { accessorKey: "docname", header: "Doctor Name", size: 200 },
      { accessorKey: "specialization", header: "Specialization", size: 200 },
      {
        accessorKey: "price",
        header: "Price (₹)",
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue() ? `₹${parseFloat(cell.getValue()).toFixed(2)}` : "-",
      },
    ],
    []
  );

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Manage Consultations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={consultations}
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "8px" }}>
              <IconButton
                color="secondary"
                onClick={() => handleOpen(row.original)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(row.original.id)}
              >
                <DeleteIcon />
              </IconButton>
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  navigate(`/consultations/${row.original.id}/timeslots`)
                }
              >
                Time Slots
              </Button>
            </Box>
          )}
        />
      )}

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingConsultation ? "Edit Consultation" : "Add Consultation"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Doctor Name"
            name="docname"
            fullWidth
            required
            value={formData.docname}
            onChange={handleChange}
            error={!!formErrors.docname}
            helperText={formErrors.docname}
          />
          <TextField
            margin="dense"
            label="Specialization"
            name="specialization"
            fullWidth
            value={formData.specialization}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Price (₹)"
            name="price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
            error={!!formErrors.price}
            helperText={formErrors.price}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <CircularProgress size={20} />
            ) : editingConsultation ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CView;
