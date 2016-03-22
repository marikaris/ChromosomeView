#install.packages('rjson')
#install.packages('RCurl')
library(RCurl)
library(qtl)
library(qtlcharts)

large_data <- read.cross("csvr", "https://rawgit.com/marikaris/6f494c2c7b7c017dccbc/raw/6a75a18aa513e616f158b4ce04dec9d3e9d47b6d/", 'test_data.csv',  header=TRUE)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=which(colnames(large_data$pheno)=="${symptom}"), model = "binary")
#plot(pheno.data_hj, main='Hypermobile joints', xlab='Map position (basepairs)')
htmlPlot <- iplotScanone(pheno.data_hj, large_data)
htmlwidgets::saveWidget(htmlPlot, '${outputFile}', selfcontained=F)

library(qtl)
large_data <- read.cross("csvr", "https://rawgit.com/marikaris/6f494c2c7b7c017dccbc/raw/6a75a18aa513e616f158b4ce04dec9d3e9d47b6d/", 'test_data.csv',  header=TRUE)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=which(colnames(large_data$pheno)=="${symptom}"), model = "binary")
perms_hj <- scanone(large_data, chr=6, pheno.col=1, model='binary',  n.perm=1000)
cutoff_lod_hj <- summary(perms_hj, alpha=as.numeric("${alpha}"))[,1]
print(cutoff_lod_hj)

library(qtl)
large_data <- read.cross("csvr", "https://rawgit.com/marikaris/6f494c2c7b7c017dccbc/raw/6a75a18aa513e616f158b4ce04dec9d3e9d47b6d/", 'test_data.csv',  header=TRUE)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=which(colnames(large_data$pheno)=="Umbilical_hernia"), model = "binary")
print(max(pheno.data_hj)$lod)

library(qtl)
large_data <- read.cross("csvr", "https://rawgit.com/marikaris/6f494c2c7b7c017dccbc/raw/6a75a18aa513e616f158b4ce04dec9d3e9d47b6d/", 'test_data.csv',  header=TRUE)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=which(colnames(large_data$pheno)=="${symptom}"), model = "binary")
selection <- pheno.data_hj[which(pheno.data_hj$lod > "${threshold}"),]
print(selection[order(selection$lod, decreasing=TRUE),])
