import { api } from "./client";
import { StationDataMap } from "../types";

export const stationDataApi = {
  get: () => api.get<StationDataMap>("/station-data"),
  replace: (data: StationDataMap) => api.put<StationDataMap>("/station-data", data),
};
