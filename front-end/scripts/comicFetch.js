document.addEventListener('DOMContentLoaded', async () => {
    
    const url = `http://localhost:3000/api/creators?`;
    
    try {
        const response = await fetch(url);
        const Data = await response.json();
        
        console.log(Data);

    }
    catch (error) {
        console.log('No data found', error);
    }
});