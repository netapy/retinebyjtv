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
let dashProj = '<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"><div></div><h1 class="h2">Sondages</h1></div><div id="mesSondages" class="row p-3 w-100" style="max-width:1100px;"><div class="col-12 col-sm-6 col-lg-4 mb-4"><div class="neuProjet d-flex align-items-center justify-content-center text-center" style="height: 200px;" onclick="creatorTabBtn.click();">Créer un<br>nouveau projet</div></div></div>';

let templateUserProj = '<div class="col-12 col-sm-6 col-lg-4 mb-5"><div class="neuProjet d-flex align-items-center justify-content-stretch flex-column hvr-float" onclick="changePage(dashSond,loadDataList,##IDPROJ##)"><div class="threeDot hvr-bounce-in" onclick="shareBtn(\'##IDPROJ##\');window.event.stopPropagation();"><img class="w-100" src="/img/icons/share.svg"></div><h3 class="p-3 pr-5 w-100 h-75 m-0" style="background-color: ##PROJCOLOR##; border-radius:  10px  10px 0px 0px; color: white;">##NOMPROJ##</h3><div class="px-3 flex-fill d-flex justify-content-between align-items-center w-100"><div class="d-fk">##CREADATE##</div><div>##NBREP## réponses</div></div></div></div>';

const loadProjList = async () => {
    let zoneProjs = document.querySelector("#mesSondages");
    userProjects = await queryRtn('/sondages/');
    userProjects = JSON.parse(userProjects);
    for (ii in userProjects) {
        zoneProjs.insertAdjacentHTML('beforeend', templateUserProj.replace('##PROJCOLOR##', "#6219D8").replaceAll('##IDPROJ##', userProjects[ii]['id']).replace('##NOMPROJ##', userProjects[ii]['nom_proj']).replace('##CREADATE##', userProjects[ii]['crea_date'].split("T")[0]).replace('##NBREP##', userProjects[ii]['reponse'].length));
    };
};

//SONDAGE DISPLAY
let dashSond = '<div id="headerBar" class="text-center w-100 py-2 mb-3 mt-5"></div><div id="mesResultats" class="row p-1 mx-auto" style="max-width:1100px"></div>'

let templateDataList = '<div class="neuProjetSimple p-4 text-center" data-aos="fade-up" data-aos-delay="100"><div><h5>##TTRQUEST##</h5><div class="nbRepGraph">🧍 ##REPS## répondants</div><div class="canvContain"></div></div><div class="d-flex align-itemps-center justify-content-between "><button class="screenBtn" onclick="copyGraph(this.parentElement.previousSibling)">📄 Copier le graphique</button></div></div>'

