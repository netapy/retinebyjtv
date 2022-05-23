//variables
let userProjects

//functions
function changePage(destinationHTML, loadingFun, sondageNum = 0) {
    if (document.querySelectorAll(".bx-arrow-back").length > 0) document.querySelectorAll(".bx-arrow-back")[0].remove();
    if (document.querySelectorAll(".liveBtn").length > 0) document.querySelectorAll(".liveBtn")[0].remove();

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
let dashProj = '<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3"><div></div><h1 class="h2 py-2">Dashboard des sondages</h1></div><div id="mesSondages" class="row p-3 w-100" style="max-width:1100px;"><div class="col-12 col-sm-6 col-lg-4 mb-4"><div class="neuProjet d-flex align-items-center justify-content-center text-center" style="height: 200px;" onclick="creatorTabBtn.click();">Créer un<br>nouveau projet</div></div></div>';

let templateUserProj = '<div class="col-12 col-sm-6 col-lg-4 mb-5"><div class="neuProjet d-flex align-items-center justify-content-stretch flex-column hvr-float" onclick="##FUNCTION##"><div class="threeDot hvr-bounce-in" onclick="##FUNCTIONSHARE##;window.event.stopPropagation();"><img class="w-100" src="/img/icons/##ICON##"></div><h3 class="p-3 pr-5 w-100 h-75 m-0" style="background-color: ##PROJCOLOR##; border-radius:  10px  10px 0px 0px; color: white;">##NOMPROJ##</h3><div class="px-3 flex-fill d-flex justify-content-between align-items-center w-100"><div class="d-fk">##CREADATE##</div><div>##NBREP##</div></div></div></div>';

const loadProjList = async () => {
    let zoneProjs = document.querySelector("#mesSondages");
    userProjects = await queryRtn('/sondages/edit/');
    userProjects = JSON.parse(userProjects);
    for (ii in userProjects) {
        if (userProjects[ii]['reponse'].length == 0 && userProjects[ii]['priv'] == true) {
            zoneProjs.insertAdjacentHTML('beforeend', templateUserProj.replace('##PROJCOLOR##', "grey").replaceAll('##IDPROJ##', userProjects[ii]['id']).replace('##NOMPROJ##', userProjects[ii]['nom_proj']).replace('##CREADATE##', userProjects[ii]['crea_date'].split("T")[0]).replace('##NBREP##', "Brouillon").replace("##FUNCTION##", "changePage(creationStudioInterface, loadCreator, " + userProjects[ii]['id'] + ")").replace("##ICON##", "delete.svg").replace("##FUNCTIONSHARE##", "delSondRtn(" + userProjects[ii]['id'] + ")"));
        } else {
            zoneProjs.insertAdjacentHTML('beforeend', templateUserProj.replace('##PROJCOLOR##', userProjects[ii]['color']).replace('##NOMPROJ##', userProjects[ii]['nom_proj']).replace('##CREADATE##', userProjects[ii]['crea_date'].split("T")[0]).replace('##NBREP##', userProjects[ii]['reponse'].length.toString() + " réponses").replace("##FUNCTION##", "changePage(dashSond, loadDataList, " + userProjects[ii]['id'] + ")").replaceAll('##IDPROJ##', userProjects[ii]['id']).replace("##ICON##", "share.svg").replace("##FUNCTIONSHARE##", "shareBtn('" + userProjects[ii]['id'] + "')"));
        }
    };
};

//SONDAGE DISPLAY
let dashSond = '<div id="headerBar" class="text-center w-100 py-2 mb-3 mt-5"></div><div id="mesResultats" class="row p-1 mx-auto" style="max-width:1100px"></div>'

let templateDataList = '<div class="neuProjetSimple p-4 text-center" data-aos="fade-up" data-aos-delay="100"><div><h5>##TTRQUEST##</h5><div class="nbRepGraph">🧍 ##REPS## répondants</div><div class="canvContain"></div></div><div class="d-flex align-itemps-center justify-content-between "><button class="screenBtn" onclick="copyGraph(this.parentElement.previousSibling)">📄 Copier le graphique</button></div></div>'

var updateChartFunList = [];

const loadDataList = async (num) => {
    document.querySelector("#header-toggle").parentElement.insertAdjacentHTML('beforeEnd', '<i class="bx bx-arrow-back" id="header-toggle" onclick="changePage(dashProj, loadProjList);"></i>')
    let sondageData = JSON.parse(await queryRtn('/reps/' + num.toString() + '/'));
    let projectInfo = userProjects.find(x => x["id"] == num.toString());
    let projectQuestions = JSON.parse(projectInfo['jsonContent']);
    let zoneProjs = document.querySelector("#mesResultats");

    //Création du header
    document.querySelector("#headerBar").innerHTML = '<h1 class="mt-3 mb-4" id="titreEtude" style="font-size:3rem;">##NOMPROJ##</h1>'.replace("##NOMPROJ##", projectInfo["nom_proj"])

    //TODO LIVE REFRESH A INCLURE PLUS TARD
    let liveBtn = '<div class="liveBtn">🔴 Données en direct</div>'
    document.body.insertAdjacentHTML("beforeend", liveBtn)

    //Création de la barre d'outils
    let htmlToolBar = "<div class='col-12 col-lg-12 px-3'><button class='btnExport p-1 px-3 hvr-float' onclick='alert(\"Export des données\")'><i class='bx bx-export px-1'></i>Exporter les données</button><button class='btnExport p-1 px-3 hvr-float' onclick='delSondRtn(" + num.toString() + ")'><i class='bx bx-trash px-1'></i>Supprimer le sondage</button></div>";

    document.querySelector("#mesResultats").insertAdjacentHTML("afterbegin", htmlToolBar)

    //Création graph réponses
    let elemTimeRep = document.createElement("div");
    let chartTimeRep;
    elemTimeRep.id = "timeRepGraph"
    elemTimeRep.classList = "col-12 col-lg-12 p-3";
    elemTimeRep.innerHTML = templateDataList;
    elemTimeRep.querySelector('.canvContain').innerHTML = '<canvas></canvas>';
    zoneProjs.insertAdjacentElement("beforeend", elemTimeRep);

    updateChartFunList["graphTimeRep"] = (majData) => {
        let elemTimeRep = document.querySelector("#timeRepGraph");
        elemTimeRep.querySelector("h5").innerHTML = "Evolution du nombre de réponses";
        elemTimeRep.querySelector(".nbRepGraph").innerHTML = "🧍 " + majData.length.toString() + " répondants";
        majData = majData.map(el => new Date(Date.parse(el)).toISOString().split('T')[0]);
        let champDeDates = getDaysArray(majData[0], majData.at(-1)).map((v) => v.toISOString().slice(0, 10));
        if (typeof chartTimeRep == "undefined") {
            chartTimeRep = new Chart(elemTimeRep.querySelector('canvas'), {
                plugins: [ChartDataLabels],
                type: 'bar',
                data: {
                    labels: champDeDates,
                    datasets: [{
                        data: champDeDates.map(el => countOccurrences(majData, el)),
                        tension: 0.2,
                        backgroundColor: '#6219D8',
                        borderRadius: 5,
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
                            color: 'white',
                        },
                        deferred: deferredConfig
                    }
                }
            });
        } else {
            chartTimeRep.data.labels = champDeDates;
            chartTimeRep.data.datasets[0].data = champDeDates.map(el => countOccurrences(majData, el));
            chartTimeRep.update();
        }
    }
    updateChartFunList["graphTimeRep"](sondageData['time']);

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
                let chart = new Chart(elem.querySelector('canvas'), {
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
                                formatter: (value, ctx) => {
                                    let sum = 0;
                                    let dataArr = ctx.chart.data.datasets[0].data;
                                    dataArr.map(data => {
                                        sum += data;
                                    });
                                    let percentage = ctx.chart.data.labels[ctx.dataIndex] + "\n" + (value * 100 / sum).toFixed(1) + "%";
                                    return percentage;
                                },
                                textAlign: "center",
                            },
                            deferred: deferredConfig
                        }
                    }
                });
                //UPDATE FUNCTION PUSHED
                updateChartFunList[ii.toString()] = (x) => {
                    chart.data.labels = Object.keys(x);
                    chart.data.datasets[0].data = Object.values(x);
                    chart.update();
                }

            } else if (['cl'].includes(sondageData["data"][ii]["t"])) {
                //numQ car comme on a des settimeout la valeur ii (numéro de la question) va changer entre temps
                let numQ = ii;
                let sentimentHtml = '<canvas id ="realCanvCont"></canvas><div id="realScoreCont"><div id="gauge2" class=" mx-auto w-100 gauge-container three" style="max-width:200px;"><span class="label"></span></div><div class="starContain py-2 px-3 text-left m-auto" style="font-size:.8rem; opacity:.9; border-radius:10px">💡 Score de sentiment moyen calculé par Rétine à l\'aide d\'intelligences artificielles. (0 = très négatif, 100 = très positif).</div></div>'
                elem.querySelector('.canvContain').insertAdjacentHTML("afterbegin", sentimentHtml);
                let dataCl = sondageData["data"][ii]["d"];

                setTimeout(() => {
                    let gauge32 = Gauge(
                        elem.querySelector("#gauge2"), {
                            max: 100,
                            value: 0,
                            color: function (value) {
                                if (value < 60) {
                                    return "#6219D8";
                                } else if (value < 25) {
                                    return "#E74C3C";
                                } else {
                                    return "#2FCC72";
                                }
                            },
                            label: function (value) {
                                if (value < 10) {
                                    return "😡\n" + Math.round(value)
                                } else if (value < 25) {
                                    return "😕\n" + Math.round(value)
                                } else if (value < 50) {
                                    return "😐\n" + Math.round(value)
                                } else if (value < 75) {
                                    return "🙂\n" + Math.round(value)
                                } else if (value <= 100) {
                                    return "😃\n" + Math.round(value)
                                }
                            },
                        }
                    );
                    setTimeout(() => {
                        gauge32.setValueAnimated(dataCl["sentMoy"] * 100, 1.5);
                    }, 100);

                    let chart = new ChartWordCloud.WordCloudChart(elem.querySelector('canvas').getContext('2d'), {
                        type: 'wordCloud',
                        data: {
                            labels: Object.keys(dataCl['nuage']),
                            datasets: [{
                                label: "",
                                color: '#6219D8',
                                //TODO ajouter une règle pour varier l'échelle dynamiquement en fonction de la somme des valeurs
                                data: Object.values(dataCl["nuage"]).map((d) => 15 + d * Math.min(125 / Object.values(dataCl["nuage"]).length, 8)),
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
                                deferred: deferredConfig
                            }
                        },
                    });

                    //UPDATE FUNCTION PUSHED
                    updateChartFunList[numQ.toString()] = (x) => {
                        gauge32.setValueAnimated(x["sentMoy"] * 100, 1.5);
                        chart.data.labels = Object.keys(x['nuage']);
                        chart.data.datasets[0].data = Object.values(x["nuage"]).map((d) => 15 + d * Math.min(125 / Object.values(x["nuage"]).length, 8))
                    }

                    const toggleCanv = (btn) => {
                        if (btn.target.dataset.state == "simple") {
                            document.querySelector("#realScoreCont").style.display = '';
                            document.querySelector("#realCanvCont").style.display = 'none';
                            let currentValue = gauge32.getValue()
                            gauge32.setValue(0);
                            gauge32.setValueAnimated(currentValue);
                            btn.target.dataset.state = "detail";
                        } else {
                            document.querySelector("#realScoreCont").style.display = 'none';
                            document.querySelector("#realCanvCont").style.display = '';
                            chart.reset();
                            chart.update();
                            btn.target.dataset.state = "simple";
                        }
                    }

                    let btnDetail = document.createElement("button");
                    btnDetail.innerHTML = "➕ Détails";
                    btnDetail.className = "screenBtn";
                    btnDetail.dataset.state = "simple";
                    btnDetail.addEventListener("click", toggleCanv, false);
                    elem.querySelector('.screenBtn').insertAdjacentElement('afterend', btnDetail);
                    btnDetail.click();
                }, 1);

            } else if (['5s'].includes(sondageData["data"][ii]["t"])) {
                let uniqueLabels = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
                let dataMc = sondageData["data"][ii]["d"]['detail'];

                let starHtml = '<div class="starContain py-5"><div class="mb-3">Note moyenne de ##STARS##</div><div class="stars"> <svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg><svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg><svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg><svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg><svg viewBox="0 0 576 512" width="50" title="star"> <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/> </svg> <div class="cover" style="width: ##PERCENT##%;"></div></div></div>'.replace("##PERCENT##", 100 - (sondageData["data"][ii]["d"]["main"] * 100) / 5).replace("##STARS##", sondageData["data"][ii]["d"]["main"]);

                const toggleCanv = (btn) => {
                    if (btn.target.dataset.state == "simple") {
                        elem.querySelector('.canvContain').innerHTML = starHtml;
                        btn.target.dataset.state = "detail";
                    } else {
                        elem.querySelector('.canvContain').innerHTML = "<canvas></canvas>";
                        let chart = new Chart(elem.querySelector("canvas"), {
                            plugins: [ChartDataLabels],
                            type: 'bar',
                            data: {
                                labels: uniqueLabels,
                                datasets: [{
                                    data: [dataMc['1'], dataMc['2'], dataMc['3'], dataMc['4'], dataMc['5']],
                                    backgroundColor: "#6219D8",
                                    borderRadius: 5,
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
                                    datalabels: {
                                        color: 'white',
                                    },
                                    deferred: deferredConfig
                                }
                            }
                        });
                        //UPDATE FUNCTION PUSHED
                        updateChartFunList[ii.toString()] = (x) => {
                            chart.data.datasets[0].data = [x['1'], x['2'], x['3'], x['4'], x['5']];
                            chart.update();
                        }
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
                let dataNum = sondageData["data"][ii]["d"];
                elem.querySelector('.canvContain').innerHTML = "<canvas></canvas>";
                elem.querySelector("h5").insertAdjacentHTML("beforeend", "<span style='font-size:1rem;opacity:.6;'>(en " + projectQuestions[ii]["a"]["a"][2] + ")</span>")
                let chart = new Chart(elem.querySelector("canvas"), {
                    plugins: [ChartDataLabels],
                    type: 'bar',
                    data: {
                        labels: Object.keys(dataNum["detail"]).map(x => x.replaceAll(".0", "")),
                        datasets: [{
                            label: "Répartition",
                            data: Object.values(dataNum["detail"]),
                            backgroundColor: "#6219D8",
                            borderRadius: 5,
                            datalabels: {
                                display: true,
                                color: 'white',
                                formatter: function (value, context) {
                                    if (value == 0) {
                                        return ""
                                    } else {
                                        return value
                                    }
                                }
                            }
                        }, {
                            label: "Moyenne",
                            data: [{
                                x: dataNum["main"],
                                y: Math.max.apply(Math, Object.values(dataNum["detail"])) + 1
                            }],
                            backgroundColor: "#2FCC72",
                            type: 'bar',
                            xAxisID: 'x1',
                            maxBarThickness: 8,
                            datalabels: {
                                display: true,
                                color: 'black',
                                textAlign: "center",
                                formatter: function (value, context) {
                                    return "Moyenne\n" + context.dataset.data[0].x.toString();
                                }
                            }
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                display: false,
                                grid: {
                                    drawOnChartArea: false,
                                },
                            },
                            x: {
                                display: true,
                                position: 'bottom',
                                grid: {
                                    drawOnChartArea: false,
                                },
                            },
                            x1: {
                                type: 'linear',
                                display: false,
                                position: 'bottom',
                                min: parseInt(Object.keys(dataNum["detail"]).at(0).split(",").at(0).replace('.0', '').replace(/\D/g, '')),
                                max: parseInt(Object.keys(dataNum["detail"]).at(-1).split(",").at(-1).replace('.0', '').replace(/\D/g, '')),
                                grid: {
                                    drawOnChartArea: false,
                                },
                            },
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                                labels: {
                                    padding: 10,
                                }
                            },
                            tooltip: {
                                filter: function (tooltipItem) {
                                    return tooltipItem.datasetIndex === 0;
                                }
                            },
                            datalabels: {
                                display: false,
                            },
                            deferred: deferredConfig
                        }
                    }
                });
                updateChartFunList[ii.toString()] = (x) => {
                    chart.data.labels = Object.keys(x["detail"]).map(x => x.replaceAll(".0", ""))
                    chart.data.datasets[0].data = Object.values(x["detail"]);
                    chart.data.datasets[1].data = [{
                        x: x["main"],
                        y: Math.max.apply(Math, Object.values(x["detail"])) + 1
                    }];
                    chart.options.scales.x1.min = parseInt(Object.keys(x["detail"]).at(0).split(",").at(0).replace('.0', '').replace(/\D/g, ''));
                    chart.options.scales.x1.max = parseInt(Object.keys(x["detail"]).at(-1).split(",").at(-1).replace('.0', '').replace(/\D/g, ''));
                    chart.update();
                };

            } else if (['cal'].includes(sondageData["data"][ii]["t"])) {
                //TODO : FAIRE UN TRI PLUS PRECIS EN FONCTION DE LA DONNEE DEMANDEE
                let dataDate = sondageData["data"][ii]["d"];
                //dataDate['dates'] = dataDate['dates'].map(el => new Date(Date.parse(el)))
                elem.querySelector('.canvContain').innerHTML = "<canvas></canvas>";
                let chart = new Chart(elem.querySelector("canvas"), {
                    plugins: [ChartDataLabels],
                    type: 'bar',
                    data: {
                        labels: Object.keys(dataDate["dates"]).map(el => new Date(Date.parse(el))),
                        datasets: [{
                            data: Object.values(dataDate["dates"]),
                            tension: 0.2,
                            backgroundColor: '#6219D8',
                            borderRadius: 5,
                        }]
                    },
                    options: {
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    displayFormats: {
                                        hour: 'HH:mm'
                                    }
                                },
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    stepSize: 1,
                                    beginAtZero: true,
                                }
                            },
                            y: {
                                display: false
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            datalabels: {
                                color: 'white',
                            },
                            deferred: deferredConfig
                        }
                    }
                });
                updateChartFunList[ii.toString()] = (x) => {
                    chart.data.labels = Object.keys(x["dates"]).map(el => new Date(Date.parse(el)));
                    chart.data.datasets[0].data = Object.values(x["dates"]);
                    chart.update();
                };
            };
            zoneProjs.insertAdjacentElement("beforeend", elem);
        }
    };

    AOS.init();
};


