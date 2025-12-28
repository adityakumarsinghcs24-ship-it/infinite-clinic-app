import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
    Typography,
    Paper,
    Divider
} from '@mui/material';
import PaymentButton from './PaymentButton';

const PaymentPage = () => {
    const [upiId, setUpiId] = useState('');
    const [amount] = useState(349);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                Payment Options
            </Typography>
            
            <Grid container spacing={3}>
                {/* Razorpay Payment Option */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Pay with Razorpay
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Secure payment gateway with multiple payment options
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <PaymentButton amount={amount} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Direct UPI Option */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Direct UPI Payment
                        </Typography>
                        <Typography variant="body2" color="textSecondary" paragraph>
                            Pay directly using UPI ID: example@upi
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <img 
                                src="/qr-placeholder.png" 
                                alt="UPI QR Code"
                                style={{ width: '150px', height: '150px', margin: '10px auto', display: 'block' }}
                            />
                            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                Scan QR code or send payment to UPI ID
                            </Typography>
                            <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                                Amount: ₹{amount}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Payment Summary */}
                <Grid item xs={12}>
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Payment Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography>Test Fee:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography align="right">₹{amount}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6">Total:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" align="right">₹{amount}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PaymentPage;