const loadDataList = async (num) => {
    document.querySelector("#header-toggle").parentElement.insertAdjacentHTML('beforeEnd', '<i class="bx bx-arrow-back" id="header-toggle" onclick="changePage(dashProj, loadProjList);"></i>')
    let sondageData = JSON.parse(await queryRtn('/reps/' + num.toString() + '/'));
    let projectInfo = userProjects.find(x => x["id"] == num.toString());
    let projectQuestions = JSON.parse(projectInfo['jsonContent']);
    sondageData['time'] = sondageData['time'].map(el => new Date(Date.parse(el)).toISOString().split('T')[0])
    let champDeDates = getDaysArray(sondageData['time'][0], sondageData['time'].at(-1)).map((v) => v.toISOString().slice(0, 10));
    let zoneProjs = document.querySelector("#mesResultats");

    //Création du header
    document.querySelector("#headerBar").innerHTML = '<h1 class="mt-3 mb-5" id="titreEtude" style="font-size:3rem;">##NOMPROJ##</h1><div class="border-bottom w-75 mx-auto mb-3"></div>'.replace("##NOMPROJ##", projectInfo["nom_proj"])

    //LIVE REFRESH A INCLURE PLUS TARD
    let liveBtn = '<div class="liveBtn">🔴 Données en direct</div>'
    document.body.insertAdjacentHTML("beforeend", liveBtn)

    //Création de la barre d'outils
    let htmlToolBar = "<div class='col-12 col-lg-12 px-3'><button class='btnExport p-1 px-3 hvr-float' onclick='alert(\"Export des données\")'><i class='bx bx-export px-1'></i>Exporter les données</button><button class='btnExport p-1 px-3 hvr-float' onclick='delSondRtn(" + num.toString() + ")'><i class='bx bx-trash px-1'></i>Supprimer le sondage</button></div>";

    document.querySelector("#mesResultats").insertAdjacentHTML("afterbegin", htmlToolBar)

    //Création graph réponses
    let elemTimeRep = document.createElement("div");
    elemTimeRep.classList = "col-12 col-lg-12 p-3";
    elemTimeRep.innerHTML = templateDataList.replace("##TTRQUEST##", "Evolution du nombre de réponses").replace("##REPQ##", JSON.stringify(sondageData["data"][ii]["d"])).replace("##REPS##", sondageData["time"].length).replace("##id##", "capt");
    elemTimeRep.querySelector('.canvContain').insertAdjacentHTML('afterbegin', '<canvas></canvas>');
    new Chart(elemTimeRep.querySelector('canvas'), {
        plugins: [ChartDataLabels],
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
            elem.innerHTML = templateDataList.replace("##TTRQUEST##", ii.toString() + ". " + projectQuestions[ii]["q"]).replace("##REPQ##", JSON.stringify(sondageData["data"][ii]["d"])).replace("##REPS##", sondageData["data"][ii]['nbrep']);
            if (['mc', '1c'].includes(sondageData["data"][ii]["t"])) {
                let dataMc = sondageData["data"][ii]["d"];
                elem.querySelector('.canvContain').insertAdjacentHTML('afterbegin', '<canvas></canvas>');
                new Chart(elem.querySelector('canvas'), {
                    plugins: [ChartDataLabels],
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(dataMc),
                        datasets: [{
                            data: Object.values(dataMc),
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
                elem.querySelector('.canvContain').insertAdjacentHTML('afterbegin', '<canvas></canvas>');
                var config = {
                    type: 'wordCloud',
                    data: {
                        labels: Object.keys(sondageData["data"][ii]["d"]),
                        datasets: [{
                            label: "",
                            color: '#6219D8',
                            //TODO ajouter une règle pour varier l'échelle dynamiquement en fonction de la somme des valeurs
                            data: Object.values(sondageData["data"][ii]["d"]).map((d) => 10 + d * 5),
                        }, ],
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltips: {
                                mode: 'label',
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var indice = tooltipItem.index;
                                        return data.labels[indice] + ': ' + data.datasets[0].data[indice] + '';
                                    }
                                }
                            },
                        }
                    },
                };
                var ctx = elem.querySelector('canvas').getContext('2d');
                new ChartWordCloud.WordCloudChart(ctx, config);

            } else if (['5s'].includes(sondageData["data"][ii]["t"])) {
                let uniqueLabels = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
                let dataMc = sondageData["data"][ii]["d"]['detail'];

                starHtml = '<div class="starContain py-3"><div class="mb-3">Note moyenne de ##STARS##</div><div class="stars"> <svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg><svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg><svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg><svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg><svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg> <div class="cover" style="width: ##PERCENT##%;"></div></div></div>'.replace("##PERCENT##", 100 - (sondageData["data"][ii]["d"]["main"] * 100) / 5).replace("##STARS##", sondageData["data"][ii]["d"]["main"]);

                const toggleCanv = (btn) => {
                    if (btn.target.dataset.state == "simple") {
                        elem.querySelector('.canvContain').innerHTML = starHtml;
                        btn.target.dataset.state = "detail";
                    } else {
                        console.log(dataMc);
                        elem.querySelector('.canvContain').innerHTML = "<canvas></canvas>";
                        new Chart(elem.querySelector("canvas"), {
                            type: 'bar',
                            data: {
                                labels: uniqueLabels,
                                datasets: [{
                                    data: Object.values(dataMc),
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
                                        display: false,
                                        reversed: true
                                    },
                                }
                            }
                        });
                        btn.target.dataset.state = "simple";
                    }
                }

                let btnDetail = document.createElement("button");
                btnDetail.innerHTML = "➕ Détails";
                btnDetail.className = "screenBtn";
                btnDetail.dataset.state = "yes";

                btnDetail.addEventListener("click", toggleCanv, false);

                elem.querySelector('.canvContain').innerHTML = starHtml;
                elem.querySelector('.screenBtn').insertAdjacentElement('afterend', btnDetail);


            } else if (['num'].includes(sondageData["data"][ii]["t"])) {
                if (1 == 1) {
                    console.log("ef");
                } else {
                    elem.querySelector('.canvContain').insertAdjacentHTML('afterbegin', '<canvas></canvas>');
                    new Chart(elem.querySelector('canvas'), {
                        type: 'bar',
                        data: {
                            labels: ['Minimum', 'Quartile 1', 'Moyenne', 'Quartile 2', 'Maximum', 'Écart type'],
                            datasets: [{
                                label: [sondageData["data"][ii]["t"]], //REMPLACER PAR UNITé
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
                }
            };
            zoneProjs.insertAdjacentElement("beforeend", elem);
        }
    };
    AOS.init();
};


//CREATEUR DISPLAY

let creationStudioInterface = '<div id="studio" class="row p-1"><div class="col-12 w-100 text-center py-3"><input class="mx-auto" type="text" id="titreSond" placeholder="Nom du projet"></div> <div class="col-12 col-lg-8 p-3 text-center d-flex flex-column justify-content-center"> <div class="cellZone w-100"> <div class="temlateBtn hvr-forward" onclick="templatebulle()">📚 Charger un modèle</div> <figure> <ul id="theTree" class="tree mx-auto p-3"> </ul> </figure> </div><hr class="w-75 mt-4"> <div class="row w-100"> <div class="col-12 col-md-8 py-2 pr-1 pl-0" style="height: 100px;"> <div class="h-100 px-4 d-flex text-justify justify-content-center flex-column" style="background-color: #dbd6e37d; border-radius: 10px; color: #3c3c3c; font-family: Lexend Deca;"> <div>🔎 Je souhaite cibler des <select name="Ciblage" id="defCible" onchange="document.querySelector(\'#suiteCible\').innerHTML=dicSuiteCible[this.value]" style="background: #6219d800; border: 0;text-decoration: underline; color: #6219D8;"> <option value="conn">connaissances</option> <option value="inco">inconnus</option> </select> <span id="suiteCible">à qui je vais envoyer le lien du sondage.</span></div></div></div><div class="col-12 col-md-4 py-2 pl-1 pr-0" style="height: 100px;"> <div class="h-100 d-flex align-items-center justify-content-center" onclick="validateSondage()" style="background-color: #6219D8; border-radius: 10px; color: white; cursor: pointer;"> <h3 class="m-0" style="line-height: 0.6;">Lancer<br><span style="font-size: .9rem;">le sondage !</span></h3> </div></div></div></div><div id="creaUserView" class="col-12 col-lg-4 p-3 text-center"> <div class="iphone-x mx-auto my-4"> <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background-color: #FAF7FF; border-radius: 15px;"> <div class="h-100 w-100 d-flex flex-column justify-content-between m-auto" style="max-width: 500px;"> <div class="w-100 d-flex align-items-center justify-content-between" style="background-color: transparent;"> <div class="p-3" style="font-family: Lexend Deca; font-size: 1rem; font-weight: 600;"><img src="/img/favicon.ico" style="height:20px;"> Rétine</div><div id="pourcentageAdv">0%</div></div><div class="h-100 d-flex flex-column justify-content-between scrollbehavior" style="overflow-y: scroll; scroll-behavior: smooth; "> <div style="background-color: transparent;"> <div id="messageFeed" class="h-100 p-2 d-flex flex-column justify-content-start"> </div></div><div class="w-100"> <div id="inputZone" class="h-auto p-1 row w-100 m-auto" style="background-color: transparent; min-height: 100px;"> </div></div></div></div></div></div><div class="mt-4 text-center"><button onclick="reiniTialisationChat(sondageEnCreation);" class="screenBtn px-4 py-2">♻️ Réinitialiser</button></div></div></div>';

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