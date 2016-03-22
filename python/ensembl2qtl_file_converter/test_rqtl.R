#install.packages("qtl")
#install.packages("qtlcharts")
#install.packages("data.table")
library(qtl)
library(qtlcharts)
setwd('/Users/mslofstra/PycharmProjects/ensembl2qtl_file_converter')
large_data <- read.cross("csvr", "https://rawgit.com/marikaris/6f494c2c7b7c017dccbc/raw/6a75a18aa513e616f158b4ce04dec9d3e9d47b6d/", 'test_data.csv',  header=TRUE)
#Plot data
plot(large_data)
#put rf information in object
large_data <- est.rf(large_data)
#make rf plot
plotRF(large_data)
#calculate errorlot
calc.errorlod(large_data)
#plot the genotype
plotGeno(large_data, chr=6)
#plot the information
plotInfo(large_data)
#show an image of the genotypes
geno.image(large_data)
#calculate the genotype probability
large_data <- calc.genoprob(large_data)
#
#do scanone for the hypermobile joints phenotype
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=1, model = "binary")
#plot the results
plot(pheno.data_hj, main='Hypermobile joints', xlab='Map position (basepairs)')
#
#do scanone on the microcephaly phenotype
pheno.data_mi <- scanone(large_data, chr=6, pheno.col=2, model = "binary")
#plot the data
plot(pheno.data_mi, main ='Microcephaly', xlab='Map position (basepairs)')
#
#do scanone on the macrocephaly phenotype
pheno.data_ma <- scanone(large_data, chr=6, pheno.col=3, model = "binary")
#plot the data
plot(pheno.data_ma, main ='Macrocephaly', xlab='Map position (basepairs)')
#
#Plot microcephaly and macrocephaly together
plot(pheno.data_ma, main ='Macrocephaly/Microcephaly', xlab='Map position (basepairs)', col='grey')
plot(pheno.data_mi, add=TRUE, col='red')
#make a legend
legend(1.3e+08, 3, c('Microcephaly', 'Macrocephaly'), lty=c(1,1), lwd=c(3,3),col=c('grey','red'))
#
#do scanone on the umbilical hernia phenotype
pheno.data_uh <- scanone(large_data, chr=6, pheno.col=4, model = "binary")
#plot the results
plot(pheno.data_uh, main='Umbilical hernia', xlab='Map position (basepairs)')
#
#calculate the threshold lodscore for hypermobile joints
perms_hj <- scanone(large_data, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_hj <- summary(perms_hj, alpha=0.01)[,1]
cutoff_lod_hj
#
#calculate the threshold lodscore for microcephaly
perms_microcephaly <- scanone(large_data, chr=6, pheno.col=2, model= 'binary',  n.perm=1000)
cutoff_micro <- summary(perms_microcephaly, alpha=0.05)[,1]
#
#calculate the threshold lodscore for macrocephaly
perms_macrocephaly <- scanone(large_data, chr=6, pheno.col=3, model='binary',  n.perm=1000)
cutoff_macro <- summary(perms_macrocephaly, alpha=0.05)[,1]
#
#calculate the threshold lodscore for umbilical hernia
perms_uh <- scanone(large_data, chr=6, pheno.col=4, model='binary',  n.perm=1000)
cutoff_uh <- summary(perms_uh, alpha=0.01)[,1]
#
#hypermobile joints significant table
significant_selection_hj <- pheno.data_hj[which(pheno.data_hj$lod > cutoff_lod_hj),]
significant_selection_hj[order(significant_selection_hj$lod, decreasing=TRUE),]
#
#microcephaly significant table
sig_sel_microcephaly <- pheno.data_mi[which(pheno.data_mi$lod > cutoff_micro),]
sig_sel_microcephaly[order(sig_sel_microcephaly$lod, decreasing=TRUE),]
#
#macrocephaly significant table
sig_sel_macrocephaly <- pheno.data_ma[which(pheno.data_ma$lod > cutoff_macro),]
sig_sel_macrocephaly[order(sig_sel_macrocephaly$lod, decreasing=TRUE),]
#
#umbilical hernia significant table
sig_sel_uh <- pheno.data_uh[which(pheno.data_uh$lod > cutoff_uh),]
sig_sel_uh[order(sig_sel_uh$lod, decreasing=TRUE),]
large_data <- calc.genoprob(large_data)
#scan2_data <- scantwo(large_data, pheno.col = 2)
#plot(scan2_data)

plotFile = 'qtlPlot.html'
htmlPlot <- iplotScanone(pheno.data_hj, large_data)
htmlPlot
htmlwidgets::saveWidget(htmlPlot, file=plotFile)
#??htmlwidget
