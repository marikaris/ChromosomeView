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
$('head').append('<link rel="stylesheet" href="https://rawgit.com/marikaris/48db231276313d25723d/raw/ab4e9c8b59d7e9a0829d29eb8b1678358d5f08df/chr_style.css" type="text/css">');
var ownerUsername = '${entity.getString("ownerUsername")!?html}';
$.getScript('https://rawgit.com/marikaris/8b2afbf48ab58949661e/raw/8d686ebe6f947c8b17ba2d482c4eca6c4d674c12/patient_data_view.js').done(function(){
	getPatientInfo(ownerUsername, '#patient-report-data', 'search_through_report_table', 'patient-table-entityReport', 'patient_report_chromosome');
});
$('#downloadFeatures').click(function(){
	$.getScript('https://rawgit.com/marikaris/09a3b27c53e05de33fba/raw/53f804892d2a3cf4f9981b1f07075683be6398ff/makePDF.js').done(function(){
		createPDF(ownerUsername, '#patient-table-entityReport');
	});
});
</script>