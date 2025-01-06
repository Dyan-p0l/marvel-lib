// document.addEventListener('DOMContentLoaded', async () => {
    
//     const url = `http://localhost:3000/api/creators?`;
    
//     try {
//         const response = await fetch(url);
//         const Data = await response.json();
        
//         console.log(Data);

//     }
//     catch (error) {
//         console.log('No data found', error);
//     }
// });


document.addEventListener('DOMContentLoaded', async () => {
    
    const url = `http://localhost:3000/api/comics`;

    try {
        const response = await fetch(url);

        const comData = await response.json();
        console.log(comData);

    }
    catch (error) {
        console.log('No data found', error);
    }

});