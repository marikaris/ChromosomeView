//global variable with qtl data, filled in extractBodyFromHTML
var qtlData;
/*This file should make a qtl plot on molgenis from a processed R file which returns HTML output (qtlcharts)*/
function plotQtl(div, symptom){
	/**This function plots the qtl using an R script*/
	$.get('/scripts/plot_qtl/run?symptom='+symptom).done(function(data){
		var data = extractBodyFromHTML(data);
		$(div).html(data);
		runScanone();
	});
}
function extractBodyFromHTML(wholeHTML){
/**This function extracts the information that is needed to plot the QTL from the HTML data created by R*/
	//remove the line breaks
	var data = wholeHTML.replace(/\n/g, '');
	/*get the information in the body (the head contains references to files that do not 
	work because they are not on the website, but in .molgenis/omx/data/filestore). The files are added
	to the head using appendToMolgenisHead()*/
	data = data.match(/\<body [a-z="-:;]+\>([:;/{,.}0-9a-zA-z \<\>="_-]+)\<\/body\>/);
	//the data inside de body
	data = data[1];
	//divide the content of the body in divs and scripts
	content = data.match(/(\<div [a-z="_]+\>[:;\>/\t \<a-zA-Z="0-9-]+\<\/div\>)[\t ]?\<script [-a-z="_/ 0-9]+\>([-\{\}"a-zA-Z:_0-9,\[\].]+)\<\/script>[\t ]?\<script [-a-z="_/ 0-9]+\>([-\{\}"a-zA-Z:_0-9,\[\].]+)/);
	//get the div's
	var div = content[1];
	//get the data inside script tags (is JSON code, so convert to JSON to use later on)
	qtlData = JSON.parse(content[2]);
	script_view = JSON.parse(content[3]);
	return div;
}
function appendToMolgenisHead(){
/**This function puts the functionality to plot qtl information (generated using R) in d3 in the head*/
	appendDocElementToHead('/js/js-chr6/lib/qtlcharts/index-min.js');
	$('head').append('<link href="/css/styling-chr6/lib/d3panels.min.css" rel="stylesheet" />');
	appendDocElementToHead('/js/js-chr6/lib/qtlcharts/d3panels.min.js');
	appendDocElementToHead('/js/js-chr6/lib/qtlcharts/iplotScanone_noeff.js');
	appendDocElementToHead('/js/js-chr6/lib/qtlcharts/iplotScanone_ci.js');
	appendDocElementToHead('/js/js-chr6/lib/qtlcharts/iplotScanone_pxg.js');
};
function appendDocElementToHead(url){
/**This function creates a script tag with a given URL and puts it in the head of the webpage, 
this function is the first that should be called, before plotting a qtl*/
	var element = document.createElement('script');
	element.type = 'text/javascript';
	element.src = url;
	$('head').append(element);
};

function runScanone(){
//scanone code of kbroman on github, altered to make it work
/**This function takes the scanone output to construct the qtl plot*/
	//The dif in which the plot should be made
	var widgetdiv = '#'+$('.iplotScanone').attr('id');
	//where the data is located
	x = qtlData.x;
	var width = 1200;
	var height = 600;
	//where the chartopts are
	var chartOpts = x.chartOpts;
	//make the svg chart
	d3.select(widgetdiv).append("svg").attr("width", width).attr("height", height).attr("class", "qtlcharts");
		//call the rest of the functionality
		if (x.pxg_type === "ci") {
		  	iplotScanone_ci(widgetdiv, x.scanone_data, x.pxg_data, chartOpts);
		} else if (x.pxg_type === "raw") {
		  iplotScanone_pxg(widgetdiv, x.scanone_data, x.pxg_data, chartOpts);
		} else {
		  iplotScanone_noeff(widgetdiv, x.scanone_data, chartOpts);
		}
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
function getMaxQtlPeek(symptom, log_threshold, callback, thresholdDiv, alpha){
/**This function returns the max of all qtl peeks in a qtl, given a symptom*/
	var max;
	ajax('/scripts/getMaxPeekOfQtl/run?symptom='+symptom).then(function(qtlData) {
		max = qtlData.split('[1] ')[1];	
		callback(symptom, max, log_threshold, thresholdDiv, alpha);
	});
};
function calculateThreshold(alpha, thresholdDiv, symptom, div){
/**This function calculates the threshold of the qtl lod score, by calling an R script, using a given alpha value,
then it puts the threshold in the plot*/
	$.get('/scripts/getThreshold/run?symptom='+symptom+'&alpha='+alpha).done(function(data){
    	//split the output on [1], because lots of irrelevant information is returned
    	data = data.split('[1] ');
    	//A list is created, and always the 2nd last element in the list, is the threshold (only way to return this in R)
    	var log_threshold = data[1];
    	//first get the max peek, then plot the threshold
    	getMaxQtlPeek(symptom, log_threshold, plotThreshold, thresholdDiv, alpha);
    	$.getScript('/js/js-chr6/researchViews/makeQtlGeneTable.js').done(function(){
			getGenes(symptom, log_threshold, div);
		});
	});
};

function plotThreshold(symptom, max, log_threshold, thresholdDiv, alpha){
/**Plots the threshold in the qtl plot*/
	//the function that converts the threshold to pixels, using the formula to calculate the location of the threshold in the d3 plot 
    var convertThreshold = function(x, max){return 480-x*(435/max)};
    //get the threshold in pixels
    var figureThreshold = convertThreshold(log_threshold, max);
    if(figureThreshold < 38){
    	figureThreshold = 38;
    }
    //the information about the line to plot (the threshold)
    var lineData = [{x:60, y:figureThreshold}, {x:799, y:figureThreshold}];
    //the function to plot the thresholdline
    var lineFunction = d3.svg.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .interpolate("linear");
    //select the qtl chart
    var chart = d3.select('#lodchart .d3panels');
    chart.selectAll('#thresholdLine').remove();
    chart.selectAll('#thresholdRect').remove();
    //select all g's in the chart
    var g = chart.selectAll('g');
    //append the line
    g.append("path")
                .attr("d", lineFunction(lineData))
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("fill", "none")
                .attr('id', 'thresholdLine');
    //append a rectangle that blurs the not significant area in the plot
    g.append('rect').attr('x', 60).attr('y', figureThreshold).attr('width', 740)
        				.attr('height', 489-figureThreshold).attr('fill', '#F5A9A9').attr('opacity', 0.1)
        				.attr('id', 'thresholdRect');
    $(thresholdDiv).html('<b>Significant lodscore threshold (with alpha: '+alpha+'): </b>');
    $(thresholdDiv).append(log_threshold);
};
