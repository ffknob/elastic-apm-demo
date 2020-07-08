"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SPAN_TYPES = [
    'ext.http.http',
    'db.elasticsearch.request',
    'db.mongodb.query',
    'db.postgresql.query',
    'db.graphql.execute',
    'cache.redis',
    'websocket.send',
];
exports.default = SPAN_TYPES;
