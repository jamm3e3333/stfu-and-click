module.exports = {
  ...require('@ackee/styleguide-backend-config/eslint'),
  ignorePatterns: ['dist', 'src/openapi-gen', 'docs', 'knexfile.ts'],
  parserOptions: {
    project: '.eslint.tsconfig.json',
  },
}
