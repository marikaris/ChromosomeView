from GeneFileParser import GeneFileParser
from EmxFile import EmxFile
__author__ = 'mslofstra'


class GenesTableFiller:
    """GenesTableFiller fills the genes table with rows with information about genes"""
    def __init__(self, EmxFile, genes, gwas):
        self.emx = EmxFile
        self.genes = genes
        self.gwas = gwas

    def add_genes_to_table(self):
        """add_genes_to_table adds the genes to the genes table"""
        for ensembl_id in self.genes:
            gene = self.genes[ensembl_id]
            name = gene.get_name()
            start = gene.get_start()
            stop = gene.get_stop()
            ensembl = gene.get_ensembl()
            mim_acc = str(gene.get_mim_accesion())
            mim_desc = str(gene.get_mim_description())
            description = gene.get_info()
            type = gene.get_type()
            cgd_condition = gene.get_cgd_condition()
            cgd_inheritance = gene.get_cgd_inheritance()
            gwas = ', '.join(gene.get_gwas())
            self.add_gene(name, ensembl, mim_acc, mim_desc, start, stop, description, type, gwas, cgd_condition, cgd_inheritance)

    def add_gene(self, name, ensembl, morbid_acc, morbid_desc, start, stop, description, type, gwas, cgd_condition, cgd_inheritance):
        """add_gene adds one gene to the gene table"""
        gene_sheet = self.emx.get_genes_sheet()
        columnValueList = [ensembl, name, morbid_acc, morbid_desc, start, stop, description, type, gwas, cgd_condition, cgd_inheritance]
        columnList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]
        empty_row = self.emx.find_first_empty_cell(gene_sheet)
        for col, val in zip(columnList, columnValueList):
            self.emx.alter_sheet(gene_sheet, col+str(empty_row), val)

    def add_studies_to_table(self):
        """This function adds all gwas articles to the gwas table"""
        gwas_sheet = self.emx.get_gwas_sheet()
        for article in self.gwas:
            study = self.gwas[article]
            pubmed = study.get_pubmed()
            author = study.get_first_author()
            date = study.get_date()
            journal = study.get_journal()
            link = study.get_link()
            reported = study.get_reported_gene()
            mapped = study.get_mapped_gene()
            upstream = study.get_upstream_id()
            downstream = study.get_downstream_id()
            trait = study.get_mapped_trait()
            title = study.get_study()
            gwas_id = study.get_gwas_id()
            self.add_study(gwas_id, pubmed, author, date, journal, link, title, reported, mapped, upstream, downstream, trait, gwas_sheet)

    def add_study(self, gwas_id, pubmed, author, date, journal, link, study, reported, mapped, upstream, downstream, trait, gwas_sheet):
        columnValueList = [gwas_id, pubmed, author, date, journal, link, study, reported, mapped, upstream, downstream, trait]
        columnList = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
        empty_row = self.emx.find_first_empty_cell(gwas_sheet)
        for col, val in zip(columnList, columnValueList):
            self.emx.alter_sheet(gwas_sheet, col+str(empty_row), val)

def run():
    emx = EmxFile("files/test_data.xlsx")
    geneParser = GeneFileParser("files/chr6_b37_genes.txt")
    genes = geneParser.getGenes()
    genesTableFiller = GenesTableFiller(emx, genes)
    genesTableFiller.add_genes_to_table()
    emx.save_file_changes()

if __name__ == "__main__":
    run()