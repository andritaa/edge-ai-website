import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: "h-6 w-auto",
    md: "h-8 w-auto",
    lg: "h-12 w-auto"
  };

  return (
    <motion.div
      className={`${sizes[size]} ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        viewBox="0 0 120 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Edge icon */}
        <motion.rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="6"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Inner geometric pattern */}
        <motion.path
          d="M8 8h8v8H8V8z"
          fill="#FF6B35"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        />
        <motion.path
          d="M18 8h6v6h-6V8z"
          fill="currentColor"
          fillOpacity="0.3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        />
        <motion.path
          d="M8 18h6v6H8v-6z"
          fill="currentColor"
          fillOpacity="0.3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        />

        {/* Text */}
        <motion.text
          x="40"
          y="14"
          fontSize="12"
          fontWeight="600"
          fill="currentColor"
          className="font-display"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Edge
        </motion.text>
        <motion.text
          x="40"
          y="26"
          fontSize="12"
          fontWeight="400"
          fill="#FF6B35"
          className="font-display"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          AI
        </motion.text>
      </svg>
    </motion.div>
  );
}