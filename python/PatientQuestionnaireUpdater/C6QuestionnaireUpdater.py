__author__ = 'mslofstra'
from A_CFile import A_CFile
from D_HFile import D_HFile
from I_LFile import I_LFile


class C6QuestionnaireUpdater:
    def __init__(self, old_ac, old_dh, old_il):
        self.old_ac = old_ac
        self.old_dh = old_dh
        self.old_il = old_il
    def run_a_c(self):
        a_c = A_CFile(self.old_ac)
        a_c.alter_attributes()
        a_c.alter_values()
    def run_d_h(self):
        d_h = D_HFile(self.old_dh)
        d_h.alter_attributes()
        d_h.alter_values()
    def run_i_l(self):
        i_l = I_LFile(self.old_il)
        i_l.alter_attributes()
        i_l.alter_values()

def main():
    updater = C6QuestionnaireUpdater('chromosome6_a_c.xlsx', 'chromosome6_d_h.xlsx', 'chromosome6_i_L.xlsx')
    updater.run_a_c()
    # updater.run_d_h()
    # updater.run_i_l()
    # updater = C6QuestionnaireUpdater('chromosome6_a_c_ouders.xlsx', 'chromome6_d_h_ouders.xlsx', 'chromome6_i_l_ouders.xlsx')
    # updater.run_a_c()
    # updater.run_d_h()
    # updater.run_i_l()

main()