import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  value,
  onChange,
  isLoading,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder={placeholder ?? "Create a password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        disabled={isLoading}
        className="pr-10" // make space for the icon
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1/2 -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
        disabled={isLoading}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
