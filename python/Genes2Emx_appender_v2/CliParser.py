import argparse
__author__ = 'mslofstra'


class CliParser():
    """CliParser parses the commandline and gets the emx file and the genefile."""
    def __init__(self):
        self.parser = self.make_parser()
        self.add_args()
        self.args = self.parser.parse_args()

    def make_parser(self):
        """make_parser makes the parser
        returns the parser"""
        parser = argparse.ArgumentParser()
        return parser

    def add_args(self):
        """add_args adds the arguments to the parser"""
        self.parser.add_argument("-g", "--genefile", type = str, help="The file with the genes from ensembl, 6 columns in this order: name, startlocation, stoplocation, morbid accesion, "+
                                                                      "morbid description, ensembl, gene description, gene type")
        self.parser.add_argument("-e", "--emxfile", type = str, help="The file with the emx")
        self.parser.add_argument("-c", "--cgdfile", type=str, help = "The cgd file with gene information")
        self.parser.add_argument("-gc", "--gwascatalog", type =str, help="The gwas catalog file with gene information")

    def get_gene_file(self):
        """get_gene_file gets the gene file"""
        return self.args.genefile

    def get_emx_file(self):
        """get_emx_file gets the emx file"""
        return self.args.emxfile

    def get_gwas_catalog(self):
        """get_gwas_catalog gets the gwas catalog file"""
        return self.args.gwascatalog

    def get_cgd_file(self):
        """get_cgd_file gets the cgd file"""
        return self.args.cgdfile
