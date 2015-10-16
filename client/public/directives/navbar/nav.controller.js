'use strict';

angular.module('vppApp')
    .controller("NavCtrl", [
    	'$scope', 
    	function ($scope) {
	    	
	    	//Show nav
	    	$('.show-inner-list').hover(function(){
		    	$(this).addClass('show-inner');
	    	}, function(){
		    	$(this).removeClass('show-inner');
	    	});
	    	
	    	//Show Inner nav
	    	$('.vpp-links-li').hover(function(){
		    	$(this).addClass('show-inner-nested');
	    	}, function(){
		    	$(this).removeClass('show-inner-nested');
	    	});
	    	
	    	//ng show and hide
			$scope.showInnerLinks = function(event){
				event.target.classList.add('show-inner');
				//$(event.target).addClass('show-inner');
				console.log('show');
			}
			
			//Hide nav
			$scope.hideInnerLinks = function(event){
				event.target.classList.remove('show-inner');
				//$(".nav-list").removeClass('show-inner');
				console.log('hide');
			}
			
			//Show nav
			$scope.showInnerLinksNested = function(event){
				event.target.classList.add('show-inner-nested');
				//$(event.target).addClass('show-inner');
				console.log('show');
			}
			
			//Hide nav
			$scope.hideInnerLinksNested = function(event){
				event.target.classList.remove('show-inner-nested');
				//$(".nav-list").removeClass('show-inner');
				console.log('hide');
			}
			
			//Page Controls
            $('.divControl').click(function () {
                $(".divFade").each(function () {
                    if ($('.divFade').css("visibility") == "hidden") {
                        // handle non visible state
                    } else {
                        // handle visible state
                        $('.divFade').fadeOut(10);
                    }
                });
            });

//            $('#dbSummaryMI').click(function () {
            //                $("#DataSummary").fadeIn(1000);
            //            });
            //
            //            $('#dbPoliciesMI').click(function () {
            //                $("#Policies").fadeIn(1000);
            //            });
            //
            //            $('#vwDataBTN').click(function () {
            //                $("#DataTable").fadeIn(1000);
            //            });
            //
            //            $('#vwOptionsBTN').click(function () {
            //                $("#DataSummary").fadeIn(1000);
            //            });
            //End of Page Controls
    	}
    ]	
);