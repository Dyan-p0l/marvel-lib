const express = require('express');
const dotenv = require('dotenv');
const CryptoJS = require('crypto-js');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

// API route to fetch Marvel data
app.get('/api/characters', async (req, res) => {
    try {
        const { name } = req.query; // Get the character name from query params
        if (!name) {
            return res.status(400).json({ error: 'Character name is required' });
        }

        const publicKey = process.env.MARVEL_PUBLIC_KEY;
        const privateKey = process.env.MARVEL_PRIVATE_KEY;
        const timeStamp = new Date().getTime();

        const hashVal = CryptoJS.MD5(timeStamp + privateKey + publicKey).toString();
        const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&name=${name}`;

        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
