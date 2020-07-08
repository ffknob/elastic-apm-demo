import os from 'os';

import { Request, Response, NextFunction, RequestHandler } from 'express';
import HostMetadata from '../shared/interfaces/host-metadata';
import ContainerMetadata from '../shared/interfaces/container-metadata';
import KubernetesMetadata from '../shared/interfaces/kubernetes-metadata';
import SimulationResponseMetadata from '../shared/interfaces/simulation-response-metadata';

const metadataMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const hostMetadata: Partial<HostMetadata> = {
        hostname: os.hostname(),
        type: os.type(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        uptime: os.uptime(),
        loadavg: os.loadavg(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        cpus: os.cpus(),
        networkInterfaces: os.networkInterfaces()
    };
    const containerMetadata: Partial<ContainerMetadata> = {
        containerId: process.env.ELASTIC_APM_CONTAINER_ID
    };
    const kubernetesMetadata: Partial<KubernetesMetadata> = {
        kubernetesNodeName: process.env.KUBERNETES_NODE_NAME,
        kubernetesNamespace: process.env.KUBERNETES_NAMESPACE,
        kubernetesPodName: process.env.KUBERNETES_POD_NAME,
        kubernetesPodUid: process.env.KUBERNETES_POD_UID
    };

    const metadata: Partial<SimulationResponseMetadata> = {
        host: hostMetadata,
        container: containerMetadata,
        kubernetes: kubernetesMetadata
    };

    res.locals.metadata = metadata;

    next();
};

export default metadataMiddleware;
