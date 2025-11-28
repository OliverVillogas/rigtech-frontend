const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Ruta principal → redirige al login (ANTES de los archivos estáticos)
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Servir archivos estáticos DESPUÉS de la ruta principal
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pages')));

app.listen(PORT, () => {
    console.log(`✅ RigTech Frontend running on port ${PORT}`);
    console.log(`📡 Access via: http://localhost:${PORT}`);
});