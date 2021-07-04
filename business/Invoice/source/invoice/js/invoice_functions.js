/**
 * An Object containing common functions for the Invoice Template add-edit-view pages
 */
Runner.Invoice = {
    /**
     * Create a texarea covering the default field's control
     * @param {string} pageid
     * @param {string} fName
     */

    /**
     * Show/hide the covering textarea element
     * @param {boolean} show
     * @param {jQuery object} txtr
     * @param {jQuery object} span
     * @param {object} ctrl
     */
    showTextArea: function(show, txtr, span, ctrl) {
        txtr.toggle(show);

        if (show) {
            txtr.css({
                    'width': span.width() + 1,
                    'background-color': '#FFF'
                })
                .val(this.getControlValue(ctrl));

            return;
        }

        ctrl.setFocus();

        if (ctrl.addNew) {
            ctrl.addNew.click(function() {
                ctrl.addNew.focus();
            });
        }

        if (ctrl.editFormat === Runner.controls.constants.EDIT_FORMAT_LOOKUP_WIZARD && ctrl.lcType === Runner.controls.constants.LCT_LIST) {
            ctrl.displayElem.focus();
        }
    },

    /**
     * Change the current invoice number if it's already used for anouther invoice
     * @param {object} ctrlInvNum	The Runner's invoice number field control object
     * @param {string} url
     */
    initInvoiceNumberAdjustment: function(ctrlInvNum, url) {
        var defaultInvNum = ctrlInvNum.getValue();

        ctrlInvNum.on("change", function() {
            //var invNumber = this.getValue().replace(/[^\d]/g, "");
            var invNumber = this.getValue();

            if (invNumber === "") {
                this.setValue(defaultInvNum);
                return;
            }

            this.setValue(invNumber);

            $.post(url, { invAjax: 1, invNumber: invNumber }, function(data) {
                if (data.status !== "ok") {
                    ctrlInvNum.setValue(data.value !== undefined ? data.value : defaultInvNum);
                }
            }, "json");
        });
    },

    /**
     * Get the control's displayed value
     * @param {object} ctrl
     * @return {string}
     */
    getControlValue: function(ctrl) {
        var displayValue = ctrl.getDisplayValue();

        if (ctrl.editFormat === Runner.controls.constants.EDIT_FORMAT_DATE) {
            if (displayValue !== "") {
                return ctrl.valueElem.val();
            }
            return displayValue;
        }

        if (ctrl.lcType === Runner.controls.constants.LCT_DROPDOWN && displayValue === "") {
            return Runner.lang.constants.TEXT_PLEASE_SELECT;
        }

        return displayValue;
    },

    /**
     * Clear hours, minutes, seconds and milliseconds for the date passed
     * @param {Date object} date
     * @return {Date object}
     */
    refineDate: function(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        return date;
    },

    /**
     * Convert a date value to a string
     * @param {Date object} date
     * @return {string}	
     */
    dateToText: function(date) {
        var currDay = (date.getDate() < 10 ? "0" : "") + date.getDate(),
            currMonth = 1 + date.getMonth(),
            currYear = date.getYear() < 1000 ? date.getYear() + 1900 : date.getYear();

        return currMonth + "/" + currDay + "/" + currYear;
    },

    /**
     * Calculate Item total value
     * @param {number} price
     * @param {number} quantity
     * @param {number} quantityCloseness
     * @param {object} currency
     */
    calculateTotals: function(price, quantity, quantityCloseness, currency, taxIndividually = 0) {
        var price = this.getCommaReplacedValue(price);
        var quantity = parseFloat(quantity).toFixed(quantityCloseness);
        var itemTotal = price * quantity + (price * quantity / 100 * taxIndividually);

        if (!isNaN(itemTotal)) {
            return this.currencyFormat(itemTotal.toFixed(2), currency);
        }
        return "";
    },

    /**
     * Get the corresponding numeric value for the string passed	
     * @param {string}
     * @return {number}
     */
    getCommaReplacedValue: function(value) {
        value = isNaN(value) || value == undefined ? "0" : value.toString();
        refinedValue = parseFloat(value.replace(",", "."));
        return refinedValue;
    },

    /**
     * Refine the price value
     * @param {string} price
     * @return {string}
     */
    getRefinedPriceValue: function(price) {
        if (price.substr(0, 1) === "-") {
            return "-" + price.substr(1).replace(/[^\d,.]/g, "");
        }
        return price.replace(/[^\d,.]/g, "");
    },

    /**
     * Calculate the master table's subtotal, tax and total values;
     * @param {object} currency
     */
    setGlobalTotals: function(currency) {

        var tax = this.getCommaReplacedValue($("[data-field='tax'] [id^='value_tax']").val()),
            subTotal = 0,
            self = this,
            total = 0,
            iTaxTotal = 0,
            calcTax;
        $("[id^='gridRow']").each(function() {
            var price = self.getCommaReplacedValue($(this).find("input[id^=value_price_]").val()),
                quantity = parseFloat($(this).find("input[id^=value_quantity_]").val()),
                itax = parseFloat($(this).find("input[id^=value_item_tax_]").val()),
                itemTotal;
            quantity = isNaN(quantity) ? 0 : quantity;
            //with individually tax
            iTaxTotal += price * quantity + (price * quantity * itax / 100);
            //without individually tax
            subTotal += (price * quantity);
        });

        //set the master table subtotal value 
        if (subTotal > 0)
            $("[id^='readonly_value_subtotal']").html(this.currencyFormat(subTotal.toFixed(2), currency));
        else
            $("[id^='readonly_value_subtotal']").html("");
        $("div.hidden-subtotal").html(subTotal.toFixed(2));


        //set the master table total value		
        calcTax = iTaxTotal * tax / 100;
        total = iTaxTotal + calcTax;
        if (total > 0)
            $("div[data-field=total]").find("span[id^='readonly_value_total']").html(this.currencyFormat(total.toFixed(2), currency));
        else
            $("div[data-field=total]").find("span[id^='readonly_value_total']").html("");

        $("div.hidden-total").html(total.toFixed(2));

        //show the value
        $("div.calc-tax").html(this.currencyFormat(calcTax.toFixed(2), currency));
    },

    /**
     * Set the rigth position field values for all items on the page
     */
    setRecalcPositions: function() {
        $("[id^='gridRow']").each(function(index, e) {
            $(e).find("span[id^='readonly_value_pos']").html(index + 1);
            $(e).find("input[id^='value_pos']").val(index + 1);
        });
    },

    /**
     * Get a correct currency format for a value
     * @param {string} val
     * @param {object} currency
     * @return {string}
     */
    currencyFormat: function(val, currency) {
        if (val >= 0) {
            switch (currency["ICURRENCY"]) {
                case "0":
                    return currency["SCURRENCY"] + val;
                case "1":
                    return val + currency["SCURRENCY"];
                case "2":
                    return currency["SCURRENCY"] + " " + val;
                case "3":
                    return val + " " + currency["SCURRENCY"];
            }
        } else {
            val = val.replace(/[^\d.]/g, "");

            switch (currency["INEGCURR"]) {
                case "0":
                    return "(" + currency["SCURRENCY"] + val + ")";
                case "1":
                    return "-" + currency["SCURRENCY"] + val;
                case "2":
                    return currency["SCURRENCY"] + "-" + val;
                case "3":
                    return currency["SCURRENCY"] + val + "-";
                case "4":
                    return "(" + val + currency["SCURRENCY"] + ")";
                case "5":
                    return "-" + val + currency["SCURRENCY"];
                case "6":
                    return val + "-" + currency["SCURRENCY"];
                case "7":
                    return val + currency["SCURRENCY"] + "-";
                case "8":
                    return "-" + val + " " + currency["SCURRENCY"];
                case "9":
                    return "-" + currency["SCURRENCY"] + " " + val;
                case "10":
                    return val + " " + currency["SCURRENCY"] + "-";
                case "11":
                    return currency["SCURRENCY"] + " " + val + "-";
                case "12":
                    return currency["SCURRENCY"] + " -" + val;
                case "13":
                    return val + "- " + currency["SCURRENCY"];
                case "14":
                    return "(" + currency["SCURRENCY"] + " " + val + ")";
                case "15":
                    return "(" + val + " " + currency["SCURRENCY"] + ")";
            }
        }
    },

    /**
     * The flag showing if the 'ctrl' key was pressed 
     * It serves for keybord shortcuts
     * @type {boolean}
     */
    isCtrl: false,

    initPdfControls: function(proxy) {
        /*##if @ext=="aspx"##
        		if ( !Runner.Pdf ) {
        			return;
        		}
        		
        		Runner.Pdf.SetProgress = function( total, progress ) {
        			return;
        		}; 

        		Runner.Pdf.RunPDF = function() {
        			window.location.href = Runner.getPageUrl("buildpdf") + "?url=" + encodeURIComponent(window.location.href + "&mvcPDF=1") + '&rndval=' + Math.random();
        		};

        		$('.pdflink').bind("click", function(e) {
        			Runner.Pdf.RunPDF();
        		});

        ##elseif @ext=="php"##*/
        /*		Runner.controls.PrintPdf.prototype.getPdfFile = function() {
        			var self = this,
        				$loadingMess, timer, $iframe,
        				$pdfButton = $("#pdf"),
        				cookie = "x" + Math.floor( Math.random()*10000000 ).toString(),
        				connector = window.location.href.indexOf('?') >= 0 ? '&' : '?',
        				action = window.location.href.replace(/#/g,'') + connector + "pdf=build&width=" + 850 + "&rndval=" + cookie;

        			$iframe = $("<iframe id=pdfiframe name=pdfiframe></iframe>").css({ 
        					position: "absolute",
        					top: "-1000px"
        				})
        				.appendTo("body");

        			$( "<form method='post' style='display:none' target=pdfiframe action='" + action + "'></form>")
        				.appendTo( "body" )
        				.submit();				

        			$loadingMess = $('<div class="' + this.loadingPrintClass + " " + this.noPrintClass + '">'
        					+ Runner.getLoadingBlock( Runner.lang.constants.TEXT_PDF_BUILD1 )
        				+ '</div>').insertAfter( $pdfButton );		

        			timer = setInterval( function() {
        				var error = $iframe.contents().find("body").html();
        				
        				if ( get_cookie("pdfDownloadedEnd") == cookie || error ) {
        					$loadingMess.remove(); 
        					clearInterval( timer );
        					
        					if ( error ) {
        						self.displayGenericAjaxError( error, Runner.lang.constants.TEXT_PDF_BUILD3 );
        					}					
        				} 
        			}, 500 );
        		};*/
        /*##elseif @ext=="asp"##
        		//replace the path below to the real path to your " + Runner.getPageUrl("invoice", "connector") + " file
        		//eg: var serverPath = "http://sample.com:8085/",
        		var serverPath = "pdf/",
        			connectorPath = serverPath + "invoice_connector.p" + "hp";

        		$("#pdf").click( function() {
        			var maxwidth = 1062,
        				position = $("#pdf").offset(),
        				invoice_pdf_id = (new Date).getTime(),
        				$page, $invForm, $divPdfLink, $invIframe;	
        			
        			$("#pdf").hide();

        			$invForm = $("<form></form>")
        				.attr({"action": connectorPath, "method": "post", "target": "inv_iframe"})
        				.appendTo("body");

        			$divPdfLink = $("<div id='pdf-link-message'></div>")
        				.css({
        					position: 'absolute', 
        					top: position.top + 5, 
        					left: position.left,
        					"z-index": "100500"
        				})
        				.appendTo("body");

        			$invIframe = $("<iframe id='inv_iframe_id' name='inv_iframe'></iframe>")
        				.css({
        					border: "0", 
        					height: "1px", 
        					width: "1px"
        				})
        				.appendTo("body");

        			$page = $("html").html();						
        				
        			$('<input type="hidden" name="invpage"/>')
        				.val( $page )
        				.appendTo( $invForm );
        			
        			$('<input type="hidden" name="invwidth"/>')
        				.val( maxwidth )
        				.appendTo( $invForm );
        			
        			$('<input type="hidden" name="invoice_pdf_id"/>')
        				.val( invoice_pdf_id )
        				.appendTo( $invForm );

        			$invForm.submit( function() {
        				$invIframe.bind('load', function(e) {
        					var href = serverPath + "invoice_getpdf.p"+"hp?table=invoices&id=" + invoice_pdf_id + "&inum=" + proxy.inum;
        					
        					$("<span>Your PDF file is created. Download the file using this </span>").appendTo( $divPdfLink );			
        					$("<a href='" + href + "'>link</a>").appendTo( $divPdfLink );
        				});
        			});

        			$invForm.submit();
        		});
        ##endif##*/

        if (get_cookie("invoicePdf") === "pdf") {
            $(".pdflink").click();
            delete_cookie("invoicePdf");
        }
    },
};

/**
 * Set the keyboard's shortcut to add a new item
 */
Runner.Invoice.initShortCuts = function() {
    $(document.body)
        .keyup(function(e) {
            if (e.keyCode == 17) {
                Runner.Invoice.isCtrl = false;
            }
            if (Runner.Invoice.isCtrl == true && e.keyCode == 89) {
                $("[id^='inlineAdd']").click();
            }
        })
        .keydown(function(e) {
            if (e.keyCode == 17) {
                Runner.Invoice.isCtrl = true;
            }
        });
};

Runner.Invoice.initSortableGrid = function() {
    // Enable a drag and drop feature for the items grid
    $(function() {
        var sort = $("[id^=detailPreview]").find("table").find("tbody");
        $(sort).sortable({ cursor: 'url(' + settings.global["webRootPath"] + 'images/cursor_grabbing.png), auto' });

        sort.bind("sortstop", function(event, ui) {
            Runner.Invoice.setRecalcPositions();
        });
    });
};