import { ikkanClientBridge } from "@ikkan/client";
import { config } from "./config";

export const { hook: useGetTasks, action: getTasks } =
  ikkanClientBridge(config);
