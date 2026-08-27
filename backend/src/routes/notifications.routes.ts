import { makeArrayRouter } from "./genericArray.routes";
import { AppNotification } from "../types";

export default makeArrayRouter<AppNotification>("notifications");
