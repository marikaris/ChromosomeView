__author__ = 'mslofstra'
from GwasFileParser import GwasFileParser
from GeneFileParser import GeneFileParser

class CGDFileParser:
    def __init__(self, cgd_file_name, genes):
        self.filename = cgd_file_name
        self.saved_genes = genes
        self.conversion = self.convert_genes()
        self.parse_cgd_file()

    def convert_genes(self):
        """This function creates a dictionary that converts a hgnc identifier to an ensembl id"""
        conversion = {}
        for gene in self.saved_genes:
            hgnc = self.saved_genes[gene].name
            conversion.update({hgnc:gene})
        return conversion

    def parse_cgd_file(self):
        """This function parses the cgd file"""
        for line in open(self.filename):
            values = line.split('\t')
            gene = values[0]
            if gene in self.conversion:
                condition = values[3]
                inheritance = values[4]
                self.save_gene_info(gene, condition, inheritance)
        print("CGD file parsed")

    def save_gene_info(self, gene, condition, inheritance):
        """This function saves the information from cgd to the connected gene object"""
        ensemble_id = self.conversion[gene]
        self.saved_genes[ensemble_id].cgd_condition = condition
        self.saved_genes[ensemble_id].cgd_inheritance = inheritance

def main():
    parse_file = GeneFileParser("files/hg19_new.txt")
    genes = parse_file.genes
    gwasFileParser = GwasFileParser('files/gwas_catalog.tsv', genes)
    cgdFileParser= CGDFileParser('files/CGD.txt', genes)
    for gene in genes:
        print(genes[gene])

if __name__ == '__main__':
    main()