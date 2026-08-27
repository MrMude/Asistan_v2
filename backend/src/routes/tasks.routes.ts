import { makeArrayRouter } from "./genericArray.routes";
import { Task } from "../types";

export default makeArrayRouter<Task>("tasks");
