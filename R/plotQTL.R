library(RCurl)
library(qtl)
library(qtlcharts)

large_data <- read.cross("csvr", "/Users/mslofstra/.molgenis/rData", 'qtl_data.csv',  header=F)
large_data <- calc.genoprob(large_data)
pheno.data_hj <- scanone(large_data, chr=6, pheno.col=which(colnames(large_data$pheno)=="${symptom}"), model = "binary")
htmlPlot <- iplotScanone(pheno.data_hj, large_data)
htmlwidgets::saveWidget(htmlPlot, '${outputFile}', selfcontained=F)