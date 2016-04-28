library(qtl)
large_data <- read.cross("csvr", "/Users/mslofstra/.molgenis/rData", 'qtl_data.csv',  header=F)
gene <- large_data$geno$`6`$data[,which(colnames(large_data$geno$`6`$data)=='${geneId}')]
print(length(which(gene==1)))
print(length(which(gene==2)))
print(length(which(gene==3)))