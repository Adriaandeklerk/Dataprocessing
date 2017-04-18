import csv
import json

csvfile = open('KNMI2.csv', 'r')
jsonfile = open('KNMIdata2.json', 'w')

fieldnames = ("YYYYMMDD","RH")
reader = csv.DictReader( csvfile, fieldnames)
for row in reader:
    json.dump(row, jsonfile)
    jsonfile.write('\n')
