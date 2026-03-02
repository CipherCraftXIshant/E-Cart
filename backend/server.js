const app = require('./src/app');

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`E-cart Backend Server running on http://localhost:${PORT}`);
});
