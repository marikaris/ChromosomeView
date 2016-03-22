function makeSelect(chromosome_bar, start_div, stop_div, drag_start, drag_stop, bar, button){
/**This function should make the region view selection possible*/
	var width = $(window).width()*0.5;
    $.getScript('https://rawgit.com/marikaris/ad0597f3ef4223b3bbbb/raw/c46347bad8c01c938e583c72536ebf3974989f16/d3_chromosome_v2.js').done(function(){
		function loadStuff(){
			//make the chromosome bar empty before loading to prevent it from showing several times
    		$(chromosome_bar).html('');
    		//set the width of the bar
    	    $(bar).css('width', width);
    	    //make the reference bar
    	   	chromoChart.makeChromosome({"chr_length" 	: 170805979,
    	   					            "div"		: "#chromosome_bar", 
    	   					            "figureWidth"	: width});
    		/*put the mousedown event off (jQuery UI draggable was used at first, 
    		but this does not work properly so it is disabled and should by typing 
    		the start and stop location)*/
    		$(drag_start).off('mousedown');
  			$(drag_stop).off('mousedown');
        }
        loadStuff();
        //load again when the window resizes (to keep the scale ok)
    	$( window ).resize(function() {
        	loadStuff();
    	});
    });
    /*The key up event in the start position input bar changes the position on the button
    on the chromosome bar*/
    $(start_div).keyup(function(){
    	//get the typed value
        var value = $(this).val();
        //calculate the number of pixels this value means
        var px =  value*width/170805979;
        //check if the value is within the chromosome
        if(value>= 0 && value<=170805979){
        	//get the current position (left, right, top, bottom)
            var position = $(drag_start).position();
            //get the left position
            var xPos = position.left;
            //calculate the position on the chromosome
            var chrPos = 170805979/width*xPos;
            //now position the button on the page
            $(drag_start).css('margin-left', px-xPos);
        }else{
        	//when the selected region is not within the chromosome, put the button at 0
            $(drag_start).css('margin-left', '0px');
        }
    });
    /*The key up event in the stop position input bar changes the position on the button
    on the chromosome bar. This works the same as above for the start*/
    $(stop_div).keyup(function(){
        var value = $(this).val();
        var px =  value*width/170805979;
        if(value >= 0 && value<=170805979){
            var position = $(drag_stop).position();
            var xPos = position.left;
            var chrPos = 170805979/width*xPos;
            $(drag_stop).css('margin-left', px-xPos);
        }else{
            $(drag_stop).css('margin-left', '0px');
        }
    });
};
//use the getPatientsInRegion function of the geneview
function getPatients(start, stop){
	/**This function calls the getPatientsInRegion function of the genotype view*/
    getPatientsInRegion(start, stop, '', putInRegionTable, '#regionResults');
};
function putInRegionTable(tableDiv, phenoInfo){
/**This function puts the information in the table and is used as callback function for 
the getPatientsInRegion function of the geneview*/
	$(tableDiv).html('<table class="table table-hover"><thead><tr id="regionHead"><th>Phenotype</th><th># Patients</th><th># Patients with deletion</th>'+
						'<th># Patients with duplication</th></tr></thead><tbody id="regionBody"></tbody></table>');
	$.each(phenoInfo, function(i, phenotype){
		var phenotypeName = phenotype.phenotype;
		var patients = phenotype.patients;
		var count = phenotype.numberOfPatients;
		var delCount = 0;
		var dupCount = 0;
		$.each(patients, function(i, patient){
			if ($.inArray(patient, patientsDeletion)>-1){
				delCount += 1;
			}else{	
				dupCount += 1;
			}
		});
		$('#regionBody').append('<tr><td>'+phenotypeName+'</td><td>'+count+'</td><td>'+delCount+'</td><td>'+dupCount+'</td></tr>');
	});
	
};