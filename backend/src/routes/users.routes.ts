import { makeArrayRouter } from "./genericArray.routes";
import { User } from "../types";

export default makeArrayRouter<User>("users");
