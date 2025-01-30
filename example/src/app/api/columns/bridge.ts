import { ikkanServerBridge } from "@ikkan/server";
import { handler } from "./handler";

export const getColumns = ikkanServerBridge<
  "/api/columns",
  "GET",
  number[],
  undefined
>(handler);
