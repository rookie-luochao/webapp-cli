import React from "react";

export const withPreventDefault = (callback: () => void) => (e: React.SyntheticEvent<any>) => {
  if (e) {
    e.preventDefault();
  }
  callback();
};

export const withoutBubble = (callback: () => void) => (e: React.SyntheticEvent<any>) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  callback();
};