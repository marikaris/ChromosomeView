__author__ = 'mslofstra'


class GwasArticle:
    """This class contains all the info of one gwas article"""
    def __init__(self, id, pubmed, author, date, journal, link, study, reported, mapped, upstream, downstream, trait):
        self.gwas_id = id
        self.pubmed = pubmed
        self.author = author
        self.date = date
        self.journal = journal
        self.link = link
        self.study=study
        self.reported_gene = reported
        self.mapped_gene = mapped
        self.upstream = upstream
        self.downstream = downstream
        self.trait = trait

    def get_pubmed(self):
        return self.pubmed

    def get_first_author(self):
        return self.author

    def get_date(self):
        return self.date

    def get_journal(self):
        return self.journal

    def get_link(self):
        return self.link

    def get_study(self):
        return self.study

    def get_reported_gene(self):
        return self.reported_gene

    def get_mapped_gene(self):
        return self.mapped_gene

    def get_upstream_id(self):
        return self.upstream

    def get_downstream_id(self):
        return self.downstream

    def __str__(self):
        return 'pubmed: {}\nfirst author: {}\ndate: {}\njournal: {}\nstudy: {}\nreported gene: {}\nmapped gene: {}\n'.format(self.pubmed,
                                                                                                                             self.author,
                                                                                                                             self.date,
                                                                                                                             self.journal,
                                                                                                                             self.study,
                                                                                                                             self.reported_gene,
                                                                                                                             self.mapped_gene)


    def get_mapped_trait(self):
        return self.trait

    def get_gwas_id(self):
        return self.gwas_id