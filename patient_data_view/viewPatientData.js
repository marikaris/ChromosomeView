function getPatientInfo(ownerUsername, wholeDiv, searchDiv, tableDiv, chromosomeDiv, withChromosome){
/**This function gets the information of one patient and puts the phenotype information in
a table and the genotype information in an image. */
	withChromosome = typeof withChromosome !== 'undefined' ? withChromosome : true;
	var promises = [];
	var getAC ='/api/v2/chromosome6_a_c?attrs=id&q=ownerUsername=='+ownerUsername;
	var getDH = '/api/v2/chromome6_d_h?attrs=id&q=ownerUsername=='+ownerUsername;
	var getIL = '/api/v2/chromome6_i_L?attrs=id&q=ownerUsername=='+ownerUsername;
	var patient_id_d_h;
	var patient_id_i_l;
	promises.push(getAC); 
	promises.push(getDH);
	$.get(getAC).done(function(info){
		//Make the table empty (preventing the table from loading dat of several patients at once)
		$(wholeDiv).html('<div id="'+chromosomeDiv+'"></div>'+
									'<br/>'+
									'<input id = "'+searchDiv+'" type="text"'+
									' class="form-control" placeholder="Search through phenotype" name="srch-term">'+
									'<br/>'+
									'<table class="table table-hover" id="'+tableDiv+'"></table>');
		$('#'+tableDiv).html('<tbody></tbody>');
		var patient_id_a_c = info['items'][0]['id'];
		//Get the data of the second part of the questionnaire
		$.get(getDH).done(function(dhInfo){
			patient_id_d_h = dhInfo['items'][0]['id'];
		});
		//Get the next id (of part three)
		$.get(getIL).done(function(ilInfo){
			patient_id_i_l = ilInfo['items'][0]['id'];
		});
		var url = '/api/v2/chromosome6_array?q=ownerUsername==';
		$.getScript('https://rawgit.com/marikaris/845fe9c278035feb64df/raw/0d24cc3923c0b5581b436d7b9fce77e6b779e2d7/processQuestionnaireData_v2.js').done(function(){
			setNewTableDiv('#'+tableDiv);
			$(chromosomeDiv).html('');
			if(withChromosome){
				//Get the info and put it in the table and graph
				getGenotype(url+ownerUsername, '#'+chromosomeDiv);
			};
			$.when.apply($, promises).then(function() {
				getChrAnswerData(patient_id_a_c, 'chromosome6_a_c', putInTable);
				getChrAnswerData(patient_id_d_h, 'chromome6_d_h', putInTable);
				getChrAnswerData(patient_id_i_l, 'chromome6_i_L', putInTable);
			});
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
		});
	});
};