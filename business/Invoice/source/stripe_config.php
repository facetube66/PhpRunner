<?php
require_once('./lib/Stripe.php');
$srs = DB::Query("select * from invsettings");
$sdata = $srs->fetchAssoc();
$stripe = array(
  secret_key      => $sdata["stripeSKey"],
  publishable_key => $sdata["stripePKey"]
);


Stripe::setApiKey($stripe['secret_key']);
?>