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
            <li role="separator" class="divider"></li>
            <li class="selection" id="regionView"><a href="#">Select region on chromosome</a></li>
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
            	<table id="patient-table" class="table table-hover"><tbody></tbody></table>
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
  					<label><input type="radio" name="optradio" checked="checked" value="default">All symptoms</label>
				</div>
				<div class="radio cutOff">
  					<label><input type="radio" name="optradio" value="custom">At least <input id ="nrOfSymptoms" type="number"> of the symptoms</label>
				</div>
                <div class="pull-right">
                    <button id="search_button_phenotype"class="btn btn-default search_button"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>Search</button>
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
                Between <span><input type="number" name="pos" val = 0 id='posX-1'></span> and <span><input type="number" name="start" val = 0 id='posX-2'></span>
            </div>
            <br/>
            <button id="selectRegion" class="btn btn-primary">Get patients</button>
            <div id="regionResults"></div>
        </div>
    </div>
</div>
<script>
    <#--Appends the css styling to the head of the page.-->
	$('head').append('<link rel="stylesheet" href="https://rawgit.com/marikaris/48db231276313d25723d/raw/eb0af1c5821003b7090514a0b2f32532efdcc234/chr_style.css" type="text/css">');
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
        $("#showPheno").css('display', 'inline');
        $("#showGene").css('display', 'none');
        $("#showRegion").css('display', 'none');
        $("#showPatient").css('display', 'none');
    });
    $('#geneView').click(function(){
        $("#showPheno").css('display', 'none');
        $("#showGene").css('display', 'inline');
        $("#showRegion").css('display', 'none');
        $("#showPatient").css('display', 'none');
    });
    $('#regionView').click(function(){
        $("#showPheno").css('display', 'none');
        $("#showGene").css('display', 'none');
        $("#showRegion").css('display', 'inline');
        $("#showPatient").css('display', 'none');
    });
    $('#patientView').click(function(){
        $("#showPheno").css('display', 'none');
        $("#showGene").css('display', 'none');
        $("#showRegion").css('display', 'none');
        $("#showPatient").css('display', 'inline');
    });
    $.getScript('https://rawgit.com/marikaris/6eedaa926f01c7cf78eb/raw/ec5938b14718fd25c6e569ef25d13997e1caebe9/phenotypeViewer_v2.js', function(){
    	getPhenotypes('http://localhost:8080/api/v2/chromosome6_a_c');
   	 	getPhenotypes('http://localhost:8080/api/v2/chromome6_d_h');
    	getPhenotypes('http://localhost:8080/api/v2/chromome6_i_L');
    	$.get('/api/v2/gender', function(genderInfo){
    		genders = genderInfo['items'];
    		$.each(genders, function(index, gender){
    			addToSearch('gender: '+gender['label']);
    		});
   		 });
    	$('#search_button_phenotype').on('click', function(){
    		var selected = $('#tagPicker_phenotype').select2('data');
    		getSymptoms(selected);	
    	});	
    });	
</script>
<script>
    var url='/api/v2/genes?num=4000';
    $("#tagPicker_genes").select2({
        closeOnSelect:false
    });
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
    $.get('https://rawgit.com/marikaris/2de02c1caf20d4e52a20/raw/d82a88d1cfed04f730ea2a83bcb4775da901e4a6/gene_content.html').done(
        function(geneFrame){
            $('#ge_result').html(geneFrame);
        });
    $('#search_button_genes').click(function(){
    	//var phenoList = [];
    	$('#genePhenoTable-title').text('All patients');
    	$('#phenotype-optionList').html('<li><a href="#" id="phenoOption-allPatients" class="selection phenoOption">All patients</a></li>'+
    				'<li><a href="#" id="phenoOption-deletion" class="selection phenoOption">Patients with deletion</a></li>'+
    				'<li><a href="#" id="phenoOption-duplication" class="selection phenoOption">Patients with duplication</a></li>');
        var selected = $('#tagPicker_genes').select2('data');
        $('#ge_result').css('display', 'inline');
        $('#gene_info').html('');
        $.getScript('https://rawgit.com/marikaris/c3c30499b070fa5a19ad/raw/9bf1755f2adb68d269b66c24718d3aa3843f7916/getGenes.js').done(
            	function(){	
            processSelectedGenes(selected);
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
    });
</script>
<script>
	<#--Here the region view is done-->
    $.getScript('https://rawgit.com/marikaris/280e033da84cc3dfac82/raw/c2081c27034cf4d7af35be2c0f2b90d0810ee462/regionView.js').done(function(){
    	makeSelect('#chromosome_bar', '#posX-1', '#posX-2', '#draggable1', '#draggable2', '#bar');
   		$('#selectRegion').on('click', function(){
   			getPatients($('#posX-1').val(), $('#posX-2').val());
   		});
    });
</script>
<script>
<#---This part makes the patient view available-->
	$('#patientView').click(function(){
	<#---Make the patients selectable-->
		$('#tagPicker_patient').select2();
		$.get('/api/v2/chromosome6_a_c').done(function(info){
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
				<#---Get the selected id in the a-c questionnaire part-->
				var patient_id_a_c = selected['id'];
				<#---Get the owner user name (this one is the same in all questionnaire parts and array data of one patient
						and could be used as patient id. -->
				var ownerUsername = selected['text'];
				<#---Get the data of the second part of the questionnaire-->
				$.get('/api/v2/chromome6_d_h').done(function(dhInfo){
					var patient_items_d_h = dhInfo['items'];
					<#--Check for each item if the owneruser name is the one we're looking for--->
					$.each(patient_items_d_h, function(index, patient_dh){
						if(patient_dh['ownerUsername']=== ownerUsername){
							<#---Save the id of the patient in this questionnaire part-->
							patient_id_d_h = patient_dh['id'];
						}
					});
					<#---Get the next id (of part three)-->
					$.get('/api/v2/chromome6_i_L').done(function(ilInfo){
						var patient_items_i_l = ilInfo['items'];
						$.each(patient_items_i_l, function(index, patient_il){
							if(patient_il['ownerUsername']=== ownerUsername){
								patient_id_i_l = patient_il['id'];
							}
						});
						<#---Get the id of the array data-->
						$.get('/api/v2/chromosome6_array').done(function(arrayData){
							var patient_array = arrayData['items'];
							$.each(patient_array, function(index, patient_array_info){
								if(patient_array_info['ownerUsername']===ownerUsername){
									$.getScript('https://rawgit.com/marikaris/845fe9c278035feb64df'+
									'/raw/4666a221c6b40ec3043e5d5f9d46b5cccd046821/processQuestionnaireData_v2.js').done(function(){
										<#---Get the info and put it in the table-->
										getGenotype(patient_array_info['_href'], '#patient_chromosome');
										getChrAnswerData(patient_id_a_c, 'chromosome6_a_c', putInTable);
										getChrAnswerData(patient_id_d_h, 'chromome6_d_h', putInTable);
										getChrAnswerData(patient_id_i_l, 'chromome6_i_L', putInTable);
										<#--Search through table, code from: http://stackoverflow.com/questions/31467657/how-can-i-search-in-a-html-table-without-using-any-mysql-queries-just-a-plain-j-->
										$("#search_through_table").keyup(function(){
       						 				_this = this;
        									<#-- Show only matching TR, hide rest of them-->
        									$.each($("#patient-table tbody").find("tr"), function() {
            									if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1){
               										$(this).hide();
            									}else{
          							       			$(this).show();
          							  			}                
       										});
    									}); 
									});
								}
							});
						});
					});
				});
			});
		});	
	});
</script>