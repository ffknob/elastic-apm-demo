let simulationId = 1;
let simulations$ = new rxjs.Subject();

function createSimulation(event) {
    const numberOfRequests = document.querySelector('#select-number-of-requests').value;
    const maxRandomDelay = document.querySelector('#input-max-random-delay').value;
    
    simulationId += 1;
    const simulation = {
        id: simulationId,
        type: 'success',
        options: {
            numberOfRequests: numberOfRequests,
            maxRandomDelay: maxRandomDelay
        },
        requests: {
            total: numberOfRequests,
            sent: 0,
            sent$: new rxjs.Subject(),
            completed: 0,
            completed$: new rxjs.Subject(),
            requests$: new rxjs.Subject()
        },
        srcElement: {
            id: event.srcElement.id,
            innerText: event.srcElement.innerText
        }
    };

    return simulation;
}

function createRequestsTableRow(simulation) {
    const requestsTableBodyOld = document.querySelector('#table-requests tbody');
    const requestsTableBodyNew = document.createElement('tbody');
    const requestsTableRows = document.querySelectorAll('#table-requests tbody tr');
    const requestRow = document.createElement('tr');
    const requestCellId = document.createElement('th');
    const requestCellType = document.createElement('td');
    const requestCellRandomDelay = document.createElement('td');
    const requestCellNumberOfRequests = document.createElement('td');
    const requestCellSent = document.createElement('td');
    const requestCellCompleted = document.createElement('td');

    requestCellId.innerHTML = simulation.id;
    requestCellType.innerHTML = simulation.type;
    requestCellRandomDelay.innerHTML = simulation.options.maxRandomDelay;
    requestCellNumberOfRequests.innerHTML = simulation.requests.total;
    requestCellSent.innerHTML = simulation.requests.sent;
    simulation.requests.sent$.subscribe((sent) => requestCellSent.innerHTML = sent);
    requestCellCompleted.innerHTML = simulation.requests.completed;
    simulation.requests.completed$.subscribe((completed) => requestCellCompleted.innerHTML = completed);

    requestRow.appendChild(requestCellId);
    requestRow.appendChild(requestCellType);
    requestRow.appendChild(requestCellNumberOfRequests);
    requestRow.appendChild(requestCellRandomDelay);
    requestRow.appendChild(requestCellSent);
    requestRow.appendChild(requestCellCompleted);

    requestsTableBodyNew.appendChild(requestRow)
    if (requestsTableRows.length > 0) {
        console.log(requestsTableRows);
        requestsTableRows.forEach((node) => requestsTableBodyNew.appendChild(node));
    }

    requestsTableBodyOld.parentNode.replaceChild(requestsTableBodyNew, requestsTableBodyOld)
}

function makeRequest(simulation) {
    const randomDelay = Math.floor(Math.random() * (simulation.options.maxRandomDelay));
    const requestObservable = rxjs.timer(randomDelay);

    simulation.requests.randomDelay = randomDelay;
    simulation.requests.sent += 1;
    simulation.requests.sent$.next(simulation.requests.sent);

    requestObservable.subscribe(() => {
        treatResponse(simulation);
    });

    return requestObservable;
}

function treatResponse(simulation) {
    const srcElement = document.querySelector('#' + simulation.srcElement.id);

    simulation.requests.completed += 1;
    simulation.requests.completed$.next(simulation.requests.completed);

    srcElement.innerText = `${simulation.requests.completed}/${simulation.requests.total}`;

    if (simulation.requests.completed == simulation.requests.total) {
        srcElement.disabled = false;
        srcElement.innerText = simulation.srcElement.innerText;
    }
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

    createRequestsTableRow(simulation);

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