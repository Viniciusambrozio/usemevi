"use client";
import { useState, useEffect } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function PhoneInput({ value, onChange, placeholder, className = "", required }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Formata telefone brasileiro
  const formatPhone = (phone: string): string => {
    // Remove tudo exceto números
    const numbers = phone.replace(/\D/g, "");

    // Aplica máscara baseado no tamanho
    if (numbers.length <= 10) {
      // Telefone fixo: (11) 1234-5678
      return numbers
        .replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3")
        .replace(/^(\d{2})(\d{0,4})$/, "($1) $2")
        .replace(/^(\d{0,2})$/, "($1");
    } else {
      // Celular: (11) 91234-5678
      return numbers
        .replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3")
        .replace(/^(\d{2})(\d{0,5})$/, "($1) $2")
        .replace(/^(\d{0,2})$/, "($1");
    }
  };

  // Remove formatação, mantém apenas números
  const unformatPhone = (formatted: string): string => {
    return formatted.replace(/\D/g, "");
  };

  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhone(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numbers = unformatPhone(inputValue);

    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (numbers.length <= 11) {
      const formatted = formatPhone(numbers);
      setDisplayValue(formatted);
      onChange(numbers); // Salva apenas números no estado
    }
  };

  return (
    <input
      type="tel"
      inputMode="tel"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder || "(11) 91234-5678"}
      className={`${className} border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent`}
      required={required}
      maxLength={15} // (11) 91234-5678
    />
  );
}
