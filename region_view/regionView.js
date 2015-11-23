function makeSelect(chromosome_bar, start_div, stop_div, drag_start, drag_stop, bar, button){
	var width = $(window).width()*0.5;
    $.getScript('https://rawgit.com/marikaris/ad0597f3ef4223b3bbbb/raw/c46347bad8c01c938e583c72536ebf3974989f16/d3_chromosome_v2.js').done(function(){
		function loadStuff(){
    		$(chromosome_bar).html('');
    	    $(bar).css('width', width);
    	   	chromoChart.makeChromosome({"chr_length" 	: 170805979,
    	   					            "div"		: "#chromosome_bar", 
    	   					            "figureWidth"	: width});
    		
    		$(drag_start).off('mousedown');
  			$(drag_stop).off('mousedown');
        }
        loadStuff();
    	$( window ).resize(function() {
        	loadStuff();
    	});
    });  
    $(start_div).keyup(function(){
        var value = $(this).val();
        var px =  value*width/170805979;
        if(value>= 0 && value<=170805979){
            var position = $(drag_start).position();
            var xPos = position.left;
            var chrPos = 170805979/width*xPos;
            $(drag_start).css('margin-left', px-xPos);
        }else{
            $(drag_start).css('margin-left', '0px');
        }
    });
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
function getPatients(start, stop){
	 $.getScript('https://rawgit.com/marikaris/c3c30499b070fa5a19ad/raw/9bf1755f2adb68d269b66c24718d3aa3843f7916/getGenes.js').done(
        function(){
        getPatientsInRegion(start, stop, '', putInRegionTable, '#regionResults');
    });
};
function putInRegionTable(tableDiv, phenoInfo){
	//regionResults
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