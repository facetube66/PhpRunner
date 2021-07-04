<?php
include("include/dbcommon.php");
require_once('./lib/Stripe.php');
	require_once('stripe_config.php');

include("afterpay.php");

	$token  = $_POST['stripeToken'];
  	$email  = $_POST['stripeEmail'];

	$rss = DB::Query("select * from invsettings");
	$ddata = $rss->fetchAssoc();
	$cur = $ddata["ppCurrency"];
	
	// create the custom using token we recieved from Stripe.Button
	try {	
		$customer = Stripe_Customer::create(array(
		  'email' => $email,
		  'card'  => $token
		));
	} catch (Stripe_Error $e) {
		echo "CreateCustomer error: ";
		echo $e->getMessage();	
		exit();
	}

	// charge the card
	try {
		$charge = Stripe_Charge::create(array(
		  'customer' => $customer->id,
		  'amount'   => $_POST['amount'],
		  'currency' => $cur
		));
	} catch (Stripe_Error $e) {
		echo "CreateCharge error: ";
		echo $e->getMessage();	
		exit();
	}


	runAfterPay($_POST["hash"],$charge->id,"stripe");

?>