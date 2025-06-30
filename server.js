import express from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

// Configurazioni per usare __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const dataFilePath = './data.json';

// 1. Servi i file statici (HTML, CSS, JS del client) dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// 2. Crea l'endpoint API per fornire i dati
app.get('/api/data', async (req, res) => {
    try {
        const fileContent = await fs.readFile(dataFilePath);
        const data = JSON.parse(fileContent);
        res.json(data); // Invia i dati come risposta JSON
    } catch (error) {
        console.error("Errore nel leggere il file dati:", error);
        res.status(500).json({ error: 'Impossibile recuperare i dati' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
});