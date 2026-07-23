export async function encryptFileBuffer(file: File, secretKey: string): Promise<{ encryptedData: ArrayBuffer; iv: Uint8Array }> {
  const buffer = await file.arrayBuffer();
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(secretKey.padEnd(32).slice(0, 32)),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    keyMaterial,
    buffer
  );
  return { encryptedData, iv };
}
