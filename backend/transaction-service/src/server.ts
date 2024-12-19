import app from './app';

// Set the port to a specific value or default to 5000
const PORT = process.env.PORT || 3004;

// Start the server
app.listen(PORT, () => {
    console.log(`transaction-service is running on port ${PORT}`);
});
