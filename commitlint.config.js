module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => message.includes('Co-authored-by:')],
};