//CREATEUR DISPLAY

let creationStudioInterface = '<div id="studio" class="row p-1"><div class="col-12 w-100 text-center py-3"><input class="mx-auto" type="text" id="titreSond" placeholder="Nom du projet" onkeyup="sondageEnCreation[\'nom_proj\'] = this.value" maxlength="30"></div> <div class="col-12 col-lg-8 p-3 text-center d-flex flex-column justify-content-center"> <div class="cellZone w-100 pt-3"><div class="dureeEstim">⏲️ Durée estimée : <span id="tempsEstim"></span></div> <figure> <ul id="theTree" class="tree mx-auto p-3"> </ul> </figure> </div><hr class="w-75 mt-4"> <div class="row"> <div class="col-12 col-md-8 py-2 pr-1 pl-0 hvr-float" style="height: 100px;"> <div class="h-100 px-4 d-flex text-justify justify-content-center flex-column" style="background-color: #dbd6e37d; border-radius: 10px; color: #3c3c3c; font-family: Lexend Deca;"> <div class="temlateBtn" onclick="templatebulle()">📚 Charger un modèle...</div></div></div><div class="col-12 col-md-4 py-2 pl-1 pr-0 hvr-float" style="height: 100px;"> <div class="h-100 d-flex align-items-center justify-content-center" onclick="validateSondage()" style="background-color: #6219D8; border-radius: 10px; color: white; cursor: pointer;"> <h3 class="m-0" style="line-height: 0.6;">Lancer<br><span style="font-size: .9rem;">le sondage !</span></h3> </div></div></div></div><div id="creaUserView" class="col-12 col-lg-4 p-3 text-center"> <div class="iphone-x mx-auto my-4"> <div class="w-100 h-100 d-flex align-items-center justify-content-center" style="background-color: #FAF7FF; border-radius: 15px;"> <div class="h-100 w-100 d-flex flex-column justify-content-between m-auto" style="max-width: 500px;"> <div class="w-100 d-flex align-items-center justify-content-between" style="background-color: transparent;"> <div class="p-3" style="font-family: Lexend Deca; font-size: 1rem; font-weight: 600;"><img src="/img/favicon.ico" style="height:20px;"> Rétine</div><div id="pourcentageAdv">0%</div></div><div class="h-100 d-flex flex-column justify-content-between scrollbehavior" style="overflow-y: scroll; scroll-behavior: smooth; "> <div style="background-color: transparent;"> <div id="messageFeed" class="h-100 p-2 d-flex flex-column justify-content-start"> </div></div><div class="w-100"> <div id="inputZone" class="h-auto p-1 row w-100 m-auto" style="background-color: transparent; min-height: 100px;"> </div></div></div></div></div></div><div class="mt-4 text-center"><button onclick="reiniTialisationChat(sondageEnCreation);" class="screenBtn px-4 py-2">♻️ Réinitialiser</button></div></div></div>';

