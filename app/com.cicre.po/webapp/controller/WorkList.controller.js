sap.ui.define(
	[
	  "com/cicre/po/controller/BaseController",
	  "sap/ui/model/json/JSONModel",
	  "sap/ui/core/routing/History",
	  "com/cicre/po/model/formatter",
	  "sap/ui/model/Filter",
	  "sap/ui/model/FilterOperator",
	  "sap/ui/export/Spreadsheet",
	  "sap/m/MessageToast",
	],
	function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, Spreadsheet, MessageToast) {
	  "use strict";
  // seif 2
	  return BaseController.extend("com.cicre.po.controller.WorkList", {
		formatter: formatter,
		sCoCode: "",
		sPONO: "",
		sVendor: "",
		sProj: "",
		sPGrp: "",
		sPOrg: "",
		POrgText: "",
		POrgCode: "",
		sProjectCode: "",
		ContractCode: "",
		sDocType: "",
		SupeiorWBSCode: "",
		sVendor: "",
		SERTYPE: "",
		SERTYPEText: "",
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
  
		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");
			//	this.getRouter().getRoute("worklist").attachPatternMatched(this._onObjectMatched, this);


			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._oTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("worklistViewTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistViewTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay : 0
			});
			this.setModel(oViewModel, "worklistView");
			this.sPOrg = "1000";
			this.POrgText = "TMG CENTRAL Purch.";
			this.getView().byId("idPurchaseOrganization").setValue(this.POrgText);

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function(){
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished : function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("Contract", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("Contract");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress : function (oEvent) {
		
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},


		/**
		 * Event handler for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will navigate to the shell home
		 * @public
		 */
		onNavBack : function() {
			
			var sPreviousHash = History.getInstance().getPreviousHash(),
				oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				oCrossAppNavigator.toExternal({
					target: {shellHash: "#Shell-home"}
				});
			}
			
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress : function () {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object:{
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var oTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					oTableSearchState = [new Filter("PoNumber", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(oTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh : function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject : function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("PoNumber")
			});
		},
		
		
		onSearchContract: function() {
			var oPOTable = this.getView().byId("table");
			oPOTable.setBusy(true);
			
			// Get the OData V4 model
			var mModel = this.getView().getModel();
			
			// Create filters - OData V4 uses the same Filter objects but binding is different
			var allFilter = [];
			
			if (this.ContractCode.length > 0 && this.getView().byId("idSearchByContract").getValue() !== "") {
				allFilter.push(new sap.ui.model.Filter("PoNumber", sap.ui.model.FilterOperator.EQ, this.ContractCode));
			}
			
			if (this.sVendor.length > 0 && this.getView().byId("idSearchByVendor").getValue() !== "") {
				allFilter.push(new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ, this.sVendor));
			}
			
			if (this.sCoCode.length > 0) {
				allFilter.push(new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, this.sCoCode));
			}
			
			if (this.sPOrg.length > 0 && this.getView().byId("idPurchaseOrganization").getValue() !== "") {
				allFilter.push(new sap.ui.model.Filter("PurchOrg", sap.ui.model.FilterOperator.EQ, this.sPOrg));
			}
			
			if (this.sProjectCode.length > 0 && this.getView().byId("idSearchByProjecttt").getValue() !== "") {
				allFilter.push(new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, this.sProjectCode));
			}
			
			if (this.sDocType.length > 0 && this.getView().byId("idSearchByDecTy").getValue() !== "") {
				allFilter.push(new sap.ui.model.Filter("DocType", sap.ui.model.FilterOperator.EQ, this.sDocType));
			}
			
			if (this.SERTYPE.length > 0 && this.getView().byId("idserviceType").getValue() !== "") {
				allFilter.push(new sap.ui.model.Filter("SerType", sap.ui.model.FilterOperator.EQ, this.SERTYPE));
			}
			
			if (this.getView().byId("idFConstructionType").getSelectedKey().length > 0 && 
				this.getView().byId("idFConstructionType").getValue() !== "") {
				allFilter.push(new sap.ui.model.Filter(
					"ConstructionType", 
					sap.ui.model.FilterOperator.EQ, 
					this.getView().byId("idFConstructionType").getSelectedKey()
				));
			}
			
			if (this.SupeiorWBSCode.length > 0) {
				allFilter.push(new sap.ui.model.Filter("SuperiorWbs", sap.ui.model.FilterOperator.EQ, this.SupeiorWBSCode));
			}
			
			// if (this.getView().byId("idExemptedType").getSelectedKey().length > 0 && 
			// 	this.getView().byId("idExemptedType").getValue() !== "") {
			// 	allFilter.push(new sap.ui.model.Filter(
			// 		"Exempted", 
			// 		sap.ui.model.FilterOperator.EQ, 
			// 		this.getView().byId("idExemptedType").getSelectedKey()
			// 	));
			// }
			
			if (this.getView().byId("idCreatedBy").getValue().length > 0) {
				allFilter.push(new sap.ui.model.Filter(
					"CreatedBy", 
					sap.ui.model.FilterOperator.contains, 
					this.getView().byId("idCreatedBy").getValue().toUpperCase()
				));
			}
			
			// OData V4 uses different binding approach
			// For list binding, we use the listBinding API
			var oListBinding = mModel.bindList("/ContractPOHeaderSet", null, null, null, {
				$$updateGroupId: "contractSearch" // Optional: Group ID for batch requests
			});
			
			// Apply the filters
			if (allFilter.length > 0) {
				var oFilterAll = new sap.ui.model.Filter({
					filters: allFilter,
					and: true
				});
				
				oListBinding.filter(oFilterAll);
			} else {
				oListBinding.filter([]);
			}
			
			// Request the data - OData V4 is different from V2's read method
			oListBinding.requestContexts(0, 100).then(function(aContexts) {
				// Create a JSON model to bind to the table
				var aItems = aContexts.map(function(oContext) {
					return oContext.getObject();
				});
				
				var oJsonModel = new sap.ui.model.json.JSONModel({
					ContractPOHeaderSet: aItems
				});
				
				// Bind the JSON model to the table
				oPOTable.setModel(oJsonModel, "poModel");
				oPOTable.setBusy(false);
			}).catch(function(oError) {
				// Handle error
				console.error("Error loading data:", oError);
				oPOTable.setBusy(false);
				
				// Show error message
				sap.m.MessageToast.show("Error loading data: " + (oError.message || "Unknown error"));
			});
		},
	////////////////////////////// company code search value help ////////////////////////////////
	onDisplaySearchCompDialog: function () {
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
	onSearchCompanyChange:function(){
		this.sCoCode="";
		this.sCoText="";
		this.getView().byId("idSearchByCompany").setValue("");
	},
	onSearchProjectChange:function(){
		this.sProjectCode="";
		this.getView().byId("idSearchByProjecttt").setValue("");
	},
	onSearchContractChange:function(){
		this.ContractCode="";
		this.getView().byId("idSearchByContract").setValue("");
	},
	onSearchWBS:function(){
		this.SupeiorWBSText="";
		this.SupeiorWBSCode="";
		this.getView().byId("idSupeiorWBS").setValue("");
	},
	onSearchByVendor:function(){
		this.sVendor ="";
		this.getView().byId("idSearchByVendor").setValue("");
	},
	onSearchSuggestDecTy:function(){
		this.sDocType="";
		this.sDocTypeText="";
		this.getView().byId("idSearchByDecTy").setValue("");
	},
	onserviceTypeChange:function(){
		this.SerType="";
		this.getView().byId("idserviceType").setValue("");
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
				that.sCoCode = oContext.getObject().IdNumber;
				that.sCoText = oContext.getObject().IdText;
				that.getView().byId("idSearchByCompany").setValue(oContext.getObject().IdText);
				//return oContext.getObject().Name;
			});
		} else {
			that.sCoCode="";
			that.sCoText="";
			that.getView().byId("idSearchByCompany").setValue("");
			sap.m.MessageToast.show("No new item was selected.");
		}
		oEvent.getSource().getBinding("items").filter([]);
	},
	/////////////////////Cotract description search value help/////using [E.A]//
	onDisplaySearchContract: function () {
		
		if (!this._ContractDescDialog) {
			this._ContractDescDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.ContractDescriptionDialog", this);
			this._ContractDescDialog.setModel(this.getView().getModel());
		}
		this._ContractDescDialog.open();
		var oTemplate = new sap.m.StandardListItem({
			title: "{IdText}",
			description: "{IdNumber}"
		});
		var aFilters = [];
		var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'ContDesc');
		aFilters.push(oFilter1);
		
		this._ContractDescDialog.bindAggregation("items", {
			path: "/ValueHelpSet",
			template: oTemplate,
			filters: aFilters
		});
	},
	
	handleSearchContract: function (oEvent) {
			//oVariationOrder.OrderItemsSet[i].Boq.substring(5,8);

		var sValue = oEvent.getParameter("value")//.substring(0,12);
		var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'ContDesc');
		var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
		var oTemplate = new sap.m.StandardListItem({
			title: "{IdText}",
			description: "{IdNumber}"
		});
		var aFilters = [];

		aFilters.push(oFilter1);
		aFilters.push(oFilter2);
		this._ContractDescDialog.bindAggregation("items", {
			path: "/ValueHelpSet",
			template: oTemplate,
			filters: aFilters
		});
	},
	onSelectContractList: function (oEvent) {
		var that = this;
		var aContexts = oEvent.getParameter("selectedContexts");
		if (aContexts && aContexts.length) {
			aContexts.map(function (oContext) {
				var ContractCode = oContext.getObject().IdNumber.split(" ");
				that.ContractCode = ContractCode[0];
				that.getView().byId("idSearchByContract").setValue(oContext.getObject().IdText);
				//return oContext.getObject().Name;
			});
		} else {
			that.ContractCode="";
			that.getView().byId("idSearchByContract").setValue("");
			sap.m.MessageToast.show("No new item was selected.");
		}
		oEvent.getSource().getBinding("items").filter([]);
	},


