const input_field = document.getElementById('search-input-js');
const btn_clicker = document.getElementById('search-btn-js');
const section = document.getElementById('search-result-sec');
const comicsCont = document.getElementById('char-comics-sec');
const loader  = document.getElementById('loading-ring');

const list_cont = document.querySelector('.list');
list_cont.style.display = 'none';

function displayNames(value) {
    input_field.value = value;
    list_cont.innerHTML = '';
    list_cont.style.display = 'none';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        btn_clicker.click();
    }
});

input_field.addEventListener('keydown', async () => {
    const input_val = input_field.value;

    list_cont.innerHTML = '';
    
    if (input_val.length < 4) {
        return false;
    }

    const url = `http://localhost:3000/api/characters?nameStartsWith=${input_val}`;

    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        
        if (jsonData.data && jsonData.data.results.length > 0) {
            jsonData.data.results.forEach((element) => {
                let val = element.name;
                let word = val.substr(0, input_field.value.length);
                word += val.substr(input_field.value.length);

                // Append the suggestion box
                const suggestionHTML = document.createElement('div');
                suggestionHTML.className = 'name-suggest';
                suggestionHTML.style.cursor = 'pointer';
                suggestionHTML.innerHTML = `<p class="item">${word}</p>`;
                
                // Add click event listener directly to the new element
                suggestionHTML.addEventListener('click', () => {
                    displayNames(val);
                });

                list_cont.appendChild(suggestionHTML);
                list_cont.style.display = 'block';
            });
        } else {
            console.log('No results or invalid data structure');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

btn_clicker.addEventListener('click', async () => {

    if (input_field.value.trim().length < 1) {
        alert("Please enter a character name");
        return;
    }

    loader.style.display = 'block';
    
    const name = input_field.value.trim();
    const url = `http://localhost:3000/api/characters?name=${name}`;
    try {
        const response = await fetch(url);
        const jsonData = await response.json();

        if (jsonData.data && jsonData.data.results.length > 0) {
            jsonData.data.results.forEach((element) => {
                const imageUrl = element.thumbnail.path + '.' + element.thumbnail.extension;
                section.innerHTML = '';
                section.innerHTML += 
                `
                <div class="image-result" style="background-image: url(${imageUrl})">

                </div>
                <div class="description-cont">
                    <h1 class="des-title">${element.name}</h1>
                    <div class="des-parag-cont">
                        <p>${element.description}</p>
                    </div>
                </div>
                `;
            });
        } else {
            console.log('No results found');
        }

        const charId = jsonData.data.results[0].id;

        const comicUrl = `http://localhost:3000/api/characters/${charId}/comics`;

        try{

            const comicRes = await fetch(comicUrl);
            const comicData = await comicRes.json();

            console.log(comicData);

            if (comicData.data && comicData.data.results.length > 0) {
                comicsCont.innerHTML = 
                `
                    <h1 class="section-heading" style="text-align: center;">
                        FEATURED COMICS
                    </h1>
                `;
            
                const comCont = document.createElement('div');
                comCont.className = 'comics-container';

                comicData.data.results.forEach( (comEl) => {
                    const com = document.createElement('div');
                    com.className = 'comics';
                    
                    const comImg = document.createElement('div');
                    comImg.className = 'com-image';
                    const bgImage = comEl.thumbnail.path + '.' + comEl.thumbnail.extension;
                    comImg.style.backgroundImage = `url(${bgImage})`;

                    const comTitle = document.createElement('h3');
                    comTitle.innerHTML = comEl.title;
                    const comCredits = document.createElement('p');
                    comCredits.innerHTML = comicData.attributionText;
                    comCredits.className = 'credits';
                    console.log(comicData.attributionText);

                    com.appendChild(comImg);
                    com.appendChild(comTitle);
                    com.appendChild(comCredits);


                    comCont.appendChild(com);

                    com.addEventListener('click', () => {
                        window.open(comEl.urls[0].url, '_blank');
                    });

                });
                comicsCont.appendChild(comCont);
            }   
            else{
                console.log('No comics found');
            }

        }catch(error){
            console.log('No comics found', error);
        }
        finally{
            console.log('data fetched');
        }
    } 
    catch (error) {
        console.error('Error fetching character data:', error);
    }
    finally{
        loader.style.display = 'none';
    }
    
});
