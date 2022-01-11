#!/bin/sh

precreate-core goodreads
# precreate-core goodreads-sample

# Start Solr in background mode so we can use the API to upload the schema
solr start

sleep 10

# Schema definition via API
curl -X POST -H 'Content-type:application/json' \
    --data-binary @/data/schema.json \
    http://localhost:8983/solr/goodreads/schema

#curl -X POST -H 'Content-type:application/json' \
#    --data-binary @/data/schema.json \
#    http://localhost:8983/solr/goodreads-sample/schema

curl -X POST -H 'Content-type:application/json'  -d '{
  "add-searchcomponent": {
    "name": "suggest",
    "class": "solr.SuggestComponent",
    "suggester": {
        "name": "mySuggester",
        "lookupImpl": "FreeTextLookupFactory",
        "dictionaryImpl": "DocumentDictionaryFactory",
        "field": "desc",
        "suggestFreeTextAnalyzerFieldType": "text_general",
        "buildOnStartup": "true"
    }
  }
}' http://localhost:8983/solr/goodreads/config

curl -X POST -H 'Content-type:application/json'  -d '{
  "add-requesthandler": {
    "name": "/suggest",
        "class": "solr.SearchHandler",
        "startup": "lazy",
        "defaults": {
            "suggest": true,
            "suggest.count": 10,
            "suggest.dictionary": "mySuggester"
        },
        "components": [
            "suggest"
        ]
  }
}' http://localhost:8983/solr/goodreads/config

# Populate collection
bin/post -c goodreads /data/new_data.json

# Populate collection
#bin/post -c goodreads-sample /data/data_sample.json

# Restart in foreground mode so we can access the interface
solr restart -f
