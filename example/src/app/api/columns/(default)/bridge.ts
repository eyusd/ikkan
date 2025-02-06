import { ikkanServerBridge } from "@ikkan/server";
import { config } from "./config";

export const getColumns = ikkanServerBridge(config);
