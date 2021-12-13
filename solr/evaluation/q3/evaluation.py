import matplotlib.pyplot as plt
from sklearn.metrics import PrecisionRecallDisplay
import numpy as np
import json
import requests
import pandas as pd
import sys
import os

needsWeight = False
if '-w' in sys.argv:
    needsWeight = True

QRELS_FILE = "query.txt"
QUERY_URL = "http://localhost:8983/solr/goodreads/select?debugQuery=false&defType=edismax&fq=totalratings%3A%5B600%20TO%20*%5D&indent=true&lowercaseOperators=false&q.op=AND&q=easy%20and%20delicious%20vegan%20recipes&qf=genre%20desc%20positive_reviews&rows=30"
QUERY_URL_WEIGHT = "http://localhost:8983/solr/goodreads/select?debugQuery=false&defType=edismax&fq=totalratings%3A%5B600%20TO%20*%5D&indent=true&lowercaseOperators=false&pf=positive_reviews%5E5&ps=1&q.op=AND&q=easy%20and%20delicious%20vegan%20recipes&qf=genre%5E3%20desc%20positive_reviews&rows=30"

# Read qrels to extract relevant documents
relevant = list(map(lambda el: el.strip(), open(QRELS_FILE).readlines()))

# Get query results from Solr instance
if needsWeight:
    file_obj = "query_results_weight.txt"
    results = requests.get(QUERY_URL_WEIGHT).json()['response']['docs']
else:
    file_obj = "query_results.txt"
    results = requests.get(QUERY_URL).json()['response']['docs']

if os.path.exists(file_obj):
    os.remove(file_obj)

file_object = open(file_obj, 'a')

for book in results:
    file_object.write(book["link"])
    file_object.write('\n')

file_object.close()

# METRICS TABLE
# Define custom decorator to automatically calculate metric based on key
metrics = {}
metric = lambda f: metrics.setdefault(f.__name__, f)

@metric
def ap(results, relevant):
    """Average Precision"""
    precision_values = [
        len([
            doc 
            for doc in results[:idx]
            if doc['link'] in relevant
        ]) / idx 
        for idx in range(1, len(results))
    ]
    return sum(precision_values)/len(precision_values)

@metric
def p10(results, relevant, n=10):
    """Precision at N"""
    return len([doc for doc in results[:n] if doc['link'] in relevant])/n

def calculate_metric(key, results, relevant):
    return metrics[key](results, relevant)

# Define metrics to be calculated
evaluation_metrics = {
    'ap': 'Average Precision',
    'p10': 'Precision at 10 (P@10)'
}

# Calculate all metrics and export results as LaTeX table
df = pd.DataFrame([['Metric','Value']] +
    [
        [evaluation_metrics[m], calculate_metric(m, results, relevant)]
        for m in evaluation_metrics
    ]
)

if needsWeight:
    filename = 'results_weight.tex'
else:
    filename = 'results.tex'

with open(filename,'w') as tf:
    tf.write(df.to_latex())


# PRECISION-RECALL CURVE
# Calculate precision and recall values as we move down the ranked list
precision_values = [
    len([
        doc 
        for doc in results[:idx]
        if doc['link'] in relevant
    ]) / idx 
    for idx, _ in enumerate(results, start=1)
]

recall_values = [
    len([
        doc for doc in results[:idx]
        if doc['link'] in relevant
    ]) / len(relevant)
    for idx, _ in enumerate(results, start=1)
]

precision_recall_match = {k: v for k,v in zip(recall_values, precision_values)}

# Extend recall_values to include traditional steps for a better curve (0.1, 0.2 ...)
recall_values.extend([step for step in np.arange(0.1, 1.1, 0.1) if step not in recall_values])
recall_values = sorted(set(recall_values))

# Extend matching dict to include these new intermediate steps
for idx, step in enumerate(recall_values):
    if step not in precision_recall_match:
        if recall_values[idx-1] in precision_recall_match:
            precision_recall_match[step] = precision_recall_match[recall_values[idx-1]]
        else:
            precision_recall_match[step] = precision_recall_match[recall_values[idx+1]]

disp = PrecisionRecallDisplay([precision_recall_match.get(r) for r in recall_values], recall_values)
disp.plot()

plt.ylim((0, 1.1))
if needsWeight:
    plt.savefig('precision_recall_weight.pdf')
else:
    plt.savefig('precision_recall.pdf')
