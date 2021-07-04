<?php
function runAfterPay($hash, $payid, $paytype){
	// $hash - record id for update status field
	// $payid - Payment id from paypal or stripe
	if($hash && $payid){
		$sql = "update invoices set status='paid', paydate='".date("Y-m-d")."', payid='".$payid."', paytype='".$paytype."' where hash='".$hash."'";
		DB::Exec($sql);
		echo "ok";
	}
}

?>