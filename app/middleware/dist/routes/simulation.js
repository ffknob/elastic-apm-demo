"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const request_parser_1 = __importDefault(require("../controllers/request-parser"));
const simulation_1 = __importDefault(require("../controllers/simulation"));
const router = express_1.default.Router();
router.post('/success', request_parser_1.default.requestParser, simulation_1.default.generateSuccess);
router.post('/thrown-error', request_parser_1.default.requestParser, simulation_1.default.generateThrownError);
router.post('/captured-error', request_parser_1.default.requestParser, simulation_1.default.generateCapturedError);
router.post('/complex-transaction', request_parser_1.default.requestParser, simulation_1.default.generateComplexTransaction);
router.post('/distributed-transaction', request_parser_1.default.requestParser, simulation_1.default.generateDistributedTransaction);
exports.default = router;
