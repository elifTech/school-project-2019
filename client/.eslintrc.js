/* eslint-disable unicorn/prevent-abbreviations */
// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'airbnb',
    'plugin:css-modules/recommended',
    'prettier',
    'prettier/react',
    'plugin:sonarjs/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:array-func/all',
    'plugin:react-perf/recommended',
  ],
  globals: {
    __DEV__: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  plugins: [
    'css-modules',
    'prettier',
    'sonarjs',
    'promise',
    'unicorn',
    'array-func',
    'react-perf',
    'sort-keys-fix',
  ],

  rules: {
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    eqeqeq: ['error', 'always'],

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        aspects: ['noHref', 'invalidHref', 'preferButton'],
        components: ['Link'],
        specialLink: ['to'],
      },
    ],

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'no-async-promise-executor': 'error',

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'no-await-in-loop': 'error',

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],

    'no-loop-func': 'error',
    'no-magic-numbers': ['error', { ignore: [-1, 0, 1, 2] }],
    'no-return-await': 'error',
    'no-unmodified-loop-condition': 'error',
    'prefer-destructuring': [
      'error',
      {
        AssignmentExpression: {
          array: false,
          object: false,
        },
        VariableDeclarator: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'prettier/prettier': 'error',
    'promise/always-return': 'off',
    'promise/prefer-await-to-callbacks': 'error',
    'promise/prefer-await-to-then': 'error',
    radix: ['error', 'as-needed'],
    'react/boolean-prop-naming': 'error',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/jsx-handler-names': 'error',
    'react/jsx-no-bind': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/prefer-stateless-function': [
      'error',
      { ignorePureComponents: true },
    ],
    'react/sort-comp': [
      1,
      {
        order: [
          'static-methods',
          'lifecycle',
          '/^handle.+$/',
          'render',
          'everything-else',
        ],
      },
    ],
    'react/state-in-constructor': ['error', 'never'],
    'react/static-property-placement': ['error', 'static public field'],
    'require-await': 'error',
    'sonarjs/no-small-switch': 'off',
    'sort-keys-fix/sort-keys-fix': 'warn',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          kebabCase: true,
          pascalCase: true,
        },
      },
    ],
    'unicorn/prefer-query-selector': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        checkProperties: false,
        replacements: {
          props: false,
        },
      },
    ],
    'vars-on-top': 'error',
  },

  settings: {
    // Allow absolute paths in imports, e.g. import Button from 'components/Button'
    // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
