__author__ = 'mslofstra'
from EmxFile import EmxFile
from GeneFileParser import GeneFileParser
from GenesTableFiller import GenesTableFiller
from CliParser import CliParser
from GeneDataEnricher import GeneDataEnricher


class Genes2EmxAppender:
    """Affected_genes2patient_appender
    This is the main class of the application that takes a gene file and an emx file and puts the genes in the emx.
    """
    def __init__(self, path2xl_file, path2gene_file, path2gwas_file, path2cgd_file):
        self.emx = EmxFile(path2xl_file)
        genes = GeneFileParser(path2gene_file).getGenes()
        geneEnricher = GeneDataEnricher(path2gwas_file, path2cgd_file, genes)
        self.genes = geneEnricher.genes
        self.articles = geneEnricher.gwas_articles
        self.genesTableFiller = GenesTableFiller(self.emx, self.genes, self.articles)
        print("this may take a while("+str(len(self.genes))+" genes is a lot...), please get a cup of coffee "
                                                            + "(or coco) and wait")
    def alter_attributes(self):
        """This function updates the attribute sheet of the emx"""
        self.emx.update_attr_sheet()

    def make_gene_table(self):
        """make_gene_table
        The GenesTableFiller is called and fills the gene table.
        """
        self.genesTableFiller.add_genes_to_table()
        self.emx.save_file_changes()
        print("Gene table created and filled, file saved")

    def make_gwas_table(self):
        """make_gwas_table
        The GeneTableFiller is called and fills the gwas table.
        """
        self.genesTableFiller.add_studies_to_table()
        self.emx.save_file_changes()
        print("Gwas table created and filled, file saved")

def run():
    parse_cli = CliParser()
    gene_file = parse_cli.get_gene_file()
    emx = parse_cli.get_emx_file()
    cgd_file = parse_cli.get_cgd_file()
    gwas_file = parse_cli.get_gwas_catalog()
    xl_file_changer = Genes2EmxAppender(emx, gene_file, gwas_file, cgd_file)
    # xl_file_changer.alter_attributes()
    xl_file_changer.make_gene_table()
    xl_file_changer.make_gwas_table()
    print("I'm done! You finished your coffee (or coco)?!")

if __name__ == "__main__":
    run()
