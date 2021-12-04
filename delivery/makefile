raw_folder := raw_data
clean_folder := clean_data
intermediate_folder := temp_data

raw_data := goodreads_100k_books.csv
requirements := requirements.txt

SITE_PACKAGES := $(shell pip show pip | grep '^Location' | cut -f2 -d':')

.PHONY: $(clean_folder)/database.sql 

# Create sql database 
$(clean_folder)/database.sql: $(clean_folder)/goodreads_clean.csv $(clean_folder)/final_reviews.csv
	python create_schema.py

# GoodReads book data processing
$(clean_folder)/goodreads_clean.csv: $(intermediate_folder)/cleanfile.csv $(intermediate_folder)/to_clean.csv $(clean_folder)
	python merge_cleanfiles.py

$(intermediate_folder)/cleanfile.csv: $(raw_folder)/$(raw_data) $(intermediate_folder)
	python cleaning_pages_bookformats_genres.py

$(intermediate_folder)/to_clean.csv: $(raw_folder)/$(raw_data) $(intermediate_folder)
	python cleaning_desc.py

# Review data collection and processing
$(clean_folder)/final_reviews.csv: $(intermediate_folder)/reviews.csv $(clean_folder)
	python cleaning_reviews.py

$(intermediate_folder)/reviews.csv: $(raw_folder)/$(raw_data) $(intermediate_folder)
	python review_scrape.py

# Create folders for storing resulting files
$(intermediate_folder):
	mkdir $@

$(clean_folder):
	mkdir $@

clean:
	rm -Rf $(clean_folder)
	rm -Rf $(intermediate_folder)
