<div class="row">
    <div class="col-md-12">
        <h3>Search through chromosome data</h3>
        <br/>
    </div>
</div>
<div class="row">
    <div class="col-md-2">
        <div class="dropdown">
          <button id="selectMethod" type="button" class="dropdown-toggle btn btn-primary"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Select method
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="selectMethod">
          	<li class="selection" id="patientView"><a href="#">Single patient view</a></li>
            <li role="separator" class="divider"></li>
            <li class="selection" id="phenotypeView"><a href="#">Phenotype view</a></li>
            <li role="separator" class="divider"></li>
            <li class="selection" id="geneView"><a href="#">Gene view</a></li>
            <#--<li role="separator" class="divider"></li>-->
            <#--<li class="selection" id="regionView"><a href="#">Select region on chromosome</a></li>-->
            <li role="separator" class="divider"></li>
            <li class="selection" id="chr6_map"><a href="#">Chromosome 6</a></li>
          </ul>
        </div>
    </div>
    <div class="col-md-10">
    	<div id="showPatient" style="display:none">
    		<h4>Select a patient</h4>
    		<div id="search-stuff_patient" class='search-stuff'>
            	<select class="form-control" id="tagPicker_patient">
            	</select>
                <div class="pull-right">
                    <button id="search_button_patient" class="btn btn-default search_button"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>Search</button>
                </div>
            </div>
            <br/>
            <div id='patient_information' style="display:none">
            	<h4>Patient information</h4>
           	 	<h5>Genotype on chromosome 6</h5>
            	<div id='patient_chromosome'></div>
           	 	<form class="navbar-form navbar-right" role="search">
   					<div class="input-group add-on">
      					<input id = "search_through_table" type="text" class="form-control" placeholder="Search" name="srch-term" id="srch-term">
     		 			<div class="input-group-btn">
       						<span class="btn btn-default" type="submit"><i class="glyphicon glyphicon-search"></i></span>
      					</div>
    				</div>
 	 			</form>
            	<div id="patient_table_div"></div>
            </div>
    	</div>
        <div id="showPheno" style="display:none">
            <h4>Select phenotypes</h4>
            <div id="search-stuff_phenotype" class='search-stuff'>
            <select class="form-control" id="tagPicker_phenotype" multiple="multiple">
            </select>
            	<br/>
            	<b>Select patients with: </b>
            	<div class="radio cutOff">
  					<label><input type="radio" name="optradio" checked="checked" value="default">All selected phenotypes</label>
				</div>
				<div class="radio cutOff">
  					<label><input type="radio" name="optradio" value="custom">At least <input id ="nrOfSymptoms" type="number"> of the phenotypes</label>
				</div>
                <div class="pull-right">
                    <button id="search_button_phenotype" class="btn btn-default search_button"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>Search</button>
                </div>
            </div>
            <div id="ph_result"></div>
        </div>
        <div id="showGene" style="display: none">
            <h4>Select genes</h4>
            <div id="search-stuff_gene" class='search-stuff'>
            <select class="form-control" id="tagPicker_genes" multiple="multiple">
            </select>
                <div class="pull-right">
                    <button class="btn btn-default search_button" id="search_button_genes"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>Search</button>
                </div>
            </div>
            <div id="ge_result" style='display: none'></div>
        </div>
        <div id="showRegion" style="display: none">
            <h4>Select region</h4>
            <div id='bar'>
                <div id="draggable1" class="ui-widget-content text-center">
                  <span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
                </div>
                <div id="draggable2" class="ui-widget-content text-center">
                    <span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>
                </div>
                <div id='chromosome_bar'></div>
                Between <span><input type="number" name="pos" value = 0 id="posX-1"></span> and <span><input type="number" name="start" value = 0 id="posX-2"></span>
            </div>
            <br/>
            <button id="selectRegion" class="btn btn-primary">Get patients</button>
            <div id="regionResults"></div>
        </div>
        <div id="show_chr6" >
        	<h4>Chromosome 6 QTL plots</h4>
        	<select class="selectQtlSymptom" id="qtlSymptomSelection">
        	</select>
        	<button id='mooiKnopje' class="btn btn-default">Generate QTL plot</button>
        	<div id="qtlplot"></div>
        	<div id="target_chr6_plot" style='display:none'></div>
        	<div id="significantLod" style='display:none'>
        		<div id="alpha-error">Error: Alpha should be between 0 and 1</div>
        		Alpha: <input type ="number" value = "alpha" id="alpha-value">
        		<button id="calcSigLod">Calculate significant lodscore threshold</button>
        		<br/><br/>
        		<p id ="calculatedThreshold"></p>
        		<div id="geneInfoQtl"></div>
        	</div>
        </div>
    </div>
