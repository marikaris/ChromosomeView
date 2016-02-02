/**NAME: chromoChart
 *EXTRA IMPORTS NEEDED: jQuery and D3 should be imported.
 *PURPOSE: This library is created to visualize chromosome data of patients.
 *AUTHOR: Mariska Slofstra
 *GENERAL USAGE: chromoChart.functionName(args)
 *ATTENTION: The arguments should be given in json structure.
 */
var chromoChart = function () {
        /**FUNCTION: makeChromosome makes an x axis that is the visualisation of a chromosome.
         *REQUIRED ARGUMENTS:
	 *"chr_length"		- the length of the chromosome
	 *"div"		- the selector string of the chart where the bar should be in
	 *OPTIONAL ARGUMENTS:
	 *"figureWidth"	- the width of the figure (default 500)
	 *EXAMPLE USAGE:
	 *chromoChart.makeChromosome({
         *"chr_length" 	: 170805979,
	 *"div"		: "#chromosome"		
         *});
        */
	function makeChromosome(args) {
    		var chr_length = args["chr_length"];
    		var figureWidth = args["figureWidth"];
    		var div = args["div"];
    		figureWidth = typeof figureWidth !== 'undefined' ? figureWidth : 500;
			//The div that contains the chart. This div is located in the figure div that
			//contains the title of the image
	 		var svgContainer = d3.select(div).append("svg").attr("width", figureWidth)
	                                     .attr("height", 30);
	 		//Tell what properties the axis should have
	 		var axisScale = d3.scale.linear().domain([0.001, chr_length]).range([0, figureWidth]);
			//Create the x axis attributer
			var xAxis = d3.svg.axis().scale(axisScale).ticks(10, ",.1s").tickSize(6, 5);
	        //Publish the x axis     
	        var xAxisGroup = svgContainer.append("g").call(xAxis);
    	};
    	/**FUNCTION: makeBar creates the bar with patient information in the visualisation of a chromosome. 
    	 *REQUIRED ARGUMENTS: 
    	 *"start" 		- start position of the mutation 
    	 *"stop"  		- stop position of the mutation
    	 *"mutation_type" 	- mutation type 
    	 *"patient_id" 	- patient id
    	 *"chart_div" 		- the selector string of the chart where the bar should be in 
    	 *"chr_length"	- the chromosome length
    	 *OPTIONAL ARGUMENTS:
    	 *"barHeigth"		- The height of the bar with the chromosome information of the 
    	 *			patient (default 20)
    	 *"deletion_color"	- The color of the region of the patient when the mutation is 
    	 *			a deletion. (default "orange")
    	 *"duplication_color" 	- The color of the region of the patient when the mutation is
    	 *			a duplication. (default "steelblue")
    	 *"bar_color"		- The color of the bar of the patient (default "#99CCFF")
    	 *"figureWidth"		- The width of the bar (default 500)
    	 *"hemi_del_color"	- The color of the bar in a hemizygous deletion.
    	 *"triplication_color" - The color of the bar in a triplication.
    	 *"mutations" - This function contains the mutations of the patient in this format:
    	 * 				[startposition, stopposition, mutationtype, benign]. If this variable 
    	 				is used, mutation, start and stop can be left out. 
    	 *EXAMPLE USAGE:
    	 *chromoChart.makeBar({
    	 *"start"			:483938,
    	 *"stop"			:598308,
    	 *"mutation_type"		:"deletie", //can be dutch or english
    	 *"chr_length"			:170805979,
    	 *"chart_div"		:"#bar",
    	 *"patient_id"		:"Henk"});
    	 */
    	function makeBar(args){
	    	//Setting the variables from the given arguments.
	    	var mutations = args["mutations"];
	    	var start = args["start"];
	    	var stop = args["stop"];
	    	var patient_id = args["patient_id"];
	    	var mut_type = args["mutation_type"];
	    	var chart_div = args["chart_div"];
	    	var chr_size = args["chr_length"];
	    	var barHeight = args["barHeigth"];
	    	var delCol = args["deletion_color"];
	    	var hemiDelCol = args['hemi_del_color'];
	    	var dupCol = args["duplication_color"];
	    	var tripCol = args['triplication_color'];
	    	var barCol = args["bar_color"];
	    	var figureWidth = args["figureWidth"];
	    	var benign = args["benign"];
	    	//Setting the defaults.
	    	hemiDelCol = typeof delCol !== 'undefined' ? delCol : "orange";
	    	delCol = typeof delCol !== 'undefined' ? delCol : "#FF6600";
			barCol = typeof barCol !== 'undefined' ? barCol : "#99CCFF";
			figureWidth = typeof figureWidth !== 'undefined' ? figureWidth : 500;
			dupCol = typeof dupCol !== 'undefined' ? dupCol : "steelblue";	
			tripCol = typeof tripCol !== 'undefined' ? tripCol : "#000066";		
			//If the height of the bar is not set, set to 20px.
			barHeight = typeof barHeight !== 'undefined' ? barHeight : 20;		
			benign = typeof benign !== 'undefined' ? benign : false;		
			mutations = typeof mutations !== 'undefined' ? mutations : [[start, stop, mut_type, benign]];	
			//Set range of width
			var x = d3.scale.linear().range([0, figureWidth]);
			$(chart_div).append('<div id="patient_container_'+patient_id+'" class="patient_container draggable ui-widget-conten"></div>');
			var patient_container = $('#patient_container_'+patient_id);
			$(patient_container).append('<div class="'+patient_id+
				'" style="display:none"></div><svg class="chart" id="'+
				patient_id+'"></svg>');
		//Create the chart in which the bar will come.
		var chart = d3.select("#"+patient_id).attr("width", figureWidth);  
		//Fill the chart with information
		chart.attr("height", barHeight);
		//Calculate how much pixels a base pair is.
		var bp=figureWidth/chr_size;
		var data = [{"start":start, "stop":stop}];	
		//Create a bar	
		var bar = chart.selectAll("g")
			   	.data(data)
				.enter().append("g")
				.attr("transform", function(d, i) { return "translate(0," + 
					i * barHeight + ")"; });
		//Create the bar for the total chromosome (light blue).
		bar.append("rect")
		     .attr("width", figureWidth)
		     .attr("height", barHeight - 1)
		     .attr("id", "total"+patient_id);
		//put each mutation in the bar of the patient
		$.each(mutations, function(mutationNr, mutation){
			var mutationStart = mutation[0];
			var mutationStop = mutation[1];
			var mutationType = mutation[2];
			var mutationBenign = mutation[3];
			addMutationsToBar(mutationType, mutationStart, mutationStop, delCol, dupCol, tripCol,  
								hemiDelCol, barCol, bp, barHeight, bar, patient_id, figureWidth, 
								mutationNr);
		});
		//toggle the start and stop location
		$("#"+patient_id).click(function(){$("."+patient_id).toggle()});
	}
	/**FUNCTION: addLegend adds the legend to the chart.
	 *REQUIRED ARGUMENTS: 
	 *"div"	- the selector string of the chart where the bar should be in 
	 *OPTIONAL ARGUMENTS:
	 *"deletion_color"	- The color of the region of the patient when the mutation is 
	 *				a deletion. (default "orange")
	 *"duplication_color" 	- The color of the region of the patient when the mutation is 
	 *				a duplication. (default "steelblue")
	 *"gene_color"		- The color that the marked genes in the bar have (default "red")
	 *"svg_width"		- The width of the legend (default "30em")
	 *"triplication_color"- The color of the triplication in the bar
	 *"hemi_del_color" - The color of the hemizygous deletion color
	 *EXAMPLE USAGE:
	 *chromoChart.addLegend({"div":"#legend"});
	 */
	function addLegend(args){
    	//setting the arguments.
		var svg_width = args["svg_width"];
	    var legendDiv = args["div"];	
	    var deletionColor= args["deletion_color"];
	   	var duplicationColor= args["duplication_color"];
	   	var geneColor= args["gene_color"];	
	   	var hemiDelCol = args['hemi_del_color'];
	    var tripCol = args['triplication_color'];
	   	//setting the defaults
	   	hemiDelCol = typeof delCol !== 'undefined' ? delCol : "orange";
		tripCol = typeof dupCol !== 'undefined' ? dupCol : "#000066";
		svg_width = typeof svg_width !== 'undefined' ? svg_width : "30em";
		deletionColor = typeof deletionColor !== 'undefined' ? deletionColor : "#FF6600";
		duplicationColor=typeof duplicationColor!=='undefined'?	duplicationColor:"steelblue";
		geneColor = typeof geneColor !== 'undefined' ? geneColor : "red";	
		//Here the legend div is selected by d3, a svg is added and a g is added which is
		//needed for the drawing of rectangulars.	
		var svg = d3.select(legendDiv).append("svg").attr("width", svg_width)
						.attr("height", "4em").append("g");
		//Here a rectangular is made that shows the color of a hemizygous deletion in the graph
		svg.append("rect").attr("width", "3em").attr("height","1.5em")
					.style("fill", hemiDelCol).style("stroke", "black");
		//Text is added to tell what the color of the rectangular means
		svg.append("text").attr("y", "3em").text("Hemizygous");
		svg.append("text").attr("y", "4em").text("deletion");
		//Here a rectangular is made that shows the color of a homozygous in the graph.
		svg.append("rect").attr("width", "3em").attr("height","1.5em").attr("x", "6em")
					.style("fill", deletionColor).style("stroke", "black");
		svg.append("text").attr("y", "3em").attr("x", "6em").text("Homozygous");
		svg.append("text").attr("y", "4em").attr("x", "6em").text("deletion");
		//Here a rectangular is made that shows the color of a duplication in the graph
		svg.append("rect").attr("width", "3em").attr("height","1.5em").attr("x", "12em")
						.style("fill", duplicationColor).style("stroke", "black");
		svg.append("text").attr("y", "3em").attr("x", "12em").text("Duplication");
		//Here a rectangular is made that shows the color of a triplication in the graph
		svg.append("rect").attr("width", "3em").attr("height","1.5em").attr("x", "18em")
						.style("fill", tripCol).style("stroke", "black");
		svg.append("text").attr("y", "3em").attr("x", "18em").text("Triplication");
	}
	/**FUNCTION: addGeneToAllTable
	 *INFORMATION: this function is private and only called in the addGenes function,
	 *therefore, there is no json structure needed, it cannot be used by the user.
	 *PURPOSE: to add one gene to the all genes table (this function is called each time
	 *addGenes finds a gene that is connected to a known disease. 
	 */
	function addGeneToAllTable(ensembl, gene, start, stop, all_table){
		$(all_table).append(		'<tr>'+
										'<td class="gene_name" data-ensembl="'+ensembl+'">'+gene+'</td>'+
										'<td class="position">'+start+'...'+stop+'</td>'+
									'</tr>');
	}
	/**FUNCTION: addGeneToToxicTable
	 *INFORMATION: this function is private and only called in the addGenes function,
	 *therefore, there is no json structure needed, it cannot be used by the user.
	 *PURPOSE: to add one gene to the toxic genes table (this function is called each time
	 *addGenes finds a gene that is connected to a known disease. 
	 */
	function addGeneToToxicTable(desc, acc, ensembl, gene, start, stop, toxicTable){
		//Split the diseases if there are more than one
		var diseases =desc.substring(1, desc.length-1).split(',<br/>');						
		var diseaseDescription = "";
		var count = 0;
		//Split the accesions if there are more than one
		accesions = acc.substring(1, acc.length-1).split(",");
		//make a paragraph around each disease in the table
		$.each(diseases, function(i, disease){
			diseaseDescription +='<a class="disease" href="http://www.omim.org/entry/'+accesions[count]+
				'" target="_blank">'+disease +'</a><br/>'
			count += 1;
		});
		//append new row to table with the gene and the diseases related with it.
		$(toxicTable).append(	'<tr>'+
						'<td class="gene_name"><a href="http://www.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g='+
							ensembl+'" target="_blank">'+gene+'</a>'+
						'</td>'+
						'<td class="diseases">'+diseaseDescription+'</td>'+
						'<td class="position">'+start+'...'+stop+'</td>'+
					'</tr>');
	}
	/**FUNCTION: addGenes adds the genes to the chart in the mutated region of the patient
	 * 			and to given tables (by default).
	 *REQUIRED ARGUMENTS: 
	 *"start"		- the start position of the mutation of the patient.
	 *"stop" 		- the stop position of the mutation of the patient.
	 *"id"			- the id of the patient.
	 *"tox_table" 		- by default the string of the selector of the toxic genes table is 
	 *				needed. When add2toxTable is set false, this argument is not needed.
	 *"all_table" 		- by default the string of the selector of the all genes table is 
	 *				needed. When add2allTable is set false, this argument is not needed.
	 *"basepair_length" 	- the length of a basepair in the figure, this is calculated by 
	 *				figure width/chromosome length. Because add2chart is by default 
	 *				true, this argument is needed. When it is set false, it could
	 *				be left out. 
	 *"file"		- The file with gene information, should be in this format:
	 *				https://gist.githubusercontent.com/marikaris/
	 * 						010f64b563619bf5e69f/raw/12fb20ef812812ce9c22feec5fcd0704ee426437/genes.json
	 *OPTIONAL ARGUMENTS:
	 *"color"		- The color of the genes in the chart (default: "red")
	 *"add2chart"		- Boolean that tells if the genes should be added to the chart 
	 *				(red stripes)(default: true)
	 *"add2toxTable"	- Boolean that tells if the genenames and linked diseases should
	 * 				be added to the toxic genes table.(default:true)
	 *"add2allTable"	- Boolean that tells if the genenames and linked diseases should
	 * 						be added to the all genes table.(default:true)
	 *EXAMPLE USAGE:
	 *chromoChart.addGenes({	"start":2987298,
	 *				"stop" :3323434, 
	 *				"id"   :"Henk",
	 *				"basepair_length": figure_width/chromosome_size,
	 *				"tox_table": "#toxic_table",
	 *				"all_table": "#all_genes_table"
	 *			});
	 *ATTTENTION: several other functions are defined to make working with this function 
	 *easier. These functions are: 
	 *- addGenesToChart (only add2chart is true)
	 *- addGenesToToxTable(only add2toxTable is true)
	 *- addGenesToAllTable(only add2allTable is true)
	 *- addGenesToTables(add2toxTable and add2allTable are true)
	 *The functions can be used at the same time, for easier use, but pay attention:
	 *Each time one of these functions is called, there runs a forloop through a big file,
	 *this takes more time than needed when more than one of these functions are used. 
	 *It is recommended to use only one of these functions to make your application as
	 *efficiently as possible. 
	 */
	function addGenes(args){
		var startPatient = args["start"];
		var stopPatient = args["stop"];
		var idPatient = args["id"];
		var bp = args["basepair_length"];
		var geneFile = args["file"];
		var color = args["color"];
		var add2chart = args["add2chart"];
		var add2toxTable = args["add2toxTable"];
		var add2allTable = args["add2allTable"];
		var tox_table = args["tox_table"];
		var all_table = args["all_table"];
		color = typeof color !== 'undefined' ? color : "red";
		add2chart = typeof add2chart !== 'undefined' ? add2chart : true;
		add2toxTable = typeof add2toxTable !== 'undefined' ? add2toxTable : true;
		add2allTable = typeof color !== 'undefined' ? color : true;
		$.getJSON(geneFile,
			 function(data){
			 	//Select the patient bar
				patient_bar = d3.select("#"+idPatient).append("g");
			 	//Check for each gene if it is in the patients affected region
			 	$.each(data, function(i,gene){			 		
			 		if(gene["start"]<=stopPatient){
						if(gene["stop"]>=startPatient){
							if(add2allTable){
								addGeneToAllTable(gene["ensembl"], gene["gene"], gene["start"], gene["stop"], all_table);
							}
							if(add2chart){
								//Add the bar of the gene to the bar of the patient
								patient_bar.append("rect").attr("x", bp*gene["start"])
								.attr("width", (gene["stop"]-gene["start"])*bp)
								.attr("height", 19).style("fill", "red").attr("class", "gene").attr("data-position", i);
							}
							if(add2toxTable){
								//Check if there is no accesion and thus no phenotype known
								if(gene["morbidAccesion"]!='[]'&&gene["morbidAccesion"]!=']'){
									addGeneToToxicTable(gene["morbidDescription"], gene["morbidAccesion"], gene["ensembl"],
														gene["gene"], gene["start"], gene["stop"], tox_table);
								}
							}
						}
					}
					if(gene["stop"]>=startPatient){
						if(gene["start"]<=stopPatient){
							if(add2chart){
								//Add the bar of the gene to the bar of the patient
								patient_bar.append("rect").attr("x", bp*gene["start"])
									.attr("width", (gene["stop"]-gene["start"])*bp)
									.attr("height", 19).style("fill", "red")
									.attr("class", "gene").attr("data-position", i);							
									//Check for genes that pass both steps (and thus fit completely in the patients mutation)
							}	
							if($('#all_gene_info:contains("'+gene['gene']+'")')){
							}
							else{
								if(add2allTable){
									addGeneToAllTable(gene["ensembl"], gene["gene"], gene["start"], gene["stop"], all_table); 
								}
								if(add2toxTable){
									//Check if there is a known disease related with this disease
									if(gene["morbidAccesion"]!='[]'&&gene["morbidAccesion"]!=']'){
										addGeneToToxicTable(gene["morbidDescription"], gene["morbidAccesion"], gene["ensembl"],
															gene["gene"], gene["start"], gene["stop"], tox_table);
									}
								}
							}	
						}
					}
					
						
				});
			});
	}
	/**FUNCTION: addGenesToChart calls addGenes with other default values (that cannot be changed). 
	 *This way it can be called to add genes to the visualised chromosome of a patient 
	 *REQUIRED ARGUMENTS: 
	 *"start"		- the start position of the mutation of the patient.
	 *"stop" 		- the stop position of the mutation of the patient.
	 *"id"			- the id of the patient.
	 *"basepair_length" 	- the length of a basepair in the figure, this is calculated by 
	 *				figure width/chromosome length. 
	 *"file"		- The file with gene information, should be in this format:
	 *				https://gist.githubusercontent.com/marikaris/
	 *				010f64b563619bf5e69f/raw/12fb20ef812812ce9c22feec5fcd0704ee426437/genes.json
	 *OPTIONAL ARGUMENTS:
	 *"color"			- The color of the genes in the chart (default: "red")
	 *EXAMPLE USAGE:
	 *chromoChart.addGenes({	"start":2987298,
	 *				"stop" :3323434, 
	 *				"id"   :"Henk",
	 *				"basepair_length": figure_width/chromosome_size,
	 *			});
	 */
	function addGenesToChart(args){
		var startPatient = args["start"];
		var stopPatient = args["stop"];
		var idPatient = args["id"];
		var bp = args["basepair_length"];
		var geneFile = args["file"];
		var color = args["color"];
		var add2chart = true;
		var add2toxTable = false;
		var add2allTable = false;
		addGenes({
			"start":startPatient,
			"stop":stopPatient,
			"id":idPatient,
			"basepair_length":bp,
			"file":geneFile,
			"color":color, 
			"add2chart":add2chart,
			"add2toxTable":add2toxTable,
			"add2allTable":add2allTable
		});
	}
	/**FUNCTION: addGenesToToxTable adds genes to the table with toxicGenes by calling the
	 *addGenes function with other default values that cannot be changed. 
	 *REQUIRED ARGUMENTS: 
	 *"start"		- the start position of the mutation of the patient.
	 *"stop" 		- the stop position of the mutation of the patient.
	 *"id"			- the id of the patient.
	 *"tox_table" 		- the string of the selector of the toxic genes table.
	 *"file"		- The file with gene information, should be in this format:
	 *				https://gist.githubusercontent.com/marikaris/
	 * 				010f64b563619bf5e69f/raw/12fb20ef812812ce9c22feec5fcd0704ee426437/genes.json
	 *OPTIONAL ARGUMENTS:
	 *"color"			- The color of the genes in the chart (default: "red")
	 *EXAMPLE USAGE:
	 *chromoChart.addGenesToToxTable({	"start":2987298,
	 *					"stop" :3323434, 
	 *					"id"   :"Henk",
	 *					"tox_table": "#toxic_table"
	 *				});
	 */
	function addGenesToToxTable(args){
		var startPatient = args["start"];
		var stopPatient = args["stop"];
		var idPatient = args["id"];
		var geneFile = args["file"];
		var color = args["color"];
		var add2chart = false;
		var add2toxTable = true;
		var tox_table = args["tox_table"];
		var add2allTable = false;
		addGenes({
			"start":startPatient,
			"stop":stopPatient,
			"id":idPatient,
			"file":geneFile,
			"color":color, 
			"add2chart":add2chart,
			"add2toxTable":add2toxTable,
			"add2allTable":add2allTable,
			"tox_table":tox_table
		});
	}
	/**FUNCTION: addGenesToAllTable adds genes to the table with toxicGenes by calling the
	 *addGenes function with other default values that cannot be changed. 
	 *REQUIRED ARGUMENTS: 
	 *"start"		- the start position of the mutation of the patient.
	 *"stop" 		- the stop position of the mutation of the patient.
	 *"id"			- the id of the patient.
	 *"all_table" 		- the string of the selector of the all genes table.
	 *"file"		- The file with gene information, should be in this format:
	 *				https://gist.githubusercontent.com/marikaris/
	 * 				010f64b563619bf5e69f/raw/12fb20ef812812ce9c22feec5fcd0704ee426437/genes.json
	 *OPTIONAL ARGUMENTS:
	 *"color"			- The color of the genes in the chart (default: "red")
	 *EXAMPLE USAGE:
	 *chromoChart.addGenesToToxTable({	"start":2987298,
	 *					"stop" :3323434, 
	 *					"id"   :"Henk",
	 *					"all_table": "#all_table"
	 *				});
	 */
	function addGenesToAllTable(args){
		var startPatient = args["start"];
		var stopPatient = args["stop"];
		var idPatient = args["id"];
		var bp = args["basepair_length"];
		var geneFile = args["file"];
		var color = args["color"];
		var add2chart = false;
		var add2toxTable = false;
		var all_table = args["all_table"];
		var add2allTable = true;
		addGenes({
			"start":startPatient,
			"stop":stopPatient,
			"id":idPatient,
			"basepair_length":bp,
			"file":geneFile,
			"color":color, 
			"add2chart":add2chart,
			"add2toxTable":add2toxTable,
			"add2allTable":add2allTable,
			"all_table":all_table
		});
	}
	/**FUNCTION: addGenesToTables adds genes to the tables (with toxic and all genes)
	 *by calling the addGenes function with other default values that cannot be changed. 
	 *REQUIRED ARGUMENTS: 
	 *"start"		- the start position of the mutation of the patient.
	 *"stop" 		- the stop position of the mutation of the patient.
	 *"id"			- the id of the patient.
	 *"tox_table" 	- the string of the selector of the toxic genes table.
	 *"all_table" 	- the string of the selector of the all genes table.
	 *"file"			- The file with gene information, should be in this format:
	 *					https://gist.githubusercontent.com/marikaris/
	 * 						010f64b563619bf5e69f/raw/12fb20ef812812ce9c22feec5fcd0704ee426437/genes.json
	 *OPTIONAL ARGUMENTS:
	 *"color"			- The color of the genes in the chart (default: "red")
	 *EXAMPLE USAGE:
	 *chromoChart.addGenesToToxTable({	"start":2987298,
	 *					"stop" :3323434, 
	 *					"id"   :"Henk",
	 *					"tox_table": "#toxic_table", 
	 *					"all_table": "#all_table"
	 *				});
	 */
	function addGenesToTables(args){
		var startPatient = args["start"];
		var stopPatient = args["stop"];
		var idPatient = args["id"];
		var bp = args["basepair_length"];
		var geneFile = args["file"];
		var color = args["color"];
		var add2chart = false;
		var add2toxTable = true;
		var all_table = args["all_table"];
		var tox_table = args["tox_table"];
		var add2allTable = true;
		addGenes({
			"start":startPatient,
			"stop":stopPatient,
			"id":idPatient,
			"basepair_length":bp,
			"file":geneFile,
			"color":color, 
			"add2chart":add2chart,
			"add2toxTable":add2toxTable,
			"add2allTable":add2allTable,
			"all_table":all_table,
			"tox_table":tox_table
		});
	}
	function addMutationsToBar(mutation, start, stop, delCol, dupCol, tripCol,  
								hemiDelCol, barCol, bp, barHeight, bar, id, figureWidth, 
								mutationNr){
		/**This function has as purpose to add mutations to a bar, because a patient can 
		have more than one mutation on the same chromosome. It cannot be called by a user, 
		but is used by the function makeBar. */
		//Save variables.
		var size = stop - start;
		//Put a bar over the previous bar that is colored and defines the mutation
		bar.append("rect").attr("width", bp*size).attr("height", barHeight - 1)
			.attr("x", bp*start).attr("id", id+mutationNr);
		//Position and color the first bar. 		
		$('#'+id+mutationNr).css("width", bp*size);
		//Names of divs with text about start and stop. 
		var start_id = 'start_pos'+id+mutationNr;
		var stop_id = 'stop_pos'+id+mutationNr;
		//Div for text that shows start position. 
		var start_position = $( '<div id="'+start_id+'" class="startStopPosition"/>' );
		$("."+id).append(start_position);
		$("#start_pos"+id+mutationNr).css("margin-left",start*bp-25);
		$("#start_pos"+id+mutationNr).css("margin-right",0);
		//text that shows start position. 
		$("#start_pos"+id+mutationNr).text(start);
		//text that shows start position.
		var stop_position = $( '<div id="'+stop_id+'" class="startStopPosition"/>' );
		//Div for text that shows start position. 
		$("."+id).append(stop_position);
		//Positioning the text.
		$("#stop_pos"+id+mutationNr).css("margin-left",stop*bp+15);
		$("#start_pos"+id+mutationNr).css("margin-bottom","-1em");
		
		//Color the bars based on deletion or duplication and present what it is.
		if(mutation === 'homozygote deletie'||mutation === 'homozygous deletion'||mutation === 'x0'){
			$('#stop_pos'+id+mutationNr).html(stop);
			$('#'+id+mutationNr).css('fill', delCol);
		}else if(mutation === 'hemizygote deletie'||mutation ==='hemizygous deletion'||mutation === 'x1'){
			$('#stop_pos'+id+mutationNr).html(stop);
			$('#'+id+mutationNr).css('fill', hemiDelCol);
		}else if (mutation === 'duplicatie'||mutation === 'duplication'||mutation === 'x3'){
			$('#stop_pos'+id+mutationNr).html(stop);
			$('#'+id+mutationNr).css('fill', dupCol);
		}else if (mutation === 'triplicatie'||mutation === 'triplication'||mutation === 'x4'){
			$('#stop_pos'+id+mutationNr).html(stop);
			$('#'+id+mutationNr).css('fill', tripCol);
		}else{
			$('#stop_pos'+id+mutationNr).html(stop);
			$('#'+id+mutationNr).css('fill', 'grey');
		};
		$("."+id).css("margin-top","1em");
		$("#"+id).css("margin-top","1em");
		$('#total'+id).css('fill', barCol);
	};
	//The public functions are here specified. 
	return {
		makeChromosome:makeChromosome, 
		makeBar:makeBar,
		addLegend:addLegend,
		addGenesToChart:addGenesToChart,
		addGenes:addGenes,
		addGenesToToxTable: addGenesToToxTable,
		addGenesToAllTable: addGenesToAllTable,
		addGenesToTables: addGenesToTables
		};
}();