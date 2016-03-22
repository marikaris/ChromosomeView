__author__ = 'mslofstra'
from C6EmxFile import C6EmxFile


class I_LFile(C6EmxFile):
    def __init__(self, filename):
        self.filename = filename
        self.workbook = C6EmxFile.set_workbook(self)
        self.sheet = C6EmxFile.set_sheet(self, 'chromome6_i_l')
        self.altered_values = {'language_understanding1':{'2':'Receptive language delay'.replace(' ','_')},
                               'language_speech1':{'2':'Expressive language delay'.replace(' ','_'), '3':'absent speech'.replace(' ','_')},
                               'behaviour':{'1':'Quiet', '2':'Withdrawn', '3':'Shyness', '4':'Helpful', '5':'Hyperactivity',
                                             '6':'Aggressive towards others'.replace(' ','_'),
                                             '7':'Aggressive towards self outbursts or tantrums'.replace(' ','_'),
                                             '8':'Self-harming', '9':'Social',
                                             '10':'Is hard to make good contact with'.replace(' ','_'),
                                             '11':'Easily_upset'},
                               'behavioral_abnormality1':{'Autistic_disorder':'Autism'},
                               'behavioral_abnormality2':{'1':'PDD-NOS', '2':'Aspergers_syndrome', '3':'Classical_autism'},
                               'mood_disorder1':{'1':'Anxiety', '2':'Depressive disorder'.replace(' ','_'), '3':'Bipolar disorder'.replace(' ','_'),
                                                 '4':'Post-traumatic stress syndrome PTSS'.replace(' ','_')},
                               'sleeping_problems1':{'1':'insomnia','3':'parasomnia', '2':'noHPO'}
                               }
        self.altered_attributes = {'sit_up2':'sit_up_without_help', 'communication':'communication_aids',
                                   'intervention':'intervention_behavioural_prob', 'sleeping_problems2':'sleeping_problems_meds'}

    def alter_attributes(self):
        C6EmxFile.alter_attr_cells(self, self.altered_attributes, self.sheet)
        C6EmxFile.save_file_changes(self)

    def alter_values(self):
        C6EmxFile.alter_cells(self, self.altered_values, self.sheet)
        C6EmxFile.save_file_changes(self)