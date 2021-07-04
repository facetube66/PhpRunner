<?php
include("include/dbcommon.php");
include("afterpay.php");

$sandbox = isSandbox();

if($sandbox)
{
	$log = fopen("ipn.log", "a");
	fwrite($log, "\n\nipn - " . gmstrftime ("%b %d %Y %H:%M:%S", time()) . "\n");
}

if($sandbox)
{
	$paypalUrl = "www.sandbox.paypal.com";
	set_error_handler("ipn_error_handler");
}
else
{
	$paypalUrl = "www.paypal.com";
}

header('HTTP/1.1 200 OK');

//------------------------------------------------------------------
// Open log file (in append mode) and write the current time into it.
// Open the DB Connection. Open the actual database.
//-------------------------------------------------------------------


//------------------------------------------------
// Read post from PayPal system and create reply
// starting with: 'cmd=_notify-validate'...
// then repeating all values sent - VALIDATION.
//------------------------------------------------

$req = "cmd=_notify-validate";
foreach($_POST as $key=>$val)
{
	$req.= "&".$key."=".urlencode($val);
	
	if($sandbox)
		fwrite($log,$key."=".$val."\n");
}


//--------------------------------------------
// Create message to post back to PayPal...
// Open a socket to the PayPal server...
//--------------------------------------------
$header = "POST /cgi-bin/webscr HTTP/1.1\r\n";
$header .= "Host: https://" . $paypalUrl . "\r\n";
$header .= "Content-Type: application/x-www-form-urlencoded\r\n";
$header .= "Content-Length: " . strlen ($req) . "\r\n";
$header .= "Connection: close\r\n\r\n";
$fp = fsockopen ("ssl://" . $paypalUrl, 443, $errno, $errstr, 30);

//----------------------------------------------------------------------
// Check HTTP connection made to PayPal OK, If not, print an error msg
//----------------------------------------------------------------------
if (!$fp) 
{
	echo "$errstr ($errno)";
	
	if($sandbox)
	{
		fwrite($log, "Failed to open HTTP connection!\n");
		fwrite($log, $errstr." ".$errno);
		fclose ($log);
	}
	
	return;
}

//--------------------------------------------------------
// If connected OK, write the posted values back, then...
//--------------------------------------------------------
fputs ($fp, $header . $req);
//-------------------------------------------
// ...read the results of the verification...
// If VERIFIED = continue to process the TX...
//-------------------------------------------
$res="";
while (!feof($fp))
	$res = stream_get_contents($fp);
$res = trim($res);
fclose ($fp);

if (strpos($res, "INVALID")!==FALSE) 
{
	if($sandbox)
	{
		fwrite($log,"ERROR - UnVERIFIIED payment\r\nPayPal response:");
		fwrite($log,$res);
		fclose($log);
	}
	return;
}

if($sandbox)
	fwrite($log,"payment VERIFIIED\r\n");


if ($_POST["payment_status"]!="Completed")
{
	if($sandbox)
	{
		fwrite($log,"ERROR - payment status is not Completed\r\n");
		fclose($log);
	}
	return;
}

runAfterPay($_POST["item_number1"],$_POST["txn_id"], "paypal");

if($sandbox)
{
	fwrite($log,"OK - payment received.\r\n");
	fclose($log);
}

function ipn_error_handler($errno, $errstr, $errfile, $errline)
{
	global $log;
	
	if($errno == E_USER_WARNING || $errno == E_WARNING || $errno == E_USER_NOTICE || $errno == E_NOTICE)
		return 0;
	
	fwrite($log,"PHP ERROR \r\n".$errstr);
	fclose($log);
	exit(0);
}

?>