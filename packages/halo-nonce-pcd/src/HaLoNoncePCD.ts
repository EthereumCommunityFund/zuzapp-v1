import {
  DisplayOptions,
  PCD,
  PCDPackage,
  SerializedPCD,
  StringArgument,
} from "@pcd/pcd-types";
import { ec } from "elliptic";
import { sha256 } from "js-sha256";
import { v4 as uuid } from "uuid";
import { HaLoNonceCardBody } from "./CardBody";

const secp256k1 = new ec("secp256k1");

export const HaLoNoncePCDTypeName = "halo-nonce-pcd";

// Arguments taken from the URL produced by the HaLo tags, the definition is at
// https://github.com/arx-research/libhalo/blob/master/docs/halo-command-set.md#command-sign_random
export interface HaLoNoncePCDArgs {
  /**
   * The uncompressed hex string of the signing public key
   */
  pk2: StringArgument;

  /**
   * The digest of the nonce + random string
   */
  rnd: StringArgument;

  /**
   * The signature of the nonce + random string
   */
  rndsig: StringArgument;
}

export interface HaLoNoncePCDClaim {
  /**
   * Incrementing nonce that was signed.
   */
  nonce: number;

  /**
   * Uncompressed hex string of the public key, starting with `04`
   */
  pubkeyHex: string;
}

export interface HaLoNoncePCDProof {
  /**
   * The signed digest, consisting of the nonce concatenated with a random string
   */
  signedDigest: string;

  /**
   * The cleaned signature of the nonce + random string,
   */
  cleanedSignature: string;
}

export class HaLoNoncePCD implements PCD<HaLoNoncePCDClaim, HaLoNoncePCDProof> {
  type = HaLoNoncePCDTypeName;
  claim: HaLoNoncePCDClaim;
  proof: HaLoNoncePCDProof;
  id: string;

  public constructor(
    id: string,
    claim: HaLoNoncePCDClaim,
    proof: HaLoNoncePCDProof
  ) {
    this.id = id;
    this.claim = claim;
    this.proof = proof;
  }
}

export async function prove(args: HaLoNoncePCDArgs): Promise<HaLoNoncePCD> {
  if (
    args.pk2.value === undefined ||
    args.rnd.value === undefined ||
    args.rndsig.value === undefined
  ) {
    throw new Error("Cannot make HaLoNoncePCD: some arguments are not set.");
  }

  const claim: HaLoNoncePCDClaim = {
    nonce: parseInt(args.rnd.value.substring(0, 8), 16),
    pubkeyHex: args.pk2.value,
  };

  if (isNaN(claim.nonce)) {
    throw new Error("Nonce is not a valid number.");
  }

  try {
    secp256k1.keyFromPublic(claim.pubkeyHex, "hex");
  } catch (e) {
    throw new Error("Unable to decode public key.");
  }

  // Clean up signature for easier verification
  const sigBuf = Buffer.from(args.rndsig.value, "hex");
  if (sigBuf.length < 2 || 2 + sigBuf[1] > sigBuf.length) {
    throw new Error("Malformed signature in the rndsig field.");
  }
  const cutSig = sigBuf.subarray(0, 2 + sigBuf[1]).toString("hex");

  const proof: HaLoNoncePCDProof = {
    signedDigest: args.rnd.value,
    cleanedSignature: cutSig,
  };

  return new HaLoNoncePCD(uuid(), claim, proof);
}

export async function verify(pcd: HaLoNoncePCD): Promise<boolean> {
  // verify nonce in claim matches the one in the proof
  if (
    pcd.claim.nonce !== parseInt(pcd.proof.signedDigest.substring(0, 8), 16)
  ) {
    return false;
  }

  // from code in https://gist.github.com/Clee681/e05034cb77365edc1eac9bf7575b0d24
  const rndBuf = Buffer.from(pcd.proof.signedDigest, "hex");
  const hash = sha256.create();
  const rndHashed = hash
    .update(
      Buffer.concat([
        Buffer.from([0x19]),
        Buffer.from("Attest counter pk2:\n", "utf8"),
      ])
    )
    .update(rndBuf)
    .hex();

  let key;
  try {
    key = secp256k1.keyFromPublic(pcd.claim.pubkeyHex, "hex");
  } catch (e) {
    return false;
  }

  return key.verify(rndHashed, pcd.proof.cleanedSignature);
}

export async function serialize(
  pcd: HaLoNoncePCD
): Promise<SerializedPCD<HaLoNoncePCD>> {
  return {
    type: HaLoNoncePCDTypeName,
    pcd: JSON.stringify(pcd),
  } as SerializedPCD<HaLoNoncePCD>;
}

export async function deserialize(serialized: string): Promise<HaLoNoncePCD> {
  return JSON.parse(serialized);
}

export function getDisplayOptions(pcd: HaLoNoncePCD): DisplayOptions {
  return {
    displayName: "halo-nonce-" + pcd.id.substring(0, 4),
  };
}

/**
 * A PCD wrapper for one operation of the HaLo (Hardware Locked) tags from Arx Research,
 * ttps://github.com/arx-research/libhalo/blob/master/docs/halo-command-set.md#command-sign_random).
 * This is an operation in which the private key in slot #2 of the HaLo tag produces
 * an secp256k1 ECDSA signature of an **incrementing nonce** concatenated with a random string.
 * The nonce is incremented by the HaLo tag after each signature operation.
 */
export const HaLoNoncePCDPackage: PCDPackage<
  HaLoNoncePCDClaim,
  HaLoNoncePCDProof,
  HaLoNoncePCDArgs
> = {
  name: HaLoNoncePCDTypeName,
  renderCardBody: HaLoNonceCardBody,
  getDisplayOptions,
  prove,
  verify,
  serialize,
  deserialize,
};
