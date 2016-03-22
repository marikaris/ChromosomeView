__author__ = 'mslofstra'
import re
from GeneFileParser import GeneFileParser
from Gwas_article import GwasArticle

class GwasFileParser:
    def __init__(self, gwas_catalog, genes):
        self.saved_genes = genes
        self.articles = {}
        self.geneConversion = self.convert_genes()
        self.gwasData = self.parse_gwas_file(gwas_catalog)

    def convert_genes(self):
        """This function creates a dictionary that converts a hgnc identifier to an ensembl id"""
        conversion = {}
        for gene in self.saved_genes:
            hgnc = self.saved_genes[gene].name
            conversion.update({hgnc:gene})
        return conversion

    def create_article(self, id, pubmed, first_author, date, journal, link, study, reported_gene, mapped_gene, upstream_id,
                      downstream_id, mapped_trait):
        """This function creates a GwasArticle object"""
        if id not in self.articles:
            print(id)
            article = GwasArticle(id, pubmed, first_author, date, journal, link, study, reported_gene, mapped_gene,
                                      upstream_id, downstream_id, mapped_trait)
            self.articles.update({id:article})

    def parse_gwas_file(self, gwas_catalog):
        """parseGwasFile parses the given gwas catalog file"""
        for line in open(gwas_catalog):
            line = line.split('\t')
            chr = line[11]
            if chr == '6':
                pubmed = line[1]
                first_author = line[2]
                date = line[3]
                journal=line[4]
                link = line[5]
                study = line[6]
                reported_gene = line[13]
                mapped_gene = line[14]
                upstream_id = line[15]
                downstream_id = line[16]
                mapped_trait = line[-2]
                genes = re.findall('[^ ,]{2,}', reported_gene)
                for gene in genes:
                    if gene in self.geneConversion:
                        # get the ensembl id
                        id = self.geneConversion[gene]
                mapped_genes = re.findall('[^ ,]{2,}', mapped_gene)
                self.update_gene_attr(id, pubmed+id)
                self.create_article(pubmed+id, pubmed, first_author, date, journal, link, study, reported_gene,
                                    mapped_gene, upstream_id, downstream_id, mapped_trait)
                for gene in mapped_genes:
                    if gene in self.geneConversion:
                        # get the ensembl id
                        id = self.geneConversion[gene]
                        self.update_gene_attr(id, pubmed+id)
                        self.create_article(pubmed+id, pubmed, first_author, date, journal, link, study, reported_gene,
                                    mapped_gene, upstream_id, downstream_id, mapped_trait)
        print("GWAS file parsed")

    def update_gene_attr(self, id, gwas_id):
        """This function adds a pubmed id to a gene object"""
        studies = self.saved_genes[id].gwas
        if not gwas_id in studies:
            studies.append(gwas_id)

def main():
    parse_file = GeneFileParser("files/hg19_new.txt")
    genes = parse_file.genes
    gwasFileParser = GwasFileParser('files/gwas_catalog.tsv', genes)
    for gene in genes:
        print(genes[gene])
    for article in gwasFileParser.articles:
        print(article)

if __name__ == '__main__':
    main()