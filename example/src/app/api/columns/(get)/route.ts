import { ikkanHandler } from "@ikkan/server";
import { config } from "./config";
import { ikkanClientBridge } from "@ikkan/client";

export const { GET } = await ikkanHandler(config);
