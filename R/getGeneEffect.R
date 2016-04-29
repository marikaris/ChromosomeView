library(qtl)
large_data <- read.cross("csvr", "/Users/mslofstra/.molgenis/rData", 'qtl_data.csv',  header=F)
gene <- cbind(data.frame(large_data$pheno[,1], large_data$geno$`6`$data[,which(colnames(large_data$geno$`6`$data)=='${geneId}')]))
gene.with.pheno = gene[,2][which(gene[,1]==1)]
print(length(which(gene.with.pheno==1)))
print(length(which(gene.with.pheno==2)))
print(length(which(gene.with.pheno==3)))
