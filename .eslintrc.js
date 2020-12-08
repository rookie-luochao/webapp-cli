module.exports = {
  extends: ["@querycap/eslint-config"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/prop-types": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-unsafe-return": 0,
    "@typescript-eslint/no-unsafe-member-access": 0,
    "@typescript-eslint/no-unsafe-member-acces": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/no-floating-promises": 0,
    "react/display-name": 0,
    "@typescript-eslint/no-unsafe-call": 0,
    "@typescript-eslint/restrict-template-expressions": 0,
    "@typescript-eslint/unbound-method": 0,
  },
};
