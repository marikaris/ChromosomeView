function getPatientInfo(ownerUsername, wholeDiv, searchDiv, tableDiv, chromosomeDiv, withChromosome){
/**This function gets the information of one patient and puts the phenotype information in
a table and the genotype information in an image. */
	withChromosome = typeof withChromosome !== 'undefined' ? withChromosome : true;
	var promises = [];
	var getAC ='/api/v2/chromosome6_a_c?attrs=id&q=ownerUsername=='+ownerUsername;
	var getDH = '/api/v2/chromome6_d_h?attrs=id&q=ownerUsername=='+ownerUsername;
	var getIL = '/api/v2/chromome6_i_L?attrs=id&q=ownerUsername=='+ownerUsername;
	var patient_id_a_c;
	var patient_id_d_h;
	var patient_id_i_l;
	var promiseA_C = $.get(getAC).done(function(info){
		//make sure, this part of the questionnaire has been filled in
		if(info['items'][0] !== undefined){
			//Make the table empty (preventing the table from loading dat of several patients at once)
			$(wholeDiv).html('<div id="'+chromosomeDiv+'"></div>'+
									'<br/>'+
									'<input id = "'+searchDiv+'" type="text"'+
									' class="form-control" placeholder="Search through phenotype" name="srch-term">'+
									'<br/>'+
									'<table class="table table-hover" id="'+tableDiv+'"></table>');
			$('#'+tableDiv).html('<tbody></tbody>');
			patient_id_a_c = info['items'][0]['id'];
			var url = '/api/v2/chromosome6_array?q=Chromosoom==6;ownerUsername==';
			$(chromosomeDiv).html('');
			if(withChromosome){
				//Get the info and put it in the table and grapha
				getGenotype(url+ownerUsername, '#'+chromosomeDiv);
			};
			//Search through table, code from: http://stackoverflow.com/questions/31467657/how-can-i-search-in-a-html-table-without-using-any-mysql-queries-just-a-plain-j
			$('#'+searchDiv).keyup(function(){
       			_this = this;
      			// Show only matching TR, hide rest of them
  	 			$.each($('#'+tableDiv+" tbody").find("tr"), function() {
        			if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1){
           				$(this).hide();
    				}else{
					    $(this).show();
          			};                
    			});
    		}); 
		};
	});
	promises.push(promiseA_C);
	//Get the data of the second part of the questionnaire
	var promiseD_H = $.get(getDH).done(function(dhInfo){
		if(dhInfo['items'][0] !== undefined){
			patient_id_d_h = dhInfo['items'][0]['id'];
		};
	});
	promises.push(promiseD_H);
	//Get the next id (of part three)
	var promiseI_L = $.get(getIL).done(function(ilInfo){
		if(ilInfo['items'][0] !== undefined){
			patient_id_i_l = ilInfo['items'][0]['id'];
		};
	});
	promises.push(promiseI_L);
	//when all get requests are done (and the id is gathered), go on
	$.when.apply($, promises).then(function() {
		if(patient_id_a_c !== undefined){
			getChrAnswerData(patient_id_a_c, 'chromosome6_a_c', putInTable);
		}
		if(patient_id_d_h !== undefined){
			getChrAnswerData(patient_id_d_h, 'chromome6_d_h', putInTable);
		}
		if(patient_id_i_l !== undefined){
			getChrAnswerData(patient_id_i_l, 'chromome6_i_L', putInTable);
		}
	});
};