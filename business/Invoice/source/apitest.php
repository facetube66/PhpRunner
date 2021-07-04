<?php

//This API allows to create an invoice sending buyer and seller data and also a list of items, prices, taxes etc. 
//If invoice is created successfully it returns URL of the View page of this invoice.


require_once("include/dbcommon.php");
$url = "https://yourwebsite.com/invoice/invoices_add.php";
$res["company_name"]="Company Name";
$res["seller_info"]="Seller Info";
$res["buyer_info"] = "buyer name";
$res["buyer_address"] = "buyer address";
$res["buyer_email"] = "buyer@email.com";
$res["tax"]="10";
$res["terms"]="terms";
$res["invoice_name"]="Invoice Name";
$res["details"] = array();
for($i=1;$i<3;$i++){
	$details = array();
	$details["item"] = "item_".$i;
	$details["price"] = $i;
	$details["quantity"] = $i;
	$res["details"][] = $details;
}
$str = json_encode($res);
$parameters["invoice"] = $str;
$headers["auth"] = "your Authenticate key";
$res = runner_post_request($url, $parameters, $headers);
if($res["error"])
	echo $res["error"];
else {
	if(strpos($res["content"],"http")>-1)
		echo "<a href='".$res["content"]."'>Invoice view</a>";
	else
		echo $res["content"];
}
?>
