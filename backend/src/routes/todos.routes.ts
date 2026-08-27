import { makeArrayRouter } from "./genericArray.routes";
import { Todo } from "../types";

export default makeArrayRouter<Todo>("todos");
