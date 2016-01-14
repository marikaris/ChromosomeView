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
$('head').append('<link rel="stylesheet" href="https://rawgit.com/marikaris/48db231276313d25723d/raw/a7e7d0174cd13a0a6957f743469185a452d69398/chr_style.css" type="text/css">');
var ownerUsername = '${entity.getString("ownerUsername")!?html}';
$.getScript('https://rawgit.com/marikaris/8b2afbf48ab58949661e/raw/3ca985ddfb79fa3cffe8e7c3f8d3264565f4d015/patient_data_view.js').done(function(){
	getPatientInfo(ownerUsername, '#patient-report-data', 'search_through_report_table', 'patient-table-entityReport', 'patient_report_chromosome');
});
$('#downloadFeatures').click(function(){
	$.getScript('https://rawgit.com/marikaris/09a3b27c53e05de33fba/raw/53f804892d2a3cf4f9981b1f07075683be6398ff/makePDF.js').done(function(){
		createPDF(ownerUsername, '#patient-table-entityReport');
	});
});
</script>