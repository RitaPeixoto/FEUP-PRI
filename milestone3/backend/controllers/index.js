const solr = require('../config');

async function getBookByID(req, res) {

}

async function getFilterInfo(req, res) {
    const field = req.query.field;

    const params = {
        "q": "*:*",
        "indent": "true",
        "q.op": "OR",
        "facet": "true",
        "facet.field": field,
        "facet.limit": 1200
    };
    solr.get('/select', {params: params})
        .then(function (resp) {
            let solrResp;
            if (field === "genre") solrResp = resp.data.facet_counts.facet_fields.genre;
            else solrResp = resp.data.facet_counts.facet_fields.bookformat;

            const genres = [];

            for (let i = 0; i < solrResp.length; i += 2) {  // take every second element
                genres.push(solrResp[i]);
            }

            return res.status(200).send(genres);
        })
        .catch((error) => {
            console.log(error);
        })
}

async function getSearchResult(req, res) {

    const start = 20 * req.query.pageNumber;
    let params = new URLSearchParams();

    if (req.query.inputText === "") params.append('q', '*:*');
    else params.append('q', req.query.inputText);

    params.append('q.op', 'AND');
    params.append('wt', 'json');
    params.append('defType', 'edismax');
    params.append('qf', 'title desc negative_reviews positive_reviews');
    params.append('rows', '20');
    params.append('start', start.toString());

    if (req.query.bookformats && req.query.bookformats !== []) {
        for (const bf of req.query.bookformats) {
            params.append("fq", `bookformat:"${bf}"`);
        }
    }
    if (req.query.genres && req.query.genres !== []) {
        for (const bf of req.query.genres) {
            params.append("fq", `genre:"${bf}"`);
        }
    }
    params.append("fq", `rating:[${req.query.rating[0]} TO ${req.query.rating[1]}]`);

    let pages = `pages:[${req.query.pages[0]} TO `;
    if (req.query.pages[1] === '700') pages += "*]";
    else pages += `${req.query.pages[1]}]`;
    params.append("fq", pages);

    solr.get('/select', {params: params})
        .then(function (resp) {
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
