export default interface HostMetadata {
    hostname?: string;
    type?: string;
    platform?: string;
    arch?: string;
    release?: string;
    uptime?: number;
    loadavg?: [number, number, number];
    totalmem?: number;
    freemem?: number;
    cpus?: any[];
    networkInterfaces?: any[];
}
