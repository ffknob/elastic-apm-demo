"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simulation_1 = __importDefault(require("../services/simulation"));
const generateSuccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new simulation_1.default();
    yield simulation.generateSuccess(simulationRequest);
    res.status(200).send();
});
const generateThrownError = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new simulation_1.default();
    try {
        yield simulation.generateThrownError(simulationRequest);
    }
    catch (err) {
        next(err);
    }
});
const generateCapturedError = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new simulation_1.default();
    yield simulation.generateCapturedError(simulationRequest);
});
const generateComplexTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new simulation_1.default();
    yield simulation.generateComplexTransaction(simulationRequest);
    res.status(200).send();
});
const generateDistributedTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    generateSuccess;
    const simulationRequest = res.locals.simulationRequest;
    const simulation = new simulation_1.default();
    yield simulation.generateDistributedTransaction(simulationRequest);
    res.status(200).send();
});
exports.default = {
    generateSuccess,
    generateThrownError,
    generateCapturedError,
    generateComplexTransaction,
    generateDistributedTransaction
};
