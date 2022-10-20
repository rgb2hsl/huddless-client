import { StatusStore } from "./StatusStore";
import React, { useContext } from "react";
import { IdentityStore } from "./IdentityStore";
import { TestStore } from "./TestStore";
import { HubStore } from "./HubStore";

export class RootStore {
  public statusStore: StatusStore;
  public identityStore: IdentityStore;
  public testStore: TestStore;
  public hubStore: HubStore;

  constructor() {
    this.statusStore = new StatusStore(this);
    this.identityStore = new IdentityStore(this);
    this.testStore = new TestStore(this);
    this.hubStore = new HubStore(this);
  }
}

export const rootStore = new RootStore();

export const RootStoreContext = React.createContext(rootStore);

export const useStore = () => useContext(RootStoreContext);
