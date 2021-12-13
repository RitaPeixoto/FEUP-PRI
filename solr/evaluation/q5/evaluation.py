import json
from itertools import cycle

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import requests
from sklearn.metrics import PrecisionRecallDisplay

QRELS_FILE = "query.txt"
QUERY_URL = "http://localhost:8983/solr/goodreads/select?debugQuery=false&defType=edismax&indent=true&q.op=AND&q=nazi%20holocaust%20history&qf=genre%20title%20desc&rows=20"
QUERY_URL_WEIGHT = "http://localhost:8983/solr/goodreads/select?debugQuery=false&defType=edismax&indent=true&q.op=AND&q=nazi%20holocaust%20history&qf=genre%5E1.8%20title%20desc%5E1.2&rows=20"

# Read qrels to extract relevant documents
relevant = list(map(lambda el: el.strip(), open(QRELS_FILE).readlines()))

# Get query results from Solr instance
normalResults = requests.get(QUERY_URL).json()['response']['docs']
weightResults = requests.get(QUERY_URL_WEIGHT).json()['response']['docs']
noSchemaResults = json.load(open('noSchema.json', encoding="utf8"))[
    'response']['docs']

results = [noSchemaResults, normalResults, weightResults]

_, ax = plt.subplots(figsize=(7, 8))

colors = cycle(["darkorange", "teal",  "gold"])

i = 0
for results, color in zip(results, colors):

    # METRICS TABLE
    # Define custom decorator to automatically calculate metric based on key
    metrics = {}
    def metric(f): return metrics.setdefault(f.__name__, f)

    @metric
    def ap(results, relevant):
        """Average Precision"""

        relevant_index = []
        index = 0
        for res in results:
            if (i != 0 and res['link'] in relevant) or (i == 0 and res['link'][0] in relevant):
                relevant_index.append(index)
            index = index + 1

        if len(relevant_index) == 0:
            return 0

        precision_values = [
            len([
                doc
                for doc in results[:idx]
                if (i != 0 and doc['link'] in relevant) or (i == 0 and doc['link'][0] in relevant)
            ]) / idx
            for idx in range(1, len(results) + 1)
        ]
        
        precision_sum = 0
        for ind in relevant_index:
            precision_sum = precision_sum + precision_values[ind]

        return precision_sum/len(relevant_index)

    @metric
    def p10(results, relevant, n=10):
        """Precision at N"""
        return len([
            doc
            for doc in results[:n]
            if (i != 0 and doc['link'] in relevant) or (i == 0 and doc['link'][0] in relevant)
        ]) / n

    def calculate_metric(key, results, relevant):
        return metrics[key](results, relevant)

    # Define metrics to be calculated
    evaluation_metrics = {
        'ap': 'Average Precision',
        'p10': 'Precision at 10 (P@10)'
    }

    # Calculate all metrics and export results as LaTeX table
    df = pd.DataFrame([['Metric', 'Value']] +
                      [
        [evaluation_metrics[m], calculate_metric(m, results, relevant)]
        for m in evaluation_metrics
    ]
    )

    if i == 0:
        filename = 'results_no_schema.tex'
    elif i == 1:
        filename = 'results.tex'
    else:
        filename = 'results_weight.tex'

    with open(filename, 'w') as tf:
        tf.write(df.to_latex())

    # PRECISION-RECALL CURVE
    # Calculate precision and recall values as we move down the ranked list
    precision_values = [
        len([
            doc
            for doc in results[:idx]
            if (i != 0 and doc['link'] in relevant) or (i == 0 and doc['link'][0] in relevant)
        ]) / idx
        for idx, _ in enumerate(results, start=1)
    ]

    recall_values = [
        len([
            doc for doc in results[:idx]
            if (i != 0 and doc['link'] in relevant) or (i == 0 and doc['link'][0] in relevant)
        ]) / len(relevant)
        for idx, _ in enumerate(results, start=1)
    ]

    precision_recall_match = {k: v for k,
                              v in zip(recall_values, precision_values)}

    # Extend recall_values to include traditional steps for a better curve (0.1, 0.2 ...)
    recall_values.extend([step for step in np.arange(
        0.1, 1.1, 0.1) if step not in recall_values])
    recall_values = sorted(set(recall_values))

    # Extend matching dict to include these new intermediate steps
    for idx, step in enumerate(recall_values):
        if step not in precision_recall_match:
            if recall_values[idx-1] in precision_recall_match:
                precision_recall_match[step] = precision_recall_match[recall_values[idx-1]]
            else:
                precision_recall_match[step] = precision_recall_match[recall_values[idx+1]]

    disp = PrecisionRecallDisplay(
        [precision_recall_match.get(r) for r in recall_values], recall_values)
    if(i == 0):
        disp.plot(ax=ax, name=f"Precision-recall without schema",
                  color=color, linewidth=1)
    elif(i == 1):
        disp.plot(ax=ax, name=f"Precision-recall without weights",
                  color=color, linewidth=1)
    elif(i == 2):
        disp.plot(ax=ax, name=f"Precision-recall with weights",
                  color=color, linewidth=1.5)
    i += 1

# add the legend for the iso-f1 curves
handles, labels = disp.ax_.get_legend_handles_labels()

# set the legend and the axes
ax.legend(handles=handles, labels=labels, loc="best")
ax.set_title("Precision-Recall curve of information retrieval 4")

plt.savefig('precision_recall.png')

