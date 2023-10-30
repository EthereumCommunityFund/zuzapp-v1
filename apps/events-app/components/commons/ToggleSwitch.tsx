"use client";

import React, { useState } from "react";

interface IToggleSwitch {
  isUpcoming: boolean;
  handleIsUpcoming: (newFilter: boolean) => void;
}

const ToggleSwitch = ({ isUpcoming, handleIsUpcoming }: IToggleSwitch) => {
  return (
    <div className={`toggle-switch ${!isUpcoming ? "active" : ""}`}>
      <div className="button-container">
        <button
          className="switch-button"
          onClick={() => handleIsUpcoming(true)}
        >
          Today
        </button>
        <button
          className="switch-button"
          onClick={() => handleIsUpcoming(false)}
        >
          Past
        </button>
      </div>
      <div className="toggle-button"></div>
    </div>
  );
};

export default ToggleSwitch;
