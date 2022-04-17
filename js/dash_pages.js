function changePage(destinationHTML, loadingFun) {
    let theMain = document.querySelector("main")
    theMain.style.opacity = 0;
    setTimeout(() => {
        theMain.innerHTML = destinationHTML;
        theMain.style.opacity = 1;
        loadingFun();
    }, 300);
}

//PROJECTS OVERVIEW
let dashProj = '<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"><h1 class="h2">Sondages</h1></div><div id="mesSondages" class="row p-3"><div class="col-12 col-sm-6 col-lg-4  mb-4"><div class="neuProjet d-flex align-items-center justify-content-center text-center" style="height: 200px;" onclick="changePage(creationStudioInterface, loadCreator);">Créer un<br>nouveau projet</div></div></div>';

let templateUserProj = '<div class="col-12 col-sm-6 col-lg-4 mb-5"><div class="neuProjet d-flex align-items-center justify-content-stretch flex-column" onclick="changePage(dashSond,loadDataList)"><h3 class="p-3 w-100 h-75 m-0" style="background-color: ##PROJCOLOR##; border-radius:  10px  10px 0px 0px; color: white;">##NOMPROJ##</h3><div class="px-3 flex-fill d-flex justify-content-between align-items-center w-100"><div class="d-fk">##CREADATE##</div><div>##NBREP## réponses</div></div></div></div>';

const loadProjList = () => {
    let zoneProjs = document.querySelector("#mesSondages");
    for (ii in userProjects) {
        zoneProjs.insertAdjacentHTML('beforeend', templateUserProj.replace('##PROJCOLOR##', userProjects[ii]['projColor']).replace('##NOMPROJ##', userProjects[ii]['nomProj']).replace('##CREADATE##', userProjects[ii]['creaDate']).replace('##NBREP##', userProjects[ii]['nbRep']));
    }
};

//SONDAGE DISPLAY
let dashSond = '<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"><h1 class="h2 mb-0" id="titreEtude">Les films en France</h1><div class="btn-toolbar mb-2 mb-md-0"><div class="btn-group mr-2"><button class="btn btn-sm btn-outline-secondary">⬇️ Exporter les données</button></div></div></div><div id="mesResultats" class="row p-1"></div>'

let templateDataList = '<div class="neuProjetSimple p-3 text-center"><div><h5>##TTRQUEST##</h5><div class="nbRepGraph">🧍 ##REPS## répondants</div><div class="canvContain"><canvas></canvas></div></div><button class="screenBtn" onclick="copyGraph(this.previousSibling)">📄 Copier le graphique</button></div>'

const loadDataList = () => {
    document.querySelector("#titreEtude").insertAdjacentHTML("beforeend",
        "<span class='sondInfo'>Créé le DDD | RRR répondants</span>".replace("DDD", sondageTest['creaDate']).replace("RRR", sondageTest['nbRep'])
    );
    let zoneProjs = document.querySelector("#mesResultats");

    for (ii in sondageTest["data"]) {
        let elem = document.createElement("div");
        elem.classList = "col-12 col-lg-6 p-3";
        elem.innerHTML = templateDataList.replace("##TTRQUEST##", sondageTest["data"][ii]["q"]).replace("##REPQ##", JSON.stringify(sondageTest["data"][ii]["d"])).replace("##REPS##", sondageTest["data"][ii]["r"]).replace("##id##", "capt");
        if (['mc', '1c', 'cl'].includes(sondageTest["data"][ii]["t"])) {
            new Chart(elem.querySelector('canvas'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(sondageTest["data"][ii]["d"]),
                    datasets: [{
                        label: sondageTest["data"][ii]["t"], //REMPLACER PAR UNITé
                        data: Object.values(sondageTest["data"][ii]["d"]),
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
        } else if (['num'].includes(sondageTest["data"][ii]["t"])) {
            new Chart(elem.querySelector('canvas'), {
                type: 'bar',
                data: {
                    labels: ['Minimum', 'Quartile 1', 'Moyenne', 'Quartile 2', 'Maximum', 'Écart type'],
                    datasets: [{
                        label: sondageTest["data"][ii]["t"], //REMPLACER PAR UNITé
                        data: Object.values(sondageTest["data"][ii]["d"]),
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
    };
};


//CREATEUR DISPLAY

let creationStudioInterface = '<div id="studio" class="row p-1"> <div class="col-12 col-lg-8 p-3 text-center"> <h4 class="mb-4">🛠️ Espace création</h4> <div class="cellZone w-100"> <figure> <ul id="theTree" class="tree mx-auto p-3"> </ul> </figure> </div><hr class="w-75 mt-4"> <div class="row w-100 m-auto"> <div class="col-12 col-md-8 py-2 pr-1 pl-0" style="height: 100px;"> <div class="h-100 px-4 d-flex text-justify justify-content-center flex-column" style="background-color: #dbd6e37d; border-radius: 10px; color: #3c3c3c; font-family: Lexend Deca;"> <div>🔎 Je souhaite cibler des <select name="Ciblage" id="defCible" onchange="document.querySelector(\'#suiteCible\').innerHTML=dicSuiteCible[this.value]" style="background: #6219d800; border: 0;text-decoration: underline; color: #6219D8;"> <option value="conn">connaissances</option> <option value="inco">inconnus</option> </select> <span id="suiteCible">à qui je vais envoyer le lien du sondage.</span></div></div></div><div class="col-12 col-md-4 py-2 pl-1 pr-0" style="height: 100px;"> <div class="h-100 d-flex align-items-center justify-content-center" onclick="validateSondage()" style="background-color: #6219D8; border-radius: 10px; color: white; cursor: pointer;"> <h3 class="m-0" style="line-height: 0.6;">Lancer<br><span style="font-size: .9rem;">le sondage !</span></h3> </div></div></div></div><div id="creaUserView" class="col-12 col-lg-4 p-3 text-center"> <h4 style="margin-bottom: 36px;">🙋 Vue utilisateur</h4> <div class="iphone-x mx-auto my-4"> <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background-color: #FAF7FF; border-radius: 15px;"> <div class="h-100 w-100 d-flex flex-column justify-content-between m-auto" style="max-width: 500px;"> <div style="background-color: transparent;"> <div class="py-1 px-3" style="font-family: Lexend Deca; font-size: 1.05rem; font-weight: 600;"><img src="img/favicon.ico" style="height:30px;"> Rétine</div></div><div class="h-100 d-flex flex-column justify-content-between scrollbehavior" style="overflow-y: scroll; scroll-behavior: smooth; "> <div style="background-color: transparent;"> <div id="messageFeed" class="h-100 p-2 d-flex flex-column justify-content-start"> </div></div><div class="w-100"> <div id="inputZone" class="h-auto p-1 row w-100 m-auto" style="background-color: transparent; min-height: 100px;"> </div></div></div></div></div></div><div class="mt-4 text-center"><button onclick="reiniTialisationChat(sondageEnCreation);" class="screenBtn px-4 py-2">♻️ Réinitialiser</button></div></div></div>';

const loadCreator = () => {
    feed = document.querySelector('#messageFeed');
    inputZone = document.querySelector('#inputZone');
    scrollZone = document.querySelectorAll('.scrollbehavior:last-child')[0];
    userAnswers = [];

    updateCells();
    reiniTialisationChat(sondageEnCreation);
}