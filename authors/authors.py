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
import json

START_TIME = default_timer()
CLEANR = re.compile('<.*?>')

queue = Queue()

f = None

def signal_handler(sig, frame):
    print('You pressed Ctrl+C!')
    f.flush()
    f.close()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

def json_extract(obj, key):
    """Recursively fetch values from nested JSON."""
    arr = []

    def extract(obj, arr, key):
        """Recursively search for values of key in JSON tree."""
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, (dict, list)):
                    extract(v, arr, key)
                elif k == key:
                    arr.append(v)
        elif isinstance(obj, list):
            for item in obj:
                extract(item, arr, key)
        return arr

    values = extract(obj, arr, key)
    return values

def consume():
    global f
    while True:
        if not queue.empty():
            bookId, rows = queue.get()
            # Row comes out of queue; CSV writing goes here
            for row in rows:
                f.write(row)

def parseAuthor(bookId, data):
    soup = BeautifulSoup(data, "html.parser")
    info = soup.find("script", id="__NEXT_DATA__")
    ll = re.findall('(?<=<script id="__NEXT_DATA__" type="application\/json">).+?(?=<\/script>)',str(info))
    profileImageUrl = json_extract(json.loads(ll[0]),'profileImageUrl')
    description = json_extract(json.loads(ll[0]),'description')[0]
    description = re.sub(r'<.*?>', '', str(description))
    description = re.sub(r'\n', ' ', str(description))
    description = re.sub(r';', ',', str(description))
    return bookId, [str(bookId) + ';' + profileImageUrl[0] + ';' + description + '\n']



def fetch(session, bookId):

    #base_url = 'https://www.goodreads.com/book/show/'

    with session.get(bookId) as response:
        data = response.text
        if response.status_code != 200:
            print("FAILURE::" + bookId )

        queue.put(parseAuthor(bookId,data))

        elapsed = default_timer() - START_TIME
        time_completed_at = "{:5.2f}s".format(elapsed)
        print("{0:<30} {1:>20}".format(bookId, time_completed_at))

        return


async def get_data_asynchronous(bookIds_to_fetch):
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
                    *(session, row.name) # Allows us to pass in multiple arguments to `fetch`
                )
                for index, row in bookIds_to_fetch.iterrows()
            ]

            # Initializes the tasks to run and awaits their results
            

consumer = Thread(target=consume)
consumer.setDaemon(True)
consumer.start()

def main():
    global f
    f = open(sys.argv[1] + '.csv', "w")
    f.write('link,' + sys.argv[1] + '\n')

    if sys.argv[1] != 'author':
        print("invalid args")
        return

    col_list = ["link"]

    #input file to get ids
    bookIds_to_fetch = pd.read_csv("goodreads_clean.csv", index_col=0, usecols=col_list)

    print("Press CTRL-C when scrapping is finished")
    
    loop = asyncio.get_event_loop()
    future = asyncio.ensure_future(get_data_asynchronous(bookIds_to_fetch))
    loop.run_until_complete(future)

    consumer.join()

main()