import { ikkanClientBridge, sideEffect } from "@ikkan/client";
import { config } from "./config";
import { getConfig as apiTasksConfig } from "@/app/api/tasks/[id]/(default)/config";

export const { hook: usePostTaskDate, action: taskDate } = ikkanClientBridge(
  config,
  [
    sideEffect(
      config,
      apiTasksConfig,
    )({
      endpointGenerator: ({ args: { id } }) => ({ id }),
      mutator: (cachedValue, response) => {
        return response;
      },
    }),
  ],
);
