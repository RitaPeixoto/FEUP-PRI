FROM solr:latest

#COPY meic_courses.json /data/meic_courses.json

#COPY simple_schema.json /data/simple_schema.json

COPY startup.sh /scripts/startup.sh

ENTRYPOINT ["/scripts/startup.sh"]
