let sondageEnCreation = {
    "jsonContent": [{
        "q": "Bienvenue dans ce sondage ! 🤗 ",
        "a": {
            'type': '1c',
            'a': ['Démarrer 🚀']
        }
    }, {
        "q": "Merci pour votre participation ! 🎉",
        "a": {
            'type': 'fin',
        }
    }, ]
};

const updateCells = () => {
    let theTree = document.querySelector("#theTree")
    theTree.innerHTML = "";

    for (ii in sondageEnCreation['jsonContent']) {
        if (ii == 0) {
            let sonQuestionNode = "<li><code class='firstQ' data-qorder='" + ii + "' onclick='createCell(this)'>" + sondageEnCreation['jsonContent'][ii]['q'] + "</code></li>";
            document.querySelector('#theTree').insertAdjacentHTML("beforeend", sonQuestionNode);
        } else {
            let sonQuestionNode = "<ul><li><code style='" + dicColorCells[sondageEnCreation['jsonContent'][ii]['a']['type']] + "' ondrop='drop(event)' ondragover='allowDrop(event)' ondragstart='drag(event)' ondragleave='dragLeave(event)' draggable='true' data-qorder='" + ii + "' onclick='createCell(this)'>" + sondageEnCreation['jsonContent'][ii]['q'] + "</code></li></ul>";
            document.querySelectorAll('code')[document.querySelectorAll('code').length - 1].insertAdjacentHTML("afterend", sonQuestionNode);
        }
    };
    document.querySelectorAll('code')[document.querySelectorAll('code').length - 2].insertAdjacentHTML("afterend", "<ul><li><code class='outlineQ' data-qorder='new' onclick='createCell(this)'>➕ Nouvelle question</code></li></ul>");
}

