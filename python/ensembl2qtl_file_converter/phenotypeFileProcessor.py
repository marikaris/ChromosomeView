__author__ = 'mslofstra'


class PhenotypeFileProcessor:
    def __init__(self, filename):
        """
        :return:
        """
        self.filename = filename
        self.phenoData = {}
        self.genoData = {}
        self.allPhenotypes = []
        self.process_pheno_file()

    def read_pheno_file(self):
        """
        :param file_name: the filename of the file with phenotype information
        :return: the complete phenotype file
        """
        phenoFile = open(self.filename)
        return phenoFile

    def process_patient_aberrations(self, patient, aberrations):
        """
        :param patient: the id of the patient
        :param aberrations: the aberrations the patient has, in string format, start, stop, type separated by comma
        """
        aberrations = aberrations.split(',')
        counter = 0
        aberration = []
        self.genoData[patient]=[]
        for part in aberrations:
            if counter == 0 or counter == 1:
                counter += 1
                aberration.append(part)
            elif counter == 2:
                if part == 'x1' or part == 'x0':
                    aberration.append('A')
                elif part == 'x3' or part == 'x4':
                    aberration.append('B')
                self.genoData[patient].append(aberration)
                aberration = []
                counter = 0

    def process_patient_phenotypes(self, patient, phenotypes):
        self.phenoData[patient] = []
        for phenotype in phenotypes:
            phenotype = phenotype.strip()
            if phenotype == 'X':
                self.phenoData[patient].append(1)
            else:
                self.phenoData[patient].append(0)

    def process_pheno_file(self):
        pheno_file = self.read_pheno_file()
        for i, line in enumerate(pheno_file):
            if i != 0:
                patient = line.split(';')
                self.process_patient_aberrations(patient[0], patient[1])
                self.process_patient_phenotypes(patient[0], patient[2::])
            else:
                self.allPhenotypes = line.split(';')[2::]



