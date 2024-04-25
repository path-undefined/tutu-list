/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
  ],
  rules: {
    "comma-dangle": ["error", "always-multiline"],
    "quotes": ["error", "double"],
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
}
