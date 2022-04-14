let feed = document.querySelector('#messageFeed');
let inputZone = document.querySelector('#inputZone');
let scrollZone = document.querySelectorAll('.scrollbehavior:last-child')[0];
let userAnswers = [];

const reiniTialisationChat = (cont) => {
    //DEMO PURPOSE
    chatContent = cont;
    feed.innerHTML = "";
    inputZone.innerHTML = "";
    userAnswers = [];
    //Initialisation 
    setTimeout(() => {
        receiveMsg(chatContent['content'][0]);
    }, 500);
}

//Fonctions gestion sondage
function receiveMsg(content) {
    console.log(content)
    let qIndex = sondageEnCreation['content'].indexOf(content);
    let toAdd = "<div class='msgBot'><p>###</p></div>".replace("###", content['q']);
    let answs = content['a'];
    let inputt = '';

    feed.insertAdjacentHTML("beforeend", toAdd);
    setTimeout(() => {
        document.querySelectorAll(".msgBot:last-child")[0].style.transform = "scale(1)";
    }, 1);

    if (answs["type"] == "1c") {
        let col = answerLength(answs['a']);
        for (aa in answs['a']) {
            inputt = inputt.concat("<div class='" + col + " p-2'><div class='userBtnInput' data-no='[#id#]' onclick='userSend(this.innerHTML, this.dataset.no)'>[#cont#]</div></div>".replace("[#cont#]", answs['a'][aa]).replace("[#id#]", qIndex));
        }
    } else if (answs["type"] == "mc") {
        for (aa in answs['a']) {
            inputt = inputt.concat("<div class='col-12 p-2'><div class='userBtnInput mcqChoice' onclick='multipleChoiceBeh(this)'>[#cont#]</div></div>".replace("[#cont#]", answs['a'][aa]));
        };
        inputt = inputt.concat('<div class="col-12 my-3 text-center"><div class="userBtnInput ml-auto btnEnvoyer" data-no="[#id#]" onclick="validateMultipleChoice(this.dataset.no)">Envoyer</div></div>'.replace("[#id#]", qIndex))
    } else if (answs["type"] == "cl") {
        inputt = "<div class='col-12 userBtnInput row p-2 m-auto'><div class='col-10 p-2'><input id='inputUser' class='w-100 userFieldInput' type='text' placeholder='Dites nous tout...' ></div><div data-no='[#id#]' class='col-2 p-1 d-flex flex-column flex-align-center justify-content-center' onclick='userSend(document.querySelector(\"#inputUser\").value, this.dataset.no)'><img src='img/icons/send-circle.svg' style='height: 3rem;'></div></div>".replace("[#id#]", qIndex);
    } else if (answs["type"] == "num") {
        inputt = "<div class='col-12 userBtnInput row p-2 m-auto'><div class='col-2 m-auto' style='height:fit-content'></div><div class='col-8 p-2'><input id='inputUser' class='w-100 h-100 userFieldInput form-range' type='range' min='[#min#]' max='[#max#]' oninput='this.parentElement.previousElementSibling.innerHTML = this.value'></div><div data-no='[#id#]' class='col-2 p-1 d-flex flex-column flex-align-center justify-content-center' onclick='userSend(document.querySelector(\"#inputUser\").value, this.dataset.no)'><img src='img/icons/send-circle.svg'></div></div>".replace("[#id#]", qIndex).replace("[#min#]", answs['a'][0]).replace("[#max#]", answs['a'][1]);
    } else if (answs["type"] == "5s") {
        inputt = '<div class="col-12 d-flex align-items-center justify-content-center"><div class="rate input" data-no="[#id#]"><input type="radio" id="star5" name="rate" value="5" onclick="starhHandle(this)" /><label for="star5" title="text">5 stars</label><input type="radio" id="star4" name="rate" value="4" onclick="starhHandle(this)" /><label for="star4" title="text">4 stars</label><input type="radio" id="star3" name="rate" value="3" onclick="starhHandle(this)" /><label for="star3" title="text">3 stars</label><input type="radio" id="star2" name="rate" value="2" onclick="starhHandle(this)" /><label for="star2" title="text">2 stars</label><input type="radio" id="star1" name="rate" value="1" onclick="starhHandle(this)" /><label for="star1" title="text">1 star</label></div></div>'.replace("[#id#]", qIndex);
    } else if (answs["type"] == "fin") {
        setTimeout(() => {
            scrollZone.scrollTop = scrollZone.scrollHeight;
        }, 500);
        var xhr = new XMLHttpRequest();
        var now = new Date();
        //TODO remplacer url par la bonne
        xhr.open("POST", "jetevois.fr", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        //TODO ajouter autres infos navigateurs
        let ans = JSON.stringify({
            time: now,
            values: userAnswers,
        });
        console.log(ans);
        xhr.send(ans);

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
    }, 10);

    userAnswers.push(content);

    if (parseInt(suiv) + 1 == chatContent['content'].length) {
        console.log('finito')
    } else {
        setTimeout(() => {
            console.log(suiv)
            console.log(chatContent)
            receiveMsg(chatContent['content'][parseInt(suiv) + 1]);
        }, 500);
    }
};

//other functions

function multipleChoiceBeh(elem) {
    if (elem.style.color != "white") {
        elem.style.color = "white";
        elem.style.backgroundColor = "#6219D8";
    } else {
        elem.style.color = "black";
        elem.style.backgroundColor = "#FAF7FF";
    };
}

function validateMultipleChoice(number) {
    let choices = document.getElementsByClassName('mcqChoice'),
        ibtns;
    let rep = [];
    for (ibtns = 0; ibtns < choices.length; ++ibtns) {
        if (choices[ibtns].style.color == 'white') rep.push(choices[ibtns].innerHTML)
    };
    userSend(rep.join(", "), number);
}

function answerLength(liste) {
    let len = "col-6"
    for (ii in liste) {
        if (liste[ii].length > 8) {
            len = "col-12";
            break;
        };
    };
    return len
}

function starhHandle(star) {
    let stars = "";
    let ii = 0
    while (ii < star.value) {
        stars = stars.concat("⭐");
        ii++
    }
    userSend(stars, star.parentElement.dataset.no)
}