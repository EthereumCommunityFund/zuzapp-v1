module.exports = {
  // extends: ["custom/next"],

    "env": {
      "browser": true,
      "es6": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:import/typescript"
    ],
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "parser": "espree",
    "parserOptions": {
      "ecmaFeatures": {
        "jsx": true
      },
      "ecmaVersion": 2018,
      "sourceType": "module"
    },
    "plugins": [
      "react",
      "@typescript-eslint",
      "react-hooks"
    ],
    "rules": {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "import/no-unresolved": "error"
    }
  
};

