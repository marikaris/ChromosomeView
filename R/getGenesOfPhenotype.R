library(qtl)
large_data <- read.cross("csvr", "/Users/mslofstra/.molgenis/rData", 'qtl_data.csv',  header=F)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, model = "binary")
selection <- pheno.data_hj[which(pheno.data_hj$lod > ${threshold}),]
sig_genes <- rownames(selection[order(selection$lod, decreasing=TRUE),])
genes <- cbind(data.frame(large_data$pheno[,1],large_data$geno$`6`$data[,which(colnames(large_data$geno$`6`$data) %in% sig_genes)]))
with.pheno = genes[which(genes[,1]==1),]
without.pheno = genes[which(genes[,1]==0),]
pheno.del <- data.frame(apply(with.pheno, 2, function(x){length(which(x == 1))}))
genes.names <- rownames(pheno.del)
pheno.norm <- data.frame(apply(with.pheno, 2, function(x){length(which(x == 2))}))
pheno.dup <- data.frame(apply(with.pheno, 2, function(x){length(which(x == 3))}))
npheno.del <- data.frame(apply(without.pheno, 2, function(x){length(which(x == 1))}))
npheno.norm <- data.frame(apply(without.pheno, 2, function(x){length(which(x == 2))}))
npheno.dup <- data.frame(apply(without.pheno, 2, function(x){length(which(x == 3))}))
patients.length <- length(pheno.del[,1])
counts <- data.frame(cbind(genes.names[2:patients.length], 
                           pheno.del[2:patients.length,1], 
                           pheno.norm[2:patients.length,1], 
                           pheno.dup[2:patients.length,1], 
                           npheno.del[2:patients.length,1], 
                           npheno.norm[2:patients.length,1], 
                           npheno.dup[2:patients.length,1]))
colnames.counts <- c('genes', 'pheno.del', 'pheno.norm', 'pheno.dup', 'norm.del', 'norm.norm', 'norm.dup')
colnames(counts) <- colnames.counts
rjson::toJSON(counts)