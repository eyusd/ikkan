import { ikkanClientBridge, sideEffect } from "@ikkan/client";
import { getConfig, deleteConfig } from "./config";
import { config as apiColumnsTasksConfig } from "@/app/api/columns/[id]/tasks/config";

export const { hook: useGetTask, action: getTask } =
  ikkanClientBridge(getConfig);

export const { hook: useDeleteTask, action: deleteTask } = ikkanClientBridge(
  deleteConfig,
  [
    sideEffect(
      deleteConfig,
      apiColumnsTasksConfig,
    )({
      endpointGenerator: ({ output: { columnId } }) => ({
        id: columnId.toString(),
      }),
      mutator: (cachedValue, response) => {
        return cachedValue
          ? cachedValue.filter((taskId) => taskId !== response.id)
          : [];
      },
    }),
  ],
);