////////////////////////////// company code search value help ////////////////////////////////
		/*	onDisplaySearchCompDialog: function (oEvent) {
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
					if(that.compInd=== "idSearchByCompany"){
					
						that.sSearchCoCode = oContext.getObject().IdNumber;
						sap.ui.getCore().byId("idSearchByCompany").setValue(oContext.getObject().IdText);
						
					}
					else{
						that.sCoCode = oContext.getObject().IdNumber;
						that.sCoText = oContext.getObject().IdText;
						that.getView().byId("idCompanyCode").setValue(oContext.getObject().IdText);
						that.getView().getModel("localJson").setProperty("/projectText",that.sCoText );
					}
					//return oContext.getObject().Name;
				});
			} else {
				that.sCoCode="";
				that.sCoText="";
				that.getView().getModel("localJson").setProperty("/projectText",that.sCoText );
				sap.m.MessageToast.show("No new item was selected.");
				that.getView().byId("idCompanyCode").setValue("");

			}
			oEvent.getSource().getBinding("items").filter([]);
			this.compInd="";
		},
	onSearchCompanyChange:function(){
			this.sCoCode="";
			this.sCoText="";
			this.getView().getModel("localJson").setProperty("/projectText",this.sCoText );
		},*/
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
					that.SERTYPE="";
					that.SERTYPEText="";
					that.getView().byId("idserviceType").setValue("");
					sap.m.MessageToast.show("No new item was selected.");
				}
				oEvent.getSource().getBinding("items").filter([]);
			},


	 /////////////////////////// SupeiorWBS search value help////// [E.A]
	 onDisplaySearchidSupeiorWBSDialog: function () {
		if(this.sCoCode && this.sProjectCode){
		if (!this._SuperiorWBSDialog) {
			this._SuperiorWBSDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SuperiorWBSSearchDialog", this);
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
		var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ,1000 );
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
	onSelectCheque:function(oEvent){
		
		this.SupeiorWBSText =oEvent.getParameters().rowContext.getObject().IdText;
		this.SupeiorWBSCode =oEvent.getParameters().rowContext.getObject().IdNumber;
		this.getView().byId("idSupeiorWBS").setValue(this.SupeiorWBSText);			
		this._SuperiorWBSDialog.close();
		this._SuperiorWBSDialog.destroy();
		this._SuperiorWBSDialog= null;

	},
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
		var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("idDesc").getValue() );
		var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, sap.ui.getCore().byId("idlenth").getValue());
		
		filters.push(oFilter1);
		filters.push(oFilter2);
		filters.push(oFilter3);
		if ( sap.ui.getCore().byId("idDesc").getValue()!=="") {
			filters.push(oFilter4);
		}
		if (  sap.ui.getCore().byId("idlenth").getValue()!=="") {
			filters.push(oFilter5);
		}
		if (  sap.ui.getCore().byId("idlenth").getValue() ==="") {
			var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, 500 );
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
	_handleCancelPresswbs:function(){  
		
		var that = this;
		this.SupeiorWBSText ="";
		this.SupeiorWBSCode ="";
		this.getView().byId("idSupeiorWBS").setValue("");
		that._SuperiorWBSDialog.close();
		that._SuperiorWBSDialog.destroy();
		that._SuperiorWBSDialog=null;
	},
	
	
	handleSearchSuperior: function (oEvent) {
		
		var sValue = oEvent.getParameter("value");
		var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'SUBWBS');
		var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
		var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
		var oFilter4 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.Contains, sValue);
		var oFilter5 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ,1000 );
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
		var aContexts = oEvent.getParameter("selectedContexts");
		if (aContexts && aContexts.length) {
			aContexts.map(function (oContext) {
				that.SupeiorWBSText = oContext.getObject().IdText;
				that.SupeiorWBSCode = oContext.getObject().IdNumber;
				that.getView().byId("idSupeiorWBS").setValue(oContext.getObject().IdText);
				//return oContext.getObject().Name;
			});
		} else {
			that.SupeiorWBSText="";
			that.SupeiorWBSCode="";
			that.getView().byId("idSupeiorWBS").setValue("");
			sap.m.MessageToast.show("No new item was selected.");
		}
		oEvent.getSource().getBinding("items").filter([]);
	},
	///////////////////////decumet type search value help ////[E.A]
	onDisplaySearchDecTyDialog: function () {
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
					that.getView().byId("idSearchByDecTy").setValue(oContext.getObject().IdText);
					//return oContext.getObject().Name;
				});
			} else {
				that.sDocType="";
				that.sDocTypeText="";
				that.getView().byId("idSearchByDecTy").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
	///////////////////////project search value help////[E.A]
	onDisplaySearchProject: function () {
		if (this._projectDialog) {
			this._projectDialog.destroy();
			this._projectDialog = null;
		}
		if (!this._projectDialog) {
			this._projectDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.ProjectSearchDialog", this);
			this._projectDialog.setModel(this.getView().getModel());
		}
		this._projectDialog.open();
		var oTemplate = new sap.m.StandardListItem({
			title: "{IdText}",
			description: "{IdNumber}"
		});
		var aFilters = [];

		var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PROJ');
		aFilters.push(oFilter1);
		this._projectDialog.bindAggregation("items", {
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

		this._projectDialog.bindAggregation("items", {
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
				that.getView().byId("idSearchByProjecttt").setValue(oContext.getObject().IdText);
				//return oContext.getObject().Name;
			});
		} else {
			that.sProjectCode="";
			that.getView().byId("idSearchByProjecttt").setValue("");
			sap.m.MessageToast.show("No new item was selected.");
		}
		oEvent.getSource().getBinding("items").filter([]);
	},
	////////////////////////////// vendor search value help ////////////////////////////////
	onDisplaySearchVendorDialog: function () {
		if (this.sCoCode && this.sPOrg) {
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
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sPOrg);
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
		} else {
			sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("Msg_Error_Select_CO_PORG"));
		}

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
		var aContexts = oEvent.getParameter("selectedContexts");
		if (aContexts && aContexts.length) {
			aContexts.map(function (oContext) {
				that.sVendor = oContext.getObject().IdNumber;
				that.getView().byId("idSearchByVendor").setValue(oContext.getObject().IdText);
				//return oContext.getObject().Name;
			});
		} else {
			that.sVendor ="";
			that.getView().byId("idSearchByVendor").setValue("");
			sap.m.MessageToast.show("No new item was selected.");
		}
		oEvent.getSource().getBinding("items").filter([]);
	},
	////////////////////////////// Purchase organization search value help ////////////////////////////////
	onDisplaySearchPOrgDialog: function () {
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
		var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.Contains, this.sCoCode);

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
				that.sPOrg = oContext.getObject().IdNumber;
				that.getView().byId("idPurchaseOrganization").setValue(oContext.getObject().IdText);
				//return oContext.getObject().Name;
			});
		} else {
			that.sPOrg="";
			that.getView().byId("idPurchaseOrganization").setValue("");
			sap.m.MessageToast.show("No new item was selected.");
		}
		oEvent.getSource().getBinding("items").filter([]);
	},
	////////////////////////////// purchase group search value help ////////////////////////////////
	onDisplaySearchPGrpDialog: function () {
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
				that.sPGrp = oContext.getObject().IdNumber;
				that.getView().byId("idPurchaseGroup").setValue(oContext.getObject().IdText);
				//return oContext.getObject().Name;
			});
		} else {
			that.sPGrp="";
			that.getView().byId("idPurchaseGroup").setValue("");
			sap.m.MessageToast.show("No new item was selected.");
		}
		oEvent.getSource().getBinding("items").filter([]);
	},
	onPressPO: function(oEvent) {
		
		var poNo = oEvent.getSource().getBindingContext("poModel").getProperty("PoNumber"),
			oRouter = sap.ui.core.UIComponent.getRouterFor(this);

		oRouter.navTo("object", {
			objectId:poNo
		});
	},
	onCreateContractPress : function (oItem) {
		
		this.getView().setBusy(true);
		this.getRouter().navTo("createContract");
		this.getView().setBusy(false);
	},
	});
    });