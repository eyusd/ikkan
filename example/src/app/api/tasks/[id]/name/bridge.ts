import { ikkanClientBridge, sideEffect } from "@ikkan/client";
import { config } from "./config";
import { getConfig as apiTasksConfig } from "@/app/api/tasks/[id]/(default)/config";

export const { hook: usePostTaskName, action: taskName } = ikkanClientBridge(
  config,
  [
    sideEffect(
      config,
      apiTasksConfig,
    )({
      endpointGenerator: ({ segments: { id } }) => ({ id }),
      mutator: (cachedValue, response) => {
        return response;
      },
    }),
  ],
);
