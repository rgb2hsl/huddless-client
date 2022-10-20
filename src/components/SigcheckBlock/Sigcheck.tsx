import React from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/RootStore";
import { Spinner } from "../Spinner";
import { Button } from "../LinkButton";

export const Sigcheck = observer(() => {
  const store = useStore();

  return store.testStore.loading ? (
    <>
      Testing <Spinner /> ...
    </>
  ) : (
    <>
      {store.testStore.text && <>Crypto is {store.testStore.text} </>}
      <Button
        onClick={() => store.testStore.sigcheck()}
        disabled={store.testStore.loading}
      >
        {store.testStore.text ? "Check again" : "Check cryptography"}
      </Button>
    </>
  );
});