const createCell = (elem) => {
    let qModel;
    let popupHeader;
    let suppronoff = false;
    if (elem.dataset.qorder == "new") {
        qModel = {
            "q": "",
            "a": {
                'a': " ",
                'type': "",
            }
        };
        popupHeader = "Nouvelle question ✨";
    } else {
        qModel = {
            "q": sondageEnCreation['jsonContent'][elem.dataset.qorder]["q"],
            "a": {
                'a': sondageEnCreation['jsonContent'][elem.dataset.qorder]["a"]["a"],
                'type': sondageEnCreation['jsonContent'][elem.dataset.qorder]["a"]["type"],
            }
        };
        popupHeader = "Modifier la question ✏️";
        if (elem.dataset.qorder != "0" && elem.dataset.qorder != (sondageEnCreation['jsonContent'].length - 1).toString()) {
            suppronoff = true;
        }
    }
    Swal.fire({
        html: '<div class="p-3 w-100 text-center" style="min-width:300px"><h4 class="mb-4">' + popupHeader + '</h4><div><textarea id="outQuestion" class="fieldQ" placeholder="Comment est votre blanquette ?"></textarea></div><h><div><select class="fieldQ" name="qtype" id="qtypefield" onChange="document.querySelector(\'#ansWriteZone\').innerHTML = dicQFields[this.value]"><option value="" selected disabled>Choisir un type de réponse</option><option value="1c">Choix Unique</option><option value="mc">Choix Multiple</option><option value="cl">Champs libre</option><option value="num">Numéro</option><option value="5s">Notation</option></select></div><div id="ansWriteZone"></div></div>',
        didRender: (e) => {
            e.querySelector('#outQuestion').value = qModel['q'];
            e.querySelector("#qtypefield").value = qModel['a']['type'];

            if (qModel['a']['type'] == "1c" || qModel['a']['type'] == "mc") {
                e.querySelector('#ansWriteZone').innerHTML = dicQFields[qModel['a']['type']].replace(inputQForm, "");
                for (ii in qModel['a']['a']) {
                    e.querySelector('#ansWriteZone').insertAdjacentHTML("beforeend", inputQForm.replace("value=''", "value='" + qModel['a']['a'][ii] + "'").replace('</', "<span class='crossRem' onClick=\"this.parentElement.remove()\">❌</span></"))
                }
            } else if (qModel['a']['type'] == "cl") {
                e.querySelector('#ansWriteZone').innerHTML = dicQFields[qModel['a']['type']];
                e.querySelector('#nbCaracLimit').value = qModel['a']['a'][0];
            } else if (qModel['a']['type'] == "num") {
                e.querySelector('#ansWriteZone').innerHTML = dicQFields[qModel['a']['type']];
                e.querySelector('#nbMin').value = qModel['a']['a'][0];
                e.querySelector('#nbMax').value = qModel['a']['a'][1];
            } else if (qModel['a']['type'] == "fin") {
                e.querySelector("#qtypefield").insertAdjacentHTML('beforeend', '<option value="fin" selected>Fin</option>');
                e.querySelector("#qtypefield").disabled = true;
            };

        },
        preConfirm: () => {
            let qtype = document.querySelector("#qtypefield").value;
            let qA;
            if (qtype == "1c" || qtype == "mc") {
                qA = [...document.querySelectorAll(".fieldQlil")].map((e) => e.value).filter(Boolean);
            } else if (qtype == "cl") {
                qA = [document.querySelector('#nbCaracLimit').value];
            } else if (qtype == "5s") {
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

            if (repFinal['q'] == '' || repFinal['a']['type'] == '' || (['1c', 'mc'].includes(repFinal['a']['type']) && repFinal['a']['a'].length == 0) || verifCoherenceChiffre()) {
                return false;
            } else {
                return [repFinal, elem];
            }
        },
        confirmButtonText: 'Enregistrer',
        showDenyButton: suppronoff,
        denyButtonText: `Supprimer`,
        denyButtonColor: "#616163",
        reverseButtons: true
    }).then((res) => {
        if (res.isDismissed == true) {
            console.log("abort creation");
        } else if (res.isDenied == true) {
            console.log("delete question !!!");
            sondageEnCreation['jsonContent'].splice(elem.dataset.qorder, 1);
            updateCells();
            reiniTialisationChat(sondageEnCreation);
        } else {
            if (elem.dataset.qorder == "new") {
                sondageEnCreation['jsonContent'].splice(sondageEnCreation['jsonContent'].length - 1, 0, res.value[0]);
            } else {
                sondageEnCreation['jsonContent'].splice(elem.dataset.qorder, 1, res.value[0]);
            }
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

let inputQForm = "<div><input type='text' class='fieldQlil' onKeyUp='newFieldon(event,this)' value=''></div>";

let dicQFields = {
    "1c": "<h5>Les réponses</h5>" + inputQForm,
    "mc": "<h5>Les réponses</h5>" + inputQForm,
    "cl": '<div><label for="nbCaracLimit">Limite de caractères </label><input class="fieldQlilnum" type="number" id="nbCaracLimit" name="nbCaracLimit" min="1" max="140" value="100"></div><div><p>💡 Rétine analysera automatiquement le sentiment dégagé par chacune des réponses pour établir des statistiques visibles sur votre dashboard des résultats.</p></div>',
    "num": '<label for="nbMin">Minimum </label><input class="fieldQlilnum" type="number" id="nbMin" name="nbMin" value="0" onchange="verifCoherenceChiffre() ? this.style.backgroundColor = \'#ff00004a\' : this.style.backgroundColor = \'\'"><br><label for="nbMax">Maximum </label><input class="fieldQlilnum" type="number" id="nbMax" name="nbMax" value="24" onchange="verifCoherenceChiffre() ? this.style.backgroundColor = \'#ff00004a\' : this.style.backgroundColor = \'\'">',
    "5s": "<div>L'utilisateur pourra donner une note de 1 à 5.</div>",
};

function allowDrop(ev) {
    ev.preventDefault();
    ev.target.style.backgroundColor = "#DEDBE1";

};

function dragLeave(ev) {
    ev.preventDefault();
    ev.target.style.backgroundColor = "";
};

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.dataset.qorder);
};

function drop(ev) {
    ev.preventDefault();

    arraymove(sondageEnCreation['jsonContent'], parseInt(ev.dataTransfer.getData("text")), parseInt(ev.target.dataset.qorder));

    updateCells();
    reiniTialisationChat(sondageEnCreation);
};

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function verifCoherenceChiffre() {
    if (document.getElementById("qtypefield").value == "num") {
        let vmin = parseInt(document.getElementById("nbMin").value);
        let vmax = parseInt(document.getElementById("nbMax").value);
        if (vmin >= vmax) {
            return true;
        }
    } else {
        return false;
    };
}

let dicColorCells = {
    "1c": "border-color: #8792FDb0",
    "mc": "border-color: #6219D8b0",
    "cl": "border-color: #7aad89b0",
    "num": "border-color: #FF5964b0",
    "5s": "border-color: #FBB13Cb0",
    "fin": "background-color: #2FCC72;color:white; border-width:0;"
}

let dicSuiteCible = {
    "conn": "à qui je vais envoyer le lien du sondage.",
    "inco": "ciblés par Rétine sur les réseaux sociaux."
};

const validateSondage = () => {
    var myHeaders = new Headers();
    let contenuSondage = JSON.stringify(sondageEnCreation['jsonContent'])
    myHeaders.append("Authorization", "Token d68c1fd60f47f59d5e3c5f5f393d143ae8c28e4e");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "nom_proj": "Sondage1",
        "jsonContent": contenuSondage,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://retinereq.jetevois.fr:8000/sondages/", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result)
            Swal.fire(
                'Le sondage est publié!',
                '(c\'est faux)',
                'success'
            );
        })
        .catch(error => console.log('error', error));


};