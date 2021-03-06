const solr = require("../config");

async function getAuthorByID(req, res) {
  const id = req.params.id;
  const params = {
    q: `id:${id}`,
    indent: "true",
    "q.op": "AND",
  };

  solr
    .get("/select", { params: params })
    .then(function (resp) {
      return res.status(200).send(resp.data.response.docs[0]);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json("Something went wrong!");
    });
}

async function getSearchResult(req, res) {
  const start = 20 * req.query.pageNumber;
  let params = new URLSearchParams();

  if (req.query.inputText === "") params.append("q", "*:*");
  else params.append("q", req.query.inputText);

  params.append("q.op", "AND");
  params.append("wt", "json");
  params.append("defType", "edismax");
  params.append("rows", "20");
  params.append("start", start.toString());
  params.append("qf", "author_name author_description");
  params.append("fq", "type:author");

  solr
    .get("/select", { params: params })
    .then(function (resp) {
      const result = [];
      
      resp.data.response.docs.forEach((item) => {
        result.push(item);
      });

      return res
        .status(200)
        .send({ authors: result, numFound: resp.data.response.numFound });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json("Something went wrong!");
    });
}


async function getAuthorBooks(req, res) {
  const name = req.params.name;
  const params = {
    q: `author:"${name}"`,
    indent: "true",
    "q.op": "AND",
    "fl": "id, img"
  };

  solr
    .get("/select", { params: params })
    .then(function (resp) {
      return res.status(200).send(resp.data.response.docs);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json("Something went wrong!");
    });
}

module.exports = {
  getAuthorByID,
  getSearchResult,
  getAuthorBooks,
};
