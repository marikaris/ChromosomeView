from EmxFile import EmxFile
__author__ = 'mslofstra'


class AttributesTableChanger:
    """AttributesTableChanger is the class that changes the attributes table.
    EmxFile is imported to make it possible to work with the excel format in python."""
    def __init__(self, emx_file):
        self.emx = emx_file

    def addAttr(self, attr_name, table_name, data_type, id_attr, nillable, description, ref_entity, default):
        """addAttr adds an attribute to the attribute table in the emx file. It needs all the values of the
        columns in the attributes table."""
        attr_sheet=self.emx.get_attr_sheet()
        empty_row = self.emx.find_first_empty_cell(attr_sheet)
        col_list = ["A", "B", "C", "D", "E", "F", "G", "H"]
        item_list = [attr_name, table_name, data_type, id_attr, nillable, description, ref_entity, default]
        for col, val in zip(col_list, item_list):
            self.emx.alter_sheet(attr_sheet, col+str(empty_row), val)

    def add_gene_id_attr(self):
        """add_gene_id_attr adds the attribute of the gene id to the attributes table to define the id
        of the gene table."""
        self.addAttr("gene_name", "genes", "string", "FALSE", "FALSE", "the short name of the gene", "", "")

    def add_start_attr(self):
        """add_start_attr adds the start attribute to the attributes table to define the start column in the
        gene table."""
        self.addAttr("start", "genes", "long", "FALSE", "FALSE", "start position of the gene", "", "")

    def add_stop_attr(self):
        """add_stop_attr adds the start attribute to the attributes table to define the stop column in the
        gene table."""
        self.addAttr("stop", "genes", "long", "FALSE", "FALSE", "stop position of the gene", "", "")

    def add_mim_accesion_attr(self):
        """add_mim_accesion_attr adds the mim accesion attribute to the attributes table to define the Mim Accesion column in the
        gene table."""
        self.addAttr("omim_morbid_accesion", "genes", "text", "FALSE", "TRUE", "The omim morbid accesion of the gene", "", "")

    def add_mim_description_attr(self):
        """add_mim_description_attr adds the mim description attribute to the attributes table to define the Mim description column in the
        gene table."""
        self.addAttr("omim_morbid_description", "genes", "text", "FALSE", "TRUE", "The omim morbid description of the gene", "", "")

    def add_ensembl_attr(self):
        """add_ensembl_attr adds the ensembl attribute to the attributes table to define the ensembl column in the
        gene table."""
        self.addAttr("ensembl_id", "genes", "string", "TRUE","FALSE", "The ensembl accesion of the gene", "", "")

def run():
    emx = EmxFile("files/test_data.xlsx")
    changeAttrTable = AttributesTableChanger(emx)
    changeAttrTable.add_gene_id_attr()
    changeAttrTable.add_ensembl_attr()
    changeAttrTable.add_mim_accesion_attr()
    changeAttrTable.add_mim_description_attr()
    changeAttrTable.add_start_attr()
    changeAttrTable.add_stop_attr()
    changeAttrTable.add_genes_to_genotype()
    emx.save_file_changes()

if __name__ == "__main__":
    run()