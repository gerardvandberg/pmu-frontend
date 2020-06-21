import csv
import json
import requests
import re
data = {}


def cords(d):
    return d.replace('º', ' ').replace('´', ' ').replace('"', '')


with open('in.csv', encoding="utf8") as csvfile:
    reader = csv.DictReader(csvfile)
    for r in reader:
        id = r['Nº']
        data[id] = r
data_t = []
for i in data:
    d = data[i]
    t = {
        "boreholeDepth": d['Borehole depth (m)'],
        "boreholeDiameter": '10',
        "builtBy": d['Built by'],
        "comiteeContracts": [''],
        "drillingCompany": d['Drilling company'],
        "drillingYear": d['Drilling year'],
        "dynamicWaterLevel": d['Dynamic water level=pumping water level (m)'],
        "eastings": cords(d['TE']),
        "inlet": d['Pump inlet (m)'],
        "inletYieldTest": d['Pump inlet during yield test (m)'],
        "location": d["Location"],
        "maintainedBy": d['Maintained by'],
        "model": d['Model'],
        "name": d['Name'],
        "northings": cords(d['TN']),
        "pumpId": d['Nº'],
        "pumpSize": "",
        "remarks": [
            d['Remarks']
        ],
        "runningBalance": d['Running balance'] if d['Running balance'].isnumeric() else "10",
        "staticWaterLevel": d['Static water level (m)'],
        "territory": d['Territory'],
        "testedYield": d['Tested yield (cu.m/h)'],
        "type": d['Type'],
        "underPMU": 'true' if d['Under PMU program'] == 'YES' else 'false',
        "waterQuality": d['Water quality SUITABLE FOR:']
    }
    data_t.append(t)

for j in data_t:
    print(requests.post("http://localhost:1453/pump", json=j))
requests.post("http://localhost:1453/loadDropdown")
