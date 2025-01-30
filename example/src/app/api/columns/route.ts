import { ikkanHandler } from "@ikkan/server";
import { handler } from "./handler";

export const { GET } = ikkanHandler(handler);
