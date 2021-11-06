URL = "https://www.kaggle.com/mdhamani/goodreads-books-100k/download"

raw_folder = raw_data
raw_data = goodreads_100k_books.csv

script = data_processing.py

clean_folder = clean_data

.PHONY: processing

processing: $(raw_folder)/$(raw_data) $(clean_folder) $(script)
	python $(script)

$(clean_folder):
	mkdir $@

clean:
	rm -Rf $(clean_folder)
	echo "Deleted '$(clean_folder)' folder"
