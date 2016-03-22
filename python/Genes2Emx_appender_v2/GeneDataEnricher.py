__author__ = 'mslofstra'
from GwasFileParser import GwasFileParser
from CGDFileParser import CGDFileParser


class GeneDataEnricher:
    """This class enriches the gene data, gathered from ensembl with gwas and cgd data"""
    def __init__(self, gwas, cgd, genes):
        self.genes = genes
        self.gwas_file = gwas
        self.cgd_file = cgd
        self.gwas_articles = []
        self.scanGwasData()
        self.scanCgdFile()

    def scanGwasData(self):
        """This function scans through the gwas articles, saves all hits on chromosome 6 and appends a pubmed id to related genes"""
        gwas_file_parser = GwasFileParser(self.gwas_file, self.genes)
        self.gwas_articles = gwas_file_parser.articles

    def get_updated_genes(self):
        return self.genes

    def get_gwas_articles(self):
        return self.gwas_articles

    def scanCgdFile(self):
        """This function enriches the gene data with cgd data"""
        cgdFileParser= CGDFileParser(self.cgd_file, self.genes)

