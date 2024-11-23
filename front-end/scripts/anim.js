const card_conts = document.querySelectorAll('.card-container');

let isSpread = false;

cardSpread();

function cardSpread(){

    card_conts.forEach((card_cont) =>{
        card_cont.addEventListener('click', () =>{
            const cards = card_cont.querySelectorAll('.card');
            cards.forEach((card) =>{
                if(isSpread === false){
                    card.classList.add('spread');
                    card_cont.style.zIndex = 100;
                    card_cont.classList.add('center-card-cont');
                }
                else{
                    card.classList.remove('spread');
                    card_cont.style.zIndex = 1;
                    card_cont.classList.remove('center-card-cont');
                }
            });
            {isSpread ? isSpread = false : isSpread = true};
        });
    });
}

console.log(isSpread);

