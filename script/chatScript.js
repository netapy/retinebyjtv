//Initialisation 
setTimeout(() => {
    receiveMsg(testChatParams["deb"]);
}, 500);
let feed = document.querySelector('#messageFeed');
let inputZone = document.querySelector('#inputZone');

//Fonctions gestion sondage
function receiveMsg(content) {
    let toAdd = "<div class='msgBot'>###</div>".replace("###", content['q']);
    let answs = content['a'];
    let inputt = '';

    feed.insertAdjacentHTML("beforeend", toAdd);
    setTimeout(() => {
        document.querySelectorAll(".msgBot:last-child")[0].style.transform = "scale(1)";
    }, 1);

    if (answs["type"] == "mc") {
        console.log('mc');
        for (aa in answs['a']) {
            inputt = inputt.concat("<div class='col-6 p-2'><div class='userBtnInput' onclick='userSend(this)'>###</div></div>".replace("###", answs['a'][aa]));
        }
    } else if (answs["type"] == "cl") {
        console.log('cl');
    } else if (answs["type"] == "5s") {
        console.log('5s');
    }

    inputZone.insertAdjacentHTML('afterbegin', inputt);
    let btns = document.getElementsByClassName("userBtnInput"),
        ibtns;

    setTimeout(() => {
        for (ibtns = 0; ibtns < btns.length; ++ibtns) {
            btns[ibtns].style.transform = "scale(1)";
            btns[ibtns].style.opacity = "1";
        }
    }, 500);

}


function userSend(content) {
    console.log(content);
    inputZone.innerHTML = '';

    let toAdd = "<div class='msgUser'>###</div>".replace("###", content.innerHTML);

    feed.insertAdjacentHTML("beforeend", toAdd);
    setTimeout(() => {
        document.querySelectorAll(".msgUser:last-child")[0].style.transform = "scale(1)";
    }, 1);

};