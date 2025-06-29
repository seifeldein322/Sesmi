jQuery.sap.require("sap.m.MessageBox");
sap.ui.define([
	"com/cicre/po/controller/BaseController", 
     "com/cicre/po/model/formatter" , 
	
	],

	function (BaseController, formatter  ) {
		"use strict";

		return BaseController.extend("com.cicre.po.controller.CreateContract", {

			formatter: formatter,
			sCoCode: "",
			sCoText: "",
			sSearchCoText: "",
			sPONO: "",
			sVendor: "",
			sProj: "",
			sProjectCode: "",
			sPOrg: "",
			sPlant: "",
			sPGrp: "",
			sDocType: "",
			sDocTypeText: "",
			BUBoQs: [],
			WBSBoQs: [],
			Boqs: [],
			myBuildingSet: [],
			myWBSSet: [],
			aContexts: [],
			sSubBoq: "",
			sSubBoqId: "",
			sSubBoq2: "",
			sSubBoq2Id: "",
			_oBuildingDialog: null,
			_oWBSDialog: null,
			consultantIndecator: "",
			sConsultant: "",
			sConsultantName: "",
			compInd: "",
			vendorInd: "",
			pGrpInd: "",
			pOrgInd: "",
			sSearchCoCode: "",
			sSearchVendor: "",
			sSearchPGrp: "",
			sSearchPOrg: "",
			selectedRefContracts: [],
			sVendorName: "",
			GroupCode: "",
			ModelCode: "",
			SupeiorWBSCode: "",
			SupeiorWBSText: "",
			ODataTree: [],
			BoqDescR: "",
			Building: "",
			ContractCode: "",
			GroupCodefilter: "",
			ModelCodefilter: "",
			ZoneCodefilter: "",
			BuildingCodefilter: "",
			ModelCodeFilter: "",
			ViewCon: "",
			companycodeTxt: "",
			SERTYPE: "",
			SERTYPEText: "",
			BoqAll: "",
			BoqDescAll: "",
			currentYear: "",
			ccurrentYear: "",
			years: "",
			CustomCurrency: "",

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf com.cicre.po.view.CreateTerms
			 */
			onInit: function () {

				var oRouter = this.getRouter();
				oRouter.getRoute("createContract").attachMatched(this._onRouteMatched, this);
			},
			_onRouteMatched: function (oEvent) {
				var that = this;
				that.sCoCode = "1000";//"1000";//"1000";
				that.sCoText = "EDSCO",//"Amoun";  //"Arab Co. for Proj & Dev";
					that.getView().byId("idCompanyCode").setValue(that.sCoText);
				that.sPOrg = "1000";
				that.getView().byId("idPurchaseOrganization").setValue("TMG CENTRAL Purch.");
				that.sPGrp = "SRV";
				that.getView().byId("idPurchaseGroup").setValue("Service");
				that.sPlant = "",//"ACPD";
					that.getView().byId("idPlant").setValue("ARAB Company For Proj & Dev");
				that.CustomCurrency = 2;

			    	that.sDocType = "ZSES";
				//that.getView().byId("idDocType").setValue("Project services");
				//that.getView().byId("_idSdocumenttype").setValue("Project services");
				that.sProjectCode = "";
				that.getView().byId("_idSearchByProject").setValue("");
				//that.sDocType = "";
				that.getView().byId("_idSdocumenttype").setValue("");
			
				// clearing create screen
				that.getView().byId("idCreationType").setSelectedKey("O");
				that.getView().byId("idContractDescription").setValue("");
				that.getView().byId("idLongDescription").setValue("");
				that.getView().byId("idCurrency").setValue("");
				that.getView().byId("idMeasurementMethod").setSelectedKey("REMS");
				that.getView().byId("idConstructionType").setSelectedKey("T");
				// that.getView().byId("idCommencement").getSelectedKeys("");
				that.getView().byId("idRefrenceContract").setValue("");
				that.getView().byId("idDocumentDate").setValue("");
				that.getView().byId("idValidFromDate").setValue("");
				that.getView().byId("idValidToDate").setValue("");
				that.getView().byId("idDeliveryDate").setValue("");
				that.getView().byId("idRevisedValidToDate").setValue("");
				that.getView().byId("idIndexMonth").setSelectedKeys("");
				that.getView().byId("idResponsiblepersonSS").setSelectedKey("");
				that.getView().byId("idResponsiblepersonIR").setSelectedKey("");
				that.getView().byId("idSupeiorWBS").setValue("");
				that.getView().byId("idVendor").setValue("");
				that.getView().byId("idConsultant").setValue("");
				that.getView().byId("idTolerance").setValue("");
				that.getView().byId("idTolerance").setVisible(false);
				//that.getView().byId("idMarkUp").setValue("00.0");
				that.getView().byId("idMarkUp").setVisible(false);
				//that.getView().byId("idConsuliatedTableBuilding").setVisible(false);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});

				that.getView().byId("idDocumentDate").setValue(oDateFormat.format(new Date()));
				// that.getView().byId("idContractDurationDays").setValue(0);
				// that.getView().byId("idContractDurationMonth").setValue(0);
				that.IndexMonth();

				var oModelJson = new sap.ui.model.json.JSONModel();
				var months = [{
					id: '01',
					text: 'Jan'
				},
				{
					id: '02',
					text: 'Feb'
				},
				{
					id: '03',
					text: 'Mar'
				},
				{
					id: '04',
					text: 'Apr'
				},
				{
					id: '05',
					text: 'May'
				},
				{
					id: '06',
					text: 'Jun'
				},
				{
					id: '07',
					text: 'Jul'
				},
				{
					id: '08',
					text: 'Aug'
				},
				{
					id: '09',
					text: 'Sep'
				},
				{
					id: '10',
					text: 'Oct'
				},
				{
					id: '11',
					text: 'Nov'
				},
				{
					id: '12',
					text: 'Dec'
				}
				];
				var Service_TYPE = [{
					id: 'C',
					text: 'Contingency'
				},
				{
					id: 'U',
					text: 'Unit rate'
				},
				{
					id: 'L',
					text: 'lumpsum'
				},
				{
					id: 'P',
					text: 'Provisional Sum'
				}, {
					id: 'R',
					text: 'Remeasured'
				}];

				oModelJson.setData({
					"estimatedMode": false,
					"BuildingSet": [],
					"WBSSet": [],
					"BoqModelSet": [],
					"BoqItemSet": [],
					"BoqMatGrpSet": [],
					"myBuildingSet": [],
					"AttachmentSet": [],
					"myWBSSet": [],
					"MessageSet": [],
					"MessagesLength": [],
					"selectedBuilding": [],
					//"IndexMonths": months,
					"IndexMonths": this.years,
					"Service_TYPE": Service_TYPE,
					"selectedRefContracts": [],
					"EstimatedContracts": [],
					"SupeiorWBSSet": [],
					"selectedBuildingOrWBS": [],
					"BoqConsulidatedItemSet": [],
					"myBuildingSet": [],
					"HeadToHeadVariation": [],
					"AsbuildService": [],
					"EstimatedContractValue": "0.00",
					"OriginalContractValue": "0.00",
					"VariationOrderValue": "0.00",
					"AddendumValue": "0.00",
					"TotalContractValue": "0.00",
					"RevisedContractValue": "0.00",
					"BuildingNO": "0.00",
					"WbslistNo": "0:00",
					"ServicNOCount": "0.00",
					"projectText": "",
					"selectBoq": false,
					"selectGroupBoq": false,
					"myPurchaseRequisition":[],
					"selectedPR":[],
					"PRItemSet":[]


				});

				that.getView().setModel(oModelJson, "localJson");
			

				var localJso = new sap.ui.model.json.JSONModel();
				localJso.setData({

					"VariationMode": true,
					"ViewCon1": false,
					"ViewCon2": true,
					"ViewCon4": false,
					"ViewCon3": true,
					"VReleasedMode": "",
					"Buildings": [],
					"Buildingss": [],
				});
				that.getView().setModel(localJso, "localJso");

			},
			////////////////////////////// company code search value help ////////////////////////////////
			onDisplaySearchCompDialog: function (oEvent) {
				this.compInd = oEvent.getParameters().id;
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.CompanySearchDialog", this);
					this._oDialog.setModel(this.getView().getModel());
				}
				this._oDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'CompCode');
				aFilters.push(oFilter1);

				this._oDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			handleSearchComp: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'CompCode');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);

				this._oDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectCompanyList: function (oEvent) {
				var that = this;

				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						if (that.compInd === "idSearchByCompany") {

							that.sSearchCoCode = oContext.getObject().IdNumber;
							sap.ui.getCore().byId("idSearchByCompany").setValue(oContext.getObject().IdText);

						}
						else {
							that.sCoCode = oContext.getObject().IdNumber;
							that.sCoText = oContext.getObject().IdText;
							that.getView().byId("idCompanyCode").setValue(oContext.getObject().IdText);
							that.getView().getModel("localJson").setProperty("/projectText", that.sCoText);
						}
						//return oContext.getObject().Name;
					});
				} else {
					that.sCoCode = "";
					that.sCoText = "";
					that.getView().getModel("localJson").setProperty("/projectText", that.sCoText);
					sap.m.MessageToast.show("No new item was selected.");
					that.getView().byId("idCompanyCode").setValue("");

				}
				oEvent.getSource().getBinding("items").filter([]);
				this.compInd = "";
			},
			onSearchCompanyChange: function () {
				this.sCoCode = "";
				this.sCoText = "";
				this.getView().getModel("localJson").setProperty("/projectText", this.sCoText);
			},
			////////////////////////////// Service Type search value help /////// 2-3-2021/////////////////////////
			onserviceTypeValueHelpPress: function () {
				if (!this._oDocTypeDialog) {
					this._oDocTypeDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.ServiceTypeSearchDialog", this);
					this._oDocTypeDialog.setModel(this.getView().getModel());
				}
				this._oDocTypeDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'MSERTYPE');
				aFilters.push(oFilter1);

				this._oDocTypeDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			handleSearchServicetype: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'MSERTYPE');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sValue);
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				aFilters.push(oFilter1);
				aFilters.push(oFilter2);

				this._oDocTypeDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectServicetypeList: function (oEvent) {
				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.SERTYPE = oContext.getObject().IdNumber;
						that.SERTYPEText = oContext.getObject().IdText;
						that.getView().byId("idserviceType").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					that.SERTYPE = "";
					that.SERTYPEText = "";
					that.getView().byId("idserviceType").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},
			////////////////////////////// Document Type search value help ////////////////////////////////
			onDisplaySearchDocTypeDialog: function () {
				if (!this._oDocTypeDialog) {
					this._oDocTypeDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.DocumentSearchDialog", this);
					this._oDocTypeDialog.setModel(this.getView().getModel());
				}
				this._oDocTypeDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'DocType');
				aFilters.push(oFilter1);

				this._oDocTypeDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			handleSearchDocument: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'DocType');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				aFilters.push(oFilter1);
				aFilters.push(oFilter2);

				this._oDocTypeDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectDocumentList: function (oEvent) {
				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.sDocType = oContext.getObject().IdNumber;
						that.sDocTypeText = oContext.getObject().IdText;
						that.getView().byId("idDocType").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					that.sDocType = "";
					that.sDocTypeText = "";
					that.getView().byId("idDocType").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},
			////////////////////////////// vendor search value help ////////////////////////////////
			onDisplaySearchVendorDialog: function (oEvent) {


				this.vendorInd = oEvent.getParameters().id;

				//if (oEvent.getParameters().id === "__xmlview0--idConsultant")
				//this.consultantIndecator = "X";
				//	if ((this.vendorInd  === "idSearchByVendor" ? this.sSearchCoCode : this.sCoCode) && (this.vendorInd  === "idSearchByVendor" ? this.sSearchPOrg : this.sPOrg)) {
				if (this._oVendorDialog) {
					this._oVendorDialog.destroy();
					this._oVendorDialog = null;
				}
				if (!this._oVendorDialog) {
					this._oVendorDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.VendorSearchDialog", this);
					this._oVendorDialog.setModel(this.getView().getModel());
				}
				this._oVendorDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Vendor');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.vendorInd === "idSearchByVendor" ? this.sSearchCoText : this.sCoCode);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.vendorInd === "idSearchByVendor" ? this.sSearchPOrg : this.sPOrg);
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);
				this._oVendorDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});

				// var oBinding = this._oVendorDialog.getBinding("items");
				// oBinding.filter([oFilter1, oFilter2, oFilter3]);
				//} else {
				//		sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("Msg_Error_Select_CO_PORG"));
				//}

			},
			handleSearchVendor: function (oEvent) {

				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Vendor');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sPOrg);
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);
				aFilters.push(oFilter4);


				this._oVendorDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectVendorList: function (oEvent) {

				var that = this;
				var mModel = that.getView().getModel();
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {

						/*	if (that.vendorInd === "__xmlview0--idSearchByVendor") {
								that.sSearchVendor = oContext.getObject().IdNumber;
								sap.ui.getCore().byId("__xmlview0--idSearchByVendor").setValue(oContext.getObject().IdText);
							}
							if (that.vendorInd === "__xmlview0--idConsultant") {
								//sSearchVendor = oContext.getObject().IdNumber;
								that.sConsultantName = oContext.getObject().IdText;
								that.sConsultant = oContext.getObject().IdNumber;
								sap.ui.getCore().byId("__xmlview0--idConsultant").setValue(oContext.getObject().IdText);
							}*/

						//else{
						//	if (that.vendorInd === "__xmlview0--idVendor") {
						//	if (that.consultantIndecator === "") {
						that.sVendor = oContext.getObject().IdNumber;
						that.sVendorName = oContext.getObject().IdText;
						that.getView().byId("idVendor").setValue(oContext.getObject().IdText);
						// Define Action Path
						let sVendor = that.sVendor
						// Define Action Path (without executing it immediately)
						let oContextBinding = mModel.bindContext("/GetCurrencyExecuteAction(...)");

						// Set Parameters and Execute Later
						oContextBinding.setParameter("Vendor", sVendor);

						oContextBinding.execute().then(() => {
							const oActionContext = oContextBinding.getBoundContext();
							let oData = oActionContext.getObject();
							
							console.log("Currency Data:", oData); // Debugging

							if (oData && oData.Currency) {
								that.getView().byId("idCurrency").setValue(oData.Currency);
								that.getView().getModel("localJson").setProperty("/Currency", oData.Currency);
							} else {
								sap.m.MessageToast.show("No currency data returned");
							}
						}).catch((oError) => {
							console.error("Error executing action: ", oError);
							sap.m.MessageBox.error("Failed to fetch currency");
						});

						//} 
						/*else {
							that.sConsultant = oContext.getObject().IdNumber;
							that.sConsultantName = oContext.getObject().IdText;
							that.getView().byId("idConsultant").setValue(oContext.getObject().IdText);
						}*/
						//	}

						//return oContext.getObject().Name;
					});
				} else {
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
				that.consultantIndecator = "";
				that.vendorInd = "";
			},
			////////////////////////////// project search value help ////////////////////////////////
			onDisplaySearchProjDialog: function () {

				if (!this._oProjDialog) {
					this._oProjDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.ProjSearchDialog", this);
					this._oProjDialog.setModel(this.getView().getModel());
				}
				this._oProjDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Zone');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.Contains, this.ModelCode);
				var oFilter6 = new sap.ui.model.Filter("SelectionParameter5", sap.ui.model.FilterOperator.Contains, this.Building);
				var oFilter7 = new sap.ui.model.Filter("SelectionParameter6", sap.ui.model.FilterOperator.Contains, this.GroupCode);
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);
				if (this.ModelCode.length > 0) {
					aFilters.push(oFilter5);
				}
				if (this.Building.length > 0) {
					aFilters.push(oFilter6);
				}
				if (this.GroupCode.length > 0) {
					aFilters.push(oFilter7);
				}
				this._oProjDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			handleSearchProj: function (oEvent) {

				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Zone');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.Contains, this.sCoCode);
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.Contains, this.ModelCode);
				var oFilter6 = new sap.ui.model.Filter("SelectionParameter5", sap.ui.model.FilterOperator.Contains, this.Building);
				var oFilter7 = new sap.ui.model.Filter("SelectionParameter6", sap.ui.model.FilterOperator.Contains, this.GroupCode);

				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);
				aFilters.push(oFilter4);
				if (this.ModelCode.length > 0) {
					aFilters.push(oFilter5);
				}
				if (this.Building.length > 0) {
					aFilters.push(oFilter6);
				}
				if (this.GroupCode.length > 0) {
					aFilters.push(oFilter7);
				}

				this._oProjDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectProjList: function (oEvent) {

				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.sProj = oContext.getObject().IdNumber;
						that.getView().byId("idSearchByProject").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					that.sProj = "";
					that.getView().byId("idSearchByProject").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},

			///////////////////  Model search value help/////// create using [E.A]

			onDisplaySearchModel: function () {

				if (!this._ModelDialog) {
					this._ModelDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.ModelSearchDialog", this);
					this._ModelDialog.setModel(this.getView().getModel());
				}
				this._ModelDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Model');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, this.sCoCode);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, this.sProj);
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter5", sap.ui.model.FilterOperator.EQ, this.Building);
				var oFilter7 = new sap.ui.model.Filter("SelectionParameter6", sap.ui.model.FilterOperator.Contains, this.GroupCode);
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);

				if (this.sProj.length > 0) {
					aFilters.push(oFilter4);
				}
				if (this.Building.length > 0) {
					aFilters.push(oFilter5);
				}
				if (this.GroupCode.length > 0) {
					aFilters.push(oFilter7);
				}
				this._ModelDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},

			handleSearchModel: function (oEvent) {

				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Model');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, this.sProj);
				var oFilter6 = new sap.ui.model.Filter("SelectionParameter5", sap.ui.model.FilterOperator.EQ, this.Building);
				var oFilter7 = new sap.ui.model.Filter("SelectionParameter6", sap.ui.model.FilterOperator.Contains, this.GroupCode);

				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);
				aFilters.push(oFilter4);
				if (this.sProj.length > 0) {
					aFilters.push(oFilter5);
				}
				if (this.Building.length > 0) {
					aFilters.push(oFilter6);
				}
				if (this.GroupCode.length > 0) {
					aFilters.push(oFilter7);
				}
				this._ModelDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectModelList: function (oEvent) {
				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.ModelCode = oContext.getObject().IdNumber;
						that.getView().getModel("localJson").setProperty("/selectBoq", false);

						that.getView().byId("idSearchByModel").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					that.ModelCode = "";
					that.getView().byId("idSearchByModel").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},
			/////////Building search value help [E.A]//
			onDisplaySearBuilding: function () {

				if (!this._BuildingDialog) {
					this._BuildingDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.BuildingSearchDialog", this);
					this._BuildingDialog.setModel(this.getView().getModel());
				}
				this._BuildingDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'BUILDINGID');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, this.sProj);
				var oFilter6 = new sap.ui.model.Filter("SelectionParameter5", sap.ui.model.FilterOperator.EQ, this.ModelCode);
				var oFilter7 = new sap.ui.model.Filter("SelectionParameter6", sap.ui.model.FilterOperator.EQ, this.GroupCode);

				//that.ModelCode

				aFilters.push(oFilter1);

				if (this.sProjectCode.length > 0) {//&&this.getView().byId("_IdBuilding").getValue()!==""
					aFilters.push(oFilter2);
				}
				if (this.sProj.length > 0) {
					aFilters.push(oFilter4);
				}
				if (this.ModelCode.length > 0) {
					aFilters.push(oFilter6);
				}
				if (this.GroupCode.length > 0) {
					aFilters.push(oFilter7);
				}
				aFilters.push(oFilter3);
				this._BuildingDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},

			handleSearchBuilding: function (oEvent) {

				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'BUILDINGID');
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, this.sProj);
				var oFilter6 = new sap.ui.model.Filter("SelectionParameter5", sap.ui.model.FilterOperator.EQ, this.ModelCode);
				var oFilter7 = new sap.ui.model.Filter("SelectionParameter6", sap.ui.model.FilterOperator.EQ, this.GroupCode);


				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				aFilters.push(oFilter1);
				if (this.sProjectCode.length > 0) {//&&this.getView().byId("_IdBuilding").getValue()!==""
					aFilters.push(oFilter2);
				}
				aFilters.push(oFilter3);
				aFilters.push(oFilter4);
				if (this.sProj.length > 0) {
					aFilters.push(oFilter5);
				}//that.ModelCode
				if (this.ModelCode.length > 0) {
					aFilters.push(oFilter6);
				}
				if (this.GroupCode.length > 0) {
					aFilters.push(oFilter7);
				}
				this._BuildingDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectBuilding: function (oEvent) {

				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {

						that.Building = oContext.getObject().IdNumber;


						that.getView().byId("_IdBuilding").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					that.Building = "";
					that.getView().byId("_IdBuilding").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},

			///  Group  search value help //////[E.A]//
			onDisplaySearGroup: function () {

				if (!this._GroupDialog) {
					this._GroupDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.GroupSearchDialog", this);
					this._GroupDialog.setModel(this.getView().getModel());
				}
				this._GroupDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Group');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sProj);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.Contains, this.ModelCode);
				var oFilter6 = new sap.ui.model.Filter("SelectionParameter5", sap.ui.model.FilterOperator.Contains, this.Building);

				aFilters.push(oFilter1);

				if (this.sProj.length > 0) {
					aFilters.push(oFilter2);
				}
				if (this.ModelCode.length > 0) {
					aFilters.push(oFilter5);
				}
				if (this.Building.length > 0) {
					aFilters.push(oFilter6);
				}

				aFilters.push(oFilter3);
				this._GroupDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},

			handleSearchGroup: function (oEvent) {

				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Group');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sProj);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.Contains, this.ModelCode);
				var oFilter6 = new sap.ui.model.Filter("SelectionParameter5", sap.ui.model.FilterOperator.Contains, this.Building);
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				aFilters.push(oFilter1);
				if (sValue !== "") {
					aFilters.push(oFilter4);
				}
				aFilters.push(oFilter3);
				if (this.sProj.length > 0) {
					aFilters.push(oFilter2);
				}
				if (this.ModelCode.length > 0) {
					aFilters.push(oFilter5);
				}
				if (this.Building.length > 0) {
					aFilters.push(oFilter6);
				}
				this._GroupDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectGroupList: function (oEvent) {
				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.GroupCode = oContext.getObject().IdNumber;
						that.getView().byId("idSearchByGroup").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					that.GroupCode = "";
					that.getView().byId("idSearchByGroup").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},
			/////////////////////////// SupeiorWBS search value help////// [E.A]


			handleSearWBS: function () {


				var that = this;

				if (!this._GroupDialog) {
					this._GroupDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SuperiorWBSSearchDialog", this);
					this._GroupDialog.setModel(this.getView().getModel());
				}
				//this._GroupDialog.open();

				var mModel = that.getView().getModel();

				var oModelJson = new sap.ui.model.json.JSONModel();
				oModelJson.setData({
					"SupeiorWBSSet": []
				});
				that._SuperiorWBSDialog.setModel(oModelJson, "localJson");
				/*	var oTemplate = new sap.m.StandardListItem({
						title: "{IdText}",
						description: "{IdNumber}"
					});
					that._GroupDialog.setModel(oModelJson, "localJson");*/
				var filters = [];


				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'SUBWBS');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idDesc").getValue());
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("idlenth").getValue());

				filters.push(oFilter1);
				filters.push(oFilter2);
				filters.push(oFilter3);
				if (sap.ui.getCore().byId("idDesc").getValue() !== "") {
					filters.push(oFilter4);
				}
				if (sap.ui.getCore().byId("idlenth").getValue() !== "") {
					filters.push(oFilter5);
				}
				if (sap.ui.getCore().byId("idlenth").getValue() === "") {
					var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, 500);
					filters.push(oFilter5);
				}

				/*that._GroupDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: filters
				});*/


				mModel.read("/ValueHelpSet", {
					filters: filters,
					success: function (oData) {

						var data = JSON.parse(JSON.stringify(oData.results));
						that._SuperiorWBSDialog.getModel("localJson").setProperty("/SupeiorWBSSet", data);
					},
					error: function (e) {
						sap.m.MessageToast.show("Error");
					}
				});


			},

			onSelectCheque: function (oEvent) {

				this.SupeiorWBSText = oEvent.getParameters().rowContext.getObject().IdText;
				this.SupeiorWBSCode = oEvent.getParameters().rowContext.getObject().IdNumber;
				this.getView().byId("idSupeiorWBS").setValue(this.SupeiorWBSText);
				this._SuperiorWBSDialog.close();
				this._SuperiorWBSDialog.destroy();
				this._SuperiorWBSDialog = null;

			},

			_handleCancelPresswbs: function () {

				var that = this;
				this.SupeiorWBSText = "";
				this.SupeiorWBSCode = "";
				this.getView().byId("idSupeiorWBS").setValue("");
				that._SuperiorWBSDialog.close();
				that._SuperiorWBSDialog.destroy();
				that._SuperiorWBSDialog = null;

			},

			onDisplaySearchidSupeiorWBSDialog: function () {
				if (this.sCoCode && this.sProjectCode) {
					if (!this._SuperiorWBSDialog) {
						//this._SuperiorWBSDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SuperiorWBSSSearchDialog", this);
						this._SuperiorWBSDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SuperiorWBSSearchDialog", this);
						/*	var i18nModel = new sap.ui.model.resource.ResourceModel({
								bundleUrl: "i18n/i18n.properties"
							});*/
						//this._SuperiorWBSDialog.setModel(i18nModel, "i18n");


						this._SuperiorWBSDialog.setModel(this.getView().getModel());
					}
					this._SuperiorWBSDialog.open();
					var oTemplate = new sap.m.StandardListItem({
						title: "{IdText}",
						description: "{IdNumber}"
					});
					var aFilters = [];
					var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'SUBWBS');
					var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
					var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
					//var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idDesc").getValue() );
					var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, 1000);
					//sProjectCode
					aFilters.push(oFilter1);
					aFilters.push(oFilter2);
					aFilters.push(oFilter3);
					aFilters.push(oFilter5);
					this._SuperiorWBSDialog.bindAggregation("items", {
						path: "/ValueHelpSet",
						template: oTemplate,
						filters: aFilters
					});
				}
				else {
					sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("Msg_Error_Select_WBS_C"));
				}
			},

			handleSearchSuperior: function (oEvent) {

				var sValue = oEvent.getParameter("value");


				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'SUBWBS');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, 1000);
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);
				aFilters.push(oFilter4);
				aFilters.push(oFilter5);

				this._SuperiorWBSDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectSuperiorList: function (oEvent) {
				var that = this;
				//that._SuperiorWBSDialog.close();
				//	that._SuperiorWBSDialog.destroy();
				//that._SuperiorWBSDialog =null;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.SupeiorWBSText = oContext.getObject().IdText;
						that.SupeiorWBSCode = oContext.getObject().IdNumber;
						that.getView().byId("idSupeiorWBS").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					that.SupeiorWBSText = "";
					that.SupeiorWBSCode = "";
					that.getView().byId("idSupeiorWBS").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},
			////////////////////////////// Purchase organization search value help ////////////////////////////////
			onDisplaySearchPOrgDialog: function (oEvent) {

				this.pOrgInd = oEvent.getParameters().id;
				if (!this._oPOrgDialog) {
					this._oPOrgDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.PurchaseOrgSearchDialog", this);
					this._oPOrgDialog.setModel(this.getView().getModel());
				}
				this._oPOrgDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PORG');
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.Contains, this.pOrgInd === "idSearchPurchaseOrganization" ? this.sSearchCoCode : this.sCoCode);

				aFilters.push(oFilter1);
				aFilters.push(oFilter3);

				this._oPOrgDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			handleSearchPOrg: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PORG');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.Contains, this.sCoCode);
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);

				this._oPOrgDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectPOrgList: function (oEvent) {
				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						if (that.pOrgInd === "idSearchPurchaseOrganization") {
							that.sSearchPOrg = oContext.getObject().IdNumber;
							sap.ui.getCore().byId("idSearchPurchaseOrganization").setValue(oContext.getObject().IdText);
						}
						else {
							that.sPOrg = oContext.getObject().IdNumber;
							that.getView().byId("idPurchaseOrganization").setValue(oContext.getObject().IdText);
						}
						//return oContext.getObject().Name;
					});
				} else {

					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
				that.sSearchPOrg = "";
			},
			/////////////////doucment type date 30_12_2020/////////////

			onDisplayDocType: function (oEvent) {
				if (!this._sdoctypeDialog) {
					this._sdoctypeDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.DocumentType", this);
					this._sdoctypeDialog.setModel(this.getView().getModel());
				}
				this._sdoctypeDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'DOC_TYPE');
				aFilters.push(oFilter1);
				this._sdoctypeDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			handleSearchDocType: function (oEvent) {

				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'DOC_TYPE');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sValue);
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);

				this._sdoctypeDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectDocTypeList: function (oEvent) {
				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.sDocTypeText = oContext.getObject().IdText;
						that.sDocType = oContext.getObject().IdNumber;
						that.getView().byId("_idSdocumenttype").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					that.sDocTypeText = "";
					that.sDocType = "";
					that.getView().byId("_idSdocumenttype").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},

			////////////////////////////// purchase group search value help ////////////////////////////////
			onDisplaySearchPGrpDialog: function (oEvent) {
				this.pGrpInd = oEvent.getParameters().id;
				if (!this._oPGrpDialog) {
					this._oPGrpDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.PurchaseGrpSearchDialog", this);
					this._oPGrpDialog.setModel(this.getView().getModel());
				}
				this._oPGrpDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PGRP');

				aFilters.push(oFilter1);

				this._oPGrpDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			handleSearchPGrp: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PGRP');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				aFilters.push(oFilter1);
				aFilters.push(oFilter2);

				this._oPGrpDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectPGrpList: function (oEvent) {
				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						if (that.pGrpInd === "idSearchPurchaseGroup") {
							that.sSearchPGrp = oContext.getObject().IdNumber;
							sap.ui.getCore().byId("idSearchPurchaseGroup").setValue(oContext.getObject().IdText);
						}
						else {
							that.sPGrp = oContext.getObject().IdNumber;
							that.getView().byId("idPurchaseGroup").setValue(oContext.getObject().IdText);
						}
						//return oContext.getObject().Name;
					});
				} else {
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
				that.pGrpInd = "";
			},
			////////////////////////////// plant search value help ////////////////////////////////
			onDisplaySearchPlantDialog: function () {
				if (!this._oPlantDialog) {
					this._oPlantDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.PlantSearchDialog", this);
					this._oPlantDialog.setModel(this.getView().getModel());
				}
				this._oPlantDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PLANT');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.Contains, this.sPOrg);

				aFilters.push(oFilter1);
				aFilters.push(oFilter2);

				this._oPlantDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			handleSearchPlant: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PLANT');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
				var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.Contains, this.sPOrg);

				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter3);

				this._oPlantDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectPlantList: function (oEvent) {
				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.sPlant = oContext.getObject().IdNumber;
						that.getView().byId("idPlant").setValue(oContext.getObject().IdText);
						//return oContext.getObject().Name;
					});
				} else {
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},
			////////////////////////////// SubBoq search value help ////////////////////////////////
			onDisplaySearchSubBoqDialog: function (oEvent) {

				if (!this._oSubBoqDialog) {
					this._oSubBoqDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SubBoqSearchDialog", this);
					this._oSubBoqDialog.setModel(this.getView().getModel());
				}
				this._oSubBoqDialog.open();
				this.sSubBoqId = oEvent.getParameters().id;
				var Model = oEvent.getSource().getBindingContext("localJson").getObject().Model;
				this.BoqDescR = oEvent.getSource().getBin = oEvent.getSource().getBindingContext("localJson").getObject();

				//var Usagetype = oEvent.getSource().getBindingContext("localJson").getObject().Usagetype;


				var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, Model);
				var oFilter2 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				//var oFilter3 = new sap.ui.model.Filter("UsageType", sap.ui.model.FilterOperator.EQ, '0001');
				var oFilter4 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
				var oTemplate = new sap.m.StandardListItem({
					title: "{BoqSub}",
					description: "{BoqDesc}"
				});
				var aFilters = [];
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				// aFilters.push(oFilter3);
				aFilters.push(oFilter4);

				this._oSubBoqDialog.bindAggregation("items", {
					path: "/BoqSubItemSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onDisplay2SearchSubBoqDialog: function (oEvent) {

				if (!this._oSubBoq2Dialog) {
					this._oSubBoq2Dialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SubBoqSearchDialog", this);
					this._oSubBoq2Dialog.setModel(this.getView().getModel());
				}
				this._oSubBoq2Dialog.open();
				this.sSubBoq2Id = oEvent.getParameters().id;

				this.BoqDescR = oEvent.getSource().getBindingContext("localJson").getObject();

				var Model = oEvent.getSource().getBindingContext("localJson").getObject().SelectionParameter6;//.IdNumber;
				var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, Model);
				var oFilter2 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, this.sCoCode);
				var oFilter4 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, this.sProjectCode);

				var oTemplate = new sap.m.StandardListItem({
					title: "{BoqSub}",
					description: "{BoqDesc}"
				});
				var aFilters = [];
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);
				aFilters.push(oFilter4);
				this._oSubBoq2Dialog.bindAggregation("items", {
					path: "/BoqSubItemSet",
					template: oTemplate,
					filters: aFilters
				});
			},
			onSelectSubBoqList: function (oEvent) {

				var that = this;
				var Boqdesc;
				var aContexts = oEvent.getParameter("selectedContexts");

				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						if (that.sSubBoqId !== "") {
							that.sSubBoq = oContext.getObject().BoqSub;
							Boqdesc = oContext.getObject().BoqDesc;
							sap.ui.getCore().byId(that.sSubBoqId).setValue(oContext.getObject().BoqSub);
							that.BoqDescR.BoqDesc = Boqdesc;
							//that.BuildD(that.BoqDescR);
						}

						if (that.sSubBoq2Id !== "") {
							that.sSubBoq2 = oContext.getObject().BoqSub;
							Boqdesc = oContext.getObject().BoqDesc;
							sap.ui.getCore().byId(that.sSubBoq2Id).setValue(oContext.getObject().BoqSub);
							that.BoqDescR.BoqDesc = Boqdesc;
							//that.getView().byId("boqdesc").setValue(oContext.getObject().BoqDesc);
							//that.BuildD();
						}
					});
				} else {
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
				this.sSubBoq2Id = "";
				this.sSubBoqId = "";
			},
			/////////////////////////// open add building dialog
			onAddBuildingsCreate: function () {
				var that = this;
				if (that.sProjectCode !== "" && that.sCoCode !== "") {
					if (!that._oBuildingDialog) {
						that._oBuildingDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SelectMultiBuildingCreate", that.getView().getController());
						var i18nModel = new sap.ui.model.resource.ResourceModel({
							bundleUrl: "i18n/i18n.properties"
						});
						// that.getView().addDependent(that._oBuildingDialog);
						that._oBuildingDialog.setModel(i18nModel, "i18n");
						that._oBuildingDialog.setModel(that.getView().getModel());
					}

					that._oBuildingDialog.open();
					if (that._oBuildingDialog.getModel("localJson"))
						that._oBuildingDialog.getModel("localJson").setProperty("/BuildingSet", []);
					that.aContexts = [];
					that.Boqs = [];
					that.BUBoQs = [];
					that.WBSBoQs = [];
				} else {
					sap.m.MessageToast.show("Please select Company Code and Project first.");
				}
			},


			onAfterCloseWBS: function (oEvent) {
				var that = this;
				//oEvent.getSource().destroy();
				this._oWBSDialog.destroy();
				this._oWBSDialog = null;
			},
			onAfterCloseBuilding: function (oEvent) {

				//	var that = this;
				this._oBuildingDialog.destroy();
				this._oBuildingDialog = null
				//oEvent.getSource().destroy();
				//that._oBuildingDialog = null;
			},
			onActionAfterClose: function (oEvent) {
				var that = this;
				oEvent.getSource().destroy();
				that._actionSheet = null;
			},
			_handleCancelPressBuilding: function (oEvent) {
				var that = this;

				var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding");
				var filter = [];
				for (var v = 0; v < that.myBuildingSet.length; v++) {
					var found = false;
					$.each(selectedBuilding, function (s, sel) {
						if (that.myBuildingSet[v].BuildingNo === sel.BuildingNo)
							found = true;
					});
					if (!found) {
						filter.push(that.myBuildingSet[v]);
					}
				}
				that.myBuildingSet = JSON.parse(JSON.stringify(filter));
				that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);

				that.getView().getModel("localJson").setProperty("/selectedBuilding", []);
				that._oBuildingDialog.close();
				this.onAfterCloseBuilding(oEvent);

			},
			handleSearchBuildingPress: function (oEvent) {

				var that = this;
				var mModel = that.getView().getModel(),
					filters = [],
					dataModel = that.getView().getModel("localJson"),
					Boqvisible = true;
				//	oldmodelvalue =""

				/*	var oModelJson = new sap.ui.model.json.JSONModel();
					oModelJson.setData({
						"BuildingSet": []
					});
					that._oBuildingDialog.setModel(oModelJson, "localJson");
					var filters = [];*/


				var oFilter1 = new sap.ui.model.Filter("Zone", sap.ui.model.FilterOperator.EQ, that.sProj);
				var oFilter2 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, that.sCoCode);
				var oFilter3 = new sap.ui.model.Filter("BuildingNo", sap.ui.model.FilterOperator.EQ, that.Building);
				var oFilter4 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
				var oFilter5 = new sap.ui.model.Filter("Group", sap.ui.model.FilterOperator.EQ, that.GroupCode);
				var oFilter6 = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, that.ModelCode);
				filters.push(oFilter2);
				filters.push(oFilter4);

				if (that.sProj !== "")
					filters.push(oFilter1);
				if (that.Building !== "")
					filters.push(oFilter3);
				// if (sap.ui.getCore().byId("idBoqStatus").getSelectedKey() !== "")
				// filters.push(oFilter4);
				if (that.GroupCode !== "") { filters.push(oFilter5); }
				if (that.ModelCode !== "") { filters.push(oFilter6); }
				mModel.read("/BuildingSet", {
					filters: filters,
					success: function (oData) {

						$.each(oData.results, function (i, data) {
							//	oData.results[i].Model = (oData.results[i].Model).substring(5, 8);
							oData.results[i].Model = oData.results[i].Model;
							if (i == 0) {

								that.oldmodelvalue = oData.results[i].Model
							}
							if (that.oldmodelvalue != oData.results[i].Model || that.oldmodelvalue === "") {
								Boqvisible = false
							}

							//oData.BoqSub = "";
						});


						that.BoqAll = "";
						that.BoqDescAll = "";
						that.getView().byId("idhandboq").setValue(that.BoqDescAll);
						var data = JSON.parse(JSON.stringify(oData.results));
						dataModel.setProperty("/BuildingSet", data);
						dataModel.refresh();
						if (that.oldmodelvalue === "") {
							Boqvisible = false
						}

						if (Boqvisible) {
							that.getView().getModel("localJson").setProperty("/selectBoq", true);
						}
					},
					error: function (e) {
						sap.m.MessageToast.show("Error");
					}
				});


			},
			onSelectionChange: function (oEvt) {


				var that = this;
				var oList = oEvt.getSource();
				var notExist = true,
					selectedBBuilding = [],
					nullGroup = [];
				that.BUBoQs = [];
				that.WBSBoQs = [];
				// that.Boqs = [];
				var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding"),
					selectedIndices = this._BuildinDialog.getTable().getSelectedIndices();
				that.myBuildingSet = that.getView().getModel("localJson").getProperty("/myBuildingSet");
				var selectedBuildingOrWBS = that.getView().getModel("localJson").getProperty("/selectedBuildingOrWBS");
				if (selectedIndices.length > 0) {
					for (var i = 0; i < selectedIndices.length; i++) {
						var selectedBU = this._BuildinDialog.getTable().getContextByIndex(selectedIndices[i]).getObject();
						selectedBU.ChangeIndicator = "AddB";
						selectedBBuilding.push(selectedBU);
					}
					$.each(selectedBBuilding, function (i, bu) {
						if (bu.Group === "") {
							nullGroup.push(bu.BuildingNo);
							//sap.m.MessageToast.show("select Boq on building");
							notExist = false;
						}
					});
					$.each(that.myBuildingSet, function (i, bu) {
						$.each(selectedBBuilding, function (w, bui) {
							if (bui.BuildingNo === bu.BuildingNo && bu.Model === bui.Model && bu.Group === bui.Group) {
								nullGroup.push(bu.BuildingNo);
								notExist = false;
							}
						});
					});


					if (notExist) {
						$.each(selectedBBuilding, function (w, WBS) {
							selectedBBuilding[w].SubBoq = selectedBBuilding[w].Group;
							selectedBBuilding[w].ContractualIndicator = "O";
							selectedBBuilding[w].ModelType = "BUILD";
							selectedBBuilding[w].SrvStatus = "UA"
							selectedBBuilding[w].Txt = "Original";
							selectedBBuilding[w].DelInd = "";
							that.myBuildingSet.push(selectedBBuilding[w]);
							selectedBuildingOrWBS.push(selectedBBuilding[w]);
							selectedBuilding.push(selectedBBuilding[w]);
						})
						that.getView().getModel("localJson").setProperty("/selectedBuilding", selectedBuilding);
						that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", selectedBuildingOrWBS);
						that.aContexts.push(selectedBBuilding);
						this.onBuildingContractClose();
						this._handleValueHelpCloseBuilding();

					} else if (!notExist) {
						var errormas = nullGroup.join();
						sap.m.MessageToast.show("Model and  Boq is already added or don't select Boq" + errormas);
						nullGroup = [];

						//sap.m.MessageToast.show("Model and  Boq is already added!");
					}
				} /*else {
					var bui=[];
					// var path = oEvt.getParameter("listItem").getBindingContextPath().split('/')[1];
					var path = oEvt.getParameter("listItem").getBindingContextPath();
					var index = path.slice(path.lastIndexOf('/') + 1);
					$.each(that.myBuildingSet, function (i, bu) {
						if(i == index){
						  $.each(selectedBuildingOrWBS, function (v, vu) {
							  if(vu.BuildingNo !== bu.BuildingNo ){
								bui.push(vu);
							  }
						  })
						}
					  });
					that.myBuildingSet.splice(index, 1);
					selectedBuilding.splice(index, 1);
					//selectedBuildingOrWBS.splice(index, 1);
					that.aContexts.splice(index, 1);
					that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", bui);
					that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);
					that.getView().getModel("localJson").setProperty("/selectedBuilding", selectedBuilding);
				}*/
			},

			_handleValueHelpCloseBuilding: function (oEvt) {
				var that = this,
					mModel = that.getView().getModel();
				that.getView().setBusy(true);
				var oModelJson = that.getView().getModel();
				var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding");
				//  var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding");
				var selectedBuildingOrWBS = that.getView().getModel("localJson").getProperty("/selectedBuildingOrWBS"),
					selectedBuildingOrWBSCont = [];

			/*c */	var objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			/*c */if (that.aContexts.length === 0)
			/*c */	sap.m.MessageToast.show("Select one Building at least!");
			  /*c*/   else {
					var noSub = false;
					$.each(that.myBuildingSet, function (b, bu) {
						if (bu.Group === "") {
							noSub = true;
						}
						/*c*/
					});
					if (noSub)
						sap.m.MessageToast.show("Select Boq for each Building!");
					else {
						////loop into for select building 
						$.each(selectedBuilding, function (i, bu) {
							that.BUBoQs.push(bu.Model + bu.Group);
							/*c*/
						});
		/*c*/	that.BUBoQs.sort();
						var current = null;
						var cnt = 0;
						var filters = []

						that.getView().getModel("localJson").setProperty("/selectBoq", false);
						that.oldmodelvalue = "";
						that.BoqDescAll = "";
						that.BoqAll = "";
						that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);
						//that.getView().getModel("ConJson").setProperty("/myBuildingSet", that.myBuildingSet);
						that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);
						//that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", []);

						this.objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
						this.selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/selectedBuilding")));
						var BoqConsulidatedItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
						this.getView().setBusy(true);

						/*$.each(selectedBuildingOrWBS, function (i, BUW) {
								for (var i = 0; i < aMessages.length - 1; i++) {
							var fund=false;
							if(selectedBuildingOrWBSCont.length === 0){
								selectedBuildingOrWBSCont.push(BUW);
							}
							else{
								$.each(selectedBuildingOrWBSCont, function (i, BUWC) {
									 if(BUWC.Group !== BUW.Group  || BUWC.Model !==BUW.Model ){
										fund=true;
									 }
									 if(fund){
										selectedBuildingOrWBSCont.push(BUW);
									}
								})
							}
						 })*/

						$.each(selectedBuildingOrWBS, function (i, SelectBuilding) {
							var oFilter1 = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.BT, SelectBuilding.Model, SelectBuilding.Group)
							if (oFilter1 !== "") { filters.push(oFilter1); }
						})

						var oFilter2 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
						if (oFilter2 !== "") { filters.push(oFilter2); }

						var oFilter3 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, that.sCoCode);
						if (oFilter3 !== "") { filters.push(oFilter3); }
						mModel.read("/BoqTreeSet", {
							filters: filters,
							success: function (OData, responce) {

								OData = OData.results;
								var start = 1;
								var BoqItemSet = [];

								$.each(OData, function (i, ServiceBoq) {
									if (OData[i].LevelNo === "1") {
										//OData[i].AddNew= "AN";
										OData[i].live = "one";
										OData[i].AddNew = "AN";
										//live: "one",
									}
									if (OData[i].Eancat === "" && parseInt(OData[i].LevelNo) === 4) {
										OData[i].Qty = "0";
										OData[i].Uom = "";
										OData[i].Price = "0";


									}
									OData[i].DelInd = "";
									OData[i].ModelType = "BOQ";
									if (OData[i].Eancat === "U") { OData[i].Qty = 0; }
									if (parseInt(OData[i].LevelNo) === 4) {
										OData[i].Txt = "Original";
										//OData[i].PriceUnit = "1";
										//OData[i].Price = "1";
										if (OData[i].Eancat != "") {
											OData[i].PriceUnit = "1";
											OData[i].Price = "1";
										}
										OData[i].DelInd = "";
										OData[i].ContractualIndicator = "O";
										OData[i].Indicator = "Y";
										/*var obj={
											Data: OData[i].Data,
											Item: OData[i].Item,
										   LevelId:OData[i].LevelId,
											LevelNo: OData[i].LevelNo,
											LongDesc: OData[i].LongDesc,
											Model: OData[i].Model,
											ModelType: OData[i].ModelType,
											Node: OData[i].Node,
											Parent: OData[i].Parent,
											PriceUnit: "1",
											Qty: OData[i].Qty,
											ShortDesc: OData[i].ShortDesc,
											SubModel: OData[i].SubModel,
											Uom: OData[i].Uom,
											Eancat:OData[i].Eancat,
											Txt:"Original",
											ContractualIndicator:"O",
											//ModelType =   
										}
										BoqConsulidatedItemSet.push(obj);*/
									} else {
										OData[i].Indicator = "Z";
									}
								});
								for (start; start < (OData.length + 1); start++) {
									BoqItemSet.push({
										[start]: []
									});
									for (var i = 0; i < OData.length; i++) {
										OData[i].Categories = [];
										if (parseInt(OData[i].LevelNo) === start) {
											BoqItemSet[start - 1][start].push(OData[i]);
										}

									}
								}

								var TreeBoqItemSet = [];
								$.each(BoqItemSet, function (i, hierachy) {
									if (i < 3) {
										$.each(hierachy, function (p, parent) {
											if (parent.length !== 0) {
												$.each(parent, function (n, node) {
													// new loop
													$.each(BoqItemSet[i + 1], function (a, newHierachy) {
														//if (a > 0) {
														$.each(newHierachy, function (b, newParent) {
															if (newParent.length !== 0) {
																//$.each(newHierachy, function (c, newNode) {
																if (node.LevelId === newParent.Parent) {
																	node.Categories.push(newParent);
																}
																//	});
															}
														});
													});
													//
												});
											}
										});
									}
								});

								$.each(BoqItemSet[0], function (a, newHierachy) {
									// $.each(newHierachy, function (b, newParent) {
									if (newHierachy.length !== 0) {
										$.each(newHierachy, function (c, newNode) {
											TreeBoqItemSet.push(newNode);
										});
									}
									// });
								});
								var go = false;
								var found = false;
								$.each(TreeBoqItemSet, function (c, newNode) {
									go = false;
									found = false;
									if (that.objSet.length !== 0) {
										$.each(that.objSet, function (i, oldNode) {
											/*$.each(oldNode.Categories, function (oc, oldcat) {*/
											$.each(newNode.Categories, function (nc, nCat) {
												//	if(newNode.Data === oldNode.Data ){  //if(nCat.Data === oldcat.Data ){
												//go = true;
												/*$.each(newNode.Categories, function (nc, nCat) {*/
												$.each(oldNode.Categories, function (oc, oldcat) {
													if (newNode.Data === oldNode.Data) {  //if(nCat.Data === oldcat.Data ){
														go = true;

														if (nCat.Data === oldcat.Data) { //if(newNode.Data === oldNode.Data ){
															found = true;
														}
													}

												})

												if (go && !found) {
													if (nCat.Model === oldNode.Model) {
														that.objSet[i].Categories.push(TreeBoqItemSet[c].Categories[nc]);
														found = false;
													}
												}
												//	}
											})
										})
										if (!go && !found) {
											that.objSet.push(newNode);
											go = false;
											found = false;
										}

									} else {
										that.objSet.push(newNode);
									}
									found = false;
									go = false;
								});
								that.getView().getModel("localJson").setProperty("/BoqItemSet", that.objSet);
								that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", []);
								that.Consoliatedservices();

								//that.getView().getModel("ConJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(that.ConsoliatedserviceslistCreate(BoqConsulidatedItemSet))));
								//	that.ContractValueHeaderCreate();
								that.getView().setBusy(false);
								var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
								var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));

								$.each(BoqItemSet, function (i, boq) {
									$.each(boq.Categories, function (j, sub) {
										$.each(sub.Categories, function (l, cat) {
											$.each(cat.Categories, function (k, srv) {

												BoqItemSet[i].PriceUnit = "0";
												BoqItemSet[i].Categories[j].PriceUnit = "0";
												BoqItemSet[i].Categories[j].Categories[l].PriceUnit = "0";
												BoqItemSet[i].Categories[j].Categories[l].Categories[k].Matdesc = BoqItemSet[i].Categories[j].Categories[l].ShortDesc;
												//BoqItemSet[i].Categories[j].Categories[l].Categories[k].ModelType = "BOQ";


											});

										});
									});

								});

								var findservice;
								//	$.each(consolidate, function (c, cons) {
								$.each(BoqItemSet, function (i, boq) {
									$.each(boq.Categories, function (j, sub) {
										$.each(sub.Categories, function (l, cat) {
											$.each(cat.Categories, function (k, srv) {
												findservice = consolidate.find(x => x.Data === srv.Data);
												if (findservice.Data === srv.Data) {
													var go = false;
													$.each(that.myBuildingSet, function (s, selected) {
														if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model) {
															go = true;
														}
													});
													$.each(that.myWBSSet, function (s, selected) {
														if ((selected.Model) === srv.Model) {
															go = true;
														}
													});
													if (go) {
														var ConsolidatedPrice = JSON.parse(JSON.stringify(findservice.PriceUnit));
														BoqItemSet[i].Categories[j].Categories[l].Categories[k].price = ConsolidatedPrice;
														BoqItemSet[i].Categories[j].Categories[l].Categories[k].PriceUnit = (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty)).toString();
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].PriceUnit = (parseFloat(BoqItemSet[i].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].Categories[l].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].Categories[l].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
													}
												}
											});

										});
									});

								});
								//});

								that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet.sort((a, b) => a.Data - b.Data))));
								that.ContractValueHeader();
								that.getView().setBusy(false);
							},

							error: function (e) {

								sap.m.MessageToast.show("Error");
							}
						});

					}
				}

			},
			_longTextDialog: null,
			onPressLongText: function (oEvent) {
				var that = this;
				that.itemIndex = oEvent.getSource().getBindingContext("localJson").getPath();
				var object = oEvent.getSource().getBindingContext("localJson").getObject();
				if (!that._longTextDialog) {
					that._longTextDialog = sap.ui.xmlfragment(that.getView().getId(), "com.cicre.po.view.fragments.ServiceLongText", that);
					that.getView().addDependent(that._longTextDialog);

				}

				that._longTextDialog.open();
				that.getView().byId("idLongText").setText(object.LongDesc);
			},
			groupcon3: function (oEvent) {

				var that = this;
				var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
				var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
				$.each(consolidate, function (c, cons) {
					$.each(BoqItemSet, function (i, boq) {
						$.each(boq.Categories, function (j, sub) {
							$.each(sub.Categories, function (l, cat) {



							})
						})
					})
				})

			},
			onCloseLongTextFragment: function (oEvent) {
				this._longTextDialog.close();
			},
			//saving contract terms changes
			onSavePress: function () {

				var that = this;


				// Confirmation dialog
				var currentView = this.getView();
				var i18nBundle = currentView.getModel("i18n").getResourceBundle();
				var BoqConsulidatedItemSet = that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet");
				var BoqItemSet = that.getView().getModel("localJson").getProperty("/BoqItemSet");
				var PurchaseRequisitionSet = that.getView().getModel("localJson").getProperty("/myPurchaseRequisition"),
				    PRItemSet = that.getView().getModel("localJson").getProperty("/PRItemSet");
			
				var AttachmentSet = that.getView().getModel("localJson").getProperty("/AttachmentSet"),
					EstimatedContracts = that.getView().getModel("localJson").getProperty("/EstimatedContracts"),
					POHeaderToPOItem = [],
					POHeaderToBoqItem = [],
					ContractPOSrvItemSet = [],
					poheadertopobuildingnav = [],
					selectedBuilding = [],
					ContractPONoteSet = {};
				var inputs = [
					this.getView().byId("idCompanyCode"),
					this.getView().byId("idPurchaseOrganization"),
					this.getView().byId("idPurchaseGroup"),
					this.getView().byId("idPlant"),
					this.getView().byId("idDocumentDate"),
					// this.getView().byId("idCommencementDate"),
					this.getView().byId("idValidFromDate"),
					this.getView().byId("idValidToDate"),
					this.getView().byId("idDeliveryDate"),
					this.getView().byId("_idSearchByProject"),
					this.getView().byId("idVendor"),
					this.getView().byId("idContractDescription"),
					//this.getView().byId("idDocType"),
					this.getView().byId("_idSdocumenttype"),
					
					
				];
				if (that.getView().byId("idCreationType").getSelectedKey() == "E") {
					if (that.SupeiorWBSCode == "") {
						this.getView().byId("idSupeiorWBS").setValueState("Error");
						return;
					} else {
						this.getView().byId("idSupeiorWBS").setValueState("None");
					}
				}
				var dialog = new sap.m.Dialog({
					title: i18nBundle.getText("Confirm"),
					type: "Message",
					content: new sap.m.Text({
						text: i18nBundle.getText("Msg_Confirm_Craete")
					}),
					beginButton: new sap.m.Button({

						text: i18nBundle.getText("Confirm"),
						type: "Emphasized",
						press: function () {

							if (that.getView().byId("idMeasurementMethod").getSelectedKey() === "REMS")
							//	inputs.push(that.getView().byId("idTolerance"));
							var canContinue = true;

							jQuery.each(inputs, function (i, input) {
								input.setValueState("None");
							});

							jQuery.each(inputs, function (i, input) {
								if (!input.getValue()) {
									input.setValueState("Error");
								}
							});

							// check states of inputs
							jQuery.each(inputs, function (i, input) {
								if ("Error" === input.getValueState()) {
									canContinue = false;
									return;
								}
							});

							// if(that.getView().byId("idCommencement").getSelectedKeys().join() === ""){
							// 	that.getView().byId("idCommencement").setValueState("Error");
							// 	canContinue = false;
							
							// }else{
							// 	that.getView().byId("idCommencement").setValueState("None");
							// }
							if (!canContinue) {
								sap.m.MessageToast.show("Please Enter Manadatory Fields");
								dialog.close();
								return;
							} else {

								$.each(that.myBuildingSet, function (i, building) {
									selectedBuilding.push(building);
								})
								$.each(that.myWBSSet, function (i, WB) {
									//WB.BuildingNo = WB.IdNumber;
									selectedBuilding.push(WB);
								})

								$.each(PurchaseRequisitionSet , function (i, PR) {
									//WB.BuildingNo = WB.IdNumber;
									//PR.Type = "PR";
									PR.Group = '';
									PR.Project = '';
									PR.Model = '';

									selectedBuilding.push(PR);
								})

								$.each(selectedBuilding, function (B, Bui) {
									poheadertopobuildingnav.push({
										"PoHeader": "",
										"Buildingno": Bui.BuildingNo,
										"Zone": Bui.Project,
										"Model": Bui.Model,
										"Submodel": Bui.Group,
										"ContractualIndicator": "O",
										"TextContInd": "",
										"VariationOrder": "",
										"ChangeIndicator": "AddB",
										"DeleteIndicator": "",
										"SrvStatus": "UA",
										//"PrNumber": Bui.PrNumber,
										"Network" : Bui.Network,
										// "ActivityNumber" : Bui.ActivityNumber,
										"Type" : Bui.ModelType
										
									})
								


								})

			if(PurchaseRequisitionSet.length > 0 ){
				
				$.each(PRItemSet, function (i, PR) {
					$.each(PR.Categories, function (s, sub) {
							$.each(sub.Categories, function (k, srv) {
								POHeaderToPOItem.push({
									"PoHeader": "",
									"PoItem": "",
									"SubBoq": srv.SubModel,
									//"WbsElement": bu.Model,
									"DeleteInd": "",
									"Plant": that.sPlant,
									"MatlGroup": srv.MatlGroup,
									"Qty": parseFloat((srv.Qty).toString()).toFixed(2),
									"PoUnit": "",
									//"Matdesc": cat.ShortDesc,
									"PriceUnit": (srv.PriceUnit).toString(), //item.PriceUnit,
									"ItemCat": "",
									"Acctasscat": "",
									"Boq": srv.Model,
									"ShortText": srv.ShortDesc,
									"LongText": srv.LongDesc,
									"Serviceno": srv.Data,
									"Servicedesc": srv.ShortDesc,
									"BaseUom": srv.Uom,      //item.UnitMeas,
									"WbsElement": "",// bu.WBS,
									"NoLimit": "X",
									"Buildingno": PR.PrNumber,//bu.BuildingNo,
									"Project": "",// bu.Project,
									"OvfTol": srv.OvfTol,
									"ChangeIndicator": "AddB",
									"DeliveryDate": that.getView().byId("idDeliveryDate").getValue(),
									"ContractualIndicator": "O",
									"SrvStatus": "UA",
									"ServiceType": srv.Eancat,
									"Currency": that.getView().byId("idCurrency").getValue(),
									"IuidRelevant": "P",
									"PrItem" : srv.Item,
									//"PrNumber": PR.PrNumber,
									"Network" : PR.Network,
									"ActivityNumber" : sub.ActivityNumber
								});
							});
						});
					
				});

			}

								$.each(BoqItemSet, function (i, boq) {
									$.each(boq.Categories, function (s, sub) {
										$.each(sub.Categories, function (j, cat) {
											$.each(cat.Categories, function (k, srv) {
			
												POHeaderToPOItem.push({
													"PoHeader": "",
													"PoItem": "",
													"SubBoq": srv.SubModel,
													//"WbsElement": bu.Model,
													"DeleteInd": "",
													"Plant": that.sPlant,
													"MatlGroup": srv.Item,
													"Qty": parseFloat((srv.Qty).toString()).toFixed(2),
													"PoUnit": "",
													"Matdesc": cat.ShortDesc,
													"PriceUnit": (srv.PriceUnit).toString(), //item.PriceUnit,
													"ItemCat": "D",
													"Acctasscat": "P",
													"Boq": srv.Model,
													"ShortText": srv.ShortDesc,
													"LongText": srv.LongDesc,
													"Serviceno": srv.Data,
													"Servicedesc": srv.ShortDesc,
													"BaseUom": srv.Uom,      //item.UnitMeas,
													"WbsElement": "",// bu.WBS,
													"NoLimit": "X",
													"Buildingno": "",//bu.BuildingNo,
													"Project": "",// bu.Project,
													"OvfTol": srv.OvfTol,
													"ChangeIndicator": "AddB",
													"DeliveryDate": that.getView().byId("idDeliveryDate").getValue(),
													"ContractualIndicator": "O",
													"SrvStatus": "UA",
													"ServiceType": srv.Eancat,
													"Currency": that.getView().byId("idCurrency").getValue(),
													"IuidRelevant": boq.ModelType === "WBS" ? "X" : ''
												});
											});
										});
									});
								});

						
								var item;
								$.each(POHeaderToPOItem, function (p, poItem) {
								//	$.each(BoqConsulidatedItemSet, function (i, item) {
									item = BoqConsulidatedItemSet.find(x => x.Data === poItem.Serviceno );
										if (/*poItem.MatlGroup === item.Item &&*/ poItem.Serviceno === item.Data) {
											POHeaderToPOItem[p].PriceUnit = parseFloat(item.PriceUnit).toFixed(that.CustomCurrency);
											POHeaderToPOItem[p].BaseUom = item.Uom;
											POHeaderToPOItem[p].ProvisionRate = item.ProvisionRate ? (item.ProvisionRate).toString() : "0";
										}
								//	});
								});
					            if(that.getView().byId("idNote").getValue() !== ""){
								ContractPONoteSet={
									PoNumber:'',
									NoteText:that.getView().byId("idNote").getValue(),
									Flag:"X"
								}
							}

								setTimeout(function () {
									var createdObject = {
										PoNumber: "",
										Flag: "",
										DocType: that.sDocType,
										Project: that.sProjectCode,
										Vendor: that.sVendor,
										PurchOrg: that.sPOrg,
										PurchDoc: "",
										Message: "",
										PurGroup: that.sPGrp,
										CompCode: that.sCoCode,
										DocDate: that.getView().byId("idDocumentDate").getValue() === "" ? null : that.getView().byId("idDocumentDate").getValue(),
										VperStart: that.getView().byId("idValidFromDate").getValue() === "" ? null : that.getView().byId("idValidFromDate").getValue(),
										VperEnd: that.getView().byId("idValidToDate").getValue() === "" ? null : that.getView().byId("idValidToDate").getValue(),
										Status: "",
										DeleteInd: "",

										ContractDesc: that.getView().byId("idContractDescription").getValue(),
										LongDesc: that.getView().byId("idLongDescription").getValue(),
										Currency: that.getView().byId("idCurrency").getValue(),
										MeasMethod: that.getView().byId("idMeasurementMethod").getSelectedKey(),
										ConstructionType: that.getView().byId("idConstructionType").getSelectedKey(),
										// CommencementId: that.getView().byId("idCommencement").getSelectedKeys().join(),
										RefContract: that.getView().byId("idRefrenceContract").getValue(),
										CreationDate: that.getView().byId("idDocumentDate").getValue() === "" ? null : that.getView().byId("idDocumentDate").getValue(),
										ValidFrom: that.getView().byId("idValidFromDate").getValue() === "" ? null : that.getView().byId("idValidFromDate").getValue(),
										ValidTo: that.getView().byId("idValidToDate").getValue() === "" ? null : that.getView().byId("idValidToDate").getValue(),
										SigninDate: that.getView().byId("idDeliveryDate").getValue() === "" ? null : that.getView().byId("idDeliveryDate").getValue(),
										RevisedValidTo: that.getView().byId("idRevisedValidToDate").getValue() === "" ? null : that.getView().byId("idRevisedValidToDate").getValue(),
									    // CommencementDate: that.getView().byId("idCommencementDate").getValue() === "" ? null : that.getView().byId("idCommencementDate").getValue() + "T00:00:00",
										// ContDurationMonth: that.getView().byId("idContractDurationMonth").getValue(),
									 	// ContDurationDays: that.getView().byId("idContractDurationDays").getValue(),
										IndexMonth: that.getView().byId("idIndexMonth").getSelectedKeys().join(),
										Consultant: that.sConsultant,
										ConsultantName: that.sConsultantName,
										Ss: that.getView().byId("idResponsiblepersonSS").getSelectedKey(),
										Ir: that.getView().byId("idResponsiblepersonIR").getSelectedKey(),
										//SuperiorWbs: that.getView().byId("idSupeiorWBS").getValue(),
										SuperiorWbs: that.SupeiorWBSCode,
										CreationType: that.getView().byId("idCreationType").getSelectedKey(),
										MarkUp: that.getView().byId("idMarkUp").getValue() === "" ? "0.0" : that.getView().byId("idMarkUp").getValue(),/// that.getView().byId("idMarkUp").getValue(),
										VendorName: that.sVendorName,
										//CONTRACTPOSRVITEMSET:"",
										POHeaderToPOItem: POHeaderToPOItem, //Base
										//	ContractPOSrvItemSet: ContractPOSrvItemSet,
										POHeaderToPOBuildingNav: poheadertopobuildingnav,
										//POHeaderToBoqItem: POHeaderToBoqItem,
										AttachmentSet: AttachmentSet,
										EstimatedContractValue: parseFloat(that.getModel("localJson").getProperty("/EstimatedContractValue")).toFixed(that.CustomCurrency),
										OriginalContractValue: parseFloat(that.getModel("localJson").getProperty("/OriginalContractValue")).toFixed(that.CustomCurrency),
										TotalContractValue: parseFloat(that.getModel("localJson").getProperty("/TotalContractValue")).toFixed(that.CustomCurrency),
										VariationOrderValue: parseFloat(that.getModel("localJson").getProperty("/VariationOrderValue")).toFixed(that.CustomCurrency),
										AddendumValue: parseFloat(that.getModel("localJson").getProperty("/AddendumValue")).toFixed(that.CustomCurrency),
										RevisedContractValue: parseFloat(that.getModel("localJson").getProperty("/RevisedContractValue")).toFixed(that.CustomCurrency),
										SerType: that.SERTYPE,
										ContractPONoteNav:ContractPONoteSet
									  	// 26-02Exempted: that.getView().byId("idExempted").getSelectedKey()
									};

									var oModel = that.getView().getModel();
									console.log(createdObject);
									that.getView().setBusy(true);
									const oListBinding = oModel.bindList("/ContractPOHeaderSet");

									// Ensure the request is sent
									oListBinding.attachCreateCompleted((oEvent) => {
										console.log("Create Event Completed:", oEvent);
									});

									const oContext = oListBinding.create(createdObject);

									oContext.created().then((oData) => {
										// Success Handling
										const oCreatedData = oContext.getObject();
										if (oCreatedData.PoNumber) {
											sap.m.MessageBox.success("Contract " + oCreatedData.PoNumber + " Created Successfully!", {
												//icon: sap.m.MessageBox.Icon.SUCCESS,
												title: "Success",
												onClose: function (oAction) {
													that.getRouter().navTo("object", {
														objectId: oCreatedData.PoNumber
													});
												}
											});
										} else {
											sap.m.MessageBox.error("Error: " + oCreatedData.Message, {
												title: "Error"
											});
										}
										that.getView().setBusy(false);
									}).catch((oError) => {
										// Error Handling
										that.getView().setBusy(false);
										sap.m.MessageToast.show("Error Creating Contract", {
											duration: 4000
										});

										let errorMsg = "An unexpected error occurred.";
										try {
											const oErrorResponse = JSON.parse(oError.responseText);
											const aMessages = oErrorResponse.error?.innererror?.errordetails || [];
											
											if (aMessages.length > 0) {
												let messageSet = that.getView().getModel("localJson").getProperty("/MessageSet") || [];
												aMessages.forEach((msg) => {
													messageSet.push({
														type: "Error",
														title: msg.code.substring(0, 10),
														description: msg.message
													});
												});

												that.getView().getModel("localJson").setProperty("/MessageSet", messageSet);
												that.getView().getModel("localJson").setProperty("/MessagesLength", messageSet.length);
											} else {
												errorMsg = oErrorResponse.error?.message || "Unknown error.";
											}
										} catch (e) {
											console.error("Error Parsing Response:", e);
										}

										sap.m.MessageBox.error(errorMsg, { title: "Error" });
									});
								}, 2000);
							}
							dialog.close();
						}
					}),
					endButton: new sap.m.Button({
						text: i18nBundle.getText("Cancel"),
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();

			},
			_createDialog: null,
			oncreatePO: function (oEvent) {

				var oController = this;
				// this.rowContext = oEvent.getSource().getBindingContext("dataModel");
				if (!this._createDialog) {
					this._createDialog = new sap.m.Dialog({
						title: "{i18n>Confirm}",
						content: [
							new sap.m.Label({
								text: oController.getResourceBundle().getText("detailRequestActivateMessage", "CONTRACT-0007")
							})
						],
						beginButton: new sap.m.Button({
							text: "{i18n>Yes}",
							press: function () {
								this._createDialog.close();
								// var PoNumber = oController.getView().getModel("dataModel").getProperty("/PoNumber"),
								var oModel = oController.getOwnerComponent().getModel();
								// oController.getView().getModel("detailView").setProperty("/busy", true);
								oModel.callFunction(
									"/CreatePurchaseOrder", {
									method: "POST",
									urlParameters: {
										"PoNo": "CONTRACT-0002"

									},
									success: function (data) {

									},
									error: function (e) {
										oController.getView().getModel("detailView").setProperty("/busy", false);
										sap.m.MessageToast.show(oController.getResourceBundle().getText("Error"), {
											duration: 4000
										});

									}
								});

							}.bind(this)
						}),
						endButton: new sap.m.Button({
							text: "{i18n>No}",
							press: function () {
								this._createDialog.close();
							}.bind(this)
						}),
						afterClose: function () {

							oController._createDialog.destroy();
							oController._createDialog = null;

						}
					});

					//to get access to the global model
					this.getView().addDependent(this._createDialog);
				}

				this._createDialog.open();

			},
			onChangeTolerance: function () {
				var that = this;
				var tol = that.getView().byId("idTolerance").getValue();
				var BoqItemSet = that.getView().getModel("localJson").getProperty("/BoqItemSet");

				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (s, sub) {

						$.each(sub.Categories, function (j, cat) {
							$.each(cat.Categories, function (k, srv) {
								BoqItemSet[i].Categories[s].Categories[j].Categories[k].OvfTol = tol;
							});
						});
					});

				});
				that.getView().getModel("localJson").setProperty("/BoqItemSet", BoqItemSet);
			},
			changeContractType: function () {
				var that = this;
				if (that.getView().byId("idMeasurementMethod").getSelectedKey() === "LUMP" || that.getView().byId("idMeasurementMethod").getSelectedKey() === "COST")
					that.getView().byId("idTolerance").setVisible(false);
				else
				//	that.getView().byId("idTolerance").setVisible(true);

				if (that.getView().byId("idMeasurementMethod").getSelectedKey() === "COST")
					that.getView().byId("idMarkUp").setVisible(true);
				else
					that.getView().byId("idMarkUp").setVisible(false);

			},
			onChangeQty: function (oEvent) {

				var that = this;
				var path = oEvent.getSource().getBindingContext("localJson").getPath();
				// var sPath = oEvent.getSource().getBindingContext("localJson").getObject();
				var sPath = that.getView().getModel("localJson").getProperty(path);
				var Qty = oEvent.getParameters().newValue;
				var BoqConsulidatedItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
				//var myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
				var myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));

				var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
				var newQty = 0;
				var myWBSSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myWBSSet")));
				var count = 0;
				if (sPath.ModelType === "BOQ") {
					$.each(myBuildingSet, function (i, bu) {
						if ("00000" + bu.Model === sPath.Model)
							++count;
					});
				} else {
					$.each(myWBSSet, function (i, bu) {
						if (bu.Model === sPath.Model)
							++count;
					});
				}

				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						$.each(sub.Categories, function (l, cat) {
							$.each(cat.Categories, function (k, srv) {

								if (sPath.Data === srv.Data) {
									newQty = (parseFloat(newQty) + parseFloat(srv.Qty)).toString();
								}
							})
						})
					})
				})
				$.each(BoqConsulidatedItemSet, function (k, srv) {
					if (srv.Data === sPath.Data) {
						//srv.Qty = JSON.parse(JSON.stringify(srv.Qty)) - (parseInt(sPath.Qty) * count);
						BoqConsulidatedItemSet[k].Qty = newQty;//(JSON.parse(JSON.stringify(srv.Qty)) + (parseInt(Qty) * count)).toString();
					}
				});
				that.getView().getModel("localJson").setProperty(path + "/Qty", Qty === "" ? "0" : JSON.parse(JSON.stringify(Qty)));

				that.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(BoqConsulidatedItemSet.sort((a, b) => a.Data - b.Data))));
				that.onPriceConsolidatedChange("", sPath, JSON.parse(JSON.stringify(Qty)));
			},
			onPriceConsolidatedChange: function (oEvent, object, qty) {

				var that = this;
				var findservice , ModelType;
				var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
				var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
                var PRItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/PRItemSet")));
				var myPurchaseRequisition = this.getView().getModel("localJson").getProperty("/myPurchaseRequisition");
				
				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						$.each(sub.Categories, function (l, cat) {
							$.each(cat.Categories, function (k, srv) {
								BoqItemSet[i].PriceUnit = "0";
								BoqItemSet[i].Categories[j].PriceUnit = "0";
								BoqItemSet[i].Categories[j].Categories[l].PriceUnit = "0";


							});

						});
					});

				});
				//----- Clear PR Table----------
				$.each(PRItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						$.each(sub.Categories, function (l, srv) {
								boq.PriceUnit = "0";
								sub.PriceUnit = "0";
								srv.PriceUnit = "0";
						});
					});

				});


				if (oEvent !== "") {
					var obj = oEvent.getSource().getBindingContext("localJson").getObject();
					var oldPrice = JSON.parse(JSON.stringify(obj.PriceUnit));
					var service = obj.Serviceno;
				
				//	});
					$.each(consolidate, function (c, cons) {
						$.each(BoqItemSet, function (i, boq) {
							$.each(boq.Categories, function (j, sub) {
								$.each(sub.Categories, function (l, cat) {
									$.each(cat.Categories, function (k, srv) {
										if (cons.Data === srv.Data) {
											var go = false;
											$.each(that.myBuildingSet, function (s, selected) {
												if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model) {
													go = true;
												}
											});
											$.each(that.myWBSSet, function (s, selected) {
												if ((selected.Model) === srv.Model) {
													go = true;
												}
											});
											if (go) {
											
												var ConsolidatedPrice = JSON.parse(JSON.stringify(cons.PriceUnit));
												BoqItemSet[i].Categories[j].Categories[l].Categories[k].price = ConsolidatedPrice;
												BoqItemSet[i].Categories[j].Categories[l].Categories[k].PriceUnit = (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty)).toString();
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].PriceUnit = (parseFloat(BoqItemSet[i].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].Categories[l].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].Categories[l].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
											}
										}
									});

								});
							});

						});
					});

					//---------------------PR-------------------------------
				
					$.each(PRItemSet, function (i, boq) {
						$.each(boq.Categories, function (j, sub) {
								$.each(sub.Categories, function (k, srv) {
									findservice = consolidate.find(x => x.Data === srv.Data);
									ModelType = findservice.ModelBoq.find(x => x.ModelType === "PR")
									if (findservice.Data === srv.Data && ModelType.ModelType === 'PR') {
										$.each(myPurchaseRequisition, function (s, selected) {
											if (selected.PrNo == boq.PrNumber  && sub.Data  === srv.Item ) {
											var ConsolidatedPrice = JSON.parse(JSON.stringify(findservice.PriceUnit));
											srv.price = ConsolidatedPrice;
											srv.PriceUnit = (ConsolidatedPrice * parseFloat(srv.Qty)).toString();
										    srv.Qty = parseFloat(srv.Qty).toString();
											if (srv.Eancat !== "C" && srv.Eancat !== "U") { boq.PriceUnit = (parseFloat(boq.PriceUnit) + (ConsolidatedPrice * parseFloat(srv.Qty))).toString(); }
											if (srv.Eancat !== "C" && srv.Eancat !== "U") { sub.PriceUnit = (parseFloat(sub.PriceUnit) + (ConsolidatedPrice * parseFloat(srv.Qty))).toString(); }
											
										}
								  });
								 }
							  });
							});
					    });

					//------------------------------end PR--------------------------------

				} else {
					var obj = object;
					var service = obj.Serviceno;
			
					$.each(consolidate, function (c, cons) {
						$.each(BoqItemSet, function (i, boq) {
							$.each(boq.Categories, function (j, sub) {
								$.each(sub.Categories, function (l, cat) {
									$.each(cat.Categories, function (k, srv) {
										if (cons.Data === srv.Data) {
											var go = false;
											$.each(that.myBuildingSet, function (s, selected) {
												if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model) {
													go = true;
												}
											});
											$.each(that.myWBSSet, function (s, selected) {
												if ((selected.Model) === srv.Model) {
													go = true;
												}
											});
											if (go) {
									
												var ConsolidatedPrice = JSON.parse(JSON.stringify(cons.PriceUnit));
												BoqItemSet[i].Categories[j].Categories[l].Categories[k].price = ConsolidatedPrice;
												BoqItemSet[i].Categories[j].Categories[l].Categories[k].PriceUnit = (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty)).toString();
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].PriceUnit = (parseFloat(BoqItemSet[i].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].Categories[l].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].Categories[l].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
											}
										}
									});

								});
							});

						});
					});

				}
				$.each(consolidate, function (i, Amount) {
					consolidate[i].Amount = parseFloat(consolidate[i].Qty) * parseFloat(consolidate[i].PriceUnit);
				});

				that.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(consolidate.sort((a, b) => a.Data - b.Data))));
				that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet.sort((a, b) => a.Data - b.Data))));
				that.getView().getModel("localJson").setProperty("/PRItemSet", JSON.parse(JSON.stringify(PRItemSet.sort((a, b) => a.Data - b.Data))));
				this.ContractValueHeader();
			},
			onExpandFirstLevel: function () {
				var oTreeTable = this.byId("TreeTableBasic");
				oTreeTable.expandToLevel(3);
			},
			onCollapseAll: function () {
				var oTreeTable = this.byId("TreeTableBasic");
				oTreeTable.collapseAll();
			},
			handleOpenActionSheet1: function (oEvent) {
				var oButton = oEvent.getSource();

				// create action sheet only once
				if (!this._actionSheet) {
					this._actionSheet = sap.ui.xmlfragment("com.cicre.po.view.fragments.ActionSheetDialog", this);
					this.getView().addDependent(this._actionSheet);
				}

				this._actionSheet.openBy(oButton);


			},

			/////////////////////////// open add wbs dialog
			onWBSSelectionValueHelpPressB: function (oEvent) {

				if(oEvent.getSource().getId().lastIndexOf("idAddPurchaseRequisitionc") > -1){
					this.fragmentType = 'PR';
					if ( this.sProjectCode  === "" ){
						sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("PleaseEnterTheProject"));
						return;
					}else{
						this.onPRSelectionValueHelpPress();
					}
					

				}else{
					this.fragmentType = 'WBS';
					this.onWBSSelectionValueHelpPress();
				}
				this.getView().getModel("localJson").setProperty("/fragmentType",this.fragmentType);
			
			},
			onAddWBSCreate: function () {
				var that = this;
				if (that.sProjectCode !== "" && that.sCoCode !== "") {
					if (!that._oWBSDialog) {
						that._oWBSDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SelectMultiWBSCreate", that);
						var i18nModel = new sap.ui.model.resource.ResourceModel({
							bundleUrl: "i18n/i18n.properties"
						});
						that._oWBSDialog.setModel(i18nModel, "i18n");
						that._oWBSDialog.setModel(that.getView().getModel());
					}

					that._oWBSDialog.open();
					var mModel = that.getView().getModel();

					var oModelJson = new sap.ui.model.json.JSONModel();
					oModelJson.setData({
						"WBSSet": []
					});
					that._oWBSDialog.setModel(oModelJson, "localJson");

					var filters = [];
					var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBS");
					var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
					var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
					filters.push(oFilter1);
					filters.push(oFilter2);
					filters.push(oFilter3);

					mModel.read("/ValueHelpSet", {
						filters: filters,
						success: function (oData) {
							$.each(oData.results, function (v, value) {
								oData.results[v].Group = "";
								oData.results[v].Model = oData.results[v].IdNumber;
							});
							var data = JSON.parse(JSON.stringify(oData.results));
							that._oWBSDialog.getModel("localJson").setProperty("/WBSSet", data);
						},
						error: function (e) {
							sap.m.MessageToast.show("Error");
						}
					});


					that.aContexts = [];
					that.Boqs = [];
					that.BUBoQs = [];
					that.WBSBoQs = [];
				} else {
					sap.m.MessageToast.show("Please select Company Code and Project first.");
				}
			},
			_handleCancelPressWBS: function () {
				var that = this;
				var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding");
				var filter = [];
				for (var v = 0; v < that.myWBSSet.length; v++) {
					var found = false;
					$.each(selectedBuilding, function (s, sel) {
						if (that.myWBSSet[v].Model === sel.Model)
							found = true;
					});
					if (!found) {
						filter.push(that.myWBSSet[v]);
					}
				}
				that.myWBSSet = JSON.parse(JSON.stringify(filter));
				that.getView().getModel("localJson").setProperty("/myWBSSet", that.myWBSSet);

				that.getView().getModel("localJson").setProperty("/selectedBuilding", []);

				that._oWBSDialog.close();

			},

			onWBSSelectionChange: function (oEvt) {

				var that = this;
				var oList = oEvt.getSource();
				var notExist = true,
					selectedBUWBS = [],
					nullGroup = [];
				that.BUBoQs = [];
				that.WBSBoQs = [];
				//that.Boqs = [];
				var selectedBuildingOrWBS = that.getView().getModel("localJson").getProperty("/selectedBuildingOrWBS");
				var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding"),
					selectedIndices = this._contractDialog.getTable().getSelectedIndices();
				that.myWBSSet = that.getView().getModel("localJson").getProperty("/myWBSSet");

				if (selectedIndices.length > 0) {
					for (var i = 0; i < selectedIndices.length; i++) {
						var selectedBU = this._contractDialog.getTable().getContextByIndex(selectedIndices[i]).getObject();
						selectedBU.ChangeIndicator = "AddB";
						selectedBUWBS.push(selectedBU);

					}

					$.each(selectedBUWBS, function (i, bu) {
						if (bu.Group === "") {
							nullGroup.push(bu.IdNumber);

							notExist = false;
						}
					});
					$.each(that.myWBSSet, function (i, bu) {
						$.each(selectedBUWBS, function (w, WBS) {
							if (WBS.IdNumber === bu.IdNumber && bu.Model === WBS.Model && bu.Group === WBS.Group) {
								nullGroup.push(bu.IdNumber);
								notExist = false;
							}
						});
					});

					if (notExist) {
						$.each(selectedBUWBS, function (w, WBS) {
							selectedBUWBS[w].ContractualIndicator = "O";
							selectedBUWBS[w].SrvStatus = "UA";
							selectedBUWBS[w].ModelType = "WBS";
							selectedBUWBS[w].DelInd = "";
							selectedBUWBS[w].AsBuild2 = "";
							selectedBUWBS[w].WbsCode = selectedBUWBS[w].SelectionParameter;
							selectedBUWBS[w].Txt = "Original";
							selectedBUWBS[w].SubBoq = selectedBUWBS[w].Group;
							selectedBUWBS[w].GroupCode = selectedBUWBS[w].SelectionParameter6;
							selectedBUWBS[w].BuildingNo = parseInt(selectedBUWBS[w].IdNumber).toString();
							that.myWBSSet.push(selectedBUWBS[w]);
							selectedBuildingOrWBS.push(selectedBUWBS[w]);
							selectedBuilding.push(selectedBUWBS[w]);

						})

						that.aContexts.push(selectedBUWBS);

						that.getView().getModel("localJson").setProperty("/selectedBuilding", selectedBuilding);
						that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", selectedBuildingOrWBS);
						this.onWBSContractClose();
						this._handleValueHelpCloseWBS();
					} else if (!notExist) {
						var errormas = nullGroup.join();
						sap.m.MessageToast.show("WBS is already added or don't select Boq " + errormas);
					}
				} 
			},

			_handleValueHelpCloseWBS: function (oEvt) {

				var that = this,
					mModel = that.getView().getModel(),
					filters = [],
					endstartloop = 4;
				var oModelJson = new sap.ui.model.json.JSONModel();
				var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/selectedBuilding")));
				//var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myWBSSet")));

				var objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));

				if (that.aContexts.length === 0)
					sap.m.MessageToast.show("Select one WBS at least!");
				else {
					var noSub = false;
					$.each(that.myWBSSet, function (b, bu) {
						if (bu.Group === "") {
							noSub = true;
						}

					});
					if (noSub)
						sap.m.MessageToast.show("Select Boq for each WBS!");
					else {
						$.each(selectedBuilding, function (i, bu) {
							that.BUBoQs.push(bu.Model + bu.Group);
						});


						that.BUBoQs.sort();
						var selectedBuildingOrWBS = that.getView().getModel("localJson").getProperty("/selectedBuildingOrWBS");

						$.each(selectedBuildingOrWBS, function (i, SelectBuilding) {
							//var oFilter3= ;
							var oFilter1 = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.BT, SelectBuilding.Model, SelectBuilding.Group);
							//var oFilter1 = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.BT, SelectBuilding.Model,SelectBuilding.Group );
							if (oFilter1 !== "") { filters.push(oFilter1); }


						})
						that.getView().setBusy(true);
						var oFilter2 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
						var oFilter3 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, that.sCoCode);
						var oFilter4 = new sap.ui.model.Filter("Eancat", sap.ui.model.FilterOperator.EQ, 'W');
						if (oFilter2 !== "") { filters.push(oFilter2); }
						if (oFilter3 !== "") { filters.push(oFilter3); }
						if (oFilter4 !== "") { filters.push(oFilter4); }

						this.objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
						that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", []);
						that.getView().getModel("localJson").setProperty("/myWBSSet", JSON.parse(JSON.stringify(that.myWBSSet)));
						var BoqConsulidatedItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
						var list = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
						//////////////////////////////////////////////////////////////////////////////////////
						// Apply filters if needed
						var sPath = "/BoqTreeSet"; // Your entity set path
						var oBinding = mModel.bindList(sPath, undefined, undefined, filters);
						// Request data
						oBinding.requestContexts(0, 100).then(function (aContexts) {
							var OData = aContexts.map(oContext => oContext.getObject());

								var start = 1;
								var BoqItemSet = [];
								/*  $.each(OData, function (i, ServiceBoq) {
									  if()
								  })*/
								$.each(OData, function (i, ServiceBoq) {
									OData[i].DelInd = "";
									OData[i].ModelType = "WBS";
									if (OData[i].LevelNo === "1") {
										OData[i].live = "one";
										OData[i].AddNew = "AN";
									}

									if (OData[i].Eancat === "" && parseInt(OData[i].LevelNo) === 4) {

										OData[i].Qty = "0";
										OData[i].Uom = "";
										OData[i].Price = "0";

									}
									OData[i].DelInd = "";
									OData[i].ModelType = "WBS";
									if (OData[i].Eancat === "U") { OData[i].Qty = 0; }
									if (parseInt(OData[i].LevelNo) === 4) {
										OData[i].Txt = "Original";
										//OData[i].PriceUnit = "1";
										OData[i].DelInd = "";
										//OData[i].Price = "1";
										if (OData[i].Eancat != "") {
											OData[i].PriceUnit = "1";
											OData[i].Price = "1";
										}
										OData[i].ContractualIndicator = "O";
										OData[i].Indicator = "Y";
									
									} else {
										OData[i].Indicator = "Z";
									}

								});

								//	for (start; start < (OData.length + 1); start++) {
								for (start; start <= parseInt(endstartloop); start++) {
									BoqItemSet.push({
										[start]: []
									});
									for (var i = 0; i < OData.length; i++) {
										OData[i].Categories = [];
										if (parseInt(OData[i].LevelNo) === start) {
											BoqItemSet[start - 1][start].push(OData[i]);

										}

									}
								}

								var TreeBoqItemSet = [];
								$.each(BoqItemSet, function (i, hierachy) {
									if (i < 3) {
										$.each(hierachy, function (p, parent) {
											if (parent.length !== 0) {
												$.each(parent, function (n, node) {
										
													$.each(BoqItemSet[i + 1], function (a, newHierachy) {
														
														$.each(newHierachy, function (b, newParent) {
															if (newParent.length !== 0) {
															
																if (node.LevelId === newParent.Parent) {
																	node.Categories.push(newParent);
																}
															}
														});
													});
											
												});
											}
										});
									}
								});
								$.each(BoqItemSet[0], function (a, newHierachy) {
									// $.each(newHierachy, function (b, newParent) {
									if (newHierachy.length !== 0) {
										$.each(newHierachy, function (c, newNode) {
											TreeBoqItemSet.push(newNode);
											//objSet.push(newNode);
										});
									}
									// });
								});

								var go = false;
								var found = false;
								$.each(TreeBoqItemSet, function (c, newNode) {
									go = false;
									found = false;
									if (that.objSet.length !== 0) {
										$.each(that.objSet, function (i, oldNode) {
											/*$.each(oldNode.Categories, function (oc, oldcat) {*/
											$.each(newNode.Categories, function (nc, nCat) {
										
												$.each(oldNode.Categories, function (oc, oldcat) {
													if (newNode.Data === oldNode.Data) {  //if(nCat.Data === oldcat.Data ){
														go = true;
														if (nCat.Data === oldcat.Data) { //if(newNode.Data === oldNode.Data ){
															found = true;
														}
													}
												})
												if (go && !found) {
													if (nCat.Model === oldNode.Model) {
														that.objSet[i].Categories.push(TreeBoqItemSet[c].Categories[nc]);
														found = false;
													}
												}
												//	}
											})
										})
										if (!go && !found) {
											that.objSet.push(newNode);
											go = false;
											found = false;
										}

									} else {
										that.objSet.push(newNode);
									}
									found = false;
									go = false;
								});

								that.getView().getModel("localJson").setProperty("/BoqItemSet", that.objSet);
								that.Consoliatedservices();
								
								that.getView().setBusy(false);
								var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
								var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
								//		$.each(consolidate, function (c, cons) {
								$.each(BoqItemSet, function (i, boq) {
									$.each(boq.Categories, function (j, sub) {
										$.each(sub.Categories, function (l, cat) {
											$.each(cat.Categories, function (k, srv) {
											
												BoqItemSet[i].PriceUnit = "0";
												BoqItemSet[i].Categories[j].PriceUnit = "0";
												BoqItemSet[i].Categories[j].Categories[l].PriceUnit = "0";
												BoqItemSet[i].Categories[j].Categories[l].Categories[k].Matdesc = BoqItemSet[i].Categories[j].Categories[l].ShortDesc;
												//BoqItemSet[i].Categories[j].Categories[l].Categories[k].ModelType = "WBS";
												//	}

											});

										});
									});

								});
								//			});
								//		var d = '1501990';
								//	var exist = consolidate.find(x => x.Data === d);
								var findservice;
								//		$.each(consolidate, function (c, cons) {
								$.each(BoqItemSet, function (i, boq) {
									$.each(boq.Categories, function (j, sub) {
										$.each(sub.Categories, function (l, cat) {
											$.each(cat.Categories, function (k, srv) {
												findservice = consolidate.find(x => x.Data === srv.Data);
												if (findservice.Data === srv.Data) {
													var go = false;
													$.each(that.myBuildingSet, function (s, selected) {
														if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model) {
															go = true;
														}
													});
													$.each(that.myWBSSet, function (s, selected) {
														if ((selected.Model) === srv.Model) {
															go = true;
														}
													});
													if (go) {

														var ConsolidatedPrice = JSON.parse(JSON.stringify(findservice.PriceUnit));
														BoqItemSet[i].Categories[j].Categories[l].Categories[k].price = ConsolidatedPrice;
														BoqItemSet[i].Categories[j].Categories[l].Categories[k].PriceUnit = (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty)).toString();
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].PriceUnit = (parseFloat(BoqItemSet[i].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].Categories[l].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].Categories[l].PriceUnit) + (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }

													}
												}
											});

										});
									});

								});
								//});



								that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet.sort((a, b) => a.Data - b.Data))));
								that.ContractValueHeader();
								that.getView().setBusy(false);

								//	that.getView().getModel("ConJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(BoqConsulidatedItemSet)));
							},

					        ).catch(function (oError) {

								sap.m.MessageToast.show("Error");
								that.getView().setBusy(false);
						});
					}
				}
			},

			/////////////// project f4 /////////////////////////////////
			// open project value help
			onDisplaySearchProjectDialog: function () {
				if (this._pDialog) {
					this._pDialog.destroy();
					this._pDialog = null;
				}
				if (!this._pDialog) {
					this._pDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.ProjectSearchDialog", this);


					this._pDialog.setModel(this.getView().getModel());
				}
				this._pDialog.open();
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}",
					info : "{SelectionParameter}"
					
				});
				var aFilters = [];

				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PROJ');
				aFilters.push(oFilter1);
				this._pDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},

			//search in project value help dialog
			handleSearchProject: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var oTemplate = new sap.m.StandardListItem({
					title: "{IdText}",
					description: "{IdNumber}"
				});
				var aFilters = [];

				var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PROJ');
				var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
				aFilters.push(oFilter1);
				aFilters.push(oFilter2);

				this._pDialog.bindAggregation("items", {
					path: "/ValueHelpSet",
					template: oTemplate,
					filters: aFilters
				});
			},

			onSelectProjectList: function (oEvent) {

				var that = this;
				var aContexts = oEvent.getParameter("selectedContexts");
				if (aContexts && aContexts.length) {
					aContexts.map(function (oContext) {
						that.sProjectCode = oContext.getObject().IdNumber;
						that.getView().byId("_idSearchByProject").setValue(oContext.getObject().IdText);

						//return oContext.getObject().Name;
					});
				} else {
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},
			////////////////////////// Refrence contracts and searching in it's dialog //////////////////////


			onDisplaySearchRefrenceContractDialog: function () {
				if (!this._oRefContractDialog) {
					this._oRefContractDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SelectMultiRefrenceContract", this);
					this._oRefContractDialog.setModel(this.getView().getModel());
				}
				this._oRefContractDialog.open();
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties"
				});
				this._oRefContractDialog.setModel(i18nModel, "i18n");
			},

			onSearchContract: function () {
				var that = this;
				var oPOTable = sap.ui.getCore().byId("table");
				oPOTable.setBusy(true);
				var mModel = this.getView().getModel();
				mModel.read("/ContractPOHeaderSet");
				oPOTable.setModel(mModel, "poModel");
				var oFilter1 = new sap.ui.model.Filter("PurchDoc", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("idSearchByPO").getValue());
				var oFilter3 = new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ, this.sSearchVendor);
				var oFilter4 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, this.sSearchCoCode);
				var oFilter5 = new sap.ui.model.Filter("PurchOrg", sap.ui.model.FilterOperator.EQ, this.sSearchPOrg);
				var oFilter6 = new sap.ui.model.Filter("PurGroup", sap.ui.model.FilterOperator.EQ, this.sSearchPGrp);
				var oFilter7 = new sap.ui.model.Filter("Flag", sap.ui.model.FilterOperator.EQ, "X");

				var allFilter = [];

				if (sap.ui.getCore().byId("idSearchByPO").getValue().length > 0) {
					allFilter.push(oFilter1);
				}
				if (this.sSearchVendor.length > 0 && sap.ui.getCore().byId("idSearchByVendor").getValue() !== "") {
					allFilter.push(oFilter3);
				}
				if (this.sSearchCoCode.length > 0) {
					allFilter.push(oFilter4);
				}
				if (this.sSearchPOrg.length > 0 && sap.ui.getCore().byId("idSearchPurchaseOrganization").getValue() !== "") {
					allFilter.push(oFilter5);
				}
				if (this.sSearchPGrp.length > 0 && sap.ui.getCore().byId("idSearchPurchaseGroup").getValue() !== "") {
					allFilter.push(oFilter6);
				}
				allFilter.push(oFilter7);

				var oBinding = oPOTable.getBinding("items");
				oBinding.filter(allFilter);
				oPOTable.setBusy(false);
			},

			_handleCancelPressContract: function () {
				var that = this;
				that._oRefContractDialog.close();
			},
			_handleValueHelpCloseContract: function () {
				var that = this;
				var contracts = that.selectedRefContracts.join();
				that.getView().byId("idRefrenceContract").setValue(contracts);
				that._oRefContractDialog.close();
			},
			onAfterClose: function () {
				if (this._oRefContractDialog) {
					this._oRefContractDialog.destroy();
					this._oRefContractDialog = null; // make it falsy so that it can be created next time
				}
			},
			onRefContSelectionChange: function (oEvt) {
				var that = this;
				var oList = oEvt.getSource();
				var notExist = true;
				// that.Boqs = [];
				that.selectedRefContracts = that.getView().getModel("localJson").getProperty("/selectedRefContracts");

				if (oEvt.getParameters().selected === true) {
					var selectedBU = oEvt.getParameter("listItem").getBindingContext("poModel").getObject();
					$.each(that.selectedRefContracts, function (i, bu) {
						if (bu === selectedBU.PurchDoc)
							notExist = false;
					});

					if (notExist) {
						that.selectedRefContracts.push(selectedBU.PurchDoc);

						that.getView().getModel("localJson").setProperty("/selectedRefContracts", that.selectedRefContracts);

						that.aContexts = oList.getSelectedContexts(true);

					} else if (!notExist) {
						var list = oEvt.getSource();
						var Item = list.getSelectedItem();
						Item.setSelected(false);
						var path = oEvt.getParameter("listItem").getBindingContextPath();
						var index = path.slice(path.lastIndexOf('/') + 1);
						// that.aContexts.splice(index, 1);

						sap.m.MessageToast.show("Contract is already added!");
					}
				} else {
					// var path = oEvt.getParameter("listItem").getBindingContextPath().split('/')[1];
					var path = oEvt.getParameter("listItem").getBindingContextPath();
					var index = path.slice(path.lastIndexOf('/') + 1);

					that.selectedRefContracts.splice(index, 1);
					that.aContexts.splice(index, 1);
					that.getView().getModel("localJson").setProperty("/selectedRefContracts", that.selectedRefContracts);
				}
			},


			changeCreationType: function () {
				if (this.getView().byId("idCreationType").getSelectedKey() === "E")
					this.getView().getModel("localJson").setProperty("/estimatedMode", true);
				else
					this.getView().getModel("localJson").setProperty("/estimatedMode", false);
				this.getView().byId("idSupeiorWBS").setValueState("None");

			},
			//////////////////////// add estimated services ///////////////////////////

			handleAddEstimatedContract: function () {
				var that = this;
				var EstimatedContracts = that.getModel("localJson").getProperty("/EstimatedContracts");

				var itemRow = {
					Servicedesc: "",
					Amount: "",
				}

				EstimatedContracts.push(itemRow);
				that.getModel("localJson").setProperty("/EstimatedContracts", EstimatedContracts);
			},
			deleteEstimatedContract: function (oEvent) {
				var that = this;
				var EstimatedContracts = that.getModel("localJson").getProperty("/EstimatedContracts");
				var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
				var index = splitedPath[2];

				EstimatedContracts.splice(index, 1);
				that.getModel("localJson").setProperty("/EstimatedContracts", EstimatedContracts);

				that.getModel("localJson").refresh(true);
				this.ContractValueHeader();
			},

			///////////////add variationOrder////[E.A]///////////////////
			handlevariationOrder: function () {
				var that = this;
				var EstimatedContracts = that.getModel("localJson").getProperty("/EstimatedContracts");

				var itemRow = {
					Servicedesc: "",
					Amount: "",
				}

				EstimatedContracts.push(itemRow);
				that.getModel("localJson").setProperty("/EstimatedContracts", EstimatedContracts);
			},
			/*	deleteEstimatedContract: function (oEvent) {
					var that = this;
					var EstimatedContracts = that.getModel("localJson").getProperty("/EstimatedContracts");
					var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
					var index = splitedPath[2];
					
					EstimatedContracts.splice(index, 1);	
					that.getModel("localJson").setProperty("/EstimatedContracts", EstimatedContracts);
	
					that.getModel("localJson").refresh(true);
				},*/
			onDeleteBuilding: function (oEvent) {

				var that = this;
				// Confirmation dialog
				var dataModel = this.getView().byId("IdBuildingTable").getModel("localJson");
				var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
				var index = parseInt(splitedPath[2]);
				var data = dataModel.getProperty("/myBuildingSet/" + index);
				var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
				var currentView = this.getView();
				var i18nBundle = currentView.getModel("i18n").getResourceBundle();
				// Confirmation dialog

				var dialog = new sap.m.Dialog({
					title: i18nBundle.getText("Delete"),
					type: "Message",
					content: new sap.m.Text({
						text: i18nBundle.getText("Msg_Confirm_Delete")
					}),
					beginButton: new sap.m.Button({
						text: i18nBundle.getText("Delete"),
						type: "Emphasized",
						press: function () {
							var oModel = that.getView().getModel("localJson");
							var oRowData = oModel.getProperty(sPath);
							if (data.SrvStatus === "UA") {
								//oRowData.ChangeIndicator = (oRowData.DelInd === "X") ? "" : "DeleteB";
								oRowData.DelInd = (oRowData.DelInd === "Y") ? "" : "Y";
								dialog.close();
								data.Boq = ((data.Model).length === 8 ? data.Model : "00000" + data.Model)
								that.deletesrv(data);
								that.deleteBOQliseConsolidate(data);
								oModel.setProperty(sPath, oRowData);
							} else if (data.SrvStatus === "A") {
								sap.m.MessageToast.show("you should handel this service");
								//  oRowData.ChangeIndicator = (oRowData.DelInd === "X") ? "" : "DeleteB";
								oRowData.DelInd = (oRowData.DelInd === "X") ? "" : "X";
								//	that.deletesrvA(data, sPath)
								dialog.close();
								oModel.setProperty(sPath, oRowData);
							}
						}
					}),
					endButton: new sap.m.Button({
						text: i18nBundle.getText("Cancel"),
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();

			},
			onDeleteWBS: function (oEvent) {

				var that = this;
				// Confirmation dialog
				var dataModel = this.getView().byId("IdWBSTable").getModel("localJson");
				var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
				var index = parseInt(splitedPath[2]);
				var data = dataModel.getProperty("/myWBSSet/" + index);
				var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
				var currentView = this.getView();
				var i18nBundle = currentView.getModel("i18n").getResourceBundle();
				// Confirmation dialog

				var dialog = new sap.m.Dialog({
					title: i18nBundle.getText("Delete"),
					type: "Message",
					content: new sap.m.Text({
						text: i18nBundle.getText("Msg_Confirm_Delete")
					}),
					beginButton: new sap.m.Button({
						text: i18nBundle.getText("Delete"),
						type: "Emphasized",
						press: function () {
							var oModel = that.getView().getModel("localJson");
							var oRowData = oModel.getProperty(sPath);
							if (data.SrvStatus === "UA") {
								oRowData.DelInd = "Y";  //(oRowData.DelInd === "Y") ? "" : "Y";
								oRowData.ChangeIndicator = "Y";
								dialog.close();
								//data.Boq = data.IdNumber;
								data.Boq = ((data.Model).length === 8 ? data.Model : "00000" + data.Model)
								that.deletesrv(data);
								that.deleteBOQliseConsolidate(data);
								oModel.setProperty(sPath, oRowData);
							} else if (data.SrvStatus === "A") {
								sap.m.MessageToast.show("you should handel this service");
								//  oRowData.ChangeIndicator = (oRowData.DelInd === "X") ? "" : "DeleteB";
								oRowData.DelInd = (oRowData.DelInd === "X") ? "" : "X";
								that.deletesrvA(data, sPath)
								dialog.close();
								oModel.setProperty(sPath, oRowData);
							}
						}
					}),
					endButton: new sap.m.Button({
						text: i18nBundle.getText("Cancel"),
						press: function () {
							dialog.close();
						}
					}),
					afterClose: function () {
						dialog.destroy();
					}
				});
				dialog.open();

			},

			onPRSelectionChange: function (oEvt) {

				var oController = this;
				var notExist = true,
					selectedBUPR = [],
					nullGroup = [];
				var selectedPR = oController.getView().getModel("localJson").getProperty("/selectedPR");
				var PurchaseRequisition = oController.getView().getModel("localJson").getProperty("/myPurchaseRequisition"),
					selectedIndices = this._contractDialogPR.getTable().getSelectedIndices();
					oController.myWBSSet = oController.getView().getModel("localJson").getProperty("/myWBSSet");

				if (selectedIndices.length > 0) {
					for (var i = 0; i < selectedIndices.length; i++) {
						var selectedBU = this._contractDialogPR.getTable().getContextByIndex(selectedIndices[i]).getObject();
						selectedBU.ChangeIndicator = "AddB";
						selectedBUPR.push(selectedBU);

					}
				/*	$.each(selectedBUPR, function (i, bu) {
						if (bu.Group === "") {
							nullGroup.push(bu.IdNumber);
							notExist = false;
						}
					});*/
					$.each(PurchaseRequisition, function (i, bu) {
						$.each(selectedBUPR, function (w, WBS) {
							if (WBS.IdNumber === bu.IdNumber && bu.Model === WBS.Model && bu.Group === WBS.Group) {
								nullGroup.push(bu.IdNumber);
								notExist = false;
							}
						});
					});

					if (notExist) {
						$.each(selectedBUPR, function (w, WBS) {
							selectedBUPR[w].ContractualIndicator = "O";
							selectedBUPR[w].SrvStatus = "UA";
							selectedBUPR[w].DelInd = "";
							selectedBUPR[w].AsBuild2 = "";
							selectedBUPR[w].ModelType = "PR";
							selectedBUPR[w].BoqDesc = selectedBUPR[w].ActivityNumberDesc;
							//selectedBUPR[w].WbsCode = selectedBUPR[w].SelectionParameter;
							selectedBUPR[w].Txt = "Original";
							selectedBUPR[w].ActivityNumber = selectedBUPR[w].ActivityNumber;
							selectedBUPR[w].Network = selectedBUPR[w].Network;
							selectedBUPR[w].PrNo = parseInt(selectedBUPR[w].PrNo).toString(); // PR NO
							selectedBUPR[w].PrNumber = parseInt(selectedBUPR[w].PrNo).toString(); // PR 
							selectedBUPR[w].BuildingNo = parseInt(selectedBUPR[w].PrNo).toString(); // PR NO
							selectedBUPR[w].Model = parseInt(selectedBUPR[w].PrNo).toString();
							
						//	oController.myWBSSet.push(selectedBUPR[w]);
						   selectedPR.push(selectedBUPR[w]);
							PurchaseRequisition.push(selectedBUPR[w]);

						})

						oController.aContexts.push(selectedBUPR);

						oController.getView().getModel("localJson").setProperty("/myPurchaseRequisition", PurchaseRequisition);
						oController.getView().getModel("localJson").setProperty("/selectedPR", selectedPR);
						oController.onPRContractClose();
						oController._handleValueHelpClosePR();
					} else if (!notExist) {
						var errormas = nullGroup.join();
						sap.m.MessageToast.show("WBS is already added or don't select Boq " + errormas);
					}
				} 
			},
			calculatestartDate: function () {
				var SigninDate = new Date(this.getView().byId("idDeliveryDate").getValue()),
					CommencementDate = new Date(this.getView().byId("idCommencementDate").getValue());

				if (SigninDate > CommencementDate) {
					this.getView().byId("idValidFromDate").setValue(this.getView().byId("idDeliveryDate").getValue());
				} else {
					this.getView().byId("idValidFromDate").setValue(this.getView().byId("idCommencementDate").getValue());
				}
				this.calculateCompletionDate();
			},
			calculateCompletionDate: function () {
				var startDate = new Date(this.getView().byId("idValidFromDate").getValue()),
					ContractDurationDays = parseInt(this.getView().byId("idContractDurationDays").getValue()),
					ContractDurationMonth = parseInt(this.getView().byId("idContractDurationMonth").getValue());

				if (this.getView().byId("idValidFromDate").getValue() !== '') {
					var CompletionDate = this.calculateDates(startDate, ContractDurationMonth, ContractDurationDays);
					var dateString = this.DateObjectToYYYYMMDD(CompletionDate);
					var year = +dateString.substring(0, 4);
					var month = +dateString.substring(4, 6);
					var day = +dateString.substring(6, 8);
					var ValidToDate = year + "-" + month + "-" + day;
					this.getView().byId("idValidToDate").setValue(ValidToDate);
				}

			},
	
		

		});
	});