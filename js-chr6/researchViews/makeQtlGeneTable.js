var geneInformation = [];
function getGenes(symptom, threshold, div){
/**This function gets the genes with significant lodscore from the R api*/
	$.get('/scripts/getSignificantGenes/run?threshold='+threshold+'&symptom='+symptom).done(function(qtlData){
		geneInformation = [];
		var deferredObj = $.Deferred();
		qtlData= qtlData.split('lod')[1];
		var significantGenes = qtlData.split('\n');
		if(!significantGenes[1].startsWith('<')){
			$.each(significantGenes, function(i, geneInfo){
				geneInfo = geneInfo.split(/\s+/);
				var ensembl = geneInfo[0];
				var lodScore = geneInfo[3];
				//if the total length of the list is accomplished, go on
				if(i=== significantGenes.length-1){
					deferredObj.resolve();
				};
				//get the information of the gene
				getGeneInfo(ensembl, lodScore, function(information){
					geneInformation.push(information);
					//when all genes are processed
					deferredObj.done(function(){
						//sort the genes on lodscore
						geneInformation.sort(function(gene1, gene2){
							return molgenis.naturalSort(gene2.lodScore, gene1.lodScore);
						});
						//put the genes in the table
						putGenesInTable(geneInformation, div);
						//make gwas traits clickable and link to related article
						$('.gwas p').click(function(){window.open($(this).data('pubmed'))});
						//change color and font weight on hover
						$('.gwas p').hover(function(){
							$(this).css('color', 'blue');
							$(this).css('font-weight', 'bold');
							});
						$('.gwas p').mouseout(function(){
							$(this).css('color', 'black');
							$(this).css('font-weight', 'normal');
							});
					});
				});
			});
		};
		
	});
};

function getGeneInfo(ensembl_id, lodScore, callback){
/**This function gets the gene information from the molgenis database, using the REST api*/
	ajax('/api/v2/genes/'+ensembl_id).then(function(geneData){
		geneData = JSON.parse(geneData);
		var name = geneData['gene_name'];
		var start = geneData['start'];
		var stop = geneData['stop'];
		var omim_acc = geneData['omim_morbid_accesion'];
		var omim_desc = geneData['omim_morbid_description'];
		var description = geneData['gene_info'];
		var type = geneData['gene_type'];
		var cgd_condition = geneData['cgd_condition'];
		var cgd_inheritance = geneData['cgd_inheritance'];
		var gwas_ids = geneData['gwas'];
		var information = {'name':name, 'start':start, 'stop':stop, 'omim_acc':omim_acc, 'omim_desc':omim_desc,
		'description':description, 'type':type, 'cgd_condition':cgd_condition, 'cgd_inheritance':cgd_inheritance,
		'gwas':gwas_ids, 'ensembl':ensembl_id};
		var gwas = information['gwas'];
		var gwasInfo = [];
		//process the gwas catalog information (if there is any)
		if(gwas !== undefined){
			if(gwas.length > 0){
				$.each(gwas, function(i, gwasId){
					var id = gwasId['gwas'];
					getGwasInfo(id, function(gwas_info){
						if(gwas_info['trait'].split(',').length-1 > 3){gwas_info['trait'] = 'multiple matched traits'};
						gwasInfo.push(gwas_info);
						if(i === gwas.length-1){
							information['gwas'] = gwasInfo;
							information['lodScore'] = lodScore;
							callback(information);
						};
					});
				});
			}else{
				information['lodScore'] = lodScore;
				//now that all gene information is saved in one object, the information can be processed further
				callback(information);
			};
		};
	});
};

function getGwasInfo(id, callback){
/**This function gets the gwas information from molgenis, using the REST api*/
	ajax('/api/v2/gwas/'+id).then(function(gwas_table_info){
		gwas_table_info = $.parseJSON(gwas_table_info);
		var trait = gwas_table_info['mapped_trait'];
		var pubmedLink = gwas_table_info['link'];
		callback({'trait':trait, 'pubmed':pubmedLink});
	});
};

