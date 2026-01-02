#!/usr/bin/env node
/**
 * Simple Express.js API server for time slots
 * This serves as a backup when Django/MongoDB is not available
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// In-memory storage for time slots
let timeSlots = {};

// Helper function to create default time slots for a date
function createDefaultTimeSlots(date) {
  const timeSlotTemplates = [
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
  ];

  const selectedDate = new Date(date);
  
  // Skip Sundays
  if (selectedDate.getDay() === 0) {
    return [];
  }

  return timeSlotTemplates.map((slot, index) => ({
    id: `slot_${date}_${index}`,
    date: date,
    start_time: slot.start,
    end_time: slot.end,
    display_time: `${slot.start} - ${slot.end}`,
    available_slots: 10,
    booked_slots: 0,
    unlimited_patients: false,
    available: true
  }));
}

// Routes

// Health check / Test API
app.get('/api/mongo/test/', (req, res) => {
  res.json({
    success: true,
    message: 'Simple API server is working',
    timestamp: new Date().toISOString(),
    mongodb_status: {
      connected: false,
      error: 'Using simple Express.js server instead of MongoDB',
      collections_count: 0,
      time_slots_count: Object.keys(timeSlots).length
    },
    endpoints: {
      time_slots: '/api/mongo/time-slots/',
      simple_time_slots: '/api/mongo/simple-time-slots/',
      create_time_slots: '/api/mongo/create-time-slots/',
      test: '/api/mongo/test/'
    }
  });
});

// Simple time slots endpoint
app.get('/api/mongo/simple-time-slots/', (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const slots = createDefaultTimeSlots(date);
    
    res.json({
      success: true,
      date: date,
      slots: slots,
      source: 'simple_express_server',
      mongodb_connected: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'error'
    });
  }
});

// Main time slots endpoint
app.get('/api/mongo/time-slots/', (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    // Check if we have slots for this date
    if (!timeSlots[date]) {
      timeSlots[date] = createDefaultTimeSlots(date);
    }
    
    const slots = timeSlots[date] || [];
    
    res.json({
      success: true,
      date: date,
      slots: slots,
      source: 'express_server',
      mongodb_connected: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      source: 'error'
    });
  }
});

// Create time slots endpoint
app.post('/api/mongo/create-time-slots/', (req, res) => {
  try {
    const days = req.body.days || 30;
    const startDate = new Date();
    let totalSlotsCreated = 0;
    let daysWithSlotsCreated = 0;
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (!timeSlots[dateStr]) {
        const slots = createDefaultTimeSlots(dateStr);
        if (slots.length > 0) {
          timeSlots[dateStr] = slots;
          totalSlotsCreated += slots.length;
          daysWithSlotsCreated++;
        }
      }
    }
    
    res.json({
      success: true,
      message: `Time slots created for ${daysWithSlotsCreated} days`,
      start_date: startDate.toISOString().split('T')[0],
      days_processed: days,
      days_with_slots_created: daysWithSlotsCreated,
      total_slots_created: totalSlotsCreated,
      mongodb_connected: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      mongodb_connected: false
    });
  }
});

// Book test endpoint (simplified)
app.post('/api/mongo/book-test/', (req, res) => {
  try {
    const bookingData = req.body;
    const bookingId = `BK${Date.now()}`;
    
    // Simple booking confirmation
    res.json({
      success: true,
      message: 'Test booking successful!',
      booking_id: bookingId,
      total_amount: bookingData.total_price || 0,
      booking_date: bookingData.booking_date || new Date().toISOString().split('T')[0],
      time_slot_info: {
        id: bookingData.time_slot_id || null,
        time: bookingData.preferred_time || 'Custom time'
      },
      note: 'This is a demo booking using the simple Express.js server'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Catch-all for other endpoints
app.all('/api/mongo/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not implemented in simple server',
    available_endpoints: [
      '/api/mongo/test/',
      '/api/mongo/time-slots/',
      '/api/mongo/simple-time-slots/',
      '/api/mongo/create-time-slots/',
      '/api/mongo/book-test/'
    ]
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Simple API Server for Infinite Clinic',
    status: 'running',
    endpoints: {
      test: '/api/mongo/test/',
      time_slots: '/api/mongo/time-slots/',
      simple_time_slots: '/api/mongo/simple-time-slots/',
      create_time_slots: '/api/mongo/create-time-slots/',
      book_test: '/api/mongo/book-test/'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple API Server running on http://localhost:${PORT}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - GET  /api/mongo/test/`);
  console.log(`   - GET  /api/mongo/time-slots/`);
  console.log(`   - GET  /api/mongo/simple-time-slots/`);
  console.log(`   - POST /api/mongo/create-time-slots/`);
  console.log(`   - POST /api/mongo/book-test/`);
  console.log(`\n💡 This server provides basic functionality when Django/MongoDB is not available`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Simple API Server...');
  process.exit(0);
});

module.exports = app;