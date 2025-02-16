import { EndpointGenerator } from "@ikkan/core";
import { IkkanConfig, JsonValue, NextHTTPMethod } from "@ikkan/core";
import { z } from "zod";

export type FullArgs<
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
> = {
  segments: FromSegments;
  params: FromSchema extends z.ZodType ? z.infer<FromSchema> : undefined;
  output: FromOutput;
};

type SegmentsGenerator<
  ToSegments extends Record<string, string | string[]> | undefined,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
> = (
  args: FullArgs<FromOutput, FromSchema, FromSegments>,
) => ToSegments;

type URLGenerator<
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
> = (args: FullArgs<FromOutput, FromSchema, FromSegments>) => string;

type Mutator<ToOutput extends JsonValue, FromOutput extends JsonValue> = (
  cachedValue: ToOutput | undefined,
  response: FromOutput,
) => ToOutput | undefined;

type IkkanSideEffect<
  ToOutput extends JsonValue,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
> = {
  mutator: Mutator<ToOutput, FromOutput>;
  urlGenerator: URLGenerator<FromOutput, FromSchema, FromSegments>;
};

export type IkkanSideEffects<
  FromT extends JsonValue[],
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
> = {
  [K in keyof FromT]: IkkanSideEffect<
    FromT[K],
    FromOutput,
    FromSchema,
    FromSegments
  >;
};

function partialSideEffectNoEndpoint<
  ToOutput extends JsonValue,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
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
  } as IkkanSideEffect<ToOutput, FromOutput, FromSchema, FromSegments>;
}

function partialSideEffectWithEndpoint<
  ToOutput extends JsonValue,
  ToSegments extends Record<string, string | string[]>,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
>({
  mutator,
  endpoint,
  endpointGenerator,
}: {
  mutator: Mutator<ToOutput, FromOutput>;
  endpoint: EndpointGenerator<ToSegments>;
  endpointGenerator: SegmentsGenerator<
    ToSegments,
    FromOutput,
    FromSchema,
    FromSegments
  >;
}) {
  return {
    urlGenerator: (args: FullArgs<FromOutput, FromSchema, FromSegments>) =>
      endpoint(endpointGenerator(args)),
    mutator,
  } as IkkanSideEffect<ToOutput, FromOutput, FromSchema, FromSegments>;
}

type VariableSideEffect<
  ToOutput extends JsonValue,
  ToSegments extends Record<string, string | string[]> | undefined,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
> = (
  args: ToSegments extends Record<string, string | string[]>
    ? {
        endpointGenerator: SegmentsGenerator<
          ToSegments,
          FromOutput,
          FromSchema,
          FromSegments
        >;
        mutator: Mutator<ToOutput, FromOutput>;
      }
    : {
        mutator: Mutator<ToOutput, FromOutput>;
      },
) => IkkanSideEffect<ToOutput, FromOutput, FromSchema, FromSegments>;

export function sideEffect<
  ToMethod extends NextHTTPMethod,
  ToOutput extends JsonValue,
  ToSchema extends z.ZodType | undefined,
  ToSegments extends Record<string, string | string[]> | undefined,
  ToSSI extends (() => Promise<any>) | undefined,
  FromMethod extends NextHTTPMethod,
  FromOutput extends JsonValue,
  FromSchema extends z.ZodType | undefined,
  FromSegments extends Record<string, string | string[]> | undefined,
  FromSSI extends (() => Promise<any>) | undefined,
>(
  fromConfig: IkkanConfig<
    FromMethod,
    FromOutput,
    FromSchema,
    FromSegments,
    FromSSI
  >,
  toConfig: IkkanConfig<
    ToMethod,
    ToOutput,
    ToSchema,
    ToSegments,
    ToSSI
  >,
) {
  const { endpoint: otherEndpoint } = toConfig;
  switch (otherEndpoint.length) {
    case 0: {
      const variableEffectNoEndpoint: VariableSideEffect<
        ToOutput,
        undefined,
        FromOutput,
        FromSchema,
        FromSegments
      > = ({ mutator }) =>
        partialSideEffectNoEndpoint<
          ToOutput,
          FromOutput,
          FromSchema,
          FromSegments
        >({ mutator, endpoint: otherEndpoint as EndpointGenerator<undefined> });
      return variableEffectNoEndpoint;
    }
    case 1: {
      const variableEffectWithEndpoint: VariableSideEffect<
        ToOutput,
        Exclude<ToSegments, undefined>,
        FromOutput,
        FromSchema,
        FromSegments
      > = ({ endpointGenerator, mutator }) =>
        partialSideEffectWithEndpoint<
          ToOutput,
          Exclude<ToSegments, undefined>,
          FromOutput,
          FromSchema,
          FromSegments
        >({
          mutator,
          endpoint: otherEndpoint as EndpointGenerator<
            Exclude<ToSegments, undefined>
          >,
          endpointGenerator: endpointGenerator as SegmentsGenerator<
            Exclude<ToSegments, undefined>,
            FromOutput,
            FromSchema,
            FromSegments
          >,
        });
      return variableEffectWithEndpoint;
    }
    default: {
      throw new Error("Invalid endpoint length");
    }
  }
}
