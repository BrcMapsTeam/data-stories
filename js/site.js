
$.ajax({
    url: 'https://proxy.hxlstandard.org/data.json?url=https%3A//docs.google.com/spreadsheets/d/1CieP74RcfofqdCNxJQSj6GVtuKEZUM9-EYT6HtPUh1Q/edit%23gid%3D0&strip-headers=on&force=on',
	dataType: 'json',
    success: function(data) {
        initGrid(data);
    }
});

hover = false;

// hxlProxyToJSON: reading hxl tags and setting them as keys for each event
// input is an array with hxl tags as first object, and then the data as objects
// output is an array with hxl tags as keys for the data objects

function hxlProxyToJSON(input) {
    var output = [];
    var keys = []
    input.forEach(function (e, i) {
        if (i == 0) {
            e.forEach(function (e2, i2) {
                var parts = e2.split('+');
                var key = parts[0]
                if (parts.length > 1) {
                    var atts = parts.splice(1, parts.length);
                    atts.sort();
                    atts.forEach(function (att) {
                        key += '+' + att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function (e2, i2) {
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}


function initGrid(data) {
    data = hxlProxyToJSON(data);
    data = formatKeywords(data);
    generateGrid(data);
	generateButtons(data);
	var $grid;
	$('.container').imagesLoaded(function(){

		$grid =  $('#grid').isotope({
		  // options
		  itemSelector: '.grid-item',
		  layoutMode: 'fitRows',
		  masonry: {
      		columnWidth: '.grid-item'
    	  }
		});		
	});


	$('.filter-button-group').on( 'click', 'button', function() {
		$('.filterbutton').removeClass('highlight');
	    var filterValue = $(this).attr('data-filter');
	    $grid.isotope({ filter: filterValue });
	    $(this).addClass('highlight');
	});

}

function generateGrid(data) {

    data.forEach(function (d, i) {
        var classes = 'grid-item';
        d["#keywords"].forEach(function (c, i) {
            classes += ' ' + c.replace(' ', '_').toLowerCase();
        });

		var html = '<div id="grid'+i+'" class="'+classes+'"><img id="image'+i+'" src="'+d["#image"]+'" /><div id="overlay'+i+'" class="overlay">';
		html+='<h3 class="grid-title">'+d["#title"]+'</h3><p class="overlaydesc">'+d["#description"]+'</p>';
		html +='</div></div>';

		$('#grid').append(html);

		$('#overlay'+i).on('click',function(){
			if($('#overlay'+i).css('opacity')>0.5){
				window.open(d["#url"], '_blank');
			}
		});

		$('#grid'+i).on("mouseenter", function(){						
        	$('#overlay'+i).fadeIn(400);
    	});

    	$('#grid'+i).on("mouseleave", function(){	
        	$('#overlay'+i).stop().fadeOut(100);
    	});
	});
}

function formatKeywords(data) {
    data.forEach(function (c, i) {
        var temp = c["#keywords"].split(',');
        temp.forEach(function (c, i) {
            temp[i] = c.trim().replace(' ', '_').toLowerCase();
        })
        c["#keywords"] = temp;
    })
    return data;
}



function generateButtons(data) {
    var filters = [];
	data.forEach(function(d, i){
		d["#keywords"].forEach(function(tag, i){
			if(filters.indexOf(tag)==-1){
		        filters.push(tag);
			}
		});
	});
	filters.forEach(function(f){
	    var html = '<button class="filterbutton" data-filter=".' + f + '">' + f.replace('_', ' ').replace(/\b\w/g, function (l) { return l.toUpperCase() }) + '</button> ';
		$('.filter-button-group').append(html);
	});
}