import HostMetadata from './HostMetadata';
import ContainerMetadata from './ContainerMetadata';
import KubernetesMetadata from './KubernetesMetadata';

export default interface BackendResponseMetadata {
    host?: Partial<HostMetadata>;
    container?: Partial<ContainerMetadata>;
    kubernetes?: Partial<KubernetesMetadata>;
}
