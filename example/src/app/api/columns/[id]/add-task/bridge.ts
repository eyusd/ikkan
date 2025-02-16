import { ikkanClientBridge, sideEffect } from "@ikkan/client";
import { config } from "./config";
import { config as apiColumnsTasksConfig } from "@/app/api/columns/[id]/tasks/config";

export const { hook: useAddTask, action: addTask } = ikkanClientBridge(config, [
  sideEffect(
    config,
    apiColumnsTasksConfig,
  )({
    endpointGenerator: ({ segments: { id } }) => ({ id }),
    mutator: (cachedValue, response) => {
      return cachedValue ? [...cachedValue, response] : [response];
    },
  }),
]);
