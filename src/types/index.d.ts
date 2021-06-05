type Action<T, P = never> = {
  type: T;
  payload: P;
}
