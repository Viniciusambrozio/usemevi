"use client";
import { useState, useEffect, useRef } from "react";

interface CurrencyInputProps {
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function CurrencyInput({ value, onChange, placeholder, className = "", required }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isInternalChange = useRef(false);

  // Converte número para formato de exibição (R$ 0,00)
  const formatToDisplay = (num: number): string => {
    if (!num || num === 0) return "";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Extrai apenas números da string
  const extractNumbers = (str: string): string => {
    return str.replace(/[^\d]/g, "");
  };

  // Converte string numérica para número (tratando como centavos)
  const stringToNumber = (numStr: string): number => {
    if (!numStr || numStr === "0") return 0;
    return parseFloat(numStr) / 100;
  };

  // Converte número para string numérica (em centavos)
  const numberToString = (num: number): string => {
    if (!num || num === 0) return "";
    return Math.round(num * 100).toString();
  };

  // Atualiza display quando value muda externamente
  useEffect(() => {
    if (!isInternalChange.current) {
      const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
      if (numValue > 0) {
        setDisplayValue(formatToDisplay(numValue));
      } else {
        setDisplayValue("");
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Se campo está vazio
    if (!inputValue || inputValue.trim() === "") {
      setDisplayValue("");
      isInternalChange.current = true;
      onChange(0);
      setTimeout(() => { isInternalChange.current = false; }, 0);
      return;
    }

    // Extrai números
    const numbers = extractNumbers(inputValue);
    
    if (numbers === "" || numbers === "0") {
      setDisplayValue("");
      isInternalChange.current = true;
      onChange(0);
      setTimeout(() => { isInternalChange.current = false; }, 0);
      return;
    }

    // Converte para número
    const numValue = stringToNumber(numbers);
    
    // Formata e atualiza
    const formatted = formatToDisplay(numValue);
    setDisplayValue(formatted);
    
    isInternalChange.current = true;
    onChange(numValue);
    setTimeout(() => { isInternalChange.current = false; }, 0);
  };

  const handleFocus = () => {
    // Ao focar, mostra apenas números para facilitar edição
    if (displayValue) {
      const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
      if (numValue > 0) {
        const numbers = numberToString(numValue);
        setDisplayValue(numbers);
        // Seleciona todo o texto para facilitar substituição
        setTimeout(() => {
          inputRef.current?.select();
        }, 0);
      }
    }
  };

  const handleBlur = () => {
    // Ao perder foco, formata corretamente
    const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
    if (numValue > 0) {
      setDisplayValue(formatToDisplay(numValue));
    } else {
      setDisplayValue("");
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder || "R$ 0,00"}
      className={`${className} border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent`}
      required={required}
    />
  );
}
