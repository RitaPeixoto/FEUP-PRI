FROM solr:latest

#COPY /data/data_sample.json /data/data_sample.json

#COPY /data/schema.json /data/schema.json

COPY startup.sh /scripts/startup.sh

ENTRYPOINT ["sh", "/scripts/startup.sh"]
