library(qtl)
large_data <- read.cross("csvr", "/Users/mslofstra/.molgenis/rData", 'qtl_data.csv',  header=F)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=which(colnames(large_data$pheno)=="${symptom}"), model = "binary")
selection <- pheno.data_hj[which(pheno.data_hj$lod > ${threshold}),]
print(selection[order(selection$lod, decreasing=TRUE),])