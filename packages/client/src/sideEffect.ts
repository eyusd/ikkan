import { EndpointGenerator } from "@ikkan/core";
import { IkkanConfig, JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";

export type FullArgs<
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
> = {
  args: FromEndpointArgs;
  params: FromSchema extends z.ZodType ? z.infer<FromSchema> : undefined;
  output: FromOutput;
};

type EndpointArgsGenerator<
  ToEndpointArgs extends Record<string, string | string[]> | undefined,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
> = (
  args: FullArgs<FromOutput, FromSchema, FromEndpointArgs>,
) => ToEndpointArgs;

type URLGenerator<
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
> = (args: FullArgs<FromOutput, FromSchema, FromEndpointArgs>) => string;

type Mutator<ToOutput extends JsonValue, FromOutput extends JsonValue> = (
  cachedValue: ToOutput | undefined,
  response: FromOutput,
) => ToOutput | undefined;

type IkkanSideEffect<
  ToOutput extends JsonValue,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
> = {
  mutator: Mutator<ToOutput, FromOutput>;
  urlGenerator: URLGenerator<FromOutput, FromSchema, FromEndpointArgs>;
};

export type IkkanSideEffects<
  FromT extends JsonValue[],
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
> = {
  [K in keyof FromT]: IkkanSideEffect<
    FromT[K],
    FromOutput,
    FromSchema,
    FromEndpointArgs
  >;
};

function partialSideEffectNoEndpoint<
  ToOutput extends JsonValue,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
>({
  mutator,
  endpoint,
}: {
  mutator: Mutator<ToOutput, FromOutput>;
  endpoint: EndpointGenerator<undefined>;
}) {
  return {
    urlGenerator: () => endpoint(),
    mutator,
  } as IkkanSideEffect<ToOutput, FromOutput, FromSchema, FromEndpointArgs>;
}

function partialSideEffectWithEndpoint<
  ToOutput extends JsonValue,
  ToEndpointArgs extends Record<string, string | string[]>,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
>({
  mutator,
  endpoint,
  endpointGenerator,
}: {
  mutator: Mutator<ToOutput, FromOutput>;
  endpoint: EndpointGenerator<ToEndpointArgs>;
  endpointGenerator: EndpointArgsGenerator<
    ToEndpointArgs,
    FromOutput,
    FromSchema,
    FromEndpointArgs
  >;
}) {
  return {
    urlGenerator: (args: FullArgs<FromOutput, FromSchema, FromEndpointArgs>) =>
      endpoint(endpointGenerator(args)),
    mutator,
  } as IkkanSideEffect<ToOutput, FromOutput, FromSchema, FromEndpointArgs>;
}

type VariableSideEffect<
  ToOutput extends JsonValue,
  ToEndpointArgs extends Record<string, string | string[]> | undefined,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
> = (
  args: ToEndpointArgs extends Record<string, string | string[]>
    ? {
        endpointGenerator: EndpointArgsGenerator<
          ToEndpointArgs,
          FromOutput,
          FromSchema,
          FromEndpointArgs
        >;
        mutator: Mutator<ToOutput, FromOutput>;
      }
    : {
        mutator: Mutator<ToOutput, FromOutput>;
      },
) => IkkanSideEffect<ToOutput, FromOutput, FromSchema, FromEndpointArgs>;

export function sideEffect<
  ToMethod extends NextHTTPMethod,
  ToOutput extends JsonValue,
  ToSchema extends z.ZodType | undefined,
  ToEndpointArgs extends Record<string, string | string[]> | undefined,
  ToServerSideImports extends (() => Promise<any>) | undefined,
  FromMethod extends NextHTTPMethod,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromEndpointArgs extends Record<string, string | string[]> | undefined,
  FromServerSideImports extends (() => Promise<any>) | undefined
>(
  fromConfig: IkkanConfig<
    FromMethod,
    FromOutput,
    FromSchema,
    FromEndpointArgs,
    FromServerSideImports
  >,
  toConfig: IkkanConfig<ToMethod, ToOutput, ToSchema, ToEndpointArgs, ToServerSideImports>,
) {
  const { endpoint: otherEndpoint } = toConfig;
  switch (otherEndpoint.length) {
    case 0: {
      const variableEffectNoEndpoint: VariableSideEffect<
        ToOutput,
        undefined,
        FromOutput,
        FromSchema,
        FromEndpointArgs
      > = ({ mutator }) =>
        partialSideEffectNoEndpoint<
          ToOutput,
          FromOutput,
          FromSchema,
          FromEndpointArgs
        >({ mutator, endpoint: otherEndpoint as EndpointGenerator<undefined> });
      return variableEffectNoEndpoint;
    }
    case 1: {
      const variableEffectWithEndpoint: VariableSideEffect<
        ToOutput,
        Exclude<ToEndpointArgs, undefined>,
        FromOutput,
        FromSchema,
        FromEndpointArgs
      > = ({ endpointGenerator, mutator }) =>
        partialSideEffectWithEndpoint<
          ToOutput,
          Exclude<ToEndpointArgs, undefined>,
          FromOutput,
          FromSchema,
          FromEndpointArgs
        >({
          mutator,
          endpoint: otherEndpoint as EndpointGenerator<
            Exclude<ToEndpointArgs, undefined>
          >,
          endpointGenerator: endpointGenerator as EndpointArgsGenerator<
            Exclude<ToEndpointArgs, undefined>,
            FromOutput,
            FromSchema,
            FromEndpointArgs
          >,
        });
      return variableEffectWithEndpoint;
    }
    default: {
      throw new Error("Invalid endpoint length");
    }
  }
}
