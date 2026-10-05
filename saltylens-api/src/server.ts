import app from './app.js';
import { pool } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Kita tes koneksi DB dulu sebelum server jalan
pool.query('SELECT NOW()')
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Database connection failed:', err);
    });