import csv
import json

csvfile = open('neerslag2015(1).csv', 'r')
jsonfile = open('neerslag2015.json', 'w')

fieldnames = ("Date","Rain")
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write(', \n')
