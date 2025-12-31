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
import getBadgeStyle from "@/app/dashboard/utils/get-badge-style";
import RequiredFieldSymbol from "./required-field-symbol";
import { MotionInput } from "./motion-input";
import FormMessage from "./form-message";

interface FormFieldProps {
  type: "text" | "textarea" | "select" | "hidden";
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
    status?: string[];
  }[];
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
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={name}>
          {label} {required && <RequiredFieldSymbol />}
        </Label>
      )}

      {type === "text" && (
        <MotionInput
          id={name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={(e) => onBlur?.(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          animate={error ? { x: [-2, 2, -2, 2, 0] } : undefined}
          transition={{ duration: 0.2 }}
        />
      )}

      {type === "textarea" && (
        <Textarea
          id={name}
          name={name}
          className="resize-none"
          defaultValue={defaultValue}
          placeholder={placeholder}
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
          <SelectTrigger id={name} className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => {
              const { id, label, icon: Icon } = option;

              return (
                <SelectItem key={id} value={id}>
                  <div className="flex items-center gap-2">
                    {Icon ? (
                      <Icon className={`size-4`} />
                    ) : (
                      <span
                        className={`size-2 rounded-full ${getBadgeStyle(id)}`}
                      />
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
