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
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AccessTime as ClockIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const TView = () => {
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    package: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  // Fetch tests
  const fetchTests = () => {
    setLoading(true);
    AxiosInstance.get("tests/")
      .then((res) => setTests(res.data))
      .catch((err) => {
        console.error("Error fetching tests:", err.response?.data);
        showSnackbar("Error fetching tests", "error");
      })
      .finally(() => setLoading(false));
  };

  // Fetch packages
  const fetchPackages = () => {
    AxiosInstance.get("packages/")
      .then((res) => setPackages(res.data))
      .catch((err) =>
        console.error("Error fetching packages:", err.response?.data)
      );
  };

  useEffect(() => {
    fetchTests();
    fetchPackages();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (formData.price && isNaN(formData.price))
      errors.price = "Price must be a valid number";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open/Close dialog
  const handleOpen = (test = null) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        name: test.name || "",
        description: test.description || "",
        price: test.price || "",
        package: test.package || "",
      });
    } else {
      setEditingTest(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        package: "",
      });
    }
    setFormErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTest(null);
  };

  // Submit form
  const handleSubmit = () => {
    if (!validateForm()) return;
    setSaving(true);

    const payload = {
      name: formData.name,
      description: formData.description || null,
      price: formData.price ? parseFloat(formData.price) : null,
      package: formData.package ? parseInt(formData.package, 10) : null,
    };

    const request = editingTest
      ? AxiosInstance.put(`tests/${editingTest.id}/`, payload)
      : AxiosInstance.post("tests/", payload);

    request
      .then(() => {
        fetchTests();
        handleClose();
        showSnackbar(
          editingTest
            ? "Test updated successfully!"
            : "Test created successfully!"
        );
      })
      .catch((err) => {
        console.error("Error saving test:", err.response?.data);
        showSnackbar("Error saving test", "error");
      })
      .finally(() => setSaving(false));
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      AxiosInstance.delete(`tests/${id}/`)
        .then(() => {
          fetchTests();
          showSnackbar("Test deleted successfully!");
        })
        .catch((err) => {
          console.error("Error deleting test:", err.response?.data);
          showSnackbar("Failed to delete test", "error");
        });
    }
  };

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 80 },
      { accessorKey: "name", header: "Test Name", size: 200 },
      { accessorKey: "description", header: "Description", size: 250 },
      {
        accessorKey: "price",
        header: "Price (₹)",
        size: 120,
        Cell: ({ cell }) =>
          cell.getValue() ? `₹${parseFloat(cell.getValue()).toFixed(2)}` : "-",
      },
      {
        accessorKey: "package",
        header: "Package",
        size: 150,
        Cell: ({ cell }) => {
          const pkg = packages.find((p) => p.id === cell.getValue());
          return pkg ? pkg.name : "-";
        },
      },
    ],
    [packages]
  );

  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Manage Tests
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
          data={tests}
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
              <IconButton
                color="primary"
                // MODIFIED: Changed navigation to the independent /timeslots route
                onClick={() => navigate(`/timeslots`)}
              >
                <ClockIcon />
              </IconButton>
            </Box>
          )}
        />
      )}

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingTest ? "Edit Test" : "Add Test"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
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
          <TextField
            select
            margin="dense"
            label="Package"
            name="package"
            fullWidth
            value={formData.package}
            onChange={handleChange}
          >
            <MenuItem value="">-- Select Package --</MenuItem>
            {packages.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <CircularProgress size={20} />
            ) : editingTest ? (
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

export default TView;
