let sondageTest = {
    "nomProj": "Les films en France",
    "projColor": "#6219D8",
    "creaDate": "08-02-2022",
    "projId": "256853",
    "nbRep": 250,
    "data": [{
            "q": "Quel est votre film préféré ?",
            "t": "mc",
            "r": 120,
            "d": {
                'Ratatouille': 52,
                'James Bond': 32,
                'blabla': 12
            },
        },
        {
            "q": "Quel est votre budget cinéma mensuel ?",
            "t": "num",
            "r": 120,
            "d": {
                'min': 5,
                'q1': 28,
                'mean': 76,
                'q3': 110,
                'max': 120,
                "std": 20
            },
        },
        {
            "q": "Quelle note ?",
            "t": "num",
            "r": 90,
            "d": {
                'min': 8,
                'q1': 14,
                'mean': 54,
                'q3': 60,
                'max': 90,
                "std": 20
            },
        },
        {
            "q": "Décrivez votre séance de cinéma",
            "t": "cl",
            "r": 120,
            "d": {
                'Positif': 52,
                'Negatif': 12
            },
        },
    ],
};


let chartColors = ['#2a00ac', '#7332e6', '#b768ff', '#f2a5fe', '#b7c0c6', '#848c92', '#545c61', '#283034'];

let numChartColors = [
    '#99A1A6E6',
    '#6219D8E6',
    '#6219D8E6',
    '#6219D8E6',
    '#99A1A6E6',
    '#99A1A6E6',
];

scaleParam = {
    x: {
        grid: {
            display: false
        },
        ticks: {
            stepSize: 1,
            beginAtZero: true,
        }
    },
    y: {
        grid: {
            display: false
        },
        ticks: {
            stepSize: 1,
            beginAtZero: true,
        }
    }
};

function copyGraph(c) {
    html2canvas(c).then(function (canvas) {
        canvas.toBlob(function (blob) {
            navigator.clipboard
                .write([
                    new ClipboardItem(
                        Object.defineProperty({}, blob.type, {
                            value: blob,
                            enumerable: true
                        })
                    )
                ])
                .then(function () {
                    Swal.fire(
                        'Graphique copié !',
                        'ctrl + v pour le coller n\importe où.',
                        'success'
                    );
                });
        })
    });
}

const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId),
        bodypd = document.getElementById(bodyId),
        headerpd = document.getElementById(headerId)

    if (toggle && nav && bodypd && headerpd) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
            toggle.classList.toggle('bx-x')
            bodypd.classList.toggle('body-pd')
            headerpd.classList.toggle('body-pd')
        })
    }
};

showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');

const linkColor = document.querySelectorAll('.nav_link')

function colorLink() {
    if (linkColor) {
        linkColor.forEach(l => l.classList.remove('active'))
        this.classList.add('active')
    }
}
linkColor.forEach(l => l.addEventListener('click', colorLink))

async function queryRtn(link) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Token " + xxgc('rtnt'));

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    return fetch("https://retinereq.jetevois.fr:8000" + link, requestOptions)
        .then(response => response.text())
        .then(result => {
            return result
        })
        .catch(error => {
            return error
        });
};

async function delSondRtn(num) {
    Swal.fire({
        title: 'Supprimer le sondage?',
        text: "Vous ne pourrez plus revenir en arrière.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Supprimer le sondage',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Token " + xxgc('rtnt'));

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                redirect: 'follow'
            };

            return fetch("https://retinereq.jetevois.fr:8000/sondages/" + num + "/", requestOptions)
                .then(response => response.text())
                .then(result => {
                    Swal.fire(
                        'Sondage supprimé',
                        'Votre sondage ainsi que les réponses ont été supprimés.',
                        'success'
                    );
                    changePage(dashProj, loadProjList);
                    return result
                })
                .catch(error => {
                    return error
                });
        }
    })
};

function shareBtn(e) {
    navigator.clipboard.writeText("retine.jetevois.fr/sondage#" + e.toString()).then(function () {
        Swal.fire(
            'Lien du sondage copié !',
            "retine.jetevois.fr/sondage#" + e.toString(),
            'success'
        );
    }, function () {
        console.log("error")
    });

};

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
var getDaysArray = function (s, e) {
    for (var a = [], d = new Date(s); d <= new Date(e); d.setDate(d.getDate() + 1)) {
        a.push(new Date(d));
    }
    return a;
};