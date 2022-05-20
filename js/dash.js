let chartColors = ['#23BE6E4D', '#7798AB4D', '#6219D84D', '#DB54614D', '#42BFDD4D', '#E7BB734D', '#F08CAE4D', '#A297154D', '#4C4C474D', '#F588514D'];

let purpleVariant = ["#6219D8","#7579F3", "#8494FB","#734AE4","#B48CEC"]

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
            maxTicksLimit: 5,
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

            return fetch("https://retinereq.jetevois.fr:8000/sondages/edit/" + num + "/", requestOptions)
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

hashCode = s => s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
}, 0)