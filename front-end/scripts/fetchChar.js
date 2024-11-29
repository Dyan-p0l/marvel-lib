import { MARVEL_PUBLIC_KEY, MARVEL_PRIVATE_KEY } from "./data.js";

const publicKey = MARVEL_PUBLIC_KEY;
const privateKey = MARVEL_PRIVATE_KEY;
let date = new Date();
const timeStamp = date.getTime();

const hashVal = CryptoJS.MD5(timeStamp + privateKey + publicKey).toString();
console.log('hash: '+hashVal);
console.log('timestamp: '+ timeStamp);

const input_field = document.getElementById('search-input-js');

const btn_clicker = document.getElementById('search-btn-js');

btn_clicker.addEventListener('click', (async () => {
    if(input_field.value.trim().length < 1){
        alert("Please enter a character name");
    }
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashVal}&name=${input_field.value.trim()}`;

    const response = await fetch(url);
    const jsonData = await response.json();
    jsonData.data["results"].forEach((element) => {
        console.log(element);
    });
}));