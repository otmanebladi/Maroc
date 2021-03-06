$currentSection = 1;
$navEnabled = false;
var loaderLength = 3000;
var completePics = ['images/bg1-complete.jpg', 'images/bg2-complete.jpg', 'images/bg3-complete.jpg', 'images/bg4-complete.jpg', 'images/bg5-complete.jpg', 'images/bg6-complete.jpg', 'images/bg7-complete.jpg'];

$(document).ready(function() {

	// Preload pics

	function preloadimages(arr){
	    var newimages=[];
	    var arr=(typeof arr!="object")? [arr] : arr;
	    for (var i=0; i<arr.length; i++){
	        newimages[i]=new Image();
	        newimages[i].src=arr[i];
	    }
	}
 
	preloadimages(completePics);


	$(".loader>div").animate({width:"100%"}, loaderLength, function(){
		$(".loader").animate({opacity:0}, 500, function(){
			$(".loader").css({display:"none"});
		});
	});
	var loaderVal = 0;
	var loaderText = $('.loader .text p span');
	var loaderInterval = window.setInterval(function(){
		loaderVal++;
		loaderText.text(loaderVal);
		if(loaderVal == 100){
			clearInterval(loaderInterval);
		}
	}, loaderLength/120);
	window.setTimeout(function(){
		$(".loader>img").addClass("active");
	},800);
	
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	}else{
		
		var AppRouter = Backbone.Router.extend({
			routes: {
			    "": "home",
			    "section/:id": "section",
			}
		});

		var app_router = new AppRouter;

		app_router.on('route:home', function (id) {
			app_router.navigate("section/1", {trigger: true});
		});

		app_router.on('route:section', function (id) {
			$navEnabled = false;
			$currentSection = parseInt(id);
			$(".sidebar a").removeClass('active');
			$("nav a").removeClass('active');
			if(id>=2){
				$(".sidebar>a:nth-child("+(id-1)+")").addClass("active");
				$("nav>a:nth-child("+(id-1)+")").addClass("active");
			}
			if($("body").attr("class") == undefined){
				initBg(id);
			}else{
				moveBg(id);
			}
			$("body").addClass("loaded");
		});

		function scroll(e){
			console.log("ca scroll ienb");
			if($navEnabled == true && !$('.menu').hasClass('opened')){
				$evt=window.event || e;
				$delta=$evt.detail? $evt.detail*(-120) : $evt.wheelDelta;

			    if($delta >= 0){
			    	if($currentSection>=2){
			    		app_router.navigate("section/"+($currentSection-1), {trigger: true});
			    	}
			    }else{
			    	if($currentSection<=6){
			        	app_router.navigate("section/"+($currentSection+1), {trigger: true});
			        }
			    }
			}
		}

		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"; 
	 
		if (document.attachEvent){
		    document.attachEvent("on"+mousewheelevt, scroll);
		}else if(document.addEventListener){
		    document.addEventListener(mousewheelevt, scroll, false);
		}

		$(".navicon-button").click(function(){
			if($(this).hasClass("active")){
				$(this).removeClass("active").addClass("inactive");
				$(".menu").removeClass("opened").stop().animate({opacity:0}, 500, "easeInOutCubic", function(){
					$(".menu").css("display","none");
				});
			}else{
				$(this).removeClass("inactive").addClass("active");
				$(".menu").css("display","table").addClass("opened").stop().animate({opacity:1}, 500, "easeInOutCubic");
			}
		});

		$("nav a").click(function(e){
			e.preventDefault();
			$link = $(this).attr('href');
			if($navEnabled == true){
				$(".navicon-button").removeClass("active").addClass("inactive");
				$(".menu").stop().animate({opacity:0}, 500, "easeInOutCubic", function(){
					$(".menu").css("display","none").removeClass('opened');
					app_router.navigate($link, {trigger: true});
				});
			}
		});

		$(".sidebar a").click(function(e){
			e.preventDefault();
			$link = $(this).attr('href');
			if($navEnabled == true){
				$(".navicon-button").removeClass("active").addClass("inactive");
				$(".menu").css("display","none");
				app_router.navigate($link, {trigger: true});
			}
		});

		
	    
	    // ------------------- FUNCTIONS -------------------

	    function resize(){
	    	var body = $("body");
	    	$('body>div').css('height',$(window).height()+'px');
	    	
	    	if(body.height()%2 != 0){
	    		$("#background").css("height",(body.height()+1)+"px");
	    	}else{
	    		$("#background").css("height","100%");
	    	}

	    	if(body.width()%2 != 0){
	    		$("#background").css("width",(body.width()+1)+"px");
	    	}else{
	    		$("#background").css("width","100%");
	    	}
	    }

	    function scroll(e){
			if($navEnabled == true && !$('.menu').hasClass('opened')){
				$evt=window.event || e;
				$delta=$evt.detail? $evt.detail*(-120) : $evt.wheelDelta;

			    if($delta >= 0){
			    	if($currentSection>=2){
			    		app_router.navigate("section/"+($currentSection-1), {trigger: true});
			    	}
			    }else{
			    	if($currentSection<=6){
			        	app_router.navigate("section/"+($currentSection+1), {trigger: true});
			        }
			    }
			}
		}

		function initBg(id){
			showSection(id);
			$.each($(".oneBg .bg"),function(){
				if($(this).hasClass("bg-"+id)){
					$(this).addClass("active");
					$(this).css({opacity:1});
				}else{
					$(this).addClass("inactive");
				}
			});
			window.setTimeout(function(){
				animateSection(id, function(){
					hideOtherSections(id);
				});
			},500);
		}

		function hideOtherSections(id){
			for(var sec=0; sec<$('.section').length; sec++){
				if(sec != id){
					$('#section'+sec).css('display','none');
				}
			}
		}

		function moveBg(id){
			$counter = 0;
			$("#section"+id).css({"display":"table"});
			$(".state, .section-head").removeClass("active");
			$(".oneBg .bg-"+id).removeClass("active inactive").addClass("pre-active");
			$("#complete-bg").removeClass().addClass(" active sct"+id);
			$.each($(".oneBg .bg.active"),function(){
				$parent = $(this).parent();
				$(this).css({opacity:1});
				if($parent.hasClass("topLeft")){
					$(this).stop().animate({opacity : 0, right: "-100%"}, 1400, "easeInOutCubic", function(){
						reinitBg(id, $(this));
					});
				}else if($parent.hasClass("topRight")){
					$(this).stop().animate({opacity : 0, bottom : "-100%"}, 1400, "easeInOutCubic", function(){
						reinitBg(id, $(this));
					});
				}else if($parent.hasClass("bottomLeft")){
					$(this).stop().animate({opacity : 0, top : "-100%"}, 1400, "easeInOutCubic", function(){
						reinitBg(id, $(this));
					});
				}else{
					$(this).stop().animate({opacity : 0, left: "-100%"}, 1400, "easeInOutCubic", function(){
						reinitBg(id, $(this));
					});
				}
			});	
		}

		function reinitBg(id, it){
			$counter++;
			it.removeClass("active pre-active").addClass("inactive");
			if($counter == 4){
				$(".oneBg .pre-active").css({opacity:1}).removeClass("pre-active").addClass("active");
				$(".oneBg.topLeft .inactive").css({right : "0", bottom: "0"});
				$(".oneBg.topRight .inactive").css({left : "0", bottom: "0"});
				$(".oneBg.bottomLeft .inactive").css({right : "0", top: "0"});
				$(".oneBg.bottomRight .inactive").css({left : "0", top: "0"});
				$("#complete-bg").removeClass("active");
				animateSection(id, function(){
					hideOtherSections(id);
				});
			}
		}

		function animateSection(id, callback){
			if(id==1 || id==7){
				$("#section"+id+" .state").addClass("active");
				window.setTimeout(function(){
					showSection(id);
					$navEnabled = true;
					callback();
				},400);
			}else{
				$("#section"+id+" .step.state").addClass("active");
				window.setTimeout(function(){
					$("#section"+id+" .section-title.state").addClass("active");
					window.setTimeout(function(){
						$("#section"+id+" .text.state").addClass("active");
						window.setTimeout(function(){
							$("#section"+id+" .section-head").addClass("active");
							showSection(id);
							$navEnabled = true;
							callback();
						}, 200);
					}, 200);
				}, 200);
			}
		}

		function showSection(id){
			$(".section").css({"display":"none"});
			$("#section"+(id)).css({"display":"table"});
		}

		resize();

		$(window).resize(function(){
			resize();
		});

		Backbone.history.start();

	}

});