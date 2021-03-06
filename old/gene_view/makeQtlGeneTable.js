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
				if(i=== significant=Genes.length-1){
					deferredObj.resolve();
				};
				getGeneInfo(ensembl, lodScore, function(information){
					geneInformation.push(information);
					deferredObj.done(function(){
						geneInformation.sort(function(gene1, gene2){
							return molgenis.naturalSort(gene2.lodScore, gene1.lodScore);
						});
						putGenesInTable(geneInformation, div);
					});
				});
			});
		};
		
	});
};

function getGeneInfo(ensembl_id, lodScore, callback){
/**This function gets the gene information from molgenis, using the REST api*/
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
			callback(information);
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
	$(div).html('<table class="table table-hover"><thead><tr><th>Gene name</th>'+
				'<th>Start position</th><th>Stop position</th><th>Description</th>'+
				'<th>Gene type</th><th>OMIM</th><th>CGD</th><th>GWAS catalog</th>'+
				'<th>Qtl lodscore</th>'+
				'</tr></thead><tbody id="significantQtlGeneTable"></tbody></table>');
	$(div).prepend('<form class="navbar-form navbar-right" role="search">'+
   					'<div class="input-group add-on">'+
      					'<input id = "searchQtlTable" type="text" class="form-control" placeholder="Search" name="srch-term" id="srch-term">'+
     		 			'<div class="input-group-btn">'+
       						'<span class="btn btn-default" type="submit"><i class="glyphicon glyphicon-search"></i></span>'+
      					'</div>'+
    				'</div>'+
 	 			'</form>');
	searchThroughTable('#searchQtlTable', div);
	$.each(genes, function(i, gene){
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
											'<td>'+gene['lodScore']+'</td></tr>');
		if(gene['gwas'].length > 0){
			$.each(gene['gwas'], function(i, gwas){
				$('.gwas.'+gene['ensembl']).append('<p data-pubmed="'+gwas['pubmed']+'">'+
													gwas['trait']+'</p>');
			});
		};
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