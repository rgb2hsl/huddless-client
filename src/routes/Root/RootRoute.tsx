import React, { useCallback, useEffect, useState } from "react";
import { Wrapper } from "../../components/Wrapper";
import { StatusBlock } from "../../components/Status/StatusBlock";
import { LayoutDefault } from "../../components/Layout/LayoutDefault";
import { Center } from "../../components/Center";
import { Outlet, useMatch, useNavigate, useRouteError } from "react-router-dom";
import { Button, LinkButton } from "../../components/LinkButton";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/RootStore";
import { Danger } from "../../components/Danger/Danger";
import { Clipboard } from "../../components/Clipboard/Clipboard";
import { Spinner } from "../../components/Spinner";
import { JWKPair } from "../../store/IdentityStore";
import { Info } from "../../components/Info/Info";
import { AnimatedBG } from "../../components/AnimatedBG";
import { BlocksRow } from "../../components/BlocksRow";
import { SigcheckBlock } from "../../components/SigcheckBlock/SigcheckBlock";
import { useRedirectIfLoaded } from "../../hooks/useRedirectToRoot";
import { Elipsis } from "../../components/Elipsis";

export const RootRoute = observer(() => {
  const match = useMatch("/");
  const store = useStore();

  return (
    <AnimatedBG>
      <Wrapper>
        {store.identityStore.loading ? (
          <>
            <div>
              Checking DB <Spinner /> ...
            </div>
          </>
        ) : (
          <>
            <LayoutDefault>
              <nav>
                {!match ? (
                  <>
                    <LinkButton to={"/"}>Home</LinkButton>
                  </>
                ) : null}
              </nav>
              <Center>
                <Outlet />
              </Center>
              <BlocksRow>
                <StatusBlock />
                {store.identityStore.keyPair ? <SigcheckBlock /> : null}
              </BlocksRow>
            </LayoutDefault>
          </>
        )}
      </Wrapper>
    </AnimatedBG>
  );
});

export const Index = observer(() => {
  const store = useStore();

  return (
    <>
      <h1>H U D D L E S S</h1>
      {store.identityStore.keyPair ? (
        <>
          <p>
            <Elipsis>
              <Info>Identity: {store.identityStore.identityDigest}</Info>
            </Elipsis>
          </p>
          <p>We're all set.</p>
          <p>
            <LinkButton size={"big"} to={"/hub/"}>
              Start!
            </LinkButton>
          </p>
          <p>
            <LinkButton size={"big"} to={"/identity/delete"}>
              Delete Identity.
            </LinkButton>
          </p>
        </>
      ) : (
        <>
          <p>
            No Identity found. You need to generate one first. Or you can load
            one with a JWK pair backup.
          </p>
          <p>
            <LinkButton to={"/identity/generate"} size={"big"}>
              Generate Identity
            </LinkButton>
          </p>
          <p>
            <LinkButton to={"/identity/load"} size={"big"}>
              Load Identity
            </LinkButton>
          </p>
        </>
      )}
    </>
  );
});

export const IdentityLoad = observer(() => {
  const store = useStore();
  const [error, setError] = useState(false);
  const [value, setValue] = useState("");
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value),
    []
  );
  const handleLoad = useCallback(() => {
    let jwkPair: JWKPair | undefined;

    try {
      jwkPair = JSON.parse(value);
      if (jwkPair && jwkPair.privateKey && jwkPair.publicKey) {
        store.identityStore.loadJWKPair(jwkPair);
      }
    } catch {
      setError(true);
    }
  }, [value]);

  useRedirectIfLoaded(store);

  useEffect(() => () => store.identityStore.clearJWKPair(), []);

  return (
    <>
      <h1>Load Identity</h1>
      <p>Paste your JWKPair backup in a textarea below.</p>
      <p>
        <Clipboard value={value} onChange={handleChange} />
      </p>
      {error ? (
        <p>
          <Danger>Something wrong with your JWK Pair</Danger>
        </p>
      ) : null}
      <p>
        <Button size={"big"} disabled={!value} onClick={handleLoad}>
          Load this Identity
        </Button>
      </p>
    </>
  );
});

export const IdentityGenerate = observer(() => {
  const navigate = useNavigate();
  const store = useStore();

  useEffect(() => {
    if (store.identityStore.keyPair) {
      navigate("/");
    }
  }, [store.identityStore.keyPair]);

  const [terms, setTerms] = useState(false);
  const hadleTerms = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTerms(e.target.checked),
    []
  );
  const generate = useCallback(
    () => store.identityStore.generateJWKPair(),
    [store.identityStore.generateJWKPair]
  );
  useEffect(() => () => store.identityStore.clearJWKPair(), []);

  return (
    <>
      <h1>Generate Identity</h1>
      {store.identityStore.jwkPair ? (
        <>
          <p>Here's your JWK pair.</p>
          <p>
            <Clipboard
              defaultValue={JSON.stringify(store.identityStore.jwkPair)}
            />
          </p>
          <p>
            <small>
              After you've saved your JWK pair in a secure place (really, ONLY
              after that) you can use them for load your Identity. It works this
              way so nobody can extract your Identity's private key and pretend
              to be you (unless they obtain your private key from JWK pair, so
              keep it safe). <b>You got it?</b>
            </small>
          </p>
          <p>
            <label>
              I Got it!{" "}
              <input type={"checkbox"} checked={terms} onChange={hadleTerms} />
            </label>
          </p>
          <p>
            <Button
              size={"big"}
              disabled={!terms}
              onClick={() => store.identityStore.loadJWKPair()}
            >
              Load this Identity
            </Button>
          </p>
        </>
      ) : (
        <>
          <p>
            Your Identity is a pair of keys — Public and Private. We will
            generate one in a moment. Mind to save and keep them in a secured
            place, ok?
          </p>
          <p>
            <Button size={"big"} onClick={() => generate()}>
              Ok, Generate Identity now
            </Button>
          </p>
        </>
      )}
    </>
  );
});

export const IdentityDelete = observer(() => {
  const navigate = useNavigate();
  const store = useStore();

  const [terms, setTerms] = useState(false);
  const hadleTerms = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTerms(e.target.checked),
    []
  );

  // redirect to "/" if idenity deleted
  useEffect(() => {
    if (!store.identityStore.keyPair) {
      navigate("/");
    }
  }, [store.identityStore.keyPair]);

  const handleDelete = useCallback(
    () => store.identityStore.deleteKeyPair(),
    [store.identityStore.deleteKeyPair]
  );

  return (
    <>
      <h1>Delete Identity</h1>
      <p>
        <Danger>This action is irreversible!</Danger>
      </p>
      <p>
        <small>
          After deleting Identity you can only restore it from your JWK Pair
          backup file.
          <br />
          <b>You got it?</b>
        </small>
      </p>
      <p>
        <label>
          I Got it!{" "}
          <input type={"checkbox"} checked={terms} onChange={hadleTerms} />
        </label>
      </p>
      <p>
        <Button size={"big"} disabled={!terms} onClick={handleDelete}>
          Delete Identity
        </Button>
      </p>
    </>
  );
});

interface RouterError {
  statusText?: string;
  message?: string;
}

export const RootError = () => {
  const error = useRouteError() as RouterError;

  useEffect(() => console.error(error), []);

  return (
    <>
      <h1>Error</h1>
      <p>
        <Danger>{error.statusText || error.message}</Danger>
      </p>
    </>
  );
};
