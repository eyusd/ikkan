import { ikkanHandler } from "@ikkan/server";
import { getConfig, deleteConfig } from "./config";

export const { GET } = await ikkanHandler(getConfig);
export const { DELETE } = await ikkanHandler(deleteConfig);