const loadCreator = async (num) => {
    if (num == 'new') {
        sondageEnCreation = {
            "nom_proj": "Brouillon",
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
        idSondageRtn = null;
    } else {
        let sondageData = await queryRtn('/sondages/edit/' + num.toString() + '/')
        sondageEnCreation = JSON.parse(sondageData);
        sondageEnCreation['jsonContent'] = JSON.parse(sondageEnCreation['jsonContent']);
        idSondageRtn = num;
    }
    sondageEnCreationVPREV = JSON.parse(JSON.stringify(sondageEnCreation));
    feed = document.querySelector('#messageFeed');
    inputZone = document.querySelector('#inputZone');
    scrollZone = document.querySelectorAll('.scrollbehavior:last-child')[0];
    userAnswers = [];

    updateCells();
    reiniTialisationChat(sondageEnCreation);
    if (num != 'new') {
        document.querySelector("#titreSond").value = sondageEnCreation["nom_proj"];
        document.body.insertAdjacentHTML("beforeend", '<div class="liveBtn" style="opacity:.75; color: grey;"></div>');
    };
}


//TEMPLATE DISPLAY
let templateBaseHtml = '<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3"><h1 class="h2 py-2">Modèles de sondages</h1></div><div id="lesTemplates" class="row p-3 w-100" style="max-width:1100px;"></div>';

let templateTuilehtml = '<div class="col-12 col-sm-6 col-lg-4 mb-4"><div class="neuProjet d-flex align-items-center justify-content-center text-center" onclick="##FUNCTION##">##NAME##</div></div>';

const loadTemplates = async () => {
    let rtnTemplates = JSON.parse(await queryRtn('/templates/'));
    let categories = [...new Set(rtnTemplates.map(x => x['category']))];
    for (ii in categories) {
        let templateCat = '<div class="col-12 mb-4 border-bottom"><h2>XXX</h2></div>'.replace("XXX", categories[ii]);
        document.querySelector("#lesTemplates").insertAdjacentHTML("beforeend", templateCat)
        let templateFiltered = rtnTemplates.filter(x => x['category'] == categories[ii])
        for (iii in templateFiltered) {
            document.querySelector("#lesTemplates").insertAdjacentHTML("beforeend", templateTuilehtml.replace("##NAME##", templateFiltered[iii]['nom_proj']).replace("##FUNCTION##", "changePage(creationStudioInterface, loadTemplateInCrea, " + templateFiltered[iii]['id'] + ")"));
        }
    };
};

const loadTemplateInCrea = async (id) => {
    let templateData = await queryRtn("/templates/" + id.toString() + "/")
    sondageEnCreation = JSON.parse(templateData);
    sondageEnCreation['jsonContent'] = JSON.parse(sondageEnCreation['jsonContent']);
    idSondageRtn = null;
    sondageEnCreationVPREV = JSON.parse(JSON.stringify(sondageEnCreation));
    feed = document.querySelector('#messageFeed');
    inputZone = document.querySelector('#inputZone');
    scrollZone = document.querySelectorAll('.scrollbehavior:last-child')[0];
    userAnswers = [];

    updateCells();
    reiniTialisationChat(sondageEnCreation);
    document.querySelector("#titreSond").value = sondageEnCreation["nom_proj"];
};

const loadMyTemplateInCrea = async (id) => {
    let templateData = await queryRtn("/sondages/edit/" + id.toString() + "/")
    sondageEnCreation = JSON.parse(templateData);
    sondageEnCreation['jsonContent'] = JSON.parse(sondageEnCreation['jsonContent']);
    idSondageRtn = null;
    sondageEnCreationVPREV = JSON.parse(JSON.stringify(sondageEnCreation));
    feed = document.querySelector('#messageFeed');
    inputZone = document.querySelector('#inputZone');
    scrollZone = document.querySelectorAll('.scrollbehavior:last-child')[0];
    userAnswers = [];

    updateCells();
    reiniTialisationChat(sondageEnCreation);
    document.querySelector("#titreSond").value = sondageEnCreation["nom_proj"] + " - Copie";
};