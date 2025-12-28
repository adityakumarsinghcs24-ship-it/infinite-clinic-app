import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Card,
  List,
  ListItem,
  ListItemText,
  Paper, // Import Paper for better sectioning
} from "@mui/material";
import { Link } from "react-router-dom"; // Import Link for navigation
import CheckoutModal from "./CheckoutModal";
import CartItemCard from "./CartItemCard";
// FIX: Import all necessary data-fetching functions
import {
  get_cart,
  remove_from_cart,
  checkout_cart,
  get_tests,
  get_consultations,
} from "../../api/endpoints"; // Adjust path if needed
import { useAuth } from "../../context/useAuth";

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null); // Will store the raw cart from the API
  const [enrichedItems, setEnrichedItems] = useState([]); // Will store aggregated, detailed items
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const loadCartData = async () => {
    if (!user) {
      setLoading(false);
      setError("Please log in to view your cart.");
      return;
    }
    try {
      setLoading(true);

      // Fetch all data sources concurrently
      const [cartRes, testsRes, consultsRes] = await Promise.all([
        get_cart(),
        get_tests(),
        get_consultations(),
      ]);

      // 1. Process cart
      const rawCart =
        Array.isArray(cartRes) && cartRes.length > 0
          ? cartRes[0]
          : !Array.isArray(cartRes) && cartRes?.items
          ? cartRes
          : { items: [] };
      setCart(rawCart); // Store the original, un-aggregated cart

      // 2. Process tests and consultations
      const allTests = testsRes || [];
      const allConsults = consultsRes || [];

      // 3. Aggregate items (group identical tests/consults and sum quantities)
      const aggregatedItemsMap = new Map();
      for (const item of rawCart.items) {
        let key;
        if (item.item_type === "consult" && item.consult) {
          key = `consult-${item.consult}`;
        } else if (item.item_type === "test" && item.test) {
          key = `test-${item.test}`;
        } else {
          continue; // Skip invalid items
        }

        if (aggregatedItemsMap.has(key)) {
          // If we've seen this item, just add to its quantity
          const existingItem = aggregatedItemsMap.get(key);
          existingItem.quantity += item.quantity;
        } else {
          // If it's a new item, add a copy to the map
          aggregatedItemsMap.set(key, { ...item });
        }
      }
      const aggregatedItemsArray = Array.from(aggregatedItemsMap.values());

      // 4. Merge data to create "enriched" items from the aggregated list
      const newEnrichedItems = aggregatedItemsArray
        .map((item) => {
          let detail = null;
          let item_name = "Unknown Item";
          if (item.item_type === "consult" && item.consult) {
            detail = allConsults.find((c) => c.id === item.consult);
            item_name = detail?.docname || "Consultation";
          } else if (item.item_type === "test" && item.test) {
            detail = allTests.find((t) => t.id === item.test);
            item_name = detail?.name || "Test";
          }

          if (!detail) return null; // Item in cart doesn't exist in DB

          // Re-create the object structure CartItemCard expects
          return {
            ...item, // 'item' now has the summed quantity
            item_name: item_name,
            consult: item.item_type === "consult" ? detail : null,
            test: item.item_type === "test" ? detail : null,
          };
        })
        .filter(Boolean); // Remove any null items

      setEnrichedItems(newEnrichedItems);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch cart data:", err);
      if (err.response && err.response.status === 404) {
        setCart({ items: [] });
        setEnrichedItems([]);
      } else {
        setError("Failed to load cart. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, [user]);

  const handleRemoveItem = async (itemKey) => {
    // itemKey will be "consult-ID" or "test-ID"
    const [type, idStr] = itemKey.split("-");
    const id = parseInt(idStr, 10);

    try {
      // Find all original cart item IDs that match this key
      const itemIdsToDelete = cart.items
        .filter(
          (originalItem) =>
            originalItem.item_type === type &&
            (originalItem.consult === id || originalItem.test === id)
        )
        .map((item) => item.id);

      if (itemIdsToDelete.length === 0) {
        throw new Error("Could not find items to delete.");
      }

      // Create an array of delete promises
      const deletePromises = itemIdsToDelete.map((id) => remove_from_cart(id));

      // Run all deletes concurrently
      await Promise.all(deletePromises);

      loadCartData(); // Re-fetch all data to update the UI
    } catch (err) {
      console.error("Failed to remove item(s) from cart:", err);
      setError("Failed to remove item. Please try again.");
    }
  };

  const handleProceedToCheckout = () => {
    setCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = async () => {
    try {
      console.log("Proceeding with checkout!");
      await checkout_cart();
      setCheckoutModalOpen(false);
      alert("Checkout process initiated! (This is a dummy action)");
      loadCartData(); // Re-fetch cart (it might be empty now)
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  // Calculate total from the new enrichedItems state
  const totalAmount = enrichedItems
    ? enrichedItems.reduce((sum, item) => {
        const itemDetail =
          item.item_type === "consult" ? item.consult : item.test;
        return (
          sum + (itemDetail ? parseFloat(itemDetail.price) * item.quantity : 0)
        );
      }, 0)
    : 0;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 3, textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  // Filter items from the new enrichedItems state
  const consultationItems =
    enrichedItems?.filter((item) => item.item_type === "consult") || [];
  const testItems =
    enrichedItems?.filter((item) => item.item_type === "test") || [];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "700", mb: 4 }}
      >
        Your Cart
      </Typography>

      {enrichedItems.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4, py: 10 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Your cart is empty.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/tests"
            sx={{
              mt: 3,
              bgcolor: "#111", // Black background
              color: "#fff", // White text
              "&:hover": { bgcolor: "#333" }, // Darker on hover
              textTransform: "none",
              fontSize: "1rem",
              py: 1.5,
              px: 5,
            }}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {consultationItems.length > 0 && (
              <Paper
                variant="outlined"
                sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2 }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    borderBottom: "1px solid #eee",
                    pb: 2,
                    mb: 3,
                  }}
                >
                  Consultations
                </Typography>
                {consultationItems.map((item) => (
                  <CartItemCard
                    key={item.id} // Use the (first) item ID for the key
                    item={item} // Pass the aggregated item
                    // Pass a function that calls handleRemoveItem with the unique key
                    onRemove={() =>
                      handleRemoveItem(`consult-${item.consult.id}`)
                    }
                  />
                ))}
              </Paper>
            )}

            {testItems.length > 0 && (
              <Paper
                variant="outlined"
                sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    borderBottom: "1px solid #eee",
                    pb: 2,
                    mb: 3,
                  }}
                >
                  Tests
                </Typography>
                {testItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    // Pass a function that calls handleRemoveItem with the unique key
                    onRemove={() => handleRemoveItem(`test-${item.test.id}`)}
                  />
                ))}
              </Paper>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                // Make the card sticky on medium screens and up
                position: { md: "sticky" },
                top: { md: 100 }, // Adjust top offset (e.g., 64px for AppBar + 36px margin)
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* FIX: Detailed item breakdown (This will now use aggregated items) */}
              <List dense sx={{ width: "100%", mb: 2 }}>
                {enrichedItems.map((item) => {
                  const itemDetail = item.consult || item.test;
                  const price = parseFloat(itemDetail?.price || 0);
                  const subtotal = price * item.quantity;
                  return (
                    <ListItem key={item.id} disableGutters sx={{ p: 0 }}>
                      <ListItemText
                        primary={`${item.item_name} (x${item.quantity})`}
                        primaryTypographyProps={{ fontWeight: "500" }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: "500" }}>
                        ₹{subtotal.toFixed(2)}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* FIX: Removed Shipping, kept Total */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ₹{totalAmount.toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleProceedToCheckout}
                sx={{
                  bgcolor: "#111", // Black background
                  color: "#fff", // White text
                  "&:hover": { bgcolor: "#333" }, // Darker on hover
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
                disabled={enrichedItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}

      <CheckoutModal
        open={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onConfirm={handleConfirmCheckout}
      />
    </Container>
  );
};

export default CartPage;
