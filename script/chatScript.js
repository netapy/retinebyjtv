let feed,
    inputZone,
    scrollZone,
    userAnswers,
    percentAdv

const reiniTialisationChat = (cont) => {
    //DEMO PURPOSE
    feed = document.querySelector('#messageFeed');
    inputZone = document.querySelector('#inputZone');
    scrollZone = document.querySelectorAll('.scrollbehavior:last-child')[0];
    percentAdv = 0;

    chatContent = cont;
    feed.innerHTML = "";
    inputZone.innerHTML = "";
    userAnswers = [];
    //Initialisation 
    setTimeout(() => {
        receiveMsg(chatContent['jsonContent'][0]);
    }, 500);
}

//Fonctions gestion sondage
function receiveMsg(content) {
    let qIndex = chatContent['jsonContent'].indexOf(content);
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
        inputt = "<div class='col-12 userBtnInput row p-2 m-auto'><div class='col-10 p-2'><input id='inputUser' class='w-100 userFieldInput' type='text' placeholder='Dites nous tout...' ></div><div data-no='[#id#]' class='col-2 p-1 d-flex flex-column flex-align-center justify-content-center' onclick='validateChampLibre(this.dataset.no)'><img src='/img/icons/send-circle.svg' style='height: 3rem;'></div></div>".replace("[#id#]", qIndex);
    } else if (answs["type"] == "num") {
        inputt = "<div class='col-12 userBtnInput row p-2 m-auto'><div class='col-2 m-auto' style='height:fit-content'>-</div><div class='col-8 p-2'><input id='inputUser' class='w-100 h-100 userFieldInput form-range' type='range' min='[#min#]' max='[#max#]' oninput='this.parentElement.previousElementSibling.innerHTML = this.value'></div><div data-no='[#id#]' class='col-2 p-1 d-flex flex-column flex-align-center justify-content-center' onclick='userSend(document.querySelector(\"#inputUser\").value, this.dataset.no)'><img src='/img/icons/send-circle.svg'></div></div>".replace("[#id#]", qIndex).replace("[#min#]", answs['a'][0]).replace("[#max#]", answs['a'][1]);
    } else if (answs["type"] == "5s") {
        inputt = '<div class="col-12 d-flex align-items-center justify-content-center"><div class="rate input" data-no="[#id#]"><input type="radio" id="star5" name="rate" value="5" onclick="starhHandle(this)" /><label for="star5" title="text">5 stars</label><input type="radio" id="star4" name="rate" value="4" onclick="starhHandle(this)" /><label for="star4" title="text">4 stars</label><input type="radio" id="star3" name="rate" value="3" onclick="starhHandle(this)" /><label for="star3" title="text">3 stars</label><input type="radio" id="star2" name="rate" value="2" onclick="starhHandle(this)" /><label for="star2" title="text">2 stars</label><input type="radio" id="star1" name="rate" value="1" onclick="starhHandle(this)" /><label for="star1" title="text">1 star</label></div></div>'.replace("[#id#]", qIndex);
    } else if (answs["type"] == "fin") {
        if (scode != "demo") {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "client_info": JSON.stringify(navigator.userAgentData),
                "jsonContent": JSON.stringify(userAnswers)
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("https://retinereq.jetevois.fr:8000/rep/" + scode + "/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log(result);
                    setTimeout(() => {
                        feed.insertAdjacentHTML("beforeend", '<div class="p-4 endAnim"><lottie-player src="https://assets5.lottiefiles.com/packages/lf20_wsdetkrm.json" background="transparent"  speed="1"  style="width: 100%;" autoplay></lottie-player></div>');
                        scrollZone.scrollTop = scrollZone.scrollHeight;
                    }, 100);

                })
                .catch(error => {
                    console.log('error', error)
                    feed.insertAdjacentHTML("beforeend", "<div class='m-auto p-3 text-center'>Une erreur est survenue. Vérifiez que vous êtes bien connectés à internet .</div>")
                });
        } else {
            setTimeout(() => {
                feed.insertAdjacentHTML("beforeend", '<div class="p-4 endAnim"><lottie-player src="https://assets5.lottiefiles.com/packages/lf20_wsdetkrm.json" background="transparent"  speed="1"  style="width: 100%;" autoplay></lottie-player></div>');
                scrollZone.scrollTop = scrollZone.scrollHeight;
            }, 100);
        }
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

function userSend(content, numQ) {
    inputZone.innerHTML = '';
    let toAdd = "<div class='msgUser'>###</div>".replace("###", content);
    scrollZone.scrollTop = scrollZone.scrollHeight;
    feed.insertAdjacentHTML("beforeend", toAdd);
    percentAdv = Math.round(((parseInt(numQ) + 1) / (chatContent['jsonContent'].length - 1)) * 100)
    animateCountUp(parseInt(document.querySelector('#pourcentageAdv').innerHTML), percentAdv);
    setTimeout(() => {
        document.querySelectorAll(".msgUser:last-child")[0].style.transform = "scale(1)";
    }, 10);
    userAnswers.push({
        "n": numQ,
        "t": chatContent['jsonContent'][numQ]["a"]["type"],
        "a": content
    });

    setTimeout(() => {
        receiveMsg(chatContent['jsonContent'][parseInt(numQ) + 1]);
    }, 500);

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
    if (rep.length==0) {
        console.log("no answer")
    } else {
        userSend(rep.join(", "), number);
    }
}

function validateChampLibre(number) {
    let choices = document.getElementsByClassName('mcqChoice');
    let rep = document.querySelector("#inputUser").value;
    if (rep.length == 0) {
        console.log("no answer")
    } else {
        userSend(rep, number);
    }
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
};

const animationDuration = 2000;
const frameDuration = 1000 / 60;
const totalFrames = Math.round(animationDuration / frameDuration);
const easeOutQuad = t => t * (2 - t);

const animateCountUp = (depart, arrivee) => {
    let frame = depart;
    let el = document.querySelector('#pourcentageAdv');
    const countTo = arrivee;
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentCount = Math.round(countTo * progress);
        if ((arrivee +1) !== currentCount && currentCount > depart) {
            el.innerHTML = currentCount.toString() + "%";
        }
        if (frame === totalFrames) {
            clearInterval(counter);
        }
    }, frameDuration);
};