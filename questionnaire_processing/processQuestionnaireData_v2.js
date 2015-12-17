/*this global variable is defined as a default, to keep all the code very generic, 
this div can be changed by changing a global variable. The process questionnaire date
function would otherwise need this as argument, but not all functions that use that function, 
need the div, because the information does not always directly go to a table (only in the
patient view) The variable is used in the functions in this script that process data and put
it in a table*/
var tableDiv = '#patient-table';
var questions2do;
function setNewTableDiv(newDiv){
/**This function changes the global variable to append to other tables*/
	tableDiv = newDiv;
};
function getGenotype(href, chromosome_div){
	// get the data of the genotype from the api (the href is given) and put the information in an image in the given div
	$.get(href).done(function(array){
		//Select start, stop, mutation type, mozaiek percentage and the benign property (could the mutation be benign)
		//from the array
		var geno2plot=[];
		genotype = '';
		var ownerUsername;
		var arrayData = array['items'];
		$.each(arrayData, function(nr, mutation){
			ownerUsername = mutation['ownerUsername'];
			var start = mutation['Start_positie_in_Hg19'];
			var stop = mutation['Stop_positie_in_Hg19'];
			var mutationType = mutation['imbalance']['id'];
			var mozaiek = mutation['Mozaiek'];
			var benign = mutation['Benign'];
			geno2plot.push([start, stop, mutationType, benign]);
			//put the information in one string
			genotype += 'Location: '+start+'...'+stop+'<br/>Mutation: '+mutation['imbalance']['label'];
			//if the mozaiek and benign property are not empty, put them in too
			if(mozaiek!=undefined){genotype+='<br/>Mozaiek: '+mozaiek}
			if(benign!=undefined){genotype+='<br/>Possibly benign: '+benign}
			genotype+= '<br/><br/>'
		});
		//put the genotype in the table
		putInTable('genotype', genotype, tableDiv);
		$.getScript('https://rawgit.com/marikaris/38ff780bc7de041581d9/raw/de400ca52b3d85e68aa04f7b2e3cdf3014ec0d2d/chromoChart_v3.js').done(function(){
			//Call the function that makes the x axis (the 6th chromosome) from the library
			var chr6size= 170805979;
			$(chromosome_div).html('<div id="legend"></div><div id="chart"></div>');
	   		chromoChart.makeChromosome({	"chr_length" 	: chr6size,
		    					"figureWidth" 	: $(window).width()*0.5,
			    				"div"		: chromosome_div
			    			});
		    	//This function adds a legend to the chromosome chart	
		    	chromoChart.addLegend({"div":"#legend"});
		    	//Make bar for the patient
			chromoChart.makeBar({
	    		"mutations"			:geno2plot,
				"chr_length"		:chr6size,
				"chart_div"		:'#chart',
				"patient_id"		:ownerUsername, 
				"figureWidth"		:$(window).width()*0.5
	    		});
		});
	});
};
function getChrAnswerData(id_of_questionnaire, questionnaire_name, callback, callbackQuestionsDone){
	//this function gets the answers of the questionnaire by selecting the data from the api
	//get the information from the api
	
	var promises = [];
	
	$.get('/api/v2/'+questionnaire_name+'/'+id_of_questionnaire).done(function(q_info){
		//iterate over each question (and answer)
		questions2do = Object.keys(q_info);
		done = false;
		$.each(q_info, function(question, answer){
			var name = q_info['ownerUsername'];
			//skip meta data, href, owner username, id and empty answers
			if(question != '_meta' && question != '_href' && question!= 
				'ownerUsername' && question !='status' && question != 'id' && answer.length != 0 && question !='consent'){
				//get the visible expression from the meta data 
				var promise = $.get('/api/v1/'+questionnaire_name+'/meta/'+question).done(function(meta_data){
					var vis_exp=meta_data['visibleExpression'];
					//Filter out the values in which visible expression is not available and all values that are false(to make the app faster)
					if(vis_exp != undefined && answer != false){
						//Split on && to check if there are more than one visible expression and if so, check both
						vis_exps = vis_exp.split('&&');
						//decline the show variable (which will be set false if a visible expression is false)
						var show;
						$.each(vis_exps, function(index, ve){
							//check if the visible expresion contains 'eq' which means that the value that is given
							//should be equal to the value of the question that is given.
							if(ve.indexOf('eq') >= 0){
								//split the eq (to make two values, the question and the expected answer)
								stripped_ve = ve.split("').eq(");
								//take the first and strip the first part of it (this is the attribute to check)
								attr = stripped_ve[0].replace("$('", '');
								//take the second part and strip the last part of it (this is the expected value)
								exp_val = stripped_ve[1].replace(").value()", '');
								//get the found value
								found_val = q_info[attr];
								//is Boolean?
								if(exp_val === 'true'|exp_val === 'false'){
									//convert to boolean (through regex, it is a string now)
									exp_val = Boolean(exp_val);
									//compare them, if they are the same, the question should be shown, so if not, show is false
									if (exp_val !== found_val){
										show = false;
									}
								//check if val is object (and not null or undefined), then it is categorical
								}else if(typeof found_val == 'object' && found_val !== null | found_val !== undefined){
									//remove all ' in the expected value (these are not removed yet because booleans do not have them)
									exp_val = exp_val.replace(/'/g, '');
									//check if the found value has an id value(and not HPO)
									if('id' in found_val){
										//assign the id value as the found value
										found_val = found_val['id'];
										//if they are not the same, dont show
										if(exp_val !== found_val){
											show = false;
										}
									}else{	//assign the HPO value of the found value as found value
										found_val = found_val['HPO'];
										//if they are not the same, dont show
										if(exp_val !== found_val){
											show=false;
										}
									}
								}
							//if indexOf in the visible expression (and the value should be in the question)
							}else if(ve.indexOf('indexOf') >= 0){
								//strip those value and indexOf stuff
								visParts = ve.split("').value().indexOf('");
								//assign the attribute (question)
								attr = visParts[0].replace("$('", '');
								//assign the value that should be selected in the attribute
								exp_val = visParts[1].replace("')>-1", '');
								attr_vals = q_info[attr];
								//if the value check is not true, then set show false (because only one value has to be in the attribute)
								var check;
								$.each(attr_vals, function(i, val){
									if(val['HPO']===exp_val){
										check = true;
									}
								});
								if(check !== true){
									show = false;
								}
							}
						});
						//if show not is false (and no value is assigned to it, so it is undefined), show the question in the table
						if(show===undefined){
							if(typeof answer === 'object' && answer !== null && answer !== undefined){
								if('_href' in answer){
									processCategorical(answer, question, callback, name);
								}else{
									$.each(answer, function(i, answerPart){
										processCategorical(answerPart, question, callback, name);
									});	
								}	
							}else if(typeof answer ==='boolean'){
								processBoolean(answer, question, callback, name);
							}else{
								callback(question, answer, tableDiv, name);
								removeQuestionFromToDo();
							}
						};
					//if there is not a visible expression, just process the question
					}else{	//check if object is categorical
						if(typeof answer === 'object' && answer !== null && answer !== undefined){
							if('_href' in answer){
								processCategorical(answer, question, callback, name);
							}else{//categorical mref processing. 
								$.each(answer, function(i, answerPart){
									processCategorical(answerPart, question, callback, name);
								});	
							}
						//check if answer is boolean
						}else if(typeof answer ==='boolean'){
							processBoolean(answer, question, callback, name);
						}else{	//else just show the question
							callback(question, answer, tableDiv, name);
							removeQuestionFromToDo();
						}
					}		
				});
				promises.push(promise);					
			}
		});
		$.when.apply($, promises).then(function() {
		//yes this part is ugly, suggestions are welcome but I think i tried everything
		//It is to check if all questions are not only called (promises) but also executed... 
			function checkQuestionsDone(){
				if(questions2do.length === 0){
					if(callbackQuestionsDone) callbackQuestionsDone();
				}else{setTimeout(checkQuestionsDone, 500);
				};
			};
			checkQuestionsDone();
		});
	});
};
function processCategorical(answer, question, callback, name){
//This function processes the categorical values
	//if table is yesno/yesnonotyet/hearing_screening, yes means show value (id of yes = y)
	if(answer['_href'].indexOf('yesnonotyet') >= 0){
		if(answer['id']==='n'){
			callback(question, answer['label'], tableDiv, name);
			removeQuestionFromToDo();
		}	
	}else if(answer['_href'].indexOf('yesno') >= 0|answer['_href'].indexOf('hearing_screening') >= 0){
		if(question === 'Anosmia'){
			if(answer['id']==='n'){
				callback(question, answer['label'], tableDiv, name);
				removeQuestionFromToDo();
			}
		}else if(question === 'puberty'){
			callback(question, answer['label'], tableDiv, name);
			removeQuestionFromToDo();
		}else{
			if(answer['id']==='y'){
				callback(question, answer['label'], tableDiv, name);
				removeQuestionFromToDo();
			}	
		}
	}
	//if table is cannot, cannot means show (id of cannot is n)
	}else if(answer['_href'].indexOf('cannot')>= 0){
		if(answer['id']==='n'){
			callback(question, answer['label'], tableDiv, name);
			removeQuestionFromToDo();
		}
	//if table is recurrent_infectioins1, id noHPO means no showing	
	}else if(answer['_href'].indexOf('recurrent_infections1') >= 0){
		if(answer['HPO']!== 'noHPO'){
			callback(question, answer['HPO'], tableDiv, name);
			removeQuestionFromToDo();
		}
	}else{ 	//else for all other tables there has been checked which values mean no showing, they are specified in the if.
		//when these values are selected, the question will not be added to the table
		if(answer['label']!=='Other/do not know' && answer['label']!=='normal' && answer['label']!=='do not know'&&
		answer['label'] !== 'Normal' && answer['label'] !== 'Unsure/do not know' && answer['label'] !== 'Unknown'&&
		answer['label']!=='Do not know'&&answer['label']!=='No problem'&&answer['label']!=='unknown'&&
		answer['label']!== 'None of the above'){
			//check if table has id or hpo
			if('HPO' in answer && answer['HPO'].length !== 1){
				callback(question, answer['HPO'], tableDiv, name);
				removeQuestionFromToDo();
			}else{
				callback(question, answer['label'], tableDiv, name);
				removeQuestionFromToDo();
			}
		}
	}				
};
function processBoolean(answer, question, callback, name){
//This function processses the booleans
	//this table is the opposite of the others, when false is answered, the body height is abnormal
	if(question === 'Abnormality_of_body_height'){
		if(answer === false){
			callback(question, answer, tableDiv, name);
			removeQuestionFromToDo();
		}
	}else{	//except from abnormality of body height, answer is true means, show question
		if(answer === true){
			callback(question, answer, tableDiv, name);
			removeQuestionFromToDo();
		}
	}
};
function putInTable(question, answer, table_id){
//this function puts the question and answer in the given table
	//select the table
	var table=$(table_id);
	//get the table content
	var table_content = table.html();
	//check if the question is not in the table already
	if(table_content.indexOf('>'+question+'<') ===-1){
		//if not, append to table
		table.append('<tr><th class="symptom" id = "'+question+'">'+question+'</th><td class="'+question+'">'+answer+'</td></tr>');
	}else{	//if value in table, and the questions are not gender and birthdate 
		//(these are in all three parts, showing once is enough), update question
		if(question!=='gender'&&question !=='birthdate'){
			$('.' + question).append(', ' + answer);
		}
	}
};
function removeQuestionFromToDo(question){
	var indexOfQuestion = questions2do.indexOf(question);
	questions2do.splice(indexOfQuestion, 1);
};