__author__ = 'mslofstra'
from EmxFile import EmxFile
from GeneFileParser import GeneFileParser
from GenesTableFiller import GenesTableFiller
from AttributesTableChanger import AttributesTableChanger
from CliParser import CliParser


class Genes2EmxAppender:
    """Affected_genes2patient_appender
    This is the main class of the application that takes a gene file and an emx file and puts the genes in the emx.
    """
    def __init__(self, path2xl_file, path2gene_file):
        self.emx = EmxFile(path2xl_file)
        self.genes = GeneFileParser(path2gene_file).getGenes()
        print("this may take a while("+str(len(self.genes))+" genes is a lot...), please get a cup of coffee "
                                                            + "(or coco) and wait")

    def alter_attributes(self):
        """alter_attributes
        The AttributesTableChanger is called and changes the attr table.
        """
        attrTableChanger = AttributesTableChanger(self.emx)
        attrTableChanger.add_gene_id_attr()
        attrTableChanger.add_ensembl_attr()
        attrTableChanger.add_mim_accesion_attr()
        attrTableChanger.add_mim_description_attr()
        attrTableChanger.add_start_attr()
        attrTableChanger.add_stop_attr()
        self.emx.save_file_changes()
        print("Attribute table altered, file saved")

    def make_gene_table(self):
        """make_gene_table
        The GenesTableFiller is called and fills the gene table.
        """
        genesTableFiller = GenesTableFiller(self.emx, self.genes)
        genesTableFiller.add_genes_to_table()
        self.emx.save_file_changes()
        print("Gene table created and filled, file saved")


def run():
    parse_cli = CliParser()
    gene_file = parse_cli.get_gene_file()
    emx = parse_cli.get_emx_file()
    xl_file_changer = Genes2EmxAppender(emx, gene_file)
    xl_file_changer.alter_attributes()
    xl_file_changer.make_gene_table()
    print("I'm done! You finished your coffee (or coco)?!")

if __name__ == "__main__":
    run()
