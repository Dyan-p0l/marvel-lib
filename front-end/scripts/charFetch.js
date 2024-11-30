const input_field = document.getElementById('search-input-js');
const btn_clicker = document.getElementById('search-btn-js');
const section = document.getElementById('search-result-sec');

const list_cont = document.querySelector('.list');

function displayNames(value) {
    input_field.value = value;
    list_cont.innerHTML = '';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter'){
        btn_clicker.click();
    }
});

// input_field.addEventListener('keyup', async () => {

//     const input_val = input_field.value;

//     list_cont.innerHTML = '';
    
//     if(input_val.length < 4){
//         return false;
//     }

//     const url = `http://localhost:3000/api/characters?nameStartsWith=${input_val}`;

//     const response = await fetch(url);
//     const jsonData = await response.json();
    
//     console.log(jsonData);

//     if(jsonData.data && jsonData.data.results.length > 0){
//         jsonData.data.results.forEach((element) => {
//             let val = element.name;
//             let word = val.substr(0, input_field.value.length);
//             word += val.substr(input_field.value.length);
    
//             list_cont.innerHTML += 
//             `<div class="name-suggest" style="cursor: pointer;">
//                 <p class="item">${word}</p>
//             </div>`;

//             const suggestDiv = document.querySelectorAll('.name-suggest');
//             suggestDiv.forEach((namediv) => {
//                 namediv.addEventListener('click', () => {
//                     displayNames(val);
//                 });
//             });

//         });
//     }else{
//         console.log('No results or invalid data structure');
//     }
// });

input_field.addEventListener('keyup', async () => {
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
                console.log(element);
            });
        } else {
            console.log('No results found');
        }
    } catch (error) {
        console.error('Error fetching character data:', error);
    }
});