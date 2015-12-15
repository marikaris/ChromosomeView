from Gene import Gene

class GeneFileParser:
    """Class GeneFileParser
    parses a gene file and puts the information in a dictionary with gene objects
    """
    def __init__(self, fileName):
        self.fileName = fileName
        self.genes = {}
        self.parseGeneFile()
    
    def parseGeneFile(self):
        """function parseGeneFile
        parses the gene file (tsv format) and puts the information in a dictionary
        """
        for line in open(self.fileName):
            if line.startswith("Associated"):
                pass
            else:
                geneInfo = line.split("\t")
                geneName = geneInfo[0]
                geneStart = int(geneInfo[1])
                geneStop = int(geneInfo[2])
                gene_acc = geneInfo[4]
                gene_desc = geneInfo[3]
                gene_ens = geneInfo[5].strip("\n")
                if not gene_ens in self.genes:
                    gene = self.makeGene(geneName, geneStart, geneStop, gene_acc, gene_desc, gene_ens)
                    self.addGeneToGeneDict(gene, gene_ens)
                else:
                    gene = self.genes[gene_ens]
                    self.updateGene(gene_acc, gene_desc, geneStart, geneStop, gene)

    def makeGene(self, name, start, stop, mim_accesion, mim_description, ensembl):
        """function makeGene
        makes a gene object

        name: string
        start: int
        stop: int
        mim_accesion: string
        mim_description: string
        ensembl: string
        
        returns gene, the gene object
        """
        gene = Gene(name, start, stop, mim_accesion, mim_description, ensembl)
        return gene

    def updateGene(self, acc, desc, start, stop, gene):
        """function updateGene
        This function can add an omim accesion and description of a gene.
        """
        gene.update(start, stop, acc, desc)

    def addGeneToGeneDict(self, gene, gene_ens):
        """function addGeneToGeneList
        adds a gene object to the dictionary
        gene: Gene
        
        returns 
        """
        self.genes.update({gene_ens : gene})
    
    def getGenes(self):
        """function getGenes
        returns the dictionary with gene objects
        """
        return self.genes

    def __str__(self):
        print_value = ""
        for gene in self.genes:
            print_value += str(self.genes[gene])
        return print_value
    

def run():
    parse_file = GeneFileParser("files/chr6_b38_genes.txt")
    print(parse_file)

if __name__ == "__main__":
    run()