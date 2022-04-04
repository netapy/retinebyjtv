//DEMO PURPOSE
chatContent = testChatParams;


//Initialisation 
setTimeout(() => {
    receiveMsg(chatContent["deb"]);
}, 500);

let feed = document.querySelector('#messageFeed');
let inputZone = document.querySelector('#inputZone');
let scrollZone = document.querySelectorAll('.scrollbehavior:last-child')[0];

//Fonctions gestion sondage
function receiveMsg(content) {
    let toAdd = "<div class='msgBot'><p>###</p></div>".replace("###", content['q']);
    let answs = content['a'];
    let inputt = '';

    feed.insertAdjacentHTML("beforeend", toAdd);
    setTimeout(() => {
        document.querySelectorAll(".msgBot:last-child")[0].style.transform = "scale(1)";
    }, 1);

    if (answs["type"] == "mc") {

        for (aa in answs['a']) {
            inputt = inputt.concat("<div class='col-6 p-2'><div class='userBtnInput' data-no='[#id#]' onclick='userSend(this.innerHTML, this.dataset.no)'>[#cont#]</div></div>".replace("[#cont#]", answs['a'][aa]).replace("[#id#]", answs['suiv']));
        }

    } else if (answs["type"] == "cl") {

        inputt = "<div class='col-12 userBtnInput row p-2 m-auto'><div class='col-10 p-2'><input id='inputUser' class='w-100 userFieldInput' type='text' placeholder='Dites nous tout...'></div><div data-no='[#id#]' class='col-2 d-flex flex-column flex-align-center justify-content-center' onclick='userSend(document.querySelector(\"#inputUser\").value, this.dataset.no)'><img src='img/icons/send-circle.svg' class='h-75'></div></div>".replace("[#id#]", answs['suiv']);
        console.log('cl');


    } else if (answs["type"] == "5s") {
        console.log('5s');
    }

    inputZone.insertAdjacentHTML('afterbegin', inputt);
    let btns = document.getElementsByClassName("userBtnInput"),
        ibtns;
    scrollZone.scrollTop = scrollZone.scrollHeight;
    setTimeout(() => {
        for (ibtns = 0; ibtns < btns.length; ++ibtns) {
            btns[ibtns].style.transform = "scale(1)";
            btns[ibtns].style.opacity = "1";
        }
    }, 500);

}


function userSend(content, suiv) {
    inputZone.innerHTML = '';

    let toAdd = "<div class='msgUser'>###</div>".replace("###", content);

    scrollZone.scrollTop = scrollZone.scrollHeight;
    
    feed.insertAdjacentHTML("beforeend", toAdd);
    setTimeout(() => {
        document.querySelectorAll(".msgUser:last-child")[0].style.transform = "scale(1)";
    }, 1);


    setTimeout(() => {
        receiveMsg(chatContent['content'][suiv]);
    }, 500);
    
};