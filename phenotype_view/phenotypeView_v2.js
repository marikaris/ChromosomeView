//this array will be filled with all genes that are in the affected region of the patients
var geneArray = [];
//this array contains the selection of the patients that should be shown
var checkedPatients = [];
function plotBarsOfPatients(patients, figure_div, chr6size, selected_patient){
/**plotBarsOfPatients plots the chromosome bars of the patients
* The algorithm of the function:
* deletion = [];
* duplication = [];
* for each patient:
*	if isDup:
*		duplication.append(patient)
*	else:
*		deletion.append(patient)
* deletion.sort
* duplication.sort
* deletion.plot
* duplication.plot	
*/
	//Add everything that is needed for the bars to be made to the div where the bars should be in.
	$(figure_div).html('<div id="legendPhenotype"></div>'+
							'<div id="chart">'+
								'<div id="chromosome">'+
									'<div id="draggablePheno1" class="ui-widget-content text-center draggableItem">'+
                						'<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>'+
    	        					'</div>'+
	            					'<div id="draggablePheno2" class="ui-widget-content text-center draggableItem">'+
    	            					'<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>'+
        	    					'</div>'+
                				'</div>'+  
                				'<div id="regionText">'+
									'<b>Selected region: <br/></b>'+
									'<span id="selected-start">0</span>'+
									'<span>...</span>'+
									'<span id="selected-stop">0</span>'+
								'</div><br/>'+	
								'<div class="btn-group btn-group-xs" role="group">'+
									'<button id="searchPhenoRegion" class="btn btn-default">Only show patients in this region</button>'+
									'<button id="hideDel" class="btn btn-default">Hide deletions</button>'+
									'<button id="hideDup" class="btn btn-default">Hide duplications</button>'+
								'</div>'+	              					
                				'<div id="deletion"></div><div id="duplication"></div>'+
                			'</div>');
	/* The deletions and duplications are shown in different lists to make them group (duplications and triplications
	* are shown as duplications and homozygous and hemizygous deletions are shown as deletions
	*/
	var deletion = [];
	var duplication = [];
	//The object that resolves when all patients that have been appended to an array (deletion or duplication).
	var patientCheck= $.Deferred();
	//call the function getGenesOfPatients with a callback function (what to do with the genes when they are gathered)
	getGenesOfPatients(patients, function(genes) {
		//the function that puts the genes in the table is called
		putGenesInTable(genes, '#table_body');
	});
	//put the genomic information of each patient in the deletion and duplication array 
	$.each(patients, function(index, patient){
		id = patient['patient_id'];
		if($.inArray(id, checkedPatients)=== -1){
			checkedPatients.push(id);
		}
		var start = patient['start'];
		var stop = patient['stop'];
		var mutation = patient['mutation'];
		//Because deletions and duplications most of the time show completely different phenotypes, they should be shown seperately
		if(mutation === 'hemizygote deletie'||mutation ==='hemizygous deletion'|mutation === 'homozygote deletie'||mutation === 'homozygous deletion'){
			deletion.push({'id': id, 'start':start, 'stop':stop, 'mutation':mutation});
		}else{
			duplication.push({'id': id, 'start':start, 'stop':stop, 'mutation':mutation});
		}
		/**If the number of deletions and duplications is equal to the length of the patient array, 
		* all patients have been appended to an array
		*/
		if(duplication.length+deletion.length === patients.length){
			patientCheck.resolve();
		}
	});
	//Get the library	
	$.getScript('https://rawgit.com/marikaris/ad0597f3ef4223b3bbbb/raw/c46347bad8c01c938e583c72536ebf3974989f16/d3_chromosome_v2.js', function()
	{	//The width of the bars in this view should be 75% of the screen width. 
		width = $(window).width()*0.5;
		//Call the function that makes the x axis (the 6th chromosome) from the library
	   	chromoChart.makeChromosome({"chr_length" 	: chr6size,
		   							"div"		: "#chromosome", 
		   							"figureWidth"	: width});
		//This function adds a legend to the chromosome chart	
	   	chromoChart.addLegend({"div":"#legendPhenotype"});
	   	patientCheck.done(function(){
			//The bars should be loaded, so hide that loading thing!
	   		$('#loading').css('display', 'none');
	   		//Sort the deletion patients on start position
			deletion.sort(function(patient1, patient2){
				return molgenis.naturalSort(patient1.start, patient2.start);
			});
			//Sort the duplication patients on start position
			duplication.sort(function(patient1, patient2){
				return molgenis.naturalSort(patient1.start, patient2.start);
			});
			//Make a bar for each patient with a deletion
			$.each(deletion, function(i, patient){
				chromoChart.makeBar({
					'start':patient['start'],
					'stop':patient['stop'],
					'mutation_type':patient['mutation'],
					'chr_length': chr6size,
					'chart_div':'#deletion',
					'patient_id':patient['id'],
					'figureWidth':width
				});
				//Make it possible for the user to deselect bars by checking a checkbox
				$('#deletion').append('<form><input type="checkbox" data-id = "'+patient['id']+'"class="checkbox check'+patient['id']+
									'" checked><span id="bar_id'+patient['id']+'" class="check_span"> '+patient['id']+'<br/></span>'+
									'</form>');
					
			});	
			//Make a bar for each patient with a duplication
			$.each(duplication, function(i, patient){
				chromoChart.makeBar({
					'start':patient['start'],
					'stop':patient['stop'],
					'mutation_type':patient['mutation'],
					'chr_length':170805979,
					'chart_div':'#duplication',
					'patient_id':patient['id'],
					'figureWidth':width
				});	
				//Make it possible for the user to deselect bars by checking a checkbox
				$('#duplication').append('<form><input type="checkbox" data-id = "'+patient['id']+'"class="checkbox check'+patient['id']+'" checked><span id="bar_id'+patient['id']+
											'" class="check_span"> '+patient['id']+'<br/></span></form>');
			});
			//If the selected_patient is undefined, the phenotype page is not reached from a patient, so the patient cannot be selected
			if(selected_patient !='undefined'){
				//Highlight the patient
				$('#bar_id'+selected_patient).addClass('highlight');
			}
			//If the checkbox changes, check if it is checked, if it is: show the bar, else: hide it
			$(".checkbox").on('change', function(){
				resetTable();
				var id= $(this).data('id');
				if(this.checked){
					$('#'+id).css('display', 'inline');
					$('#stop_pos'+id).css('display','block');
					$('#start_pos'+id).css('display','block');	
					removeGenesFromTable(id);					
				}else{
					$('#'+id).css('display', 'none');
					$('#start_pos'+id).css('display','none');
					$('#stop_pos'+id).css('display','none');
					removeGenesFromTable(id);
				}
			});	   			   	   	
	   	});
	});
   	//make sure the region selector can only select within the chromosome when the window resizes
	   $( window ).resize(function() {
     	$('#chromosome').css('width', $('.chart').width());
	});
    //this function makes the object that should be dragged draggable
   	$(function() {
        $("#draggablePheno1").draggable({
        	axis: "x",
        	// only drag the object within the parent (the length of the chromosome)
            containment: "parent",
            drag: function(){
            	// get the position of the object (starting from the parent div)
            	var position = $(this).position();
           		// 36 px is the actual start position (tested on several screen sizes), we want it to be 0
        		var xPos = position.left-36;
            	/* The position of region bar compared to the chromosome is calculated by:
        		* the length of the chromosome / the width of the chart * the x position of the region bar
            	*/
        		var chrPos = 170805979/$('.chart').width()*xPos;
            	// Put the position on the chromosome in the text span that shows the position on the webpage
            	$('#selected-start').text(math.round(chrPos));
            },
            stop: function(){
                /* When the bar stops and the 0 position is reached, make sure the text that shows 
            	* on the chromosome also is 0. 
            	*/
        		if($(this).offset().left === $('#chromosome').offset().left){
            		$('#selected-start').text(0);
                };
            }
        });
        $('#draggablePheno2').draggable({
           	axis: "x",
            containment: "parent",
        	drag: function(){
            	var position = $(this).position();
            	var xPos = position.left-36;
                var chrPos = 170805979/$('.chart').width()*xPos;
            	$('#selected-stop').text(math.round(chrPos));
            }, 
            stop: function(){
            	/* this function makes the text in the stop position that is shown to the 
            	* user, the length of the chromosome when the user selected the end of the 
            	* chromosome as stop position (if this would not be done, the last 5000 bp 
            	* or so of the chromosome could not be selected, because the region selection
            	* happens within the parent and the region select bars have a length too and
            	* the maximum length of the chromosome can therefor not be selected). 
            	*/
            	if($(this).position().left - $('.chart').width() === 12){
                	$('#selected-stop').text(170805979);
                };
            }
        });
    });
    $('#searchPhenoRegion').click(function(){
        var start = $('#selected-start').text();
    	var stop = $('#selected-stop').text();
    	selectPatientsInRegion(start, stop);
    });
    $('#hideDel').click(function(){
        hideDelDup('deletion');
    });
    $('#hideDup').click(function(){
        hideDelDup('duplication');
    });
};
function selectPatientsInRegion(start, stop){
/** selectPatientsInRegion checks which patients are in the selected region on the
* phenotypeViewer and selects the bars of that patient.
*/
	/*A query is called on the v2 api from molgenis with the start position and stop position
	* of the region, to get the patients in between
	*/
	$.get('/api/v2/chromosome6_array?attrs=ownerUsername&q=Start_positie_in_Hg19=le='+
		stop+';Stop_positie_in_Hg19=ge='+start).done(function(patients){
		//get the patients that match the query
		var selected = patients['items'];
		//uncheck all and trigger change (then the bars will hide)
		$('.checkbox').prop('checked', false);
		$('.checkbox').trigger('change');
		//select each bar that is in the region and trigger change
		$.each(selected, function(index, patient){
			var name = patient['ownerUsername'];
			$('.check'+name).prop('checked', true);
			$('.checkbox').trigger('change');
		});
	});
}
function hideDelDup(type){
/** hideDelDup hides deletions or duplications. 
* The parameter type is 'deletion' or 'duplication' (these names are the same as
* the id of the div) and the svg's in the div are the bars, the id of the bars is the
* id of the patient and class check*id* is the checkbox of the patient. 
*/
	$.each($('#'+type+' svg'), function(i, element){
        id = element.id;
        $('.check'+id).prop('checked', false);
		$('.checkbox').trigger('change');
        
    });
}
function getGenesOfPatients(patients, callbackFunction){
/** getGenesOfPatients gets the genes in the region of the patient by calling the rest
* api on the genes table with a query that specifies the region of the patient, to get only
* the genes in that region. This is done for each patient. The patients array contains objects
* of patients which should at least contain a start and stop location.
*/
	//This object is needed to count the genes per patient
	var genesInRegion= {};	
	//this deferred object is resolved when the last gene of the last patient is appended
	//to the genesInRegion object and counted. 
	var lastGeneOfLastPatient = $.Deferred();
	//This array is filled later with all the gene objects and then sorted on the count variable in the objects
	$.each(patients, function(patient_iteration, patient){
		var start = patient['start'];
		var stop = patient['stop'];
		//call the api for this region
		$.get('/api/v2/genes?attrs=~id,gene_name,ensembl_id,omim_morbid_accesion,omim_morbid_description,start,stop&q=start=le='+
			stop+';stop=ge='+start+'&num=4000').done(function(geneData){
			var genes = geneData['items'];
			$.each(genes, function(gene_index, gene){
				//if the gene is in the array, it should be counted 
				if($.inArray(gene['ensembl_id'], Object.keys(genesInRegion)) > -1){
					genesInRegion[gene['ensembl_id']]['count']+= 1;
					genesInRegion[gene['ensembl_id']]['patients'].push(patient['patient_id']);
				}else{
				//if the gene is not in the array it should be added to the array with count 1
					genesInRegion[gene['ensembl_id']] = {};
					genesInRegion[gene['ensembl_id']]['name'] = gene['gene_name'];
					genesInRegion[gene['ensembl_id']]['count'] = 1;
					genesInRegion[gene['ensembl_id']]['ensembl'] = gene['ensembl_id'];
					genesInRegion[gene['ensembl_id']]['morbid_acc'] = gene['omim_morbid_accesion'];
					genesInRegion[gene['ensembl_id']]['morbid_desc'] = gene['omim_morbid_description'];
					genesInRegion[gene['ensembl_id']]['start'] = gene['start'];
					genesInRegion[gene['ensembl_id']]['stop'] = gene['stop'];
					genesInRegion[gene['ensembl_id']]['patients'] = [patient['patient_id']];
				}
				/*
				* This statement checks: 
				* - if the current start is equal to the start position of the last patient
				* - if the current stop is equal to the stop position of the last patient
				* 
				* When these two checks equal TRUE, we know the genes of last patient are being processed.
				* The second part checks if the last gene is being handled by checking if the (gene list length) -1 is equal to the current index of the $.each loop
				* 
				* If these checks are true, the last gene of the last patient is reached and the deferred object can resolve, which later 
				* triggers the function to continue
				*/
				if(patients[patients.length-1]['start']===start && patients[patients.length-1]['stop']===stop && genes.length-1 === gene_index){
					lastGeneOfLastPatient.resolve();
				}
			});
		});
	});
	//check is done when last gene of last patient is reached
	lastGeneOfLastPatient.done(function(){
		$.map(genesInRegion, function(gene, geneName){
			geneArray.push(gene);
		});
		//sort the array on the nummer of genes counted in this selection (thanks to Chao Pang =) )
		geneArray.sort(function(gene1, gene2){
			return molgenis.naturalSort(gene2.count, gene1.count);
		});
		//call the callback function on the geneArray to process it further
		callbackFunction(geneArray);
	});
};
function putGenesInTable(genes, table_body_id){
/** putGenesInTable puts genes is the table with gene information
* The function runs through all genes and adds them to the table. 
*/
	$.each(genes, function(i, gene){
		if(gene.count !== 0){
			$(table_body_id).append('<tr><td id="'+gene.ensembl+'">'+gene.ensembl+': '+gene.name+
									'</td><td>'+gene.start+'...'+gene.stop+
									'</td><td>'+gene.count+'</td><td id="'+
									gene.morbid_acc+'">'+gene.morbid_desc+'</td></tr>');
		};
	});
};

