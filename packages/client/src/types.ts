export type WaterfallFunction<Endpoint extends string, Output, CachedType> = (
  returnValue: Output,
) => {
  endpoint: Endpoint;
  mutator: (cachedValue: CachedType | undefined) => CachedType | undefined;
};
