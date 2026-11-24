const globals = require('globals');

module.exports = [
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'commonjs',
			globals: {
				...globals.node,
			},
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'error',
			'no-console': 'warn',
			'semi': ['error', 'always'],
			'quotes': ['error', 'single'],
			'indent': ['error', 'tab'],
		},
	},
];