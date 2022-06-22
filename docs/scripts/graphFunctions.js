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