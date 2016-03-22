<#-- modal header -->			
<div class="modal-header">
	<button type="button" class="close close_report" data-dismiss="modal" aria-hidden="true">&times;</button>
	<h4 class="modal-title">DataSet: ${entityMetadata.getLabel()?html}</h4>
</div>

<#-- modal body -->
<div class="modal-body">
	<div class = "row">
		<div id="patientEntityTitle" class="col-md-12">
			<h3>Patient ${entity.getString("ownerUsername")!?html}</h3>
			<br/>
		</div>
	</div>
	<div class="row">
		<div id = "patient-report-data" class = "col-md-10 col-md-offset-1">
		</div>
	</div>
	<button id="downloadFeatures" type="button" class="btn btn-info">Download patients features</button>
</div>

<#-- modal footer -->
<div class="modal-footer">
	<button type="button" class="btn btn-default close_report" data-dismiss="modal">close</button>
</div>

<script>
<#--Appends the css styling to the head of the page.-->
$('head').append('<link rel="stylesheet" href="https://rawgit.com/marikaris/48db231276313d25723d/raw/c0232edcf37b4d4353cf4e954d106cbaf1dd08c0/chr_style.css" type="text/css">');
var pdfMaker = document.createElement('script');
pdfMaker.type='text/javascript';
pdfMaker.src='https://rawgit.com/marikaris/09a3b27c53e05de33fba/raw/799793f289de7691e97d60ba80b08ffbdc17f003/makePDF.js';
var chromoChart = document.createElement('script');
chromoChart.type = 'text/javascript';

$('head').append(pdfMaker);
var ownerUsername = '${entity.getString("ownerUsername")!?html}';
<#--This is needed because this script should be ready on load and when appended to header, it cannot be made sure that the script is loaded-->
$.getScript('https://rawgit.com/marikaris/8b2afbf48ab58949661e/raw/4439ecf7483b2855eefd09e5550a5a3f664a69b9/patient_data_view.js').done(function(){
	$.getScript('https://rawgit.com/marikaris/845fe9c278035feb64df/raw/bff536d3ad8c6862f7f505b64f84f7e55cc3facd/processQuestionnaireData_v2.js').done(function(){
		setNewTableDiv('#patient-table-entityReport');
		getPatientInfo(ownerUsername, '#patient-report-data', 'search_through_report_table', 'patient-table-entityReport', 'patient_report_chromosome');
	});
});
$('#downloadFeatures').click(function(){
	createPDF(ownerUsername, '#patient-table-entityReport');
});
</script>