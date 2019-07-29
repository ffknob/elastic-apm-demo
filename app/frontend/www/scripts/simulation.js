const { Subject, range, from, of, throwError } = rxjs;
const { map, filter, timeoutWith, catchError } = rxjs.operators;

const MIDDLEWARE = {
    host: 'localhost',
    port: 3000
};

const TIMEOUT = 2000;

const SIMULATION_TYPES = {
    SUCCESS: {
        type: 'success',
        text: 'Success',
        class: 'is-success'
    },
    THROWN_ERROR: {
        type: 'thrown-error',
        text: 'Thrown Error',
        class: 'is-warning'
    },
    UNCAUGHT_ERROR: {
        type: 'uncaught-error',
        text: 'Uncaught Error',
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

        case 'btn-thrown-error':
            simulationType = SIMULATION_TYPES.THROWN_ERROR;
            break;

        case 'btn-uncaught-error':
            simulationType = SIMULATION_TYPES.UNCAUGHT_ERROR;
            break;

        case 'btn-exception':
            simulationType = SIMULATION_TYPES.EXCEPTION;
            break;
    }

    return simulationType;
}

function createUserContext() {
    const name = document.querySelector('#input-user-context-name').value;
    const username = document.querySelector('#input-user-context-username').value;
    const email = document.querySelector('#input-user-context-email').value;
    const userContext = {
        name: name,
        username: username,
        email: email
    };

    return userContext;
}

function createCustomContext() {
    return null;
}

function createSimulation(simulationType) {
    const numberOfRequests = document.querySelector('#select-number-of-requests').value;
    const maxRandomDelay = document.querySelector('#input-max-random-delay').value;
    const setRandomUserContext = document.querySelector('#input-set-random-user-context').value;
    const setRandomCustomContext = document.querySelector('#input-set-random-custom-context').value;

    simulationId += 1;
    const simulation = {
        id: simulationId,
        type: simulationType,
        settings: {
            numberOfRequests: numberOfRequests,
            maxRandomDelay: maxRandomDelay,
            setRandomUserContext: setRandomUserContext,
            userContext: createUserContext(),
            setRandomCustomContext: setRandomCustomContext,
            customContext: createCustomContext()
        },
        requests: {
            total: numberOfRequests,
            time: {
                start: null,
                end: null,
                took: 0,
                took$: new Subject()
            },
            sent: 0,
            sent$: new Subject(),
            completed: 0,
            completed$: new Subject(),
            timedOut: 0,
            timedOut$: new Subject(),
            requests: [],
            requests$: new Subject()
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
    const requestCellTimedOut = document.createElement('td');    
    const requestCellCompleted = document.createElement('td');
    const requestCellTook = document.createElement('td');

    requestCellId.innerHTML = simulation.id;
    requestCellType.appendChild(createTypeTag(simulation.type));
    requestCellRandomDelay.innerHTML = simulation.settings.maxRandomDelay;
    requestCellNumberOfRequests.innerHTML = simulation.requests.total;
    requestCellSent.innerHTML = simulation.requests.sent;
    simulation.requests.sent$.subscribe((sent) => requestCellSent.innerHTML = sent);
    requestCellTimedOut.innerHTML = simulation.requests.timedOut;
    simulation.requests.timedOut$.subscribe((timedOut) => requestCellTimedOut.innerHTML = timedOut);
    requestCellCompleted.innerHTML = simulation.requests.completed;
    simulation.requests.completed$.subscribe((completed) => requestCellCompleted.innerHTML = completed);
    requestCellTook.innerHTML = simulation.requests.time.took;
    simulation.requests.time.took$.subscribe((took) => requestCellTook.innerHTML = took);

    requestRow.appendChild(requestCellId);
    requestRow.appendChild(requestCellType);
    requestRow.appendChild(requestCellRandomDelay);
    requestRow.appendChild(requestCellNumberOfRequests);
    requestRow.appendChild(requestCellSent);
    requestRow.appendChild(requestCellTimedOut);    
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

    return axios.post(`http://${MIDDLEWARE.host}:${MIDDLEWARE.port}/simulation/${simulation.type.type}`, { 
            simulationSettings: simulation.settings
        });
}

function treatResponse(simulation, index, response, err) {
    const srcElement = document.querySelector('#' + simulation.srcElement.id);
    const request = simulation.requests.requests[index];

    request.end = Date.now();
    request.took = request.end - request.start;
    request.reponse = response;

    if (err.timedOut) {
        simulation.requests.timedOut += 1;
        simulation.requests.timedOut$.next(simulation.requests.timedOut);
    } else {
        simulation.requests.completed += 1;
        simulation.requests.completed$.next(simulation.requests.completed);
    }

    updateSimulationTookTime(simulation);

    srcElement.innerText = `${simulation.requests.completed}/${simulation.requests.total}`;

    simulation.requests.requests$.next(simulation.requests.requests);

    if ((simulation.requests.completed + simulation.requests.timedOut) == simulation.requests.total) {
        simulation.requests.requests$.complete();
    }
}

function startSimulation(simulation) {
    document.querySelector('#' + simulation.srcElement.id).disabled = true;

    simulation.requests.requests$.next(
        range(0, simulation.requests.total)
        .subscribe(
            (index) => {
            const request = createRequest(`${simulation.type.type}-${index}`);

            simulation.requests.requests.push(request);
            from(makeRequest(simulation))
            .pipe(
                timeoutWith(TIMEOUT, throwError({ timeout: TIMEOUT, timedOut: true }))
            )
            .subscribe(
                (response) => treatResponse(simulation, index, response, null),
                (err) => treatResponse(simulation, index, null, err)
            );
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