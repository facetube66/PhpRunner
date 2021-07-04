	
		var isSign = false;
		var leftMButtonDown = false;

		jQuery(function(){
			//Initialize sign pad
			init_Sign_Canvas();
		});

		function fun_submit() {
			if(isSign) {
			
				var parentEl = $("#"+window.signID).get(0);
				var canvas = $('#canvas').get(0);
				var imgData = canvas.toDataURL();
				$(parentEl).find('p').remove();
				$(parentEl).find('img').remove();
				$(parentEl).append($('<img/>').attr('src',imgData));
				$(parentEl).find('img').attr('width',"150");
				$(parentEl).find('img').attr('id',"signpad"+window.signID.substring(9));
				$(parentEl).find('img').attr('class',"savehidden");
				$(parentEl).find(".savehidden").click();
				$(parentEl).find(".closePopup .ui-btn-text").click();

			} else {
				alert('Please sign');
			}
		}
		
		
		function init_Sign_Canvas() {

			isSign = false;
			leftMButtonDown = false;
			
			//Set Canvas width
			var sizedWindowWidth = $(window).width();
			if(sizedWindowWidth > 800)
				sizedWindowWidth = 600;
			//$(window).width() / 2;
			else if(sizedWindowWidth > 600)
				sizedWindowWidth = sizedWindowWidth - 100;
			else
				sizedWindowWidth = sizedWindowWidth - 50;
			 
			var canvas = $('#canvas').get(0);
			 
			$(canvas).width(sizedWindowWidth);
			$(canvas).height(200);
			$(canvas).css("border","1px solid #000");
					 
			canvasContext = canvas.getContext('2d');

			 if(canvasContext)
			 {
				 canvasContext.canvas.width  = sizedWindowWidth;
				 canvasContext.canvas.height = 200;
				 canvasContext.fillStyle = "#fff";
				 canvasContext.fillRect(0,0,sizedWindowWidth,200);
				 canvasContext.beginPath(); 
				 canvasContext.lineWidth = 0.5;

				canvasContext.lineCap = "round";			 
				 canvasContext.moveTo(20,180);
				 canvasContext.lineTo(sizedWindowWidth-20,180);
				 canvasContext.stroke();
				canvasContext.strokeStyle="#002D40"; // Blue pen
				 canvasContext.beginPath(); 
				 canvasContext.lineWidth = 3;
				canvasContext.lineCap = "round";			 

//				 canvasContext.fillStyle = "#000";
//				 canvasContext.font="20px Arial";
//				 canvasContext.fillText("please sign above the line",20,195);
			 }
			 // Bind Mouse events
			 $(canvas).on('mousedown', function (e) {
				 if(e.which === 1) { 
					 leftMButtonDown = true;
					 canvasContext.fillStyle = "#000";
					 var x = e.pageX - $(e.target).offset().left;
					 var y = e.pageY - $(e.target).offset().top;
					 canvasContext.moveTo(x, y);
				 }
				 e.preventDefault();
				 return false;
			 });
			
			 $(canvas).on('mouseup', function (e) {
				 if(leftMButtonDown && e.which === 1) {
					 leftMButtonDown = false;
					 isSign = true;
				 }
				 e.preventDefault();
				 return false;
			 });
			
			 // draw a line from the last point to this one
			 $(canvas).on('mousemove', function (e) {
				 if(leftMButtonDown == true) {
					 canvasContext.fillStyle = "#000";
					 var x = e.pageX - $(e.target).offset().left;
					 var y = e.pageY - $(e.target).offset().top;
					 canvasContext.lineTo(x,y);
					 canvasContext.stroke();
				 }
				 e.preventDefault();
				 return false;
			 });
			 
			 //bind touch events
			 $(canvas).on('touchstart', function (e) {
				leftMButtonDown = true;
				canvasContext.fillStyle = "#000";
				var t = e.originalEvent.touches[0];
				var x = t.pageX - $(e.target).offset().left;
				var y = t.pageY - $(e.target).offset().top;
				canvasContext.moveTo(x, y);
				
				e.preventDefault();
				return false;
			 });
			 
			 $(canvas).on('touchmove', function (e) {
				canvasContext.fillStyle = "#000";
				var t = e.originalEvent.touches[0];
				var x = t.pageX - $(e.target).offset().left;
				var y = t.pageY - $(e.target).offset().top;
				canvasContext.lineTo(x,y);
				canvasContext.stroke();
				
				e.preventDefault();
				return false;
			 });
			 
			 $(canvas).on('touchend', function (e) {
				if(leftMButtonDown) {
					leftMButtonDown = false;
					isSign = true;
				}
			 
			 });
		}
		
		