library(qtl)
large_data <- read.cross("csvr", "https://rawgit.com/marikaris/6f494c2c7b7c017dccbc/raw/6a75a18aa513e616f158b4ce04dec9d3e9d47b6d/", 'test_data.csv',  header=TRUE)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=1, model = "binary")
perms_hj <- scanone(large_data, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_hj <- summary(perms_hj, alpha=0.01)[,1]
print(cutoff_lod_hj)
