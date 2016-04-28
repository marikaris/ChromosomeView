import os

def emptyQtlCsvFile():
    os.chdir(os.path.dirname(__file__))
    os.chdir('../../../rData')
    csvFile = open('qtl_data.csv', 'w')
    csvFile.write('')
    csvFile.close()
    
emptyQtlCsvFile()
