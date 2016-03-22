__author__ = 'mslofstra'
from C6EmxFile import C6EmxFile


class A_CFile(C6EmxFile):
    def __init__(self, filename):
        self.filename = filename
        self.workbook = C6EmxFile.set_workbook(self)
        self.sheet = C6EmxFile.set_sheet(self, 'chromosome6_a_c')
        self.altered_values = {'childbirth1' : {'1':'Breech_presentation', '2': 'Premature_rupture_of membranes',
                                                '3':'Ventouse_delivery', '4':'Forceps_delivery', '5':'Caesarian_section',
                                                '6':'Shoulder_dystocia', '7':'Meconium_stained_amniotic_fluid',
                                                '8':'Neonatal_respiratory_distress'},
                               'firstdays1':{'1':'Neonatal_asphyxia', '2':'Temperature_dysregulation_necessitating_an_incubator',
                                             '3':'Prolonged_neonatal_jaundice', '4':'Poor_suck',
                                             '5':'Transient_neonatal_diabetes_mellitus', '6':'Newborn_seizures'},
                               'hospital1':{'1':'Premature_birth', '2':'Hospitalisation_Maternal_reasons',
                                             '3':'Hospitalisation Congenital problems'.replace(' ', '_'),
                                            '4':'Hospitalisation An infection'.replace(' ', '_')},
                               'headsize1':{'i':'Microcephaly', 'a':'Macrocephaly'},
                               'umbilicalcord':{'Long umbilical cord':'Long_umbilical_cord',
                                                'Short umbilical cord':'Short_umbilical_cord',
                                                'Nuchal cord':'Nuchal_cord', 'Single umbilical artery':'Single_umbilical_artery'},
                               'placenta':{'Large placenta':'Large placenta'.replace(' ', '_'), 'Small placenta':'Small placenta'.replace(' ', '_'),
                                           'Placental abruption':'Placental abruption'.replace(' ', '_'),
                                           'Calcified placenta':'Calcified placenta'.replace(' ', '_'),
                                           'Abnormal insertion of umbilical cord':'Abnormal insertion of umbilical cord'.replace(' ', '_')},
                               'microcephaly1':{'Congenital microcephaly':'Congenital_microcephaly', 'Postnatal microcephaly':'Postnatal_microcephaly'},
                               'macrocephaly1':{'Macrocephaly from birth': 'Macrocephaly at birth'.replace(' ', '_'),
                                                'Macrocephaly due to hydrocephalus' : 'Hydrocephalus', 'Postnatal macrocephaly':'Postnatal_macrocephaly'},
                               'large_fontanelles1':{'large fontanelles':'large_fontanelles',
                                                     'premature closure of fontanelles':'premature_closure_of_fontanelles'},
                               'craniosynostosis1':{'Coronal craniosynostosis':'Coronal craniosynostosis'.replace(' ', '_'),
                                                    'Lambdoidal craniosynostosis':'Lambdoidal_craniosynostosis',
                                                    'metopic synostosis':'metopic_synostosis',
                                                    'sagittal craniosynostosis':'sagittal_craniosynostosis',
                                                    'Multiple suture craniosynostosis':'Multiple_suture_craniosynostosis'},
                               'Oral_cleft1':{'Cleft palate':'Cleft_palate', 'Cleft soft palate':'Cleft_soft_palate',
                                              'non midline Cleft lip':'non_midline_Cleft_lip',
                                              'median cleft lip':'median_cleft_lip', 'cleft lower lip':'cleft_lower_lip',
                                              'Lip pit':'Lip_pit'},
                               'Abnormality_of_the_teeth1':{'Increased number of teeth':'Increased_number_of_teeth',
                                                            'Reduced number of teeth':'Reduced_number_of_teeth',
                                                            'Delayed eruption of teeth':'Delayed_eruption_of_teeth',
                                                            'Abnormality of dental morphology':'Abnormality_of_dental_morphology',
                                                            'Abnormality of dental structure':'Abnormality_of_dental_structure'},
                               'Abnormality_of_the_outer_ear1':{'aplasia_hypoplasia_of_the_outer_ear':'Aplasia_Hypoplasia of the external ear'.replace(' ', '_')},
                               'hypermobility_joints1':{'1': 'Hypermobility especially in large joints knees elbows'.replace(' ', '_'),
                                                        'Generalized joint laxity':'Generalized_joint_laxity'},
                               'contracture_joints1':{'1':'Contractures especially in large joints knees elbows present at birth'.replace(' ', '_'),
                                                      '2':'Contractures of the large joints'.replace(' ', '_'),
                                                      '3':'Congenital finger flexion contractures'.replace(' ', '_'),
                                                      '4':'Contractures especially in small joints developed later in life'.replace(' ', '_'),
                                                      '5':'Arthrogryposis', '6':'Contractures of all joints developed later in life'.replace(' ', '_'),
                                                      '7':'Arthrogryposis'},
                               'abnormality_of_the_hand1':{'oligodactyly_(hands)':'oligodactyly_hands'},
                               'stature1':{'1':'Short_stature', '2':'Tall_stature'},
                               'feeding1a':{'1':'Refusal_of_food', '2':'Rumination', '3':'Drooling', '4':'Vomiting',
                                            'Poor suck':'Poor_suck', 'Chewing difficulties':'Chewing_difficulties',
                                            'Nasal regurgitation':'Nasal regurgitation'.replace(' ', '_'),
                                            'oral aversion':'oral_aversion'},
                               'feeding2':{'Nasogastric tube feeding in infancy':'Nasogastric_tube_feeding_in_infancy',
                                           'Gastrostomy tube feeding in infancy':'Gastrostomy_tube_feeding_in_infancy'},
                               'food_intolerance1':{'1':'Gluten intolerance'.replace(' ', '_'),
                                                    '2':'Lactose intolerance'.replace(' ', '_'),
                                                    '3':'Specific allergy'.replace(' ', '_')},
                               'apgar_10':{'11':'unknown'},
                               'apgar_1':{'11':'unknown'},
                               'apgar_5':{'11':'unknown'},
                               'thorax1':{'Pectus_carinatum_':'Pectus_carinatum'}
                               }
        self.altered_attributes = {'hospital':'hospitalisation', 'headsize':'Abnormality_of_skull_size',
                                   'craniosynostosis2':'craniosynostosis_operation', 'Ptosis1':'Ptosis_operation',
                                   'Tear_ducts':'Abnormality_of_lacrimal_duct', 'Oral_cleft':'Abnormality_of_mouth',
                                   'ribs':'Abnormality_of_the_ribs', 'thorax':'Abnormality_of_the_thorax',
                                   'nipples':'Supernumerary_nipple', 'wall_defect':'Abdominal_wall_defect',
                                   'curvature_spine':'Abn_curvature_vertebral_column', 'vertebrae':'Abnormal_vertebrae',
                                   'weight_birth':'weight_birth_gram', 'length_birth':'length_birth_cm',
                                   'head_birth':'head_birth_cm', 'height':'height_cm', 'weight':'weight_kg',
                                   'head':'head_cm', 'head1':'head1_cm', 'height1':'height1_cm', 'weight1':'weight1_kg',
                                   'head2':'head2_cm', 'height2':'height2_cm', 'weight2':'weight2_kg', 
                                   'head4':'head4_cm', 'height4':'height4_cm', 'weight4':'weight4_kg',
                                   'head6':'head6_cm', 'height6':'height6_cm', 'weight6':'weight6_kg',
                                   'head9':'head9_cm', 'height9':'height9_cm', 'weight9':'weight9_kg',
                                   'head12':'head12_cm', 'height12':'height12_cm', 'weight12':'weight12_kg',
                                   'head16':'head16_cm', 'height16':'height16_cm', 'weight16':'weight16_kg',
                                   'head_m':'head_m_cm', 'height_m':'height_m_cm', 'weight_m':'weight_m_kg',
                                   'head_f':'head_f_cm', 'height_f':'height_f_cm', 'weight_f':'weight_f_kg',
                                   'feeding1':'feeding_difficulties', 'Gastroesophageal_reflux1':'GERD_reflux_med_operation',
                                   'bowel':'abnormality_of_the_abdomen'
                                   }

    def alter_attributes(self):
        C6EmxFile.alter_attr_cells(self, self.altered_attributes, self.sheet)
        C6EmxFile.save_file_changes(self)

    def alter_values(self):
        C6EmxFile.alter_cells(self, self.altered_values, self.sheet)
        C6EmxFile.save_file_changes(self)
