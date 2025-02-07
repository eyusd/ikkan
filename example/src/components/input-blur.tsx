import { useState } from "react";
import { Input } from "@/components/ui/input";

type DebouncedInputProps = {
  defaultValue: string;
  onBlur: (value: string) => void;
}

export function InputBlur({ defaultValue, onBlur }: DebouncedInputProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onBlur(value)}
    />
  );
}