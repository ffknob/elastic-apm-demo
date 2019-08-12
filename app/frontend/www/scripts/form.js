function hide(elementId) {
    const element = document.getElementById(elementId);
    element.classList.add('hide');
}

function show(elementId) {
    const element = document.getElementById(elementId);
    element.classList.remove('hide');
}

rxjs.fromEvent(document.querySelector('#form-request'), 'submit')
    .subscribe(
        event => event.preventDefault(),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#input-set-random-user-context'), 'change')
    .subscribe(
        event => event.srcElement.checked ? hide('fieldset-user-context') : show('fieldset-user-context'),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#input-set-random-custom-context'), 'change')
    .subscribe(
        event => event.srcElement.checked ? hide('fieldset-custom-context') : show('fieldset-custom-context'),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#input-set-random-labels'), 'change')
    .subscribe(
        event => event.srcElement.checked ? hide('fieldset-labels') : show('fieldset-labels'),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-success'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-thrown-error'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-uncaught-error'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-complex-transaction'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-distributed-transaction'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );