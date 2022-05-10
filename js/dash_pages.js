//variables
let userProjects

//functions
function changePage(destinationHTML, loadingFun, sondageNum = 0) {
    if (document.querySelectorAll(".bx-arrow-back").length > 0) document.querySelectorAll(".bx-arrow-back")[0].remove();
    let theMain = document.querySelector("main")
    theMain.style.opacity = 0;
    setTimeout(() => {
        theMain.innerHTML = destinationHTML;
        theMain.style.opacity = 1;
        if (sondageNum == 0) {
            loadingFun();
        } else {
            loadingFun(sondageNum);
        }
    }, 300);
};

//PROJECTS OVERVIEW
let dashProj = '<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"><div></div><h1 class="h2">Sondages</h1></div><div id="mesSondages" class="row p-3 w-100"><div class="col-12 col-sm-6 col-lg-4 mb-4"><div class="neuProjet d-flex align-items-center justify-content-center text-center" style="height: 200px;" onclick="creatorTabBtn.click();">Créer un<br>nouveau projet</div></div></div>';

let templateUserProj = '<div class="col-12 col-sm-6 col-lg-4 mb-5"><div class="neuProjet d-flex align-items-center justify-content-stretch flex-column hvr-float" onclick="changePage(dashSond,loadDataList,##IDPROJ##)"><div class="threeDot hvr-bounce-in" onclick="shareBtn(\'##IDPROJ##\');window.event.stopPropagation();"><img class="w-100" src="/img/icons/share.svg"></div><h3 class="p-3 pr-5 w-100 h-75 m-0" style="background-color: ##PROJCOLOR##; border-radius:  10px  10px 0px 0px; color: white;">##NOMPROJ##</h3><div class="px-3 flex-fill d-flex justify-content-between align-items-center w-100"><div class="d-fk">##CREADATE##</div><div>##NBREP## réponses</div></div></div></div>';

const loadProjList = async () => {
    let zoneProjs = document.querySelector("#mesSondages");
    userProjects = await queryRtn('/sondages/');
    userProjects = JSON.parse(userProjects);
    for (ii in userProjects) {
        zoneProjs.insertAdjacentHTML('beforeend', templateUserProj.replace('##PROJCOLOR##', "#6219D8").replaceAll('##IDPROJ##', userProjects[ii]['id']).replace('##NOMPROJ##', userProjects[ii]['nom_proj']).replace('##CREADATE##', userProjects[ii]['crea_date'].split("T")[0]).replace('##NBREP##', userProjects[ii]['reponse'].length));
    }
};

//SONDAGE DISPLAY
let dashSond = '<div id="headerBar" class="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-around w-100 px-5 py-2 mb-3 mt-5" style="position:relative;"></div><div id="mesResultats" class="row p-1"></div>'

let templateDataList = '<div class="neuProjetSimple p-4 text-center"><div><h5>##TTRQUEST##</h5><div class="nbRepGraph">🧍 ##REPS## répondants</div><div class="canvContain"><canvas></canvas></div></div><button class="screenBtn" onclick="copyGraph(this.previousSibling)">📄 Copier le graphique</button></div>'

