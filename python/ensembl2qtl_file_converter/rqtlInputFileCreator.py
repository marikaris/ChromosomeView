from ensemblFileProcessor import EnsemblFileProcessor
from phenotypeFileProcessor import PhenotypeFileProcessor
from patientsPerGeneGetter import PatientsPerGenesGetter
__author__ = 'mslofstra'


class RqtlInputFileCreator:
    def __init__(self, filename):
        self.genes = EnsemblFileProcessor('files/chr6_b37_genes.txt', 'files/mart_export.txt').genes
        phenotypes = PhenotypeFileProcessor('files/phenotypeData_test.csv')
        self.patientPhenoData = phenotypes.phenoData
        self.patientGenoData = phenotypes.genoData
        self.allPhenotypes = phenotypes.allPhenotypes
        self.rqtlFile = ''
        self.patients = self.patientPhenoData.keys()
        self.patientsPerGene = PatientsPerGenesGetter(self.patientGenoData, self.genes, self.patients).patientsPerGene
        self.createInputFile(filename)

    def createGeneRows(self):
        for gene in self.patientsPerGene:
            self.rqtlFile.write(gene+',6,'+str(self.patientsPerGene[gene][0])+',')
            self.rqtlFile.write(','.join(self.patientsPerGene[gene][1::])+'\n')

    def createPhenoRows(self):
        for phenotypeNr, phenotype in enumerate(self.allPhenotypes):
            self.rqtlFile.write(phenotype.strip()+',,,')
            for i, patient in enumerate(self.patientPhenoData):
                value = self.patientPhenoData[patient][phenotypeNr]
                if i == len(self.patientPhenoData)-1:
                    self.rqtlFile.write(str(value))
                else:
                    self.rqtlFile.write(str(value)+',')
            self.rqtlFile.write('\n')

    def createInputFile(self, filename):
        self.rqtlFile = open(filename, 'w')
        self.rqtlFile.write('phenogeno,chromosome,position,'+','.join(self.patients)+'\n')
        self.createPhenoRows()
        self.createGeneRows()
        self.rqtlFile.close()


def main():
    RqtlInputFileCreator('rqtl_input.csv')

if __name__ == '__main__':
    main()
