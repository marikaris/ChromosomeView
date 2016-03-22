class Gene:
    """Class Gene stores the information of one gene
    """
    def __init__(self, name, start, stop, mim_acc, mim_desc, ensembl, info, type):
        self.name = name
        self.start = start
        self.stop = stop
        self.mim_accesion = []
        self.mim_description = []
        self.info = info
        self.type = type
        self.gwas = []
        self.cgd_condition = ''
        self.cgd_inheritance = ''

        if mim_acc != "":
            self.mim_accesion.append(mim_acc)
        if mim_desc != "":
            self.mim_description.append(mim_desc)
        self.ensembl = ensembl

    def get_cgd_condition(self):
        return self.cgd_condition

    def get_gwas(self):
        return self.gwas

    def get_cgd_inheritance(self):
        return self.cgd_inheritance

    def get_name(self):
        """function get_name
        gets the name of the gene
        returns the gene name
        """
        return self.name
    
    def get_start(self):
        """function get_start
        returns the start location of the gene in string format
        """
        return str(self.start)
    
    def get_stop(self):
        """function get_stop
        returns the stop location of the gene in string format
        """
        return str(self.stop)
    
    def get_mim_accesion(self):
        """function get_mim_accesion
        returns the omim morbid accesion of the gene
        """
        return self.mim_accesion
    
    def get_mim_description(self):
        """function get_mim_description
        returns the omim morbid description of the gene
        """
        return self.mim_description
    
    def get_ensembl(self):
        """function get_ensembl
        returns the ensembl id of the gene
        """
        return self.ensembl

    def get_type(self):
        """function get_type
        returns the type of the gene"""
        return self.type

    def get_info(self):
        """function get_info
        returns the information of the gene"""
        return self.info

    def update(self, start, stop, mim_acc, mim_desc):
        """function update
        updates the gene object with new accesion and description
        """
        if start < self.start:
            self.start = start
        if stop > self.stop:
            self.stop = stop
        if mim_desc not in self.mim_description and mim_desc != "":
            self.mim_description.append(mim_desc)
            self.mim_accesion.append(mim_acc)

    def __str__(self):
        gene_description='GENE:'+self.ensembl+': '+self.name+'\n'+str(self.start)+'-'+str(self.stop)
        if self.info != '':
            gene_description+='\n'+self.info
        gene_description+='\nTYPE:'+self.type+'\nARTICLES:'
        if len(self.gwas) == 0:
            gene_description += '-'
        else:
            gene_description += ', '.join(self.gwas)
        if self.cgd_condition != '':
            gene_description += '\nCGD condition: '+self.cgd_condition+'\nCGD inheritance: '+self.cgd_inheritance
        gene_description+='\nOMIM: '
        if len(self.mim_accesion) == 0:
            gene_description+="-\n"
        for desc, acc in zip(self.get_mim_description(), self.get_mim_accesion()):
            gene_description+=desc+"("+acc+")\n"
        return gene_description
