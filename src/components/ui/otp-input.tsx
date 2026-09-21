"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

const OTP_LENGTH = 6;

export function OtpInput({ value, onChange, disabled, id, ...props }: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");

  function update(index: number, next: string) {
    const digit = next.replace(/\D/g, "").slice(-1);
    const updated = [...digits];
    updated[index] = digit;
    onChange(updated.join(""));
    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function paste(index: number, text: string) {
    const pasted = text.replace(/\D/g, "").slice(0, OTP_LENGTH - index);
    if (!pasted) return;
    const updated = [...digits];
    pasted.split("").forEach((digit, offset) => { updated[index + offset] = digit; });
    onChange(updated.join(""));
    inputs.current[Math.min(index + pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Verification code">
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(element) => { inputs.current[index] = element; }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          className={cn("h-12 w-full text-center text-lg font-semibold", props["aria-invalid"] && "border-destructive")}
          value={digit}
          onChange={(event) => update(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digit && index > 0) inputs.current[index - 1]?.focus();
          }}
          onPaste={(event) => { event.preventDefault(); paste(index, event.clipboardData.getData("text")); }}
          {...props}
        />
      ))}
    </div>
  );
}
