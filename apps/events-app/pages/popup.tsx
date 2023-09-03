import { usePassportPopupSetup } from "@pcd/passport-interface";
import React from "react";

/**  This popup sends requests and receives PCDs from the passport. */
export default function PassportPopupRedirect() {
  const error = usePassportPopupSetup();
  return <div>{error}</div>;
}
