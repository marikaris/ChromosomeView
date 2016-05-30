library(qtl)
#load data of different traits (files generated using CAT)
data_ob <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_ob.csv',  header=F)
data_ob <- calc.genoprob(data_ob)
data_ov <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_ov.csv',  header=F)
data_ov <- calc.genoprob(data_ov)
data_car <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_car.csv',  header=F)
data_car <- calc.genoprob(data_car)
data_brain <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_brain.csv',  header=F)
data_brain <- calc.genoprob(data_brain)
data_brain1 <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_brain_alt.csv',  header=F)
data_brain1 <- calc.genoprob(data_brain1)
data_loose <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_loose.csv',  header=F)
data_loose <- calc.genoprob(data_loose)
#do scan one for all traits
pheno.data_brain <- scanone(data_brain, chr=6, model = "binary")
pheno.data_brain_filtered <- scanone(data_brain1, chr=6, model = "binary")
pheno.data_cardiac <- scanone(data_car, chr=6, model = "binary")
pheno.data_overweight <- scanone(data_ov, chr=6, model = "binary")
pheno.data_obesity <- scanone(data_ob, chr=6, model = "binary")
pheno.data_loose_tissue <- scanone(data_loose, chr=6, model = "binary")
#Plot significant phenotypes together
plot(pheno.data_obesity, main ='Genotype-phenotype linkage on chromosome 6', 
     xlab='Position on chromsome 6 (basepairs)', col='red', ylab="Lod score")
plot(pheno.data_overweight, add=TRUE, col='darkorange', lty='dotted', lwd=3)
plot(pheno.data_loose_tissue, add=TRUE, col='deepskyblue')
plot(pheno.data_cardiac, add=TRUE, col='chartreuse')
#make a legend
legend(0, 10, c('heart anomalies', 'loose connective tissue', 'obesity', 'overweight'), 
    lty=c(1,1,1,3), lwd=c(3,3),col=c('chartreuse', 'deepskyblue', 'red', 'darkorange'), cex=0.7)
#function that can plot a gene, given the trait, ensembl id and color
plot.gene <-function(data.trait, ensembl.id, gene.name, color){
  #get the lodscore of the gene
  lod <- data.trait[which(rownames(data.trait)==ensembl.id),]$lod
  #get the position of the gene
  pos <- data.trait[which(rownames(data.trait)==ensembl.id),]$pos
  points(pos, lod, lwd=5, col=color)
  text(pos, lod+0.4, labels=c(gene.name), cex=0.9)
}
#plot sim1 for obesity and overweight and col12a1 for loose connective tissue disorder
plot.gene(pheno.data_loose_tissue, 'ENSG00000111799', 'COL12A1', 'deepskyblue')
plot.gene(pheno.data_overweight, 'ENSG00000112246', 'SIM1', 'darkorange')
plot.gene(pheno.data_obesity, 'ENSG00000112246', 'SIM1', 'red')
#calculate permutations to estimate thresholds using 1000 permutations
perms_hj <- scanone(data_loose, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_hj <- summary(perms_hj, alpha=0.01)[,1]
cutoff_lod_hj 
perms_ob <- scanone(data_ob, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_ob <- summary(perms_ob, alpha=0.01)[,1]
cutoff_lod_ob 
perms_ov <- scanone(data_ov, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_ov <- summary(perms_ov, alpha=0.01)[,1]
cutoff_lod_ov
perms_car <- scanone(data_car, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_car <- summary(perms_car, alpha=0.01)[,1]
cutoff_lod_car
perms_brain <- scanone(data_brain, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_brain <- summary(perms_brain, alpha=0.01)[,1]
cutoff_lod_brain
#patients with no brain image performed, are filtered out here
perms_brain_filtered<- scanone(data_brain1, chr=6, pheno.col=1, model='binary',  n.perm=1000)
#get the genes that have lodscores above the threshold
cutoff_lod_brain_filtered <- summary(perms_brain_filtered, alpha=0.01)[,1]
cutoff_lod_brain_filtered
selection_hj <- pheno.data_loose_tissue[which(pheno.data_loose_tissue$lod > cutoff_lod_hj),]
print(selection_hj[order(selection_hj$lod, decreasing=TRUE),])
selection_hj
data_loose$pheno
data_loose$lod
cutoff_lod_brain_filtered <- summary(perms_brain_filtered, alpha=0.01)[,1]
cutoff_lod_brain_filtered
selection_brain <- pheno.data_brain_filtered[which(pheno.data_brain_filtered$lod > cutoff_lod_brain_filtered),]
print(selection_brain[order(selection_brain$lod, decreasing=TRUE),])
#make a plot for brain anomalies with raw (all patients) and filtered (patients with no scan performed filtered out) data
plot(pheno.data_brain, main="QTL plot for brain anomalies with raw and filtered data", 
     xlab='Chromosome 6 position in basepairs', ylab='LOD Score', col='chartreuse', lwd=3)
plot(pheno.data_brain_filtered, add=TRUE, col='hotpink', lwd=3)
legend(0, 3, c('Raw data', 'Filtered data', 'Threshold raw data', 'Threshold filtered data'), 
       lty=c(1,1,3,3), lwd=c(3,3,3,3),col=c('chartreuse', 'hotpink', 'darkgreen', 'deeppink4'))
#calculate threshold with 10000 permutations
perms_brain <- scanone(data_brain, chr=6, pheno.col=1, model='binary',  n.perm=10000)
cutoff_lod_brain <- summary(perms_brain, alpha=0.01)[,1]
cutoff_lod_brain
#calculate threshold with 10000 permutations
perms_brain_filtered<- scanone(data_brain1, chr=6, pheno.col=1, model='binary',  n.perm=10000)
cutoff_lod_brain_filtered <- summary(perms_brain_filtered, alpha=0.01)[,1]
cutoff_lod_brain_filtered
#plot the thresholds in the plot 
abline(h=cutoff_lod_brain_filtered, col='deeppink4', lwd=3, lty=3)
abline(h=cutoff_lod_brain, col='darkgreen', lwd=3, lty=3)
#with raw data, no significant peaks can be found
