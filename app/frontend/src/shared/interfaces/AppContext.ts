export default interface AppContext {
  isLoading: boolean;
  loading: (isLoading: boolean) => void;
}
