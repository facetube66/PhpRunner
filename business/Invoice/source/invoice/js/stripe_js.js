function charge_stripe(res){
   console.log('Here we got token ID:', res.id + ' ' + res.email);
   if(!res.id || !$.cookie("cart"))
	   return;
   $.post("stripe_charge.php", { 
		stripeToken: res.id, 
		stripeEmail: res.email, 
		hash: $.cookie("cart"), 
		amount: $.cookie("cartamount")
	})
	.done(function(data) {
		if( data == 'ok' ){
			var url = window.location.href;
			location.href = url+"&page=view1";
		}
		else
			alert(data);
	});
};