import pandas as pd
import requests
import re
from bs4 import BeautifulSoup
from timeit import default_timer
import asyncio
from concurrent.futures import ThreadPoolExecutor
from threading import Thread
from queue import Empty, Queue
import signal
import sys


START_TIME = default_timer()
CLEANR = re.compile('<.*?>')

queue = Queue()

f = open("reviews2.csv", "w")

def signal_handler(sig, frame):
    print('You pressed Ctrl+C!')
    f.flush()
    f.close()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)


def consume():
    f.write('Id, Reviews' + '\n')
    while True:
        if not queue.empty():
            bookId, rows = queue.get()
            # Row comes out of queue; CSV writing goes here
            for row in rows:
                try:
                    f.write(row)
                except:
                    continue



def parseReviews(bookId, data):
    soup = BeautifulSoup(data, "html.parser")

    reviews = soup.find_all("div", class_="ReviewsList")

    soup = BeautifulSoup(str(reviews[0]), "html.parser")

    reviews = soup.find_all("span", class_="Formatted")
    csv_reviews = []

    for review in reviews:
        rr = re.findall('(?<=<span class="Formatted">).+?(?=<\/span>)',str(review))
        if rr and re.match('.[a-zA-Z0-9-()]', rr[0]):
            new_rr = re.sub(r'<.*?>', '', str(rr))
            new_rr = re.sub(r'^\[', '', str(new_rr))
            new_rr = re.sub(r'\]$', '', str(new_rr))
            new_rr = re.sub(r'$', '', str(new_rr))
            csv_reviews.append(str(bookId) + ',' + '\"' + str(new_rr) + '\"' + '\n')       
    return bookId, csv_reviews

  

    
        


def fetch(session, index, link):
    #if bookId > 763255: #remove comment if script breaks for some reason -> continue on specified id


    with session.get(link) as response:
        data = response.text
        if response.status_code != 200:
            print("FAILURE::" + link)

        #select genres or reviews - comment/uncomment

        queue.put(parseReviews(index,data))

        elapsed = default_timer() - START_TIME
        time_completed_at = "{:5.2f}s".format(elapsed)
        print("{0:<30} {1:>20}".format(link, time_completed_at))

        return


async def get_data_asynchronous(books):
    print("{0:<30} {1:>20}".format("Book", "Completed at"))

    with ThreadPoolExecutor(max_workers=35) as executor:
        with requests.Session() as session:
            
            # Set any session parameters here before calling `fetch`
            session.cookies.set("srb_1", "1_wl")

            # Initialize the event loop        
            loop = asyncio.get_event_loop()

            # Set the START_TIME for the `fetch` function
            START_TIME = default_timer()

            # Use list comprehension to create a list of
            # tasks to complete. The executor will run the `fetch`
            # function for each csv in the csvs_to_fetch list
            
            tasks = [
                loop.run_in_executor(
                    executor,
                    fetch,
                    *(session, index, row.link) # Allows us to pass in multiple arguments to `fetch`
                )
                for index, row in books.iterrows()
            ]

            # Initializes the tasks to run and awaits their results
            

consumer = Thread(target=consume)
consumer.setDaemon(True)
consumer.start()

def main(): 

    #input file to get ids
    books = pd.read_csv("./GoodReads_100k_books.csv")
    
    loop = asyncio.get_event_loop()
    future = asyncio.ensure_future(get_data_asynchronous(books))
    loop.run_until_complete(future)

    consumer.join()

main()