function addPatients(selectedPhenotype, patients, resultDiv){
/** addPatients adds patients to the results (and thus the bars of the patients by calling the function that does that)
* besides calling the bar function, this function adds functionality to the buttons in the phenotype view. 
*/
	//Make the structure of the page that is needed for showing the patients
    $(resultDiv).html('<div class="row"><div class="col-md-12"><h4>Phenotype: '+selectedPhenotype+'</h4></div></div>'+
			  							'<div class="row">'+
											'<div class="col-md-12">'+
												'<div class="btn-group" id="buttons">'+
													'<button id="select_all" class="btn btn-default"><span class="glyphicon glyphicon-check" aria-hidden="true"></span> Select all patients</button>'+
													'<button id="deselect_all" class="btn btn-default"><span class="glyphicon glyphicon-unchecked" aria-hidden="true"></span> Deselect all patients</button>'+
													'<button id="be_gone" class="btn btn-primary"><span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span> Only show selected patients</button>'+
													'<button id="come_back" class="btn btn-primary"><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> Reset all patients</button>'+
												'</div>'+
											'</div>'+
										'</div>'+
										'<div class="row">'+
											'<div class="col-md-12" id = "figure">'+
											'</div>'+
										'</div>'+
										'<div class="row" id="row">'+
											'<div class="col-md-12" id="info">'+
											'</div>'+
										'</div>');
	//Add a loading bar to the place where the bars will be
	$('#figure').html('<div id="loading" class="text-center"><img src="http://www.wooshphotos.com/woosh_assets/images/loading.gif" alt="loading"/><br/>Loading bars...</div>');
	//If there are patients
	if(patients.length != 0){
    	//Append the bars of the genotypes of the patients to the page in the div with the id figure
    	plotBarsOfPatients(patients, '#figure', 170805979);
		resetTable();
    	//When the button that has the id 'be_gone' is clicked, when the checkbox of a bar is unchecked, the bar, and its id and checkbox will be hidden on the page
    	$("#be_gone").click(function(){
    		//hide the unchecked checkboxes
		    var unchecked = $("input:checkbox:not(:checked)");
			$.each(unchecked, function(){
				var id = $(this).data('id');
    			//Hide the checkbox
    		    $('.check'+id).css('display','none');
			    //Hide the patient id
				$('#bar_id'+id).css('display','none');						
    		});
    	});
    	//Get all the checkboxes with ids back
		$("#come_back").click(function(){
			$('.checkbox').css('display', 'inline');
			$('.check_span').css('display', 'inline');
    	});
    	//Select all checkboxes
    	$("#select_all").click(function(){
			$('.checkbox').prop('checked', true);
			//Trigger the change event of the checkbox to check them again
    		$('.checkbox').trigger('change');
    	});
		$("#deselect_all").click(function(){
			$('.checkbox').prop('checked', false);
    		//Trigger the change event of the checkbox to check them again
			$('.checkbox').trigger('change');
		});
    }else{
	    $('#buttons').text('No patients found with this genotype');
    	$('#figure').text('');
    }
};
function getPhenotypes(questionnaire_url){
/** getPhenotypes gets the phenotypes of the patients of one questionnaire part
* The url is the url to the molgenis v2 api page of the questionnaire part. It is accessed and the data is processed. 
*/
	$.get(questionnaire_url).done(function(data){
  		var genoAttrs = data['meta']['attributes'];
       	$.each(genoAttrs, function(i, geno){
       		//check for the values that should not be shown. 
     		if(geno['name']!=='ownerUsername'&&geno['name']!=='status'&&geno['name']!=='id'&&
    			geno['name']!=='consent'&&geno['name']!=='Intro'){
                part = geno['name'];              
            	attrs = geno['attributes'];
        		$.each(attrs, function(index, compound){
        			compoundAttrs = compound['attributes'];
        			/*The actual questions are in each attribute, so for each part of the questionnaire, 
        			* and for each compound in each part, all the questions should be processed.
        			*/
            		$.each(compoundAttrs, function(index, attr){
            			type = attr['fieldType'];
            			//check which type the value is and process it
            			switch(type){
        					case 'CATEGORICAL':
        						processCategoricalPhenotype(attr['name'], attr['refEntity']['name'], attr['refEntity']['hrefCollection']);
        						break;
            				case 'CATEGORICAL_MREF':    						
            					processCategoricalPhenotype(attr['name'], attr['refEntity']['name'], attr['refEntity']['hrefCollection']);
            					break;
            				case 'COMPOUND':
            					break;
        					case 'BOOL':
        						addToSearch(attr['name']);
        						break;
            				default:
            					break;
            			}
            		});
            	});
        	};
    	});
	});
};

