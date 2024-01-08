module.exports = {
  deploy: {
    staging: {
      user: 'www-data',
      host: '13.36.79.121',
      ref: 'origin/main',
      repo: 'git@github.com-repo-api-sga:UNIVERSAE360/api-sga.git',
      path: '/srv/www/api-sga',
      'post-deploy': [
        'make build',
        'docker kill universae-api-sga',
        'make start-prod',
      ].join(' && '),
    },
  },
};
