__author__ = 'mslofstra'
from C6EmxFile import C6EmxFile

class D_HFile(C6EmxFile):
    def __init__(self, filename):
        self.filename = filename
        self.workbook = C6EmxFile.set_workbook(self)
        self.sheet = C6EmxFile.set_sheet(self, 'chromome6_d_h')
        self.altered_values = {'abn_of_the_respiratory_system1':{'tracheomalacia':'Tracheomalacia'},
                               'abn_of_cardiac_morphology1':{   '1':'Abnormality of the heart valves'.replace(' ','_'),
                                                                '2':'Transposition of the heart'.replace(' ','_'),
                                                                '3':'Tetralogy of Fallot TOF'.replace(' ','_'),
                                                                '4':'Hypoplastic left heart'.replace(' ','_'),
                                                                '5':'Abnormality of the cardiac septa septum defect VSD ASD'.replace(' ','_'),
                                                                '6':'Anomalous pulmonary venous return'.replace(' ','_'),
                                                                'patent_ductus':'patent_ductus_arteriosus'},
                                'cardiac_septa1':{  '1':'Abnormality of the atrial septum ASD'.replace(' ','_'),
                                                    '2':'Abnormality of the ventricular septum VSD'.replace(' ','_')},
                               'heart_valves1':{'1':'Abnormality of the aortic valve'.replace(' ','_'),
                                                '2':'Bicuspid aortic valve'.replace(' ','_'),
                                                '3':'Aortic valve stenosis'.replace(' ','_'),
                                                '4':'Abnormality of the pulmonary valve'.replace(' ','_'),
                                                '5':'Pulmonic stenosis'.replace(' ','_'),
                                                '6':'Pulmonary valve atresia'.replace(' ','_'),
                                                '7':'Abnormality of the mitral valve'.replace(' ','_'),
                                                '8':'Abnormality of the tricuspid valve'.replace(' ','_'),
                                                '9':'Ebsteins anomaly'.replace(' ','_'), '10':'1'},
                               'cardiomyopathy1':{'dilated_cardiomyopathy':'Dilated_cardiomyopathy',
                                                  'hypertrophic_cardiomyopathy':'Hypertrophic_cardiomyopathy',
                                                  '1':'Noncompaction_cardiomyopathy'},
                               'arrhythmia1':{'1':'Long QT'.replace(' ','_')},
                               'blood_pressure1':{'1':'Hypertension', '2':'Hypotension'},
                               'son_genitals1':{'1':'Abnormality of the scrotum'.replace(' ','_')},
                               'recurrent_infections1':{'otitis':'otitis_media'},
                               'recurrent_infections2':{'1':'Recurrent viral infections'.replace(' ','_'),
                                                        '2':'Recurrent bacterial infections'.replace(' ','_'),
                                                        '3':'Recurrent fungal infections'.replace(' ','_')},
                               'growth_hormone1':{'little':'Growth hormone deficiency'.replace(' ','_'), 'much':'Growth hormone excess'.replace(' ','_')},
                               'thyroid_hormone1':{'little':'Hypothyroidism', 'much':'Hyperthyroidism'},
                               'adrenal_hormones1':{'little':'adrenal insufficiency'.replace(' ','_'), 'much':'adrenal overactivity'.replace(' ','_')},
                               'diabetes_mellitus1':{'1':'Type I diabetes mellitus'.replace(' ','_'),
                                                     '2':'Type II diabetes mellitus'.replace(' ','_')},
                               'metabolic1':{'1':'Abnormality of lipid metabolism'.replace(' ','_'),
                                             '2':'Abnormality of carbohydrate metabolism_homeostasis'.replace(' ','_'),
                                             '3':'Abnormality of amino acid metabolism'.replace(' ','_'),
                                             '4':'Abnormality of fatty-acid metabolism'.replace(' ','_'),
                                             '5':'Abnormality of mitochondrial metabolism'.replace(' ','_')},
                               'metabolic3':{'1':'Pain medication'.replace(' ','_'), '2':'Anti-epileptic drugs'.replace(' ','_'),
                                             '3':'Behavioural medication'.replace(' ','_'), '4':'Antibiotics'},
                               'abnormal_eye_morphology4':{'Coloboma1':'Retinal_coloboma', 'Coloboma2':'Iris_coloboma'},
                               'abnormal_pain1':{'impaired_pain_sensation':'Impaired pain sensation'.replace(' ','_'),
                                                 '1': 'Over-reactivity of the mouth region'.replace(' ','_'),
                                                 '2': 'Over-reactivity of the palms of the hands and_or soles of the feet'.replace(' ','_')},
                               'brain_abnormalities1':{'brain_hemorrage':'Intracranial_hemorrhage'},
                               'seizures1':{'1':'Infantile spasms'.replace(' ','_')},
                               'adrenal_hormones3':{'1':'hypoaldosteronism', '2':'hypocortisolism'},
                               'adrenal_hormones5':{'1':'hyperaldosteronism', '2':'hypercortisolism'}
                               }
        self.altered_attributes = {'hernia':'Abnormality_of_the_diaphragm', 'cardiomyopathy2_meds':'cardiomyopathy_meds',
                                   'arrhythmia2_meds':'arrhythmia_meds', 'arrhythmia2_pacemaker':'arrhythmia_pacemaker',
                                   'blood_pressure':'abn_blood_pressure', 'blood_pressure2_meds':'blood_pressure_meds',
                                   'son_genitals':'Abn_of_the_male_genitalia', 'son_genitals2':'cryptorchidism_operation',
                                   'daughter_genitals':'Abn_of_the_female_genitalia', 'abn_blood':'Abn_of_hematopoietic_system',
                                   'abn_blood_clotting':'Abnormality_of_coagulation',
                                   'recurrent_infections4a':'recurrent_infections_ongoing', 'growth_hormone2':'growth_hormone_given',
                                   'growth_hormone4a':'growth_hormone_still_given', 'puberty':'puberty_spontaneous',
                                   'metabolic':'Abnormality_of_metabolism', 'metabolic2':'metabolic_adverse_reac_meds',
                                   'metabolic5':'slow_metabolism_meds', 'middle_inner_ear':'Abnormality_of_the_ear',
                                   'balance':'balance_problems', 'abnormal_pain':'Abn_of_pain_sensation',
                                   'low_muscle_tone':'Muscular_hypotonia', 'excessive_muscle_tone':'Hypertonia'}

    def alter_attributes(self):
        C6EmxFile.alter_attr_cells(self, self.altered_attributes, self.sheet)
        C6EmxFile.save_file_changes(self)

    def alter_values(self):
        C6EmxFile.alter_cells(self, self.altered_values, self.sheet)
        C6EmxFile.save_file_changes(self)