const MAX_COMPLEXITY = 5;

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
  ],
  globals: {
    __DEV__: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: ['css-modules', 'prettier'],

  rules: {
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    'prettier/prettier': 'error',

    'react/static-property-placement': ['error', 'static public field'],
    'no-async-promise-executor': 'error',
    'no-await-in-loop': 'error',
    'no-magic-numbers': ['error', { ignore: [0, 1, 2] }],
    eqeqeq: ['error', 'always'],
    complexity: ['error', MAX_COMPLEXITY],
    'no-loop-func': 'error',
    'no-return-await': 'error',
    'no-unmodified-loop-condition': 'error',
    radix: ['error', 'as-needed'],
    'require-await': 'error',
    'vars-on-top': 'error',
    'react/boolean-prop-naming': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/prefer-stateless-function': [
      'error',
      { ignorePureComponents: true },
    ],
    'react/jsx-handler-names': 'error',
    'react/jsx-no-bind': 'error',
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
