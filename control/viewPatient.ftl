<#-- modal header -->			
<div class="modal-header">
	<button type="button" class="close close_report" data-dismiss="modal" aria-hidden="true">&times;</button>
	<h4 class="modal-title">DataSet: ${entityMetadata.getLabel()?html}</h4>
</div>

<#-- modal body -->
<div class="modal-body">
	<h3>Patient ${entity.getString("ownerUsername")!?html}</h3>
	<br/>
	<div id = "patient-report-data">
	</div>
	<button id="downloadFeatures" type="button" class="btn btn-info">Download patients features</button>
</div>

<#-- modal footer -->
<div class="modal-footer">
	<button type="button" class="btn btn-default close_report" data-dismiss="modal">close</button>
</div>

<script>
<#--Appends the css styling to the head of the page.-->
$('head').append('<link rel="stylesheet" href="https://rawgit.com/marikaris/48db231276313d25723d/raw/eb0af1c5821003b7090514a0b2f32532efdcc234/chr_style.css" type="text/css">');
var ownerUsername = '${entity.getString("ownerUsername")!?html}';
var promises = [];
var getAC ='/api/v2/chromosome6_a_c?attrs=id&q=ownerUsername=='+ownerUsername;
var getDH = '/api/v2/chromome6_d_h?attrs=id&q=ownerUsername=='+ownerUsername;
var getIL = '/api/v2/chromome6_i_L?attrs=id&q=ownerUsername=='+ownerUsername;
var patient_id_d_h;
var patient_id_i_l;
promises.push(getAC); 
promises.push(getDH);
$.get(getAC).done(function(info){
	<#---Make the table empty (preventing the table from loading dat of several patients at once)-->
	$('#patient-report-data').html('<div id="patient_report_chromosome"></div>'+
									'<br/>'+
									'<input id = "search_through_report_table" type="text"'+
									' class="form-control" placeholder="Search through phenotype" name="srch-term" id="srcs-term">'+
									'<br/>'+
									'<table class="table table-hover" id="patient-table-entityReport"></table>');
	$('#patient-table-entityReport').html('<tbody></tbody>');
	var patient_id_a_c = info['items'][0]['id'];
	<#---Get the data of the second part of the questionnaire-->
	$.get(getDH).done(function(dhInfo){
		patient_id_d_h = dhInfo['items'][0]['id'];
	});
	<#---Get the next id (of part three)-->
	$.get(getIL).done(function(ilInfo){
		patient_id_i_l = ilInfo['items'][0]['id'];
	});
	var url = '/api/v2/chromosome6_array?q=ownerUsername==';
	$.getScript('https://rawgit.com/marikaris/845fe9c278035feb64df'+
					'/raw/b1baaaaecc99baafecdec441d0a0555afd7589a4/processQuestionnaireData_v2.js').done(function(){
		setNewTableDiv('#patient-table-entityReport');
		$('#patient_report_chromosome').html('');
		<#---Get the info and put it in the table-->
		getGenotype(url+ownerUsername, '#patient_report_chromosome');
		$.when.apply($, promises).then(function() {
			getChrAnswerData(patient_id_a_c, 'chromosome6_a_c', putInTable);
			getChrAnswerData(patient_id_d_h, 'chromome6_d_h', putInTable);
			getChrAnswerData(patient_id_i_l, 'chromome6_i_L', putInTable);
		});
		<#--Search through table, code from: http://stackoverflow.com/questions/31467657/how-can-i-search-in-a-html-table-without-using-any-mysql-queries-just-a-plain-j-->
		$("#search_through_report_table").keyup(function(){
      	 	_this = this;
        	<#-- Show only matching TR, hide rest of them-->
      	 	$.each($("#patient-table-entityReport tbody").find("tr"), function() {
            	if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1){
               		$(this).hide();
        		}else{
				    $(this).show();
          		};                
    		});
    	}); 
	});
});
$('#downloadFeatures').click(function(){
	$.getScript('https://rawgit.com/marikaris/09a3b27c53e05de33fba/raw/bd7f7c88c984032f3cfe828a79ea5d32ccbbff7e/makePDF.js').done(function(){
		createPDF(ownerUsername);
	});
});
</script>