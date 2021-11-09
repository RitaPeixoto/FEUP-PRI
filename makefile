URL := "https://www.kaggle.com/mdhamani/goodreads-books-100k/download"

raw_folder := raw_data
raw_data := goodreads_100k_books.csv
pages_script := clean_pages.py
clean_folder := clean_data
requirements := requirements.txt

SITE_PACKAGES := $(shell pip show pip | grep '^Location' | cut -f2 -d':')

.PHONY: $(pages_script)

$(pages_script): install $(raw_folder)/$(raw_data) $(clean_folder) 
	python $(pages_script)

install: $(requirements)
	pip install -r $(requirements)

$(clean_folder):
	mkdir $@

clean:
	rm -Rf $(clean_folder)
	echo "Deleted '$(clean_folder)' folder"
