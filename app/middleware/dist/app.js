"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//import ApmService from './services/apm';
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const simulation_1 = __importDefault(require("./routes/simulation"));
//const apmService = new ApmService();
//apmService.init();
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.use(morgan_1.default('tiny'));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
app.use('/api/v1/simulate', simulation_1.default);
app.use((err, req, res) => {
    //apmService.captureError(err);
    res.status(err.statusCode || 500).json({
        error: true,
        message: err.message
    });
});
const MIDDLEWARE_PORT = process.env.MIDDLEWARE_PORT
    ? parseInt(process.env.MIDDLEWARE_PORT)
    : 3000;
app.listen(MIDDLEWARE_PORT, () => console.log(`Server running on port ${MIDDLEWARE_PORT}`));
