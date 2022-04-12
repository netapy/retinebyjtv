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
let dashProj = '<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom"><h1 class="h2">Sondages</h1></div><div id="mesSondages" class="row p-3"><div class="col-12 col-sm-6 col-lg-3  mb-4"><div class="neuProjet d-flex align-items-center justify-content-center text-center" style="height: 200px;">Créer un<br>nouveau projet</div></div></div>';

let templateUserProj = '<div class="col-12 col-sm-6 col-lg-3 mb-5"><div class="neuProjet d-flex align-items-center justify-content-stretch flex-column" onclick="changePage(dashSond,loadDataList)"><h3 class="p-3 w-100 h-75 m-0" style="background-color: ##PROJCOLOR##; border-radius:  10px  10px 0px 0px; color: white;">##NOMPROJ##</h3><div class="px-3 flex-fill d-flex justify-content-between align-items-center w-100"><div class="d-fk">##CREADATE##</div><div>##NBREP## réponses</div></div></div></div>';

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