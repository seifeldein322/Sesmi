sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment" // Add this line to import Fragment
], function (Controller, History, UIComponent, MessageBox, Filter, FilterOperator, Fragment) { // Add Fragment parameter here
    "use strict";


	return Controller.extend("com.cicre.po.controller.BaseController", {
        oldmodelvalue: "",
		WBSCode: "",
		WBSCodeGroup: "",

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},


		onNavBack: function (oEvent) {

			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("RouteWorkList", {}, true /*no history*/);
			}
		},
		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		IndexMonth: function () {

			this.currentYear = new Date().getFullYear();
			this.afterfivecurrentYear = new Date().getFullYear() - 5;
			this.years = [];
			for (var i = this.afterfivecurrentYear; i <= this.currentYear; i++) {
				for (var m = 1; m <= 12; m++) {
					this.years.push({
						id: m + "-" + this.afterfivecurrentYear,
						text: m + "-" + this.afterfivecurrentYear,
						issort: this.afterfivecurrentYear
					});
				}
				++this.afterfivecurrentYear;
			}

			this.years = this.years.sort((a, b) => b.issort - a.issort);
		},
		onShareEmailPress: function () {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		//////////////////////
		onchangeCurrency: function () {

			this.getView().getModel("localJson").setProperty("/Currency", this.getView().byId("idCurrency").getValue());

			if (this.getView().byId("idCurrency").getValue() === "USD") {
				this.CustomCurrency = 2;
			} else {
				this.CustomCurrency = 2;
			}
		},
		onChangeAmount: function (oEvent) {

			var dataModel = this.getView().byId("idEstimatedServicesTable").getModel("localJson");
			var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
			var index = parseInt(splitedPath[2]);
			var data = dataModel.getProperty("/EstimatedContracts/" + index);
			data.Amount = parseFloat(data.Amount).toFixed(this.CustomCurrency)
			dataModel.setProperty("/EstimatedContracts/" + index, data);
			dataModel.refresh(true);

			//	this.ContractValueHeaderCreate();
			this.ContractValueHeader();
		},

		onDisplaySearchProjDialogFailre: function () {

			if (!this._oProjDialogF) {
				this._oProjDialogF = sap.ui.xmlfragment("com.cicre.po.view.fragments.ProjSearchDialog", this);
				this._oProjDialogF.setModel(this.getView().getModel());
			}
			this._oProjDialogF.open();
			var oTemplate = new sap.m.StandardListItem({
				title: "{IdText}",
				description: "{IdNumber}"
			});
			var aFilters = [];
			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'Zone');
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);
			this._oProjDialogF.bindAggregation("items", {
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
			var oTemplate = new sap.m.StandardListItem({
				title: "{IdText}",
				description: "{IdNumber}"
			});
			var aFilters = [];

			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);
			aFilters.push(oFilter4);

			this._oProjDialogF.bindAggregation("items", {
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
					that.sProjj = oContext.getObject().IdNumber;
					sap.ui.getCore().byId("idSearchByProjectt").setValue(oContext.getObject().IdText);
					//return oContext.getObject().Name;
				});
			} else {
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},



		onListDeletePress: function (oEvent) {
			var editmode = false;
			var oControl;
			if (oEvent.getSource) {
				oControl = oEvent.getSource();
				editmode = true;
			} else {
				oControl = this.byId(oEvent);
			}
			var parent = oControl.getParent().getParent();
			if (oControl.getIcon() == "sap-icon://delete" && editmode) {
				oControl.setIcon("sap-icon://decline");
				oControl.setTooltip(this.getResourceBundle().getText("attachmentCancel"));
				parent.setMode("Delete");
			} else {
				oControl.setIcon("sap-icon://delete");
				oControl.setTooltip(this.getResourceBundle().getText("attachmentDelete"));
				parent.setMode("None");

			}
		},
		BuildD: function (data) {
			var that = this;
			var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/selectedBuilding")));
			//	var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/selectedBuilding")));
			var copyselectedBuilding = JSON.parse(JSON.stringify(selectedBuilding));
			var myBuildingSetr = JSON.parse(JSON.stringify(that.myBuildingSet));
			var count = 0;
			var countt = 0
			var B = [];
			var TR = [];
			var arrayBuildingsort = sap.ui.getCore().byId("IdBuildingTable").getModel("localJson").oData.BuildingSet;


			$.each(copyselectedBuilding, function (i, bu) {
				$.each(myBuildingSetr, function (ii, build) {
					if (bu.Model === build.Model && bu.Group === build.Group) {
						count = count + 1
						countt = countt + 1
						if (countt >= 2) {
							$.each(arrayBuildingsort, function (g, row) {
								if (bu.Model === row.Model && bu.Group === row.Group) {
									sap.ui.getCore().byId("IdBuildingTable").getItems()[g].setSelected(false)
									sap.m.MessageToast.show("Model and  Boq is already added!");
									countt = 0;
								}
							})
							that.myBuildingSet.splice(ii, 1);
							selectedBuilding.splice(i, 1);
							that.getView().getModel("localJson").setProperty("/selectedBuilding", selectedBuilding);

						}
						//if (bu.BuildingNo === selectedBU.BuildingNo)
					}
				});
				count = 0
			})
			if (count > 1) {
				$.each(arrayBuildingsort, function (g, row) {
					if (data.Model === row.Model && data.Group === row.Group) {
						sap.ui.getCore().byId("IdBuildingTable").getItems()[g].setSelected(false)
						sap.m.MessageToast.show("Model and  Boq is already added!");
						//	countt=0;
					}
				})
			}


		},
		/////////////////////Cotract description search value help/////using [E.A]//
		onDisplaySearchContractRefrence: function () {

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
			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'ContDesc2');
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
			var that = this,
				idContract = oEvent.getParameters().id;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					that.ContractCode = oContext.getObject().IdNumber;
					that.getView().byId("idSearchByContract").setValue(oContext.getObject().IdText);
					//return oContext.getObject().Name;
				});
			} else {
				that.ContractCode = "";
				that.getView().byId("idSearchByContract").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		ch_SearchByContract: function () {
			this.ContractCode = "";
			this.getView().byId("idSearchByContract").setValue("");
		},
		ch_SearchByVendor: function () {
			this.sSearchVendor = "";
			this.getView().byId("idSearchByVendor").setValue("");
		},

		////////////////////////// Refrence contracts and searching in it's dialog ///[E.A]///////////////////

		onContractValueHelpPressc: function (oEvent) {

			var that = this,
				oModel = that.getOwnerComponent().getModel(),
				dataModel = that.getView().getModel("localJson"),
				filters = [];
			this.getView().getModel("localJson").setProperty("/ContractPOHeaderSet", []);
			var oTable = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.RefrenceContractTable", this);
			if (!this._oContractValueHelpDialog) {
				this._oContractValueHelpDialog = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.RefrenceContractValueHelpFilterBar", this);
				this._oContractValueHelpDialog.setTable(oTable);
				// this._contractDialog.setFilterBar(this.getView().byId("idContractFilterBar"));
				this.getView().addDependent(this._oContractValueHelpDialog);

			}

			this._oContractValueHelpDialog.open();
		},

		onContractValueHelpPress: function (oEvent) {

			var columnModel = this.getModel("refreneContractColumnsModel"),
				aCols = columnModel.getData().cols,
				controlId = oEvent.getSource().getId();
			if (oEvent.getSource().getBindingContext("localJson")) {
				var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			}
			var oTable = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.RefrenceContractTable", this);
			oTable.setModel(this.getModel("localJson"));
			oTable.setModel(columnModel, "columns");

			if (oTable.bindRows) {
				oTable.bindAggregation("rows", "/ContractPOHeaderSet");
			}

			if (oTable.bindItems) {
				oTable.bindAggregation("items", "/ContractPOHeaderSet", function () {
					return new sap.m.ColumnListItem({
						cells: aCols.map(function (column) {
							return new sap.m.Label({
								text: "{" + column.template + "}"
							});
						})
					});
				});
			}

			// 	this._oContractValueHelpDialog.update();
			// }.bind(this));

			if (!this._oContractValueHelpDialog) {
				this._oContractValueHelpDialog = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.RefrenceContractValueHelpFilterBar",
					this);
				this._oContractValueHelpDialog.setTable(oTable);
				if (controlId.lastIndexOf("idRefrenceContrac") > -1) {
					oTable.setSelectionMode("MultiToggle");
					this.selectedContractPath = "";
				} else if (controlId.lastIndexOf("idCreateContract") > -1) {
					this.selectedContractPath = "/ContractPOHeaderSet";
					oTable.setSelectionMode("Single");
				} else {
					this.selectedContractPath = sPath;
					oTable.setSelectionMode("Single");
				}
				this.getView().addDependent(this._oContractValueHelpDialog);
			}

			this.getModel("localJson").setProperty("/ContractPOHeaderSet", []);
			this.getModel("localJson").refresh();
			this._oContractValueHelpDialog.open();
		},
		onContractFilterBarSearch: function () {
		},
		////////////////////////////// select Boq search value help /////// 2-3-2021/////////////////////////
		onboqValueHelpPress: function () {

			if (!this._BoqDialog) {
				this._BoqDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.selectBoqDialog", this);
				this._BoqDialog.setModel(this.getView().getModel());
			}
			this._BoqDialog.open();

			var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, this.oldmodelvalue);
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

			this._BoqDialog.bindAggregation("items", {
				path: "/BoqSubItemSet",
				template: oTemplate,
				filters: aFilters
			});
		},
		handleSearchBoq: function (oEvent) {
			if (!this._BoqDialog) {
				this._BoqDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.selectBoqDialog", this);
				this._BoqDialog.setModel(this.getView().getModel());
			}
			this._BoqDialog.open();

			var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, this.oldmodelvalue);
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

			this._BoqDialog.bindAggregation("items", {
				path: "/BoqSubItemSet",
				template: oTemplate,
				filters: aFilters
			});
		},
		onSelectBoqList: function (oEvent) {


			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					that.BoqAll = oContext.getObject().BoqSub;
					that.BoqDescAll = oContext.getObject().BoqDesc;
					that.getView().byId("idhandboq").setValue(oContext.getObject().BoqDesc);
					that.onlistofPress();
					//return oContext.getObject().Name;
				});
			} else {
				that.BoqAll = "";
				that.getView().byId("idhandboq").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		onlistofPress: function () {

			var that = this,
				dataModel = this.getView().getModel("localJson"),
				BoqListModel = dataModel.getProperty("/BuildingSet");

			$.each(BoqListModel, function (i, data) {
				data.BoqDesc = that.BoqDescAll;
				data.Group = that.BoqAll;

			})

			dataModel.setProperty("/BuildingSet", BoqListModel);



		},



		////////////////////////// Refrence contracts and searching in it's dialog //////////////////////

		onContractValueHelpOkPress: function () {

			var that = this,
				viewModel = this.getModel("localJson"),
				dataModel = this.getModel("localJson"),
				// get array of selected indices
				selectedIndices = this._oContractValueHelpDialog.getTable().getSelectedIndices(),
				aContracts = [],
				selectedRefContracts = [];
			//viewModel.getProperty("/Contracts");
			for (var i = 0; i < selectedIndices.length; i++) {
				// get service no and contract item
				var oContract = this._oContractValueHelpDialog.getTable().getContextByIndex(selectedIndices[i]).getObject();
				aContracts.push(oContract);
				selectedRefContracts.push(oContract.PurchDoc);
			}
			if (this.selectedContractPath === "") {
				// this means the contract no. control in the home view
				viewModel.setProperty("/Contracts", aContracts);
				that.selectedRefContracts = selectedRefContracts;
				var contracts = that.selectedRefContracts.join();
				that.getView().byId("idRefrenceContract").setValue(contracts);
				viewModel.refresh();
			} else if (this.selectedContractPath === "/ContractNo") {
				if (aContracts.length != 0) {
					// set the selected contract in the pressed deduction row
					dataModel.setProperty(this.selectedContractPath, aContracts[0].PurchDoc);
					dataModel.refresh();
					// read contract data
					this.byId("idCreateContract").fireChange();
				}
			} else {
				if (aContracts.length != 0) {
					// set the selected contract in the pressed deduction row
					dataModel.setProperty(this.selectedContractPath + "/ContractReference", aContracts[0].PurchDoc);
					dataModel.refresh();
				}
			}

			this.onContractValueHelpCancelPress();
		},


		onContractValueHelpCancelPress: function () {
			this._oContractValueHelpDialog.close();
			this._oContractValueHelpDialog.destroy();
			this._oContractValueHelpDialog = null;
			this.ContractCode = "";
			this.sSearchVendor = "";
		},
		onContractFilterBarSearch: function () {
			var that = this,
				dataModel = that.getModel("localJson"),
				oModel = that.getOwnerComponent().getModel();
			var oPOTable = that.getView().byId("RefrenceContractTable");
			var oFilter1 = new sap.ui.model.Filter("PoNumber", sap.ui.model.FilterOperator.EQ, this.ContractCode);//ok
			var oFilter3 = new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ, this.sSearchVendor); // ok
			var oFilter4 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, this.sCoCode); // ok
			var oFilter5 = new sap.ui.model.Filter("PurchOrg", sap.ui.model.FilterOperator.EQ, this.sPOrg); //this.sSearchPOrg
			var oFilter6 = new sap.ui.model.Filter("PurGroup", sap.ui.model.FilterOperator.EQ, this.sPGrp);  //sSearchPGrp  TempStatus
			var oFilter7 = new sap.ui.model.Filter("Flag", sap.ui.model.FilterOperator.EQ, "X");
			var oFilter8 = new sap.ui.model.Filter("TempStatus", sap.ui.model.FilterOperator.EQ, "R");
			var allFilter = [];

			if (this.ContractCode.length > 0) {
				allFilter.push(oFilter1);
			}
			if (this.sSearchVendor.length > 0 && this.getView().byId("idSearchByVendor").getValue() !== "") {
				allFilter.push(oFilter3);
			}
			if (this.sCoCode.length > 0) {
				allFilter.push(oFilter4);
			}
			if (this.sPOrg.length > 0) {
				allFilter.push(oFilter5);
			}
			if (this.sPGrp.length > 0) {
				allFilter.push(oFilter6);
			}
			allFilter.push(oFilter7);
			allFilter.push(oFilter8);
			oModel.read("/ContractPOHeaderSet", {
				filters: allFilter,
				async: false,
				method: "GET",
				success: function (data) {

					dataModel.setProperty("/ContractPOHeaderSet", data.results);
					dataModel.refresh();
				},
				error: function () {

				}
			});
			dataModel.refresh();
		},
		_oMessagePopover: null,
		onPressMessagePopover: function (oEvent) {

			;
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			this._oMessagePopover.toggle(oEvent.getSource());
		},
		// WBS [E.A]
		async onWBSSelectionValueHelpPress(oEvent) {
			//  this.cleanWBSDialog();
			//	this.cleanSearGroupWBS();
			this.WBSCode = "";
    this.WBSCodeGroup = "";
    
    var that = this,
        oModel = that.getOwnerComponent().getModel(),
        dataModel = that.getView().getModel("localJson"),
        filters = [];
    
		dataModel.setProperty("/WBSSet", []);
		
		// Load fragment asynchronously
		var oView = this.getView();
		var sFragmentName = "com.cicre.po.view.fragments.SelectMultiWBSDialogTable";
		
		// Load table fragment
		Fragment.load({
			id: oView.getId(),
			name: sFragmentName,
			controller: this
		}).then(function(oTable) {
			// Load dialog fragment
			return Fragment.load({
				id: oView.getId(),
				name: "com.cicre.po.view.fragments.SelectMultiWBSDialoge",
				controller: that
			}).then(function(oDialog) {
				that._contractDialog = oDialog;
				that._contractDialog.setTable(oTable);
				oView.addDependent(that._contractDialog);
				return that._contractDialog;
			});
		}).then(function(oDialog) {
			oDialog.open();
		}).catch(function(oError) {
			sap.m.MessageBox.error("Error loading WBS dialog: " + oError.message);
		});

		this.getView().getModel("localJson").setProperty("/selectGroupBoq", false);
		that.aContexts = [];
		that.Boqs = [];
		that.BUBoQs = [];
		that.WBSBoQs = [];
			/*this.getView().getModel("localJson").setProperty("/selectGroupBoq", false);
			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBS");
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
			//	var oFilter4 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, this.WBSCode);
			//	var oFilter5 = new sap.ui.model.Filter("SelectionParameter7", sap.ui.model.FilterOperator.EQ, this.WBSCodeGroup);

			filters.push(oFilter1);
			filters.push(oFilter2);
			filters.push(oFilter3);
			if (this.WBSCode.length > 0) {
				filters.push(oFilter4);
			} if (this.WBSCodeGroup.length > 0) {
				filters.push(oFilter5);
			}
			oModel.read("/ValueHelpSet", {
				filters: filters,
				async: false,
				method: "GET",
				success: function (oData) {
					$.each(oData.results, function (v, value) {
						oData.results[v].Group = "";
						oData.results[v].Model = oData.results[v].IdNumber;
					});
					dataModel.setProperty("/WBSSet", oData.results);
					// rebind service table in the value help dialog
					dataModel.refresh(true);
				},
				error: function () {
					sap.m.MessageToast.show("Error");
				}
			});*/
			this.getView().getModel("localJson").setProperty("/selectGroupBoq", false);
			that.aContexts = [];
			that.Boqs = [];
			that.BUBoQs = [];
			that.WBSBoQs = [];
		},
		handleSearchWBSPress: function () {
			var that = this,
				oModel = that.getOwnerComponent().getModel(),
				dataModel = that.getView().getModel("localJson"),
				filters = [];
			this.getView().getModel("localJson").setProperty("/WBSSet", []);


			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBS");
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
			var oFilter4 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.EQ, this.WBSCode);
			var oFilter5 = new sap.ui.model.Filter("SelectionParameter7", sap.ui.model.FilterOperator.EQ, this.WBSCodeGroup);

			filters.push(oFilter1);
			filters.push(oFilter2);
			if ( this.sProjectCode != ''){
				filters.push(oFilter3);
			}
			if (this.WBSCode.length > 0) {
				filters.push(oFilter4);
			} if (this.WBSCodeGroup.length > 0) {
				filters.push(oFilter5);
			}

			// Apply filters if needed
			var sPath = "/ValueHelpSet"; // Your entity set path
			var oBinding = oModel.bindList(sPath, undefined, undefined, filters);
			// Request data
			oBinding.requestContexts(0, 100).then(function (aContexts) {
				var aResults = aContexts.map(oContext => oContext.getObject());

				// Modify Data
				aResults.forEach(item => {
					item.Group = "";
					item.Model = item.IdNumber;
				});

				// Set property in the local model
				that.getView().getModel("localJson").setProperty("/WBSSet", aResults);

				// Conditional UI update
				if (that.WBSCodeGroup.length > 0) {
					that.getView().getModel("localJson").setProperty("/selectGroupBoq", true);
				}

				// Refresh the model
				that.getView().getModel("localJson").refresh(true);
			}).catch(function (oError) {
				sap.m.MessageToast.show("Error fetching data");
				console.error(oError);
			});

			that.aContexts = [];
			that.Boqs = [];
			that.BUBoQs = [];
			that.WBSBoQs = [];
		},
		onVHContractOk: function () {


			var that = this,
				viewModel = this.getModel("localJson"),
				dataModel = this.getModel("localJson"),
				// get array of selected indices
				selectedIndices = this._contractDialog.getTable().getSelectedIndices(),
				aContracts = [],
				selectedRefContracts = [];
			//viewModel.getProperty("/Contracts");
			for (var i = 0; i < selectedIndices.length; i++) {
				// get service no and contract item
				var oContract = this._contractDialog.getTable().getContextByIndex(selectedIndices[i]).getObject();
				aContracts.push(oContract);
			}
			viewModel.setProperty("/Contracts", aContracts);
			//	var contracts = that.selectedRefContracts.join();
			//  that.getView().byId("idRefrenceContract").setValue(contracts);
			viewModel.refresh();
			this.onWBSContractClose();

		},
		onWBSContractClose: function (oEvent) {
			this._contractDialog.close();
			this._contractDialog.destroy();
			this._contractDialog = null;
		},
		onBuildingSelectionValueHelpPressc: function (oEvent) {

			var that = this,
				oModel = that.getOwnerComponent().getModel(),
				dataModel = that.getView().getModel("localJson"),
				filters = [];
			this.getView().getModel("localJson").setProperty("/BuildingSet", []);
			var oTable = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.SelectMultiBuildingTable", this);
			if (!this._BuildinDialog) {
				this._BuildinDialog = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.SelectMultiBuildingDialoge", this);
				this._BuildinDialog.setTable(oTable);
				// this._contractDialog.setFilterBar(this.getView().byId("idContractFilterBar"));
				this.getView().addDependent(this._BuildinDialog);
				that.aContexts = [];
				that.Boqs = [];
				that.BUBoQs = [];

			}

			this._BuildinDialog.open();
		},
		onBuildingContractClose: function () {
			;
			//	this.getView().setBusy(true);
			this._BuildinDialog.close();
			this._BuildinDialog.destroy();
			this._BuildinDialog = null;
			this.Building = "";
			this.ModelCode = "";
			this.sProjj = "";
			this.sProj = "";
			this.GroupCodee = "";
			this.GroupCode = "";
		},
		cleanProjDialog: function () {
			this.sProjj = "";
			this.sProj = "";
			this.getView().byId("idSearchByProject").setValue("");
		},
		cleanSearchModel: function () {
			this.getView().getModel("localJson").setProperty("/selectBoq", false);
			this.oldmodelvalue = "";
			this.ModelCode = "";
			this.getView().byId("idSearchByModel").setValue("");
		},

		cleanSearGroup: function () {
			this.GroupCodee = "";
			this.GroupCode = "";
			this.getView().byId("idSearchByGroup").setValue("")
		},
		cleanSearBuilding: function () {
			this.Building = "";
			this.getView().byId("_IdBuilding").setValue("");
		},

		//// view sec 2 & 3 [E.A]***
		handleOpenViewSheet: function (oEvent) {

			var oButton = oEvent.getSource();

			// create action sheet only once
			if (!this._View2Sheet) {
				this._View2Sheet = sap.ui.xmlfragment("com.cicre.po.view.fragments.ViewSheetDialog", this);
				this.getView().addDependent(this._View2Sheet);
			}

			this._View2Sheet.openBy(oButton);
			//	sap.ui.getCore().byId("idActionSheetAddService").setVisible(true);

		},
		addcontractualsc1: function () {
			this.getModel("localJso").setProperty("/ViewCon1", false);
			this.getModel("localJso").setProperty("/ViewCon2", true);
			this.getModel("localJso").setProperty("/ViewCon3", true);
		},
		addcontractualsc2: function () {

			var that = this;
			that.ViewCon = "V2";
			//  that.getView().setBusy(true);
			this.Consoliatedservicesall();
			//var aServices = this.getModel("localJson").getProperty("/BuildingConsulidatedItemSetfilter"),
			//	var aServices = this.getModel("localJson").getProperty("/BuildingConsulidatedItemSet");

			// model.setProperty("/BuildingConsulidatedItemSet", aServices);
			//	this.WholeContractservices(aServices);


			//this.WholeContractservices(aServices);
			//	this.Consoliatedservicesall();

			//copymodel = this.getModel("localJson").getProperty("/BuildingConsulidatedItemSetfilter");

			this.getModel("localJso").setProperty("/ViewCon1", true);
			this.getModel("localJso").setProperty("/ViewCon4", false);
			this.getModel("localJso").setProperty("/ViewCon2", false);
			this.getModel("localJso").setProperty("/ViewCon3", true);
			that.getView().setBusy(false);
		},
		addcontractualsc3: function () {

			this.ViewCon = "V3";
			this.Consoliatedservicesall();
			///var aServices = this.getModel("localJson").getProperty("/BuildingConsulidatedItemSet");
			//this.groupConsolidscreen3all(aServices);
			//this.WholeContractservices(aServices);
			/// var aServices= this.groupConsolidscreen3all(aServices);
			///this.groupConsolidscreen3(aServices);
			this.getModel("localJso").setProperty("/ViewCon1", true);
			this.getModel("localJso").setProperty("/ViewCon2", true);
			//this.getModel("localJso").setProperty("/ViewCon4", false);
			this.getModel("localJso").setProperty("/ViewCon3", false);
		},
		//// search for json model ///// craete and edit
		////////////zone 
		onDisplaySearGroupfilter: function (oEvent) {

			var that = this,
				myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet"))),
				dataModel = this.getModel("localJson");
			var oConsoliatedServices = {},
				aFilters = [],
				BuildingF = [],
				//aServicesCopy = JSON.parse(JSON.stringify(myBuildingSet)),
				aConsoliatedServices = [],
				found = false;

			if (this.ModelCodefilter.length > 0)
				aFilters.push(new Filter("Model", FilterOperator.EQ, this.ModelCodefilter));
			if (this.BuildingCodefilter.length > 0)
				aFilters.push(new Filter("BuildingNo", FilterOperator.EQ, this.BuildingCodefilter));
			//if(this.GroupCodefilter.length >0)
			//aFilters.push(new Filter("Zzgroup", FilterOperator.EQ, this.GroupCodefilter));
			if (this.ZoneCodefilter.length > 0)
				aFilters.push(new Filter("Project", FilterOperator.EQ, this.ZoneCodefilter));

			this.byId("IdBuildingTable_copy").setVisibleRowCount(this.getModel("localJson").getProperty("/copymyBuildingSet").length);
			this.byId("IdBuildingTable_copy").getBinding("rows").filter(aFilters);
			this.byId("IdBuildingTable_copy").refreshRows();
			var aCurrentContexts = this.byId("IdBuildingTable_copy").getBinding("rows").getCurrentContexts();
			aCurrentContexts.map(function (
				oCurrentContext) {
				BuildingF.push(JSON.parse(JSON.stringify(dataModel.getProperty(oCurrentContext.getPath()))));
			});
			var aServicesCopy = JSON.parse(JSON.stringify(BuildingF));
			BuildingF.map(function (oServices) {
				found = false;
				oConsoliatedServices.Zzgroup = oServices.Zzgroup;
				oConsoliatedServices.GroupTxt = oServices.GroupTxt;
				oConsoliatedServices.BuildingNo = oServices.BuildingNo;
				oConsoliatedServices.Zzgroupr = oServices.Zzgroup + "R";
				aServicesCopy.map(function (oServicesCopy) {
					if (oServicesCopy.Zzgroup === oConsoliatedServices.Zzgroup && oConsoliatedServices.Zzgroup != "") {
						found = true;
						var modelExists = false;
						oServicesCopy.Zzgroup = oConsoliatedServices.Zzgroupr;
					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Zzgroup !== oConsoliatedServices.Zzgroupr);
					});
				}

				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
			});

			dataModel.setProperty("/Groupfilter", aConsoliatedServices);

			if (this._GroupDialogg) {
				this._GroupDialogg.destroy();
				this._GroupDialogg = null;
			}
			if (!this._GroupDialogg) {
				this._GroupDialogg = sap.ui.xmlfragment("com.cicre.po.view.fragments.groupSearchDialogfilter", this);
				this.getView().addDependent(this._GroupDialogg); // 
				// this._GroupDialogg.setModel(this.getView().getModel());
			}
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>Zzgroup}",
				description: "{localJson>GroupTxt}",
				type: "Active"
			});
			this._GroupDialogg.bindAggregation("items", {
				path: "localJson>/Groupfilter",
				template: oTemplate,
				templateShareable: false
			});
			this._GroupDialogg.open();
		},
		handleSearchGroupfilter: function (oEvent) {

			var that = this;
			var sValue = oEvent.getParameter("value");
			var oFilter4 = new sap.ui.model.Filter("Zzgroup", sap.ui.model.FilterOperator.Contains, sValue);
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>Zzgroup}",
				description: "{localJson>GroupTxt}",
				type: "Active"
			});
			var aFilters = [];
			if (sValue !== "") {
				aFilters.push(oFilter4);
			}
			this._GroupDialogg.bindAggregation("items", {
				path: "localJson>/Groupfilter",
				template: oTemplate,
				filters: aFilters,
				templateShareable: false
			});
		},
		onSearchGroupfilter: function (oEvent) {

			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					that.GroupCodefilter = oContext.getObject().Zzgroup;
					that.getView().byId("onSearchGroupfilter").setValue(oContext.getObject().GroupTxt);
				});
			} else {
				that.GroupCodefilter = "";
				that.getView().byId("onSearchGroupfilter").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		//////model filter
		onDisplaySearchModelfilter: function (oEvent) {

			var that = this,
				myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet"))),
				dataModel = this.getModel("localJson"),
				dataModelB = this.getModel("localJso"),
				aFilters = [],
				BuildingF = [],
				oConsoliatedServices = {},
				aConsoliatedServices = [],
				found = false;
			this.modelId = oEvent.getParameters().id;

			//if(this.ModelCodefilter.length >0)	 
			//	aFilters.push(new Filter("Model", FilterOperator.EQ, this.ModelCodefilter));
			if (this.BuildingCodefilter.length > 0)
				aFilters.push(new Filter("BuildingNo", FilterOperator.EQ, this.BuildingCodefilter));
			if (this.GroupCodefilter.length > 0)
				aFilters.push(new Filter("Zzgroup", FilterOperator.EQ, this.GroupCodefilter));
			if (this.ZoneCodefilter.length > 0)
				aFilters.push(new Filter("Project", FilterOperator.EQ, this.ZoneCodefilter));

			this.byId("IdBuildingTable_copy").setVisibleRowCount(this.getModel("localJson").getProperty("/copymyBuildingSet").length);
			this.byId("IdBuildingTable_copy").getBinding("rows").filter(aFilters);
			this.byId("IdBuildingTable_copy").refreshRows();
			var aCurrentContexts = this.byId("IdBuildingTable_copy").getBinding("rows").getCurrentContexts();
			aCurrentContexts.map(function (
				oCurrentContext) {
				BuildingF.push(JSON.parse(JSON.stringify(dataModel.getProperty(oCurrentContext.getPath()))));
			});
			var aServicesCopy = JSON.parse(JSON.stringify(BuildingF));

			BuildingF.map(function (oServices) {
				found = false;
				oConsoliatedServices.Model = oServices.Model;
				oConsoliatedServices.ModelDesc = oServices.ModelDesc;
				oConsoliatedServices.BuildingNo = oServices.BuildingNo;
				oConsoliatedServices.Modelr = oServices.Model + "R";
				aServicesCopy.map(function (oServicesCopy) {
					if (oServicesCopy.Model === oConsoliatedServices.Model && oConsoliatedServices.Model != "") {
						found = true;
						var modelExists = false;
						oServicesCopy.Model = oConsoliatedServices.Modelr;
					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Model !== oConsoliatedServices.Modelr);
					});
				}

				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
			});

			dataModel.setProperty("/Modelfilter", aConsoliatedServices);

			if (this._ModelDialogfilter) {
				this._ModelDialogfilter.destroy();
				this._ModelDialogfilter = null;
			}
			if (!this._ModelDialogfilter) {
				this._ModelDialogfilter = sap.ui.xmlfragment("com.cicre.po.view.fragments.ModelDialogfilter", this);
				this.getView().addDependent(this._ModelDialogfilter); // 
			}
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>ModelDesc}",
				description: "{localJson>Model}",
				type: "Active"
			});
			this._ModelDialogfilter.bindAggregation("items", {
				path: "localJson>/Modelfilter",
				template: oTemplate,
				templateShareable: false
			});
			this._ModelDialogfilter.open();
		},
		handleSearchModelfilter: function (oEvent) {

			var that = this;
			var sValue = oEvent.getParameter("value");
			var oFilter4 = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue);
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>ModelDesc}",
				description: "{localJson>Model}",
				type: "Active"
			});
			var aFilters = [];
			if (sValue !== "") {
				aFilters.push(oFilter4);
			}
			this._ModelDialogfilter.bindAggregation("items", {
				path: "localJson>/Modelfilter",
				template: oTemplate,
				filters: aFilters,
				templateShareable: false
			});
		},
		onSearchModelfilter: function (oEvent) {

			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					if (that.modelId === "__component0---object--idSearchByModelFilter") {
						that.ModelCodeFilter = oContext.getObject().Model;
						that.getView().byId("idSearchByModelFilter").setValue(oContext.getObject().ModelDesc);

					} else {

						that.ModelCodefilter = oContext.getObject().Model;
						that.getView().byId("onSearchModelfilter_Id").setValue(oContext.getObject().ModelDesc);

					}
				});
			}
			else {
				if (that.modelId === "__component0---object--idSearchByModelFilter") {
					that.ModelCodeFilter = "";
					sap.m.MessageToast.show("No new item was selected.");
				} else {
					that.ModelCodefilter = "";
					that.getView().byId("onSearchModelfilter_Id").setValue("");

				}

			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		//model filter base building
		//cccc
		onDisplaySearchModelfilterOnBuilding: function (oEvent) {

			var that = this,
				// myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet"))),
				myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet"))),
				dataModel = this.getModel("localJson"),
				dataModelB = this.getModel("localJso"),
				aFilters = [],
				BuildingF = [],
				oConsoliatedServices = {},
				aConsoliatedServices = [],
				found = false,
				itemModel = dataModelB.getProperty("/Buildingss");
			this.modelId = oEvent.getParameters().id;
			that.getModel("localJson").setProperty("/copymyBuildingSet", myBuildingSet);



			if (itemModel.length > 0) {
				itemModel.map(function (oBuilding) {
					aFilters.push(new sap.ui.model.Filter("BuildingNo", sap.ui.model.FilterOperator.EQ, oBuilding.BuildingNo));
				});
			}
			this.byId("IdBuildingTable_copy").setVisibleRowCount(this.getModel("localJson").getProperty("/copymyBuildingSet").length);
			this.byId("IdBuildingTable_copy").getBinding("rows").filter(aFilters);
			this.byId("IdBuildingTable_copy").refreshRows();
			var aCurrentContexts = this.byId("IdBuildingTable_copy").getBinding("rows").getCurrentContexts();
			aCurrentContexts.map(function (
				oCurrentContext) {
				BuildingF.push(JSON.parse(JSON.stringify(dataModel.getProperty(oCurrentContext.getPath()))));
			});
			var aServicesCopy = JSON.parse(JSON.stringify(BuildingF));

			BuildingF.map(function (oServices) {
				found = false;
				oConsoliatedServices.Model = oServices.Model;
				oConsoliatedServices.ModelDesc = oServices.ModelDesc;
				oConsoliatedServices.BuildingNo = oServices.BuildingNo;
				oConsoliatedServices.Modelr = oServices.Model + "R";
				aServicesCopy.map(function (oServicesCopy) {
					if (oServicesCopy.Model === oConsoliatedServices.Model && oConsoliatedServices.Model != "") {
						found = true;
						var modelExists = false;
						oServicesCopy.Model = oConsoliatedServices.Modelr;
					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Model !== oConsoliatedServices.Modelr);
					});
				}

				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
			});

			dataModel.setProperty("/Modelfilter", aConsoliatedServices);

			if (this._ModelDialogfilter) {
				this._ModelDialogfilter.destroy();
				this._ModelDialogfilter = null;
			}
			if (!this._ModelDialogfilter) {
				this._ModelDialogfilter = sap.ui.xmlfragment("com.cicre.po.view.fragments.ModelDialogfilterBuilding", this);
				this.getView().addDependent(this._ModelDialogfilter); // 
			}
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>ModelDesc}",
				description: "{localJson>Model}",
				type: "Active"
			});
			this._ModelDialogfilter.bindAggregation("items", {
				path: "localJson>/Modelfilter",
				template: oTemplate,
				templateShareable: false
			});
			this._ModelDialogfilter.open();
		},
		handleSearchModelBuilding: function (oEvent) {

			var that = this;
			var sValue = oEvent.getParameter("value");
			var oFilter4 = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue);
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>ModelDesc}",
				description: "{localJson>Model}",
				type: "Active"
			});
			var aFilters = [];
			if (sValue !== "") {
				aFilters.push(oFilter4);
			}
			this._ModelDialogfilter.bindAggregation("items", {
				path: "localJson>/Modelfilter",
				template: oTemplate,
				filters: aFilters,
				templateShareable: false
			});
		},
		onSelectModelListBuilding: function (oEvent) {

			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {

					that.ModelCodeFilter = oContext.getObject().Model;
					that.getView().byId("idSearchByModelFilter").setValue(oContext.getObject().ModelDesc);


				});
			}
			else {
				if (that.modelId === "__component0---object--idSearchByModelFilter") {
					that.ModelCodeFilter = "";
					sap.m.MessageToast.show("No new item was selected.");
				} else {
					that.ModelCodefilter = "";
					that.getView().byId("onSearchModelfilter_Id").setValue("");

				}

			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		changeBuildingfilter: function () {
			this.ModelCodefilter = "";
			this.getView().byId("idSearchByModelFilter").setValue("");

		},

		// zone filter 
		onDisplaySearchZone: function (oEvent) {

			var that = this,
				myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet"))),
				dataModel = this.getModel("localJson");
			var oConsoliatedServices = {},
				aConsoliatedServices = [],
				found = false,
				aFilters = [],
				BuildingF = [];

			if (this.ModelCodefilter.length > 0)
				aFilters.push(new Filter("Model", FilterOperator.EQ, this.ModelCodefilter));
			if (this.BuildingCodefilter.length > 0)
				aFilters.push(new Filter("BuildingNo", FilterOperator.EQ, this.BuildingCodefilter));
			if (this.GroupCodefilter.length > 0)
				aFilters.push(new Filter("Zzgroup", FilterOperator.EQ, this.GroupCodefilter));
			this.byId("IdBuildingTable_copy").setVisibleRowCount(this.getModel("localJson").getProperty("/copymyBuildingSet").length);
			this.byId("IdBuildingTable_copy").getBinding("rows").filter(aFilters);
			this.byId("IdBuildingTable_copy").refreshRows();
			var aCurrentContexts = this.byId("IdBuildingTable_copy").getBinding("rows").getCurrentContexts();
			aCurrentContexts.map(function (
				oCurrentContext) {
				BuildingF.push(JSON.parse(JSON.stringify(dataModel.getProperty(oCurrentContext.getPath()))));
			});

			var aServicesCopy = JSON.parse(JSON.stringify(BuildingF));
			BuildingF.map(function (oServices) {
				found = false;
				oConsoliatedServices.Project = oServices.Project;
				oConsoliatedServices.ZoneTxt = oServices.ZoneTxt;
				oConsoliatedServices.BuildingNo = oServices.BuildingNo;
				oConsoliatedServices.Projectr = oServices.Project + "R";
				aServicesCopy.map(function (oServicesCopy) {
					if (oServicesCopy.Project === oConsoliatedServices.Project && oConsoliatedServices.Project != "") {
						found = true;
						oServicesCopy.Project = oConsoliatedServices.Projectr;
					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Project !== oConsoliatedServices.Projectr);
					});
				}

				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
			});

			dataModel.setProperty("/Zonefilter", aConsoliatedServices);
			if (this._ZoneDialogfilter) {
				this._ZoneDialogfilter.destroy();
				this._ZoneDialogfilter = null;
			}
			if (!this._ZoneDialogfilter) {
				this._ZoneDialogfilter = sap.ui.xmlfragment("com.cicre.po.view.fragments.ZoneSearchDialogfilter", this);
				this.getView().addDependent(this._ZoneDialogfilter); // 
			}
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>ZoneTxt}",
				description: "{localJson>Project}",
				type: "Active"
			});
			this._ZoneDialogfilter.bindAggregation("items", {
				path: "localJson>/Zonefilter",
				template: oTemplate,
				templateShareable: false
			});
			this._ZoneDialogfilter.open();
		},
		handleSearchZonefilter: function (oEvent) {

			var that = this;
			var sValue = oEvent.getParameter("value");
			var oFilter4 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.Contains, sValue);
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>ZoneTxt}",
				description: "{localJson>Project}",
				type: "Active"
			});
			var aFilters = [];
			if (sValue !== "") {
				aFilters.push(oFilter4);
			}
			this._ZoneDialogfilter.bindAggregation("items", {
				path: "localJson>/Zonefilter",
				template: oTemplate,
				filters: aFilters,
				templateShareable: false
			});
		},
		onSearchZonefilter: function (oEvent) {

			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					that.ZoneCodefilter = oContext.getObject().Project;
					that.getView().byId("onSearchZonefilter_Id").setValue(oContext.getObject().ZoneTxt);
				});
			} else {
				that.ZoneCodefilter = "";
				that.getView().byId("onSearchZonefilter_Id").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		////Buiilding filter 
		onDisplaySearBuildingfilter: function (oEvent) {

			var that = this,
				myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet"))),

				dataModel = this.getModel("localJson");
			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(myBuildingSet)),
				aConsoliatedServices = [],
				aFilters = [],
				BuildingF = [],
				found = false;
			if (this.ModelCodefilter.length > 0)
				aFilters.push(new Filter("Model", FilterOperator.EQ, this.ModelCodefilter));
			//if(this.BuildingCodefilter.length >0)
			//	aFilters.push(new Filter("BuildingNo", FilterOperator.EQ, this.BuildingCodefilter));
			if (this.GroupCodefilter.length > 0)
				aFilters.push(new Filter("Zzgroup", FilterOperator.EQ, this.GroupCodefilter));
			if (this.ZoneCodefilter.length > 0)
				aFilters.push(new Filter("Project", FilterOperator.EQ, this.ZoneCodefilter));

			this.byId("IdBuildingTable_copy").setVisibleRowCount(this.getModel("localJson").getProperty("/copymyBuildingSet").length);
			this.byId("IdBuildingTable_copy").getBinding("rows").filter(aFilters);
			this.byId("IdBuildingTable_copy").refreshRows();
			var aCurrentContexts = this.byId("IdBuildingTable_copy").getBinding("rows").getCurrentContexts();
			aCurrentContexts.map(function (
				oCurrentContext) {
				BuildingF.push(JSON.parse(JSON.stringify(dataModel.getProperty(oCurrentContext.getPath()))));
			});
			var aServicesCopy = JSON.parse(JSON.stringify(BuildingF));

			BuildingF.map(function (oServices) {
				found = false;
				oConsoliatedServices.BuildingTxt = oServices.BuildingTxt;
				oConsoliatedServices.BuildingNo = oServices.BuildingNo;
				oConsoliatedServices.BuildingNor = oServices.BuildingNo + "R";
				aServicesCopy.map(function (oServicesCopy) {
					if (oServicesCopy.BuildingNo === oConsoliatedServices.BuildingNo && oConsoliatedServices.BuildingNo != "") {
						found = true;
						oServicesCopy.BuildingNo = oConsoliatedServices.BuildingNor;
					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.BuildingNo !== oConsoliatedServices.BuildingNor);
					});
				}

				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
			});

			dataModel.setProperty("/Buildingfilter", aConsoliatedServices);
			if (this._BuildingDialogfilter) {
				this._BuildingDialogfilter.destroy();
				this._BuildingDialogfilter = null;
			}
			if (!this._BuildingDialogfilter) {
				this._BuildingDialogfilter = sap.ui.xmlfragment("com.cicre.po.view.fragments.BuildingSearchDialogfilter", this);
				this.getView().addDependent(this._BuildingDialogfilter); // 
			}
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>BuildingTxt}",
				description: "{localJson>BuildingNo}",
				type: "Active"
			});
			this._BuildingDialogfilter.bindAggregation("items", {
				path: "localJson>/Buildingfilter",
				template: oTemplate,
				templateShareable: false
			});
			this._BuildingDialogfilter.open();
		},
		handleSearchBilddingfilter: function (oEvent) {

			var that = this;
			var sValue = oEvent.getParameter("value");
			var oFilter3 = new sap.ui.model.Filter("BuildingTxt", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter4 = new sap.ui.model.Filter("BuildingNo", sap.ui.model.FilterOperator.Contains, sValue);
			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>BuildingTxt}",
				description: "{localJson>BuildingNo}",
				type: "Active"
			});
			var aFilters = [];
			if (sValue !== "") {
				aFilters.push(oFilter3);
			}
			if (sValue !== "") {
				aFilters.push(oFilter4);
			}
			this._BuildingDialogfilter.bindAggregation("items", {
				path: "localJson>/Buildingfilter",
				template: oTemplate,
				filters: aFilters,
				templateShareable: false
			});
		},
		onSearchBuildingfilter: function (oEvent) {

			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					that.BuildingCodefilter = oContext.getObject().BuildingNo;
					that.getView().byId("onSearchBildingfilter_Id").setValue(oContext.getObject().BuildingTxt);
				});
			} else {
				that.BuildingCodefilter = "";
				that.getView().byId("onSearchBildingfilter_Id").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		changeModel: function () {
			this.ModelCodefilter = "";
			that.getView().byId("onSearchModelfilter_Id").setValue("");
		},
		changeZone: function () {
			this.ZoneCodefilter = "";
			that.getView().byId("onSearchZonefilter_Id").setValue("");
		},
		changeGroup: function () {
			this.GroupCodefilter = "";
			that.getView().byId("onSearchGroupfilter").setValue("");
		},
		changeBuilding: function () {
			this.BuildingCodefilter = "";
			that.getView().byId("onSearchBildingfilter_Id").setValue("");
		},
		////////////////////////////
		onFilterServices: function (oEvent) {

			this.ViewCon = "V";
			if (oEvent.getParameters().id === "__component0---object--forBBuildingConsulidatedItemSet") {
				this.getModel("localJso").setProperty("/ViewCon4", false);
				this.getModel("localJso").setProperty("/ViewCon2", false);
			}
			this.selectedTableId = oEvent.getSource().getParent().getParent().getId().substring(oEvent.getSource().getParent().getParent().getId()
				.lastIndexOf("-") + 1);
			if (!this._filterDialog) {
				this._filterDialog = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.FilterServices", this);
				this.getView().addDependent(this._filterDialog);
			}

			this._filterDialog.open();
		},
		onBuildingValueHelpPress: function () {
			var that = this,
				myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
			that.getModel("localJson").setProperty("/copymyBuildingSet", myBuildingSet);
			if (that.sProjectCode !== "" && that.sCoCode !== "") {
				var oTable = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.BuildingValueHelpFilterBarTable", this);
				if (!this._oBuildingValueHelpDialog) {
					this._oBuildingValueHelpDialog = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.BuildingValueHelpFilterBarDialog", this);
					this._oBuildingValueHelpDialog.setTable(oTable);
					this.getView().addDependent(this._oBuildingValueHelpDialog);
				}
				this._oBuildingValueHelpDialog.open();
				if (that._oBuildingValueHelpDialog.getModel("localJson")) {
					this.getView().getModel("localJson").setProperty("/BuildingFilterSet", []);
					this.getView().getModel("localJson").setProperty("/WBSFilterSet", []);
					this.getView().getModel("localJson").setProperty("/BuildingWBSFilterSet", []);
				}

			} else {
				sap.m.MessageToast.show("Please select Company Code and Project first.");
			}
		},
		CancelPressBuilding: function () {
			this.ModelCodefilter = "";
			this.ZoneCodefilter = "";
			this.GroupCodefilter = "";
			this.BuildingCodefilter = "";
			this._oBuildingValueHelpDialog.close();
			this._oBuildingValueHelpDialog.destroy();
			this._oBuildingValueHelpDialog = null;
		},
		/// model for filter 
		///////////////////  Model search value help/////// create using [E.A]
		onDisplaySearchModel: function (oEvent) {

			this.idSelectModel = oEvent.getSource().getId();
			if (!this._ModelDialogFilter) {
				this._ModelDialogFilter = sap.ui.xmlfragment("com.cicre.po.view.fragments.ModelSearchDialog", this);
				this._ModelDialogFilter.setModel(this.getView().getModel());
			}
			this._ModelDialogFilter.open();
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
			this._ModelDialogFilter.bindAggregation("items", {
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
			if (this.sCoCode.length > 0) {
				aFilters.push(oFilter2);
			}
			if (this.sProj.length > 0) {
				aFilters.push(oFilter5);
			}
			if (this.sProjectCode.length > 0) {
				aFilters.push(oFilter3);
			}
			if (sValue.length > 0) {
				aFilters.push(oFilter4);
			} if (this.Building.length > 0) {
				aFilters.push(oFilter6);
			}
			if (this.GroupCode.length > 0) {
				aFilters.push(oFilter7);
			}



			this._ModelDialogFilter.bindAggregation("items", {
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
					if (that.idSelectModel.substring(that.idSelectModel.lastIndexOf("-") + 1) === "idSearchByModel") {
						that.ModelCodee = oContext.getObject().IdNumber;
						that.getView().byId("idSearchByModel").setValue(oContext.getObject().IdText);
					} else if (that.idSelectModel.substring(that.idSelectModel.lastIndexOf("-") + 1) === "idSearchByModelFilter") {
						that.ModelCodeFilter = oContext.getObject().IdNumber;
						that.getView().byId("idSearchByModelFilter").setValue(oContext.getObject().IdText);
					}
					else {


						that.getView().byId("idSearchByModel").setValue(oContext.getObject().IdText);
					}

				});
			} else {
				that.ModelCodee = "";
				that.getView().byId("idSearchByModel").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},


		handleSearchBuildingPressFilter: function () {

			var that = this,
				myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet"))),
				myWBSSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myWBSSet"))),
				Building = this.getView().byId("idBuildingCategory").getSelectedKeys(),
				mModel = that.getOwnerComponent().getModel(),
				that = this,
				select = false,
				areaBuild = [],
				selectedBuilding = [];

			Building.map(function (oBuilding) {
				if (oBuilding == "BUILD") {
					var filters = [];
					if (that.GroupCodefilter.length < 3 && that.GroupCodefilter.length != 0) {
						that.GroupCodefilter = "0" + that.GroupCodefilter;
					}
					var mModel = that.getOwnerComponent().getModel();
					var oFilter1 = new sap.ui.model.Filter("Zone", sap.ui.model.FilterOperator.EQ, that.ZoneCodefilter);
					var oFilter2 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, that.sCoCode);
					var oFilter3 = new sap.ui.model.Filter("BuildingNo", sap.ui.model.FilterOperator.EQ, that.BuildingCodefilter);
					var oFilter4 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
					var oFilter5 = new sap.ui.model.Filter("Group", sap.ui.model.FilterOperator.EQ, that.GroupCodefilter);
					var oFilter6 = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, that.ModelCodefilter);
					if (that.ZoneCodefilter !== "")
						filters.push(oFilter1);
					if (that.BuildingCodefilter !== "")
						filters.push(oFilter3);
					if (that.GroupCodefilter !== "") { filters.push(oFilter5); }
					if (that.ModelCodefilter !== "") { filters.push(oFilter6); }
					filters.push(oFilter2);
					filters.push(oFilter4);
					mModel.read("/BuildingSet", {
						filters: filters,
						success: function (oData) {
							$.each(oData.results, function (i, data) {
								var A = {
									"BuildingNo": data.BuildingNo,
									"ModelDesc": data.ModelDesc,
									"Model": "00000" + data.Model,
									"Group": data.Group
								}
								areaBuild.push(A)
							});



							$.each(myBuildingSet, function (i, BUW) {
								var fund = false;
								$.each(areaBuild, function (i, BUWC) {
									if (BUWC.BuildingNo === BUW.BuildingNo) {
										fund = true;
										$.each(selectedBuilding, function (r, co) {
											if (BUWC.BuildingNo === co.BuildingNo)
												fund = false;
										})
									}
								})
								if (fund) {

									selectedBuilding.push(BUW);
								}

							})



							that.getView().getModel("localJson").setProperty("/BuildingFilterSet", selectedBuilding);
						},
						error: function (e) {
							sap.m.MessageToast.show("Error");
						}
					});
				}
				if (oBuilding == "WBS") {

					if (that.sProjectCode !== "" && that.sCoCode !== "") {


						var mModel = that.getView().getModel();
						var filters = [];
						var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBS");
						var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, that.sCoCode);
						var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
						filters.push(oFilter1);
						filters.push(oFilter2);
						filters.push(oFilter3);
						mModel.read("/ValueHelpSet", {
							filters: filters,
							success: function (oData) {
								select = true;
								$.each(oData.results, function (v, value) {
									oData.results[v].Group = "";
									oData.results[v].Model = oData.results[v].IdNumber;
								});
								$.each(oData.results, function (i, data) {
									var A = {
										"BuildingNo": data.IdNumber,
										"ModelDesc": data.IdText,
										"Model": data.IdNumber
									}
									areaBuild.push(A)
								});

								$.each(myWBSSet, function (i, BUW) {
									var fund = false;
									$.each(areaBuild, function (i, BUWC) {
										if (BUWC.BuildingNo === BUW.BuildingNo) {
											fund = true;
										}
										$.each(selectedBuilding, function (r, co) {
											if (BUWC.BuildingNo === co.BuildingNo)
												fund = false;
										})
									})
									if (fund) {
										selectedBuilding.push(BUW);
									}

								})
								var data = JSON.parse(JSON.stringify(areaBuild));
								that.getView().getModel("localJson").setProperty("/BuildingFilterSet", selectedBuilding);
							},
							error: function (e) {
								sap.m.MessageToast.show("Error");
							}
						});
					} else {
						sap.m.MessageToast.show("Please select Company Code and Project first.");
					}
				}

			});

		},
		onBuildingValueHelpOkPress: function () {

			// var aTokens = oEvent.getParameter("tokens");

			var dataModel = this.getModel("localJso"),
				selectedIndices = this._oBuildingValueHelpDialog.getTable().getSelectedIndices(),
				selectedBUWBS_Building = [];
			if (selectedIndices.length > 0) {
				for (var i = 0; i < selectedIndices.length; i++) {
					var selected = this._oBuildingValueHelpDialog.getTable().getContextByIndex(selectedIndices[i]).getObject();
					selectedBUWBS_Building.push(selected);
				}
				dataModel.setProperty("/Buildingss", selectedBUWBS_Building);
				dataModel.refresh();
			}
			this.CancelPressBuilding();
		}, onApplyFilter: function () {

			var that = this;
			var
				aFilters = [],
				aServices = [],
				dataModelB = this.getModel("localJso"),
				itemModel = dataModelB.getProperty("/Buildingss"),
				dataModel = this.getView().getModel("localJson"),
				sContractualIndicator = this.byId("idFContractualIndicator").getSelectedKeys(),

				ModelCodeFilter = "00000" + that.ModelCodeFilter; //Boq
			//	this.byId("idConsuliatedTable").getBinding("rows").filter([]);

			if (itemModel.length > 0) {
				itemModel.map(function (oBuilding) {
					aFilters.push(new sap.ui.model.Filter("Buildingno", sap.ui.model.FilterOperator.EQ, oBuilding.BuildingNo));
				});
			} if (sContractualIndicator.length > 0) {
				sContractualIndicator.map(function (ctualIndicator) {
					//ContractualIndicator
					aFilters.push(new sap.ui.model.Filter("ContractualIndicator", sap.ui.model.FilterOperator.EQ, ctualIndicator));
				});
			}
			/*if (sContractualIndicator.length > 0) {
				aFilters.push(new sap.ui.model.Filter("ContractualIndicator", sap.ui.model.FilterOperator.EQ, sContractualIndicator));
			}*/
			if (ModelCodeFilter !== "00000") {
				aFilters.push(new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, ModelCodeFilter));
			}
			if (this.getModel("localJso").getProperty("/ViewCon3") == false) {

				var serviceTableId = "idConsuliatedTableGroup";
			}
			if (this.getModel("localJso").getProperty("/ViewCon2") == false) {
				var serviceTableId = "idConsuliatedTable";
			}
			// this.byId("idConsuliatedTable").setVisibleRowCount(this.getModel("localJson").getProperty("/BuildingConsulidatedItemSet").length);
			//	this.byId("idConsuliatedTable").getBinding("rows").filter(aFilters);

			//if (aFilters.length !== 0) {
			///	this.byId("idConsuliatedTable").getBinding("items").filter(aFilters);
			//  this.byId("idConsuliatedTable").refreshRows();
			//this.byId("idConsuliatedTable").suggest();
			///	var aCurrentContexts =this.byId("idConsuliatedTable").getBinding("items").getCurrentContexts();
			/*aCurrentContexts.map(function(
				oCurrentContext) {
				aServices.push(JSON.parse(JSON.stringify(dataModel.getProperty(oCurrentContext.getPath()))));
			});*/
			// }else{
			//	  var aServices = this.getView().getModel("localJson").getProperty("/BuildingConsulidatedItemSet");
			//  }

			//this.byId("idConsulidatedTable").getBinding("items").filter([]);
			that.Consoliatedservicesall();
			//that._filterDialog.close();
			if (this._filterDialog) {
				this._filterDialog.destroy();
				this._filterDialog = null;
				//}
			}
			/*	if(!this.getModel("localJso").getProperty("/ViewCon3")){
				that.groupConsolidscreen3(JSON.parse(JSON.stringify(aServices)));}
				else{ that.groupConsolidscreen2(aServices);} */

		},

		onClearFilter: function (oEvent) {

			var that = this;

			var model = this.getModel("localJson");
			var modelkey = this.getModel("localJso");

			//	that.Consoliatedservicesall();
			//	this.byId("idConsuliatedTable").getBinding("items").filter([]);
			model.refresh();
			//var copymodel = this.getModel("localJson").getProperty("/BuildingConsulidatedItemSet");
			//model.setProperty("/BuildingConsulidatedItemSet", copymodel);
			///this.WholeContractservices(copymodel);
			//that.getView().getModel("localJso").setProperty("/Buildings", []);
			this.byId("idFContractualIndicator").setSelectedKeys();
			model.setProperty("/Buildingss", []);
			modelkey.setProperty("/Buildingss", []);
			that.ModelCodeFilter = "";
			modelkey.refresh();
			that.Consoliatedservicesall();
			//	this.byId("idConsuliatedTable").getBinding("items").filter([]);
			//} else {

			if (this.getModel("localJso").getProperty("/ViewCon2") === "false") {
				var serviceTableId = "idConsuliatedTable";
			} else {
				serviceTableId = "idConsuliatedTableGroup";
			}
			//this.byId(serviceTableId).getBinding("rows").filter([]);
			///var aServices = this.getModel("localJson").getProperty("/BuildingConsulidatedItemSet");
			/*if(!this.getModel("localJso").getProperty("/ViewCon3")){
			this.groupConsolidscreen3all(aServices);}*/
			//this.groupConsolidscreen3(aServices);
			if (this._filterDialog) {
				this._filterDialog.destroy();
				this._filterDialog = null;
				//}
			}
		},

		groupConsolidscreen2: function (aServices) {

			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(aServices)),
				aConsoliatedServices = [],
				dataModel = this.getModel("localJson"),
				found = false;
			aServices.map(function (oServices) {
				found = false;
				oConsoliatedServices.ContractualIndicator = oServices.ContractualIndicator;
				oConsoliatedServices.Boq = oServices.Boq;
				oConsoliatedServices.sortNum = oServices.sortNum;
				oConsoliatedServices.Data = oServices.Data;

				oConsoliatedServices.LongDesc = oServices.LongDesc;
				oConsoliatedServices.ShortDesc = oServices.ShortDesc;
				oConsoliatedServices.Uom = oServices.Uom;
				oConsoliatedServices.Qty = 0;
				oConsoliatedServices.Eancat = oServices.Eancat;
				oConsoliatedServices.PriceUnit = oServices.PriceUnit;
				oConsoliatedServices.Txt = oServices.Txt;
				oConsoliatedServices.ContractualIndicatorr = oServices.ContractualIndicator + "R"
				oConsoliatedServices.Datar = oServices.Data + "R";
				oConsoliatedServices.Txtr = oServices.Txt + "R";
				oConsoliatedServices.MatlGroup = oServices.MatlGroup;
				oConsoliatedServices.Amount = 0;
				oConsoliatedServices.Buildings = [];
				aServicesCopy.map(function (oServicesCopy) {
					if ((oServicesCopy.Data) === oConsoliatedServices.Data && oServicesCopy.Txt === oConsoliatedServices.Txt) {
						found = true;
						var buildingExists = false;
						oConsoliatedServices.Amount += parseFloat(oServicesCopy.Amount);
						oConsoliatedServices.Qty += parseFloat(oServicesCopy.Qty);
						oServicesCopy.ContractualIndicator = oConsoliatedServices.ContractualIndicatorr;
						oServicesCopy.Data = oConsoliatedServices.Datar;
						oServicesCopy.Txt = oConsoliatedServices.Txtr;
						oConsoliatedServices.Buildings.map(function (oBuilding) {
							if (oBuilding === oServicesCopy.Buildingno) {
								buildingExists = true;
							}
						});
						if (!buildingExists) {
							oConsoliatedServices.Buildings.push(oServicesCopy.Buildingno);
						}
					}
				});
				if (found) {
					oConsoliatedServices.Buildingno = (oConsoliatedServices.Buildings.length).toString();
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					// filter the assigned consolidation
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Data !== oConsoliatedServices.Datar && oValue.Txt !== oConsoliatedServices.Txtr);
					});
				}
				// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}

			});

			dataModel.setProperty("/forBBuildingConsulidatedItemSet", JSON.parse(JSON.stringify(aConsoliatedServices.sort((a, b) => a.Data - b.Data))));

			//dataModel.setProperty("/BuildingConsulidatedItemSet", JSON.parse(JSON.stringify(aConsoliatedServices)));

		},

		_WholeContract: function () {

			this.onClearFilter();
			//var dataModel = this.getModel("localJson"),
			//	aServices = dataModel.getProperty("/BuildingConsulidatedItemSet");
			//this.WholeContractservices(aServices);
			//this.groupConsolidscreen3(aServices);
			//this.groupConsolidscreen3all(aServices);
			this._filterDialog.close();

		},

		WholeContractservices: function (aServices) {

			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(aServices)),
				aConsoliatedServices = [],
				dataModel = this.getModel("localJson"),
				found = false;
			aServices.map(function (oServices) {
				found = false;
				oConsoliatedServices.ContractualIndicator = oServices.ContractualIndicator;
				oConsoliatedServices.Boq = oServices.Boq;
				oConsoliatedServices.Data = oServices.Data;
				oConsoliatedServices.sortNum = oServices.sortNum;
				oConsoliatedServices.ShortDesc = oServices.ShortDesc;
				oConsoliatedServices.Uom = oServices.Uom;
				oConsoliatedServices.Qty = 0;
				oConsoliatedServices.Eancat = oServices.Eancat;
				oConsoliatedServices.PriceUnit = oServices.PriceUnit;
				oConsoliatedServices.Txt = oServices.Txt;
				oConsoliatedServices.ContractualIndicatorr = oServices.ContractualIndicator + "R"
				oConsoliatedServices.Datar = oServices.Data + "R"
				oConsoliatedServices.Txtr = oServices.Txt + "R";
				oConsoliatedServices.MatlGroup = oServices.MatlGroup;

				oConsoliatedServices.Amount = 0;
				oConsoliatedServices.Buildings = [];
				aServicesCopy.map(function (oServicesCopy) {
					if ((oServicesCopy.Data) === oConsoliatedServices.Data && oServicesCopy.Txt === oConsoliatedServices.Txt /*&& oServicesCopy.ContractualIndicator === oConsoliatedServices.ContractualIndicator*/) {
						found = true;
						var buildingExists = false;
						oConsoliatedServices.Amount += parseFloat(oServicesCopy.Qty * oServicesCopy.PriceUnit);
						oConsoliatedServices.Qty += parseFloat(oServicesCopy.Qty);
						oServicesCopy.ContractualIndicator = oConsoliatedServices.ContractualIndicatorr;
						oServicesCopy.Data = oConsoliatedServices.Datar;
						oServicesCopy.Txt = oConsoliatedServices.Txtr;
						oConsoliatedServices.Buildings.map(function (oBuilding) {
							if (oBuilding === oServicesCopy.Buildingno) {
								buildingExists = true;
							}
						});

						if (!buildingExists) {
							oConsoliatedServices.Buildings.push(oServicesCopy.Buildingno);
						}
					}
				});
				if (found) {
					oConsoliatedServices.Buildingno = oConsoliatedServices.Buildings.length;
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					// filter the assigned consolidation
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Data !== oConsoliatedServices.Datar && oValue.Txt !== oConsoliatedServices.Txtr /*&& oValue.ContractualIndicator !== oConsoliatedServices.ContractualIndicatorr*/);
					});
				}
				// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}

			});
			dataModel.setProperty("/forBBuildingConsulidatedItemSet", JSON.parse(JSON.stringify(aConsoliatedServices.sort((a, b) => a.Data - b.Data))));
			//dataModel.setProperty("/BuildingConsulidatedItemSet", aConsoliatedServices);aConsoliatedServices.sort((a, b) => a.Data - b.Data)

		},
		groupConsolidscreen3all: function (aServices) {

			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(aServices)),
				aConsoliatedServices = [],
				dataModel = this.getModel("localJson"),
				found = false;
			aServices.map(function (oServices) {
				found = false;
				oConsoliatedServices.ContractualIndicator = oServices.ContractualIndicator;
				oConsoliatedServices.Boq = oServices.Boq;
				oConsoliatedServices.Txt = oServices.Txt;
				oConsoliatedServices.ItemCat = oServices.ItemCat;
				oConsoliatedServices.Buildingno = oServices.Buildingno;
				oConsoliatedServices.Buildingnum = 0;//Item:
				oConsoliatedServices.sortNum = oServices.sortNum;
				oConsoliatedServices.ContractualIndicatorr = oServices.ContractualIndicator + "R"
				oConsoliatedServices.MatlGroupr = oServices.MatlGroup + "R"
				oConsoliatedServices.Boqr = oServices.Boq + "R"
				oConsoliatedServices.Txtr = oServices.Txt + "R";
				oConsoliatedServices.Buildingnor = oServices.Buildingno + "R";
				oConsoliatedServices.MatlGroup = oServices.MatlGroup;
				oConsoliatedServices.Boq = oServices.Boq;
				oConsoliatedServices.Matdesc = oServices.Matdesc;
				oConsoliatedServices.Amount = 0;
				oConsoliatedServices.Buildings = [];
				aServicesCopy.map(function (oServicesCopy) {
					if ((oServicesCopy.MatlGroup) === oConsoliatedServices.MatlGroup && oServicesCopy.Boq === oConsoliatedServices.Boq
						&& oServicesCopy.ItemCat !== "U" && oServicesCopy.Txt === oConsoliatedServices.Txt
						&& oServicesCopy.Buildingno === oConsoliatedServices.Buildingno) {
						found = true;
						var buildingExists = false;
						oConsoliatedServices.Amount += parseFloat(oServicesCopy.Qty * oServicesCopy.PriceUnit);
						oServicesCopy.ContractualIndicator = oConsoliatedServices.ContractualIndicatorr;
						oServicesCopy.MatlGroup = oConsoliatedServices.MatlGroupr;
						oServicesCopy.Txt = oConsoliatedServices.Txtr;
						oServicesCopy.Buildingno = oConsoliatedServices.Buildingnor;
						oConsoliatedServices.Buildings.map(function (oBuilding) {
							if (oBuilding === oServicesCopy.Buildingno) {
								buildingExists = true;
							}
						});

						if (!buildingExists) {
							oConsoliatedServices.Buildings.push(oServicesCopy.Buildingno);
						}
					}
				});
				if (found) {
					//oConsoliatedServices.Buildingno = oConsoliatedServices.Buildings.length;
					oConsoliatedServices.Buildingnum = oConsoliatedServices.Buildings.length;


					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					// filter the assigned consolidation
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.MatlGroup !== oConsoliatedServices.MatlGroupr && oValue.Boq !== oConsoliatedServices.Boqr && oValue.Txt !== oConsoliatedServices.Txtr
							&& oValue.Buildingno !== oConsoliatedServices.Buildingnor);
					});
				}
				// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}

			});
			dataModel.setProperty("/ServiceGroupSet", aConsoliatedServices);
			return aConsoliatedServices;
		},
		groupConsolidscreen3: function (aServices) {

			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(aServices)),
				aConsoliatedServices = [],
				dataModel = this.getModel("localJson"),
				found = false;
			aServices.map(function (oServices) {
				found = false;
				oConsoliatedServices.ContractualIndicator = oServices.ContractualIndicator;
				oConsoliatedServices.Boq = oServices.Boq;
				oConsoliatedServices.MatlGroup = oServices.MatlGroup;
				oConsoliatedServices.Txt = oServices.Txt;
				oConsoliatedServices.Buildingno = oServices.Buildingno;
				oConsoliatedServices.sortNum = oServices.sortNum;
				oConsoliatedServices.ContractualIndicatorr = oServices.ContractualIndicator + "R"
				oConsoliatedServices.MatlGroupr = oServices.MatlGroup + "R"
				oConsoliatedServices.Txtr = oServices.Txt + "R";
				oConsoliatedServices.Buildingnum = 0;
				oConsoliatedServices.Matdesc = oServices.Matdesc;
				oConsoliatedServices.Matdesc = oServices.Matdesc;
				oConsoliatedServices.Amount = 0;
				oConsoliatedServices.Buildings = [];
				aServicesCopy.map(function (oServicesCopy) {
					if ((oServicesCopy.MatlGroup) === oConsoliatedServices.MatlGroup && oServicesCopy.Txt === oConsoliatedServices.Txt && oServicesCopy.Eancat != "C" && oServicesCopy.Eancat != "U") {
						found = true;
						var buildingExists = false;

						oConsoliatedServices.Amount = parseFloat(oConsoliatedServices.Amount) + parseFloat(oServicesCopy.Amount);
						//	oConsoliatedServices.Amount += parseFloat(oServicesCopy.Qty * oServicesCopy.PriceUnit);
						//oConsoliatedServices.Amount += parseFloat(oServicesCopy.Amount);
						oServicesCopy.ContractualIndicator = oConsoliatedServices.ContractualIndicatorr;
						oServicesCopy.MatlGroup = oConsoliatedServices.MatlGroupr;
						oServicesCopy.Txt = oConsoliatedServices.Txtr;
						oConsoliatedServices.Buildings.map(function (oBuilding) {
							if (oBuilding === oServicesCopy.Buildingno) {
								buildingExists = true;
							}
						});

						if (!buildingExists) {
							oConsoliatedServices.Buildings.push(oServicesCopy.Buildingno);
						}
					}
				});
				if (found) {
					//oConsoliatedServices.Buildingno = oConsoliatedServices.Buildings.length;
					oConsoliatedServices.Buildingnum = oConsoliatedServices.Buildings.length;


					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					// filter the assigned consolidation
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.MatlGroup !== oConsoliatedServices.MatlGroupr && oValue.Txt !== oConsoliatedServices.Txtr);
					});
				}
				// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}

			});
			dataModel.setProperty("/ServiceGroupSet", aConsoliatedServices);

		},
		onCancelFilter: function () {
			this._filterDialog.close();
			this._filterDialog.destroy();
			this._filterDialog = null;
		},




		/*	onDisplaySearchVendorDialog: function () {
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
		},*/
		ContractValueHeader: function () {
			var
				that = this,
				dataModel = this.getModel("localJson"),
				EstimatedContractValue = "0.00",//dataModel.getProperty("/EstimatedContractValue") ,
				OriginalContractValue = "0.00",//dataModel.getProperty("/OriginalContractValue"),
				VariationOrderValue = "0.00",// dataModel.getProperty("/VariationOrderValue"),
				AddendumValue = "0.00",//dataModel.getProperty("/AddendumValue"),
				TotalContractValue = "0.00",// dataModel.getProperty("/TotalContractValue"),
				AddValues = "0.00",
				OmissionValues = "0.00",
				ChangeAmount = "0.00",
				myBuildingSet = dataModel.getProperty("/myBuildingSet"),
				myWBSSet = dataModel.getProperty("/myWBSSet"),
				BuildingNO = "0.00",
				WbslistNo = "0.00",
				ServicNOCount = "0.00",
				consolidate = JSON.parse(JSON.stringify(this.getModel("localJson").getProperty("/BoqConsulidatedItemSet"))),
				consolidateEstimated = JSON.parse(JSON.stringify(this.getModel("localJson").getProperty("/EstimatedContracts"))),
				HeadToHeadVariation = JSON.parse(JSON.stringify(that.getModel("localJson").getProperty("/HeadToHeadVariation")));
			$.each(myWBSSet, function (w, wbs) {
				WbslistNo = parseFloat(WbslistNo) + 1;
			})
			$.each(myBuildingSet, function (B, bui) {
				BuildingNO = parseFloat(BuildingNO) + 1;
			})
			$.each(consolidate, function (v, vv) {
				ServicNOCount = parseFloat(ServicNOCount) + 1;
			})
			$.each(consolidate, function (c, con) {

				if (con.ContractualIndicator === "O" && con.Eancat !== "C" && con.Eancat !== "U") {
					OriginalContractValue = (parseFloat(OriginalContractValue) + parseFloat(con.Amount)).toString();
				}
				else if (con.ContractualIndicator === "V" && con.Eancat !== "C" && con.Eancat !== "U") {
					VariationOrderValue = (parseFloat(VariationOrderValue) + parseFloat(con.Amount)).toString();
				}
				else if (con.ContractualIndicator === "A" && con.Eancat !== "C" && con.Eancat !== "U") {
					AddendumValue = (parseFloat(AddendumValue) + parseFloat(con.Amount)).toString();
				}

				$.each(HeadToHeadVariation, function (v, vari) {



					if (vari.Status === "C" && con.Txt === (vari.OrderType + "-" + vari.UserOrder).toString()) {//asker
						if (con.Eancat !== "C" && con.Eancat !== "U" && con.Qty >= 0) {
							AddValues = parseFloat(AddValues) + parseFloat(con.Amount);
						}
						if (con.Eancat !== "C" && con.Eancat !== "U" && con.Qty < 0) {
							OmissionValues = parseFloat(OmissionValues) + parseFloat(con.Amount)


						}
					}

				})

			});

			$.each(consolidateEstimated, function (e, est) {
				if (est.DelInd !== "X") {
					EstimatedContractValue = parseFloat(EstimatedContractValue) + parseFloat(est.Amount);
				}
			});
			//calcoulat 
			var indx = "";
			ChangeAmount = parseFloat(AddValues) + parseFloat(OmissionValues);

			$.each(HeadToHeadVariation, function (v, Data) {
				if (Data.Status === "C") {
					Data.AddValues = AddValues.toString();
					Data.OmissionValues = OmissionValues.toString();
					Data.ChangeAmount = ChangeAmount.toString();
					Data.ChangeInd = "X";
					//Data.OrderDate=  that.formatDate(Data.OrderDate);
					indx = v;
					that.getModel("localJson").setProperty("/HeadToHeadVariation/" + v, Data);
				}
			})
			/*	var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd"
			});
			 RelDate = oDateFormat.format(new Date()),
			 
			 if (oPCReleasedRetention.RelDate === "") {
				oPCReleasedRetention.RelDate = null;
			} else {
				oPCReleasedRetention.RelDate = oDateFormat.format(new Date(oPCReleasedRetention.RelDate)) +
					"T00:00:00";
			}*/

			TotalContractValue = (parseFloat(OriginalContractValue) + parseFloat(VariationOrderValue) + parseFloat(AddendumValue)).toString();
			this.getView().getModel("localJson").setProperty("/EstimatedContractValue", parseFloat(EstimatedContractValue).toFixed(this.CustomCurrency));
			this.getView().getModel("localJson").setProperty("/OriginalContractValue", parseFloat(OriginalContractValue).toFixed(this.CustomCurrency));
			this.getView().getModel("localJson").setProperty("/VariationOrderValue", parseFloat(VariationOrderValue).toFixed(this.CustomCurrency));
			this.getView().getModel("localJson").setProperty("/AddendumValue", parseFloat(AddendumValue).toFixed(this.CustomCurrency));
			this.getView().getModel("localJson").setProperty("/TotalContractValue", parseFloat(TotalContractValue).toFixed(this.CustomCurrency));
			dataModel.setProperty("/WbslistNo", WbslistNo);
			dataModel.setProperty("/BuildingNO", BuildingNO);
			dataModel.setProperty("/ServicNOCount", ServicNOCount);
			dataModel.refresh();
			that.getView().setBusy(false);
			//this.getView().getModel("localJson").setProperty("/HeadToHeadVariation"+indx,vari);

		},
		ContractValueHeaderCreate: function () {

			var
				dataModel = this.getModel("localJson"),
				EstimatedContractValue = "0.00",//dataModel.getProperty("/EstimatedContractValue") ,
				OriginalContractValue = "0.00",//dataModel.getProperty("/OriginalContractValue"),
				VariationOrderValue = "0.00",//dataModel.getProperty("/VariationOrderValue"),
				AddendumValue = "0.00",//dataModel.getProperty("/AddendumValue"),
				TotalContractValue = "0.00",// dataModel.getProperty("/TotalContractValue"),
				consolidate = JSON.parse(JSON.stringify(this.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet"))),
				consolidateEstimated = JSON.parse(JSON.stringify(this.getView().getModel("localJson").getProperty("/EstimatedContracts")));
			$.each(consolidate, function (c, con) {
				if (con.ContractualIndicator === "O" && con.Eancat !== "C" && con.Eancat !== "U" && con.DelInd !== "Y") {
					OriginalContractValue = (parseFloat(OriginalContractValue) + parseFloat(con.Amount)).toString();
				}
				else if (con.ContractualIndicator === "V" && con.Eancat !== "C" && con.Eancat !== "U" && con.DelInd !== "Y") {
					VariationOrderValue = (parseFloat(VariationOrderValue) + parseFloat(con.Amount)).toString();
				}
				else if (con.ContractualIndicator === "A" && con.Eancat !== "C" && con.Eancat !== "U" && con.DelInd !== "Y") {
					AddendumValue = (parseFloat(AddendumValue) + parseFloat(con.Amount)).toString();
				}
			});
			$.each(consolidateEstimated, function (e, est) {
				EstimatedContractValue = (parseFloat(EstimatedContractValue) + parseFloat(est.Amount)).toString();
			});
			TotalContractValue = (parseFloat(OriginalContractValue) + parseFloat(VariationOrderValue) + parseFloat(AddendumValue)).toString();
			this.getView().getModel("localJson").setProperty("/EstimatedContractValue", EstimatedContractValue);
			this.getView().getModel("localJson").setProperty("/OriginalContractValue", OriginalContractValue);
			this.getView().getModel("localJson").setProperty("/TotalContractValue", TotalContractValue);

		},//Eancat

		/////////////////////////// open add wbs dialog
		onAddWBSB: function () {

			var that = this;
			if (that.sProjectCode !== "" && that.sCoCode !== "") {
				if (!that._oWBS2Dialog) {
					that._oWBS2Dialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SelectMultiWBS", that);
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties"
					});
					that._oWBS2Dialog.setModel(i18nModel, "i18n");
					that._oWBS2Dialog.setModel(that.getView().getModel());
				}

				that._oWBS2Dialog.open();
				var mModel = that.getView().getModel();

				var oModelJson = new sap.ui.model.json.JSONModel();
				oModelJson.setData({
					"WBSSet": [], "BuildingSetfilter": []
				});
				that._oWBS2Dialog.setModel(oModelJson, "localJson");

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
						that._oWBS2Dialog.getModel("localJson").setProperty("/WBSSet", data);
						//that._oBuildingValueHelpDialog.getModel("localJson").push("/BuildingSetfilter", data)
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
		changestatus: function (data) {

			var that = this;
			var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
			var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			//dataModel.refresh(true);
			$.each(consolidate, function (c, cons) {
				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						$.each(sub.Categories, function (l, cat) {
							$.each(cat.Categories, function (k, srv) {
								if (cons.Txt === srv.Txt && data.Txt === srv.Txt) {
									var go = false;
									$.each(selectedBuilding, function (s, selected) {
										if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Boq) {
											go = true;
											if (selected.SrvStatus === "UA") {
												selected.SrvStatus = "A";
											} else if (selected.SrvStatus === "UD") {
												selected.SrvStatus = "D";
											}
										}
									});
									if (go) {
										if (BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus === "UA") {
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus = "A"
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].ChangeIndicator = "ChangeP";

										}

										else if (BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus === "UD") {
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus = "D"
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].ChangeIndicator = "ChangeP";
											//.SrvStatus == "D";
										}
										//BoqItemSet[i].PriceUnit = (parseFloat(BoqItemSet[i].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString();
										//BoqItemSet[i].Categories[j].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString();
										//BoqItemSet[i].Categories[j].Categories[l].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].Categories[l].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString();
									}
								}
							});

						});
					});

				});
			});
			that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
			that.getView().getModel("localJson").setProperty("/myBuildingSet", JSON.parse(JSON.stringify(selectedBuilding)));

		},

		deletesrv: function (data) {
			var that = this;
			this.deleteVariation(data);
			//	var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
			var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			var AddValues = "0.00",
				OmissionValues = "0.00",
				ChangeAmount = "0.00",
				coundBuilding = false;
			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");

			var myBuildingSet = this.getView().getModel("localJson").getProperty("/myBuildingSet");
			var myWBSSet = this.getView().getModel("localJson").getProperty("/myWBSSet");
			var selectedBuilding = [];
			$.each(myBuildingSet, function (i, building) {
				selectedBuilding.push(building);
			})
			$.each(myWBSSet, function (i, WB) {
				selectedBuilding.push(WB);
			})
			$.each(selectedBuilding, function (s, SB) {
				if (SB.Group === data.Group && data.Model === SB.Model && SB.DelInd !== "Y" && SB.AsBuild2 === "") {
					coundBuilding = true
				}
			})
			$.each(consolidate, function (c, cons) {
				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						var count = 0;
						$.each(boq.Categories, function (c, ccons) {
							if (ccons.DelInd !== "Y") {
								count = count + 1;
							}
						})

						if (count === 1 && sub.Data === data.Group && ((sub.Model).length === 8 ? sub.Model : "00000" + sub.Model) === data.Boq && !coundBuilding) {
							BoqItemSet[i].DelInd = "Y";
						}
						$.each(sub.Categories, function (l, cat) {
							$.each(cat.Categories, function (k, srv) {
								if (cons.Data === srv.Data && cons.Txt === srv.Txt) {
									var go = false;
									$.each(selectedBuilding, function (s, selected) {
										if (sub.Data === data.Group && selected.Model === data.Model && selected.AsBuild2 === "") {
											if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model && srv.Model === ((data.Model).length === 8 ? data.Model : "00000" + data.Model)) {
												go = true;
											}
										}
									});
									if (go) {
										//if(BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus === "UA"){
										if (!coundBuilding) {
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].DelInd = "Y";
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus = "D";

											BoqItemSet[i].Categories[j].DelInd = "Y";
											BoqItemSet[i].Categories[j].Categories[l].DelInd = "Y";	//}
										}
										srv.Group = data.Group;
										srv.Buildingno = data.BuildingNo;
										srv.SubModel = data.SubBoq;
										that.deleteserviceFromConsolidate(srv);
										//}
									}
								}
							});

						});
					});

				});
			});
			ChangeAmount = parseFloat(AddValues) + parseFloat(OmissionValues);
			$.each(HeadToHeadVariation, function (v, vari) {
				if (vari.Status === "C") {
					vari.AddValues = parseFloat(vari.AddValues) - parseFloat(AddValues);
					vari.OmissionValues = parseFloat(vari.OmissionValues) - parseFloat(OmissionValues);
					vari.ChangeAmount = parseFloat(vari.ChangeAmount) - parseFloat(ChangeAmount);
					vari.ChangeInd = "X";
					that.getModel("localJson").setProperty("/HeadToHeadVariation" + v, vari);
				}
			})

			//	this.getView().getModel("localJson").setProperty("/myBuildingSet",myBuildingSet);
			//	this.getView().getModel("localJson").setProperty("/myWBSSet",myWBSSet);
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("DelInd", sap.ui.model.FilterOperator.NE, 'Y'));
			that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
			that.getView().getModel("localJson").refresh();
			/*that.byId('TreeTableBasic').bindRows({
				path: "localJson>/BoqItemSet",
				filters: aFilters,
				parameters: {
					arrayNames: 'Categories'
				}
			});*/
			that.byId('TreeTableBasic').getBinding("rows").filter(new Filter("DelInd", FilterOperator.NE, 'Y'));
			that.getView().getModel("localJson").refresh();
			//that.byId('IdWBSTable').getBinding("rows").filter(aFilters);
			//this.byId('IdBuildingTable').getBinding("items").filter(aFilters)
			that.byId('IdBuildingTable').getBinding("rows").filter(new Filter("DelInd", FilterOperator.NE, 'Y'));
			that.byId('IdWBSTable').getBinding("rows").filter(new Filter("DelInd", FilterOperator.NE, 'Y'));
			var consolidatearr = [];
			var consolidate = JSON.parse(JSON.stringify(this.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding");
			$.each(consolidate, function (c, cons) {
				if (cons.condelete !== "DD" /*cons.Qty !== 0 && cons.SubBoq  !== data.Group && cons.Boq !== data.Boq*/) {
					consolidatearr.push(cons);
				}
			})

			this.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(consolidatearr.sort((a, b) => a.Data - b.Data))));
			this.BoqItemSetCalculate();


		},
		deletesrvv: function (data) {

			var that = this;
			//	var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
			var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			var AddValues = "0.00",
				OmissionValues = "0.00",
				ChangeAmount = "0.00";
			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");

			var myBuildingSet = this.getView().getModel("localJson").getProperty("/myBuildingSet");
			var myWBSSet = this.getView().getModel("localJson").getProperty("/myWBSSet");
			var selectedBuilding = [];
			$.each(myBuildingSet, function (i, building) {
				selectedBuilding.push(building);
			})
			$.each(myWBSSet, function (i, WB) {
				selectedBuilding.push(WB);
			})

			$.each(consolidate, function (c, cons) {
				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						var count = 0;
						$.each(boq.Categories, function (c, ccons) {
							if (ccons.DelInd !== "Y" /*&& sub.Name  ===  data.Group &&sub.Boq  ===  data.Boq*/) {
								count = count + 1;
							}
						})
						if (count === 1 && sub.Name === data.Group && sub.Boq === data.Boq) {
							BoqItemSet[i].DelInd = "Y";
						}
						$.each(sub.Categories, function (l, cat) {
							$.each(cat.Categories, function (k, srv) {
								if (cons.Serviceno === srv.Serviceno && cons.Txt === srv.Txt && srv.SrvStatus === "UA") {
									var go = false;
									$.each(selectedBuilding, function (s, selected) {
										if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Boq && sub.Name === data.Group && ((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) /*sub.Boq*/ === data.Boq) {
											go = true;

										}
									});
									if (go) {
										if (BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus === "UA") {
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].DelInd = "Y";
											//BoqItemSet[i].Categories[j].Categories[l].Categories[k].ChangeIndicator="ChangeP";
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus = "D";

											//if(data.Group === BoqItemSet[i].Categories[j].Name && sub.Boq  ===  data.Boq ){
											BoqItemSet[i].Categories[j].DelInd = "Y";
											BoqItemSet[i].Categories[j].Categories[l].DelInd = "Y";	//}

											/*$.each(HeadToHeadVariation, function (v,vari) {
												if(vari.Status === "C"  && srv.Txt ===  (vari.OrderType+"-"+vari.UserOrder).toString() ){//asker
													if(srv.EanCat !== "C" && srv.EanCat !== "U" && srv.Qty >= 0  ){
														 AddValues=  parseFloat(AddValues) +  parseFloat(srv.PriceUnit);
													}
													if(srv.EanCat !== "C" && srv.EanCat !== "U"&& srv.Qty < 0){
														 OmissionValues=  parseFloat(OmissionValues) + parseFloat(srv.PriceUnit) 
														
													}	
												}
	
											})*/

											that.deleteserviceFromConsolidate(srv);
										}
									}
								}
							});

						});
					});

				});
			});
			ChangeAmount = parseFloat(AddValues) + parseFloat(OmissionValues);
			$.each(HeadToHeadVariation, function (v, vari) {
				if (vari.Status === "C") {
					vari.AddValues = parseFloat(vari.AddValues) - parseFloat(AddValues);
					vari.OmissionValues = parseFloat(vari.OmissionValues) - parseFloat(OmissionValues);
					vari.ChangeAmount = parseFloat(vari.ChangeAmount) - parseFloat(ChangeAmount);
					vari.ChangeInd = "X";
					that.getModel("localJson").setProperty("/HeadToHeadVariation" + v, vari);
				}
			})

			this.getView().getModel("localJson").setProperty("/myBuildingSet", myBuildingSet);
			this.getView().getModel("localJson").setProperty("/myWBSSet", myWBSSet);
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("DelInd", sap.ui.model.FilterOperator.NE, 'Y'))

			that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
			//that.getView().getModel("localJson").setProperty("/myBuildingSet", JSON.parse(JSON.stringify(selectedBuilding)));
			that.getView().getModel("localJson").refresh();
			//	that.byId('TreeTableBasic').getBinding("rows").filter(new Filter("Name", sap.ui.model.FilterOperator.EQ,"00000008"));

			that.byId('TreeTableBasic').bindRows({
				path: "localJson>/BoqItemSet",
				filters: aFilters,
				parameters: {
					arrayNames: 'Categories'
				}
			});
			that.getView().getModel("localJson").refresh();
			this.byId('IdBuildingTable').getBinding("items").filter(aFilters)
			this.byId('IdWBSTable').getBinding("items").filter(aFilters)
			var consolidatearr = [];
			var consolidate = JSON.parse(JSON.stringify(this.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));

			$.each(consolidate, function (c, cons) {
				if (cons.Qty !== 0) {
					consolidatearr.push(cons)
				}
			})
			this.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(consolidatearr.sort((a, b) => a.Data - b.Data))));
			this.BoqItemSetCalculate();

		},
		deleteVariation: function (data) {

			var that = this;
			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation"),
				variationBuilding = that.getView().getModel("localJson").getProperty("/variationBuilding"),
				//variationBuildingar =[],
				found = false,
				dataModel = that.getModel("localJson");
			//	variationBuildingar.push(variationBuilding);
			$.each(HeadToHeadVariation, function (v, vari) {
				if (vari.Status === "C") {
					$.each(vari.OrderItemsSet, function (v, varD) {
						if (varD.Boq === data.Group && varD.BuildingNo === data.BuildingNo &&
							((varD.Model).length === 8 ? varD.Model : "00000" + varD.Model) === ((data.Boq).length === 8 ? data.Boq : "00000" + data.Boq)) {
							varD.DeleteInd = "Y";
							varD.Group = varD.Boq;
							variationBuilding.push(varD);

						}
					})
				}
			});
			that.getView().getModel("localJson").setProperty("/variationBuilding", variationBuilding)
			//OrderItemsSet
			//var oVariationOrder = that.getModel("localJson").getProperty("/oVariationOrder");

			//oVariationOrder
		},
		deleteserviceFromConsolidate: function (dataService) {

			var consolidatearr = [];
			var consolidate = JSON.parse(JSON.stringify(this.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			dataService = dataService;
			$.each(consolidate, function (c, cons) {
				if (dataService.Txt === cons.Txt && dataService.Data === cons.Data) {
					cons.Qty = parseFloat(cons.Qty) - parseFloat(dataService.Qty);
					cons.Amount = parseFloat(cons.Qty) * parseFloat(cons.PriceUnit);
					var cound = 0;
					$.each(cons.ModelBoq, function (c, MB) {
						if (dataService.Buildingno === MB.Buildingno && dataService.Model === MB.Model && dataService.SubModel === MB.SubModel && MB.delind !== "X") {
							cons.ModelBoq[c].delind = "X"
						}
					})
					$.each(cons.ModelBoq, function (c, MB) {
						if (MB.delind !== "X") {
							cound++;
						}
					})

					if (/*dataService.Boq === cons.Boq && dataService.Group === cons.SubBoq &&*/ cound === 0 && cons.Qty === 0) {
						cons.condelete = "DD";
					}

				}
			})

			this.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(consolidate.sort((a, b) => a.Data - b.Data))));
			this.ContractValueHeader();
		},
		deleteBOQliseConsolidate: function (dataBuilding) {
			;
			var BoqItemSet = JSON.parse(JSON.stringify(this.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var myBuildingSet = this.getView().getModel("localJson").getProperty("/myBuildingSet");
			var myWBSSet = this.getView().getModel("localJson").getProperty("/myWBSSet");
			var coundBuilding = false;
			var selectedBuilding = [];
			var A = "";
			var B = "", BB = "";
			$.each(myBuildingSet, function (i, building) {
				selectedBuilding.push(building);
			})
			$.each(myWBSSet, function (i, WB) {
				selectedBuilding.push(WB);
			})
			$.each(selectedBuilding, function (s, SB) {
				if (/* SB.BuildingNo === dataBuilding.BuildingNo && */SB.Group === dataBuilding.Group && dataBuilding.Model === SB.Model && SB.DelInd !== "Y") {
					coundBuilding = true
				}
			})
			$.each(BoqItemSet, function (i, boq) {
				$.each(boq.Categories, function (j, sub) {
					var count = 0;
					var con = false;
					if (!coundBuilding && boq.AddNew === "AN" && sub.Data === dataBuilding.Group && sub.Model === ((dataBuilding.Model).length === 8 ? dataBuilding.Model : "00000" + dataBuilding.Model) && sub.Data === dataBuilding.Group) {
						//BoqItemSet.splice(i, 1);
						//boq.Categories.splice(j, 1);
						BB = j;
						B = i;
					}
					if (!coundBuilding && sub.DelInd !== "Y" /*&& sub.Name  ===  data.Group &&sub.Boq  ===  data.Boq*/) {
						count = count + 1;
						if (count === 1) { con = false }
						if (count === 2) { con = true }
					}
					if (!coundBuilding && boq.Categories.length === 1 && sub.DelInd === "Y" /* con === true && count === 0*/ && boq.AddNew === "AN") {
						//BoqItemSet.splice(i, 1);
						A = i;
					}


				})
			})
			if (B !== "" && BB !== "") {
				BoqItemSet[B].Categories.splice(BB, 1);
			}
			if (A !== "") {
				BoqItemSet.splice(A, 1)
			}


			this.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
		},
		BoqItemSetCalculate: function () {

			var that = this,
				ServicNOCount = "0.00",
				WbslistNo = "0.00",
				BuildingNO = "0.00";
			var dataModel = this.getView().getModel("localJson");
			var BoqItemSet = JSON.parse(JSON.stringify(that.getModel("localJson").getProperty("/BoqItemSet")));
			var myBuildingSet = this.getView().getModel("localJson").getProperty("/myBuildingSet");
			var myWBSSet = this.getView().getModel("localJson").getProperty("/myWBSSet");
			var selectedBuilding = [];
			$.each(myBuildingSet, function (i, building) {
				selectedBuilding.push(building);
			})
			$.each(myWBSSet, function (i, WB) {
				selectedBuilding.push(WB);
			})
			//	that.getView().setBusy(false);

			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
			/*	$.each(HeadToHeadVariation, function (v,vari) {
				 AddValues=vari.AddValues;
				OmissionValues = vari.OmissionValues;
				ChangeAmount= vari.ChangeAmount;
			})*/
			var consolidate = JSON.parse(JSON.stringify(that.getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			$.each(consolidate, function (c, cons) {
				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						$.each(sub.Categories, function (l, cat) {
							$.each(cat.Categories, function (k, srv) {
								/*var go = false;
								$.each(selectedBuilding, function (s, selected) {
									if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Boq) {
										go = true;
									}
								});
								if (go) {*/
								BoqItemSet[i].PriceUnit = "0";
								BoqItemSet[i].Categories[j].PriceUnit = "0";
								BoqItemSet[i].Categories[j].Categories[l].PriceUnit = "0";
								//	}

							});

						});
					});

				});
			});
			$.each(consolidate, function (c, cons) {
				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						$.each(sub.Categories, function (l, cat) {
							$.each(cat.Categories, function (k, srv) {
								if (cons.Data === srv.Data && cons.Txt === srv.Txt && srv.DelInd !== "Y") {
									/*	var go = false;
										$.each(selectedBuilding, function (s, selected) {
											if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model) {
												go = true;
											}
										});*/
									//	if (go) {
									BoqItemSet[i].Categories[j].Categories[l].Categories[k].PriceUnit = (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty));
									if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].PriceUnit = (parseFloat(BoqItemSet[i].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
									if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
									if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].Categories[l].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].Categories[l].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }

									//	}
								}
							});

						});
					});

				});
			});
			$.each(that.myWBSSet, function (i, bu) {
				$.each(selectedBuilding, function (s, selected) {
					if (selected.BuildingNo === "") {
						if (bu.Model === selected.Model) {
							that.myBuildingSet[i].ChangeIndicator = selected.ChangeIndicator;
						}
					}
				});
			});
			$.each(consolidate, function (c, cons) {
				cons.Amount = parseFloat(cons.PriceUnit) * parseFloat(cons.Qty);
			})
			$.each(consolidate, function (v, vv) {
				ServicNOCount = parseFloat(ServicNOCount) + 1;
			})
			$.each(myBuildingSet, function (B, bui) {
				if (bui.DelInd != "Y") {
					BuildingNO = parseFloat(BuildingNO) + 1;
				}
			})
			$.each(myWBSSet, function (w, wbs) {
				if (wbs.DelInd != "Y") {
					WbslistNo = parseFloat(WbslistNo) + 1;
				}
			})
			dataModel.setProperty("/BuildingNO", BuildingNO);
			dataModel.setProperty("/WbslistNo", WbslistNo);
			dataModel.setProperty("/ServicNOCount", ServicNOCount);
			that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
		},

		deletesrvA: function (data) {

			var that = this;
			var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
			var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			//dataModel.refresh(true);
			$.each(consolidate, function (c, cons) {
				$.each(BoqItemSet, function (i, boq) {
					$.each(boq.Categories, function (j, sub) {
						$.each(sub.Categories, function (l, cat) {
							$.each(cat.Categories, function (k, srv) {
								if (cons.Serviceno === srv.Serviceno && cons.Txt === srv.Txt && srv.SrvStatus === "A") {
									var go = false;
									$.each(selectedBuilding, function (s, selected) {
										if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Boq && srv.Boq === data.Boq) {
											go = true;
											if (selected.SrvStatus === "A") {
												selected.SrvStatus = "UD";
											}
										}
									});
									if (go) {

										if (BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus === "A") {
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].ChangeIndicator = "ChangeP";
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].SrvStatus = "UD";
											//BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty= "0";
										}
									}
								}
							});

						});
					});

				});
			});
			that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
			that.getView().getModel("localJson").setProperty("/myBuildingSet", JSON.parse(JSON.stringify(selectedBuilding)));
			that.getModel("localJson").refresh(true)
		},
		Consoliatedservicesall: function () {

			var that = this;


			var myBuildingSet = this.getView().getModel("localJson").getProperty("/myBuildingSet"),
				model = this.getModel("localJson");
			var myWBSSet = this.getView().getModel("localJson").getProperty("/myWBSSet");
			var selectedBuilding = [];
			$.each(myBuildingSet, function (i, building) {
				selectedBuilding.push(building);
			})
			$.each(myWBSSet, function (i, WB) {
				selectedBuilding.push(WB);
			})

			//var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
			var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			//dataModel.refresh(true);
			var list = [];
			$.each(BoqItemSet, function (i, boq) {
				$.each(boq.Categories, function (j, sub) {
					$.each(sub.Categories, function (l, cat) {
						$.each(cat.Categories, function (k, srv) {
							$.each(selectedBuilding, function (s, selected) {
								//if(list.length < 10000){
								if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model && selected.Group === sub.Data) {
									srv.ContractualIndicator = selected.ContractualIndicator;
									srv.Txt = selected.Txt;
									srv.MatlGroup = srv.Item;
									srv.Buildingno = selected.BuildingNo;
									srv.PriceUnit = srv.Price;
									srv.Amount = parseFloat(srv.Price) * parseFloat(srv.Qty);
									if (srv.ContractualIndicator === "O") { srv.sortNum = 1 }
									if (srv.ContractualIndicator === "V") { srv.sortNum = 2 }
									if (srv.ContractualIndicator === "A") { srv.sortNum = 3 }
									list.push(JSON.parse(JSON.stringify(srv)));
									//	}
								}
							});

						});

					});
				});

			});

			if (that.ViewCon === "V") {
				that.filterConsoliatedservices(list);
			}

			/*	$.each(list, function (c, cons) {
					cons.PriceUnit=cons.Price;
					cons.Amount= parseFloat(cons.Price) * parseFloat(cons.Qty);
					
				})*/
			//	that.Consoliatedserviceslist(list)
			//	that.getView().getModel("localJson").setProperty("/BuildingConsulidatedItemSetfilter", list);
			//	that.getView().getModel("localJson").setProperty("/BuildingConsulidatedItemSet", JSON.parse(JSON.stringify(list)));
			//	model.getData().BuildingConsulidatedItemSet=JSON.parse(JSON.stringify(list));
			if (that.ViewCon != "V") {
				if (that.ViewCon === "V2") {
					that.groupConsolidscreen2(JSON.parse(JSON.stringify(list)));
				}
				if (that.ViewCon === "V3") {
					that.groupConsolidscreen3(JSON.parse(JSON.stringify(list)));
				}
			}
			/*if(!this.getModel("localJso").getProperty("/ViewCon3")){
				that.groupConsolidscreen3(JSON.parse(JSON.stringify(aServices)));}
				else{ that.groupConsolidscreen2(aServices);}*/
			model.refresh();


		},

		filterConsoliatedservices: function (list) {

			var that = this,
				sContractualIndicator = this.byId("idFContractualIndicator").getSelectedKeys(),
				dataModelB = this.getModel("localJso"),
				itemModel = dataModelB.getProperty("/Buildingss"),
				aServices = [],
				ModelaServices = [],
				BuildingaServices = [],
				ctualIndicatoraServices = [],
				ModelCodeFilter = "00000" + that.ModelCodeFilter; //Boq

			if (!this.getModel("localJso").getProperty("/ViewCon3") || !this.getModel("localJso").getProperty("/ViewCon2")) {
				if (sContractualIndicator.length > 0) {
					sContractualIndicator.map(function (ctualIndicator) {
						$.each(list, function (is, ls) {
							if (ctualIndicator === ls.ContractualIndicator) {
								ctualIndicatoraServices.push(JSON.parse(JSON.stringify(ls)));
							}

						})
					});
				} else {
					$.each(list, function (is, ls) {
						ctualIndicatoraServices.push(JSON.parse(JSON.stringify(ls)));
					})
				}

				if (ModelCodeFilter !== "00000") {
					$.each(ctualIndicatoraServices, function (a, aser) {
						if (ModelCodeFilter === aser.Model) {
							ModelaServices.push(JSON.parse(JSON.stringify(aser)));
						}

					})

				} else {
					$.each(ctualIndicatoraServices, function (a, aser) {
						ModelaServices.push(JSON.parse(JSON.stringify(aser)));
					})
				}
				if (itemModel.length > 0) {
					itemModel.map(function (oBuilding) {
						$.each(ModelaServices, function (aB, aBser) {
							if (oBuilding.BuildingNo === aBser.Buildingno) {
								aServices.push(JSON.parse(JSON.stringify(aBser)));
							}

						})
					});
				} else {
					$.each(ModelaServices, function (aB, aBser) {
						aServices.push(JSON.parse(JSON.stringify(aBser)));
					})
				}
			}

			if (!this.getModel("localJso").getProperty("/ViewCon3")) {
				that.groupConsolidscreen3(JSON.parse(JSON.stringify(aServices)));
			}
			else { that.groupConsolidscreen2(aServices); }


		},

		Consoliatedservices: function () {

			var that = this;
			var myBuildingSet = this.getView().getModel("localJson").getProperty("/myBuildingSet");
			var myWBSSet = this.getView().getModel("localJson").getProperty("/myWBSSet");
			var selectedBuilding = [];
			$.each(myBuildingSet, function (i, building) {
				selectedBuilding.push(building);
			})
			$.each(myWBSSet, function (i, WB) {
				selectedBuilding.push(WB);
			})

			//var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
			var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			var AsbuildService = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/AsbuildService")));
			//dataModel.refresh(true);
			var list = [];
			$.each(BoqItemSet, function (i, boq) {
				$.each(boq.Categories, function (j, sub) {
					$.each(sub.Categories, function (l, cat) {
						$.each(cat.Categories, function (k, srv) {
							$.each(selectedBuilding, function (s, selected) {
								if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model && selected.Group === sub.Data && selected.AsBuild2 === "") {
									srv.ContractualIndicator = selected.ContractualIndicator;
									srv.Txt = selected.Txt;
									srv.DelInd = selected.DelInd;
									srv.SrvStatus = selected.SrvStatus;
									srv.BuildingNo = selected.BuildingNo;
									if (srv.ContractualIndicator === "O") { srv.sortNum = 1 }
									if (srv.ContractualIndicator === "V") { srv.sortNum = 2 }
									if (srv.ContractualIndicator === "A") { srv.sortNum = 3 }
									list.push(JSON.parse(JSON.stringify(srv)));

								}
							});

						});

					});
				});

			});

			$.each(AsbuildService, function (c, asbuild) {
				//asbuild.Txt=asbuild.SrvLongText;
				asbuild.Uom = asbuild.BaseUom;
				asbuild.BuildingNo = asbuild.Buildingno;
				asbuild.Price = asbuild.PriceUnit;
				asbuild.LongDesc = asbuild.SrvLongText;
				asbuild.Eancat = asbuild.ServiceType;
				asbuild.Data = asbuild.Serviceno;
				asbuild.SubModel = asbuild.SubBoq;

				list.push(JSON.parse(JSON.stringify(asbuild)));

			})

			$.each(list, function (c, cons) {
				cons.PriceUnit = cons.Price;
				cons.Amount = (parseFloat(cons.Price) * parseFloat(cons.Qty)).toFixed(that.CustomCurrency);

			})

			that.Consoliatedserviceslist(list.sort());
			that.getView().getModel("localJson").setProperty("/BuildingConsulidatedItemSetfilter", JSON.parse(JSON.stringify(list.sort((a, b) => a.Data - b.Data))));
			that.getView().getModel("localJson").setProperty("/BuildingConsulidatedItemSet", JSON.parse(JSON.stringify(list.sort((a, b) => a.Data - b.Data))));

			//that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
			//that.getView().getModel("localJson").setProperty("/myBuildingSet", JSON.parse(JSON.stringify(selectedBuilding)));

		},
		/*	Consoliatedserviceslist:function(aServices){
				
				var that = this;
				var oConsoliatedServices={},
				aServicesCopy = JSON.parse(JSON.stringify(aServices)),
				aConsoliatedServices=[],
				dataModel = this.getModel("localJson"),
				found = false;
				aServices.map(function(oServices) {
					found = false;
					oConsoliatedServices.ContractualIndicator=oServices.ContractualIndicator;
					oConsoliatedServices.Boq=oServices.Boq;
					oConsoliatedServices.Serviceno=oServices.Serviceno;
					//oConsoliatedServices.EanCat=oServices.EanCat;
					oConsoliatedServices.Servicedesc=oServices.Servicedesc;
					oConsoliatedServices.BaseUom=oServices.BaseUom;
					oConsoliatedServices.Qty=0;
					oConsoliatedServices.Txt = oServices.Txt;
					oConsoliatedServices.ServiceType=oServices.EanCat;
					oConsoliatedServices.PriceUnit=oServices.Price;
					oConsoliatedServices.ContractualIndicatorr=oServices.ContractualIndicator+"R"
					oConsoliatedServices.Servicenor=oServices.Serviceno+"R"
					oConsoliatedServices.Txtr = oServices.Txt+"R"
					oConsoliatedServices.MatlGroup = oServices.MatlGroup;
					oConsoliatedServices.Amount = 0;
					oConsoliatedServices.BuildingNo=oServices.BuildingNo;
					oConsoliatedServices.Buildings = [];
					aServicesCopy.map(function(oServicesCopy) {
						if((oServicesCopy.Serviceno ) === oConsoliatedServices.Serviceno && oServicesCopy.Txt === oConsoliatedServices.Txt&& oServicesCopy.ContractualIndicator === oConsoliatedServices.ContractualIndicator){
							found = true;
							var buildingExists = false;
						
							oConsoliatedServices.Amount += parseFloat(oServicesCopy.Amount);

							oConsoliatedServices.Qty += parseFloat(oServicesCopy.Qty);
							oServicesCopy.ContractualIndicator=oConsoliatedServices.ContractualIndicatorr;
							oServicesCopy.Serviceno=oConsoliatedServices.Servicenor;
							oServicesCopy.Txt=oConsoliatedServices.Txtr;
					
						}
				   });
				   if(found){
						aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
							// filter the assigned consolidation
							aServicesCopy = aServicesCopy.filter(function(oValue) {
								return (oValue.Serviceno !== oConsoliatedServices.Servicenor && oValue.Txt !== oConsoliatedServices.Txtr &&oValue.ContractualIndicator !== oConsoliatedServices.ContractualIndicatorr ) ;
							});}
						// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
				
				});
			//	dataModel.setProperty("/BoqConsulidatedItemSet", aConsoliatedServices);

				return aConsoliatedServices;
				//dataModel.setProperty("/BuildingConsulidatedItemSet", aConsoliatedServices);
				
		},*/



		Consoliatedserviceslist: function (aServices) {
			var that = this;
			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(aServices)),
				aConsoliatedServices = [],
				dataModel = this.getModel("localJson"),
				ServicNOCount = "0.00",
				found = false;

			aServices.map(function (oServices) {
				found = false;
				oConsoliatedServices.ContractualIndicator = oServices.ContractualIndicator;
				oConsoliatedServices.Model = oServices.Model       //Boq;
				oConsoliatedServices.Data = oServices.Data;
				oConsoliatedServices.AsBuild2 =oServices.AsBuild2;
				oConsoliatedServices.AsBuild  =oServices.AsBuild;
				//oConsoliatedServices.EanCat=oServices.EanCat;
				oConsoliatedServices.Servicedesc = oServices.Servicedesc;
				oConsoliatedServices.Uom = oServices.Uom//BaseUom;
				oConsoliatedServices.SrvStatus = oServices.SrvStatus;
				oConsoliatedServices.Qty = 0;
				oConsoliatedServices.sortNum = oServices.sortNum;
				oConsoliatedServices.Eancat = oServices.Eancat;
				oConsoliatedServices.PriceUnit = oServices.Price;
				oConsoliatedServices.LongDesc = oServices.LongDesc;

				oConsoliatedServices.Txt = oServices.Txt;
				oConsoliatedServices.SubModel = oServices.SubModel//SubBoq;
				oConsoliatedServices.ContractualIndicatorr = oServices.ContractualIndicator + "R"
				oConsoliatedServices.Datar = oServices.Data + "R"
				oConsoliatedServices.Txtr = oServices.Txt + "R"
				oConsoliatedServices.ShortDesc = oServices.ShortDesc//MatlGroup//MatlGroup;
				oConsoliatedServices.Amount = 0;
				oConsoliatedServices.BuildingNo = oServices.BuildingNo;
				oConsoliatedServices.Buildings = [];
				oConsoliatedServices.ModelBoq = [];

				aServicesCopy.map(function (oServicesCopy) {
					if ((oServicesCopy.Data) === oConsoliatedServices.Data && oServicesCopy.DelInd !== "Y" && oServicesCopy.Txt === oConsoliatedServices.Txt) {
						found = true;
						var modelExists = false;
						oConsoliatedServices.Amount += parseFloat(oServicesCopy.Amount);
						oConsoliatedServices.Qty += parseFloat(oServicesCopy.Qty);
						//oServicesCopy.ContractualIndicator=oConsoliatedServices.ContractualIndicatorr;
						oServicesCopy.Data = oConsoliatedServices.Datar;
						oServicesCopy.Txt = oConsoliatedServices.Txtr;

						oConsoliatedServices.Buildings.map(function (oBuilding) {
							if (oBuilding === oServicesCopy.Buildingno) {
								modelExists = true;
							}
						});

						if (!modelExists) {
							var ModelBoqobj = {
								"Model": oServicesCopy.Model, //Boq
								"SubModel": oServicesCopy.SubModel,// SubBoq
								"Buildingno": oServicesCopy.Buildingno === "" ? oServicesCopy.BuildingNo : oServicesCopy.BuildingNo,  //oServicesCopy.BuildingNo,// Buildingno 
							}

							oConsoliatedServices.ModelBoq.push(ModelBoqobj);
						}

					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					// filter the assigned consolidation
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Data !== oConsoliatedServices.Datar && oValue.Txt !== oConsoliatedServices.Txtr /*&&oValue.ContractualIndicator !== oConsoliatedServices.ContractualIndicatorr*/);
					});
				}
				// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}

			});
			$.each(aConsoliatedServices, function (c, cc) {
				ServicNOCount = parseFloat(ServicNOCount) + 1;
			})
			//return aConsoliatedServices;
			//dataModel.setProperty("/BuildingConsulidatedItemSet", aConsoliatedServices);
			dataModel.setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(aConsoliatedServices.sort((a, b) => a.Data - b.Data))));
			dataModel.setProperty("/ServicNOCount", ServicNOCount);

			//return aConsoliatedServices;
		},


		Consoliatedserviceslistobject: function (aServices) {

			var that = this;//SrvLongText
			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(aServices)),
				aConsoliatedServices = [],
				//ServicNOCount="0.00",LongText=  srvv.SrvLongText;
				dataModel = this.getModel("localJson"),
				found = false;
			aServices.map(function (oServices) {
				found = false;
				oConsoliatedServices.Acctasscat = oServices.Acctasscat;
				oConsoliatedServices.Amount = 0;
				oConsoliatedServices.AsBuild = oServices.AsBuild;
                oConsoliatedServices.AsBuild2 =oServices.AsBuild2;
				oConsoliatedServices.sortNum = oServices.sortNum;
				oConsoliatedServices.AsBuilt = oServices.AsBuilt;
				oConsoliatedServices.Uom = oServices.BaseUom;//*
				oConsoliatedServices.Boq = oServices.Boq;
				oConsoliatedServices.Buildingno = oServices.Buildingno;
				oConsoliatedServices.ContractualIndicator = oServices.ContractualIndicator;
				oConsoliatedServices.DeliveryDate = oServices.DeliveryDate;
				oConsoliatedServices.ItemCat = oServices.ItemCat;
				oConsoliatedServices.Matdesc = oServices.Matdesc;
				oConsoliatedServices.MatlGroup = oServices.MatlGroup;
				oConsoliatedServices.NoLimit = oServices.NoLimit;
				oConsoliatedServices.OvfTol = oServices.OvfTol;
				oConsoliatedServices.Plant = oServices.Plant;
				oConsoliatedServices.PoHeader = oServices.PoHeader;
				oConsoliatedServices.PoItem = oServices.PoItem;
				oConsoliatedServices.PriceUnit = oServices.PriceUnit;
				oConsoliatedServices.Project = oServices.Project;
				oConsoliatedServices.Qty = 0;

				oConsoliatedServices.LongDesc = oServices.SrvLongText;
				//for sort service hed
				oConsoliatedServices.sorttype = oServices.sorttype;
				oConsoliatedServices.Eancat = oServices.ServiceType;
				oConsoliatedServices.Servicedesc = oServices.Servicedesc;
				oConsoliatedServices.Data = oServices.Serviceno;
				oConsoliatedServices.ShortDesc = oServices.ShortText;//*
				oConsoliatedServices.SrvNo = oServices.SrvNo;
				oConsoliatedServices.SrvStatus = oServices.SrvStatus;
				oConsoliatedServices.SubBoq = oServices.SubBoq;
				oConsoliatedServices.Txt = oServices.Txt;
				oConsoliatedServices.VariationOrder = oServices.VariationOrder;
				oConsoliatedServices.ContractualIndicatorr = oServices.ContractualIndicator + "R"//
				oConsoliatedServices.Datar = oServices.Serviceno + "R";
				oConsoliatedServices.Txtr = oServices.Txt + "R";
				oConsoliatedServices.SubBoqr = oServices.SubBoq + "R";
				oConsoliatedServices.ProvisionRate = oServices.ProvisionRate;
				oConsoliatedServices.Buildings = [];
				oConsoliatedServices.ModelBoq = [];
				aServicesCopy.map(function (oServicesCopy) {
					if ((oServicesCopy.Serviceno) === oConsoliatedServices.Data && oServicesCopy.Txt === oConsoliatedServices.Txt/*oServicesCopy.ContractualIndicator === oConsoliatedServices.ContractualIndicator*/) {
						found = true;
						var modelExists = false;
						oConsoliatedServices.Qty += parseFloat(oServicesCopy.Qty);
						oServicesCopy.ContractualIndicator = oConsoliatedServices.ContractualIndicatorr;
						oServicesCopy.Serviceno = oConsoliatedServices.Datar;
						oServicesCopy.Txt = oConsoliatedServices.Txtr;
						//oServicesCopy.SubBoq = oConsoliatedServices.SubBoq;

						oConsoliatedServices.Buildings.map(function (oBuilding) {
							if (oBuilding === oServicesCopy.Buildingno) {
								modelExists = true;
							}
						});

						if (!modelExists) {
							var ModelBoqobj = {
								"Model": oServicesCopy.Boq,
								"SubModel": oServicesCopy.SubBoq,
								"Buildingno": oServicesCopy.Buildingno === "" ? oServicesCopy.Boq : oServicesCopy.Buildingno,//oServicesCopy.Buildingno,
							}

							oConsoliatedServices.ModelBoq.push(ModelBoqobj);
						}
					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					// filter the assigned consolidation
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Serviceno !== oConsoliatedServices.Datar && oValue.Txt !== oConsoliatedServices.Txtr/*oValue.ContractualIndicator !== oConsoliatedServices.ContractualIndicatorr */);
					});
				}
				// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
			});
			$.each(aConsoliatedServices, function (c, conser) {
				//	ServicNOCount = parseFloat(ServicNOCount)+1
				aConsoliatedServices[c].Amount = parseFloat(conser.Qty) * parseFloat(conser.PriceUnit);
			});
			return aConsoliatedServices;
		},
		ConsoliatedserviceslistCreate: function (aServices) {

			var that = this;
			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(aServices)),
				aConsoliatedServices = [],
				dataModel = this.getModel("localJson"),
				found = false;
			aServices.map(function (oServices) {
				found = false;
				oConsoliatedServices.ContractualIndicator = oServices.ContractualIndicator;//
				oConsoliatedServices.sortNum = oServices.sortNum; oConsoliatedServices.Model = oServices.Model//Boq;
				oConsoliatedServices.Data = oServices.Data//Serviceno;
				//oConsoliatedServices.EanCat=oServices.EanCat;
				oConsoliatedServices.ShortDesc = oServices.ShortDesc//Servicedesc;
				oConsoliatedServices.Uom = oServices.Uom//BaseUom;//Uom
				oConsoliatedServices.Qty = 0;//
				oConsoliatedServices.Eancat = oServices.Eancat;//
				oConsoliatedServices.Item = oServices.Item;
				oConsoliatedServices.ModelType = oServices.ModelType;
				oConsoliatedServices.PriceUnit = oServices.PriceUnit;//
				//oConsoliatedServices.ContractualIndicatorr=oServices.ContractualIndicator+"R"//
				oConsoliatedServices.Datar = oServices.Data + "R"//
				oConsoliatedServices.MatlGroup = oServices.MatlGroup;
				oConsoliatedServices.Txt = oServices.Txt;//
				oConsoliatedServices.Amount = 0;//\
				oConsoliatedServices.BuildingNo = oServices.BuildingNo;
				oConsoliatedServices.Buildings = [];
				oConsoliatedServices.ModelBoq = [];
				aServicesCopy.map(function (oServicesCopy) {
					if ((oServicesCopy.Data) === oConsoliatedServices.Data /*&& oServicesCopy.ContractualIndicator === oConsoliatedServices.ContractualIndicator*/) {
						found = true;
						var buildingExists = false;
						oConsoliatedServices.Qty += parseFloat(oServicesCopy.Qty);
						oServicesCopy.Data = oConsoliatedServices.Datar;
						oConsoliatedServices.Buildings.map(function (oBuilding) {
							if (oBuilding === oServicesCopy.Buildingno) {
								modelExists = true;
							}
						});

						if (!modelExists) {
							var ModelBoqobj = {
								"Model": oServicesCopy.Model, //Boq
								"SubModel": oServicesCopy.SubModel,// SubBoq
								"Buildingno": oServicesCopy.Buildingno === "" ? oServicesCopy.Model : oServicesCopy.BuildingNo,  //oServicesCopy.BuildingNo,// Buildingno 
							}
							oConsoliatedServices.ModelBoq.push(ModelBoqobj);
						}
					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					// filter the assigned consolidation
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.Data !== oConsoliatedServices.Datar);
					});
				}
				// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
			});
			$.each(aConsoliatedServices, function (c, conser) {
				aConsoliatedServices[c].Amount = parseFloat(conser.Qty) * parseFloat(conser.PriceUnit);
			});

			return aConsoliatedServices;
		},
		treeHandel: function (treeold, treenew) {

			var that = this;
			var oConsoliatedServices = {},
				aServicesCopy = JSON.parse(JSON.stringify(treeold)),
				aConsoliatedServices = [],
				dataModel = this.getModel("localJson"),
				found = false;
			treenew.map(function (oServices) {

				found = false;
				oConsoliatedServices.ContractualIndicator = oServices.ContractualIndicator;//
				oConsoliatedServices.sortNum = oServices.sortNum; oConsoliatedServices.Categories = oServices.Categories//Boq;
				oConsoliatedServices.Data = oServices.Data//Serviceno;
				oConsoliatedServices.Eancat = oServices.Eancat//Servicedesc;
				oConsoliatedServices.Item = oServices.Item//BaseUom;//Uom
				oConsoliatedServices.LevelId = oServices.LevelId;//
				oConsoliatedServices.LevelNo = oServices.LevelNo;//
				oConsoliatedServices.LongDesc = oServices.LongDesc;
				oConsoliatedServices.Model = oServices.Model;//
				oConsoliatedServices.Node = oServices.Node;//
				oConsoliatedServices.Parent = oServices.Parent;//
				oConsoliatedServices.Qty = oServices.Qty;//
				oConsoliatedServices.ShortDesc = oServices.ShortDesc;//
				oConsoliatedServices.SubModel = oServices.SubModel;//
				oConsoliatedServices.Uom = oServices.Uom;//
				oConsoliatedServices.LevelIdd = oServices.LevelId + "R"//
				oConsoliatedServices.Modell = oServices.Model + "R"//
				aServicesCopy.map(function (oServicesCopy) {
					if ((oServicesCopy.LevelId) === oConsoliatedServices.LevelId && oServicesCopy.Model === oConsoliatedServices.Model) {
						found = true;
						oServicesCopy.ContractualIndicator = oConsoliatedServices.Modell;
						oServicesCopy.LevelId = oConsoliatedServices.LevelIdd;
					}
				});
				if (found) {
					aConsoliatedServices.push(JSON.parse(JSON.stringify(oConsoliatedServices)));
					// filter the assigned consolidation
					aServicesCopy = aServicesCopy.filter(function (oValue) {
						return (oValue.LevelId !== oConsoliatedServices.LevelIdd && oValue.Model !== oConsoliatedServices.Modell);
					});
				}
				// clear object attributes
				for (var attribute in oConsoliatedServices) {
					delete oConsoliatedServices[attribute];
				}
			});

			return aConsoliatedServices;
		},

		handleAddAttachmentPress: function (oEvent) {
			var oController = this;
			if (oController._addAttachmentDialog) {
				oController._addAttachmentDialog.destroy();
				oController._addAttachmentDialog = null;
			}
			if (!oController._addAttachmentDialog) {
				oController._addAttachmentDialog = sap.ui.xmlfragment(oController.getView().getId(), "com.cicre.po.view.fragments.Attachment",
					oController);
				//oController._addAttachmentDialog.addStyleClass("sapUiSizeCompact");
				oController.getView().addDependent(oController._addAttachmentDialog);
			}
			oController._addAttachmentDialog.open();
		},
		onAddAttachment: function (oEvent) {
			var oController = this;
			var attachmentObject = {};
			var attachmentSet = oController.getModel("localJson").getProperty("/AttachmentSet");
			if (oController.byId("idRequestAttachment").data("details")) {
				attachmentObject = $.extend(attachmentObject, JSON.parse(oController.byId("idRequestAttachment").data("details")));
			}
			// if (oController.getModel("localJson").getProperty("/PoNumber")) {
			// 	attachmentObject.Flag = "A";
			// }
			attachmentSet.push(attachmentObject);
			oController.getModel("localJson").setProperty("/AttachmentSet", attachmentSet);
			oController._addAttachmentDialog.close();
		},
		onCancelAttachment: function (oEvent) {
			this._addAttachmentDialog.close();
		},

		handleUploadPress: function (oEvent) {
			var attachmentTypes = ["pdf", "jpg", "jpeg", "png", "txt", "xls", "xlsx", "xlsm", "xltx", "xltm", "doc", "docx"];
			var oController = this;
			var id = oEvent.getParameters().id;
			var oFileUploader = sap.ui.getCore().byId(id);
			oFileUploader.data("details", "");
			var periodIndex = oFileUploader.getValue().lastIndexOf(".");
			var filename = oFileUploader.getValue().substring(0, periodIndex);
			if (!oFileUploader.getValue()) {
				oController.handleErrorMessageBox(oController.getResourceBundle().getText("baseMSGNoAttachment"));
				return;
			}
			var file = jQuery.sap.domById(oFileUploader.getId() +
				"-fu").files[0];
			var type = file.type;
			// var fileType = file.type.split("/")[1];
			// var fileType = file.name.split(".")[file.name.split(".").length-1];
			var fileType = file.name.substring(periodIndex + 1, file.name.length);
			fileType = fileType.toLowerCase();
			if ($.inArray(fileType, attachmentTypes) > -1) {
				var BASE64_MARKER = 'data:' + file.type + ';base64,';
				var reader = new FileReader();
				reader.onload = (function (theFile) {
					return function (evt) {
						var base64Index = evt.target.result.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
						var base64 = evt.target.result.substring(base64Index);
						var attachment = {
							Value: base64,
							Extension: fileType,
							Filename: filename,
							Flag: 'A'
						};
						oFileUploader.data("details", JSON.stringify(attachment));
					};
				})(file);
				reader.readAsDataURL(file);
			} else {
				oFileUploader.data("details", null);
				oFileUploader.setValue("");
				oController.handleErrorMessageBox(oController.getResourceBundle().getText("baseMSGMismatchAttachmentType", [attachmentTypes.join(
					", ")]));
			}
		},
		onAttachmentDelete: function (oEvent) {
			var oController = this;
			var path = oEvent.getParameter("listItem").getBindingContext("localJson").getPath();
			MessageBox.confirm(oController.getResourceBundle().getText("baseMSGConfirmDelete"), {
				title: oController.getResourceBundle().getText("Confirm"),
				onClose: function (oAction) {
					if (oAction == sap.m.MessageBox.Action.OK) {
						var selectedSet = path.substring(0, path.lastIndexOf("/"));
						var index = parseInt(path.substring(path.lastIndexOf("/") + 1, path.length));
						var TempSet = oController.getModel("localJson").getProperty(selectedSet);
						if (TempSet[index].DocNo) {
							TempSet[index].Flag = "D";
						} else {
							TempSet.splice(index, 1);
						}
						oController.getModel("localJson").setProperty(selectedSet, TempSet);
					}
				}
			});

		},
		_onAttachmentItemPress: function (oEvent) {

			if (oEvent.getSource().getBindingContext("localJson").getObject().DocNo) {

				var object = oEvent.getSource().getBindingContext(
					"localJson").getObject();
				var url = this.getOwnerComponent().getModel().sServiceUrl + "/AttachmentReadSet(DocNo='" + object.DocNo + "',AttachmentId='" + object.AttachmentId +
					"')/$value";
				window.open(url, '_blank');
			}
		},


		/// ADD new filter wbs at 22-11-2021 


		onSearchWBSDialog: function () {

			if (!this._WBSDialog) {
				this._WBSDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.WBSSearchDialog", this);
				this._WBSDialog.setModel(this.getView().getModel());
			}
			this._WBSDialog.open();
			var oTemplate = new sap.m.StandardListItem({
				title: "{IdText}",
				description: "{SelectionParameter}"
			});
			var aFilters = [];
			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBSSEARCH");
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
			var oFilter5 = new sap.ui.model.Filter("SelectionParameter7", sap.ui.model.FilterOperator.Contains, this.WBSCodeGroup);

			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);
			if (this.WBSCodeGroup.length > 0) {
				aFilters.push(oFilter5);
			}

			this._WBSDialog.bindAggregation("items", {
				path: "/ValueHelpSet",
				template: oTemplate,
				filters: aFilters
			});
		},

		handleSearchWBS: function (oEvent) {

			var oTemplate = new sap.m.StandardListItem({
				title: "{IdText}",
				description: "{SelectionParameter}"
			});

			var sValue = oEvent.getParameter("value");
			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBSSEARCH");
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
			var oFilter4 = new sap.ui.model.Filter("SelectionParameter4", sap.ui.model.FilterOperator.Contains, sValue);
			var oFilter5 = new sap.ui.model.Filter("SelectionParameter7", sap.ui.model.FilterOperator.Contains, this.WBSCodeGroup);
			var aFilters = [];
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);
			aFilters.push(oFilter4);

			if (this.WBSCodeGroup.length > 0) {
				aFilters.push(oFilter5);
			}

			this._WBSDialog.bindAggregation("items", {
				path: "/ValueHelpSet",
				template: oTemplate,
				filters: aFilters
			});
		},
		onSelectWBSList: function (oEvent) {
			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					that.WBSCode = oContext.getObject().IdNumber;
					//that.getView().getModel("localJson").setProperty("/selectBoq", false);

					that.getView().byId("idSearchWBSDialog").setValue(oContext.getObject().IdText);
					//return oContext.getObject().Name;
				});
			} else {
				that.WBSCode = "";
				that.getView().byId("idSearchWBSDialog").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		/// ADD new filter wbs at 22-11-2021 


		onDisplaySearchWBSGroup: function () {

			if (!this._WBSGroupDialog) {
				this._WBSGroupDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.WBSGroupSearchDialog", this);
				this._WBSGroupDialog.setModel(this.getView().getModel());
			}
			this._WBSGroupDialog.open();
			var oTemplate = new sap.m.StandardListItem({
				title: "{SelectionParameter7}",
				description: "{IdNumber}"
			});
			var aFilters = [];
			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBSGROUP");
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);


			this._WBSGroupDialog.bindAggregation("items", {
				path: "/ValueHelpSet",
				template: oTemplate,
				filters: aFilters
			});
		},

		handleSearchWBSGroup: function (oEvent) {

			var oTemplate = new sap.m.StandardListItem({
				title: "{SelectionParameter7}",
				description: "{IdNumber}"
			});

			var sValue = oEvent.getParameter("value");
			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBSGROUP");
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("SelectionParameter3", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
			var oFilter4 = new sap.ui.model.Filter("SelectionParameter7", sap.ui.model.FilterOperator.Contains, sValue);
			var aFilters = [];
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);
			aFilters.push(oFilter4);

			this._WBSGroupDialog.bindAggregation("items", {
				path: "/ValueHelpSet",
				template: oTemplate,
				filters: aFilters
			});
		},
		onSelectWBSGroupList: function (oEvent) {
			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					that.getView().getModel("localJson").setProperty("/selectGroupBoq", false);
					that.WBSCodeGroup = oContext.getObject().IdNumber;
					//that.getView().getModel("localJson").setProperty("/selectBoq", false);

					that.getView().byId("idSearchWBSGroupDialog").setValue(oContext.getObject().SelectionParameter7);
					//return oContext.getObject().Name;
				});
			} else {
				that.WBSCodeGroup = "";
				that.getView().byId("idSearchWBSGroupDialog").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		cleanWBSDialog: function () {
			this.WBSCode = "";
			this.getView().byId("idSearchWBSDialog").setValue("");
		},
		cleanSearGroupWBS: function () {
			this.WBSCodeGroup = "";
			this.getView().getModel("localJson").setProperty("/selectGroupBoq", false);
			this.getView().byId("idSearchWBSGroupDialog").setValue("");
			this.cleanGroupBoqDialog();
			
		},
		// select Group BOQ
		onSearchGroupBoqDialog: function (oEvent) {

			if (!this._GroupBoqDialog) {
				this._GroupBoqDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.GroupBoqSearchDialog", this);
				this._GroupBoqDialog.setModel(this.getView().getModel());
			}
			this._GroupBoqDialog.open();
			this.sSubBoq2Id = oEvent.getParameters().id;
		//	var x = "00000925";
			var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, this.WBSCodeGroup);
			var oFilter2 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, this.sProjectCode);

			

			var oTemplate = new sap.m.StandardListItem({
				title: "{BoqSub}",
				description: "{BoqDesc}"
			});
			var aFilters = [];
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);
			this._GroupBoqDialog.bindAggregation("items", {
				path: "/BoqSubItemSet",
				template: oTemplate,
				filters: aFilters
			});
		},
		handleSearchSubGroupBoq: function (oEvent) {

			var oTemplate = new sap.m.StandardListItem({
				title: "{BoqSub}",
				description: "{BoqDesc}"
			});
			var sValue = oEvent.getParameter("value");
		
			var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, this.WBSCodeGroup);
		//	var oFilter2 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, x)
			var aFilters = [];
			aFilters.push(oFilter1);
			this._GroupBoqDialog.bindAggregation("items", {
				path: "/BoqSubItemSet",
				template: oTemplate,
				filters: aFilters
			});
		},
		onSelectSubGroupBoqList: function (oEvent) {
			var that = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			var WBSSet = this.getView().getModel("localJson").getProperty("/WBSSet");
			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					//Boqdesc = oContext.getObject().BoqDesc;
					that.sSubBoq = oContext.getObject().BoqSub;
					that.getView().byId("idSearchGroupBoqDialog").setValue(oContext.getObject().BoqDesc);
					$.each(WBSSet, function (w, WBS) {
						WBSSet[w].Group = oContext.getObject().BoqSub;
						WBSSet[w].BoqDesc = oContext.getObject().BoqDesc;
					})
					//	that.BuildD();
					that.getView().getModel("localJson").setProperty("/WBSSet", WBSSet);
				});
			} else {
				sap.m.MessageToast.show("No new item was selected.");
				that.getView().byId("idSearchGroupBoqDialog").setValue("");
			}
	
		},
		cleanGroupBoqDialog: function () {
			var WBSSet = this.getView().getModel("localJson").getProperty("/WBSSet");
			$.each(WBSSet, function (w, WBS) {
				WBSSet[w].Group = "";
				WBSSet[w].BoqDesc = "";
			})
			this.getView().getModel("localJson").setProperty("/WBSSet", WBSSet);
			this.getView().getModel("localJson").setProperty("/selectGroupBoq", false);
			this.getView().byId("idSearchGroupBoqDialog").setValue("");
		},
	});

});