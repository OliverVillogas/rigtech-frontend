const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));

// Ruta principal → redirige al login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

app.listen(PORT, () => {
    console.log(`✅ RigTech Frontend running on port ${PORT}`);
    console.log(`📡 Access via: http://localhost:${PORT}`);
});