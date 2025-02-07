import { ikkanHandler } from "@ikkan/server";
import { getConfig, deleteConfig } from "./config";

export const { GET } = ikkanHandler(getConfig);
export const { DELETE } = ikkanHandler(deleteConfig);