function putGenesInTable(genes, div){
	/**This function puts given genes in a table with their information*/
	$(div).html('<table class="table table-hover"><thead><tr><th>Gene name</th>'+
				'<th>Start position</th><th>Stop position</th><th>Description</th>'+
				'<th>Gene type</th><th>OMIM</th><th>CGD</th><th>GWAS catalog</th>'+
				'<th>Patients</th><th>Qtl lodscore</th>'+
				'</tr></thead><tbody id="significantQtlGeneTable"></tbody></table>');
	$(div).prepend('<form class="navbar-form role="search">'+
   					'<div class="input-group add-on">'+
      					'<input id = "searchQtlTable" type="text" class="form-control" placeholder="Search" name="srch-term" id="srch-term">'+
     		 			'<div class="input-group-btn">'+
       						'<span class="btn btn-default" type="submit"><i class="glyphicon glyphicon-search"></i></span>'+
      					'</div>'+
    				'</div>'+
 	 			'</form>');
	searchThroughTable('#searchQtlTable', div);
	$.each(genes, function(i, gene){
		if(gene.cgd_condition === undefined){
			gene.cgd_condition = '';
			gene.cgd_inheritance ='';
		}
		if(gene.description === undefined){
			gene.description = '';
		}
		$('#significantQtlGeneTable').append('<tr><td data-ensembl="'+gene['ensembl']+'">'+
											gene['ensembl']+ ':' +gene['name']+'</td>'+
											'<td>'+gene['start']+'</td>'+
											'<td>'+gene['stop']+'</td>'+
											'<td>'+gene['description']+'</td>'+
											'<td>'+gene['type']+'</td>'+
											'<td class="omim '+gene['ensembl']+'"></td>'+
											'<td>'+gene['cgd_condition']+' - '+
											gene['cgd_inheritance']+'</td>'+
											'<td class="gwas '+gene['ensembl']+'"></td>'+
											'<td id="effect-'+gene.ensembl+'"></td>'+
											'<td>'+gene['lodScore']+'</td></tr>');
		if(gene['gwas'].length > 0){
			$.each(gene['gwas'], function(i, gwas){
				$('.gwas.'+gene['ensembl']).append('<p data-pubmed="'+gwas['pubmed']+'">'+
													gwas['trait']+'</p>');
			});
		};
		getGeneEffect(gene.ensembl, function(geneId, effect){$('#effect-'+geneId).html(effect)});
		var omim_acc = gene['omim_acc'].substring(2, gene['omim_acc'].length-2).split(/\', \'[ ]?/);
		var omim_desc = gene['omim_desc'].substring(1, gene['omim_desc'].length-1).split(/\', \'[ ]?/);
		$.each(omim_acc, function(i, acc){
			description = omim_desc[i].replace(/\'/g, '').replace(/^ /, '');
			description = description.charAt(0).toUpperCase() + description.slice(1).toLowerCase();
			$('.omim.'+gene['ensembl']).append('<p data-omim="'+acc+'">'+description+'</p><br/>');
		});
	});
};
function ajax(url) {
/**Got this function from http://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call
It does an ajax get request with promises (so possible to check when done)*/
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(this.responseText);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.send();
  });
};

function searchThroughTable(searchDiv, tableDiv){
	//Search through table, code from: http://stackoverflow.com/questions/31467657/how-can-i-search-in-a-html-table-without-using-any-mysql-queries-just-a-plain-j
	$(searchDiv).keyup(function(){
   		_this = this;
      	// Show only matching TR, hide rest of them
  	 	$.each($(tableDiv+" tbody").find("tr"), function() {
        	if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) == -1){
      			$(this).hide();
    		}else{
				$(this).show();
          	};                
    	});
    }); 
};

function getGeneEffect(geneId, callback){
	/**This function calls an R script which gets the number of patients with the gene deleted, duplicated, or just two copies*/
	$.get('/scripts/getGeneEffect/run?geneId='+geneId).done(function(data){
		data = data.split('[1] ');
		del = data[1];
		normal = data[2];
		dup = data[3];
		callback(geneId, 'del: '+del+'<br/>normal: '+normal+'<br/>dup: '+dup);
	});
}