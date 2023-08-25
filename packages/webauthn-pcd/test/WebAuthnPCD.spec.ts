import { VerifyAuthenticationResponseOpts } from "@simplewebauthn/server/./dist";
import assert from "assert";
import { WebAuthnPCDArgs, WebAuthnPCDPackage } from "../src/WebAuthnPCD";

const args: WebAuthnPCDArgs = {
  challenge: "valid_challenge",
  origin: "localhost",
  rpID: "rpID",
  authenticator: {
    credentialID: new Uint8Array([1, 2, 3, 4]),
    credentialPublicKey: new Uint8Array([1, 2, 3, 4]),
    counter: 0,
  },
};

jest.mock("@simplewebauthn/browser", () => ({
  startRegistration: async () => ({
    id: "my-credential",
    rawId: "my-credential",
    response: {
      clientDataJSON: "",
      attestationObject: "",
    },
    clientExtensionResults: {},
    type: "public-key",
  }),
  startAuthentication: async () => ({
    id: "my-credential",
    rawId: "my-credential",
    response: {
      clientDataJSON: "",
      attestationObject: "",
    },
    clientExtensionResults: {},
    type: "public-key",
  }),
}));

jest.mock("@simplewebauthn/server", () => ({
  ...jest.requireActual("@simplewebauthn/server"),
  verifyAuthenticationResponse: async ({
    expectedChallenge,
  }: VerifyAuthenticationResponseOpts) => ({
    verified: expectedChallenge === "valid_challenge",
  }),
}));

// Mock out wasm-based utils function
jest.mock("@pcd/passport-crypto/src/utils", () => ({
  arrayBufferToBase64: (arrayBuffer: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(arrayBuffer))),
  base64ToArrayBuffer: (base64String: string) =>
    Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0)),
}));

describe("WebAuthn PCD", () => {
  it("should be able to generate a proof that verifies", async function () {
    const { prove, verify } = WebAuthnPCDPackage;
    const pcd = await prove(args);
    const verified = await verify(pcd);
    assert.equal(verified, true);
  });

  it("should not verify an incorrect proof", async function () {
    const { prove, verify } = WebAuthnPCDPackage;

    const pcd = await prove(args);
    // make the pcd invalid by changing its claim
    pcd.claim.challenge = pcd.claim.challenge + "1";

    const verified = await verify(pcd);
    assert.equal(verified, false);
  });

  it("serializing and then deserializing a PCD should result in equal PCDs", async function () {
    const { prove, verify, serialize, deserialize } = WebAuthnPCDPackage;
    const pcd = await prove(args);

    const serialized_pcd = await serialize(pcd);
    const deserialized_pcd = await deserialize(serialized_pcd.pcd);
    const verified = await verify(deserialized_pcd);

    assert.equal(verified, true);
  });
});
