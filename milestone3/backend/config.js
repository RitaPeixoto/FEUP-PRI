const axios = require('axios');

const solr = axios.create({
    baseURL: 'http://localhost:8983/solr/goodreads',
    timeout: 1000
})

module.exports = solr;
