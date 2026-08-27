import { makeObjectRouter } from "./genericObject.routes";
import { StationDataMap } from "../types";

export default makeObjectRouter<StationDataMap>("stationData");
