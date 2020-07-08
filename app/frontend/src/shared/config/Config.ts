const config = {
  title: 'Elastic APM Demo',
  api: {
    protocol: 'http',
    host: process.env.API_HOST || 'localhost',
    port: process.env.API_PORT || 5000,
    baseUrl: '/api/v1',
  },
  apm: {
    url:
      'https://4c42270034224f088d929d2060730158.us-east-1.aws.found.io:9243/app/apm',
  },
};

export default config;
