function co() {
    serErrHandl('');
    if (document.querySelector('#exampleInputEmail1').value == '' || document.querySelector('#exampleInputPassword1').value == '') {
        serErrHandl("Veuillez remplir tous les champs ci-dessus.")
    } else {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "username": document.querySelector('#exampleInputEmail1').value,
            "password": document.querySelector('#exampleInputPassword1').value
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://retinereq.jetevois.fr:8000/authenticate/", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                if (Object.keys(JSON.parse(result))[0] == 'non_field_errors') {
                    serErrHandl("Identifiants incorrects.")
                } else {
                    serErrHandl("<span style='color: #2ECC71!important'>Connexion effectuée. Bienvenue sur Rétine.</span>");
                    xxsc("rtnt", JSON.parse(result)['token'], 30)
                    xxsc("rtnu", JSON.parse(result)['id'], 30)
                    window.location.href = "dashboard.html"
                }
            })
            .catch(error => serErrHandl(error));
    }
}

function ins() {
    serErrHandl('');
    if (document.querySelector('#exampleInputEmail2').value == '' || document.querySelector('#exampleInputPassword21').value == '' || document.querySelector('#exampleInputPassword22').value == '') {
        serErrHandl("Veuillez remplir tous les champs ci-dessus.")
    } else {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let raw = JSON.stringify({
            "email": document.querySelector('#exampleInputEmail2').value,
            "password1": document.querySelector('#exampleInputPassword21').value,
            "password2": document.querySelector('#exampleInputPassword22').value
        });

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://retinereq.jetevois.fr:8000/auth/registration/", requestOptions)
            .then(response => response.text())
            .then(result => {
                if (Object.keys(JSON.parse(result))[0] == 'non_field_errors') {
                    serErrHandl("Les mots de passe ne sont pas identiques.")
                } else if (Object.keys(JSON.parse(result))[0] == 'email') {
                    serErrHandl("Adresse mail non-valide ou déjà utilisée.")
                } else if (Object.keys(JSON.parse(result))[0] == 'password1') {
                    serErrHandl("Le mot de passe doit contenir au moins 8 caractères.")
                } else if (JSON.parse(result)[Object.keys(JSON.parse(result))[0]] == "Verification e-mail sent.") {
                    serErrHandl("<span style='color: #2ECC71!important'>Un e-mail de verification vous a été envoyé.</span>")
                }
            })
            .catch(error => console.log('error', error));
    }
}

function serErrHandl(msg) {
    let serverFeedZone = document.getElementsByClassName("serverFeedback")
    for (ii in serverFeedZone) {
        serverFeedZone[ii].innerHTML = msg
    };
}
