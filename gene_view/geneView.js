//the name of the last gene will be saved, to check on later
var lastGene;
/*genePatients and patientGenes are saved to make selection of certain genes or patients faster, 
it does not take very much time while loading, but reloading it, would take a lot of time.*/
//all patients per gene
var genePatients = {};
//all genes per patient
var patientGenes={};
//This variable is used as counter, when done = 3, the script is done
var done = 0;
//phenotypes are the phenotypes which are counted
var phenotypes = {};
//phenoList is the sorted array with the objects from phenotypes, with the count put in them, sorted on the count
var phenoList = [];
//the last patients will be saved, to check on later
var lastPatient;
//all patients with a deletion and duplication will be saved separately (to select these patients when requested)
var patientsDeletion = [];
var patientsDuplication = [];
//the global variable that will be filled with the genes, selected by the user
var selectedGenes = [];
function processSelectedGenes(checkedGenes){
/**This function processes the selected genes, the input is the list of selected genes from the select bar.*/
	//save the list in the global variable "selectedGenes"
	selectedGenes = checkedGenes;
	//empty the phenotypes for a new selection
	phenotypes={};
	lastPatient = undefined;
	lastGene = undefined;
	phenoList =[];
	//saved to make altering the table when selecting only one gene possible. 
	var selectionLength = selectedGenes.length;	
	lastGene = selectedGenes[selectionLength-1]['id'];
    $.each(selectedGenes, function(i, sel){
        var ensembl = sel.id;
        var gene_name = sel.text;
        putInDropdown('#phenotype-optionList', 'Patients with gene: '+gene_name, ensembl);
    	loadEnsemblInfoOfGene(ensembl, '#gene_info');
        $.getScript('https://rawgit.com/marikaris/845fe9c278035feb64df'+
					'/raw/4666a221c6b40ec3043e5d5f9d46b5cccd046821/processQuestionnaireData_v2.js').done(function(){
        	loadPatientsWithGene(ensembl, '#patient_deletion', '#patient_duplication');
        });
    });
};
function loadEnsemblInfoOfGene(geneId, resultDiv){
	/**This function loads the infmation of a gene from ensembl*/
	$.get('http://rest.ensembl.org/lookup/id/'+geneId+'?content-type=application/json').done(
        function(geneInfo){
        var name = geneInfo['display_name'];
    	var description = geneInfo['description'];
        if(description===undefined){
            description ='';
        }else{
        	description+='<br/>'
        }
        var type = geneInfo['biotype'];
        var start = geneInfo['start'];
        var end = geneInfo['end'];
        $(resultDiv).append('<h4>'+name+'</h4>');
        $(resultDiv).append('<p>Ensembl: <a href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g='+geneId+'" target="_blank">'+geneId+'</a><br/>');
        $(resultDiv).append('<p>Genetype: '+type+'<br/>');
        $(resultDiv).append('<p>Position: '+start+'...'+end+'<br/><br/>');
        $(resultDiv).append(description+'<br/></p>');
    });
}
function getGeneRegion(geneId, callbackFunction){
	//this function extracts the start and stop location of a gene, given the api id of the gene
	$.get('/api/v2/genes/'+geneId).done(function(gene){
		var region = [gene['start'], gene['stop']];
		callbackFunction(region);
	});
}
function loadPatientsWithGene(geneId, delDiv, dupDiv){
	//this function loads per gene the patients that have the region of the gene affected. 
	genePatients[geneId] = [];
	getGeneRegion(geneId, function(region){
		var start = region[0];
		var stop=region[1];
		getPatientsInRegion(start, stop, geneId, putPhenotypesInTable, '#genePhenoTable', '#genes_per_patient');
	});	
};
function getPatientsInRegion(start, stop, geneId, sortCallback, tableDiv, geneTable){	
	$.get('/api/v2/chromosome6_array?attrs=ownerUsername,imbalance&q=Start_positie_in_Hg19=le='+
		stop+';Stop_positie_in_Hg19=ge='+start+'&num=4000').done(function(patients_with_broken_gene){
		var patients = patients_with_broken_gene['items'];
		if(patients.length !== 0){
			var patientsLength = patients.length;
			lastPatient = patients[patientsLength-1]['ownerUsername'];
			$.each(patients, function(i, patient){
				var name = patient['ownerUsername'];
				var mutation = patient['imbalance']['id'];
				if(mutation === 'x0'|| mutation === 'x1'){
					if($.inArray(name, patientsDeletion)===-1){
						patientsDeletion.push(name);
					};
				}else if(mutation === 'x3' || mutation === 'x4'){
					if($.inArray(name, patientsDuplication)===-1){
						patientsDuplication.push(name);
					};
				};
				if(geneId !== ''){
					genePatients[geneId].push(name);
					if($.inArray(name, Object.keys(patientGenes))===-1){
						patientGenes[name] = [geneId];
					}else{
						patientGenes[name].push(geneId);
					};
				};
				$.get('/api/v2/chromosome6_a_c?attrs=id,ownerUsername&q=ownerUsername=='+name).done(function(patient){
					var ac_id = patient['items'][0]['id'];
					var ac_name = patient['items'][0]['ownerUsername'];
					getQuestionnairePartInfoOfPatient('chromosome6_a_c', ac_name, ac_id, geneId, tableDiv, sortCallback, geneTable);
				});
				$.get('/api/v2/chromome6_d_h?attrs=id,ownerUsername&q=ownerUsername=='+name).done(function(patient){
					var dh_id = patient['items'][0]['id'];
					var dh_name =  patient['items'][0]['ownerUsername'];
					getQuestionnairePartInfoOfPatient('chromome6_d_h', dh_name, dh_id, geneId, tableDiv, sortCallback, geneTable);
				});
				$.get('/api/v2/chromome6_i_L?attrs=id,ownerUsername&q=ownerUsername=='+name).done(function(patient){
					var il_id = patient['items'][0]['id'];
					var il_name =  patient['items'][0]['ownerUsername'];
					getQuestionnairePartInfoOfPatient('chromome6_i_L', il_name, il_id, geneId, tableDiv, sortCallback, geneTable);				
				});
			});
		}else{
			if(geneId === lastGene){
				sortPhenotypes(function(){sortCallback(tableDiv, phenoList)});
				putGenesPerPatientInTable(geneTable, selectedGenes);
			}
		};
	});
};
function getQuestionnairePartInfoOfPatient(part, name, id, geneId, phenoTable, sortCallback, geneTable){
	getChrAnswerData(id, part, processPatientsAnswer, function(){
		if(lastGene === geneId && lastPatient === name){
			done+=1;
			if(done ===3){
				if(geneTable!== undefined){
					putGenesPerPatientInTable(geneTable, selectedGenes);
				}
				sortPhenotypes(function(){sortCallback(phenoTable, phenoList)});
			}
		}else if(geneTable === undefined && lastPatient === name){
			done+=1;
			if(done ===3){
				sortPhenotypes(function(){sortCallback(phenoTable, phenoList)});
			}
		}
	});
};
function processPatientsAnswer(question, answer, notNeeded, name){
	if(question !== 'gender'&&question!=='birthdate'&&typeof answer !== 'number'&&/\d{4}-\d{2}-\d{2}/.test(answer)===false){
		if(question+':'+answer in phenotypes){
			if($.inArray(name, phenotypes[question+':'+answer])== -1){
				phenotypes[question+':'+answer].push(name);
			}
		}else{
			phenotypes[question+':'+answer]=[name];
		}
	}
};
function sortPhenotypes(callback){
	//first make a list with object sorted on length of patient list
	$.each(phenotypes, function(phenotype, patients){
		phenoObj = {};
		phenoObj['phenotype']=phenotype;
		phenoObj['patients']=patients;
		phenoObj['numberOfPatients']=patients.length;
		phenoList.push(phenoObj);
		//then sort list
		if(Object.keys(phenotypes).length===phenoList.length){
			phenoList = sortPhenoList(phenoList);
			callback();
		};
	});
};
function sortPhenoList(phenotypeList){
	phenotypeList.sort(function(pheno1, pheno2){
		return molgenis.naturalSort(pheno2.numberOfPatients, pheno1.numberOfPatients);
	});
	return phenotypeList;
};
function putPhenotypesInTable(tableDiv, phenoInfo){
	$(tableDiv).html('<table id = "genePheno" class="table table-hover"></table>');
	$('#genePheno').append('<tr><th>Phenotype</th><th># Patients</th><th>Patients</th></tr>');
	$.each(phenoInfo, function(i, phenotype){
		$('#genePheno').append('<tr><td>'+phenotype['phenotype']+'</td><td>'+
			phenotype['numberOfPatients']+'</td><td>'+phenotype['patients'].toString()+'</td></tr>');
	});
};
function putInDropdown(divOfDropdown, whatToPutIn, id){
	$(divOfDropdown).append('<li><a href="#" class="selection phenoOption" id="'+id+'">'+whatToPutIn+'</li>');
};
function selectDropDownOption(title, option){
	//get text of clicked option
	// for genes: get information that is asked for and put in table (using genePatients);
	// for dup/del: use patientsDuplication and patientsDeletion
	var txt = option.text();
	var phenotypes;
	switch(txt){
		case 'All patients':
			phenotypes = phenoList;
			break;
		case 'Patients with deletion':
			phenotypes = extractPatients(patientsDeletion);
			break;
		case 'Patients with duplication':
			phenotypes = extractPatients(patientsDuplication);
			break;
		default:
			var id= option.attr('id');
			var geneList = genePatients[id];
			phenotypes = extractPatients(geneList);
	}
	$(title).text(txt);
	putPhenotypesInTable('#genePhenoTable', phenotypes);
};
function extractPatients(specList){
	var newPhenoList = [];
	$.each(phenoList, function(index, phenoObj){
		patients = phenoObj['patients'];
		var patientsWithPheno = [];
		$.each(specList, function(index, patient){
			if($.inArray(patient, patients)){
				patientsWithPheno.push(patient);
			}
		});
		if(patientsWithPheno.length !== 0){
			var newPhenoObj = {};
			newPhenoObj['phenotype']=phenoObj['phenotype'];
			newPhenoObj['patients']=patientsWithPheno;
			newPhenoObj['numberOfPatients']=patientsWithPheno.length;
			newPhenoList.push(newPhenoObj);
		}
	});
	var phenotypesWithSpec= sortPhenoList(newPhenoList);
	return phenotypesWithSpec;
};
function putGenesPerPatientInTable(geneResultsTableDiv, selectedGenes){
	$(geneResultsTableDiv).html('<table class="table table-hover"><thead><tr id="geneResultsHead"><th>Patient</th></tr></thead><tbody id="geneResultsBody"></tbody></table>');
	$.each(selectedGenes, function(index, gene){
		$('#geneResultsHead').append('<th id="'+gene.id+'">'+gene.text+'</th>');
	});
	$.each(patientGenes, function(patient, genes){
		var row = '<tr><td>'+patient+'</td>';
		$.each(selectedGenes, function(index, selectedGene){
			var found = false;
			$.each(genes, function(index, gene){
				if(selectedGene.id === gene){
					found = true; 
				}
			});
			if(found){
				row = row +'<td class="'+selectedGene.id+'"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
			}else{
				row = row +'<td class="'+selectedGene.id+'"></td>';
			}
		});
		row = row +'</tr>';
		$('#geneResultsBody').append(row);
	});
};