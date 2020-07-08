import HostMetadata from './host-metadata';
import ContainerMetadata from './container-metadata';
import KubernetesMetadata from './kubernetes-metadata';

export default interface SimulationResponseMetadata {
    host?: Partial<HostMetadata>;
    container?: Partial<ContainerMetadata>;
    kubernetes?: Partial<KubernetesMetadata>;
}
