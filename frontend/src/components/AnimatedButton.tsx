import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function AnimatedButton({ className = "", variant = "primary", children, ...props }: AnimatedButtonProps) {
  const variantClass = variant === "primary" ? "button-primary" : variant === "danger" ? "button-danger" : "button-secondary";
  return (
    <motion.button
      className={`${variantClass} ${className}`}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      {...props}
    >
      {children}
    </motion.button>
  );
}
