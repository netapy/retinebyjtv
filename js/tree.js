let sondageEnCreation = {
    "content": [{
        "q": "Bienvenue dans ce sondage ! 🤗 ",
        "a": {
            'type': '1c',
            'a': ['Démarrer 🚀']
        }
    }, ]
};

const updateCells = () => {
    let theTree = document.querySelector("#theTree")
    theTree.innerHTML = "";

    for (ii in sondageEnCreation['content']) {
        if (ii == 0) {
            let sonQuestionNode = "<li><code data-qorder='0' onclick='createCell(this)'>" + sondageEnCreation['content'][ii]['q'] + "</code></li>";
            document.querySelector('#theTree').insertAdjacentHTML("beforeend", sonQuestionNode);
        } else {
            let sonQuestionNode = "<ul><li><code data-qorder='0' onclick='createCell(this)'>" + sondageEnCreation['content'][ii]['q'] + "</code></li></ul>";
            document.querySelectorAll('code')[document.querySelectorAll('code').length - 1].insertAdjacentHTML("afterend", sonQuestionNode);
        }
    };
    document.querySelectorAll('code')[document.querySelectorAll('code').length - 1].insertAdjacentHTML("afterend", "<ul><li><code class='outlineQ' data-qorder='0' onclick='createCell(this)'>➕ Nouvelle question</code></li></ul>");
}

const createCell = (elem) => {
    Swal.fire({
        html: '<div class="p-3 w-100 text-center" style="min-width:300px"><h4 class="mb-4">Nouvelle question ✨</h4><div><input id="outQuestion" class="fieldQ" type="text" placeholder="Comment est votre blanquette ?"></div><h><div><select class="fieldQ" name="qtype" id="qtypefield" onChange="document.querySelector(\'#ansWriteZone\').innerHTML = dicQFields[this.value]"><option value="" selected disabled>Choisir un type de réponse</option><option value="1c">Choix Unique</option><option value="mc">Choix Multiple</option><option value="cl">Champs libre</option><option value="num">Numéro</option><option value="5s">Notation</option></select></div><div id="ansWriteZone"></div><div><select class="fieldQ" name="qtype" id="qtypefield2"><option value="" selected disabled>Choisir la suite</option><option value="1">Une autre question</option><option value="end">Fin du sondage</option></select></div></div>',
        preConfirm: () => {
            let qtype = document.querySelector("#qtypefield").value;
            let qFollow = document.querySelector("#qtypefield2").value
            let qA;
            if (qtype == "1c" || qtype == "mc") {
                qA = [...document.querySelectorAll(".fieldQlil")].map((e) => e.value).filter(Boolean);
            } else if (qtype == "cl" || qtype == "5s") {
                qA = "no";
            } else if (qtype == "num") {
                qA = [document.querySelector('#nbMin').value, document.querySelector('#nbMax').value];
            };
            let repFinal = {
                "q": document.querySelector("#outQuestion").value,
                "a": {
                    'a': qA,
                    'type': qtype,
                    'suiv': parseInt(elem.dataset.qorder) + 1
                }
            }

            if (repFinal['q'] == '' || repFinal['a']['type'] == '' || (['1c', 'mc'].includes(repFinal['a']['type']) && repFinal['a']['a'].length == 0) || qFollow == '') {
                return false;
            } else {
                return [repFinal, elem];
            }
        }
    }).then((res) => {
        if (res.isDismissed == true) {
            console.log("abort creation")
        } else {
            sondageEnCreation['content'].push(res.value[0]);
            updateCells();
            reiniTialisationChat(sondageEnCreation);
        }
    });
};


const newFieldon = (e, input) => {
    if (input.value != "" && document.querySelectorAll(".fieldQlil")[document.querySelectorAll(".fieldQlil").length - 1].value != '' && document.querySelectorAll(".fieldQlil").length < 9) {
        input.parentElement.insertAdjacentHTML('afterend', inputQForm.replace('</', "<span class='crossRem' onClick=\"this.parentElement.remove()\">❌</span></"));

    };
    if (e.keyCode == 13) {
        document.querySelectorAll(".fieldQlil")[document.querySelectorAll(".fieldQlil").length - 1].focus();
    }
};

let inputQForm = "<div><input type='text' class='fieldQlil' onKeyUp='newFieldon(event,this)'></div>";

let dicQFields = {
    "1c": "<h5>Les réponses</h5>" + inputQForm,
    "mc": "<h5>Les réponses</h5>" + inputQForm,
    "cl": '<label for="nbCaracLimit">Limite de caractères </label><input class="fieldQlilnum" type="number" id="nbCaracLimit" name="nbCaracLimit" min="1" max="140" value="100">',
    "num": '<label for="nbMin">Minimum </label><input class="fieldQlilnum" type="number" id="nbMin" name="nbMin" value="0"><br><label for="nbMax">Maximum </label><input class="fieldQlilnum" type="number" id="nbMax" name="nbMax" value="24">',
    "5s": "<div>L'utilisateur pourra donner une note de 1 à 5.</div>",
};