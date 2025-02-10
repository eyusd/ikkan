import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type DebouncedTextareaProps = {
  defaultValue: string;
  onBlur: (value: string) => void;
};

export function TextareaBlur({ defaultValue, onBlur }: DebouncedTextareaProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onBlur(value)}
    />
  );
}
