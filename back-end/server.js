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

        const comicUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&limit=15`;

        const response = await fetch(comicUrl);
        const comicsData = await response.json();

        res.json(comicsData);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Internal server error'});

    }
});

app.get('/api/comics', async (req, res) => {
    try {
        const {title, titleStartsWith} = req.query;
        const publicKey = process.env.MARVEL_PUBLIC_KEY;
        const privateKey = process.env.MARVEL_PRIVATE_KEY;
        const timeStamp = new Date().getTime();
        const hashVal = CryptoJS.MD5(timeStamp + privateKey + publicKey).toString();

        let comicUrl;
        if (title) {
            comicUrl = `https://gateway.marvel.com:443/v1/public/comics?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&title=${title}&limit=15`;
        }else if (titleStartsWith) {
            comicUrl = `https://gateway.marvel.com:443/v1/public/comics?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&titleStartsWith=${titleStartsWith}`;
        }else {
            comicUrl = `https://gateway.marvel.com:443/v1/public/comics?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&limit=15&offset=90`;
        }
        
        const comicRes = await fetch(comicUrl);
        const comicData = await comicRes.json();    
        
        res.json(comicData);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});