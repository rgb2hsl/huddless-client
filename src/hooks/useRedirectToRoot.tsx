import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { RootStore } from "../store/RootStore";

export const useRedirectIfLoaded = (store: RootStore) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (store.identityStore.keyPair) {
      navigate("/");
    }
  }, [store.identityStore.keyPair]);
};

export const useRedirectIfNotLoaded = (store: RootStore) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!store.identityStore.keyPair) {
      navigate("/");
    }
  }, [store.identityStore.keyPair]);
};
