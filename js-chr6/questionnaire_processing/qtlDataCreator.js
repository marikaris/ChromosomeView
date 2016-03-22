var genotypes = {};
var phenotypes = {};

function getMolgenisEntityData(url, callback, extraData){
	$.get(url).done(function(data){
		var relevant = data['items'];
		callback(relevant, extraData);
	});
};

function scanPhenotypeData(symptom){
	getSymptoms(symptom, processPhenotypes);
};

function scanGenotypeData(patients, gene_id){
	$.each(patients, function(i, patient){
		phenotypes[patient.ownerUsername] = 0;
		if(patient.imbalance.id === 'x1'|| patient.imbalance.id === 'x0'){
			genotypes[gene_id]['A'].push(patient['ownerUsername']);
		}else if(patient.imbalance.id === 'x3' || patient.imbalance.id === 'x4'){
			genotypes[gene_id]['B'].push(patient['ownerUsername']);
		};
	});
};

function processGeneData(){
	getMolgenisEntityData('/api/v2/genes?attrs=ensembl_id,start,stop&q=gene_info=notlike=pseudogene;gene_type!=pseudogene;gene_type=notlike=pseudogene&num=4000', 
	function(genes){
		$.each(genes, function(i, gene){
			genotypes[gene.ensembl_id] = {'A':[], 'B':[], 'position':mean([gene.start, gene.stop])};
			getMolgenisEntityData('/api/v2/chromosome6_array?attrs=ownerUsername,imbalance&q=Start_positie_in_Hg19=le='+
									gene.stop+';Stop_positie_in_Hg19=ge='+gene.start+'&num=4000', 
									scanGenotypeData, gene.ensembl_id);
		});
	});
};

function mean(coordinateList){
	var start = coordinateList[0];
	var stop = coordinateList[1];
 	return (start+stop)/2;
};

function fillSearchBar(div){
	getPhenotypes('/api/v2/chromosome6_a_c', div);
   	getPhenotypes('/api/v2/chromome6_d_h', div);
    getPhenotypes('/api/v2/chromome6_i_l', div);
};

function processPhenotypes(symptoms, patients, extra){
	$.each(patients, function(i, patient){
		var name = patient.patient_id;
		phenotypes[name] = 1;
		if(i === patients.length-1){
			createQtlFile(symptoms[0]);
		}
	});
};

function createQtlFile(symptom){
	var patients = Object.keys(phenotypes);
	var fileContent = 'phenogeno,chromosome,position,'+patients.join()+'\n'+symptom+',,,';
	$.each(patients, function(i, patient){
		if(i < patients.length-1){
			fileContent+=phenotypes[patient]+',';
		}else if(i === patients.length-1){
			fileContent+=phenotypes[patient]+'\n';
			var genes = Object.keys(genotypes);
			$.each(genes, function(i_gene, gene){
				var del = genotypes[gene].A;
				var dup = genotypes[gene].B;
				var position = genotypes[gene].position;
				fileContent += gene+',6,'+position+','
				$.each(patients, function(i_patient, patient){
					if($.inArray(patient, del) > -1){
						fileContent+='A';
					}else if($.inArray(patient, dup) > -1){
						fileContent += 'B';
					}else{
						fileContent += 'H';
					};
					if(i_gene === genes.length -1 && i_patient === patients.length -1){
						var url = writeFile(fileContent);
					}else if(i_patient < patients.length-1){
						fileContent += ',';
					}else{
						fileContent += '\n';
					};
				});	
			});
		};
	});
};

function writeFile(content){
	$.get('/scripts/emptyQtlCsvFile/run');
	content = content.split('\n');
	console.log(content.slice(0, 20).join('%5Cn'));
	total = content.length;
	var piece = 20;
	function fillFile(i){
		if(i < content.length+piece){
			console.log(i);
			var filepart = content.slice(i, i+20).join('%5Cn');
			$.get('/scripts/updateQtlCsvFile/run?fileContent='+filepart+'%5Cn').done(function(){
				i += 20;
				fillFile(i);
			});	
		};
	};
	fillFile(0);
};

function splitValue(value, index) {
    return value.substring(0, index) + "," + value.substring(index);
}
