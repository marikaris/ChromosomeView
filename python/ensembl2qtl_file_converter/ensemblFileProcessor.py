__author__ = 'mslofstra'


class EnsemblFileProcessor:
    def __init__(self, filename, genefile):
        self.filename = filename
        self.valid_genefile = genefile
        self.genes = self.process_ensembl_file();

    def read_ensembl_file(self):
        """
        :param filename: the filename of the file that should be read
        :return: the complete file with all ensembl genes
        """
        ensemblFile = open(self.filename)
        return ensemblFile

    def process_ensembl_file(self):
        """
        :return: a list with ensembl gene id, start location, stop location of each gene of the ensembl file
        """
        ensemblFile = self.read_ensembl_file()
        geneData = []
        for i, line in enumerate(ensemblFile):
            if i != 0:
                variables = line.split('\t')
                gene_start = variables[1]
                gene_stop = variables[2]
                id = variables[5]
                gene_is_relevant = self.check_gene_relevance(id)
                if gene_is_relevant:
                    geneData.append([id, gene_start, gene_stop])
        return geneData

    def check_gene_relevance(self, gene):
        genefile = open(self.valid_genefile)
        for line in genefile:
            if line.strip('\n') == gene.strip('\n'):
                return True
        return False