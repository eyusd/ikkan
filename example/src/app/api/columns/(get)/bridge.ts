import { ikkanServerBridge } from "@ikkan/server";
import { config } from "./config";
import { ikkanClientBridge } from "@ikkan/client";

export const getColumns = ikkanServerBridge(config);

export const { hook, action } = ikkanClientBridge(config)
const { get } = action()