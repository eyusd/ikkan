import { ikkanServerBridge } from "@ikkan/server";
import { handler } from "./handler";

export const getColumns = ikkanServerBridge(handler);
