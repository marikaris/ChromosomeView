__author__ = 'mslofstra'


class PatientsPerGenesGetter:
    def __init__(self, patient_data, gene_data, patients):
        self.geneData = gene_data
        self.patients = patients
        self.patientData = patient_data
        self.patientsPerGene = self.compare_genes_to_patient_genotypes()

    def compare_genes_to_patient_genotypes(self):
        patients_per_gene = {}
        for gene in self.geneData:
            gene_start = gene[1]
            gene_stop = gene[2]
            gene_mean = round((int(gene_start)+int(gene_stop))/2)
            gene_id = gene[0].strip()
            if gene_id == 'ENSG00000111799':
                print(gene_id, gene_mean, gene_start, gene_stop)
            patients_per_gene[gene_id] = [gene_mean]
            for patient in self.patients:
                patient = self.patientData[patient]
                geneInPatient = False
                for aberration in patient:
                    patient_start = aberration[0]
                    patient_stop = aberration[1]
                    mutation_type = aberration[2]
                    if int(gene_start) <= int(patient_stop) and int(gene_stop) >= int(patient_start):
                        geneInPatient = True
                if geneInPatient:
                    patients_per_gene[gene_id].append(mutation_type)
                else:
                    patients_per_gene[gene_id].append('H')

        return patients_per_gene
