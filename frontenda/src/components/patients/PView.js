import { React, useEffect, useMemo, useState } from "react";
import AxiosInstance from "../Axios";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

const PView = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    age: "",
    gender: "M",
    phone_number: "",
    email: "",
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

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  // Fetch patients
  const GetPatients = () => {
    setLoading(true);
    AxiosInstance.get("patients/")
      .then((res) => {
        setPatients(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patients:", err.response?.data);
        showSnackbar("Error fetching patients", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    GetPatients();
  }, []);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateForm = () => {
    let errors = {};

    if (!formData.first_name) errors.first_name = "First name is required";
    if (!formData.age || formData.age <= 0)
      errors.age = "Valid age is required";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email format";
    if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number))
      errors.phone_number = "Phone number must be 10 digits";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open/close modal
  const handleOpen = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({ ...patient });
    } else {
      setEditingPatient(null);
      setFormData({
        first_name: "",
        age: "",
        gender: "M",
        phone_number: "",
        email: "",
      });
    }
    setFormErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPatient(null);
  };

  // Submit form
  const handleSubmit = () => {
    if (!validateForm()) return;
    setSaving(true);

    const request = editingPatient
      ? AxiosInstance.put(`patients/${editingPatient.id}/`, formData)
      : AxiosInstance.post("patients/", formData);

    request
      .then(() => {
        GetPatients();
        handleClose();
        showSnackbar(
          editingPatient
            ? "Patient updated successfully!"
            : "Patient created successfully!"
        );
      })
      .catch((err) => {
        console.error("Error saving patient:", err.response?.data);
        showSnackbar("Error saving patient", "error");
      })
      .finally(() => setSaving(false));
  };

  // Table columns
  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 70 },
      { accessorKey: "first_name", header: "First Name", size: 150 },
      { accessorKey: "age", header: "Age", size: 80 },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 100,
        Cell: ({ cell }) => {
          const val = cell.getValue();
          return val === "M" ? "Male" : val === "F" ? "Female" : "Other";
        },
      },
      { accessorKey: "phone_number", header: "Phone", size: 150 },
      { accessorKey: "email", header: "Email", size: 200 },
    ],
    []
  );

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
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
          enableRowActions
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "8px" }}>
              <IconButton
                color="secondary"
                onClick={() => handleOpen(row.original)}
              >
                <EditIcon />
              </IconButton>
            </Box>
          )}
          columns={columns}
          data={patients}
        />
      )}

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingPatient ? "Edit" : "Add"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            fullWidth
            required
            error={!!formErrors.first_name}
            helperText={formErrors.first_name}
          />
          <TextField
            margin="dense"
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            required
            error={!!formErrors.age}
            helperText={formErrors.age}
          />
          <TextField
            select
            margin="dense"
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
            <MenuItem value="O">Other</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.phone_number}
            helperText={formErrors.phone_number}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving}>
            {saving ? (
              <CircularProgress size={20} />
            ) : editingPatient ? (
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

export default PView;
