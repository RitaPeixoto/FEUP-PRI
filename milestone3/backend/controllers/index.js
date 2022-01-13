const solr = require('../config');

async function getBookByID(req, res) {
    const id = req.params.id;
    const params = {
        "q": `id:${id}`,
        "indent": "true",
        "q.op": "AND",
    }; 

    solr.get('/select', {params: params})
        .then(function (resp) {   
            return res.status(200).send(resp.data.response.docs[0]);
        })
        .catch((error) => {  
            console.log(error);
            return res.status(400).json('Something went wrong!');
        })
}

async function getSuggestions(req, res) {
    const input = req.query.input;
    if(input === '') return res.status(200).send([]);

    const params = {
        "q": input,
        "indent": "true",
        "q.op": "AND",
    };
      
    solr.get('/suggest', {params: params}).then((resp) => {
        const fK = Object.values(resp.data)[1];
        const items = Object.values(Object.values(fK)[0])[0];
        const suggestions = items.suggestions;

        const it = [];
        for (let s of suggestions) {
            it.push(s.term);
        }
        return res.status(200).send(it);
    })
    .catch((error) => {
        console.log(error);
        return res.status(400).json('Something went wrong!');
    })
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
            return res.status(400).json('Something went wrong!');
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
    params.append('rows', '20');
    params.append('start', start.toString());

    const fields = ['title', 'desc', 'author', 'positive_reviews', 'negative_reviews'];

    if (req.query.weights === undefined || req.query.weights === []) params.append('qf', fields.join(' '));
    else {
        const w = 10 / req.query.weights.length;
        let qf = "";
        for (let field of fields) {
            qf += ` ${field}`;
            if (req.query.weights.includes(field)) qf += `^${w}`;
        }
        params.append('qf', qf);
    }

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
            return res.status(400).json('Something went wrong!');
        })
}

module.exports = {
    getBookByID,
    getSearchResult,
    getFilterInfo,
    getSuggestions,
};
