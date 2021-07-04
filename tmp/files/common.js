
function currencyView(data) {
	if (data == 0) {
		return '$0';
	}
	data = data * 1;
	return '$' + (data.toLocaleString('en-IN'));
}

function customRound(data) {
	return Math.round(data * 100) / 100;
}

function refreshTableData() {
	var externals = $("div#detailPreview8").find('tbody').find('tr').not(':first');
	for (var i = 0; i < externals.length; i++) {
		externals.eq(i).find('td').eq(3).find('input').eq(1).keyup();
	}

	var partyExternals = $("div#detailPreview9").find('tbody').find('tr').not(':first');
	for (var i = 0; i < partyExternals.length; i++) {
		partyExternals.eq(i).find('td').eq(3).find('input').eq(1).keyup();
	}

	var internals = $("div#detailPreview10").find('tbody').find('tr').not(':first');	
	for (var i = 0; i < internals.length; i++) {
		var internalPercent = internals.eq(i).find('td').eq(4).find('input').eq(0).keyup();
	}
}


function refreshExternalCoBroker() {
	var amount = $('#value_comm_amt_1').val() * 1;
	var earned, gst, gross;
	if ($('#value_gst_payable_1').prop('checked') && !$('#value_gst_inclusive_1').prop('checked')) {
		earned = amount;
		gst = customRound(amount * 7 / 100);
		gross = amount + gst;
	} else if ($('#value_gst_payable_1').prop('checked') && $('#value_gst_inclusive_1').prop('checked')) {
		earned = customRound(amount / 107 * 100);
		gst = amount - earned;
		gross = amount;
	} else {
		earned = amount;
		gst = 0;
		gross = amount;
	}

	var externals = $("div#detailPreview8").find('tbody').find('tr').not(':first');
	var totalComm = 0;
	var totalGst = $('#value_gst_1').val() * 1;
	for (var i = 0; i < externals.length; i++) {
		var comm = externals.eq(i).find('td').eq(3).find('input').eq(0).val();
		totalComm += comm * 1;
		
		var gst = externals.eq(i).find('td').eq(5).find('input').eq(0).val();
		totalGst -= gst * 1;
	}

	var partyExternals = $("div#detailPreview9").find('tbody').find('tr').not(':first');
	for (var i = 0; i < partyExternals.length; i++) {
		var comm = partyExternals.eq(i).find('td').eq(3).find('input').eq(0).val();
		if (comm != undefined) {
			totalComm += comm * 1;
		
			var gst = partyExternals.eq(i).find('td').eq(5).find('input').eq(0).val();
			totalGst -= gst * 1;
		}
	}
	
	$('#value_comm_earned_agency_1').val(customRound(earned - totalComm));
	$('#value_gst_agency_1').val(customRound(totalGst));
	$('#value_comm_gross_agency_1').val(customRound(earned - totalComm + totalGst));
}


function refreshInternalCoBroker() {
	var amount = $('#value_comm_amt_1').val() * 1;
	var earned;
	if ($('#value_gst_payable_1').prop('checked') && !$('#value_gst_inclusive_1').prop('checked')) {
		earned = amount;
	} else if ($('#value_gst_payable_1').prop('checked') && $('#value_gst_inclusive_1').prop('checked')) {
		earned = customRound(amount / 107 * 100);
	} else {
		earned = amount;
	}

	var totalComm = $('#value_comm_earned_agency_1').val() * 1;
	
	var internals = $("div#detailPreview10").find('tbody').find('tr').not(':first');	
	var totalInternalEarned = 0;

	for (var i = 0; i < internals.length; i++) {
		var internalPercent = internals.eq(i).find('td').eq(4).find('input').eq(0).val();
		internalPercent = internalPercent * 1;
		var internalEarned = customRound(earned * internalPercent / 100);
		// internals.eq(i).find('td').eq(3).find('input').val(internalEarned);
		totalInternalEarned += internalEarned * 1;
	}
	var agencyShare = $('#value_agency_share_1').val();
var salesEarned = totalComm - totalInternalEarned;
var salesPercent = customRound((salesEarned / earned) * 100);
var agencyComm = customRound ((salesEarned * agencyShare) / 100);
var agencyComm1 = customRound ((salesEarned * agencyShare) / 100);
var salesCommNett = salesEarned - agencyComm;
$('#value_comm_earned_salesperson_1').val(customRound(salesEarned));
$('#value_comm_earned_percent_salesperson_1').val(customRound(salesPercent));
$('#value_comm_to_agency_1').val(customRound(agencyComm));
$('#value_comm_to_agency1_1').val(customRound(agencyComm1));
$('#value_comm_nett_salesperson_1').val(customRound(salesCommNett));
}        

