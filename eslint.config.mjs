import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      // Disable unused variable errors
      "@typescript-eslint/no-unused-vars": "off",
      // Disable errors for using `any`
      "@typescript-eslint/no-explicit-any": "off",
      // Disable missing dependency warnings in useEffect
      "react-hooks/exhaustive-deps": "off",
    },
  }),
];

export default eslintConfig;
