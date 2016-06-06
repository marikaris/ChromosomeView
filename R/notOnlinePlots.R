library(qtl)
#these files were generated for each phenotype, using the Chromosome 6 Project data 
#obesity data
data_ob <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_ob.csv',  header=F)
data_ob <- calc.genoprob(data_ob)
#overweight data
data_ov <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_ov.csv',  header=F)
data_ov <- calc.genoprob(data_ov)
#cardiac anomaly data
data_car <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_car.csv',  header=F)
data_car <- calc.genoprob(data_car)
#brain anomaly data (unfiltered)
data_brain <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_brain.csv',  header=F)
data_brain <- calc.genoprob(data_brain)
#brain anomaly data with patients with no brain image performed filtered out
data_brain1 <- read.cross("csvr", "/Users/mslofstra/Documents/afstuderen", 'qtl_brain_alt.csv',  header=F)
data_brain1 <- calc.genoprob(data_brain1)
#data for connective tissue disorder/loose connective tissue
data_loose <- read.cross("csvr", "/Users/
#performing scan one
mslofstra/Documents/afstuderen", 'qtl_loose.csv',  header=F)
data_loose <- calc.genoprob(data_loose)
pheno.data_brain <- scanone(data_brain, chr=6, model = "binary")
pheno.data_brain_filtered <- scanone(data_brain1, chr=6, model = "binary")
pheno.data_cardiac <- scanone(data_car, chr=6, model = "binary")
pheno.data_overweight <- scanone(data_ov, chr=6, model = "binary")
pheno.data_obesity <- scanone(data_ob, chr=6, model = "binary")
pheno.data_loose_tissue <- scanone(data_loose, chr=6, model = "binary")
#Plot significant phenotypes together
plot(pheno.data_obesity, main ='Genotype-phenotype linkage on chromosome 6',
     xlab='Position on chromsome 6 (basepairs)', ylab="Lod score", col="red")
plot(pheno.data_overweight, add=TRUE, col='darkorange', lty='dotted', lwd=3)
plot(pheno.data_loose_tissue, add=TRUE, col='deepskyblue')
plot(pheno.data_cardiac, add=TRUE, col='chartreuse')
#make a legend
legend(70000000, 10, c('Heart anomalies', 'Connective tissue disorder', 'Obesity', 'Overweight'), 
       lty=c(1,1,1,3), lwd=c(3,3),col=c('chartreuse', 'deepskyblue', 'red', 'darkorange'), cex=1.5)
#
#make plot for smaller region with significant genes marked
plot(pheno.data_obesity, main ='Genotype-phenotype linkage on chromosome 6 (region 70MB-110MB)',
     xlab='Position on chromsome 6 (basepairs)', ylab="Lod score", xlim=c(70000000, 110000000), type="n")
plot.significantMarkers <- function(pheno.data, color, threshold){
  pheno.data$colour = 'grey'
  pheno.data$colour[as.numeric(pheno.data$lod) > threshold] = color
  plot(pheno.data, add=TRUE, col='grey', lwd=2)
  points(pheno.data$pos, pheno.data$lod, col=pheno.data$colour, lwd=2)
}
plot.significantMarkers(pheno.data_obesity, 'tomato', 3.5)
plot.significantMarkers(pheno.data_overweight, 'pink', 3.4)
plot.significantMarkers(pheno.data_loose_tissue, 'deepskyblue', 3.4)
plot.significantMarkers(pheno.data_cardiac, 'chartreuse', 3.1)

#plot genes in the plot
plot.gene <-function(data.trait, ensembl.id, gene.name, color){
  lod <- data.trait[which(rownames(data.trait)==ensembl.id),]$lod
  pos <- data.trait[which(rownames(data.trait)==ensembl.id),]$pos
  points(pos, lod, lwd=5, col=color, pch=19)
  text(pos+2300000, lod, labels=c(gene.name), cex=1.2)
}
plot.gene(pheno.data_loose_tissue, 'ENSG00000111799', 'COL12A1', 'blue')
plot.gene(pheno.data_overweight, 'ENSG00000112246', 'SIM1', 'hotpink')
plot.gene(pheno.data_obesity, 'ENSG00000112246', 'SIM1', 'darkred')
plot.gene(pheno.data_obesity, 'ENSG00000186231', 'KLHL32', 'darkred')
plot.gene(pheno.data_overweight, 'ENSG00000186231', 'KLHL32', 'hotpink')
plot.gene(pheno.data_obesity, 'ENSG00000152034', 'MCHR2', 'darkred')
plot.gene(pheno.data_overweight, 'ENSG00000152034', 'MCHR2', 'hotpink')
plot.gene(pheno.data_obesity, 'ENSG00000184486', 'POU3F2', 'darkred')
plot.gene(pheno.data_overweight, 'ENSG00000184486', 'POU3F2', 'hotpink')
#make a legend for this plot
legend(70000000, 10, c('Obesity - significantly linked - non candidate gene', 
                       'Overweight - significantly linked - non candidate gene',
                       'Connective tissue disorder - significantly linked - non candidate gene', 
                       'Heart anomalies - significantly linked - non candidate gene',
                       'Obesity - significantly linked - candidate gene',
                       'Overweight - significantly linked - candidate gene',
                       'Loose connective tissue - significantly linked - candidate gene',
                       'Not significantly linked'
                       ), 
       col=c('tomato', 'pink', 'deepskyblue', 'chartreuse', 'darkred', 'hotpink', 'blue', 'grey'), 
       pch=c(1,1,1,1,19, 19, 19, 1))
#
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
perms_brain_filtered<- scanone(data_brain1, chr=6, pheno.col=1, model='binary',  n.perm=1000)
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
htmlPlot <- iplotScanone(pheno.data_brain_filtered, data_brain1)
htmlwidgets::saveWidget(htmlPlot, 'brain.html', selfcontained=T)
plot(pheno.data_brain, main="QTL plot for brain anomalies with raw and filtered data", 
     xlab='Chromosome 6 position in basepairs', ylab='LOD Score', col='chartreuse', lwd=3)
plot(pheno.data_brain_filtered, add=TRUE, col='hotpink', lwd=3)
legend(0, 3, c('Raw data', 'Filtered data', 'Threshold raw data', 'Threshold filtered data'), 
       lty=c(1,1,3,3), lwd=c(3,3,3,3),col=c('chartreuse', 'hotpink', 'darkgreen', 'deeppink4'))
perms_brain <- scanone(data_brain, chr=6, pheno.col=1, model='binary',  n.perm=10000)
cutoff_lod_brain <- summary(perms_brain, alpha=0.01)[,1]
cutoff_lod_brain
perms_brain_filtered<- scanone(data_brain1, chr=6, pheno.col=1, model='binary',  n.perm=10000)
cutoff_lod_brain_filtered <- summary(perms_brain_filtered, alpha=0.01)[,1]
cutoff_lod_brain_filtered
abline(h=cutoff_lod_brain_filtered, col='deeppink4', lwd=3, lty=3)
abline(h=cutoff_lod_brain, col='darkgreen', lwd=3, lty=3)
abline(h=3.4, col='deepskyblue', lwd=3, lty=3)
abline(h=3.5, col='red', lwd=3, lty=3)
abline(h=, col='deeppink4', lwd=3, lty=3)

get_significant_positions <- function(data, lod){
    pheno.data <- scanone(data, model = "binary")
    selection <- pheno.data[which(pheno.data$lod > lod),]
    startpos <- min(selection[order(selection$lod, decreasing=TRUE),]$pos)
    stoppos <- max(selection[order(selection$lod, decreasing=TRUE),]$pos)
    print(paste(startpos, stoppos, sep='-'))
}
get_significant_positions(data_ob, 3.5)
get_significant_positions(data_ov, 3.4)
get_significant_positions(data_car, 3.1)
get_significant_positions(data_loose, 3.5)
#make geno image
geno.image(data_ob)
#Enable drawing ouside plot
par(xpd=TRUE)
legend(0, -1, c('Deletion', 'Duplication', 'Not affected'), 
       fill=c('#E12527', '#51AD4F', '#3B7FB6'))
par(xpd=FALSE)

