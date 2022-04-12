let sondageTest = {
    "nomProj": "Les films en France",
    "projColor": "#6219D8",
    "creaDate": "08-02-2022",
    "projId": "256853",
    "nbRep": 250,
    "data": [{
            "q": "Quel est votre film préféré ?",
            "t": "mc",
            "d": {
                'Ratatouille': 52,
                'James Bond': 32,
                'blabla': 12
            },
        },
        {
            "q": "Quel est votre budget cinéma mensuel ?",
            "t": "num",
            "d": {
                'min': 5,
                'max': 120,
                'q1': 28,
                'mean': 76,
                'q3': 110,
                "std": 20
            },
        },
        {
            "q": "Décrivez votre séance de cinéma",
            "t": "cl",
            "d": {
                'pos': 52,
                'neg': 12
            },
        },
        {
            "q": "Quelle note ?",
            "t": "num",
            "d": {
                'min': 5,
                'max': 120,
                'q1': 28,
                'mean': 76,
                'q3': 110,
                "std": 20
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

let chartDic = {
    "1c": "",
    "mc": "",
    "cl": "",
    "num": "",
    "5s": ""
};

let chartColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
]