import React from "react";
import { AddElementForm } from "./addElementForm/AddElementForm";

interface ControlsProps {
  newValue: string;
  setNewValue: React.Dispatch<React.SetStateAction<string>>;
  handleAddElement: () => Promise<void>;
  disabled: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  newValue,
  setNewValue,
  handleAddElement,
  disabled
}) => {
  return (
    <AddElementForm
      newValue={newValue}
      onChangeValue={setNewValue}
      onAdd={handleAddElement}
      disabled={disabled}
    />
  );
};

export default Controls;
