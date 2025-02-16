import { ikkanHandler } from "@ikkan/server";
import { config } from "./config";

export const { POST } = await ikkanHandler(config);
