var genotypes = {};
var phenotypes = {};

function getMolgenisEntityData(url, callback, extraData){
	/**This function gets the entity data from molgenis*/
	$.get(url).done(function(data){
		var relevant = data['items'];
		callback(relevant, extraData);
	});
};

function scanPhenotypeData(symptom){
	/**This function calls the getsymptoms method of the phenotype view to get all patients with a symptom*/
	getSymptoms(symptom, processPhenotypes);
};

function scanGenotypeData(patients, gene_id){
	/**This function converts the array data of the patients to data readable by qtl*/
	$.each(patients, function(i, patient){
		phenotypes[patient.ownerUsername] = 0;
		if(patient.imbalance.id === 'x1'|| patient.imbalance.id === 'x0'){
			//If imbalance is a deletion, add to the A allele
			genotypes[gene_id]['A'].push(patient['ownerUsername']);
		}else if(patient.imbalance.id === 'x3' || patient.imbalance.id === 'x4'){
			//If imbalance is a duplication, add to the B allele
			genotypes[gene_id]['B'].push(patient['ownerUsername']);
		};
	});
};

function processGeneData(){
	/**This function processes the gene data in the molgenis genes table*/
	getMolgenisEntityData('/api/v2/genes?attrs=ensembl_id,start,stop&q=gene_info=notlike=pseudogene;gene_type!=pseudogene;gene_type=notlike=pseudogene&num=4000', 
	function(genes){
		$.each(genes, function(i, gene){
			genotypes[gene.ensembl_id] = {'A':[], 'B':[], 'position':mean([gene.start, gene.stop])};
			getMolgenisEntityData('/api/v2/chromosome6_array?attrs=array_id,ownerUsername,imbalance&q=Start_positie_in_Hg19=le='+
									gene.stop+';Stop_positie_in_Hg19=ge='+gene.start+'&num=4000', 
									scanGenotypeData, gene.ensembl_id);
		});
	});
};

function mean(coordinateList){
	/**This function calculates the mean of a start and stop location*/
	var start = coordinateList[0];
	var stop = coordinateList[1];
 	return (start+stop)/2;
};

function fillSearchBar(div){
	/**This function fills the search bar of the qtl view*/
	getPhenotypes('/api/v2/chromosome6_a_c', div);
   	getPhenotypes('/api/v2/chromome6_d_h', div);
    getPhenotypes('/api/v2/chromome6_i_l', div);
};

function processPhenotypes(symptoms, patients, extra){
	/**This function processes the phenotype of each patient (having the symptom is 1)*/
	$.each(patients, function(i, patient){
		var name = patient.patient_id;
		phenotypes[name] = 1;
		if(i === patients.length-1){
			var position = symptoms.length-1;
			createQtlFile(symptoms[position]);
		}
	});
};

function createQtlFile(symptom){
	/**This function creates the file which can be used in QTL analysis*/
	var patients = Object.keys(phenotypes);
	var fileContent = 'phenogeno,chromosome,position,'+patients.join()+'\n'+symptom+',,,';
	$.each(patients, function(i, patient){
		if(i < patients.length-1){
			fileContent+=phenotypes[patient]+',';
		//if the last patient is reached, put end of line in file for phenotypes and start on markers (genotype)	
		}else if(i === patients.length-1){
			fileContent+=phenotypes[patient]+'\n';
			var genes = Object.keys(genotypes);
			$.each(genes, function(i_gene, gene){
				//deletion is allele A of a gene, duplication allele B
				var del = genotypes[gene].A;
				var dup = genotypes[gene].B;
				var position = genotypes[gene].position;
				//add genename and chromosome number to the row
				fileContent += gene+',6,'+position+','
				$.each(patients, function(i_patient, patient){
					//if patients has deletion of the marker (gene), add allele A to the row for this marker
					if($.inArray(patient, del) > -1){
						fileContent+='A';
					//if patients has duplication of the marker (gene), add allele B to the row for this marker
					}else if($.inArray(patient, dup) > -1){
						fileContent += 'B';
					//if marker is not affected, at H of heterozygous to the file
					}else{
						fileContent += 'H';
					};
					//if all genes and patients are processed, make the file 
					if(i_gene === genes.length -1 && i_patient === patients.length -1){
						var url = writeFile(fileContent, symptom);
					//if not all patients are finished, put comma between this and the next patient
					}else if(i_patient < patients.length-1){
						fileContent += ',';
					}else{
					//if last patient is reached, put end of line and start on next marker
						fileContent += '\n';
					};
				});	
			});
		};
	});
};

function writeFile(content, symptom){
	/**This function writes the file that can be used for qtl analysis by R/qtl*/
	//make the file with the previous information empty
	$.get('/scripts/emptyQtlCsvFile/run');
	//remove end of lines, in the csv they will be %5Cn
	content = content.split('\n');
	content = content.slice(1, content.length);
	total = content.length;
	//get the maximum length of an uri (2000 minus the length of the first part of the url)
	var max_uri_length = 2000 - (location.protocol.length+'//'.length+location.host.length+'/scripts/updateQtlCsvFile/run?fileContent='.length)
	//get the length of a row
	var rowlength = content[2].length + '%5Cn'.length;
	var piece = Math.floor(max_uri_length/rowlength);
	//recursive function that fills the file with content
	function fillFile(i){
		//if the function is called for the first time, then just append the line to the file and call the function again
		if(i === 0){
			var filepart = content.slice(i, i+piece).join('%5Cn');
			$.get('/scripts/updateQtlCsvFile/run?fileContent='+filepart+'%5Cn').done(function(){
				i += piece;
				fillFile(i);
			});
		}else if(i < content.length){
			var filepart = content.slice(i, i+piece).join('%5Cn');
			$.get('/scripts/updateQtlCsvFile/run?fileContent='+filepart+'%5Cn').done(function(){
				i += piece;
				//if function is running for the last time, start plotting
				if(i >= content.length){
					$.getScript('/js/js-chr6/visualisation/plotQtl.js').done(function(){
						appendToMolgenisHead();
						$('#significantLod').show();
						$('#target_chr6_plot').show();
						plotQtl('#qtlplot', symptom);
						$('#calculatedThreshold').text('');
						$('#geneInfoQtl').html('');
						$('#calcSigLod').unbind().click(function(){
							$('#geneInfoQtl').html('');
							alpha = $('#alpha-value').val();
							if(alpha>0 && alpha <=1){
								$('#alpha-error').hide();
								calculateThreshold(alpha, '#calculatedThreshold', symptom, '#geneInfoQtl');
							}else{
								$('#alpha-error').show();
							};
						});
					});
				};
				fillFile(i);
			});	
		};
	};
	fillFile(0);
};

function splitValue(value, index) {
	/**This function splits a value on a given index*/
    return value.substring(0, index) + "," + value.substring(index);
}
