const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
        classes: 'shadow-md bg-purple-dark',
        scrollTo: true
    }
});

tour.addStep({
    id: 'step1',
    text: 'Voici la vue utilisateur. Elle vous affiche automatiquement une simulation de la vue utilisateur.',
    attachTo: {
        element: '#creaUserView',
        on: 'auto'
    },
    classes: 'example-step-extra-class',
    buttons: [{
        text: 'Sauter',
        action: tour.cancel,
        secondary: true
    }, {
        text: 'Suivant',
        action: tour.next
    }]
});

//tour.start();