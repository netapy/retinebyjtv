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

let userProjects = [{
    "nomProj": "Mon projet de foot",
    "projColor": "#6219D8",
    "creaDate": "08-02-2022",
    "projId": "256853",
    "nbRep": 250
}, {
    "nomProj": "Consommation de légumes en France",
    "projColor": "#2FCC72",
    "creaDate": "25-02-2022",
    "projId": "255235",
    "nbRep": 98
}, {
    "nomProj": "Enquête utilisateurs",
    "projColor": "#777EF2",
    "creaDate": "16-02-2022",
    "projId": "353156",
    "nbRep": 124
}, ];


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
        }
    },
    y: {
        grid: {
            display: false
        },
        ticks: {
            beginAtZero: true,
            maxTicksLimit: 4,
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


var testChatParams = {
    "content": [{
            "q": "<p>Bonjour bienvenue dans cette courte démo de sondage Rétine !</p><p>J'aimerais tes poser quelques questions 😊</p> ",
            "a": {
                'type': '1c',
                'a': ['Démarrer 🚀']
            }
        },
        {
            "q": "Quelle est ta couleur préférée ? ",
            "a": {
                'type': '1c',
                'a': ['Vert 🟢', 'Bleu 🔵', 'Jaune 🟡', 'Rouge 🔴']
            }
        },
        {
            "q": "Comment tu t'appelles ?",
            "a": {
                'type': 'cl',
            }
        },
        {
            "q": "Quels films as-tu vu récemment ? ",
            "a": {
                'type': 'mc',
                'a': ['Pirate des caraibes', 'Terminator', 'Amélie Poulain', 'Hercules Poirot', 'Ratatouille']
            }
        },
        {
            "q": "Combien de films en moyenne regardes-tu chaque semaine ?",
            "a": {
                'type': 'num',
                'a': [0, 2042]
            }
        },
        {
            "q": "Une petite question test comme ça pour voir la longueur du sondage et tester le scroll ?",
            "a": {
                'type': '1c',
                'a': ['Yes 🚀', 'Go 🥸']
            }
        },
        {
            "q": "Quelle note attribuerais-tu à cet échange ?",
            "a": {
                'type': '5s',
            }
        },
        {
            "q": "<p>Merci d'avoir répondu à ce sondage !</p><p>On espère te revoir bientôt 😊</p>",
            "a": {
                'type': 'fin',
                'suiv': 'end',
            }
        },

    ]
};





const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId),
        bodypd = document.getElementById(bodyId),
        headerpd = document.getElementById(headerId)

    if (toggle && nav && bodypd && headerpd) {
        toggle.addEventListener('click', () => {
            // show navbar
            nav.classList.toggle('show')
            // change icon
            toggle.classList.toggle('bx-x')
            // add padding to body
            bodypd.classList.toggle('body-pd')
            // add padding to header
            headerpd.classList.toggle('body-pd')
        })
    }
}

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

    return fetch("http://ec2-13-38-8-225.eu-west-3.compute.amazonaws.com:8000" + link, requestOptions)
        .then(response => response.text())
        .then(result => {
            return result
        })
        .catch(error => {
            return error
        });
}