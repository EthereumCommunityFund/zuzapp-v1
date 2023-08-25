import {
  FieldLabel,
  HiddenText,
  Separator,
  Spacer,
  TextContainer,
} from "@pcd/passport-ui";
import { SemaphoreSignaturePCDPackage } from "@pcd/semaphore-signature-pcd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { EthereumGroupPCD } from "./EthereumGroupPCD";

export function EthereumGroupCardBody({ pcd }: { pcd: EthereumGroupPCD }) {
  const [identityCommitment, setIdentityCommitment] =
    useState("<deserializing>");

  useEffect(() => {
    SemaphoreSignaturePCDPackage.deserialize(pcd.proof.signatureProof.pcd).then(
      (pcd) => {
        setIdentityCommitment(pcd.claim.identityCommitment);
      }
    );
  }, [pcd]);

  return (
    <Container>
      <p>
        This PCD represents that a particular Semphore Identity owns an Ethereum
        Address that is part of a merkle group of Ethereum public keys or
        addresses.
      </p>

      <Separator />

      <FieldLabel>Commitment</FieldLabel>
      <HiddenText text={identityCommitment} />
      <Spacer h={8} />

      <FieldLabel>Merkle Root</FieldLabel>
      <TextContainer>
        {pcd.claim.publicInput.circuitPubInput.merkleRoot.toString(16)}
      </TextContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 16px;
  overflow: hidden;
  width: 100%;
`;
