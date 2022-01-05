const solr = require('../config');

async function getBookByID(req, res) {

}

async function getFilterInfo(req, res) {
    const field = req.query.field;

    const params = {
        "q": "*:*",
        "indent": "true",
        "q.op": "OR",
        "facet":"true",
        "facet.field": field,
    };
    solr.get('/select', {params: params})
        .then(function (resp) {
            let solrResp;
            if(field === "genre") solrResp = resp.data.facet_counts.facet_fields.genre;
            else solrResp = resp.data.facet_counts.facet_fields.bookformat;

            const genres = [];

            for(let i = 0; i < solrResp.length; i += 2) {  // take every second element
                genres.push(solrResp[i]);
            }

            return res.status(200).send(genres);
        })
        .catch((error) => {
            console.log(error);
        })
}

async function getSearchResult(req, res) {
    let params = {
        'q': req.query.inputText,
        'q.op': 'AND',
        'wt': 'json',
        'defType': 'edismax',
        'qf': 'title desc negative_reviews positive_reviews',
        'rows': 20,
        'start': 20 * req.query.pageNumber
    };

    solr.get('/select', {params: params})
        .then(function(resp) {
            const result = [];

            resp.data.response.docs.forEach((item) => {
                result.push(item);
            })

            return res.status(200).send({books: result, numFound: resp.data.response.numFound});
        })
        .catch((error) => {
            console.log(error);
            return res.status(400).json('Something wrong happen!');
        })
}

module.exports = {
    getBookByID,
    getSearchResult,
    getFilterInfo,
};
