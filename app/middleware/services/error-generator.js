const ERRORS = [
    { category: 'http', statusCode: 400, message: 'Bad Request' },
    { category: 'http', statusCode: 401, message: 'Unauthorized' },
    { category: 'http', statusCode: 402, message: 'Required' },
    { category: 'http', statusCode: 403, message: 'Forbidden' },
    { category: 'http', statusCode: 404, message: 'Not Found' },
    { category: 'http', statusCode: 405, message: 'Method Not Allowed' },
    { category: 'http', statusCode: 406, message: 'Not Acceptable' },
    { category: 'http', statusCode: 407, message: 'Proxy Authentication Required' },
    { category: 'http', statusCode: 408, message: 'Request Timeout' },
    { category: 'http', statusCode: 409, message: 'Conflict' },
    { category: 'http', statusCode: 410, message: 'Gone' },
    { category: 'http', statusCode: 411, message: 'Length Required' },
    { category: 'http', statusCode: 412, message: 'Precondition Failed' },
    { category: 'http', statusCode: 413, message: 'Payload Too Large' },
    { category: 'http', statusCode: 414, message: 'URI Too Long' },
    { category: 'http', statusCode: 415, message: 'Unsupported Media Type' },
    { category: 'http', statusCode: 416, message: 'Range Not Satisfiable' },
    { category: 'http', statusCode: 417, message: 'Expectation Failed' },
    { category: 'http', statusCode: 421, message: 'Misdirected Request' },
    { category: 'http', statusCode: 422, message: 'Unprocessable Entity' },
    { category: 'http', statusCode: 423, message: 'Locked' },
    { category: 'http', statusCode: 424, message: 'Failed Dependency' },
    { category: 'http', statusCode: 425, message: 'Too Early' },
    { category: 'http', statusCode: 426, message: 'Upgrade Required' },
    { category: 'http', statusCode: 428, message: 'Precondition Required' },
    { category: 'http', statusCode: 429, message: 'Too Many Requests' },
    { category: 'http', statusCode: 431, message: 'Request Header Fields Too Large' },
    { category: 'http', statusCode: 451, message: 'Unavailable For Legal Reasons' },
    { category: 'http', statusCode: 500, message: 'Internal Server Error' },
    { category: 'http', statusCode: 501, message: 'Not Implemented' },
    { category: 'http', statusCode: 502, message: 'Bad Gateway' },
    { category: 'http', statusCode: 503, message: 'Service Unavailable' },
    { category: 'http', statusCode: 504, message: 'Gateway Timeout' },
    { category: 'http', statusCode: 505, message: 'HTTP Version Not Supported' },
    { category: 'http', statusCode: 506, message: 'Variant Also Negotiates' },
    { category: 'http', statusCode: 507, message: 'Insufficient Storage' },
    { category: 'http', statusCode: 508, message: 'Loop Detected' },
    { category: 'http', statusCode: 510, message: 'Not Extended' },
    { category: 'http', statusCode: 511, message: 'Network Authentication Required' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'There are not living connections' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'The argument provided is not an array' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'Invalid protocol: \'file\'' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'Request timed out' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'Unsupported role: \'foo\'' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'Connection with id \'1234\' is already present' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'Missing required parameter: body' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'Missing required parameter of the url: index' },
    { category: 'elasticsearch-js', statusCode: 500, message: 'Headers should be an object, instead got: integer' },
    { category: 'mongoose', statusCode: 500, message: 'No document found for query "foo" on model "bar"' },
    { category: 'mongoose', statusCode: 500, message: 'Mongoose could not convert a value to the type defined in the schema path. May be in a `ValidationError` class `errors` property.' },
    { category: 'mongoose', statusCode: 500, message: 'This connection timed out in trying to reconnect to MongoDB and will not successfully reconnect to MongoDB unless you explicitly reconnect.' },
    { category: 'mongoose', statusCode: 500, message: 'You attempted to `save()` an array that was modified after you loaded it with a `$elemMatch` or similar projection.' },
    { category: 'mongoose', statusCode: 500, message: 'You tried to access a model with `mongoose.model()` that was not defined.' },
    { category: 'mongoose', statusCode: 500, message: 'The document you tried to `save()` was not found.' },
    { category: 'mongoose', statusCode: 500, message: 'Error from an individual schema path\'s validator.' },
    { category: 'mongoose', statusCode: 500, message: 'Error returned from [`validate()`](api.html#document_Document-validate) or `validateSync()`. Contains zero or more `ValidatorError` instances in `.errors` property.' },
    { category: 'mongoose', statusCode: 500, message: 'You called `mongoose.Document()` without a schema.' },
    { category: 'mongoose', statusCode: 500, message: 'Ran out of retries trying to reconnect to "mongodb://...". Try setting `server.reconnectTries` and `server.reconnectInterval` to something higher.' }    
];

module.exports = class ErrorGenerator {
    constructor() { }

    getRandomError(category) {
        const errors = ERRORS.filter(e => !category ? true : e.category === category);
        const randomIndex = Math.floor(Math.random() * (errors.length));
        const randomError = errors[randomIndex];
        const error = new Error(randomError.message);
        error.category = randomError.category;
        error.statusCode = randomError.statusCode; 

        return error;
    }
}



