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
    "deb": {
        "q": "<p>Bonjour bienvenue dans cette courte démo de sondage Rétine !</p><p>J'aimerais tes poser quelques questions 😊</p>",
        "a": {
            'type': '1c',
            'suiv': 0,
            'a': ['Démarrer 🚀']
        }
    },
    "fin": "<p>Merci d'avoir répondu à ce sondage !</p><p>On espère te revoir bientôt 😊</p>",
    "content": [{
            "q": "Quelle est ta couleur préférée ? ",
            "a": {
                'type': '1c',
                'suiv': 1,
                'a': ['Vert 🟢', 'Bleu 🔵', 'Jaune 🟡', 'Rouge 🔴']
            }
        },
        {
            "q": "Comment tu t'appelles ?",
            "a": {
                'suiv': 2,
                'type': 'cl',
            }
        },
        {
            "q": "Quels films as-tu vu récemment ? ",
            "a": {
                'type': 'mc',
                'suiv': 3,
                'a': ['Pirate des caraibes', 'Terminator', 'Amélie Poulain', 'Hercules Poirot',
                    'Ratatouille'
                ]
            }
        },
        {
            "q": "Combien de films en moyenne regardes-tu chaque semaine ?",
            "a": {
                'type': 'num',
                'suiv': 4,
                'a': [0, 2042]
            }
        },
        {
            "q": "Une petite question test comme ça pour voir la longueur du sondage et tester le scroll ?",
            "a": {
                'type': '1c',
                'suiv': 5,
                'a': ['Yes 🚀', 'Go 🥸']
            }
        },
        {
            "q": "Quelle note attribuerais-tu à cet échange ?",
            "a": {
                'type': '5s',
                'suiv': 'end',
            }
        },
    ]
}