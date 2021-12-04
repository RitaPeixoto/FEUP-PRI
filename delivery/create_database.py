import pandas as pd

books = pd.read_csv('clean_data/goodreads_clean.csv')
reviews = pd.read_csv('clean_data/final_reviews.csv')

with open("clean_data/schema.sql", "w") as f:
    f.write("DROP TABLE if EXISTS Bookformat;\n")
    f.write("DROP TABLE if EXISTS Genre;\n")
    f.write("DROP TABLE if EXISTS Book;\n")
    f.write("DROP TABLE if EXISTS BookGenre;\n")
    f.write("DROP TABLE if EXISTS Review;\n")

    f.write("CREATE TABLE Bookformat (\n\tid SERIAL PRIMARY KEY,\n\tformat TEXT UNIQUE NOT NULL\n);\n")
    f.write("CREATE TABLE Genre (\n\tid SERIAL PRIMARY KEY,\n\tname TEXT UNIQUE NOT NULL\n);\n")
    
    f.write("CREATE TABLE Book (\n\tid SERIAL PRIMARY KEY,\n\tlink TEXT UNIQUE NOT NULL,\n\tauthor TEXT NOT NULL,\n\tdesc TEXT NOT NULL,\n\timg TEXT NOT NULL,\n\tisbn TEXT NOT NULL,\n\tpages INT NOT NULL,\n\trating REAL NOT NULL,\n\treviews INT NOT NULL,\n\ttitle TEXT NOT NULL,\n\ttotalratings INT NOT NULL,\n\tbookformat INT FOREIGN KEY REFERENCES Bookformat(id)\n);\n")
    f.write("CREATE TABLE BookGenre (\n\tlink TEXT FOREIGN KEY REFERENCES Book(link),\n\tid INT FOREIGN KEY REFERENCES Genre(id)\n);\n")
    f.write("CREATE TABLE Review (\n\tid SERIAL PRIMARY KEY,\n\tlink TEXT FOREIGN KEY REFERENCES Book(link),\n\treview TEXT UNIQUE NOT NULL\n);\n")

    f.write("\n--BOOKFORMAT--\n")
    index = 0
    bookformat_dict = {}
    for bookformat in books['bookformat'].unique():
        index += 1
        bookformat_dict[bookformat] = index
        f.write(f"INSERT INTO Bookformat VALUES ({index}, '{bookformat}');\n")

    f.write("\n--GENRE--\n")
    index = 0
    genre_dict = {}
    for _, row in books.iterrows():
        genre_list = row['genre']
        for genre in genre_list.split(','):
            if genre not in genre_dict:
                index += 1
                genre_dict[genre] = index
                f.write(f"INSERT INTO Genre VALUES ({index}, '{genre}');\n")

    f.write("\n--BOOK--\n")
    index = 0
    book_dict = {}
    for _, row in books.iterrows():
        link = row['link']
        author = row['author']
        desc = row['desc']
        img = row['img']
        isbn = row['isbn']
        pages = row['pages']
        rating = row['rating']
        rev = row['reviews']
        title = row['title']
        totalratings = row['totalrating']
        bookformat = bookformat_dict[row['bookformat']]
        book_dict[link] = index
        f.write(f"INSERT INTO Book VALUES ({index}, '{link}', '{author}', '{desc}', '{img}', '{isbn}', {pages}, {rating}, {rev}, '{title}', {totalratings}, {bookformat});\n")

    f.write("\n--BOOKGENRE--\n")
    for _, row in books.iterrows():
        link = book_dict[row['link']]
        for genre in row['genre'].split(','):
            g_id = genre_dict[genre]
            f.write(f"INSERT INTO BookGenre VALUES ({link}, {g_id});\n")