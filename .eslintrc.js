module.exports = {
    plugins: ['flowtype'],
    env: {
        es6: true,
        node: true,
        browser: true,

    },
    parser: "babel-eslint",
    parserOptions: {
        ecmaVersion: 6,
    },
    extends: ['eslint:recommended', 'plugin:flowtype/recommended'],
    rules: {
        'no-console': 'warn',
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: [2, "always"],
        'brace-style': ['error', 'stroustrup'],
        'comma-dangle': [
            'error',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'never',
            },
        ],
        'consistent-return': 'error',
        'template-curly-spacing': ['error', 'always'],
        'prefer-template': 'warn',
        'no-new-symbol': 'error',
        'prefer-const': 'error',
        'no-multi-spaces': 'error',
        'no-const-assign': 1,
        'no-extra-semi': 0,
        'no-fallthrough': 0,
        'no-empty': 0,
        'no-mixed-spaces-and-tabs': 0,
        'no-redeclare': 0,
        'no-this-before-super': 1,
        'no-undef': 1,
        'no-unreachable': 1,
        'no-use-before-define': 0,
        'constructor-super': 1,
        curly: ['error', 'all'],
        eqeqeq: 0,
        'func-names': 0,
        'valid-typeof': 1,
    },
};