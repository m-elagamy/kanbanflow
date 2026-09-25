import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import getPriorityIconColor from "@/app/dashboard/utils/get-priority-icon-color";
import RequiredFieldSymbol from "./required-field-symbol";
import { MotionInput } from "./motion-input";
import FormMessage from "./form-message";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  type: "text" | "textarea" | "select" | "hidden" | "date";
  name: string;
  label?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  helperText?: string;
  options?: {
    id: string;
    label: string;
    icon?: LucideIcon;
    iconColor?: string;
    status?: string[];
  }[];
  maxLength?: number;
}

const FormField = ({
  type,
  name,
  label,
  defaultValue = "",
  required,
  placeholder,
  options = [],
  helperText,
  error,
  onChange,
  onBlur,
  maxLength,
}: FormFieldProps) => {
  const [characterCount, setCharacterCount] = useState(defaultValue.length);
  const isNearLimit = maxLength !== undefined && characterCount >= maxLength * 0.8;
  const hasReachedLimit = maxLength !== undefined && characterCount === maxLength;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor={name}>
            {label} {required && <RequiredFieldSymbol />}
          </Label>
          {(type === "text" || type === "textarea") && maxLength !== undefined && (
            <span
              aria-live="polite"
              className={cn(
                "text-xs text-muted-foreground",
                isNearLimit && !hasReachedLimit &&
                  "text-amber-600 dark:text-amber-400",
              )}
            >
              {characterCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      {type === "text" && (
        <MotionInput
          id={name}
          name={name}
          maxLength={maxLength}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={(e) => {
            setCharacterCount(e.target.value.length);
            onChange?.(e.target.value);
          }}
          onBlur={(e) => onBlur?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          animate={error ? { x: [-2, 2, -2, 2, 0] } : undefined}
          transition={{ duration: 0.2 }}
        />
      )}

      {type === "textarea" && (
        <>
          <Textarea
            id={name}
            name={name}
            className="resize-none [overflow-wrap:anywhere]"
            defaultValue={defaultValue}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e) => {
              setCharacterCount(e.target.value.length);
              onChange?.(e.target.value);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          />
        </>
      )}

      {type === "date" && (
        <Input
          id={name}
          type="date"
          name={name}
          defaultValue={defaultValue}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}

      {type === "select" && options && (
        <Select
          defaultValue={defaultValue}
          name={name}
          onValueChange={onChange}
        >
          <SelectTrigger
            id={name}
            className="w-full"
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => {
              const { id, label, icon: Icon, iconColor } = option;

              return (
                <SelectItem key={id} value={id}>
                  <div className="flex items-center gap-2">
                    {Icon ? (
                      <Icon
                        className={`size-4 ${iconColor ? "" : getPriorityIconColor(id)}`}
                        style={iconColor ? { color: iconColor } : undefined}
                        aria-hidden="true"
                      />
                    ) : (
                      <span className="bg-muted-foreground/50 size-2 rounded-full" />
                    )}
                    <h2>{label}</h2>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}

      <AnimatePresence>
        {error && (
          <FormMessage
            id={`${name}-error`}
            variant="error"
            className="mt-2"
            animated
          >
            {error}
          </FormMessage>
        )}
      </AnimatePresence>
      {helperText && (
        <FormMessage error={!!error} variant="helper">
          {helperText}
        </FormMessage>
      )}

      {type === "hidden" && (
        <Input type="hidden" name={name} value={defaultValue} />
      )}
    </div>
  );
};

export default FormField;
