const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const digest = async (str: string): Promise<string> => {
  return decoder.decode(
    await crypto.subtle.digest("SHA-256", encoder.encode(str))
  );
};
