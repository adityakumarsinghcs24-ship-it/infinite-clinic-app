import React from 'react';
import { Button } from '@mui/material';
import AxiosInstance from '../Axios';

const PaymentButton = ({ amount = 34900, onSuccess }) => {
    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await initializeRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load');
            return;
        }

        // Creating a new order
        const result = await AxiosInstance.post('/payment/create-order/');
        const { amount, order_id, currency } = result.data;

        const options = {
            key: 'rzp_test_ROhm8gRpTv2xUm', // Your test key ID
            amount: amount,
            currency: currency,
            name: 'InfiniteClinic',
            description: 'Test Payment',
            order_id: order_id,
            handler: async (response) => {
                try {
                    const result = await AxiosInstance.post('/payment/verify/', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });

                    if (result.data.status === 'Payment Successful') {
                        alert('Payment Successful');
                        if (onSuccess) onSuccess(response);
                    }
                } catch (error) {
                    alert('Payment verification failed');
                }
            },
            prefill: {
                name: 'Test User',
                email: 'test@example.com',
                contact: '9999999999',
            },
            theme: {
                color: '#3399cc',
            },
            prefill: {
                name: 'Test User',
                email: 'test@example.com',
                contact: '9999999999'
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <Button variant="contained" color="primary" onClick={handlePayment}>
            Pay Now
        </Button>
    );
};

export default PaymentButton;