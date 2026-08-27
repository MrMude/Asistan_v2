import { makeArrayRouter } from "./genericArray.routes";
import { ChatThread } from "../types";

export default makeArrayRouter<ChatThread>("chats");
