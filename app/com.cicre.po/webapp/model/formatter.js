jQuery.sap.declare("com.cicre.po.model.formatter");
sap.ui.define([], function () {
	"use strict";

	//return {
	com.cicre.po.model.formatter = {


		/**
				 * Rounds the number unit value to 2 digits
				 * @public
				 * @param {string} sValue the number string to be rounded
				 * @returns {string} sValue with 2 digits rounded
				 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		getDecisionState: function(oValue) {
			if (oValue === "APPROVED") {
				return "Success";
			} else if (oValue === "REJECTED") {
				return "Error";
			}
			return "None";
		},
		formatDate: function (sValue) {
			if (sValue == null) {
				return "";
			} else {
				jQuery.sap.require("sap.ui.core.format.DateFormat");
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				return oDateFormat.format(new Date(sValue));
			}
		},
		formatDateMs: function (sValue) {
			if (sValue == null) {
				return "";
			} else {
				var timestamp = parseInt(sValue.match(/\d+/)[0], 10);
				var date = new Date(timestamp);
						
				// Format date to "yyyy-MM-dd" (ISO format)
				var isoDate = date.toISOString().split("T")[0];
				return isoDate;  // Replace with formatted date
			}
		},
		valueState: function (valuest) {
			if (valuest == "")
				return "Error";
			//else return editmMode;  
		},

		NumberWithCommas: function (x) {

			//x = Math.ceil(x);
			var parts = x.toString().split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
		},

		FormatForsrviceType: function (value, ServiceType) {

			if (ServiceType === "") {
				return "";
			} else {
				return value;
			}

		},
		FormatForsrviceType_Uom: function (Uom, ServiceType) {

			if (ServiceType === "") {
				return "";
			} else {
				return Uom;
			}

		},
	
		roundTotalDecimal: function (oValue, currency, servicetype) {
			if (servicetype != "") {
				if (oValue) {
					var value = parseFloat(oValue);
					 if(parseInt(oValue.toString().split(".")[1] ) > 0 ){ 
					  var F_value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					     if(currency == 'EGP'){
							var F_value = parseFloat(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")).toFixed(4);
						 }else{
							var F_value = parseFloat(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")).toFixed(4);
						 }
				    	return F_value;
			        	}else{
					    var F_value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

						if (currency == 'EGP') {
							F_value = F_value + '.0000';
						} else {
							F_value = F_value + '.0000';
						}
						return F_value;
					}
				}
			} else {
				return "";
			}
		},

		valuevisible: function (editmMode, isDefault) {
			if (editmMode === "" || isDefault === "U") { return false; }
		},
		numOfRows: function (value) {

			if (value == "Z") {
				return 1;
			} else {
				return 2;
			}
		}



	};

});