</div>
<script>
    <#--Appends the css styling and javascript files to the head of the page.-->
	$('head').append('<link rel="stylesheet" href="/css/styling-chr6/chr6_style.css" type="text/css"/>');
	var loadQuestionnaire = document.createElement('script');
	loadQuestionnaire.type = 'text/javascript';
	loadQuestionnaire.src = '/js/js-chr6/questionnaire_processing/processQuestionnaire.js';
	$('head').append(loadQuestionnaire);
    var geneView = document.createElement('script');
    geneView.type = 'text/javascript';
    geneView.src = '/js/js-chr6/researchViews/geneView.js';
	$('head').append(geneView);
	var patientView = document.createElement('script');
	patientView.type='text/javascript';
	patientView.src = '/js/js-chr6/researchViews/patientView.js';
	$('head').append(patientView);
	
    var url='/api/v2/patients';
    
    $("#tagPicker_phenotype").select2({
        closeOnSelect:false
    });
    $('.selection').mouseenter(function(){
        $(this).addClass('active');
    });
    $('.selection').mouseleave(function(){
        $(this).removeClass('active');
    });
    $('#phenotypeView').click(function(){
    	//patient views chromosome bar should become empty because the bar in the patient view, may conflict with the phenotype view
    	$("#patient_chromosome").html('');
    	$('#patient_information').css('display', 'none');
        $("#showPheno").css('display', 'inline');
        $("#showGene").css('display', 'none');
        $("#showRegion").css('display', 'none');
        $("#showPatient").css('display', 'none');
        $("#show_chr6").css('display', 'none');
    });
    $('#geneView').click(function(){
        $("#showPheno").css('display', 'none');
        $("#showGene").css('display', 'inline');
        $("#showRegion").css('display', 'none');
        $("#showPatient").css('display', 'none');
        $("#show_chr6").css('display', 'none');
    });
    $('#regionView').click(function(){
        $("#showPheno").css('display', 'none');
        $("#showGene").css('display', 'none');
        $("#showRegion").css('display', 'inline');
        $("#showPatient").css('display', 'none');
        $("#show_chr6").css('display', 'none');
    });
    $('#patientView').click(function(){
        $("#showPheno").css('display', 'none');
        $("#showGene").css('display', 'none');
        $("#showRegion").css('display', 'none');
        $("#showPatient").css('display', 'inline');
        $("#show_chr6").css('display', 'none');
    });
    $('#chr6_map').click(function(){
    	$('input[type=radio]', '.cutOff')[0].checked = true;
        $("#showPheno").css('display', 'none');
        $("#showGene").css('display', 'none');
        $("#showRegion").css('display', 'none');
        $("#showPatient").css('display', 'none');
        $("#show_chr6").css('display', 'inline');
    });
    <#--This piece of code makes the phenotype view view-->
    $.getScript('/js/js-chr6/researchViews/phenotypeView.js', function(){
    	getPhenotypes('/api/v2/chromosome6_a_c', '#tagPicker_phenotype');
   	 	getPhenotypes('/api/v2/chromome6_d_h', '#tagPicker_phenotype');
    	getPhenotypes('/api/v2/chromome6_i_L', '#tagPicker_phenotype');
    	$.get('/api/v2/gender', function(genderInfo){
    		genders = genderInfo['items'];
    		<#--The select2 searchbar will be filled with genders-->
    		$.each(genders, function(index, gender){
    			addToSearch('gender: '+gender['label'], '#tagPicker_phenotype');
    		});
   		 });
   		 addToSearch('BMI > 30',  '#tagPicker_phenotype');
   		 addToSearch('BMI > 25',  '#tagPicker_phenotype');
   		 addToSearch('Loose connective tissue',  '#tagPicker_phenotype');
    	$('#search_button_phenotype').on('click', function(){
    		emptyChecked();
    		var selected = $('#tagPicker_phenotype').select2('data');
    		getSymptoms(selected, addPatients);	
    	});	
    	$('body').on('click', '.check_span', function(){
    		var patient = $(this).text().replace(' ', '');
    		getPatientsWholePhenotype(patient);
   		});
   		$('body').on('click', '.closePatient', function(){
   			var patient = $(this).data('id');
   			$('#dialog_'+patient).css('display', 'none');
   		});
    });
    $('#selectMethod').click(function(){
    	$('#patient-report-data').html('');
    });	
</script>
<script>
<#--this part makes the gene view-->
    var url='/api/v2/genes?num=4000';
    $("#tagPicker_genes").select2({
        closeOnSelect:false
    });
