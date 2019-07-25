let simulations$ = new rxjs.Subject();

function createSimulation(event) {
    const numberOfRequests = document.querySelector('#select-number-of-requests').value;
    const maxRandomDelay = document.querySelector('#input-max-random-delay').value;
    const simulation = {
        type: 'success',
        options: {
            numberOfRequests: numberOfRequests,
            maxRandomDelay: maxRandomDelay
        },
        requests: {
            total: numberOfRequests,
            sent: 0,
            completed: 0,
            requests$: new rxjs.Subject()
        },
        srcElement: {
            id: event.srcElement.id,
            innerText: event.srcElement.innerText
        }
    };

    return simulation;
}

function makeRequest(simulation) {
    const randomDelay = Math.floor(Math.random() * (simulation.options.maxRandomDelay));
    const requestObservable = rxjs.timer(randomDelay);

    simulation.requests.sent += 1;

    requestObservable.subscribe(() => {
        treatResponse(simulation);
    });

    return requestObservable;
}

function treatResponse(simulation) {
    const srcElement = document.querySelector('#' + simulation.srcElement.id);

    simulation.requests.completed += 1;
    srcElement.innerText = `${simulation.requests.completed}/${simulation.requests.total}`;

    if (simulation.requests.completed == simulation.requests.total) {
        srcElement.disabled = false;
        srcElement.innerText = simulation.srcElement.innerText;
    }

    //console.log(`${simulation.requests.completed}/${simulation.requests.total}`);
}

function startSimulation(simulation) {
    document.querySelector('#' + simulation.srcElement.id).disabled = true;

    simulation.requests.requests$.next(
        rxjs.range(0, simulation.requests.total)
            .subscribe((i) => rxjs.forkJoin(makeRequest(simulation)))
    );
}

function endSimulation(simulation) {
    document.querySelector('#' + simulation.srcElement.id).disabled = false;
}

function simulate(event) {
    const simulation = createSimulation(event);

    simulations$.next(simulation);
}

rxjs.fromEvent(document.querySelector('#form-request'), 'submit')
    .subscribe(
        event => event.preventDefault(),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-successes'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-errors'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-untreated-exceptions'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

simulations$.subscribe(
    simulation =>  {
        simulation.requests.requests$.subscribe(
            () => console.log('finished')
        );

        startSimulation(simulation);
    },
    err => console.log(err)
);