import csv
import json

csvFile = open('vlissingen.csv', 'r')
jsonfile = open('vlissingen.json', 'w')

json_dict = []

reader = csv.reader(filter(lambda row: row[0] != '#', csvFile))
for row in reader:
    json_dict.append({'date':row[1].strip(), 'average':row[2].strip(), 'min':row[3].strip(), 'max':row[4].strip()})

json.dump(json_dict, jsonfile)
