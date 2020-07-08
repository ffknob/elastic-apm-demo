import { CpuInfo, NetworkInterfaceInfo } from 'os';

export default interface HostMetadata {
    hostname: string;
    type: string;
    platform: string;
    arch: string;
    release: string;
    uptime: number;
    loadavg: number[];
    totalmem: number;
    freemem: number;
    cpus: CpuInfo[];
    networkInterfaces: { [index: string]: NetworkInterfaceInfo[] };
}
