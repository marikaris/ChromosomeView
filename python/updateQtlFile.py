import os

def updateQtlCsvFile(content):
    os.chdir(os.path.dirname(__file__))
    os.chdir('../../../rData')
    csvFile = open('qtl_data.csv', 'a')
    csvFile.write(content)
    csvFile.close()
    
updateQtlCsvFile('${fileContent}')