function addToSearch(phenotype){
	/**addToSearch adds an option to the select2 search options. 	
	*/
	$('#tagPicker_phenotype').append('<option value = "'+phenotype+'">'+phenotype+'</option>');
};

function processCategoricalPhenotype(attrName, refName, refEntity_url){
/** processCategoricalPhenotype needs the attribute name, ref name and refEntity url
* then it checks which kind of categorical it is
*/
	/* if it is a categorical with different answers than like: yes, no, can cannot etc., 
	*  append the refentity name to the search bar with the answer. 
	*/
	if(refName !== 'yesno' && refName !== 'yesnonotyet' && refName !=='cannot' && refName !== 'hearing_screening'){
		addToSearch(attrName);
		$.get(refEntity_url).done(function(ref){
			var phenotypes = ref['items'];
			$.each(phenotypes, function(index, phenotype){
				addToSearch(refName+': '+phenotype['label']);
			});
		});
	/*	When the attribute name is a simple answer, just add the attribute name 
	*	(later we can check if the answer is true or false)
	*/
	}else{
		addToSearch(attrName);
	};
};
function getSymptoms(selectedSymptoms){
/** getSymptoms gets as input a list with selected symptoms from the select2 bar.
* Then the checkQuestionnaireData is called to process the selected symptoms. 
*/
	var symptomList = [];
	geneArray = [];
	/* This object is resolved when the symptomList is filled completely and can be returned
	* (when the length of the symptomList is the same as the length of the selected symptoms)
	*/
	var wait = $.Deferred();
	$.each(selectedSymptoms, function(i, symptom){
		var symptom = symptom.text;
		if(symptom.indexOf(':') >=0){
			var refAndPheno = symptom.split(': ');
			var ref = refAndPheno[0];
			var phenotype = refAndPheno[1];
			$.get('/api/v2/'+ref).done(function(refData){
				var id = refData['meta']['attributes'][0]['name'];
				if(id ==='HPO'){
					var refItems = refData['items'];
					$.each(refItems, function(i, item){
						var label = item['label'];
						if(label === phenotype){
							if(item['HPO'].length >1){
								symptomList.push(item['HPO']);		
							}else{
								symptomList.push(label);
							}
						}
					});
				}else{
					symptomList.push(phenotype);
				}
				if(selectedSymptoms.length === symptomList.length){
					wait.resolve();
				}
			});
		}else{
			symptomList.push(symptom);
		}
		if(selectedSymptoms.length === symptomList.length){
			wait.resolve();
		}
	});
	wait.done(function(){
		checkQuestionnaireData(symptomList, '.cutOff', '#nrOfSymptoms', addPatients);
	});
};
function checkQuestionnaireData(symptomList, cutOffClass, inputDiv, callbackFunction){
	/** checkQuestionnaireData checks the answers in the questionnaire and decides if 
	* the patient has the given symptom. If the patient has the symptom, the patient is
	* selected to be shown. The cutOffClass is the string of the class which contains the
	* cutOff value. 
	*/
	var matchCount = {};
	//get the checked radiobutton (which cutOff is selected)
	var cutOff = $('input[type=radio]:checked', cutOffClass).val();
	//Less than all symptoms should be in the patients
	if(cutOff === 'custom'){
		//Get the selected value (user input)
		var custom_value = $(inputDiv).val();
		/* When the gender is selected, the points of patients that match the gender, 
		*  will get 2 more points than usual because the gender is in each questionnaire part.
		*  Thats why we check for the gender and when the gender is selected, the value of
		*  number of selected values that should be true, gets 2 more points. 
		*/
		if(custom_value<symptomList.length && custom_value > 0){
			if($.inArray('Male', symptomList)>-1|$.inArray('Female', symptomList)>-1){
				cutOff = parseInt(custom_value) + 2;
			}else{
				cutOff = custom_value;
			}				
		}else{
			// when the custom value is higher than the length of the symptomlist, the max value is set as cutoff
			if($.inArray('Male', symptomList)>-1|$.inArray('Female', symptomList)>-1){
				cutOff = symptomList.length + 2;
			}else{
				cutOff = symptomList.length;
			}
		}
	}else{
		/*if the default is taken (all symptoms should be in patient to show the patient), 
		* the cutoff is all symptoms and when a gender is selected, two points more. 
		*/
		if($.inArray('Male', symptomList)>-1|$.inArray('Female', symptomList)>-1){
			cutOff = symptomList.length + 2;
		}else{
			cutOff = symptomList.length;
		}
	}
	//here the answers of the questionnaire parts are gathered
	var ac_def = $.Deferred();
	var dh_def = $.Deferred();
	var il_def = $.Deferred();
	$.get('/api/v2/chromosome6_a_c').done(function(a_c){
		var patients_a_c = a_c['items'];
		$.each(patients_a_c, function(ac_index, patient_ac){
			matchCount[patient_ac['ownerUsername']] = 0;
			//here the function that checks the symptoms of the patients is called and add the patients ownerUsername as key to the matchCount object and the matches as value. 
			checkPatients(patient_ac, symptomList, function(ac_matches){matchCount[patient_ac['ownerUsername']] += ac_matches});
			if(patients_a_c.length - 1 === ac_index){
				ac_def.resolve();
			}
		});
		$.get('/api/v2/chromome6_d_h').done(function(d_h){
			var patients_d_h = d_h['items'];
			$.each(patients_d_h, function(dh_index, patient_dh){
				checkPatients(patient_dh, symptomList, function(dh_matches){matchCount[patient_dh['ownerUsername']] += dh_matches});
				if(patients_d_h.length - 1 === dh_index){
					dh_def.resolve();
				}
			});
		});
		$.get('/api/v2/chromome6_i_L').done(function(i_l){
			var patients_i_l = i_l['items'];
			$.each(patients_i_l, function(il_index, patient_il){
				checkPatients(patient_il, symptomList, function(il_matches){matchCount[patient_il['ownerUsername']] += il_matches});
				if(patients_i_l.length - 1 === il_index){
					il_def.resolve();
				}
			});
			il_def.done(function(){
				ac_def.done(function(){
					dh_def.done(function(){
						patientData = [];
						//get the arraydata
						$.get('/api/v2/chromosome6_array').done(function(arrayData){
							//get the patients
							var patients = arrayData['items'];
							$.each(patients, function(patient_index, patient){
								name = patient['ownerUsername'];
								//check for each patient if he or she has enough matches with the selected symptoms
								if(matchCount[name] >= cutOff){
									//if so, add the patients array information to the patientData
									patientObj = {};
									patientObj['patient_id'] = name;
									patientObj['start'] = patient["Start_positie_in_Hg19"];
									patientObj['stop'] = patient["Stop_positie_in_Hg19"];
									patientObj['mutation'] = patient['imbalance']['label'];
									patientData.push(patientObj);
								};
							});
							callbackFunction(symptomList, patientData, "#ph_result");
						});
					});
				});
			});
		});	
	});	
};
function checkPatients(patient, symptoms, callback){
/** checkPatients needs as input a patient and a symptomlist
* it runs through all questions and answers in the patient and compares them with the
* symptoms that are selected. 
*/
	matches = 0;
	$.each(patient, function(question, answer){
		$.each(symptoms, function(index, symptom){
			//if the question is equal to the symptom, it can be a boolean or boolean like categorical
			if(question===symptom){
				//here process booleans, yesno etc
				//when boolean true and abnormality of the bodyheight is not the question, then match (this is abnormal)
				if(answer === true && question !=='Abnormality_of_body_height'){
					matches += 1;
				// if the type is object and the answer is not an array: yes/no etc. answers	
				}else if(typeof answer === 'object' && Array.isArray(answer)===false){
					//with yesnonotyet No is abnormal
					if(answer['_href'].indexOf('yesnonotyet') >= 0){
						if(answer['label']==='No'){
							matches += 1;
						}
					// this one is inversed (no is abnormal)
					}else if(question === 'Anosmia'){
						if(answer['label']==='No'){
							matches += 1;
						}
					//cannot are usually abnormal (= match)
					}else if(answer['label']==='Yes' | answer['label']==='Cannot'){
						matches += 1;
					}
				//this one is inversed (false is match) 
				}else if(question === 'Abnormality_of_body_height' && answer === false){
					matches += 1;
				//when the answer is an array and there are values in it, there is a match
				}else if(Array.isArray(answer) && answer.length > 0){
					matches +=1;
				}
			//when the answer is the symptom, its a match
			}else if(answer === symptom){
				matches += 1;
			// if the answer is an object and not undefined or array, check if the answer HPO term or label is the symptom	
			}else if(typeof answer === 'object' && answer != undefined && Array.isArray(answer) === false){
				if(answer['HPO'] !== undefined){
					if(answer['HPO']===symptom){
						matches += 1;
					}
				}else{
					if(answer['label']===symptom){
						matches += 1;
					}
				}
			/* if the answer is an array with length one (this check is done to make 1 symptom
			* arrays process faster, because we know which symptom we need from the array (number 1). 
			*/
			//check if the first (and only) answers HPO or label in the array is equal to the symptom. 
			}else if(Array.isArray(answer) && answer.length === 1){
				if(answer[0]['HPO'] !== undefined){
					if(answer[0]['HPO']===symptom){
						matches += 1;
					}
				}else{
					if(answer[0]['label']===symptom){
						matches += 1;
					}
				}
			/*check for each value in an array with length > 1 if the values HPO or label is 
			* equal to the symptom. 
			*/
			}else if(Array.isArray(answer) && answer.length > 1){
				$.each(answer, function(index, answerPart){
					if(answerPart['HPO'] !== undefined){
						if(answerPart['HPO']===symptom){
							matches += 1;
						}
					}else{
						if(answerPart['label']===symptom){
							matches += 1;
						}
					}
				});
			}
		});
	});
	callback(matches);
};
function removeGenesFromTable(id){
/**This function removes the unchecked genes from the checked patient array and adds checked patients to the array*/
	var box = $('.check'+id);
	var isChecked = box.is(':checked');
	//here there is checked if the box is checked, but the information is not in the array that contains the checked patients
	if(isChecked && $.inArray(id, checkedPatients)=== -1){
		//checked patients should be in the checked patient array, so push
		checkedPatients.push(id);
	//patients are not checked, but in array?
	}else if (!isChecked && $.inArray(id, checkedPatients)!== -1){
		//get position of this patient in the array
		var index = checkedPatients.indexOf(id);
		//remove patient on that position
		checkedPatients.splice(index, 1);
	}
	//this function is called to alter the gene table
	editGenes();
};
function editGenes(){
/**This function reads the array with genes and compares the found patients in the genes with the checkedGenes array
Unchecked genes, the geneArray will be copied and unchecked patients will be removed from the copy. The copy is made
because the original should be saved in case the user selects all patients again (faster) */
	var newGeneArray = [];
	$.each(geneArray, function(genePositionInArray, geneObj){
		var patients = geneObj['patients'];
		var newGeneObj={};
		var newPatients = [];
		$.each(patients, function(patientIndex, patientWithGene){
			if($.inArray(patientWithGene, checkedPatients) !== -1){
				newPatients.push(patientWithGene);		
			}
			//copy the values that are the same and update patients and count
			newGeneObj.ensembl = geneObj.ensembl;
			newGeneObj.morbid_acc = geneObj.morbid_acc;
			newGeneObj.morbid_desc = geneObj.morbid_desc;
			newGeneObj.name = geneObj.name;
			newGeneObj.start = geneObj.start;
			newGeneObj.stop = geneObj.stop;
			newGeneObj.patients = newPatients;
			newGeneObj.count= newPatients.length;	
			//if last patient is reached, push the gene object to the new array
			if(patients.length-1 === patientIndex){
				newGeneArray.push(newGeneObj);
				//if last gene is reached, sort the array
				if( geneArray.length - 1 === genePositionInArray){
					//sort the array on the nummer of genes counted in this selection (thanks to Chao Pang =) )
					newGeneArray.sort(function(gene1, gene2){
						return molgenis.naturalSort(gene2.count, gene1.count);
					});	
					putGenesInTable(newGeneArray, '#table_body');
				};
			};
		});
	});
};
function resetTable(){
/** This function makes the gene table empty.*/
	//Add the table structure to the page
    $("#info").html('<br/><br/><div class="table-responsive"><table class = "table table-hover" id="gene_table"><thead>'+
    			    '<th>Gene</th><th>Position</th><th>Number of patients</th><th>Literature</th><th></th></thead><tbody id="table_body"></tbody></table></div>');
};
function emptyChecked(){
/** This function makes the checked patients empty (when search button is pressed)*/
	checkedPatients = [];
}