const loadDataList = async (num) => {
    document.querySelector("#header-toggle").parentElement.insertAdjacentHTML('beforeEnd', '<i class="bx bx-arrow-back" id="header-toggle" onclick="changePage(dashProj, loadProjList);"></i>')
    let sondageData = JSON.parse(await queryRtn('/reps/' + num.toString() + '/'));
    let projectInfo = userProjects.find(x => x["id"] == num.toString());
    let projectQuestions = JSON.parse(projectInfo['jsonContent']);
    sondageData['time'] = sondageData['time'].map(el => new Date(Date.parse(el)).toISOString().split('T')[0])
    let champDeDates = getDaysArray(sondageData['time'][0], sondageData['time'].at(-1)).map((v) => v.toISOString().slice(0, 10));
    let zoneProjs = document.querySelector("#mesResultats");

    //Création du header
    document.querySelector("#headerBar").innerHTML = '<h1 class="h2 mb-0" id="titreEtude">##NOMPROJ##</h1><div> </div>'.replace("##NOMPROJ##", projectInfo["nom_proj"])

    //Création de la barre d'outils
    let htmlToolBar = "<div class='col-12 col-lg-12 p-3'><div class='neuProjetSimple p-4 text-center'><div class='row'><div class='col-4'>Supprimer le sondage</div><div class='col-4'>Exporter les données</div><div class='col-4'>Exporter les données</div></div></div></div>";
    document.querySelector("#mesResultats").insertAdjacentHTML("afterbegin", htmlToolBar)

    //Création graph réponses
    let elemTimeRep = document.createElement("div");
    elemTimeRep.classList = "col-12 col-lg-12 p-3";
    elemTimeRep.innerHTML = templateDataList.replace("##TTRQUEST##", "Evolution du nombre de réponses").replace("##REPQ##", JSON.stringify(sondageData["data"][ii]["d"])).replace("##REPS##", sondageData["time"].length).replace("##id##", "capt");
    new Chart(elemTimeRep.querySelector('canvas'), {
        type: 'bar',
        data: {
            labels: champDeDates,
            datasets: [{
                data: champDeDates.map(el => countOccurrences(sondageData['time'], el)),
                tension: 0.2,
                backgroundColor: '#6219D8',
            }]
        },
        options: {
            scales: scaleParam,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            datalabels: {
                color: 'black',
                labels: {
                    title: {
                        font: {
                            weight: 'bold'
                        }
                    },
                }
            }
        }
    });
    zoneProjs.insertAdjacentElement("beforeend", elemTimeRep);


    for (ii in sondageData["data"]) {
        if (projectQuestions[ii]["a"]["type"] == "1c" && projectQuestions[ii]["a"]["a"].length == 1) {
            null
        } else {
            let elem = document.createElement("div");
            elem.classList = "col-12 col-lg-6 p-3";
            elem.innerHTML = templateDataList.replace("##TTRQUEST##", projectQuestions[ii]["q"]).replace("##REPQ##", JSON.stringify(sondageData["data"][ii]["d"])).replace("##REPS##", sondageData["data"][ii]["d"].length);
            if (['mc', '1c'].includes(sondageData["data"][ii]["t"])) {
                let uniqueLabels = [...new Set(sondageData["data"][ii]["d"])];
                new Chart(elem.querySelector('canvas'), {
                    type: 'pie',
                    data: {
                        labels: uniqueLabels,
                        datasets: [{
                            data: uniqueLabels.map(el => countOccurrences(sondageData["data"][ii]["d"], el)),
                            backgroundColor: chartColors,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {
                                color: 'black',
                                labels: {
                                    title: {
                                        font: {
                                            weight: 'bold'
                                        }
                                    },
                                },
                                formatter: (val, ctx) => (ctx.chart.data.labels[ctx.dataIndex])
                            }
                        }
                    }
                });
            } else if (['cl'].includes(sondageData["data"][ii]["t"])) {
                elem.querySelector('canvas').innerHTML = sondageData["data"][ii]["d"];
            } else if (['5s'].includes(sondageData["data"][ii]["t"])) {
                let uniqueLabels = ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"];
                new Chart(elem.querySelector('canvas'), {
                    type: 'bar',
                    data: {
                        labels: uniqueLabels,
                        datasets: [{
                            data: uniqueLabels.map(el => countOccurrences(sondageData["data"][ii]["d"], el)),
                            backgroundColor: "#6219D8",
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        scales: scaleParam,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                        }
                    }
                });
            } else if (['num'].includes(sondageData["data"][ii]["t"])) {
                new Chart(elem.querySelector('canvas'), {
                    type: 'bar',
                    data: {
                        labels: ['Minimum', 'Quartile 1', 'Moyenne', 'Quartile 2', 'Maximum', 'Écart type'],
                        datasets: [{
                            label: sondageData["data"][ii]["t"], //REMPLACER PAR UNITé
                            data: Object.values(sondageData["data"][ii]["d"]),
                            backgroundColor: numChartColors,
                        }]
                    },
                    options: {
                        scales: scaleParam,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {
                                color: 'black',
                                labels: {
                                    title: {
                                        font: {
                                            weight: 'bold'
                                        }
                                    },
                                }
                            }
                        }
                    }
                });
            };
            zoneProjs.insertAdjacentElement("beforeend", elem);
        }
    };
};


//CREATEUR DISPLAY

let creationStudioInterface = '<div id="studio" class="row p-1"><div class="col-12 w-100 text-center py-3"><input class="mx-auto" type="text" id="titreSond" placeholder="Nom du sondage"></div> <div class="col-12 col-lg-8 p-3 text-center d-flex flex-column justify-content-center"> <div class="cellZone w-100"> <div class="temlateBtn hvr-forward" onclick="templatebulle()">📚 Charger un modèle</div> <figure> <ul id="theTree" class="tree mx-auto p-3"> </ul> </figure> </div><hr class="w-75 mt-4"> <div class="row w-100"> <div class="col-12 col-md-8 py-2 pr-1 pl-0" style="height: 100px;"> <div class="h-100 px-4 d-flex text-justify justify-content-center flex-column" style="background-color: #dbd6e37d; border-radius: 10px; color: #3c3c3c; font-family: Lexend Deca;"> <div>🔎 Je souhaite cibler des <select name="Ciblage" id="defCible" onchange="document.querySelector(\'#suiteCible\').innerHTML=dicSuiteCible[this.value]" style="background: #6219d800; border: 0;text-decoration: underline; color: #6219D8;"> <option value="conn">connaissances</option> <option value="inco">inconnus</option> </select> <span id="suiteCible">à qui je vais envoyer le lien du sondage.</span></div></div></div><div class="col-12 col-md-4 py-2 pl-1 pr-0" style="height: 100px;"> <div class="h-100 d-flex align-items-center justify-content-center" onclick="validateSondage()" style="background-color: #6219D8; border-radius: 10px; color: white; cursor: pointer;"> <h3 class="m-0" style="line-height: 0.6;">Lancer<br><span style="font-size: .9rem;">le sondage !</span></h3> </div></div></div></div><div id="creaUserView" class="col-12 col-lg-4 p-3 text-center"> <div class="iphone-x mx-auto my-4"> <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background-color: #FAF7FF; border-radius: 15px;"> <div class="h-100 w-100 d-flex flex-column justify-content-between m-auto" style="max-width: 500px;"> <div class="w-100 d-flex align-items-center justify-content-between" style="background-color: transparent;"> <div class="p-3" style="font-family: Lexend Deca; font-size: 1rem; font-weight: 600;"><img src="/img/favicon.ico" style="height:20px;"> Rétine</div><div id="pourcentageAdv">0%</div></div><div class="h-100 d-flex flex-column justify-content-between scrollbehavior" style="overflow-y: scroll; scroll-behavior: smooth; "> <div style="background-color: transparent;"> <div id="messageFeed" class="h-100 p-2 d-flex flex-column justify-content-start"> </div></div><div class="w-100"> <div id="inputZone" class="h-auto p-1 row w-100 m-auto" style="background-color: transparent; min-height: 100px;"> </div></div></div></div></div></div><div class="mt-4 text-center"><button onclick="reiniTialisationChat(sondageEnCreation);" class="screenBtn px-4 py-2">♻️ Réinitialiser</button></div></div></div>';

const loadCreator = () => {
    sondageEnCreation = {
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
    feed = document.querySelector('#messageFeed');
    inputZone = document.querySelector('#inputZone');
    scrollZone = document.querySelectorAll('.scrollbehavior:last-child')[0];
    userAnswers = [];

    updateCells();
    reiniTialisationChat(sondageEnCreation);
}