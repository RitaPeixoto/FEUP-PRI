#!/bin/bash

precreate-core goodreads

# Start Solr in background mode so we can use the API to upload the schema
solr start

sleep 4

# Schema definition via API
curl -X POST -H 'Content-type:application/json' \
    --data-binary @/data/schema.json \
    http://localhost:8983/solr/goodreads/schema

# Populate collection
bin/post -c goodreads /data/data.json

# Restart in foreground mode so we can access the interface
solr restart -f
