const express = require('express');
const dotenv = require('dotenv');
const CryptoJS = require('crypto-js');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.get('/api/characters', async (req, res) => {
    try {
        const { name, nameStartsWith } = req.query; // Get the character name or nameStartsWith from query params

        if (!name && !nameStartsWith) {
            return res.status(400).json({ error: 'Character name is required' });
        }

        const publicKey = process.env.MARVEL_PUBLIC_KEY;
        const privateKey = process.env.MARVEL_PRIVATE_KEY;
        const timeStamp = new Date().getTime();
        const hashVal = CryptoJS.MD5(timeStamp + privateKey + publicKey).toString();

        let url;
        if (nameStartsWith) {   
            url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&nameStartsWith=${nameStartsWith}`;
        } else if (name) {
            url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&name=${name}`;
        }

        const response = await fetch(url);

        const data = await response.json();

        res.json(data);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/characters/:id/comics', async (req, res) => {
    try {
        const {id} = req.params;
        
        if (!id) {
            return res.status(400).json({error: 'Character id is required'});
        }

        const publicKey = process.env.MARVEL_PUBLIC_KEY;
        const privateKey = process.env.MARVEL_PRIVATE_KEY;
        const timeStamp = new Date().getTime();
        const hashVal = CryptoJS.MD5(timeStamp + privateKey + publicKey).toString();

        const comicUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}`;

        const response = await fetch(comicUrl);
        const comicsData = await response.json();

        res.json(comicsData);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal server error'});

    }
});

app.get('/api/creators', async (req, res) => {
    try {

        const publicKey = process.env.MARVEL_PUBLIC_KEY;
        const privateKey = process.env.MARVEL_PRIVATE_KEY;
        const timeStamp = new Date().getTime();
        const hashVal = CryptoJS.MD5(timeStamp + privateKey + publicKey).toString();

        const creatorUrl = `https://gateway.marvel.com:443/v1/public/creators?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&limit=40`;
        const creatorRes = await fetch(creatorUrl);
        const creatorData = await creatorRes.json();
        
        res.json(creatorData);
        

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
