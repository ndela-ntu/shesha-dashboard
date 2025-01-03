interface DayStatus {
  [day: string]: "active" | "inactive";
}

export default interface IStoreOperatingHours {
  id: number;
  from: string;
  to: string;
  days: DayStatus[];
}
