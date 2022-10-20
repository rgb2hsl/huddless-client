async function identity(key: CryptoKey | JsonWebKey): Promise<string> {
  if ((key as JsonWebKey).x && (key as JsonWebKey).y) {
    return `${(key as JsonWebKey).x}-${(key as JsonWebKey).y}`;
  } else {
    const jwk = await crypto.subtle.exportKey("jwk", key as CryptoKey);
    return `${jwk.x}-${jwk.y}`;
  }
}

export default identity;
