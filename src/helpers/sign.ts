const encoder = new TextEncoder();

export const sign = async (
  message: string,
  keyPair: CryptoKeyPair
): Promise<number[]> => {
  return Array.from(
    new Uint8Array(
      await window.crypto.subtle.sign(
        {
          name: "ECDSA",
          hash: "SHA-256",
        },
        keyPair.privateKey,
        encoder.encode(message)
      )
    )
  );
};
