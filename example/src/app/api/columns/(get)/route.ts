import { ikkanHandler } from "@ikkan/server";
import { config } from "./config";

export const { GET } = await ikkanHandler(config);
