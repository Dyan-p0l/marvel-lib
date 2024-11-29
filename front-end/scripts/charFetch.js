const input_field = document.getElementById('search-input-js');
const btn_clicker = document.getElementById('search-btn-js');
const section = document.getElementById('search-result-sec');
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
