const comic_section = document.getElementById('comics-result-sec');
const com_input = document.getElementById('com-search-input-js');
const search_btn = document.getElementById('com-search-btn-js');
const list_cont = document.querySelector('.comics-list');

list_cont.style.display = 'none';

function displayComNames(value) {
    com_input.value = value;
    list_cont.innerHTML = '';
    list_cont.style.display = 'none';
}

document.addEventListener('keydown',(event) => {
    if (event.key === 'Enter') {
        search_btn.click();
    }
});

document.addEventListener('DOMContentLoaded', async () => {

    const url = `http://localhost:3000/api/comics`;

    try {
        const response = await fetch(url);

        const comData = await response.json();
        console.log(comData);
        
        const comCont = document.createElement('div');
        comCont.className = 'comics-container';

        comData.data.results.forEach( (comEl) => {

            const bgImage = comEl.thumbnail.path + '.' + comEl.thumbnail.extension;

            const com = document.createElement('div');
            com.className = 'comics';
            
            const comImg = document.createElement('div');
            comImg.className = 'com-image';
            comImg.style.backgroundImage = `url(${bgImage})`;

            const comTitle = document.createElement('h3');
            comTitle.innerHTML = comEl.title;

            com.appendChild(comImg);
            com.appendChild(comTitle);

            comCont.appendChild(com);
            com.addEventListener('click', () => {
                window.open(comEl.urls[0].url, '_blank');
            });

        });

        comic_section.appendChild(comCont);
    }
    catch (error) {
        console.log('No data found', error);
    }

});

search_btn.addEventListener('click', async () => {
    const input_val = com_input.value;

    if (com_input.value.trim < 1){
        alert('Please enter a comic title');
        return;
    } 

    comic_section.innerHTML = 
    `   
        <h1 class="section-heading" style="text-align: center;">
            ${input_val.toUpperCase()} COMICS
        </h1>
    `;

    const url = `http://localhost:3000/api/comics?title=${input_val}`;

    try{
        const comRes = await fetch(url);
        const comData = await comRes.json();

        console.log('API response:', comData);

        const comCont = document.createElement('div');
        
        comCont.className = 'comics-container';

        if (comData.data && comData.data.results.length > 0 ) {
            comData.data.results.forEach((comEl) => {

                const bgImage = comEl.thumbnail.path + '.' + comEl.thumbnail.extension;

                const com = document.createElement('div');
                com.className = 'comics';
                
                const comImg = document.createElement('div');
                comImg.className = 'com-image';
                comImg.style.backgroundImage = `url(${bgImage})`;

                const comTitle = document.createElement('h3');
                comTitle.innerHTML = comEl.title;

                const comCredits = document.createElement('p');
                comCredits.innerHTML = comData.attributionText;
                comCredits.className = 'credits';

                com.appendChild(comImg);
                com.appendChild(comTitle);
                com.appendChild(comCredits);

                comCont.appendChild(com);

                com.addEventListener('click', () => {
                    window.open(comEl.urls[0].url, '_blank');
                }); 

            });

            comic_section.appendChild(comCont);
        }
        else {
            console.log('No results or invalid data structure');
        }

    }catch(error){
        console.log('No comics found', error);
    }

});