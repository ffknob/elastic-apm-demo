const MIDDLEWARE = {
    host: 'localhost',
    port: 3000
};

const SIMULATION_TYPES = {
    SUCCESS: {
        type: 'success',
        text: 'Success',
        class: 'is-success'
    },
    ERROR: {
        type: 'error',
        text: 'Error',
        class: 'is-warning'
    },
    EXCEPTION: {
        type: 'exception',
        text: 'Exception',
        class: 'is-danger'
    }
};

let simulationId = 0;
let simulations$ = new rxjs.Subject();

function selectSimulationType(event) {
    let simulationType = null;

    switch (event.srcElement.id) {
        case 'btn-success':
            simulationType = SIMULATION_TYPES.SUCCESS;
            break;

        case 'btn-error':
            simulationType = SIMULATION_TYPES.ERROR;
            break;

        case 'btn-exception':
            simulationType = SIMULATION_TYPES.EXCEPTION;
            break;
    }

    return simulationType;
}

function createSimulation(simulationType) {
    const numberOfRequests = document.querySelector('#select-number-of-requests').value;
    const maxRandomDelay = document.querySelector('#input-max-random-delay').value;
    
    simulationId += 1;
    const simulation = {
        id: simulationId,
        type: simulationType,
        options: {
            numberOfRequests: numberOfRequests,
            maxRandomDelay: maxRandomDelay
        },
        requests: {
            total: numberOfRequests,
            time: {
                start: null,
                end: null,
                took: 0,
                took$: new rxjs.Subject()
            },
            sent: 0,
            sent$: new rxjs.Subject(),
            completed: 0,
            completed$: new rxjs.Subject(),
            requests: [],
            requests$: new rxjs.Subject()
        },
        srcElement: {
            id: event.srcElement.id,
            innerText: event.srcElement.innerText
        }
    };

    return simulation;
}

function createRequest(id) {
    return {
        id: id,
        time: {
            start: Date.now(),
            end: null,
            took: 0
        },
        response: null
    };
}

function createTypeTag(simulationType) {
    let tag = document.createElement('span');
    tag.classList.add('tag');
    tag.classList.add(simulationType.class);
    tag.innerText = simulationType.text;

    return tag;
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
    const requestCellTook = document.createElement('td');

    requestCellId.innerHTML = simulation.id;
    requestCellType.appendChild(createTypeTag(simulation.type));
    requestCellRandomDelay.innerHTML = simulation.options.maxRandomDelay;
    requestCellNumberOfRequests.innerHTML = simulation.requests.total;
    requestCellSent.innerHTML = simulation.requests.sent;
    simulation.requests.sent$.subscribe((sent) => requestCellSent.innerHTML = sent);
    requestCellCompleted.innerHTML = simulation.requests.completed;
    simulation.requests.completed$.subscribe((completed) => requestCellCompleted.innerHTML = completed);
    requestCellTook.innerHTML = simulation.requests.time.took;
    simulation.requests.time.took$.subscribe((took) => requestCellTook.innerHTML = took);

    requestRow.appendChild(requestCellId);
    requestRow.appendChild(requestCellType);
    requestRow.appendChild(requestCellRandomDelay);
    requestRow.appendChild(requestCellNumberOfRequests);
    requestRow.appendChild(requestCellSent);
    requestRow.appendChild(requestCellCompleted);
    requestRow.appendChild(requestCellTook);

    requestsTableBodyNew.appendChild(requestRow)
    if (requestsTableRows.length > 0) {
        requestsTableRows.forEach((node) => requestsTableBodyNew.appendChild(node));
    }

    requestsTableBodyOld.parentNode.replaceChild(requestsTableBodyNew, requestsTableBodyOld)
}

function makeRequest(simulation) {
    simulation.requests.time.start = Date.now();
    simulation.requests.time.took = 0;

    simulation.requests.sent += 1;
    simulation.requests.sent$.next(simulation.requests.sent);

    return rxjs.from(
        axios.post(`http://${MIDDLEWARE.host}:${MIDDLEWARE.port}/simulation/${simulation.type.type}`, { 
            maxRandomDelay: simulation.options.maxRandomDelay
        })
    );
}

function treatResponse(simulation, index, response, err) {
    const srcElement = document.querySelector('#' + simulation.srcElement.id);
    const request = simulation.requests.requests[index];
console.log(err);
    request.end = Date.now();
    request.took = request.end - request.start;
    request.reponse = response;

    simulation.requests.completed += 1;
    simulation.requests.completed$.next(simulation.requests.completed);

    updateSimulationTookTime(simulation);

    srcElement.innerText = `${simulation.requests.completed}/${simulation.requests.total}`;

    simulation.requests.requests$.next(simulation.requests.requests);

    if (simulation.requests.completed == simulation.requests.total) {
        simulation.requests.requests$.complete();
    }
}

function startSimulation(simulation) {
    document.querySelector('#' + simulation.srcElement.id).disabled = true;

    simulation.requests.requests$.next(
        rxjs.range(0, simulation.requests.total)
            .subscribe((index) => {
                const request = createRequest(`${simulation.type.type}-${index}`);

                simulation.requests.requests.push(request);
                makeRequest(simulation)
                .subscribe(
                    (response) => treatResponse(simulation, index, response, null),
                    (err) => treatResponse(simulation, index, null, 'err'));
        })
    );
}

function updateSimulationTookTime(simulation) {
    simulation.requests.time.end = Date.now();
    simulation.requests.time.took = simulation.requests.time.end - simulation.requests.time.start;
    simulation.requests.time.took$.next(simulation.requests.time.took);
}

function endSimulation(simulation) {
    const srcElement = document.querySelector('#' + simulation.srcElement.id);

    updateSimulationTookTime(simulation);

    srcElement.disabled = false;
    srcElement.innerText = simulation.srcElement.innerText;
}

function simulate(event) {
    const simulationType = selectSimulationType(event);
    const simulation = createSimulation(simulationType);

    createRequestsTableRow(simulation);

    simulations$.next(simulation);
}

rxjs.fromEvent(document.querySelector('#form-request'), 'submit')
    .subscribe(
        event => event.preventDefault(),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-success'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-error'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

rxjs.fromEvent(document.querySelector('#btn-exception'), 'click')
    .subscribe(
        event => simulate(event),
        err => console.log(err)
    );

simulations$.subscribe(
    simulation =>  {
        simulation.requests.requests$.subscribe(
            (response) => null,
            (err) => console.log(err),
            () => endSimulation(simulation)
        );

        startSimulation(simulation);
    },
    err => console.log(err)
);