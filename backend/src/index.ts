import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data - replace with Firebase/Firestore
const communicationItems = [
  {
    id: '086',
    title: 'Referral for John Barnes',
    referenceNumber: '086',
    type: 'Referral',
    team: 'Far North',
    dateReceived: '2025-08-16',
    daysSinceReceived: 2,
    status: 'Awaiting Action',
    isOverdue: false,
    patient: {
      firstName: 'John',
      lastName: 'Barnes',
      dob: '2005-03-08',
      medicareNumber: '1234 56789 1'
    },
    clinician: {
      title: 'Dr',
      firstName: 'Marta',
      lastName: 'Lang',
      email: 'mlang@doctorsaus.com.au'
    }
  },
  // Add more items as needed
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.get('/api/communications', (req, res) => {
  try {
    res.json({ 
      success: true, 
      data: communicationItems 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch communications' 
    });
  }
});

app.get('/api/communications/:id', (req, res) => {
  try {
    const item = communicationItems.find(item => item.id === req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Communication item not found' 
      });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch communication item' 
    });
  }
});

app.patch('/api/communications/:id/action', (req, res) => {
  try {
    const item = communicationItems.find(item => item.id === req.params.id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: 'Communication item not found' 
      });
    }
    
    item.status = 'Actioned';
    
    res.json({ 
      success: true, 
      message: 'Item marked as actioned',
      data: item 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update communication item' 
    });
  }
});

// FHIR Integration endpoints (placeholder for SMART on FHIR)
app.get('/api/fhir/launch', (req, res) => {
  // SMART on FHIR launch endpoint
  res.json({ 
    message: 'FHIR app launch endpoint - implement SMART on FHIR authorization',
    iss: req.query.iss,
    launch: req.query.launch
  });
});

app.get('/api/fhir/callback', (req, res) => {
  // SMART on FHIR callback endpoint
  res.json({ 
    message: 'FHIR authorization callback - implement token exchange',
    code: req.query.code,
    state: req.query.state
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Communications API: http://localhost:${PORT}/api/communications`);
});