<#--make background of text in select menu blue on hover-->
    $('.selection').mouseenter(function(){
        $(this).addClass('active');
    });
    $('.selection').mouseleave(function(){
        $(this).removeClass('active');
    });
    $.get(url).done(function(genes){
       gene_objects = genes['items'];
       $.each(gene_objects, function(i, geneObj){
            counter = i+1;
            $('#tagPicker_genes').append('<option value = "'+
                   geneObj['ensembl_id']+'">'+geneObj['ensembl_id']+': '+geneObj['gene_name']+'</option>');
       });
    });
    $.get('https://gist.githubusercontent.com/marikaris/2de02c1caf20d4e52a20/raw/d82a88d1cfed04f730ea2a83bcb4775da901e4a6/gene_content.html').done(
        function(geneFrame){
            $('#ge_result').html(geneFrame);
        });
    $('#search_button_genes').click(function(){
    	$('#genePhenoTable-title').text('All patients');
    	$('#phenotype-optionList').html('<li><a href="#" id="phenoOption-allPatients" class="selection phenoOption">All patients</a></li>'+
    				'<li><a href="#" id="phenoOption-deletion" class="selection phenoOption">Patients with deletion</a></li>'+
    				'<li><a href="#" id="phenoOption-duplication" class="selection phenoOption">Patients with duplication</a></li>');
        var selected = $('#tagPicker_genes').select2('data');
        $('#ge_result').css('display', 'inline');
        $('#gene_info').html('');
        if(selected.length !== 0){
        	processSelectedGenes(selected);
        }
        $('.selection').mouseenter(function(){
        	$(this).addClass('active');
    	});
    	$('.selection').mouseleave(function(){
        	$(this).removeClass('active');
    	});
    	$('a.selection.phenoOption').click(function(){
			selectDropDownOption('#genePhenoTable-title', $(this));
    	});
    });
</script>
<#--Disabled because it is slow
<script>
	Here the region view is done
    $.getScript('/js/js-chr6/reseachViews/regionView.js').done(function(){
    	makeSelect('#chromosome_bar', '#posX-1', '#posX-2', '#draggable1', '#draggable2', '#bar');
   		$('#selectRegion').on('click', function(){
   			$('#regionResults').html('<br/>Loading...');
   			getPatients($('#posX-1').val(), $('#posX-2').val());
   		});
    });
</script>-->
<script>
<#---This part makes the patient view available-->
	$('#patientView').click(function(){
	$('#patient_table_div').html('<table id="patient-table" class="table table-hover"><tbody></tbody></table>');
	<#---Make the patients selectable-->
		$('#tagPicker_patient').select2();
		<#--Get the names from the last part of the questionnaire (when this is filled in, all parts should be filled in)-->
		$.get('/api/v2/chromome6_i_L').done(function(info){
			var patient_info = info['items'];
			<#---14 is the length of the tagPicker if it is empty, so only fill with patients if it is empty (lazy loading)-->
			if($('#tagPicker_patient').text().length===14){
				$.each(patient_info, function(index, patient){
					$('#tagPicker_patient').append(
						'<option value = "'+
                	  	patient['id']+'">'+patient['ownerUsername']+'</option>'
					);
				});
			}
			<#---By clicking on the search button, the information of the patient that is selected will be loaded-->
			$('#search_button_patient').click(function(){
				<#--Show the patient information div when search is clicked-->
				$('#patient_information').css('display', 'inline');
				<#---Make the table empty (preventing the table from loading dat of several patients at once)-->
				$('#patient-table').html('<tbody></tbody>');
				<#---Get the selected value-->
				var selected = 	$('#tagPicker_patient').select2('data');	
				<#---Get the owner user name (this one is the same in all questionnaire parts and array data of one patient
						and could be used as patient id. -->
				var ownerUsername = selected['text'];
				getPatientInfo(ownerUsername, '#patient_information', 'search_through_table', 'patient-table', 'patient_chromosome');
			});
		});	
	});
</script>
<script>
	$.getScript('/js/js-chr6/researchViews/phenotypeView.js', function(){
		$.getScript('/js/js-chr6/questionnaire_processing/qtlDataCreator.js', function(){
			fillSearchBar('#qtlSymptomSelection');
			addToSearch('BMI > 30',  '#qtlSymptomSelection');
			addToSearch('BMI > 25',  '#qtlSymptomSelection');
   		 	addToSearch('Loose connective tissue',  '#qtlSymptomSelection');
   		 	$( document ).ready(function() {
				processGeneData();
				$('.selectQtlSymptom').select2();
				var symptom;
				var threshold;
				$.getScript('/js/js-chr6/lib/cyto-chromosome/cyto-chromosome.js').done(function(){
					cyto_chr.modelLoader.setDataDir('https://raw.githubusercontent.com/linjoey/cyto-chromosome-vis/master/data/');
					var chromosomeFactory = cyto_chr.chromosome;
					$('#target_chr6_plot').css('margin-left', '4em');
					var chr_6 = chromosomeFactory().segment('6').target('#target_chr6_plot').showAxis(true).width(1100).render();
				});
				$('#mooiKnopje').click(function(){
					symptom = $('.selectQtlSymptom').select2('data');
					if(symptom !== null){
						scanPhenotypeData([symptom]);
					};
				});
			});
		});
	});
</script>