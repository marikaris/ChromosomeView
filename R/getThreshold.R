library(qtl)
large_data <- read.cross("csvr", "/Users/mslofstra/.molgenis/rData", 'qtl_data.csv',  header=F)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=which(colnames(large_data$pheno)=="${symptom}"), model = "binary")
perms_hj <- scanone(large_data, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_hj <- summary(perms_hj, alpha=as.numeric("${alpha}"))[,1]
print(cutoff_lod_hj)
