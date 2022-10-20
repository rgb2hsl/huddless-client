import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/RootStore";
import { Spinner } from "../Spinner";
import { Button } from "../LinkButton";

export const Status = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.statusStore.fetch();
  }, []);

  return store.statusStore.loading ? (
    <>
      Loading <Spinner /> ...
    </>
  ) : (
    <>
      Hub status: {store.statusStore.status}{" "}
      <Button
        onClick={() => store.statusStore.fetch()}
        disabled={store.statusStore.loading}
      >
        Refresh
      </Button>
    </>
  );
});
