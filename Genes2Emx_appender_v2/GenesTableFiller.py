from GeneFileParser import GeneFileParser
from EmxFile import EmxFile
__author__ = 'mslofstra'


class GenesTableFiller:
    """GenesTableFiller fills the genes table with rows with information about genes"""
    def __init__(self, EmxFile, genes):
        self.emx = EmxFile
        self.genes = genes

    def add_genes_to_table(self):
        """add_genes_to_table adds the genes to the genes table"""
        for ensembl_id in self.genes:
            gene=self.genes[ensembl_id]
            name = gene.get_name()
            start = gene.get_start()
            stop = gene.get_stop()
            ensembl = gene.get_ensembl()
            mim_acc = str(gene.get_mim_accesion())
            mim_desc = str(gene.get_mim_description())
            self.add_gene(name, ensembl, mim_acc, mim_desc, start, stop)

    def add_gene(self, name, ensembl, morbid_acc, morbid_desc, start, stop):
        """add_gene adds one gene to the gene table"""
        gene_sheet = self.emx.get_genes_sheet()
        columnValueList = [ensembl, name, morbid_acc, morbid_desc, start, stop]
        columnList = ["A", "B", "C", "D", "E", "F"]
        empty_row = self.emx.find_first_empty_cell(gene_sheet)
        for col, val in zip(columnList, columnValueList):
            self.emx.alter_sheet(gene_sheet, col+str(empty_row), val)

def run():
    emx = EmxFile("files/test_data.xlsx")
    geneParser = GeneFileParser("files/chr6_b37_genes.txt")
    genes = geneParser.getGenes()
    genesTableFiller = GenesTableFiller(emx, genes)
    genesTableFiller.add_genes_to_table()
    emx.save_file_changes()

if __name__ == "__main__":
    run()