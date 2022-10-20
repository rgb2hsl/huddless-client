import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { RootStore } from "./RootStore";

export class StatusStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  loading = false;

  status = "unknown";

  async fetch(): Promise<void> {
    this.loading = true;
    try {
      const huddlessStatus = await axios.get<{
        status: string;
      }>(`${process.env.REACT_APP_BACKEND_URL}/status/`);

      runInAction(() => {
        this.status = huddlessStatus.data.status || "unknown";
        this.loading = false;
      });
    } catch {
      runInAction(() => {
        this.status = "error";
        this.loading = false;
      });
    }
  }
}
