import { FieldLabel, Separator, Spacer, TextContainer } from "@pcd/passport-ui";
import styled from "styled-components";
import { SemaphoreGroupPCD } from "./SemaphoreGroupPCD";

export function SemaphoreGroupCardBody({ pcd }: { pcd: SemaphoreGroupPCD }) {
  return (
    <Container>
      <p>
        This PCD represents a group signal in the context of a Semaphore
        Protocol group. In other words, this is a ZK proof that a particular
        external nullifier sent a particular signal and belongs to a particular
        merkle tree identified by the merkle root.
      </p>

      <Separator />

      <FieldLabel>Group Root</FieldLabel>
      <TextContainer>{pcd.claim.merkleRoot}</TextContainer>
      <Spacer h={8} />

      <FieldLabel>Signal</FieldLabel>
      <TextContainer>{pcd.claim.signal}</TextContainer>
      <Spacer h={8} />

      <FieldLabel>Nullifier Hash</FieldLabel>
      <TextContainer>{pcd.claim.nullifierHash}</TextContainer>
      <Spacer h={8} />

      <FieldLabel>External Nullifier</FieldLabel>
      <TextContainer>{pcd.claim.externalNullifier}</TextContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 16px;
  overflow: hidden;
  width: 100%;
`;
