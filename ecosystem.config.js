module.exports = {
  deploy: {
    staging: {
      user: 'www-data',
      host: 'ec2-13-39-49-66.eu-west-3.compute.amazonaws.com',
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
