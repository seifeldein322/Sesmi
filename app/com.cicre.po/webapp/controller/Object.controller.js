/*global location*/
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
sap.ui.define([
	"com/cicre/po/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"com/cicre/po/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/export/Spreadsheet"

], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator,Spreadsheet) {
	"use strict";

	return BaseController.extend("com.cicre.po.controller.Object", {

		formatter: formatter,

		PoNumber: "",
		PurchDoc: "",
		DocParNo: "",
		sCoCode: "",
		sCoText: "",
		sPONO: "",
		sVendor: "",
		sProj: "",
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
		myPurchaseRequisition:[],
		aContexts: [],
		sSubBoq: "",
		sSubBoqId: "",
		sSubBoq2: "",
		sSubBoq2Id: "",
		POHeaderToPOSrv: [],
		_oBuilding2Dialog: null,
		_oWBS2Dialog: null,
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
		SupeiorWBSText: "",
		GroupCode: "",
		ModelCode: "",
		Amount: "",
		Omission: "",
		sValueAction: "",
		sValueorderType: "",
		Composing: "",
		addVA: "0",
		addVAOld: "0",
		myBuildingSet: "",
		ModelCodeFilter: "",
		sProjj: "",
		ModelCodee: "",
		GroupCodee: "",
		Building: "",
		BoqDescR: "",
		variationBuildingVorA: [],
		GroupCodefilter: "",
		ModelCodefilter: "",
		ZoneCodefilter: "",
		BuildingCodefilter: "",
		ContractCode: "",
		HeadToHeadVariationG: [],
		ViewCon: "",
		SERTYPE: "",
		SERTYPEText: "",
		BoqAll: "",
		BoqDescAll: "",
		currentYear: "",
		years: [],

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {

			var Action = [{
				id: 'R',
				text: 'Released'
			},
			{
				id: 'C',
				text: 'Composing'
			}];

			var localJso = new sap.ui.model.json.JSONModel();
			localJso.setData({
				"variationOrderContract": [],
				"variationBuilding": [],
				"selectedBuildinglist": [],
				"VariationMode": true,
				"ViewCon1": false,
				"ViewCon2": true,
				"ViewCon4": false,
				"ViewCon3": true,
				"VReleasedMode": "",
				"Action": Action,
				"Buildings": [],
				"Buildingss": [],
			});
			this.getView().setModel(localJso, "localJso");

			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			// this.getOwnerComponent().getModel().requestMetadata().then(function () {
			// 	// Restore original busy indicator delay for the object view
			// 	oViewModel.setProperty("/delay", iOriginalBusyDelay);
			// });


		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function () {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */


		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {


			var mModel = this.getView().getModel();
			var that = this;
			that.getView().setBusy(true);
			if (oEvent)
				var sObjectId = oEvent.getParameter("arguments").objectId;
			else
				var sObjectId = that.PoNumber;
			that.PoNumber = sObjectId;
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

			var Action = [{
				id: 'C',
				text: 'Cancel'
			},
			{
				id: 'R',
				text: 'Released'
			}];

			var Status = [{
				id: 'R',
				text: 'Released'
			},
			{
				id: 'C',
				text: 'Composing'
			}];
			var CreationType = [{
				id: 'O',
				text: 'Original'
			},
			{
				id: 'E',
				text: 'Estimated'
			}
			];


			var STATUSBoqlist = [{
				id: 'A',
				text: 'Active'
			},
			{
				id: 'D',
				text: 'Deleted'
			},
			{
				id: 'UA',
				text: 'Under Processing-Active'
			},
			{
				id: 'UD',
				text: 'Under Processing-Deleted'
			}];

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

			var Action_TYPE = [{
				id: 'O',
				text: 'Original'
			},
			{
				id: 'V',
				text: 'Variation'
			},
			{
				id: 'A',
				text: 'Addendum'
			}];

			///CICSE/ASBUILD_SRV_STR

			mModel.bindContext("/ContractPOHeaderSet('" + sObjectId + "')", null, {
				"$expand": "POHeaderToBoqItem,ContractPONoteNav,POHeaderToPOItem,ContractPOSrvItemSet,AttachmentSet,POHeaderToPOGetbuildingNav,ReleaseerrorSet,PermissionNav,WFContractInboxNAV,POPurchaseRequisitionTreeNav"
			}).requestObject().then(function (oData) {

		
				oData.IndexMonths = that.years;//months;
				oData.VAction = Action;
				oData.VStatus = Status;
				oData.Currency = oData.Currency;
				oData.AuthInd = oData.PermissionNav.AuthInd;

				if (oData.Currency === "USD") {
					that.CustomCurrency = 2;
				} else {
					that.CustomCurrency = 2;
				}

				oData.STATUSBoqlist = STATUSBoqlist;
				oData.Service_TYPE = Service_TYPE;
				//oData.Action_TYPE = Action_TYPE;
				oData.Actiontype = 'O';
				oData.STATUSBoqlist = STATUSBoqlist;

				oData.selectedRefContracts = oData.RefContract.split(',');
				var BuildingNO = 0,
					WbslistNo = 0;
				var myBuildingSet = [],
					myWBSSet = [];
				var errormessage = oData.ReleaseerrorSet.results;

				var MessageSet = [];
				for (var i = 0; i < errormessage.length; i++) {
					var message = {
						type: "Error",
						title: errormessage[i].ErrItem + "-" + errormessage[i].ErrMsg2,
						description: errormessage[i].ErrMsg1
					};
					MessageSet.push(message);
				}

				oData.MessageSet = MessageSet;

				$.each(oData.POHeaderToPOGetbuildingNav.results, function (BW, BuW) {
					BuW.AsBuild = "";
					if (BuW.Project === "") {
						myWBSSet.push(BuW);
					} else {
						myBuildingSet.push(BuW);
					}
				})
				oData.myBuildingSet = myBuildingSet; //oData.POHeaderToPOGetbuildingNav.results ; 
				oData.myWBSSet = myWBSSet;
				$.each(oData.myBuildingSet, function (B, BuildingSet) {

					oData.myBuildingSet[B].DelInd = "";
					oData.myBuildingSet[B].ChangeIndicator = "";
					oData.myBuildingSet[B].Group = oData.myBuildingSet[B].SubBoq;

					BuildingNO = parseFloat(BuildingNO) + 1;
					if (oData.myBuildingSet[B].ContractualIndicator === "O") { oData.myBuildingSet[B].sortNum = 1 }
					if (oData.myBuildingSet[B].ContractualIndicator === "V") { oData.myBuildingSet[B].sortNum = 2 }
					if (oData.myBuildingSet[B].ContractualIndicator === "A") { oData.myBuildingSet[B].sortNum = 3 }
					$.each(that.HeadToHeadVariationG, function (j, V) {
						if (oData.myBuildingSet[B].Txt === V.OrderType + "-" + V.UserOrder) {
							oData.myBuildingSet[B].OrderNo = V.OrderNo;
							//oData.myBuildingSet[B].OrderNo = V.OrderNo 

						}

					})

				})

				if (oData.WFContractInboxNAV.results.length > 0) {
					var aInboxSet = oData.WFContractInboxNAV.results;
					var aWorkFlow = that.onprocessworkflowBuilding(aInboxSet);
					oData.lanes = aWorkFlow.lanes;
					oData.nodes = aWorkFlow.nodes;
				} else {
					oData.lanes = [];
					oData.nodes = [];
				}

				$.each(oData.myWBSSet, function (W, BuildingSet) {

					oData.myWBSSet[W].DelInd = "";
					oData.myWBSSet[W].ChangeIndicator = "";
					oData.myWBSSet[W].Group = oData.myWBSSet[W].SubBoq;
					oData.myWBSSet[W].Model = oData.myWBSSet[W].Boq;
					oData.myWBSSet[W].BuildingNo = oData.myWBSSet[W].BuildingNo;
					oData.myWBSSet[W].IdText = oData.myWBSSet[W].ModelDesc;
					oData.myWBSSet[W].WbsCode = oData.myWBSSet[W].Wbs;


					WbslistNo = parseFloat(WbslistNo) + 1;
					if (oData.myWBSSet[W].ContractualIndicator === "O") { oData.myWBSSet[W].sortNum = 1 }
					if (oData.myWBSSet[W].ContractualIndicator === "V") { oData.myWBSSet[W].sortNum = 2 }
					if (oData.myWBSSet[W].ContractualIndicator === "A") { oData.myWBSSet[W].sortNum = 3 }
					$.each(that.HeadToHeadVariationG, function (j, V) {
						if (oData.myWBSSet[W].Txt === V.OrderType + "-" + V.UserOrder) {
							oData.myWBSSet[W].OrderNo = V.OrderNo;
							//oData.myBuildingSet[B].OrderNo = V.OrderNo 

						}

					})

				})


				oData.WbslistNo = WbslistNo;
				oData.BuildingNO = BuildingNO;
				that.myBuildingSet = oData.myBuildingSet;
				that.myWBSSet = oData.myWBSSet;
				oData.HeadToHeadVariation = oData.HeadToHeadVariationNav.results;
				oData.variationBuilding = [];
				oData.selectedBuildingOrWBS = [];

				// oData.HeadToHeadVariation.map(function (oVariationOrder) {
				// 	oVariationOrder.OrderItemsSrvSet = [];
				// 	oVariationOrder.OrderItemsSet = oVariationOrder.OrderItemsSet.results;
				// 	$.each(oVariationOrder.OrderItemsSet, function (i, st) {
				// 		oVariationOrder.OrderItemsSet[i].Model = oVariationOrder.OrderItemsSet[i].Model.substring(5, 8);
				// 		oVariationOrder.OrderItemsSet[i].Boq = oVariationOrder.OrderItemsSet[i].Boq.substring(4, 8);
				// 		oVariationOrder.OrderItemsSet[i].DelInd = "";
				// 	});
				// });
				// $.each(oData.HeadToHeadVariation, function (i, HeadVar) {
				// 	that.HeadToHeadVariationG.push(HeadVar);
				// 	HeadVar.MonthIndex = HeadVar.MonthIndex.split(',')
				// 	HeadVar.ChangeInd = "";
				// })

				that.PurchDoc = oData.PurchDoc;
				//if( that.PurchDoc ==""){
				that.getView().getModel("localJso").setProperty("/VariationMode", false);
				//}

				//	that.getView().setBusy(true);
				that.sCoCode = oData.CompCode;
				that.sCoCode = oData.CompCode;
				that.ContractNo = oData.PoNumber;
				that.sProjectCode = oData.ProjetTemp;// "30000000000000000"; //oData.Project;
				that.sDocType = oData.DocType;
				that.sVendor = oData.Vendor;
				that.sVendorName = oData.VendorName;
				that.SupeiorWBSCode = oData.SuperiorWbs;
				oData.ReleaseedMode = false;
				that.sConsultant = oData.Consultant;
				that.sConsultantName = oData.ConsultantName;
				that.SERTYPE = oData.SerType

				that.sPOrg = oData.PurchOrg;
				that.sPGrp = oData.PurGroup;
				that.DocParNo = oData.DocParNo;
				oData.IndexMonth = oData.IndexMonth.split(',');
				if (oData.CreationType === "E" && oData.Status === "COMPOSING")
					oData.estimatedMode = true;
				else
					oData.estimatedMode = false;
				//var sCoText = "Arab Co. for Proj & Dev";
				//that.getView().byId("idCompCode").setValue(sCoText);
				that.getView().byId("idVendor").setValue(oData.VendorName);
				that.getView().byId("idConsultant").setValue(oData.ConsultantName);
				that.getView().byId("idserviceType").setValue(oData.SerTypeDesc);


				//	SERTYPEText:"",
				//that.getView().byId("SupeiorWBS").setValue(oData.WbsDesc);

				var inputs = [
					that.getView().byId("idCompCode"),
					that.getView().byId("idProject")
				];
				var property = [
					that.sCoCode,
					that.sProjectCode
				];
				$.each(inputs, function (index, value) {
					value.getBinding("items").attachEventOnce("dataReceived", function () {
						value.setSelectedKey(property[index]);
					}, this);
				});
				if (oData.CreationType === "E") {

					var EstimatedContracts = [];
					$.each(oData.ContractPOSrvItemSet.results, function (i, EstimatedSrv) {
						if (EstimatedSrv.SrvStatus !== "A") {
							oData.ReleaseedMode = true;
						}
						EstimatedSrv.DelInd = "";
						EstimatedSrv.ChangeIndicator = "";
						EstimatedContracts.push(EstimatedSrv);
					});
					oData.EstimatedContracts = EstimatedContracts;

					oData.AttachmentSet = oData.AttachmentSet.results;

					oData.editMode = false;
					oData.selectBoq = false;
					oData.selectGroupBoq = false;

					///

					oData.BuildingSet = [],
						oData.BoqModelSet = [];
					oData.BoqItemSet = [];
					oData.BoqMatGrpSet = [];
					oData.BoqConsulidatedItemSet = [];
					//oData.BuildingConsulidatedItemSet = [];
					//oData.copyBuildingConsulidatedItemSet = [];
					oData.BuildingConsulidatedItemSetfilter = [];
					oData.myBuildingSet = [];
					that.myBuildingSet = [];
					oData.AsbuildService = [];

					that.myWBSSet = [];
					oData.myWBSSet = [];
					oData.selectedBuilding = [];
					that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "localJson");
					//	that.getView().setBusy(true);
					that.getView().setBusy(false);
				}
				else {
					var POHeaderToBoqItem = oData.POHeaderToBoqItem.results;
					var POHeaderToPOItem = oData.POHeaderToPOItem.results;
					that.POHeaderToPOSrv = oData.ContractPOSrvItemSet.results;
					var EstimatedContracts = [];
					var or_V_A = [];
					var POHeaderToPOItemar = [];
					var OrderItemsSet = [];
					var OrderItemsSrvSet = [];
					var AsbuildService = [];
					var ContractPOSrvItemSet = JSON.parse(JSON.stringify(that.POHeaderToPOSrv));

					$.each(POHeaderToPOItem, function (i, srv) {


						if (srv.ContractualIndicator !== "E") {
							EstimatedContracts.push(srv);
						}
					});

					POHeaderToPOItem = EstimatedContracts;
					$.each(that.POHeaderToPOSrv, function (i, srv) {
						//if(srv.AsBuild === "X" && srv.AsBuild2 === "X"){
						if (srv.AsbuildVar !== "") {
							$.each(oData.HeadToHeadVariation, function (j, V) {
								if (V.OrderDesc === srv.AsbuildVar) {
									//OrderItemsSrvSet.push(srv);
									var csrv = JSON.parse(JSON.stringify(srv));
									csrv.Amount = JSON.parse(JSON.stringify(((parseFloat(csrv.Qty) * parseFloat(csrv.PriceUnit)) * -1).toFixed(that.CustomCurrency)));
									oData.HeadToHeadVariation[j].OrderItemsSrvSet.push(csrv);

								}
							})
						}
						/// internal model with asbuid service ...
						if (srv.AsBuild2 === "X" && srv.AsBuild === "X") {
							AsbuildService.push(srv);
						}
						srv.ChangeIndicator = "";
						if (srv.SrvStatus !== "A") {
							oData.ReleaseedMode = true;
						}
						if (srv.ContractualIndicator === "E") {
							srv.DelInd = "";
							POHeaderToPOItemar.push(srv);
						} else {

							if (srv.ServiceType === "") {
								srv.sorttype = 1;
							} else {
								srv.sorttype = 2;
							}
							if (srv.ContractualIndicator === "O") { srv.sortNum = 1 }
							if (srv.ContractualIndicator === "V") { srv.sortNum = 2 }
							if (srv.ContractualIndicator === "A") { srv.sortNum = 3 }
							srv.ProvisionRate = parseInt(srv.ProvisionRate);
							srv.Matdesc = srv.ShortText;
							srv.Qty = parseFloat(srv.Qty);
							or_V_A.push(srv);
						}
					});

					oData.BuildingConsulidatedItemSetfilter = JSON.parse(JSON.stringify(or_V_A));
					that.POHeaderToPOSrv = (or_V_A);

					//as build services internal 
					oData.AsbuildService = AsbuildService;
					oData.EstimatedContracts = POHeaderToPOItemar;
					var itemlist = [];
					var srvlisttt = [];
					srvlisttt = that.Consoliatedserviceslistobject(JSON.parse(JSON.stringify(that.POHeaderToPOSrv)));
					//sort for 
					srvlisttt = srvlisttt.sort((a, b) => a.Data - b.Data);
					oData.ServicNOCount = srvlisttt.length;
					/*	$.each(that.POHeaderToPOSrv, function (i, srv) {
							var escape = false;
							if (srvlist.length !== 0) {
								$.each(srvlist, function (j, boq) {

									if (srvlist[j].Serviceno === srv.Serviceno && srvlist[j].Txt === srv.Txt && srvlist[j].SubBoq && srv.SubBoq) {
										//	srv.Qty =0;
										srvlist[j] = srv;
										srvlist[j].Buildings = [];
										$.each(POHeaderToBoqItem, function (s, Bsrv) {

											///	POHeaderToBoqItem[s].PriceUnit = srvlist[j].PriceUnit;
											if (srvlist[j].Serviceno === Bsrv.Serviceno) {
												//	srvlist[j].Qty = parseFloat(Bsrv.Qty) + parseFloat(srvlist[j].Qty);


												escape = true;
											}
										});
									}

								});


							} else {
								//law srvlist null ydef 2wal line
								srvlist.push(srv);

								escape = true;
							}
							if (!escape)
								srvlist.push(srv);
							// console.log(srvlist);

							var buEscape = false;
							if (myBuilding.length !== 0) {
								$.each(myBuilding, function (j, boq) {
									if (myBuilding[j].Buildingno === srv.Buildingno && myBuilding[j].SubBoq === srv.SubBoq)
										buEscape = true;
								});
							} else {
								if (srv.Buildingno !== "") {
									myBuilding.push(srv);
									buEscape = true;
								} else {
									myWBS.push(srv);
									buEscape = true;
								}
							}
							if (!buEscape) {
								if (srv.Buildingno !== "") {
									myBuilding.push(srv);
								} else
									myWBS.push(srv);
							}
							// console.log(myBuilding);

						});  */



					/// sum  bus building 

					/*	$.each(that.POHeaderToPOSrv, function (i, srvb) {
							
								var escape = false;
								if (srvlistBuilding.length !== 0) {
									$.each(srvlistBuilding, function (g, boq) {
										if (srvlistBuilding[g].Serviceno === srvb.Serviceno &&  srvlistBuilding[g].ContractualIndicator === srvb.ContractualIndicator && srvlistBuilding[g].Boq === srvb.Boq) {
											srvb.Qty =0;
										srvlistBuilding[g] = srv;
										srvlistBuilding[g].Buildings=[];
											$.each(POHeaderToBoqItem, function (ss, Bsrv) {
												var buildingExists = false;
												POHeaderToBoqItem[ss].PriceUnit = srvlistBuilding[g].PriceUnit;
												if (srvlistBuilding[g].Serviceno === Bsrv.Serviceno ) {
													srvlistBuilding[g].Qty = parseFloat(Bsrv.Qty) + parseFloat(srvlistBuilding[g].Qty);
												
													
													escape = true;
												}
											});
										}
									});
								} else {
									//law srvlist null ydef 2wal line
									srvlistBuilding.push(srvb);
									escape = true;
								}
								if (!escape)
								srvlistBuilding.push(srvb);
								// console.log(srvlist);
			
								var buEscape = false;
								
			
							});*/

					//	var myBuildingSet = [];
					var myWBSSet = [];
					var filters = [];
					var filtersB = [];
					var filters = {};
					var obj = [];
					/*	$.each(myBuilding, function (i, bu) {
						
						//var val = (bu.Buildingno + '#' + bu.Project + '#' + bu.Boq + '#' + bu.SubBoq).toString();
						
						var Filter1 = new sap.ui.model.Filter("BuildingNo", sap.ui.model.FilterOperator.EQ, bu.Buildingno  );
						var Filter2 = new sap.ui.model.Filter("Zone", sap.ui.model.FilterOperator.EQ, bu.Project );
						var Filter3 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, bu.Boq);
						var Filter4 = new sap.ui.model.Filter("SubBoq", sap.ui.model.FilterOperator.EQ, bu.SubBoq );
						var Filter5 = new sap.ui.model.Filter("Filterall", sap.ui.model.FilterOperator.EQ, 'X' );

					   filtersB.push(Filter1);
					   filtersB.push(Filter2);
					   filtersB.push(Filter3);
					   filtersB.push(Filter4);
					   filtersB.push(Filter5);
					});*/
					//	var BuildingNO = 0 ;
					/*	 if(filtersB.length > 0){
								mModel.read("/BuildingSet", {
										async: false,
										filters: filtersB,
										success: function (oData) {
											//var BuildingNO = 0 ;
											$.each(oData.results, function (i, data) {
												if (data.Status === "")
												//V.OrderNo
													oData.results[i].Status = "COMPOSING";
													$.each(myBuilding, function (B, bu) {
													
														if(bu.Buildingno === data.BuildingNo ){
															BuildingNO = parseFloat(BuildingNO) + 1;
															oData.results[i].Group = bu.SubBoq;
															oData.results[i].ContractualIndicator = bu.ContractualIndicator;
															oData.results[i].SrvStatus = bu.SrvStatus;
															oData.results[i].ChangeIndicator="";
															oData.results[i].DelInd = "";
															oData.results[i].Txt=  bu.Txt; 
															if(oData.results[i].ContractualIndicator=== "O"){oData.results[i].sortNum = 1}
															if(oData.results[i].ContractualIndicator=== "V"){oData.results[i].sortNum = 2}
															if(oData.results[i].ContractualIndicator=== "A"){oData.results[i].sortNum = 3}
															if(oData.results[i].ContractualIndicator ===  "V" ||  oData.results[i].ContractualIndicator === "A"){
																$.each(that.HeadToHeadVariationG, function (j, V) {
																	if( oData.results[i].Txt === V.OrderType+"-"+V.UserOrder){
																		oData.results[i].OrderNo = V.OrderNo 
																	}
																
																})
															}
															myBuildingSet.push(JSON.parse(JSON.stringify(oData.results[i])));
														}
												
													})
											});
										
										},
										error: function (e) {
											sap.m.MessageToast.show("Error");
										}
								
								});
							}*/


					/*	var WbslistNo = 0 ;
							if (myWBS.length !== 0) {
								var filters = [new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, "WBS"),
									// new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, bu.Project)
								];
								mModel.read("/ValueHelpSet", {
									async: false,
									filters: filters,
									success: function (oData) {
	
									
										$.each(myWBS, function (x, bu) {
											$.each(oData.results, function (i, data) {
												oData.results[i].DelInd = "";
												if (myWBSSet.length === 0) {
													if (data.IdNumber === bu.Boq) {
														WbslistNo = parseFloat(WbslistNo) + 1;
														oData.results[i].ContractualIndicator = bu.ContractualIndicator;
														oData.results[i].Txt = bu.Txt;
														oData.results[i].BuildingNo = data.IdNumber;
														oData.results[i].BoqDesc = bu.LongText;
														oData.results[i].SrvStatus = bu.SrvStatus;
														oData.results[i].Model = oData.results[i].IdNumber;
														oData.results[i].Group = bu.SubBoq;
														oData.results[i].SubBoq=bu.SubBoq;
														myWBSSet.push(JSON.parse(JSON.stringify(oData.results[i])));
	
													}
												} else {
													if (data.IdNumber === bu.Boq) {
														var found = false;
														$.each(myWBSSet, function (w, wbs) {
															if (wbs.IdNumber === data.IdNumber)
																found = true;
														});
														if (!found) {
															WbslistNo = parseFloat(WbslistNo) + 1;
															oData.results[i].Txt = bu.Txt;
															oData.results[i].BuildingNo = data.IdNumber;
															oData.results[i].BoqDesc = bu.LongText;
															oData.results[i].ContractualIndicator = bu.ContractualIndicator;
															oData.results[i].SrvStatus = bu.SrvStatus;
															oData.results[i].Model = oData.results[i].IdNumber;
															oData.results[i].Group = bu.SubBoq;
															oData.results[i].SubBoq=bu.SubBoq;
															myWBSSet.push(JSON.parse(JSON.stringify(oData.results[i])));
														}
													}
												}
	
											});
										});
	
	
									},
									error: function (e) {
										sap.m.MessageToast.show("Error");
									}
								});
							}*/
					$.each(POHeaderToPOItem, function (i, data) {
						var escape = false;
						if (itemlist.length !== 0) {
							$.each(itemlist, function (j, item) {
								if (item.Buildingno !== "") {
									if (item.Boq === data.Boq && item.SubBoq === data.SubBoq && item.MatlGroup === data.MatlGroup) {
										escape = true;
									}
								} else {
									if (item.Boq === data.Boq && item.SubBoq === data.SubBoq && item.MatlGroup === data.MatlGroup) {
										escape = true;
									}
								}
							});
						} else {
							itemlist.push(data);
							escape = true;
						}
						if (!escape)
							itemlist.push(data);
						// console.log(itemlist);

					});
					setTimeout(function () {
						var items = [];
						$.each(itemlist, function (i, poItem) {
							var escape = false;

							if (items.length === 0)
								items.push({
									"Data": poItem.Boq,
									"ShortDesc": poItem.BoqStxt,
									"LongDesc": poItem.BoqLtxt,
									"DelInd": "",
									"Indicator": "Z",
									"live": "one",
									"Model": poItem.Boq,
									"PriceUnit": "0",
									"MoiceUnit": "0",
									"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
									"Categories": [{
										"Data": poItem.SubBoq,
										"DelInd": "",
										"Indicator": "Z",
										"ShortDesc": poItem.SubboqStxt,
										"LongDesc": poItem.SubboqLtxt,
										"Model": poItem.Boq,
										"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
										"PriceUnit": "0",
										"Categories": [{
											"Data": poItem.MatlGroup, //poItem.ShortText,
											"Item": poItem.MatlGroup, //poItem.MatlGroup,
											"ShortDesc": poItem.Matdesc,//ShortText,
											"LongDesc": poItem.Matdesc,
											"DelInd": "",
											"Indicator": "Z",
											"Matdesc": poItem.ShortText,
											"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
											"ChangeIndicator": "",
											"PriceUnit": "0",
											"Boq": poItem.Boq, //new
											"SubBoq": poItem.SubBoq, // new
											"Categories": []
										}]
									}]
								});
							else {
								$.each(items, function (i, item) {
									// $.each(items[s].Categories, function (i, item) {

									if (poItem.Boq === item.Model) {
										var matEscape = false;
										var subEscape = false;
										$.each(items[i].Categories, function (s, sub) {
											if (poItem.SubBoq === sub.Data) {
												subEscape = true;
											}
											$.each(sub.Categories, function (b, boq) {
												if (poItem.MatlGroup === boq.Item && poItem.SubBoq === sub.Data) {
													matEscape = true;
												}
											});

											if (!matEscape)
												if (poItem.SubBoq === sub.Data) {
													items[i].Categories[s].Categories.push({
														"Data": poItem.MatlGroup, //poItem.ShortText,
														"Item": poItem.MatlGroup,
														"Matdesc": poItem.Matdesc,//poItem.ShortText,
														"LongDesc": poItem.Matdesc,
														"ShortDesc": poItem.Matdesc,//.ShortText,
														"DelInd": "",
														"Indicator": "Z",
														//"SubBoq":poItem.SubBoq,
														"PriceUnit": "0",
														"SubBoq": poItem.SubBoq, //new
														"Boq": poItem.Boq, //new
														"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
														"ChangeIndicator": "",
														"Categories": []
													});
												}
											escape = true;
										});
										if (!subEscape)
											items[i].Categories.push({
												"Data": poItem.SubBoq,
												"Model": poItem.Boq,
												"ShortDesc": poItem.SubboqStxt,
												"LongDesc": poItem.SubboqLtxt,
												"DelInd": "",
												"Indicator": "Z",
												"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
												"PriceUnit": "0",
												"Categories": [{
													"Data": poItem.MatlGroup,//poItem.ShortText,
													"ShortDesc": poItem.Matdesc,//ShortText,
													"LongDesc": poItem.Matdesc,
													"DelInd": "",
													"Indicator": "Z",
													"Item": poItem.MatlGroup,
													"Matdesc": poItem.ShortText,
													"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
													"ChangeIndicator": "",
													"PriceUnit": "0",
													"SubBoq": poItem.SubBoq, //new
													"Boq": poItem.Boq, //new
													"Categories": []
												}]
											});
									}

									// });
								});
								if (!escape)
									items.push({
										"Data": poItem.Boq,
										"Model": poItem.Boq,
										"ShortDesc": poItem.BoqStxt,
										"LongDesc": poItem.BoqLtxt,
										"live": "one",
										"DelInd": "",
										"Indicator": "Z",
										"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
										"PriceUnit": "0",
										"Categories": [{
											"Data": poItem.SubBoq,
											"Model": poItem.Boq,
											"ShortDesc": poItem.SubboqStxt,
											"LongDesc": poItem.SubboqLtxt,
											"DelInd": "",
											"Indicator": "Z",
											"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
											"PriceUnit": "0",
											"Categories": [{
												"Data": poItem.MatlGroup,//poItem.ShortText,
												"ShortDesc": poItem.Matdesc,//ShortText,
												"LongDesc": poItem.Matdesc,
												"Item": poItem.MatlGroup,
												"DelInd": "",
												"Indicator": "Z",
												"Matdesc": poItem.ShortText,
												"ModelType": poItem.Project !== "" ? "BOQ" : "WBS",
												"ChangeIndicator": "",
												"PriceUnit": "0",
												"SubBoq": poItem.SubBoq, //new
												"Boq": poItem.Boq, //new
												"Categories": []
											}]
										}]
									});
							}
						});

						$.each(that.POHeaderToPOSrv, function (v, srvv) {

							$.each(POHeaderToBoqItem, function (j, boq) {

								if (boq.Serviceno === srvv.Serviceno && boq.SubBoq === srvv.SubBoq && boq.Boq === srvv.Boq && boq.Item === srvv.MatlGroup && srvv.ContractualIndicator === boq.ContractualIndicator) {
									POHeaderToBoqItem[j].PriceUnit = srvv.PriceUnit;
									POHeaderToBoqItem[j].OvfTol = srvv.OvfTol;
									POHeaderToBoqItem[j].SubModel = srvv.SubBoq;
									POHeaderToBoqItem[j].UnitMeas = srvv.BaseUom;
									POHeaderToBoqItem[j].VariationOrder = srvv.VariationOrder;
									POHeaderToBoqItem[j].Txt = srvv.Txt;
									POHeaderToBoqItem[j].SrvStatus = srvv.SrvStatus;
									POHeaderToBoqItem[j].Eancat = srvv.ServiceType;
									POHeaderToBoqItem[j].LongText = srvv.SrvLongText;
									POHeaderToBoqItem[j].Qty_Srv = srvv.Qty;
									POHeaderToBoqItem[j].ProvisionRate = srvv.ProvisionRate;

									//POHeaderToBoqItem[j].Eancat = srvv.ServiceType;
									//	POHeaderToBoqItem[j].ContractualIndicator= srvv.ContractualIndicator;


								}
							});

						});
						$.each(items, function (i, poItem) {
							$.each(POHeaderToBoqItem, function (j, boq) {
								if (poItem.Model === boq.Boq) {
									$.each(items[i].Categories, function (s, sub) {
										if (sub.Data === boq.SubBoq && sub.Model === boq.Boq) {
											$.each(items[i].Categories[s].Categories, function (c, itemcat) {
												if (itemcat.Data === boq.Item && itemcat.SubBoq === boq.SubBoq && itemcat.Boq === boq.Boq) {

													items[i].Categories[s].Categories[c].Categories.push({

														//"DelInd": boq.DelInd,
														"DelInd": "",
														"Indicator": "Y",
														"Model": boq.Boq,
														"LongDesc": boq.LongText,//*LongText
														"ShortDesc": boq.Servicedesc, //*Servicedesc
														"Matdesc": boq.Matdesc,
														"Data": boq.Serviceno,
														"PriceUnit": boq.PriceUnit,
														"ProvisionRate": boq.ProvisionRate,
														"Price": boq.PriceUnit,
														"Data": boq.Serviceno,
														"Flag": boq.Flag,
														"UnitMeas": boq.UnitMeas,
														"Qty": boq.Qty_Srv,//boq.Qty,
														"SubModel": boq.SubModel,
														"ModelType": itemcat.ModelType,
														"ChangeIndicator": "",
														"ContractualIndicator": boq.ContractualIndicator, // add for sum
														"Item": boq.Item,
														"MatlGroup": boq.Item,
														"SrvNo": boq.SrvNo,
														"Txt": boq.Txt,
														"Uom": boq.UnitMeas,
														//"EanCat": boq.EanCat,
														"Eancat": boq.Eancat,
														"VariationOrder": boq.VariationOrder,
														"SrvStatus": boq.SrvStatus,
													});
												}

											});
										}
									});

								}
							});
						});

						// console.log(pushlist);

						oData.BuildingSet = [],
							oData.BoqModelSet = POHeaderToBoqItem;
						oData.BoqItemSet = items;
						oData.BoqMatGrpSet = [];
						oData.BoqConsulidatedItemSet = srvlisttt//srvlist;
						//oData.BuildingConsulidatedItemSet = oData.ContractPOSrvItemSet.results;
						//oData.copyBuildingConsulidatedItemSet = srvlistBuilding;\
						//oData.BuildingNO = BuildingNO;
						oData.WbslistNo = WbslistNo;


						//oData.myBuildingSet = myBuildingSet;
						//	that.myBuildingSet = myBuildingSet;

						oData.selectedBuildinglist = [];

						//	that.myWBSSet = myWBSSet;
						//	oData.myWBSSet = myWBSSet;
						oData.selectedBuilding = [];

						//////////////////////////////////
						$.each(that.myBuildingSet, function (i, bu) {
							that.BUBoQs.push(bu.Model + bu.Group);
						});
						$.each(that.myWBSSet, function (i, bu) {
							that.BUBoQs.push(bu.Model + bu.Group);
						});
						that.BUBoQs.sort();

						var current = null;
						var cnt = 0;
						for (var i = 0; i <= that.BUBoQs.length; i++) {
							if (that.BUBoQs[i] != current) {
								if (cnt > 0) {
									that.Boqs.push({
										"Model": current.substr(0, 8),
										"BoqSub": current.substr(8, 4),
										"Count": cnt,
										"Categories": [],
										"Services": []
									})
									// console.log(current + ' comes --> ' + cnt + ' times<br>');
								}
								current = that.BUBoQs[i];
								cnt = 1;
							} else {
								cnt++;
							}

						}
						//////////////////////////////////
						oData.ContractPOSrvItemSet = ContractPOSrvItemSet;
						if (POHeaderToPOItem[0]) {
							oData.DeliveryDate = POHeaderToPOItem[0].DeliveryDate;
							oData.OvfTol = POHeaderToPOItem[0].OvfTol;
						} else {
							oData.DeliveryDate = "";
							oData.OvfTol = "0";
						}
						oData.AttachmentSet = oData.AttachmentSet.results;

						oData.editMode = false;

						that.getView().setModel(new sap.ui.model.json.JSONModel(oData), "localJson");
						that.getView().byId("idDisplayProcessFlow").updateModel();
						if (oData.WFContractInboxNAV.results.length > 0) {
							that._readWFType();
						}
						//	that.byId('VariationOrderTable').getBinding("rows").filter(new Filter("OrderType", FilterOperator.NE,'X'));
						//that.byId('VariationOrderTable').getBinding("rows").filter(new sap.ui.model.Filter("OrderType", sap.ui.model.FilterOperator.NE,'m'));

						var consolidateBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BuildingConsulidatedItemSetfilter")));

						var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
						var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
						$.each(consolidate, function (c, cons) {
							$.each(BoqItemSet, function (i, boq) {
								$.each(boq.Categories, function (j, sub) {
									$.each(sub.Categories, function (l, cat) {
										$.each(cat.Categories, function (k, srv) {
											var go = false;
											$.each(that.myBuildingSet, function (s, selected) {
												if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model && sub.Data === selected.Group && selected.AsBuild2 === "") {
													go = true;
												}
											});
											$.each(that.myWBSSet, function (s, selected) {
												if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model && sub.Data === selected.Group && selected.AsBuild2 === "") {
													go = true;
												}
											});
											if (go) {
												BoqItemSet[i].PriceUnit = "0";
												BoqItemSet[i].Categories[j].PriceUnit = "0";
												BoqItemSet[i].Categories[j].Categories[l].PriceUnit = "0";
											}

										});

									});
								});

							});
						});
						var list = [];
						$.each(consolidate, function (c, cons) {
							$.each(BoqItemSet, function (i, boq) {
								$.each(boq.Categories, function (j, sub) {

									$.each(sub.Categories, function (l, cat) {
										$.each(cat.Categories, function (k, srv) {
											if (cons.Data === srv.Data && cons.Txt === srv.Txt) {
												BoqItemSet[i].Categories[j].Categories[l].Categories[k].ProvisionRate = (parseFloat(cons.ProvisionRate));

												BoqItemSet[i].Categories[j].Categories[l].Categories[k].PriceUnit = (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty));
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].PriceUnit = (parseFloat(BoqItemSet[i].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
												if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].Categories[l].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].Categories[l].PriceUnit) + (parseFloat(cons.PriceUnit) * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }

											}
										});

									});
								});

							});
						});

						$.each(consolidateBuilding, function (c, cons) {
							//cons.Amount= parseFloat(cons.PriceUnit) * parseFloat(cons.Qty);
							/*if(cons.ServiceType === "U"){
								cons.Amount= parseFloat(cons.PriceUnit) ;
		
							}else{
								cons.Amount= parseFloat(cons.PriceUnit) * parseFloat(cons.Qty);
		
							}*/
						})

						$.each(consolidate, function (c, cons) {
							/*if(cons.ServiceType === "U"){
								cons.Amount= parseFloat(cons.PriceUnit) ;
		
							}else{
								cons.Amount= parseFloat(cons.PriceUnit) * parseFloat(cons.Qty);
		
							}*/
							cons.Amount = parseFloat(cons.PriceUnit) * parseFloat(cons.Qty);
						})
						that.addVAOld = 0;
						$.each(BoqItemSet, function (c, cons) {
							that.addVAOld = parseFloat(that.addVAOld) + parseFloat(BoqItemSet[c].PriceUnit);//that.addVA 
						});
						that.getView().getModel("localJson").setProperty("/BuildingConsulidatedItemSetfilter", JSON.parse(JSON.stringify(consolidateBuilding)));
						that.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(consolidate.sort((a, b) => a.Data - b.Data))));
						that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet.sort((a, b) => a.Data - b.Data))));
						//	this.byId('VariationOrderTable').getBinding("rows").filter(new sap.ui.model.Filter("OrderType", sap.ui.model.FilterOperator.NE,'V'));
						that.getView().setBusy(false);
						//that.Consoliatedservicesall();

					}, 8000);
				}
			}).catch(function (oError) {
					sap.m.MessageToast.show("Error");
					that.getView().setBusy(false);

			});
		
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("Contract"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();
			this.getResourceBundle();
		},
		_actionDialog: null,
		onActivateReleaseedPO: function (oEvent) {
			var oController = this;
			var VariationActivate = "";
			var Active = true;
			var OrderNo = "",
				Decision = "0004",
				OrderType = oController.getView().getModel("localJson").getProperty("/CreationType");

			//if( oController.PurchDoc == ""){
			var HeadToHeadVariation = oController.getModel("localJson").getProperty("/HeadToHeadVariation");
			if (HeadToHeadVariation.length === 0) {
				Active = true;
			} else {
				$.each(HeadToHeadVariation, function (v, vari) {

					if (vari.VarStatus !== "R") {
						VariationActivate = vari.VarStatus;
						Active = false;
					} else {
						OrderNo = vari.OrderNo;
						OrderType = vari.OrderType;

					}
				})
			}

			if (Active === true) {

				if (!this._activateDialog) {
					this._activateDialog = new sap.m.Dialog({
						title: "{i18n>Confirm}",
						content: [
							new sap.m.Label({
								text: oController.getResourceBundle().getText("Are you sure you want to Activate ", this.docNo)
							})
						],
						beginButton: new sap.m.Button({
							text: "{i18n>Yes}",
							press: function () {
								this._activateDialog.close();
								var PoNumber = oController.getView().getModel("localJson").getProperty("/PoNumber"),
									oModel = oController.getOwnerComponent().getModel();
								oController.getView().setBusy(true);
								oModel.callFunction(
									"/POExecuteAction", {
									method: "POST",
									urlParameters: {
										"PoNo": PoNumber,
										"Decision": Decision,
										"Notes": "",
										"WorkitemId": oController.getView().getModel("localJson").getProperty("/Workitem"),
										"CreationType": oController.getView().getModel("localJson").getProperty("/CreationType"),
										"OrderNo": OrderNo,
										"ActionType": OrderType,
										"Comments": ""

									},
									success: function (data) {

										oController.getView().setBusy(false);
										sap.m.MessageBox.success(oController.getView().getModel("i18n").getResourceBundle().getText("Contract " + PoNumber + " Release Triggered Workflow"), {
											title: oController.getView().getModel("i18n").getResourceBundle().getText("Msg_Success"),
											onClose: function (oAction) {
												oController._onObjectMatched();
											}
										});
									},
									error: function (e) {

										oController.getView().setBusy(false);
										sap.m.MessageToast.show("Error in Activating contract " + PoNumber);

									}
								});

							}.bind(this)
						}),
						endButton: new sap.m.Button({
							text: "{i18n>No}",
							press: function () {
								this._activateDialog.close();
							}.bind(this)
						}),
						afterClose: function () {
							oController._activateDialog.destroy();
							oController._activateDialog = null;
						}
					});

					//to get access to the global model
					this.getView().addDependent(this._activateDialog);
				}
			} else {
				sap.m.MessageToast.show(" Variation or Addendum should be is confirmed ");
			}

			this._activateDialog.open();
		},
		_activateDialog: null,
		onActivatePO: function (oEvent) {

			var oController = this;
			var VariationActivate = "";
			var Active = true,
			    Decision = "",
				actionMsg = actionMsg,
		        PoNumber = oController.getView().getModel("localJson").getProperty("/PoNumber"),
				oModel = oController.getOwnerComponent().getModel();

			if (oEvent.getSource().getId().lastIndexOf("idSubmitTermsBtn") > -1) {
				Decision = '0003';
				actionMsg = oController.getView().getModel("i18n").getResourceBundle().getText("AreyousureyouwanttoActivate", PoNumber);
			} else if (oEvent.getSource().getId().lastIndexOf("idDeteteContract") > -1) {
				Decision = '0008';
				actionMsg = oController.getView().getModel("i18n").getResourceBundle().getText("AreyousureyouwanttoDetete", PoNumber);
			}


			//if( oController.PurchDoc == ""){
			// var HeadToHeadVariation = oController.getModel("localJson").getProperty("/HeadToHeadVariation");
			// if (HeadToHeadVariation.length === 0) {
			// 	Active = true;
			// } else {
			// 	$.each(HeadToHeadVariation, function (v, vari) {

			// 		if (vari.VarStatus !== "R") {
			// 			VariationActivate = vari.VarStatus;
			// 			Active = false;
			// 		}
			// 	})
			// }

			if (Active === true) {

				if (!this._activateDialog) {
					this._activateDialog = new sap.m.Dialog({
						title: "{i18n>Confirm}",
						content: [
							new sap.m.Label({
								text: actionMsg
							})
						],
						beginButton: new sap.m.Button({
							text: "{i18n>Yes}",
							press: function () {
								this._activateDialog.close();
								oController.getView().setBusy(true);
								const oContext = oModel.bindContext("/POExecuteAction(...)");

							// Execute the action with parameters
							oContext.setParameter("PoNo", PoNumber);
							oContext.setParameter("Decision", Decision);
							oContext.setParameter("Notes", " ");
							oContext.setParameter("WorkitemId", "");
							oContext.setParameter("CreationType", oController.getView().getModel("localJson").getProperty("/CreationType"));
							oContext.setParameter("OrderNo", "");
							oContext.setParameter("ActionType", "");
							oContext.setParameter("Comments", "");

							oContext.execute().then(() => {		
									

										oController.getView().setBusy(false);
									
										if (Decision === '0003') {
										sap.m.MessageBox.success(oController.getView().getModel("i18n").getResourceBundle().getText("Contract " + PoNumber + " Release triggered"), {
											title: oController.getView().getModel("i18n").getResourceBundle().getText("Msg_Success"),
											onClose: function (oAction) {
												oController._onObjectMatched();
											}
										});
									}else if(Decision === '0008'){
										sap.m.MessageBox.success(oController.getView().getModel("i18n").getResourceBundle().getText("Contract " + PoNumber + " IS Deleted"), {
											title: oController.getView().getModel("i18n").getResourceBundle().getText("Msg_Success"),
											onClose: function (oAction) {
												//oController.onNavBack();
												oController.onWorklistPress();

											}
										});

									}
									
									
								}).catch(error => {

										oController.getView().setBusy(false);
										sap.m.MessageToast.show("Error in Activating contract " + PoNumber);
								});

							}.bind(this)
						}),
						endButton: new sap.m.Button({
							text: "{i18n>No}",
							press: function () {
								this._activateDialog.close();
							}.bind(this)
						}),
						afterClose: function () {

							oController._activateDialog.destroy();
							oController._activateDialog = null;

						}
					});

					//to get access to the global model
					this.getView().addDependent(this._activateDialog);
				}
			} else {
				sap.m.MessageToast.show(" Variation or Addendum should be is confirmed ");

			}

			this._activateDialog.open();
		

		},
		onWorklistPress: function (oItem) {
			this.getRouter().navTo("worklist", {}, true /*no history*/);
		},
		_actionDialog: null,
		onActivatePOWF: function (oEvent) {
			var oController = this;
			var VariationActivate = "";
			var Active = true,
				OrderNo = "",
				Decision = "",
				actionMsg,
				OrderType = oController.getView().getModel("localJson").getProperty("/CreationType");

			if (oEvent.getSource().getId().lastIndexOf("idAprove") > -1) {
				Decision = '0001';
				actionMsg = oController.getView().getModel("i18n").getResourceBundle().getText("detailMsgConfirmApprovell");
			} else if (oEvent.getSource().getId().lastIndexOf("idreject") > -1) {
				Decision = '0002';
				actionMsg = oController.getView().getModel("i18n").getResourceBundle().getText("detailMsgConfirmReject");
			}
			else {
				Decision = '0004';
				actionMsg = oController.getView().getModel("i18n").getResourceBundle().getText("ContractReleasetriggeredWorkflow");
			}

			//if( oController.PurchDoc == ""){
			var HeadToHeadVariation = oController.getModel("localJson").getProperty("/HeadToHeadVariation");
			if (HeadToHeadVariation.length === 0) {
				Active = true;
			} else {
				$.each(HeadToHeadVariation, function (v, vari) {

					if (vari.VarStatus !== "R") {
						VariationActivate = vari.VarStatus;
						Active = false;
					} else if (vari.WfStatus === "" || vari.WfStatus === "INPROGRESS") {
						OrderNo = vari.OrderNo;
						OrderType = vari.OrderType;

					}
				})
			}

			if (Active === true) {
				if (!this._actionDialog) {
					this._actionDialog = new sap.m.Dialog({
						title: actionMsg,
						type: 'Message',
						content: [
							new sap.m.TextArea('Notes', {
								width: '100%',
								placeholder: actionMsg
							})
						],
						beginButton: new sap.m.Button({
							text: "{i18n>Confirm}",
							press: function () {
								var massage = sap.ui.getCore().byId('Notes').getValue();
								var PoNumber = oController.getView().getModel("localJson").getProperty("/PoNumber"),
									oModel = oController.getOwnerComponent().getModel();
								oController._actionDialog.close();
								oController._actionDialog.destroy();
								oController._actionDialog = null;

								oModel.callFunction(
									"/POExecuteAction", {
									method: "POST",
									urlParameters: {
										"PoNo": PoNumber,
										"Decision": Decision,
										"Notes": "",
										"WorkitemId": oController.getView().getModel("localJson").getProperty("/Workitem"),
										"CreationType": oController.getView().getModel("localJson").getProperty("/CreationType"),
										"OrderNo": OrderNo,
										"ActionType": OrderType,
										"Comments": massage
									},
									success: function (data) {
										if (Decision === '0004') {
											oController.getView().setBusy(false);
											sap.m.MessageBox.success(oController.getView().getModel("i18n").getResourceBundle().getText("Contract " + PoNumber + " Release triggered Workflow"), {
												title: oController.getView().getModel("i18n").getResourceBundle().getText("Msg_Success"),
												onClose: function (oAction) {
													oController._onObjectMatched();
												}
											});
										} else {
											oController.getView().setBusy(false);
											sap.m.MessageBox.success(oController.getView().getModel("i18n").getResourceBundle().getText("Contract " + PoNumber + " Successfully Action"), {
												title: oController.getView().getModel("i18n").getResourceBundle().getText("Msg_Success"),
												onClose: function (oAction) {
													oController._onObjectMatched();
												}
											});
										}
									},
									error: function (e) {
										oController.getView().setBusy(false);
										sap.m.MessageToast.show("Error in Activating contract " + PoNumber);
									}
								});
							}
						}),
						endButton: new sap.m.Button({
							text: "{i18n>Cancel}",
							press: function () {
								oController._actionDialog.close();
								oController._actionDialog.destroy();
								oController._actionDialog = null;

							}
						}),
						afterClose: function () {
							oController._actionDialog.destroy();
						}
					});

					this.getView().addDependent(this._actionDialog);
					this._actionDialog.open();
				}

			} else {
				sap.m.MessageToast.show(" Variation or Addendum should be is confirmed ");

			}

	
		},
		_createDialog: null,
		oncreatePO: function (oEvent) {

			var oController = this;
			this.rowContext = oEvent.getSource().getBindingContext("dataModel");
			if (!this._createDialog) {
				this._createDialog = new sap.m.Dialog({
					title: "{i18n>Confirm}",
					content: [
						new sap.m.Label({
							text: oController.getResourceBundle().getText("detailRequestActivateMessage", this.docNo)
						})
					],
					beginButton: new sap.m.Button({
						text: "{i18n>Yes}",
						press: function () {
							this._createDialog.close();
							var PoNumber = oController.getView().getModel("dataModel").getProperty("/PoNumber"),
								oModel = oController.getOwnerComponent().getModel();
							oController.getView().getModel("detailView").setProperty("/busy", true);
							oModel.callFunction(
								"/CreatePurchaseOrder", {
								method: "POST",
								urlParameters: {
									"PoNo": PoNumber

								},
								success: function (data) {
									oController.getView().getModel("detailView").setProperty("/busy", false);
									oController.getView().getModel("detailView").setProperty("/bEnabled", false);
									oController.getView().getModel("dataModel").setProperty("/Status", "SUBMITTED FOR APPROVAL");
									// oController._toggleButtonsAndView(false);
									oController.handleSuccessMessageBox(oController.getResourceBundle().getText("detailActivateSuccess", oController.docNo));

								},
								error: function (e) {
									oController.getView().getModel("detailView").setProperty("/busy", false);
									sap.m.MessageToast.show(oController.getResourceBundle().getText("detailActivateError"), {
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
		// to do the changes when pressing edit button 
		onEditPress: function () {


			var that = this;
			var oView = this.getView();
			var VarStatus;
			this.Composing = "";
			that.getView().getModel("localJson").setProperty("/editMode", true);
			//that.getView().getModel("localJso").setProperty("/VariationMode", false);
			var conType = that.getView().byId("idCreationType").getSelectedKey();
			if (this.PurchDoc !== "" && (this.getView().byId("idCreationType").getSelectedKey() === 'O')) {
				//sap.m.MessageToast.show("Model and  Boq is already added!");
				var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");

				for (var i = 0; i < HeadToHeadVariation.length; i++) {
					if (HeadToHeadVariation[i].Status === "C") {
						this.Composing = HeadToHeadVariation[i].Status;
						VarStatus = HeadToHeadVariation[i].VarStatus;
						//that.getView().getModel("localJson").setProperty("/editMode", true);
					} else {
						this.Composing = HeadToHeadVariation[i].Status;
						VarStatus = HeadToHeadVariation[i].VarStatus//VarStatus;Status
					}
				}
				if (this.Composing === "C") {
					that.getView().getModel("localJso").setProperty("/VariationMode", false);
					that.getView().getModel("localJson").setProperty("/editMode", true);
				} else if (this.Composing === "R" && VarStatus === "") {
					that.getView().getModel("localJso").setProperty("/VariationMode", false);
					that.getView().getModel("localJson").setProperty("/editMode", true);
				}
				else if (this.Composing === "R" && VarStatus === "R") {
					that.getView().getModel("localJso").setProperty("/VariationMode", true);
					that.getView().getModel("localJson").setProperty("/editMode", true);
				}
				else if (this.Composing === "" && conType === "O") {
					that.getView().getModel("localJso").setProperty("/VariationMode", true);
					that.getView().getModel("localJson").setProperty("/editMode", true);
				}
			}


			else {

				that.getView().getModel("localJso").setProperty("/VariationMode", false);
				that.getView().getModel("localJson").setProperty("/editMode", true);
			}

		},

		onCancelPress: function () {
			var that = this;
			var oView = this.getView();
			that.getView().getModel("localJson").setProperty("/editMode", false);

			that.getView().getModel("localJso").setProperty("/VariationMode", true);
			that._onObjectMatched();
			that._onBindingChange();
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
			if (this.sProj.length > 0) {
				aFilters.push(oFilter5);
			}
			if (this.ModelCode.length > 0) {
				aFilters.push(oFilter6);
			}
			if (this.GroupCode.length > 0) {
				aFilters.push(oFilter7);
			}
			aFilters.push(oFilter3);
			aFilters.push(oFilter4);

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
		/////////////////////////// SupeiorWBS search value help////// [E.A]
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
			that._SuperiorWBSDialog.destroy();
			that._SuperiorWBSDialog = null;
		},
		_handleCancelPresswbs: function () {

			var that = this;
			that._SuperiorWBSDialog.close();
			that._SuperiorWBSDialog.destroy();
			that._SuperiorWBSDialog = null;
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
		///////////////////  Model search value help/////// create using [E.A]



		///  Group  search value help //////[E.A]//
		onDisplaySearGroup: function (oEvent) {

			this.idSelestGroup = oEvent.getSource().getId();
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

			var that = this;
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
					if (that.idSelestGroup === "idSearchByGroupp") {
						that.GroupCodee = oContext.getObject().IdNumber;
						that.getView().byId("idSearchByGroupp").setValue(oContext.getObject().IdText);
					} else {
						that.GroupCode = oContext.getObject().IdNumber;
						that.getView().byId("idSearchByGroup").setValue(oContext.getObject().IdText);
					}

					//return oContext.getObject().Name;
				});
			} else {
				that.GroupCodee = "";
				that.getView().byId("idSearchByGroup").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		/// add building
		_BuildinDialog: null,

		onBuildingSelectionValueHelpPress: function () {
			//onAddBuildings
			var that = this;
			;
			var StatusOr = this.getModel("localJson").getProperty("/StatusOr");
			this.getView().getModel("localJson").setProperty("/selectBoq", false);
			if (this.PurchDoc !== "" && StatusOr === "Released Original" && this.getView().byId("idCreationType").getSelectedKey() === "O") {
				if (StatusOr === 'Released Original') {
					//sap.m.MessageToast.show("Model and  Boq is already added!");
					var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
					for (var i = 0; i < HeadToHeadVariation.length; i++) {
						if (HeadToHeadVariation[i].Status === "C") {
							if (HeadToHeadVariation[i].UserOrder === "" || HeadToHeadVariation[i].OrderDesc === "") {
								sap.m.MessageToast.show("Please Enter Manadatory Fields");
								return;
							}
							this.Composing = HeadToHeadVariation[i].Status;

						}

					}
					if (this.Composing == "" || this.Composing === "R") {
						sap.m.MessageToast.show("Please Create Variation order or Addenum");
						that.getView().getModel("localJso").setProperty("/VariationMode", false);
					} else {

						if (that.sProjectCode !== "" && that.sCoCode !== "") {
							//that.onActionAfterClose();
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

							that._BuildinDialog.open();
						} else {
							sap.m.MessageToast.show("Please select Company Code and Project first.");
						}
					}
				} else {
					sap.m.MessageToast.show("Please select Creation Type is Original .");
				}
			} else {

				if (that.sProjectCode !== "" && that.sCoCode !== "") {
			
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

					that._BuildinDialog.open();
					//if (that._oBuilding2Dialog.getModel("localJson"))
					//that._oBuilding2Dialog.getModel("localJson").setProperty("/BuildingSet", []);
					that.aContexts = [];
					that.Boqs = [];
					that.BUBoQs = [];
				} else {
					sap.m.MessageToast.show("Please select Company Code and Project first.");
				}

			}
		},
		onAfterClose: function (oEvent) {
			var that = this;
			that._oBuilding2Dialog.destroy();
			that._oBuilding2Dialog = null;
		},
		onAfterCloseWBS: function (oEvent) {
			var that = this;
			oEvent.getSource().destroy();
			that._oWBS2Dialog = null;
		},
		onActionAfterClose: function (oEvent) {
			var that = this;

			that._action2Sheet.destroy();
			that._action2Sheet = null;
		},
		_handleCancelPressBuilding: function () {

			var that = this;
			var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding");
			var filter = [];
			for (var v = 0; v < that.myBuildingSet.length; v++) {
				var found = false;
				$.each(selectedBuilding, function (s, sel) {

					if (that.myBuildingSet[v].BuildingNo === sel.BuildingNo && that.myBuildingSet[v].Model === sel.Model && that.myBuildingSet[v].Group === sel.Group)
						found = true;
				});
				if (!found) {
					filter.push(that.myBuildingSet[v]);
				}
			}
			that.myBuildingSet = JSON.parse(JSON.stringify(filter));
			that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);

			that.getView().getModel("localJson").setProperty("/selectedBuilding", []);
			that._oBuilding2Dialog.close();
			this.afterCloseBuilding();
		},
		afterCloseBuilding: function () {

			if (this._oBuilding2Dialog) {
				this._oBuilding2Dialog.destroy();
				this._oBuilding2Dialog = null;
			}
		},
		onProvisionRateChange: function (oEvent) {
			var oController = this;
			if (oEvent !== "") {
				// on change
				var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
				var oModel = this.getView().getModel("localJson");
				var oRowData = oModel.getProperty(sPath);
				oRowData.ChangeIndicator = "X";
				oModel.setProperty(sPath, oRowData);
				var obj = oEvent.getSource().getBindingContext("localJson").getObject();
				$.each(oController.myBuildingSet, function (s, selected) {
					if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === obj.Boq && obj.SubBoq === selected.Group && selected.Txt === obj.Txt) {
						selected.ChangeIndicator = "ChangeP";
					}
				});
				$.each(oController.myWBSSet, function (s, selected) {
					if ((selected.Model) === obj.Boq) {
						selected.ChangeIndicator = "ChangeP";
					}
				});
			}
		},
		onPriceConsolidatedChange: function (oEvent, object, qty) {
			var that = this;
			var AddValues = "0.00",
				OmissionValues = "0.00",
				ChangeAmount = "0.00";
			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
			var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet"))),
			    PRItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/PRItemSet"))),
			    myPurchaseRequisition = this.getView().getModel("localJson").getProperty("/myPurchaseRequisition");
			if (oEvent !== "") {
				// on change
				var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
				var oModel = this.getView().getModel("localJson");
				var oRowData = oModel.getProperty(sPath);
				oRowData.ChangeIndicator = "X";
				//oRowData.DelInd = "X"
				oModel.setProperty(sPath, oRowData);

				var obj = oEvent.getSource().getBindingContext("localJson").getObject();
				// var oldPrice = JSON.parse(JSON.stringify(obj.PriceUnit));
				var service = obj.Data;
				//$.each(consolidate, function (c, cons) {
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
	

				//	});
				$.each(consolidate, function (c, cons) {
					$.each(BoqItemSet, function (i, boq) {
						$.each(boq.Categories, function (j, sub) {
							$.each(sub.Categories, function (l, cat) {
								$.each(cat.Categories, function (k, srv) {
									if (srv.Data === service && obj.Txt === srv.Txt) {
										//srv.Qty = obj.Qty;
										if (boq.AddNew !== "AN") {
											srv.ChangeIndicator = "ChangeP";
										}
									}
									if (cons.Data === srv.Data && cons.Txt === srv.Txt) {
										var go = false;
										$.each(that.myBuildingSet, function (s, selected) {
											if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === obj.Boq && obj.SubBoq === selected.Group && selected.Txt === obj.Txt) {
												//srv.Qty = obj.Qty;
												if (boq.AddNew !== "AN") {
													selected.ChangeIndicator = "ChangeP";
												}
											}
											if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model && sub.Data === selected.Group) {
												go = true;
											}
										});
										$.each(that.myWBSSet, function (s, selected) {
											if ((selected.Model) === srv.Model) {
												if (boq.AddNew !== "AN") {
													selected.ChangeIndicator = "ChangeP";
												}
											}
											if ((selected.Model) === srv.Model) {
												go = true;
											}
										});
										if (go) {

											cons.PriceUnit = parseFloat(cons.PriceUnit).toFixed(that.CustomCurrency);
											//that.getView().byId("id_Amount").setValue(BoqItemSet[i].PriceUnit) ;
											var ConsolidatedPrice = JSON.parse(JSON.stringify(cons.PriceUnit));
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].Price = ConsolidatedPrice;
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
					$.each(consolidate, function (c, cons) {
					$.each(PRItemSet, function (i, boq) {
						$.each(boq.Categories, function (j, sub) {
								$.each(sub.Categories, function (k, srv) {
									if (srv.Data === service && obj.Txt === srv.Txt) {
										//srv.Qty = obj.Qty;
										if (boq.AddNew !== "AN") {
											srv.ChangeIndicator = "ChangeP";
										}
									}
								//	findservice = consolidate.find(x => x.Data === srv.Data);
									//ModelType = findservice.ModelBoq.find(x => x.ModelType === "PR")
									if (cons.Data === srv.Data &&  cons.Txt === srv.Txt) {
										$.each(myPurchaseRequisition, function (s, selected) {
											if (boq.AddNew !== "AN") {
												selected.ChangeIndicator = "ChangeP";
											}
											if (selected.PrNo == boq.PrNumber  && sub.Data  === srv.Item ) {
											var ConsolidatedPrice = JSON.parse(JSON.stringify(cons.PriceUnit));
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
					});
					//------------------------------end PR--------------------------------


			} else {
				var obj = object;
				var service = obj.Data;
				var oldPrice = "1";
				//	$.each(consolidate, function (c, cons) {
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
	
				//	});
				$.each(consolidate, function (c, cons) {
					$.each(BoqItemSet, function (i, boq) {
						$.each(boq.Categories, function (j, sub) {
							$.each(sub.Categories, function (l, cat) {
								$.each(cat.Categories, function (k, srv) {
									if (cons.Data === srv.Data && cons.Txt === srv.Txt) {
										if (srv.Data === service && obj.Txt === srv.Txt) {
											//srv.Qty = obj.Qty;
											if (boq.AddNew !== "AN") {
												srv.ChangeIndicator = "ChangeP";
											}
										}
										var go = false;
										$.each(that.myBuildingSet, function (s, selected) {
											if (((selected.Model).length === 8 ? selected.Model : "00000" + selected.Model) === srv.Model && sub.Data === selected.Group) {
												go = true;
											}
										});
										$.each(that.myWBSSet, function (s, selected) {

											if ((selected.Model) === srv.Model) {
												go = true;
											}
										});
										if (go) {
											cons.PriceUnit = parseFloat(cons.PriceUnit).toFixed(that.CustomCurrency);
											var ConsolidatedPrice = JSON.parse(JSON.stringify(cons.PriceUnit));
											BoqItemSet[i].Categories[j].Categories[l].Categories[k].Price = ConsolidatedPrice;
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
					$.each(consolidate, function (c, cons) {
						$.each(PRItemSet, function (i, boq) {
							$.each(boq.Categories, function (j, sub) {
									$.each(sub.Categories, function (k, srv) {
										if (srv.Data === service && obj.Txt === srv.Txt) {
											//srv.Qty = obj.Qty;
											if (boq.AddNew !== "AN") {
												srv.ChangeIndicator = "ChangeP";
											}
										}
									//	findservice = consolidate.find(x => x.Data === srv.Data);
										//ModelType = findservice.ModelBoq.find(x => x.ModelType === "PR")
										if (cons.Data === srv.Data &&  cons.Txt === srv.Txt) {
											$.each(myPurchaseRequisition, function (s, selected) {
												if (boq.AddNew !== "AN") {
													selected.ChangeIndicator = "ChangeP";
												}
												if (selected.PrNo == boq.PrNumber  && sub.Data  === srv.Item ) {
												var ConsolidatedPrice = JSON.parse(JSON.stringify(cons.PriceUnit));
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
						});
						//------------------------------end PR--------------------------------
			}

			

			//[weating]
			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
			$.each(HeadToHeadVariation, function (i, st) {
				if (HeadToHeadVariation[i].Status === "C") {
					that.AddValueVariation(BoqItemSet);
				}
			});
			///[E.A]
			that.onAfterClose();
			$.each(consolidate, function (c, cons) {
				cons.Amount = (parseFloat(cons.PriceUnit).toFixed(that.CustomCurrency) * parseFloat(cons.Qty)).toFixed(that.CustomCurrency);
			});

			ChangeAmount = parseFloat(AddValues) + parseFloat(OmissionValues);
		
			//  var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			that.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(consolidate.sort((a, b) => a.Data - b.Data))));
			that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet.sort((a, b) => a.Data - b.Data))));
			that.getView().getModel("localJson").setProperty("/PRItemSet", JSON.parse(JSON.stringify(PRItemSet.sort((a, b) => a.Data - b.Data))));
			myPurchaseRequisition = this.getView().getModel("localJson").setProperty("/myPurchaseRequisition" ,myPurchaseRequisition );
			that.ContractValueHeader();
		},
		///// when select from building 
		_handleValueHelpCloseBuilding: function (oEvt) {
			var that = this,
				mModel = that.getView().getModel();
			that.getView().setBusy(true);
			var oModelJson = that.getView().getModel();
			var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding");
			var selectedBuildingOrWBS = that.getView().getModel("localJson").getProperty("/selectedBuildingOrWBS"),
				HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation"),
				selectedBuildingOrWBSCont = [],
				filters = [];
			var objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			if (that.aContexts.length === 0)
				sap.m.MessageToast.show("Select one Building at least!");
			else {
				var noSub = false;
				$.each(that.myBuildingSet, function (b, bu) {
					if (bu.Group === "") {
						noSub = true;
					}
				});
				if (noSub)
					sap.m.MessageToast.show("Select Boq for each Building!");
				else {
					////loop into for select building 
					$.each(selectedBuilding, function (i, bu) {
						that.BUBoQs.push(bu.Model + bu.Group);

					});
					that.BUBoQs.sort();

					this.objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
					this.selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/selectedBuilding")));
					var BoqConsulidatedItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
					var totalprice = "0.00";

					$.each(selectedBuildingOrWBS, function (i, SelectBuilding) {
						var oFilter1 = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.BT, SelectBuilding.Model, SelectBuilding.Group);
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
							var ContractualIndicator = "O";
							var VariationOrder = "";
							var Action = "UA";
							var UserOrde = "";
							$.each(HeadToHeadVariation, function (i, st) {
								if (HeadToHeadVariation[i].Status === "C") {
									ContractualIndicator = HeadToHeadVariation[i].OrderType;
									VariationOrder = HeadToHeadVariation[i].OrderNo;
									UserOrde = HeadToHeadVariation[i].UserOrder;
									//	Action=HeadToHeadVariation[i].Action;
								}
							});
							if (ContractualIndicator === "O") {
								var UserOrder = "Original";
							} else {
								var UserOrder = ContractualIndicator + "-" + UserOrde;
							}
							$.each(OData, function (i, ServiceBoq) {
								if (OData[i].LevelNo === "1") {
									OData[i].AddNew = "AN";
									OData[i].live = "one";
									//live: "one",
								}

								OData[i].ModelType = "BOQ";
								//OData[i].DelInd = "";
								if (OData[i].Eancat === "" && parseInt(OData[i].LevelNo) === 4) {
									OData[i].Qty = "0";
									OData[i].Uom = "";
									OData[i].Price = "0";

								}
								if (OData[i].Eancat === "U") { OData[i].Qty = 0; }

								/*if(parseInt(OData[i].LevelNo) === 1){
									OData[i].AddNew= "AN";
								}*/
								if (parseInt(OData[i].LevelNo) === 4) {
									OData[i].Txt = UserOrder;
									OData[i].SrvStatus = Action;

									if (OData[i].Eancat != "") {
										OData[i].PriceUnit = "1";
										OData[i].Price = "1";
									}
									OData[i].DelInd = "";
									OData[i].VariationOrder = VariationOrder;
									OData[i].ChangeIndicator = "addB";
									OData[i].ContractualIndicator = ContractualIndicator;
									OData[i].Indicator = "Y";
									totalprice = parseFloat(totalprice) + (parseFloat(OData[i].Qty) * parseFloat(OData[i].Price));
								} else {
									OData[i].Indicator = "Z";
								}
							});
							
							that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);
							that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);

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
								if (newHierachy.length !== 0) {
									$.each(newHierachy, function (c, newNode) {
										TreeBoqItemSet.push(newNode);
									});
								}
							});
							var go = false;
							var found = false;
							$.each(TreeBoqItemSet, function (c, newNode) {
								go = false;

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
													//go= false;
												}
											}
											//	}
										})
									})
									//if(!go ) found = false;
									if (!go && !found) {
										that.objSet.push(newNode);
										go = false;

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
				
							var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
							var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));

							//	$.each(consolidate, function (c, cons) {
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
							//	});

							$.each(consolidate, function (c, cons) {
								$.each(BoqItemSet, function (i, boq) {
									$.each(boq.Categories, function (j, sub) {
										$.each(sub.Categories, function (l, cat) {
											$.each(cat.Categories, function (k, srv) {
												if (cons.Data === srv.Data && cons.Txt === srv.Txt) {
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
														var ConsolidatedPrice = JSON.parse(JSON.stringify(parseFloat(cons.PriceUnit).toFixed(that.CustomCurrency)));
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
							that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
							that.ContractValueHeader();
							that.addBuildingForvariation();
							//	that.getView().setBusy(false);
						},

						error: function (e) {

							sap.m.MessageToast.show("Error");
						}
					});


				}
			}

		},

		////////////////////////////// SubBoq search value help ////////////////////////////////
		onDisplaySearchSubBoqDialog: function (oEvent) {
			var that = this;
			if (!this._oSubBoqDialog) {
				this._oSubBoqDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SubBoqSearchDialog", this);
				this._oSubBoqDialog.setModel(this.getView().getModel());
			}
			this._oSubBoqDialog.open();
			this.sSubBoqId = oEvent.getParameters().id;
			var Model = oEvent.getSource().getBindingContext("localJson").getObject().Model;
			var Usagetype = oEvent.getSource().getBindingContext("localJson").getObject().Usagetype;
			this.BoqDescR = oEvent.getSource().getBindingContext("localJson").getObject();
			var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, Model);
			var oFilter2 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, that.sCoCode);
			var oFilter4 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
			//	var oFilter3 = new sap.ui.model.Filter("UsageType", sap.ui.model.FilterOperator.EQ, Usagetype);
			var oTemplate = new sap.m.StandardListItem({
				title: "{BoqSub}",
				description: "{BoqDesc}"

			});
			var aFilters = [];
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			//	aFilters.push(oFilter3);
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
			var Model = oEvent.getSource().getBindingContext("localJson").getObject().SelectionParameter6;  //IdNumber;
			this.BoqDescR = oEvent.getSource().getBindingContext("localJson").getObject();

			var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, Model);
			var oFilter2 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, this.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, this.sProjectCode);
			//aFilters.push(oFilter1);
			//aFilters.push(oFilter2);

			var oTemplate = new sap.m.StandardListItem({
				title: "{BoqSub}",
				description: "{BoqDesc}"
			});
			var aFilters = [];
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);
			aFilters.push(oFilter3);
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
			//	var v = oEvent.getSource().getId().lastIndexOf("idAprove") ;

			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					if (that.sSubBoqId !== "") {
						Boqdesc = oContext.getObject().BoqDesc;
						that.sSubBoq = oContext.getObject().BoqSub;
						sap.ui.getCore().byId(that.sSubBoqId).setValue(oContext.getObject().BoqSub);
						that.BoqDescR.BoqDesc = Boqdesc;
						//	that.BuildD(that.BoqDescR);
					}

					if (that.sSubBoq2Id !== "") {
						Boqdesc = oContext.getObject().BoqDesc;
						that.sSubBoq = oContext.getObject().BoqSub;
						that.sSubBoq2 = oContext.getObject().BoqSub;
						sap.ui.getCore().byId(that.sSubBoq2Id).setValue(oContext.getObject().BoqSub);
						that.BoqDescR.BoqDesc = Boqdesc;
						//	that.BuildD();
					}
				});
			} else {
				sap.m.MessageToast.show("No new item was selected.");
			}
			// oEvent.getSource().getBinding("items").filter([]);
			this.sSubBoq2Id = "";
			this.sSubBoqId = "";
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
			that.getView().byId("idLongText").setText(object.ShortDesc); //LongDesc
		},
		onCloseLongTextFragment: function (oEvent) {
			this._longTextDialog.close();
		},
		onExpandFirstLevel: function () {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.expandToLevel(3);
		},
		onCollapseAll: function () {
			var oTreeTable = this.byId("TreeTableBasic");
			oTreeTable.collapseAll();
		},
		///////////////veration order And ad/////[E.a]
		handleOpenActionSheetVOA: function (oEvent) {
			var oButton = oEvent.getSource();

			// create action sheet only once
			if (!this._actionSheetVOA) {
				this._actionSheetVOA = sap.ui.xmlfragment("com.cicre.po.view.fragments.ActionVOADialog", this);
				this.getView().addDependent(this._actionSheetVOA);
			}

			this._actionSheetVOA.openBy(oButton);

		},

		onvariation_Order: function () {

			var that = this;
			if (that.sProjectCode !== "" && that.sCoCode !== "") {
				if (!that._varOrdDialog) {
					that._varOrdDialog = sap.ui.xmlfragment("com.cicre.po.view.fragments.SelectMultiWBS", that);
					var i18nModel = new sap.ui.model.resource.ResourceModel({
						bundleUrl: "i18n/i18n.properties"
					});
					that._varOrdDialog.setModel(i18nModel, "i18n");
					that._varOrdDialog.setModel(that.getView().getModel());
				}

				that._varOrdDialog.open();
				var mModel = that.getView().getModel();

				var oModelJson = new sap.ui.model.json.JSONModel();
				oModelJson.setData({
					"VariationOrderSet": []
				});
				that._varOrdDialog.setModel(oModelJson, "localJson");

				var filters = [];
				var oFilter1 = new sap.ui.model.Filter("ContractNo", sap.ui.model.FilterOperator.EQ, "00235");

				filters.push(oFilter1);

				mModel.read("/OrderHeaderSet", {
					filters: filters,
					success: function (oData) {

						var data = JSON.parse(JSON.stringify(oData.results));
						that._varOrdDialog.getModel("localJson").setProperty("/VariationOrderSet", data);
					},
					error: function (e) {
						sap.m.MessageToast.show("Error");
					}
				});

			} else {
				sap.m.MessageToast.show("Please select Company Code and Project first.");
			}
		},
		////////[E.A]
		onVoewAfterClose: function (oEvent) {
			var that = this;
			oEvent.getSource().destroy();
			that._View2Sheet = null;
		},
		///////[E.A]
		_action2Sheet: null,
		handleOpenActionSheet: function (oEvent) {
			;
			if (this.getView().byId("idCreationType").getSelectedKey() === "O") {
				var oButton = oEvent.getSource();
				// create action sheet only once
				if (!this._action2Sheet) {
					this._action2Sheet = sap.ui.xmlfragment("com.cicre.po.view.fragments.ActionSheetDialog", this);
					this.getView().addDependent(this._action2Sheet);
				}
				this._action2Sheet.openBy(oButton);
				sap.ui.getCore().byId("idonAddBuildings").setVisible(false);
				sap.ui.getCore().byId("idonAddWBS").setVisible(true);
				sap.ui.getCore().byId("idonAddBuildingsC").setVisible(false);
				sap.ui.getCore().byId("idonAddWBSC").setVisible(false);
			} else {
				sap.m.MessageToast.show("you should select Creation original order");
			}
		},

		/////////////////////////// open add wbs dialog
		onWBSSelectionValueHelpPressB: function (oEvent) {

			var that = this;
			that.fragmentType = '';
			var StatusOr = this.getModel("localJson").getProperty("/StatusOr");
		   if(oEvent.getSource().getId().lastIndexOf("idAddPurchaseRequisitionc") > -1){
                that.fragmentType = 'PR';
		    }
			if (this.PurchDoc !== "" && StatusOr === "Released Original" && this.getView().byId("idCreationType").getSelectedKey() === "O") {
				if (StatusOr === 'Released Original') {
					//sap.m.MessageToast.show("Model and  Boq is already added!");
					var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
					for (var i = 0; i < HeadToHeadVariation.length; i++) {
						if (HeadToHeadVariation[i].Status === "C") {
							if (HeadToHeadVariation[i].UserOrder === "" || HeadToHeadVariation[i].OrderDesc === "") {
								sap.m.MessageToast.show("Please Enter Manadatory Fields");
								return;
							}
							this.Composing = HeadToHeadVariation[i].Status;
						}

					}
					if (this.Composing == "" || this.Composing === "R") {
						sap.m.MessageToast.show("Please Create Variation order or Addenum");
						that.getView().getModel("localJso").setProperty("/VariationMode", false);
					} else {

						if (that.sProjectCode !== "" && that.sCoCode !== "") {
						
							if( that.fragmentType === 'PR'){
								this.onPRSelectionValueHelpPress();
							 }else{
								that.onWBSSelectionValueHelpPress();
							}
						} else {
							sap.m.MessageToast.show("Please select Company Code and Project first.");
						}
					}
				} else {
					sap.m.MessageToast.show("Please select Creation Type is Original .");
				}
			}
			else {
				if( that.fragmentType === 'PR'){
					this.onPRSelectionValueHelpPress();
				 }else{
					that.onWBSSelectionValueHelpPress();
				}
				
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
			that._oWBS2Dialog.close();

		},

		handleSearchBuildingPress: function () {
			var that = this;
			var mModel = that.getView().getModel(),
				Boqvisible = true,
				dataModel = that.getView().getModel("localJson");
			var filters = [];
			var oFilter1 = new sap.ui.model.Filter("Zone", sap.ui.model.FilterOperator.EQ, that.sProj);
			var oFilter2 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, that.sCoCode);
			var oFilter3 = new sap.ui.model.Filter("BuildingNo", sap.ui.model.FilterOperator.EQ, that.Building);
			var oFilter4 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
			var oFilter5 = new sap.ui.model.Filter("Group", sap.ui.model.FilterOperator.EQ, that.GroupCode);
			var oFilter6 = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, that.ModelCodee);
			if (that.sProj !== "")
				filters.push(oFilter1);
			if (that.Building !== "")
				filters.push(oFilter3);
			if (that.GroupCode !== "") { filters.push(oFilter5); }
			if (that.ModelCodee !== "") { filters.push(oFilter6); }
			filters.push(oFilter2);
			filters.push(oFilter4);
			// if (sap.ui.getCore().byId("idBoqStatus").getSelectedKey() !== "")
			// filters.push(oFilter4);
			mModel.read("/BuildingSet", {
				filters: filters,
				success: function (oData) {
					$.each(oData.results, function (i, data) {
						if (data.Status === "")
							data.Status = "COMPOSING";

						if (i == 0) {
							that.oldmodelvalue = oData.results[i].Model
						}
						if (that.oldmodelvalue != oData.results[i].Model || that.oldmodelvalue === "") {
							Boqvisible = false
						}

					});


					that.BoqAll = "";
					that.BoqDescAll = "";
					that.getView().byId("idhandboq").setValue(that.BoqDescAll);

					var data = JSON.parse(JSON.stringify(oData.results));
					dataModel.setProperty("/BuildingSet", data);

					if (that.oldmodelvalue === "") {
						Boqvisible = false
					}
					if (Boqvisible) {
						that.getView().getModel("localJson").setProperty("/selectBoq", true);
					}
					dataModel.refresh();
				},
				error: function (e) {
					sap.m.MessageToast.show("Error");
				}
			});
		},
		////////////////////////////// project search value help ////////////////////////////////
		onDisplaySearchProjDialog: function (oEvent) {

			this.idSearch = oEvent.getSource().getId()//==="idSearchByProjectt"
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
					//this.idSearch=oEvent.getSource().getId()//==="idSearchByProjectt"
					if (that.idSearch === "idSearchByProjectt") {
						that.getView().byId("idSearchByProjectt").setValue(oContext.getObject().IdText);
						that.sProjj = oContext.getObject().IdNumber;
					}
					else {
						that.getView().byId("idSearchByProject").setValue(oContext.getObject().IdText);
						that.sProj = oContext.getObject().IdNumber;
					}

					//return oContext.getObject().Name;
				});
			} else {
				that.sProjj = "";
				that.sProj = "";

				that.getView().byId("idSearchByProject").setValue("");
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		handleSuggestProj: function (oEvent) {
			// if (this.sCoCode) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'BE'));
				// aFilters.push(new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.Contains, that.sCoCode));
				aFilters.push(new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sTerm));
			}
			// }
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},
		onSelectProjSuggestion: function (oEvent) {
			this.sProj = oEvent.getSource().getSelectedKey();
		},
		/// [E.A]
		addBuildingForvariation: function () {

			var that = this;
			var variationBuilding = that.getView().getModel("localJson").getProperty("/variationBuilding");

			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
			var BoqItemSet = that.getView().getModel("localJson").getProperty("/BoqItemSet");
			var PRItemSet = that.getView().getModel("localJson").getProperty("/PRItemSet"),
			    myPurchaseRequisition = that.getView().getModel("localJson").getProperty("/myPurchaseRequisition");
			var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/selectedBuilding")));
			var arrBuV = variationBuilding;
			var addTo = 0;
			var Model,
				obj = {};

			$.each(selectedBuilding, function (i, vb) {

				if (vb.vlive === "V") {
					var b = false;
					$.each(BoqItemSet, function (B, boqitem) {
						$.each(BoqItemSet[B].Categories, function (BC, boqitemCat) {
							if (vb.Group === boqitemCat.Data && ((vb.Model).length === 8 ? vb.Model : "00000" + vb.Model) === ((boqitemCat.Model).length === 8 ? boqitemCat.Model : "00000" + boqitemCat.Model)) {
								selectedBuilding[i].Add = "A";
								obj = {

									"Group": selectedBuilding[i].Zzgroup,
									"Status": "C",
									"DeleteInd": selectedBuilding[i].DeleteInd,
									"Action": selectedBuilding[i].Add, //T
									"ContractNo": that.ContractNo, //T
									"BuildingNo": selectedBuilding[i].BuildingNo === "" ? selectedBuilding[i].Model : selectedBuilding[i].BuildingNo, // boq.BuildingNo, //
									"Zzone": selectedBuilding[i].Project, //T
									"Model": selectedBuilding[i].Model,  //selectedBuilding[i].ModelType === "WB" ? "" : selectedBuilding[i].Model,// boq.Model, 
									"ModelDesc": selectedBuilding[i].ModelDesc === "" ? selectedBuilding[i].IdText : selectedBuilding[i].ModelDesc,
									"Boq": selectedBuilding[i].Group, //T
									"Amount": boqitemCat.PriceUnit,
									"Type":''
								}
								$.each(arrBuV, function (B, varB) {
									if (vb.Group === varB.Boq && vb.Model === varB.Model && vb.BuildingNo === varB.BuildingNo) {
										b = true;
									}
								})
								if (b === false) {
									//arrBuV.push(selectedBuilding[i]);
									arrBuV.push(obj);
								}
							}
						})
					})


				}

			})

			$.each(myPurchaseRequisition, function (i, vb) {

				if (vb.vlive === "V"  &&  vb.SrvStatus !== 'A') {
					var b = false;
					$.each(PRItemSet, function (B, PR) {
							if (vb.BuildingNo === PR.PrNumber) {
								vb.Add = "A";
								obj = {

									"Group": "",
									"Status": "C",
									"DeleteInd": vb.DeleteInd,
									"Action": vb.Add, //T
									"ContractNo": that.ContractNo, //T
									"BuildingNo": PR.PrNumber,
									"Zzone":  '',//vb.Project, //T
									"Model": "",//selectedBuilding[i].Model, , 
									"ModelDesc": vb.BoqDesc,// selectedBuilding[i].ModelDesc === "" ? selectedBuilding[i].IdText : selectedBuilding[i].ModelDesc,
									"Boq":  "",//selectedBuilding[i].Group, 
									"Amount": PR.PriceUnit,
									"Type":'PR'
								}
								$.each(arrBuV, function (B, varB) {
									if ( vb.BuildingNo === varB.BuildingNo ) {
										b = true;
									}
								})
								if (b === false) {

									arrBuV.push(obj);
								}
							}
					
					})


				}

			})

			$.each(HeadToHeadVariation, function (i, vb) {
				if (HeadToHeadVariation[i].Status === "C") {
					//HeadToHeadVariation[i].AddValues = parseFloat(HeadToHeadVariation[i].AddValues) + parseFloat(addTo);
					HeadToHeadVariation[i].ChangeInd = "X";
					$.each(arrBuV, function (o, objj) {
						objj.OrderNo = vb.OrderNo;
						vb.OrderItemsSet.push(objj);
					})
				}
			})

			that.getView().getModel("localJson").setProperty("/variationBuilding", arrBuV);
			that.getView().getModel("localJson").setProperty("/HeadToHeadVariation", HeadToHeadVariation);
			//that.getView().getModel("localJso").setProperty("/variationBuilding",that.variationBuildingVorA);

		},
		//[E.a]
		getModeandBoq: function (sPath, Add) {

			var that = this;
			var variationBuilding = that.getView().getModel("localJson").getProperty("/variationBuilding")

			var oModel = this.getView().getModel("localJson");
			var modelPath = sPath.substring(0, 13),
				sModel = oModel.getProperty(modelPath + "/Name"),
				PriceUnit = oModel.getProperty(modelPath + "/PriceUnit");

			var BoqPath = sPath.substring(0, 26),
				boq = oModel.getProperty(BoqPath + "/Name");
			$.each(that.myBuildingSet, function (b, bu) {
				if (boq == bu.Group && sModel == "00000" + bu.Model) {
					if (variationBuilding.length == 0) {
						that.myBuildingSet[b].Add = Add;
						that.myBuildingSet[b].PriceUnit = PriceUnit;

						variationBuilding.push(that.myBuildingSet[b]);
					} else {
						$.each(variationBuilding, function (b, bu) {
							if ("00000" + variationBuilding[b].Model == sModel && variationBuilding[b].Group == boq) {
								variationBuilding.splice(b, 1);
							}
						});
						that.myBuildingSet[b].Add = Add;
						that.myBuildingSet[b].PriceUnit = PriceUnit;
						variationBuilding.push(that.myBuildingSet[b]);
					}
				}
			});
			return (sModel, boq);
		},

		onDeleteService: function (oEvent) {

			//var oEvent =oEvent;
			var that = this;
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var currentView = this.getView();
			var i18nBundle = currentView.getModel("i18n").getResourceBundle();
			// Confirmation dialog
			var dialog = new sap.m.Dialog({
				title: i18nBundle.getText("Delete"),
				type: "Message",
				content: new sap.m.Text({
					text: i18nBundle.getText("Msg_srv_Delete")
				}),
				beginButton: new sap.m.Button({
					text: i18nBundle.getText("Delete"),
					type: "Emphasized",
					press: function () {
						dialog.close();


						var oModel = that.getView().getModel("localJson");
						var Add = "D"
						var data = that.getView().getModel("localJson").getProperty(sPath);

						if (data.EanCat === "R" || "U" || "C" && data.SrvStatus === "A") {
							sap.m.MessageToast.show("Can delete this service from App As Build");
						}
						else if (data.EanCat === "L" && data.SrvStatus === "A") {
							//that.getModeandBoq(sPath , Add);
						}
						else if (data.SrvStatus === "UA") {
							var oRowData = oModel.getProperty(sPath);
							//	oRowData.ChangeIndicator = (oRowData.DelInd === "Y") ? "" : "DeleteS";
							oRowData.DelInd = (oRowData.DelInd === "Y") ? "" : "Y";
							oRowData.Add = "D";
							oModel.setProperty(sPath, oRowData);
							that.onChangeQty("", sPath, "0");
						}
						//that.getModeandBoq(sPath , Add);
						//oModel.getProperty(sPath.substring(0,13 )+"/Name");
						//oModel.getProperty(sPath.substring(0,26 )+"/Name");


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
							oRowData.DelInd = "Y";//(oRowData.DelInd === "Y") ? "" : "Y";
							oRowData.ChangeIndicator = "Y";
							dialog.close();
							data.Boq = ((data.Model).length === 8 ? data.Model : "00000" + data.Model)
							that.deletesrv(data);
							that.deleteBOQliseConsolidate(data);
							oModel.setProperty(sPath, oRowData);
						}
						/*else if (data.SrvStatus === "A") {
							sap.m.MessageToast.show("you should handel this service");
							//  oRowData.ChangeIndicator = (oRowData.DelInd === "X") ? "" : "DeleteB";
							oRowData.DelInd = (oRowData.DelInd === "X") ? "" : "X";
						//	that.deletesrvA(data, sPath)
							dialog.close();
							oModel.setProperty(sPath, oRowData);
						}*/

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
							//oRowData.ChangeIndicator = (oRowData.DelInd === "X") ? "" : "DeleteB";
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
		//saving contract  changes
		onSave: function () {

			var that = this;
			var BoqConsulidatedItemSet = that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet");
			var BoqItemSet = that.getView().getModel("localJson").getProperty("/BoqItemSet");
			var AttachmentSet = that.getView().getModel("localJson").getProperty("/AttachmentSet");
			// var ContractPOSrvItemSet = that.getView().getModel("localJson").getProperty("/ContractPOSrvItemSet");
			var EstimatedContracts = that.getView().getModel("localJson").getProperty("/EstimatedContracts");
			var HeadToHeadVariation = that.getView().getModel("localJson").getProperty("/HeadToHeadVariation");
			var variationOrderContrats = that.getView().getModel("localJso").getProperty("/variationOrderContract/Description");
			var variationBuilding = that.getView().getModel("localJson").getProperty("/variationBuilding");
			var AddendumValue = parseFloat(that.getView().getModel("localJson").getProperty("/AddendumValue"));
			var VariationOrderValue = parseFloat(that.getView().getModel("localJson").getProperty("/VariationOrderValue"));
			var OriginalContractValue = parseFloat(that.getView().getModel("localJson").getProperty("/OriginalContractValue"));
			var variationorderper = parseFloat(that.getView().getModel("localJson").getProperty("/VariationOrderPre"));
			var PurchaseRequisitionSet = that.getView().getModel("localJson").getProperty("/myPurchaseRequisition"),
		    	PRItemSet = that.getView().getModel("localJson").getProperty("/PRItemSet"),
				ContractPONoteSet = that.getView().getModel("localJson").getProperty("/ContractPONoteSet")

			var prevariationfromorignal = parseFloat(OriginalContractValue) * .20;

			var DeletionInd = "";
			var OrderItemsSet = [];
			var POHeaderToPOItem = [];
			var ContractPOSrvItemSet = [];
			var HeadToHeadVariationNav = [];
			var poheadertopobuildingnav = [];
			var selectedBuilding = [];
		

			var currentView = this.getView();
			var i18nBundle = currentView.getModel("i18n").getResourceBundle();
			// Confirmation dialog

			var dialog = new sap.m.Dialog({
				title: i18nBundle.getText("Edit"),
				type: "Message",
				content: new sap.m.Text({
					text: i18nBundle.getText("Msg_Confirm_Save_Change")
				}),
				beginButton: new sap.m.Button({
					text: i18nBundle.getText("SaveChange"),
					type: "Emphasized",
					press: function () {


						var variationorderperformOriginal = parseFloat(OriginalContractValue) * ((parseFloat(variationorderper) + parseFloat(AddendumValue)) / 100)
						if (variationorderperformOriginal < VariationOrderValue) {
							sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("Total_of_variationorder_you_must_less_than", variationorderperformOriginal));
							that.getView().setBusy(false);
							return;
						}


						if (prevariationfromorignal <= VariationOrderValue && parseFloat(VariationOrderValue) != 0) {

							sap.m.MessageBox.warning(that.getView().getModel("i18n").getResourceBundle().getText("Total_variation_orders_exceeds_20_from_the_original"));
						}


						$.each(HeadToHeadVariation, function (H, HV) {
							$.each(HV.OrderItemsSet, function (iv, HVA) {
								HVA.Status = HV.Status;
								variationBuilding.push(HVA);
							})
						})
						/*HeadToHeadVariation[i].Status === "C" &&*/
						$.each(HeadToHeadVariation, function (i, boq) {
							if (that.PurchDoc !== "" && HeadToHeadVariation[i].VarStatus !== "R") {
								HeadToHeadVariationNav.push({
									"OrderNo": HeadToHeadVariation[i].OrderNo === "" ? "" : HeadToHeadVariation[i].OrderNo,
									"UserOrder": HeadToHeadVariation[i].UserOrder,
									"OrderType": HeadToHeadVariation[i].OrderType,
									"OrderDesc": HeadToHeadVariation[i].OrderDesc,
									"Type": HeadToHeadVariation[i].Type,//that.sValueorderType, 
									"OrderDate": HeadToHeadVariation[i].OrderDate === "" ? null : that.formatDate(HeadToHeadVariation[i].OrderDate) + "T00:00:00",
									"MonthIndex": HeadToHeadVariation[i].MonthIndex.toString(),
									"AddValues": '' + parseFloat(HeadToHeadVariation[i].AddValues).toFixed(that.CustomCurrency) + '' === "" ? "0.0" : '' + parseFloat(HeadToHeadVariation[i].AddValues).toFixed(that.CustomCurrency) + '',
									"OmissionValues": '' + parseFloat(HeadToHeadVariation[i].OmissionValues).toFixed(that.CustomCurrency) + '' === "" ? "0.0" : '' + parseFloat(HeadToHeadVariation[i].OmissionValues).toFixed(that.CustomCurrency) + '',// === "",// ? null : ,//"0.0",//''+ parseFloat(that.Omission)+'' === ""? HeadToHeadVariation[i].OmissionValues : ''+ parseFloat(that.Omission)+'',
									"ChangeAmount": '' + parseFloat(HeadToHeadVariation[i].ChangeAmount).toFixed(that.CustomCurrency) + '' === "" ? "0.0" : '' + parseFloat(HeadToHeadVariation[i].ChangeAmount).toFixed(that.CustomCurrency) + '',//"0.0",
									"DaysNo": (HeadToHeadVariation[i].DaysNo).toString(),
									"MonthNo": (HeadToHeadVariation[i].MonthNo).toString(),
									"Action": HeadToHeadVariation[i].Action,//that.sValueAction,
									"ContractNo": that.ContractNo,
									"Status": HeadToHeadVariation[i].Status,//variationOrderContracts[i].States,
									"OrderItemsSet": OrderItemsSet,
									"ChangeInd": HeadToHeadVariation[i].ChangeInd,
									"Currency": that.getView().byId("idCurrency").getValue(),
								});

								$.each(variationBuilding, function (i, boq) {
									if (boq.Status === "C") {
										$.each(BoqItemSet, function (B, boqitem) {
											$.each(BoqItemSet[B].Categories, function (BC, boqitemCat) {
												if (boq.Boq === boqitemCat.Data && ((boq.Model).length === 8 ? boq.Model : "00000" + boq.Model) === ((boqitemCat.Model).length === 8 ? boqitemCat.Model : "00000" + boqitemCat.Model)) {
													// if(boq.ModelType === "WB"){ delete boq.Model;}

													OrderItemsSet.push({
														"Group": boq.Group,
														//"OrderNo":HeadToHeadVariationNav.OrderNo,
														"OrderNo": boq.OrderNo,//variationOrderContracts[i].OrderNo,
														"OrderItem": boq.OrderItem,
														//  UserOrder:
														//   OrderType :
														"DeleteInd": boq.DeleteInd,
														"Action": boq.Action, //T
														"ContractNo": that.ContractNo, //T
														"BuildingNo": boq.BuildingNo, //=== "" ? boq.Model : boq.BuildingNo , // boq.BuildingNo, //
														"Zzone": boq.Zzone, //T
														"Model": boq.Model, //==="WB" ? "" : boq.Model ,// boq.Model, 
														"ModelDesc": boq.ModelDesc,//=== "" ? boq.IdText : boq.ModelDesc,
														"Boq": boq.Boq, //T
														// "BoqDesc": 
														"Amount": (parseFloat(boqitemCat.PriceUnit).toFixed(2)).toString()//(//).toString(),

													});
												}
											})
										})
									}
								});


							}
						});
						/// 
						$.each(that.myBuildingSet, function (i, building) {
							selectedBuilding.push(building);
						})
						$.each(that.myWBSSet, function (i, WB) {
							//WB.BuildingNo = WB.IdNumber;
							selectedBuilding.push(WB);
						})
						$.each(PurchaseRequisitionSet , function (i, PR) {
							PR.Group = '';
							PR.Project = '';
							PR.Model = '';

							selectedBuilding.push(PR);
						})

						$.each(selectedBuilding, function (B, Bui) {
							if (Bui.ChangeIndicator !== "" || Bui.DelInd !== "") {
								poheadertopobuildingnav.push({
									"PoHeader": that.PoNumber,
									"Buildingno": Bui.BuildingNo,
									"Zone": Bui.Project,
									"Model": Bui.Model,
									"Submodel": Bui.Group,
									"ContractualIndicator": Bui.ContractualIndicator === "" ? "O" : Bui.ContractualIndicator,
									"TextContInd": Bui.Txt,
									"VariationOrder": Bui.OrderNo,
									"ChangeIndicator": Bui.ChangeIndicator,
									"DeleteIndicator": Bui.DelInd,
									"SrvStatus": Bui.SrvStatus,
									"Network" : Bui.Network,
								//	"ActivityNumber" : Bui.ActivityNumber,
								    "Type" : Bui.ModelType

								})
							}

						})
						if(PurchaseRequisitionSet.length > 0 ){
				
							$.each(PRItemSet, function (i, PR) {
								$.each(PR.Categories, function (s, sub) {
										$.each(sub.Categories, function (k, srv) {
											POHeaderToPOItem.push({
												"PoHeader": that.PoNumber,
												"PoItem": "",
												"SubBoq": srv.SubModel,
												//"WbsElement": bu.Model,
												"DeleteInd": srv.DelInd,
												"Plant": "",// that.sPlant,
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
												"OvfTol": srv.OvfTol ? (srv.OvfTol).toString() : "0",
												"ChangeIndicator": "",
												"DeliveryDate": that.getView().byId("idDeliveryDate").getValue(),
												"ContractualIndicator":  "",//"O",
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
			

						if (poheadertopobuildingnav.length > 0) {
							$.each(BoqItemSet, function (i, boq) {
								$.each(boq.Categories, function (s, sub) {

									$.each(sub.Categories, function (j, cat) {
										$.each(cat.Categories, function (k, srv) {
										
											POHeaderToPOItem.push({
												"PoHeader": that.PoNumber,
												// "PoItem": srv.PoItem,
												// "SrvNo":srv.SrvNo,
												"Project": "",// bu.Project,
												"Boq": srv.Model,
												"SubBoq": BoqItemSet[i].Categories[s].Data,
												"Flag": "U",
												"DeleteInd": srv.DelInd,
												"Plant": "",
												"Matdesc": cat.ShortDesc,
												"MatlGroup": srv.Item,
												"Qty": parseFloat((srv.Qty).toString()).toFixed(2),
												"PoUnit": "",
												// "PriceUnit":(srv.Price).toString(), //srv.PriceUnit,
												"ItemCat": "D",
												"Acctasscat": "P",
												"ShortText": srv.ShortDesc,
												"LongText": srv.LongDesc,
												"Serviceno": srv.Data,
												"Servicedesc": srv.ShortDesc,
												"NoLimit": "X",
												"BaseUom": srv.Uom,
												"OvfTol": srv.OvfTol ? (srv.OvfTol).toString() : "0",
												"Buildingno": "",
												"DeliveryDate": that.getView().byId("idDeliveryDate").getValue(),
												"ChangeIndicator": "",//bu.ChangeIndicator,//srv.ChangeIndicator, //bu.ChangeIndicator,
												"ContractualIndicator": "",// bu.ContractualIndicator === "" ? "O" : bu.ContractualIndicator,
												"SrvStatus": "",
												"ServiceType": srv.Eancat,
												"VariationOrder": "",//bu.VariationOrder, //=== "" ? "" :  srv.VariationOrder,
												"Txt": "",
												"Currency": that.getView().byId("idCurrency").getValue(),
												"IuidRelevant": boq.ModelType === "WBS" ? "X" : ''
											});

										});
									});
								});
							});
						}
	
						$.each(POHeaderToPOItem, function (p, poItem) {
							$.each(BoqConsulidatedItemSet, function (i, item) {
								if (poItem.Serviceno === item.Data /*&&  poItem.Txt === item.Txt */) {
									POHeaderToPOItem[p].Plant = item.Plant;
									POHeaderToPOItem[p].PriceUnit = parseFloat(item.PriceUnit).toFixed(that.CustomCurrency);//.toString();
									// POHeaderToPOItem[p].BaseUom = item.BaseUom;
									POHeaderToPOItem[p].OvfTol = item.OvfTol ? (item.OvfTol).toString() : "0";
									POHeaderToPOItem[p].ProvisionRate = item.ProvisionRate ? (item.ProvisionRate).toString() : "0";
								}
							});
							$.each(that.POHeaderToPOSrv, function (s, srv) {
								if (poItem.Buildingno === srv.Buildingno && poItem.Txt === srv.Txt && poItem.MatlGroup === srv.MatlGroup && poItem.Serviceno === srv.Serviceno && poItem.SubBoq === srv.SubBoq) {
									POHeaderToPOItem[p].SrvNo = srv.SrvNo;
									POHeaderToPOItem[p].PoItem = srv.PoItem;
								}
							});
						

						});
						$.each(ContractPOSrvItemSet, function (p, poItem) {

							$.each(that.POHeaderToPOSrv, function (s, srv) {
								if (poItem.Boq === srv.Boq && poItem.Txt === srv.Txt && poItem.MatlGroup === srv.MatlGroup && poItem.Serviceno === srv.Serviceno && poItem.SubBoq === srv.SubBoq) {
									ContractPOSrvItemSet[p].SrvNo = srv.SrvNo;
									ContractPOSrvItemSet[p].PoItem = srv.PoItem;
								}
							});
							$.each(BoqConsulidatedItemSet, function (i, item) {
								if (poItem.Serviceno === item.Data && poItem.Txt === item.Txt) {
									ContractPOSrvItemSet[p].PriceUnit = parseFloat(item.PriceUnit).toFixed(that.CustomCurrency);//toString();
									ContractPOSrvItemSet[p].Currency = that.getView().byId("idCurrency").getValue();
									ContractPOSrvItemSet[p].ProvisionRate = item.ProvisionRate ? (item.ProvisionRate).toString() : "0";
								}
							});

						});



						$.each(EstimatedContracts, function (e, estItem) {
							if (estItem.ChangeIndicator !== "" || estItem.DelInd !== "") {
								POHeaderToPOItem.push({
									"PoHeader": that.PoNumber,
									"PoItem": estItem.PoItem === "" ? "" : estItem.PoItem,
									"SubBoq": "",
									"DeleteInd": estItem.DelInd,//estItem.DeleteInd,
									"Plant": "", //
									"MatlGroup": "", //ChangeIndicator
									"Amount": parseFloat(estItem.Amount).toFixed(that.CustomCurrency), //parseFloat(estItem.Amount.toString().replace(",", "")).toFixed(2),
									"PoUnit": "",
									"Boq": "",
									"ShortText": "", //
									"Serviceno": "",
									"Servicedesc": estItem.Servicedesc,
									"BaseUom": "", //item.UnitMeas,
									"WbsElement": "",
									"NoLimit": "",
									"Buildingno": "",
									"Project": "",
									"ContractualIndicator": "E",
									"ChangeIndicator": estItem.ChangeIndicator,
									"ServiceType": "E",
									"DeliveryDate": that.getView().byId("idDeliveryDate").getValue()
								});
							}
						});

						if(ContractPONoteSet.Flag != 'X'){
							ContractPONoteSet = {};}
						
				
						setTimeout(function () {
							var createdObject = {
								PoNumber: that.PoNumber,
								Flag: "U",
								DocType: that.getView().getModel("localJson").getProperty("/DocType"),
								Project: that.sProjectCode,
								Vendor: that.getView().getModel("localJson").getProperty("/Vendor"),
								PurchOrg: that.getView().getModel("localJson").getProperty("/PurchOrg"),
								PurGroup: that.getView().getModel("localJson").getProperty("/PurGroup"),
								CompCode: that.getView().getModel("localJson").getProperty("/CompCode"),
								DocDate: that.getView().getModel("localJson").getProperty("/DocDate") === "" ? null : that.getView().byId("idDocumentDate").getValue() + "T00:00:00",
								VperStart: that.getView().getModel("localJson").getProperty("/VperStart") === "" ? null : that.getView().byId("idValidFromDate").getValue() + "T00:00:00",
								VperEnd: that.getView().getModel("localJson").getProperty("/VperEnd") === "" ? null : that.getView().byId("idValidToDate").getValue() + "T00:00:00",
								Status: "",
								DeleteInd: "",

								ContractDesc: that.getView().byId("idContractDescription").getValue(),
								LongDesc: that.getView().byId("idLongDescription").getValue(),
								Currency: that.getView().byId("idCurrency").getValue(),
								MeasMethod: that.getView().byId("idMeasurementMethod").getSelectedKey(),
								ConstructionType: that.getView().byId("idConstructionType").getSelectedKey(),
							//	CommencementId: that.getView().byId("idCommencement").getSelectedKey(),
								RefContract: that.getView().byId("idRefrenceContract").getValue(),
								CreationDate: that.getView().byId("idDocumentDate").getValue() === "" ? null : that.getView().byId("idDocumentDate").getValue() + "T00:00:00",
								ValidFrom: that.getView().byId("idValidFromDate").getValue() === "" ? null : that.getView().byId("idValidFromDate").getValue() + "T00:00:00",
								ValidTo: that.getView().byId("idValidToDate").getValue() === "" ? null : that.getView().byId("idValidToDate").getValue() + "T00:00:00",
								SigninDate: that.getView().byId("idDeliveryDate").getValue() === "" ? null : that.getView().byId("idDeliveryDate").getValue() + "T00:00:00",
								RevisedValidTo: that.getView().byId("idRevisedValidToDate").getValue() === "" ? null : that.getView().byId("idRevisedValidToDate").getValue() + "T00:00:00",
							//	CommencementDate: that.getView().byId("idCommencementDate").getValue() === "" ? null : that.getView().byId("idCommencementDate").getValue() + "T00:00:00",
								IndexMonth: that.getView().byId("idIndexMonth").getSelectedKeys().join(),
								//ContDurationMonth: that.getView().byId("idContractDurationMonth").getValue(),
								//ContDurationDays: that.getView().byId("idContractDurationDays").getValue(),
								Consultant: that.sConsultant,
								ConsultantName: that.sConsultantName,
								Ss: that.getView().byId("idResponsiblepersonSS").getSelectedKey(),
								Ir: that.getView().byId("idResponsiblepersonIR").getSelectedKey(),
								SuperiorWbs: that.SupeiorWBSCode, //that.getView().byId("idSupeiorWBS").getValue(),
								//SuperiorWbs:that.getView().byId("idSupeiorWBS").getValue(),
								CreationType: that.getView().byId("idCreationType").getSelectedKey(),
								MarkUp: that.getView().byId("idMarkUp").getValue(),
								VendorName: that.sVendorName,
								PurchDoc: that.PurchDoc,
								ContractType: that.getView().getModel("localJson").getProperty("/ContractType"),
								AttachmentSet: AttachmentSet,
								POHeaderToPOItem: POHeaderToPOItem,
								POHeaderToPOBuildingNav: poheadertopobuildingnav,
								//	ContractPOSrvItemSet: ContractPOSrvItemSet,
								DocParNo: that.DocParNo,
								//	POHeaderToBoqItem: POHeaderToBoqItem,
								HeadToHeadVariationNav: HeadToHeadVariationNav,
								EstimatedContractValue: parseFloat(that.getModel("localJson").getProperty("/EstimatedContractValue")).toFixed(that.CustomCurrency),
								OriginalContractValue: parseFloat(that.getModel("localJson").getProperty("/OriginalContractValue")).toFixed(that.CustomCurrency),
								TotalContractValue: parseFloat(that.getModel("localJson").getProperty("/TotalContractValue")).toFixed(that.CustomCurrency),
								VariationOrderValue: parseFloat(that.getModel("localJson").getProperty("/VariationOrderValue")).toFixed(that.CustomCurrency),
								AddendumValue: parseFloat(that.getModel("localJson").getProperty("/AddendumValue")).toFixed(that.CustomCurrency),
								RevisedContractValue: parseFloat(that.getModel("localJson").getProperty("/RevisedContractValue")).toFixed(that.CustomCurrency),
								SerType: that.SERTYPE,
							//26-02	Exempted: that.getModel("localJson").getProperty("/Exempted"),
								Overviewstatus: that.getModel("localJson").getProperty("/Overviewstatus"),
								ContractPONoteNav:ContractPONoteSet
							};

							var oModel = that.getView().getModel();
							console.log(createdObject);
							that.getView().setBusy(true);
							oModel.create("/ContractPOHeaderSet", createdObject, {
								success: function (oData) {
									sap.m.MessageBox.success("Contract " + oData.PurchDoc + " Edited Successfully!", {
										//icon: sap.m.MessageBox.Icon.SUCCESS,
										title: "Success",
										onClose: function (oAction) {
											// that.getRouter().navTo("object", {
											// 	objectId: oData.PoNumber
											// });
											that._onObjectMatched();
										}
									});
									that.getView().setBusy(false);
								},
								error: function (e) {
									sap.m.MessageBox.error("Error in editing Contract", {
										//icon: sap.m.MessageBox.Icon.ERROR,
										title: "Error"
									});
									that.getView().setBusy(false);
								}
							});
						}, 2000);
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
		onChangeQty: function (oEvent, ssPath, qty, srv) {

			var that = this;
			var oModel = this.getView().getModel("localJson");
			if (oEvent !== "") {
				var path = oEvent.getSource().getBindingContext("localJson").getPath();
				var Qty = oEvent.getParameters().newValue;
			} else {
				var path = ssPath;
				var Qty = qty;
			}

			var sPath = that.getView().getModel("localJson").getProperty(path);
			if (sPath === null) {
				sPath = srv;
			}
			var modelPath = path.substring(0, 13),
				sModel = oModel.getProperty(modelPath + "/Name"),
				PriceUnit = oModel.getProperty(modelPath + "/PriceUnit"),
				AddNew = oModel.getProperty(modelPath + "/AddNew");
			if (AddNew !== "AN") {
				sPath.ChangeIndicator = "ChangeP";
			}
			//	sPath.ChangeIndR = "R";
			//
			//if(){}
			if (oEvent !== "") {
				var sPathv = oEvent.getSource().getBindingContext("localJson").getPath();
				var oModelv = this.getView().getModel("localJson");
				var oRowDatav = oModelv.getProperty(sPathv);
				var Add = "A";
				//lv.setProperty(sPathv, oRoModeowDatav);
				//this.getModeandBoq(sPathv , Add);
			}
			//
			var BoqItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var BoqConsulidatedItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
			var myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
			var myWBSSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myWBSSet")));
			var count = 0;
			var newQty = 0;
			if (sPath.ModelType === "BOQ") {
				$.each(myBuildingSet, function (i, bu) {
					if (bu.Model === sPath.Boq)
						++count;
				});
			} else {
				$.each(myWBSSet, function (i, bu) {
					if (bu.Model === sPath.Boq)
						++count;
				});
			}
			$.each(BoqItemSet, function (i, boq) {
				$.each(boq.Categories, function (j, sub) {
					$.each(sub.Categories, function (l, cat) {
						$.each(cat.Categories, function (k, srv) {

							if (sPath.Serviceno === srv.Serviceno && sPath.Txt === srv.Txt) {
								newQty = (parseFloat(newQty) + parseFloat(srv.Qty)).toString();
							}
						})
					})
				})
			})
			$.each(BoqConsulidatedItemSet, function (k, srv) {
				if (srv.Serviceno === sPath.Serviceno && srv.Txt === sPath.Txt) {
					BoqConsulidatedItemSet[k].Qty = newQty;// (parseInt(srv.Qty) + (parseInt(Qty) * count)).toString();
				}
			});

			that.getView().getModel("localJson").setProperty(path + "/Qty", Qty === "" ? "0" : JSON.parse(JSON.stringify(Qty)));
			//[eeeee]
			//that.getView().getModel("localJson").setProperty(path + "/ChangeIndicator", "ChangeQ");

			that.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(BoqConsulidatedItemSet.sort((a, b) => a.Data - b.Data))));
			that.onPriceConsolidatedChange("", sPath, JSON.parse(JSON.stringify(Qty)));
		},
		DataExport: function (oEvent) {


			var oController = this,
				obj = [];
			var BoqConsulidatedItemSet = oController.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet");
			$.each(BoqConsulidatedItemSet, function (s, srv) {
				if (srv.AsBuild2 !== "X" && srv.AsBuild !== "X") {
					obj.push({
						"PoHeader": srv.PoHeader,
						"ContractualIndicator": srv.Txt,
						"Services": srv.Data,
						"Servicedesc": srv.LongDesc,
						//	"LongDesc":srv.LongDesc,
						"Uom": srv.Uom,
						"Qty": srv.Qty,
						"PurchDoc": srv.PurchDoc,
						"PriceUnit": srv.PriceUnit,
						"sortNum": srv.sortNum
					})
				}
			})

			JSON.parse(JSON.stringify(obj.sort((a, b) => a.Services - b.Services)));
			obj.sort((a, b) => a.sortNum - b.sortNum)
			oController.getView().getModel("localJson").setProperty("/BoqConsulidatedItemSetex", obj);

			var aCols, aProducts, oSettings, oSheet;
            var  language, obj = [],
                aCols = oController.createColumnConfig();
            aProducts = oController.getModel("localJson").getProperty('/BoqConsulidatedItemSetex');
            oSettings = {
                workbook: { columns: aCols },
                dataSource: aProducts
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build()
                .then(function () {
					//MessageBox.error("Error when downloading data. Browser might not be supported!");
                })
                .finally(oSheet.destroy);

			
		/*	var model = controller.getView().getModel("localJson");
			if (model) {
				//controller.exportExcel(model, "BoqConsulidatedItemSet", "ConsolidatedPrices", [ "PoHeader","Txt","Data", "Servicedesc","LongDesc", "Qty", "PurchDoc", "PriceUnit"]);
				controller.exportExcel(model, "BoqConsulidatedItemSetex", "ConsolidatedPrices", ["PoHeader", "ContractualIndicator", "Services", "Servicedesc", "Uom", "LongDesc", "Qty", "PriceUnit"]);

			}*/
		}, 
		//-------------------DWN EXCel
		createColumnConfig: function () {
			var ResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			return [
				{
					label: 'PoHeader',
					property: 'PoHeader',
					width: '20'
				}, {
					label: 'ContractualIndicator',
					property: 'ContractualIndicator',
					width: '20'
				}, {
					label:'Services',
					property: 'Services',
					width: '25'
				}, {
					label: 'Servicedesc',
					property: 'Servicedesc',
					width: '30'
				}, {
					label: 'Uom',
					property: 'Uom',
					width: '20'
				}, {
					label: 'Qty',
					property: 'Qty',
					width: '23'
				}, {
					label: 'PriceUnit',
					property: 'PriceUnit',
					width: '23'
				}];

		},
		exportExcel: function (model, collection, filename, sortedColumns) {
			var controller = this;
			var col = [];
			var CollectionPath = "/";
			var date = false;
			var stringDate = false;
			var data = model.getData();
			for (var name in data) {
				if (name == collection) {
					CollectionPath = CollectionPath + name;
					var value = data[name];
					for (var name in value) {
						var value1 = value[name];
						for (var name in value1) {
							var tpe = value1[name];

							var colItem = {
								name: name,
								template: {
									content: "{" + name + "}"
								}
							};
							if (typeof sortedColumns === 'undefined') {
								//sortedColumns = 'default';
								if (name != "__metadata")
									col.push(colItem);
							} else {
								if (sortedColumns.includes(name)) {
									col.push(colItem);
								}
							}
							// if (sortedColumns.length > 0) {


							//}

						}
						if (typeof sortedColumns !== 'undefined') {
							col.sort(function (a, b) {
								return sortedColumns.indexOf(a.name) - sortedColumns.indexOf(b.name);
							});
						}
						break;
					}
				}
			}

			// Ceil numbers in the model
			$.each(data[collection], function (i, item) {
				for (var key in item) {
					if (item.hasOwnProperty(key)) {
						if (!isNaN(data[collection][i][key]) && key != "Services") {
							if (key != "Accumulative")
								data[collection][i][key] = controller.ceilNumberWithCommas(data[collection][i][key]);
							else
								data[collection][i][key] = controller.NumberWithCommas(data[collection][i][key]);
						}
					}
				}
			});

			var MyModel = new sap.ui.model.json.JSONModel(data);
			var oExport = new sap.ui.core.util.Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new sap.ui.core.util.ExportTypeCSV({
					separatorChar: ","
				}),

				// Pass in the model created above
				models: MyModel,

				// binding information for the rows aggregation
				rows: {
					path: CollectionPath
				},

				// column definitions with column name and binding info for the content

				columns: col
			});
			if (filename != "") {
				// download exported file
				oExport.saveFile(filename).always(function () {
					this.destroy();
				});
			}
		},
		ceilNumberWithCommas: function (x) {
			//x = Math.ceil(x);
			var parts = x.toString().split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
		},
		NumberWithCommas: function (x) {
			//x = Math.ceil(x);
			var parts = x.toString().split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
		},
		_handleValueHelpCloseWBS: function (oEvt) {
			var that = this,
				mModel = that.getView().getModel(),
				filters = [],
				selectedBuildingOrWBSCont = [];
			var oModelJson = new sap.ui.model.json.JSONModel();
			var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/selectedBuilding")));
			//var selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myWBSSet")));
			var objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
			var totalprice = "0.00";
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
					var selectedBuildingOrWBS = that.getView().getModel("localJson").getProperty("/selectedBuildingOrWBS"),
						HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
					$.each(selectedBuildingOrWBS, function (i, SelectBuilding) {
						var oFilter1 = new sap.ui.model.Filter("Data", sap.ui.model.FilterOperator.BT, SelectBuilding.Model, SelectBuilding.Group);
						if (oFilter1 !== "") { filters.push(oFilter1); }
					})
					var oFilter2 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
					if (oFilter2 !== "") { filters.push(oFilter2); }
					var oFilter3 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, that.sCoCode);
					if (oFilter3 !== "") { filters.push(oFilter3); }
					var oFilter4 = new sap.ui.model.Filter("Eancat", sap.ui.model.FilterOperator.EQ, 'W');
					if (oFilter4 !== "") { filters.push(oFilter4); }
					this.objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
					that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", []);
					var BoqConsulidatedItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
					var list = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
					//////////////////////////////////////////////////////////////////////////////////////
					mModel.read("/BoqTreeSet", {
						filters: filters,
						success: function (OData, responce) {

							OData = OData.results;
							var start = 1,
								BoqItemSet = [],
								ContractualIndicator = "O",
								VariationOrder = "",
								Action = "UA",
								UserOrde = "";
							$.each(OData, function (i, ServiceBoq) {

								$.each(HeadToHeadVariation, function (i, st) {
									if (HeadToHeadVariation[i].Status === "C") {
										ContractualIndicator = HeadToHeadVariation[i].OrderType;
										VariationOrder = HeadToHeadVariation[i].OrderNo;
										UserOrde = HeadToHeadVariation[i].UserOrder;
										//	Action=HeadToHeadVariation[i].Action;
									}
								});
								if (ContractualIndicator === "O") {
									var UserOrder = "Original";
								} else {
									var UserOrder = ContractualIndicator + "-" + UserOrde;
								}
								if (OData[i].LevelNo === "1") {
									OData[i].AddNew = "AN";
									OData[i].live = "one";
									//live: "one",
								}
								if (OData[i].Eancat === "" && parseInt(OData[i].LevelNo) === 4) {

									OData[i].Qty = "0";
									OData[i].Uom = "";
									OData[i].Price = "0";

								}
								OData[i].ModelType = "WBS";
								//	OData[i].DelInd = "";
								if (OData[i].Eancat === "U") { OData[i].Qty = 0; }
								if (parseInt(OData[i].LevelNo) === 4) {
									OData[i].Txt = UserOrder;
									OData[i].SrvStatus = Action;
									if (OData[i].Eancat != "") {
										OData[i].PriceUnit = "1";
										OData[i].Price = "1";
									}
									//OData[i].PriceUnit = "1";
									//	OData[i].Price = "1";
									OData[i].DelInd = "";
									OData[i].VariationOrder = VariationOrder;
									OData[i].ChangeIndicator = "addB";
									OData[i].ContractualIndicator = ContractualIndicator;
									OData[i].Indicator = "Y";
									totalprice = parseFloat(totalprice) + (parseFloat(OData[i].Qty) * parseFloat(OData[i].Price));

								} else {
									OData[i].Indicator = "Z";
								}

							});

						

							that.getView().getModel("localJson").setProperty("/myWBSSet", JSON.parse(JSON.stringify(that.myWBSSet)));
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
										//objSet.push(newNode);
									});
								}
							});

							var go = false;
							var found = false;
							$.each(TreeBoqItemSet, function (c, newNode) {
								go = false;

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
													//go= false;
												}
											}
											//	}
										})
									})
									//if(!go ) found = false;
									if (!go && !found) {
										that.objSet.push(newNode);
										go = false;

									}


								} else {
									that.objSet.push(newNode);
								}
								found = false;
								go = false;
							});
							that.getView().getModel("localJson").setProperty("/BoqItemSet", that.objSet);
							that.Consoliatedservices();
							that.ContractValueHeader();
							//that.getView().getModel("ConJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(end)));
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
											//BoqItemSet[i].Categories[j].Categories[l].Categories[k].ModelType = "WBS";


										});

									});
								});

							});

							$.each(consolidate, function (c, cons) {
								$.each(BoqItemSet, function (i, boq) {
									$.each(boq.Categories, function (j, sub) {
										$.each(sub.Categories, function (l, cat) {
											$.each(cat.Categories, function (k, srv) {

												if (cons.Data === srv.Data && cons.Txt === srv.Txt) {
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

														var ConsolidatedPrice = JSON.parse(JSON.stringify(parseFloat(cons.PriceUnit).toFixed(that.CustomCurrency)));
														BoqItemSet[i].Categories[j].Categories[l].Categories[k].price = ConsolidatedPrice;
														BoqItemSet[i].Categories[j].Categories[l].Categories[k].PriceUnit = (ConsolidatedPrice * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty)).toString();
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].PriceUnit = (parseFloat(BoqItemSet[i].PriceUnit) + (cons.PriceUnit * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].PriceUnit) + (cons.PriceUnit * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }
														if (srv.Eancat !== "C" && srv.Eancat !== "U") { BoqItemSet[i].Categories[j].Categories[l].PriceUnit = (parseFloat(BoqItemSet[i].Categories[j].Categories[l].PriceUnit) + (cons.PriceUnit * parseFloat(BoqItemSet[i].Categories[j].Categories[l].Categories[k].Qty))).toString(); }

													}
												}
											});

										});
									});

								});
							});

							that.getView().getModel("localJson").setProperty("/BoqItemSet", JSON.parse(JSON.stringify(BoqItemSet)));
							that.addBuildingForvariation();
							//	that.getView().getModel("ConJson").setProperty("/BoqConsulidatedItemSet", JSON.parse(JSON.stringify(BoqConsulidatedItemSet)));
						},

						error: function (e) {

							sap.m.MessageToast.show("Error");
						}
					});

					//////////////////////////////////////////////////////////////////////////////////////

				}
			}
		},
	
		_oMessagePopover: null,
		onPressMessagePopover: function (oEvent) {

			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			this._oMessagePopover.toggle(oEvent.getSource());
		},
		onWBSSelectionChange: function (oEvt) {

			var that = this;
			var oList = oEvt.getSource();
			var notExist = true,
				selectedBUWBS = [],
				nullGroup = [];
			that.BUBoQs = [];
			that.WBSBoQs = [];
			that.aContexts = [];
			var variationBuilding = that.getView().getModel("localJson").getProperty("/variationBuilding"),
				selectedBuildingOrWBS = that.getView().getModel("localJson").getProperty("/selectedBuildingOrWBS"),
				selectedIndices = this._contractDialog.getTable().getSelectedIndices();
			var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding");
			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
			that.myWBSSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myWBSSet")));
			if (selectedIndices.length > 0) {
				for (var i = 0; i < selectedIndices.length; i++) {
					var selectedBU = this._contractDialog.getTable().getContextByIndex(selectedIndices[i]).getObject();
					selectedBU.ChangeIndicator = "AddB";
					selectedBUWBS.push(selectedBU);

				}
				//var selectedBU = oEvt.getParameter("listItem").getBindingContext("localJson").getObject();
				//	selectedBU.ChangeIndicator = "AddB";
				$.each(selectedBUWBS, function (i, bu) {
					if (bu.Group === "") {
						nullGroup.push(bu.IdNumber);
						//sap.m.MessageToast.show("select Boq on building");
						notExist = false;
					}
				});
				//BuildingNo
				$.each(that.myWBSSet, function (i, bu) {
					$.each(selectedBUWBS, function (w, WBS) {
						if (WBS.IdNumber === bu.Boq && bu.Model === WBS.Model && bu.Group === WBS.Group) {
							nullGroup.push(bu.Boq);
							notExist = false;
						}
					});
				});
				if (notExist) {
					$.each(selectedBUWBS, function (w, WBS) {
						selectedBUWBS[w].ContractualIndicator = "O";
						selectedBUWBS[w].Txt = "Original";
						selectedBUWBS[w].BuildingNo = parseInt(selectedBUWBS[w].IdNumber).toString();
						$.each(HeadToHeadVariation, function (i, st) {
							if (HeadToHeadVariation[i].Status === "C") {
								selectedBUWBS[w].ContractualIndicator = HeadToHeadVariation[i].OrderType;
								selectedBUWBS[w].SrvStatus = "UA"
								selectedBUWBS[w].vlive = "V";
								selectedBUWBS[w].ModelType = "WB"
								selectedBUWBS[w].Txt = HeadToHeadVariation[i].OrderType + "-" + HeadToHeadVariation[i].UserOrder
								//variationBuilding.push(selectedBU);
							}
						});
						selectedBUWBS[w].SrvStatus = "UA";
						selectedBUWBS[w].DelInd = "";
						selectedBUWBS[w].WbsCode = selectedBUWBS[w].SelectionParameter;
						selectedBUWBS[w].DelInd = "";
						selectedBUWBS[w].AsBuild2 = "";
						selectedBUWBS[w].SubBoq = selectedBUWBS[w].Group;
						selectedBUWBS[w].BuildingNo = parseInt(selectedBUWBS[w].IdNumber).toString();
						that.myWBSSet.push(selectedBUWBS[w]);
						selectedBuildingOrWBS.push(selectedBUWBS[w]);
						selectedBuilding.push(selectedBUWBS[w]);
					})
					//selectedBuilding.push(selectedBUWBS);
					that.aContexts.push(selectedBUWBS);
					that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", selectedBuildingOrWBS);
					that.getView().getModel("localJson").setProperty("/selectedBuilding", selectedBuilding);
					this.onWBSContractClose();
					this._handleValueHelpCloseWBS();
					//	that.getView().getModel("localJson").setProperty("/selectedBuildinglist",selectedBuildinglist);
				} else if (!notExist) {
					var errormas = nullGroup.join();
					sap.m.MessageToast.show("WBS and  Boq is already added or don't select Boq" + errormas);

				
				}
			} else {

			}
		},
		onSelectionChange: function (oEvt) {


			var that = this;
			var oList = oEvt.getSource();
			var notExist = true,
				selectedBBuilding = [],
				nullGroup = [];
			that.BUBoQs = [];
			that.WBSBoQs = [];
			var variationBuilding = that.getView().getModel("localJson").getProperty("/variationBuilding");
			var BuildingSetreplace = this.getView().getModel("localJson").getProperty("/BuildingSet");
			var selectedBuilding = that.getView().getModel("localJson").getProperty("/selectedBuilding"),
				selectedIndices = this._BuildinDialog.getTable().getSelectedIndices(),
				selectedBuildingOrWBS = that.getView().getModel("localJson").getProperty("/selectedBuildingOrWBS");
			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
			that.myBuildingSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/myBuildingSet")));
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
						selectedBBuilding[w].ContractualIndicator = "O";
						selectedBBuilding[w].Txt = "Original";
						$.each(HeadToHeadVariation, function (i, st) {
							if (HeadToHeadVariation[i].Status === "C") {
								selectedBBuilding[w].ContractualIndicator = HeadToHeadVariation[i].OrderType;
								selectedBBuilding[w].SrvStatus = "UA";
								selectedBBuilding[w].AsBuild2 = "";
								selectedBBuilding[w].OrderNo = HeadToHeadVariation[i].OrderNo;
								selectedBBuilding[w].Txt = HeadToHeadVariation[i].OrderType + "-" + HeadToHeadVariation[i].UserOrder
								selectedBBuilding[w].vlive = "V";
								//variationBuilding.push(selectedBU);
							}
						});

						selectedBBuilding[w].SubBoq = selectedBBuilding[w].Group;
						selectedBBuilding[w].SrvStatus = "UA"
						that.myBuildingSet.push(selectedBBuilding[w]);
						selectedBBuilding[w].AsBuild2 = "";
						selectedBBuilding[w].DelInd = "";
						selectedBuilding.push(selectedBBuilding[w]);
						selectedBuildingOrWBS.push(selectedBBuilding[w]);
					})
					//	that.getView().getModel("localJso").getProperty("/variationBuilding", variationBuilding);
					that.getView().getModel("localJson").setProperty("/selectedBuilding", selectedBuilding);
					that.getView().getModel("localJson").setProperty("/selectedBuildingOrWBS", selectedBuildingOrWBS);
					that.aContexts.push(selectedBuilding);
					this.onBuildingContractClose();
					this._handleValueHelpCloseBuilding();
				} else if (!notExist) {
					var errormas = nullGroup.join();
					sap.m.MessageToast.show("Model and  Boq is already added or don't select Boq" + errormas);
					nullGroup = [];
				}
			}
		},
		////////////////// new BOQ Service
		// adding new Service
		onAddPress: function () {
			var that = this;

			if (!that._selectSDialog) {
				that._selectSDialog = sap.ui.xmlfragment(that.getView().getId(), "com.cicre.po.view.fragments.AddService", that);
				that.getView().addDependent(that._selectSDialog);
			}

			jQuery.sap.delayedCall(0, this, function () {
				that.getView().byId("idSelectBoq").setValue("");
				that.getView().byId("idSelectService").setValue("");
				that.getView().byId("idSelectSub").setSelectedKey("");
				that.getView().byId("idInputQty").setValue("");
				that.getView().byId("idInputMatGrp").setValue("");
				that.getView().byId("idInputMatGrpDesc").setValue("");

				that._selectSDialog.open();
			});
		},
		addServiceBoqSelectionChange: function (oEvent) {
			var that = this;
			var oFilter1 = new sap.ui.model.Filter("Boq", sap.ui.model.FilterOperator.EQ, that.getView().byId("idSelectBoq").getValue());
			// var oFilter3 = new sap.ui.model.Filter("SelectionParameter2", sap.ui.model.FilterOperator.Contains, that.sCoCode);

			var oBinding = that.getView().byId("idSelectSub").getBinding("items");
			oBinding.filter([oFilter1]);
		},
		// select Service dialog
		onDisplaySearchServiceDialog: function () {
			var that = this;
			if (that._selectDialog) {
				that._selectDialog.destroy();
				that._selectDialog = null;
			}
			if (!that._selectDialog) {
				that._selectDialog = sap.ui.xmlfragment(that.getView().getId(), "com.cicre.po.view.fragments.ServiceSearchDialog", that);
				that.getView().addDependent(that._selectDialog);
			}

			jQuery.sap.delayedCall(0, this, function () {
				that._selectDialog.open();
			});
			var oTemplate = new sap.m.StandardListItem({
				title: "{IdText}",
				description: "{= parseFloat(${IdNumber})}"
			});
			var aFilters = [];
			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'SRV');
			aFilters.push(oFilter1);
			that._selectDialog.bindAggregation("items", {
				path: "/ValueHelpSet",
				template: oTemplate,
				filters: aFilters
			});
		},
		//selecting service
		onSelectServiceList: function (oEvent) {
			var that = this;
			var mModel = that.getView().getModel();
			var aContexts = oEvent.getParameter("selectedContexts");
			var BoqItemSet = that.getView().getModel("localJson").getProperty("/BoqItemSet");

			if (aContexts && aContexts.length) {
				aContexts.map(function (oContext) {
					that.sServiceCode = parseFloat(oContext.getObject().IdNumber);
					that.sServiceText = oContext.getObject().IdText;
					that.getView().byId("idSelectService").setValue(that.sServiceText);
				});

				mModel.callFunction("/BOQGetMatServiceAction", {
					method: "GET",
					urlParameters: {
						"Serviceno": that.sServiceCode
					},
					success: function (oData) {
						that.matchingMaterial = oData.Item;
						that.UnitMeas = oData.UnitMeas;
						that.Matdesc = oData.Matdesc;
						if (that.matchingMaterial === "") {
							that.getView().byId("idInputMatGrp").setEnabled(true);
							that.getView().byId("idInputMatGrpDesc").setEnabled(true);
						} else {
							that.getView().byId("idInputMatGrp").setEnabled(false);
							that.getView().byId("idInputMatGrpDesc").setEnabled(false);
							that.getView().byId("idInputMatGrp").setValue(that.matchingMaterial);
							that.getView().byId("idInputMatGrpDesc").setValue(that.Matdesc);
						}
					},
					error: function (e) {

					}
				});

			} else {
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		//search in Service value help dialog
		handleSearchService: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oTemplate = new sap.m.StandardListItem({
				title: "{IdText}",
				description: "{= parseFloat(${IdNumber})}"
			});
			var aFilters = [];

			var oFilter1 = new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'SRV');
			var oFilter2 = new sap.ui.model.Filter("SelectionParameter", sap.ui.model.FilterOperator.Contains, sValue);
			aFilters.push(oFilter1);
			aFilters.push(oFilter2);

			this._selectDialog.bindAggregation("items", {
				path: "/ValueHelpSet",
				template: oTemplate,
				filters: aFilters
			});
		},
		//adding service
		onSaveService: function (oEvent) {
			var that = this;
			var inputs = [
				that.getView().byId("idSelectBoq"),
				that.getView().byId("idSelectSub"),
				that.getView().byId("idSelectService"),
				that.getView().byId("idInputQty"),
				that.getView().byId("idInputMatGrp"),
				that.getView().byId("idInputMatGrpDesc")
			];
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
			if (!canContinue) {
				sap.m.MessageToast.show("Please Enter Manadatory Fields");
				return;
			} else {
				var object = {
					"Name": that.getView().byId("idInputMatGrpDesc").getValue(),
					"Item": that.getView().byId("idInputMatGrp").getValue(),
					"Matdesc": that.getView().byId("idInputMatGrpDesc").getValue(),
					"ModelType": that.getView().byId("idSelectBoq").getSelectedKey(),
					"ChangeIndicator": "AddB",
					"PriceUnit": "0",
					"Categories": {
						"DelInd": "",
						"Boq": that.getView().byId("idSelectBoq").getValue(),
						"LongText": "",
						"Servicedesc": that.sServiceText,
						"Matdesc": that.getView().byId("idInputMatGrpDesc").getValue(),
						"Name": (that.sServiceCode).toString(),
						"PriceUnit": (1 * parseFloat(that.getView().byId("idInputQty").getValue())).toString(),
						"Serviceno": (that.sServiceCode).toString(),
						"Flag": "",
						"UnitMeas": "",
						"Qty": that.getView().byId("idInputQty").getValue(),
						"ModelType": that.getView().byId("idSelectBoq").getSelectedKey(),
						"ChangeIndicator": "AddS",
						"Item": that.getView().byId("idInputMatGrp").getValue(),
						"SrvNo": ""
					}
				};
				var boqList = that.getView().getModel("localJson").getProperty("/BoqItemSet");
				var boqIndex = "";
				var index = "";
				var catIndex = "";
				var found = false;

				jQuery.each(boqList, function (i, value) {
					if (value.Name === that.getView().byId("idSelectBoq").getValue()) {
						boqIndex = i;
						jQuery.each(value.Categories, function (c, cat) {

							if (cat.Name === that.getView().byId("idSelectSub").getSelectedKey()) {
								index = c;
								$.each(boqList[i].Categories[c].Categories, function (j, item) {
									if (item.Item === object.Item) {
										catIndex = j;

										$.each(boqList[i].Categories[c].Categories[j].Categories, function (s, srv) {
											if (srv.Serviceno === object.Serviceno) {
												found = true;
											}
										});

									}

								});
							}
						});
					}
				});
				if (found)
					sap.m.MessageToast.show("Duplicate Service for This Boq");
				else {
					if (catIndex === "") {
						boqList[boqIndex].Categories[index].Categories.push(object);
						that.getView().getModel("localJson").setProperty("/BoqItemSet", boqList);
					} else {
						boqList[boqIndex].Categories[index].Categories[catIndex].Categories.push(object.Categories);
						that.getView().getModel("localJson").setProperty("/BoqItemSet", boqList);
					}
					var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));
					$.each(consolidate, function (c, con) {
						if (con.Serviceno === object.Serviceno) {
							found = true;
						}
					});
					that._selectSDialog.close();

				}

			}
		},
		onCancelService: function (oEvent) {
			this._selectSDialog.close();
		},
		changeCreationType: function () {

			if (this.getView().byId("idCreationType").getSelectedKey() === "E" && this.getView().getModel("localJson").getProperty("/Status") === "COMPOSING")
				this.getView().getModel("localJson").setProperty("/estimatedMode", true);

			else if (this.getView().byId("idCreationType").getSelectedKey() === "O" && this.getView().getModel("localJson").getProperty("/Status") !== "COMPOSING")
				this.getView().getModel("localJson").setProperty("/estimatedMode", false);

			else if (this.getView().byId("idCreationType").getSelectedKey() === "O" && this.getView().getModel("localJson").getProperty("/Status") === "COMPOSING" && this.getView().getModel("localJson").getProperty("/EstimatedContracts").length === 0)
				this.getView().getModel("localJson").setProperty("/estimatedMode", false);
			else if (this.getView().byId("idCreationType").getSelectedKey() === "O" && this.getView().getModel("localJson").getProperty("/Status") === "COMPOSING" && this.getView().getModel("localJson").getProperty("/EstimatedContracts").length !== 0) {
				sap.m.MessageBox.error("Estimated partition data must be deleted first!", {
					title: "Error"
				});
				this.getView().byId("idCreationType").setSelectedKey("E");
			}
		},
		//////////////////////// add estimated services ///////////////////////////

		handleAddEstimatedContract: function () {
			var that = this;
			var EstimatedContracts = that.getModel("localJson").getProperty("/EstimatedContracts");

			var itemRow = {
				Servicedesc: "",
				Amount: "",
				DelInd: "",
				ChangeIndicator: "AddE",
				SrvStatus: "UA",
			}

			EstimatedContracts.push(itemRow);
			that.getModel("localJson").setProperty("/EstimatedContracts", EstimatedContracts);
		},
		deleteEstimatedContract: function (oEvent) {

			var that = this;
			var aFilters = [];
			var EstimatedContracts = that.getModel("localJson").getProperty("/EstimatedContracts");
			var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
			var index = splitedPath[2];
			var data = EstimatedContracts.index;
			EstimatedContracts[index].DelInd = "X";
			aFilters.push(new sap.ui.model.Filter("DelInd", sap.ui.model.FilterOperator.NE, 'X'))
			//EstimatedContracts.splice(index, 1);	
			that.getModel("localJson").setProperty("/EstimatedContracts", EstimatedContracts);
			this.byId('idEstimatedServicesTable').getBinding("rows").filter(aFilters);
			//that.byId('idEstimatedServicesTable').getBinding("").filter(new Filter("DelInd", FilterOperator.NE,'Y'));
			//that.byId('idEstimatedServicesTable').getBinding("rows").filter(new Filter("DelInd", FilterOperator.NE,'X'));
			that.getModel("localJson").refresh(true);
			this.ContractValueHeader();

		},
		////
		onDisplaySearGroupfilterr: function (oEvent) {
			//this.vendorInd = oEvent.getParameters().id;

			if (this._GroupDialogg) {
				this._GroupDialogg.destroy();
				this._GroupDialogg = null;
			}
			if (!this._GroupDialogg) {
				this._GroupDialogg = sap.ui.xmlfragment("com.cicre.po.view.fragments.groupSearchDialogfilter", this);
				this.getView().addDependent(this._GroupDialogg); // 
				// this._GroupDialogg.setModel(this.getView().getModel());
			}
			var oModelJson = new sap.ui.model.json.JSONModel();
			oModelJson.setData({
				"SupeiorWBSSet": []
			});
			that._SuperiorWBSDialog.setModel(oModelJson, "localJson");

			var oTemplate = new sap.m.StandardListItem({
				title: "{localJson>Zzgroup}",
				description: "{localJson>Zzgroup}",
				type: "Active"
			});

			this._GroupDialogg.bindAggregation("items", {
				path: "localJson>/myBuildingSet",
				template: oTemplate,
				templateShareable: false
			});

			this._GroupDialogg.open();


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

			//if (oEvent.getParameters().id === "__component0---object--idConsultant")
			//	this.consultantIndecator = "X";
			//	if ((this.vendorInd === "idSearchByVendor" ? this.this.sCoCode : this.sCoCode) && (this.vendorInd === "idSearchByVendor" ? this.sPOrg : this.sPOrg)) {
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
			//	sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("Msg_Error_Select_CO_PORG"));
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

					/*	if (that.vendorInd === "__component0---object--idSearchByVendor") {
							that.sSearchVendor = oContext.getObject().IdNumber;
							sap.ui.getCore().byId("__component0---object--idSearchByVendor").setValue(oContext.getObject().IdText);
						}
						if (that.vendorInd === "__component0---object--idConsultant") {
							that.sConsultant = oContext.getObject().IdNumber;
							that.sConsultantName = oContext.getObject().IdText;
							sap.ui.getCore().byId("__component0---object--idConsultant").setValue(oContext.getObject().IdText);
						}*/
					//if (that.vendorInd === "__component0---object--idVendor") {
					//if (that.consultantIndecator === "") {
					that.sVendor = oContext.getObject().IdNumber;
					that.sVendorName = oContext.getObject().IdText;
					that.getView().byId("idVendor").setValue(oContext.getObject().IdText);
					mModel.callFunction("/GetCurrencyExecuteAction", {
						method: "GET",
						urlParameters: {
							"Vendor": that.sVendor
						},
						success: function (oData) {
							console.log(oData);

							that.getView().byId("idCurrency").setValue(oData.Currency);
							if (oData.Currency === "USD") {
								that.CustomCurrency = 2;
							} else {
								that.CustomCurrency = 2;
							}
							that.getView().getModel("localJson").setProperty("/Currency", oData.Currency);
						},
						error: function (e) {

						}
					});
					//}
					/*else {
					   that.sConsultant = oContext.getObject().IdNumber;
					   that.sConsultantName = oContext.getObject().IdText;
					   that.getView().byId("idConsultant").setValue(oContext.getObject().IdText);
				   }*/
					//}

					//return oContext.getObject().Name;
				});
			} else {
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
			that.consultantIndecator = "";
			that.vendorInd = "";
		},
		///////////////////////////////] contract type
		changeContractType: function () {
			var that = this;
			if (that.getView().byId("idMeasurementMethod").getSelectedKey() === "LUMP" || that.getView().byId("idMeasurementMethod").getSelectedKey() === "COST")
				that.getView().byId("idTolerance").setVisible(false);
			else
				that.getView().byId("idTolerance").setVisible(true);

			if (that.getView().byId("idMeasurementMethod").getSelectedKey() === "COST")
				that.getView().byId("idMarkUp").setVisible(true);
			else
				that.getView().byId("idMarkUp").setVisible(false);

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
					that.aContexts.splice(index, 1);

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
						that.getView().getModel("localJson").setProperty("/CompDesc", that.sCoText);
					}
					//return oContext.getObject().Name;
				});
			} else {
				that.sCoCode = "";
				that.sCoText = "";
				that.getView().getModel("localJson").setProperty("/CompDesc", that.sCoText);
				sap.m.MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
			this.compInd = "";
		},
		onSearchCompanyChange: function () {
			this.sCoCode = "";
			this.sCoText = "";
			this.getView().getModel("localJson").setProperty("/CompDesc", this.sCoText);
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
		/////[E.a]
		AddValueVariation: function (BoqItemSet) {

			var that = this;
			var index;
			var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
			$.each(HeadToHeadVariation, function (i, st) {
				if (HeadToHeadVariation[i].Status === "C") {
					index = i;
				}
			});
			var addVA = 0
			var data = HeadToHeadVariation[index];
			$.each(BoqItemSet, function (c, cons) {
				addVA = parseFloat(addVA) + parseFloat(BoqItemSet[c].PriceUnit);
			});

			if (that.addVAOld === "") {
				that.addVAOld = addVA;
			};
			if (parseFloat(addVA) === parseFloat(that.addVAOld)) {
				that.addVAOld = addVA;
				var add = parseFloat(addVA) - parseFloat(that.addVAOld);
				data.ChangeInd = "X";
			} else if (parseFloat(addVA) > parseFloat(that.addVAOld)) {
				var add = parseFloat(addVA) - parseFloat(that.addVAOld);
				//data.AddValues = parseFloat(data.AddValues) + parseFloat(add);
				data.ChangeAmount = parseFloat(data.ChangeAmount) + parseFloat(add)
				//data.ChangeAmount= parseFloat(addVA) - parseFloat(that.addVAOld);
				data.ChangeInd = "X";
				//data.AddValues = add;
				that.addVAOld = addVA;
			} else {
				var Omission = parseFloat(that.addVAOld) - parseFloat(addVA);
				var add = parseFloat(addVA) - parseFloat(that.addVAOld);
				that.addVAOld = addVA;
				data.OmissionValues = parseFloat(data.OmissionValues) + parseFloat(Omission);//).substring(0, 8);
				//  data.ChangeAmount=parseFloat(data.AddValues) - parseFloat(data.OmissionValues);
				data.ChangeInd = "X";

			}
			// HeadToHeadVariation.setProperty(index,data);
			that.getModel("localJson").setProperty("/HeadToHeadVariation" + index, data);
			///  oModel.setProperty(sPath, oRowData)
		},
		///////////////add variationOrder////[E.A]///////////////////
		handlevariationOrder: function () {
			var that = this;
			var VariationOrderPre = parseFloat(that.getModel("localJson").getProperty("/VariationOrderPre"));
			var variationOrderContract = that.getModel("localJso").getProperty("/variationOrderContract");
			if (VariationOrderPre === 0) {
				sap.m.MessageToast.show(that.getView().getModel("i18n").getResourceBundle().getText("Please_add_the_original_percentage_from_contract_terms_applaction"));
			} else {

				if (variationOrderContract.length >= 1) {
					that.getView().getModel("localJson").setProperty("/VariationMode", false);
				} else {
					//	that.getView().byId("id_Amount").setValue(x);
					//var Omission = that.getView().byId("id_Amount").getValue();
					var AddValues = 0;
					var consolidate = that.getView().getModel("localJson").getProperty("/BoqItemSet");
					//var Omission = that.getView().byId("id_Amount").getValue();
					$.each(consolidate, function (c, cons) {
						AddValues = parseFloat(AddValues) + parseFloat(consolidate[c].PriceUnit);
					});
					//	Omission= parseFloat(Amount)-parseFloat(Omission);
					//	that.getView().byId("id_Amount").setValue(that.Amount);	
					var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
						pattern: "yyyy-MM-dd"
					});/*
		 RelDate = oDateFormat.format(new Date()),*/
					var itemRow = {
						UserOrder: "",//
						OrderDesc: "",//
						Type: "",// ok
						OrderDate: oDateFormat.format(new Date()),// ok
						MonthIndex: "",//ok
						AddValues: "0.00",//AddValues,//
						OmissionValues: "0.00",//
						ChangeAmount: "0.00",//Amount,
						DaysNo: "",//
						MonthNo: "",
						Action: "", //ok
						Status: "C",//ok
						OrderType: "V",//
						OrderNo: "",
						VarStatus: "",

					}
					//= new sap.ui.model.Filter("ValueHelpType", sap.ui.model.FilterOperator.EQ, 'PORG');
					// this.byId('VariationOrderTable').getBinding("rows").filter(new sap.ui.model.Filter("OrderType", sap.ui.model.FilterOperator.NE,'V'));
					var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
					that.getView().getModel("localJso").setProperty("/VariationMode", false);
					HeadToHeadVariation.push(itemRow);
					that.getModel("localJson").setProperty("/HeadToHeadVariation", HeadToHeadVariation);
				}

			}
		},
		onReleaseVeriation: function (oEvent) {
			var dataModel = this.getView().byId("VariationOrderTable").getModel("localJson");
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
			//	var index = parseInt(splitedPath[2]);
			//var dataModel = this.getView().getModel("localJson");
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			//	dataModel.getProperty("/aClipboardData").splice(index, 1);
			//var data = dataModel.getProperty("/HeadToHeadVariation/" + index);
			oRowData.Txt = oRowData.OrderType + "-" + oRowData.UserOrder;
			oRowData.Action = 'R';
			oRowData.Status = "R";
			oModel.setProperty(sPath, oRowData);
			//dataModel.setProperty("/HeadToHeadVariation/" + index, data)
		},
		loaddatevariation: function (oEvent) {
			var that = this;
			var dataModel = this.getView().byId("VariationOrderTable").getModel("localJson");
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			oRowData.OrderDate = oEvent.getParameter("value");
			oModel.setProperty(sPath, oRowData);
			dataModel.refresh(true);
		},

		handleChange: function (oEvent) {

			var that = this;
			//var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			//var oModel = this.getView().getModel("localJson");
			//var oRowData = oModel.getProperty(sPath);
			var dataModel = this.getView().byId("VariationOrderTable").getModel("localJson");
			var oValidatedComboBox = oEvent.getSource();
			var sSelectedKeyaction = oValidatedComboBox.getSelectedKey();
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			///
			var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
			var index = parseInt(splitedPath[2]);
			var data = dataModel.getProperty("/HeadToHeadVariation/" + index);

			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			oRowData.Txt = oRowData.OrderType + "-" + oRowData.UserOrder;
			//	oRowData.Type = sSelectedKeyaction;
			//oModel.setProperty(sPath, oRowData);

			if (sSelectedKeyaction == "R") {
				oRowData.Status = "R"; //
				oRowData.Action = sSelectedKeyaction;
				oModel.setProperty(sPath, oRowData);
				that.changestatus(data);
			}
			else {
				oRowData.Status = "C"
				oRowData.Action = sSelectedKeyaction;
				dataModel.setProperty(sPath, oRowData);
			}
			dataModel.refresh(true);
		},
		onCancleVeriation: function (oEvent) {

			var dataModel = this.getView().byId("VariationOrderTable").getModel("localJson");
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			//	dataModel.getProperty("/aClipboardData").splice(index, 1);
			//var data = dataModel.getProperty("/HeadToHeadVariation/" + index);
			//	oRowData.Txt = oRowData.OrderType + "-" + oRowData.UserOrder;
			oRowData.Action = 'C';
			oRowData.Status = "C";
			oModel.setProperty(sPath, oRowData);
			this.getResourceBundle();
			//var variationBuilding = that.getView().getModel("localJson").getProperty("/variationBuilding");
			//that.getView().getModel("localJson").setProperty("/variationBuilding", []);
		},
		handleChangeOrderType: function (oEvent) {

			var oValidatedComboBox = oEvent.getSource();
			var sSelectedKey = oValidatedComboBox.getSelectedKey();
			var dataModel = this.getView().byId("VariationOrderTable").getModel("localJson");
			var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
			var index = parseInt(splitedPath[2]);
			var data = dataModel.getProperty("/HeadToHeadVariation/" + index);
			data.ChangeInd = 'X';
			data.Type = sSelectedKey;
			dataModel.setProperty("/HeadToHeadVariation/" + index, data);
			dataModel.refresh(true);


			/*	var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
				var oModel = this.getView().getModel("localJson");
				var oRowData = oModel.getProperty(sPath);
				oRowData.Type = sSelectedKey;
				oModel.setProperty(sPath, oRowData);*/
		},
		onPressVariationOrder: function (oEvent) {

			var oSelectedContext = oEvent.getSource().getBindingContext("localJson").getPath();
			this._BuildingItemsPath = oEvent.getSource().getParent().getParent().getBinding("rows").getPath();
			if (!this._oBuilding) {
				var oTemplate = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.variationOrder", this);
				this._oBuilding = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.variationOrderTable", this);
				this.getView().addDependent(this._oBuilding);
				this._buildingBinding = oSelectedContext + "/OrderItemsSet";
				this.getView().byId("idBuildings").bindItems({
					path: "localJson>" + this._buildingBinding,
					template: oTemplate,
					templateShareable: true
				});
			}
			this._oBuilding.open();
		},

		handleCloseVariation: function (oEvent) {
			this._oBuilding.close();
			this._oBuilding.destroy();
			this._oBuilding = null;
		},
		onPressAddendumOrder: function (oEvent) {

			var oSelectedContext = oEvent.getSource().getBindingContext("localJson").getPath();
			this._BuildingItemsPath = oEvent.getSource().getParent().getParent().getBinding("rows").getPath();
			if (!this.AddendumOrder) {
				var oTemplate = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.variationOrder", this);
				this.AddendumOrder = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.AddendumOrderTable", this);
				this.getView().addDependent(this.AddendumOrder);
				this._buildingBinding = oSelectedContext + "/OrderItemsSet";
				this.getView().byId("idBuildingss").bindItems({
					path: "localJson>" + this._buildingBinding,
					template: oTemplate,
					templateShareable: true
				});
			}
			this.AddendumOrder.open();
		},

		handleCloseAddendum: function (oEvent) {
			this.AddendumOrder.close();
			this.AddendumOrder.destroy();
			this.AddendumOrder = null;
		},

		onPressVariationOrdersrv: function (oEvent) {

			var oSelectedContext = oEvent.getSource().getBindingContext("localJson").getPath();
			this._BuildingItemsPath = oEvent.getSource().getParent().getParent().getBinding("rows").getPath();
			if (!this._oServiceD) {
				var oTemplate = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.variationOrdersrv", this);
				this._oServiceD = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.variationOrderTablesrv", this);
				this.getView().addDependent(this._oServiceD);
				this._buildingsrv = oSelectedContext + "/OrderItemsSrvSet";
				this.getView().byId("idsrvDelete").bindItems({
					path: "localJson>" + this._buildingsrv,
					template: oTemplate,
					templateShareable: true
				});
			}
			this._oServiceD.open();
		},
		handleCloseVariationsrv: function (oEvent) {
			this._oServiceD.close();
			this._oServiceD.destroy();
			this._oServiceD = null;
		},
		////[E.A]////
		handleSelectionChangeV: function (oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");
		},
		objectformatdate: function (data) {
			var year = data.substring(6, 10);
			var month = data.substring(3, 5);
			var day = data.substring(0, 2);
			return new Date(year, month - 1, day);
		},


		formatDate: function (date) {
			var d = new Date(date),
				month = '' + (d.getMonth() + 1),
				day = '' + d.getDate(),
				year = d.getFullYear();
			if (month.length < 2)
				month = '0' + month;
			if (day.length < 2)
				day = '0' + day;
			return [year, month, day].join('-');
		},
		handleSelectionFinish: function (oEvent) {
			var selectedItems = oEvent.getParameter("selectedItems");

			var Key = "";
			for (var i = 0; i < selectedItems.length; i++) {
				Key += selectedItems[i].getKey();
				if (i != selectedItems.length - 1) {
					Key += ",";
				}
			}
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			oRowData.MonthIndex = Key;
			oModel.setProperty(sPath, oRowData);

		},
		//ad
		handelValuseUserOrder: function (oEvent) {

			var HeadToHeadVariation = this.getModel("localJson").getProperty("/HeadToHeadVariation");
			var dataModel = this.getView().byId("VariationOrderTable").getModel("localJson");
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			$.each(HeadToHeadVariation, function (c, cons) {
				if (oRowData.UserOrder === cons.UserOrder && cons.OrderNo !== "" && oRowData.OrderType === cons.OrderType) {
					oRowData.UserOrder = "";
				}

			})
			oModel.setProperty(sPath, oRowData);
		},
		handdAdendum: function () {
			var that = this;

			var variationOrderContract = that.getModel("localJso").getProperty("/variationOrderContract");
			/*	$.each(variationOrderContract, function (l, varor) {
					
					if(variationOrderContract.States ="Composing"){
		
						that.getView().getModel("localJson").setProperty("/VariationMode", true);
					}
				})*/
			if (variationOrderContract.length >= 1) {
				that.getView().getModel("localJson").setProperty("/VariationMode", false);
			} else {
				//	that.getView().byId("id_Amount").setValue(x);
				//var Omission = that.getView().byId("id_Amount").getValue();
				var AddValues = 0;
				var consolidate = that.getView().getModel("localJson").getProperty("/BoqItemSet");
				//var Omission = that.getView().byId("id_Amount").getValue();
				$.each(consolidate, function (c, cons) {
					AddValues = parseFloat(AddValues) + parseFloat(consolidate[c].PriceUnit);
				});
				//	Omission= parseFloat(Amount)-parseFloat(Omission);
				//	that.getView().byId("id_Amount").setValue(that.Amount);	
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});/*
				 RelDate = oDateFormat.format(new Date()),*/
				var itemRow = {
					UserOrder: "",//
					OrderDesc: "",//
					Type: "",// ok
					OrderDate: oDateFormat.format(new Date()),// ok
					MonthIndex: "",//ok
					AddValues: "0.00",//AddValues,//
					OmissionValues: "0.00",//
					ChangeAmount: "0.00",//Amount,
					DaysNo: "",//
					MonthNo: "",
					Action: "", //ok
					Status: "C",//ok
					OrderType: "A",//
					OrderNo: "",
					VarStatus: "",

				}

				var HeadToHeadVariation = that.getModel("localJson").getProperty("/HeadToHeadVariation");
				that.getView().getModel("localJso").setProperty("/VariationMode", false);
				HeadToHeadVariation.push(itemRow);
				that.getModel("localJson").setProperty("/HeadToHeadVariation", HeadToHeadVariation);
			}
		},

		loaddateAddendum: function (oEvent) {
			var that = this;
			var dataModel = this.getView().byId("AddendumTable").getModel("localJson");
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			oRowData.OrderDate = oEvent.getParameter("value");
			oModel.setProperty(sPath, oRowData);
		},
		handleChangeA: function (oEvent) {
			var that = this;
			/*var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			oRowData.Txt = oRowData.OrderType+"_"+oRowData.UserOrder;*/
			//oRowData.DelInd = (oRowData.DelInd === "X") ? "" : "X";
			//oModel.setProperty(sPath, oRowData);
			var dataModel = this.getView().byId("AddendumTable").getModel("localJson");
			var oValidatedComboBox = oEvent.getSource();
			var sSelectedKeyaction = oValidatedComboBox.getSelectedKey();
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			//	oRowData.Type = sSelectedKeyaction;
			//oModel.setProperty(sPath, oRowData);

			if (sSelectedKeyaction == "R") {
				oRowData.Status = "R"; //
				oRowData.Action = sSelectedKeyaction;
				oModel.setProperty(sPath, oRowData);
			}
			else {
				oRowData.Status = "C"
				oRowData.Action = sSelectedKeyaction;
				dataModel.setProperty(sPath, oRowData);
			}

		},
		handleChangeOrderTypeA: function (oEvent) {
			var oValidatedComboBox = oEvent.getSource();
			var sSelectedKey = oValidatedComboBox.getSelectedKey();
			var dataModel = this.getView().byId("AddendumTable").getModel("localJson");
			var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
			var index = parseInt(splitedPath[2]);
			var data = dataModel.getProperty("/HeadToHeadVariation/" + index);
			data.Type = sSelectedKey;
			data.ChangeInd = 'X';
			dataModel.setProperty("/HeadToHeadVariation/" + index, data);
			dataModel.refresh(true);
			/*	var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
				var oModel = this.getView().getModel("localJson");
				var oRowData = oModel.getProperty(sPath);
				oRowData.Type = sSelectedKey;
				oModel.setProperty(sPath, oRowData);*/
		},
		onPressVariationOrder: function (oEvent) {
			var oSelectedContext = oEvent.getSource().getBindingContext("localJson").getPath();
			this._BuildingItemsPath = oEvent.getSource().getParent().getParent().getBinding("rows").getPath();
			if (!this._oBuilding) {
				var oTemplate = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.variationOrder", this);
				this._oBuilding = sap.ui.xmlfragment(this.getView().getId(), "com.cicre.po.view.fragments.variationOrderTable", this);
				this.getView().addDependent(this._oBuilding);
				this._buildingBinding = oSelectedContext + "/OrderItemsSet";
				this.getView().byId("idBuildings").bindItems({
					path: "localJson>" + this._buildingBinding,
					template: oTemplate,
					templateShareable: true
				});
			}
			this._oBuilding.open();
		},
		handleCloseVariation: function (oEvent) {
			this._oBuilding.close();
			this._oBuilding.destroy();
			this._oBuilding = null;
		},
		////[E.A]////
		handleSelectionChange: function (oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");
		},
		handleSelectionFinishA: function (oEvent) {
			var selectedItems = oEvent.getParameter("selectedItems");
			var Key = "";
			for (var i = 0; i < selectedItems.length; i++) {
				Key += selectedItems[i].getKey();
				if (i != selectedItems.length - 1) {
					Key += ",";
				}
			}
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			oRowData.MonthIndex = Key;
			oModel.setProperty(sPath, oRowData);
			oModel.refresh(true);

		},
		deleteEstimatedContrac: function (oEvent) {
			var that = this;
			var variationOrderContract = that.getModel("localJson").getProperty("/variationOrderContract");
			var splitedPath = oEvent.getSource().getParent().getBindingContext("localJson").getPath().split("/");
			var index = splitedPath[2];

			variationOrderContract.splice(index, 1);
			that.getModel("localJson").setProperty("/variationOrderContract", variationOrderContract);

			that.getModel("localJson").refresh(true);
		},
		//[E.A]
		_longTextDialogBuilding: null,
		onPressLongTextBuildingBoq: function (oEvent) {
			var that = this;
			that.itemIndex = oEvent.getSource().getBindingContext("localJson").getPath();
			var object = oEvent.getSource().getBindingContext("localJson").getObject();
			if (!that._longTextDialogBuilding) {
				that._longTextDialogBuilding = sap.ui.xmlfragment(that.getView().getId(), "com.cicre.po.view.fragments.ServiceLongText", that);
				that.getView().addDependent(that._longTextDialogBuilding);
			}
			that._longTextDialogBuilding.open();
			that.getView().byId("idLongText").setText(object.BoqDesc);
		},
		_longTextDialogBuildingModel: null,
		onPressLongTextBuildingModel: function (oEvent) {
			var that = this;
			that.itemIndex = oEvent.getSource().getBindingContext("localJson").getPath();
			var object = oEvent.getSource().getBindingContext("localJson").getObject();
			if (!that._longTextDialogBuildingModel) {
				that._longTextDialogBuildingModel = sap.ui.xmlfragment(that.getView().getId(), "com.cicre.po.view.fragments.ServiceLongText", that);
				that.getView().addDependent(that._longTextDialogBuildingModel);
			}
			that._longTextDialogBuildingModel.open();
			that.getView().byId("idLongText").setText(object.ModelDesc);
		},
		// select building 
		onSelectionChangeFilter: function (oEvt) {

			var that = this;
			var oList = oEvt.getSource();
			var notExist = true;
			var selectedBuilding = that.getView().getModel("localJso").getProperty("/Buildings");
			if (oEvt.getParameters().selected === true) {
				var selectedBU = oEvt.getParameter("listItem").getBindingContext("localJson").getObject();
				notExist = true;
				if (notExist) {
					selectedBuilding.push(selectedBU);
					that.getView().getModel("localJso").setProperty("/Buildings", selectedBuilding);
					that.aContexts = oList.getSelectedContexts(true);

				}
			} else {
				// var path = oEvt.getParameter("listItem").getBindingContextPath().split('/')[1];
				var path = oEvt.getParameter("listItem").getBindingContextPath();
				var index = path.slice(path.lastIndexOf('/') + 1);
				selectedBuilding.splice(index, 1);
				that.aContexts.splice(index, 1);
				that.getView().getModel("localJso").setProperty("/Buildings", selectedBuilding);
			}
		},
		CancelPressF: function () {
			this._oBuildingValueHelpDialog.close();
			this._oBuildingValueHelpDialog.destroy();
			this._oBuildingValueHelpDialog = null;
		},
		// zoom in work flow\
		onZoomIn: function (oEvent) {
			this.getView().byId("idDisplayProcessFlow").zoomIn();
		},
		// zoom out work flow
		onZoomOut: function () {
			this.getView().byId("idDisplayProcessFlow").zoomOut();
		},

		onChangeWFContractType: function (oEvent) {
			this._readWFInbox(this.getView().byId("idselectionType").getSelectedKey());
		},

		_readWFInbox: function (type_all) {
			var oController = this,
				aFilters = [],
				arrt_type = "",
				type = "",//arrt_type[0],
				v_no = "";//arrt_type[1],

			if (type_all !== 'O') {
				arrt_type = type_all.split("-");
				type = arrt_type[0];
				v_no = arrt_type[1];
			} else {
				type = type_all;
			}
			var oFilter = new sap.ui.model.Filter("ReqId", "EQ", oController.getView().getModel("localJson").getProperty("/PoNumber"));
			aFilters.push(oFilter);
			oFilter = new sap.ui.model.Filter("Workitem", "EQ", type);
			aFilters.push(oFilter);
			oFilter = new sap.ui.model.Filter("ContIntNo", "EQ", v_no);
			aFilters.push(oFilter);
			oController.getView().setBusy(true);
			oController.getOwnerComponent().getModel().read("/WFContractInboxSet", {
				async: false,
				method: "GET",
				filters: aFilters,
				success: function (oInboxData) {
					if (oInboxData.results.length > 0) {
						var aInboxSet = oInboxData.results;
						var aWorkFlow = oController.onprocessworkflowBuilding(aInboxSet);
						oController.getView().getModel("localJson").setProperty("/lanes", aWorkFlow.lanes);
						oController.getView().getModel("localJson").setProperty("/nodes", aWorkFlow.nodes);
						oController.getView().getModel("localJson").refresh();
						//oController.getView().byId("idDisplayProcessFlow").updateModel();
						oController.getView().setBusy(false);

					}
				},
				error: function () {

				}
			});

		},

		_readWFType: function () {
			var oController = this,
				aFilters = [],
				oFilter = new sap.ui.model.Filter("Flag", "EQ", 'X');
			aFilters.push(oFilter);
			oFilter = new sap.ui.model.Filter("ReqId", "EQ", oController.getView().getModel("localJson").getProperty("/PoNumber"));
			aFilters.push(oFilter);
			oController.getOwnerComponent().getModel().read("/WFContractInboxSet", {
				async: false,
				method: "GET",
				filters: aFilters,
				success: function (oInboxData) {
					if (oInboxData.results.length > 0) {
						var aInboxSet = oInboxData.results;
						oController.getView().getModel("localJson").setProperty("/Action_TYPE", aInboxSet)


					}
				},
				error: function () {

				}
			});

		},
		onprocessworkflowBuilding: function (aInboxSet) {
			var that = this;
			var mymodel = that.getView().getModel("dataModel");
			$.each(aInboxSet, function (index, value) {
				aInboxSet[index].Step = parseInt(value.StepNo).toString();
			});
			var aInboxSetCopy = aInboxSet.filter(function (item, pos, arr) {
				// Always keep the 0th element as there is nothing before it
				// Then check if each element is different than the one before it
				return pos === 0 || item.Step !== arr[pos - 1].Step;
			});
			////first lan user approved
			var aLanes = [{
				laneId: "0",
				iconSrc: "sap-icon://activate",
				text: that.getResourceBundle().getText("detailInitiator"),
				position: 0
			}];

			var aNodes = [{
				nodeId: "0",
				laneId: "0",
				title: that.initiator,
				titleAbbreviation: that.initiator,
				children: [],
				state: sap.suite.ui.commons.ProcessFlowNodeState.Positive,
				stateText: that.getResourceBundle().getText("detailRequestReleased"),
				highlighted: true
			}];
			var aChildren = aInboxSet.filter(function (oValue) {
				return oValue.Step == '1';
			});
			for (var j = 0; j < aChildren.length; j++) {
				aNodes[0].children.push(aChildren[j].UserName + aChildren[j].Workitem);
			}
			// insert a lane for each step
			for (var i in aInboxSetCopy) {
				aLanes.push({
					laneId: aInboxSetCopy[i].Step,
					iconSrc: "sap-icon://monitor-payments",
					text: aInboxSetCopy[i].Role,//UserName,//PositionText,
					position: parseInt(aInboxSetCopy[i].Step),

				});
			}


			// for each step insert all users in the lane
			for (var j in aInboxSet) {
				aInboxSet[j].DecisionDate = aInboxSet[j].DecisionDate === null ? "" : aInboxSet[j].DecisionDate;
				aNodes.push({
					nodeId: aInboxSet[j].UserName + aInboxSet[j].Workitem,
					laneId: aInboxSet[j].Step,
					title: aInboxSet[j].UserName,
					titleAbbreviation: aInboxSet[j].UserName,
					children: [],
					role: aInboxSet[j].Role,//UserName,//PositionText,
					state: (aInboxSet[j].UserName == aInboxSet[j].DecisionBy && aInboxSet[j].Status == "APPROVED") ? sap.suite.ui.commons
						.ProcessFlowNodeState
						.Positive : (aInboxSet[j]
							.UserName == aInboxSet[j].DecisionBy &&
							aInboxSet[j].Status == "REJECTED") ? sap.suite.ui.commons.ProcessFlowNodeState.Negative : sap.suite.ui.commons.ProcessFlowNodeState
						.Neutral,
					//  stateText: (aInboxSet[j].UserName == aInboxSet[j].DecisionBy && aInboxSet[j].Status == "APRV") ? "Approved" : (
					//  aInboxSet[j].UserName == aInboxSet[j].DecisionBy && aInboxSet[j].Status == "RJCT") ? "Rejected" : "Pending",

					stateText: (aInboxSet[j].Role == "WAT") ? "Watcher" : (aInboxSet[j].Status == "STA") ? "Active" : (
						aInboxSet[j].Status ==
						"APPROVED") ? "Approved by-" + aInboxSet[
							j].DecisionBy : (
								aInboxSet[j].Status == "REJECTED") ? "Rejected by-" + aInboxSet[j].DecisionBy : "Pending",

					highlighted: (aInboxSet[j].UserName == aInboxSet[j].DecisionBy && aInboxSet[j].Status == "APPROVED") ? true : (
						aInboxSet[j]
							.UserName ==
						aInboxSet[j].DecisionBy && aInboxSet[j].Status == "REJECTED") ? true : false,
					//texts: [aInboxSet[j].DecisionDate, aInboxSet[j].Comments]
					texts: [that.formatDatew(aInboxSet[j].DecisionDate), aInboxSet[j].Comments, aInboxSet[j].Status]
				});
				var aChildren = aInboxSet.filter(function (oValue) {
					return oValue.Step == (parseInt(aInboxSet[j].Step) + 1).toString();
				});

				for (var k = 0; k < aChildren.length; k++) {
					var childId = aChildren[k].UserName + aChildren[k].Workitem;
					if (aNodes[aNodes.length - 1].nodeId !== childId) {
						aNodes[aNodes.length - 1].children.push(childId);
					}
				}
			}

			return { nodes: aNodes, lanes: aLanes }

		},
		onNodePress: function (oEvent) {
			var oController = this;
			var selectedNode = oEvent.getParameters().getBindingContext("localJson").getObject();
			if (selectedNode.laneId != "0") {
				if (oController._processFlowDialog) {
					oController._processFlowDialog.destroy();
					oController._processFlowDialog = null;
				}
				if (!oController._processFlowDialog) {
					oController._processFlowDialog = sap.ui.xmlfragment(oController.getView().getId(), "com.cicre.po.view.fragments.ProcessFlowDialog",
						oController);
					oController._processFlowDialog.setBindingContext(oEvent.getParameters().getBindingContext("localJson"), "localJson");
					oController.getView().addDependent(oController._processFlowDialog);
				}
				oController._processFlowDialog.open();
			}
		},
		onCloseProcessFlow: function (oEvent) {
			this._processFlowDialog.close();
		},

		onChangeContractDuration: function () {
			var ContractDurationMonth = this.getView().byId("idContractDurationMonth").getValue(),
				ContractDurationDays = this.getView().byId("idContractDurationDays").getValue(),
				TotalvariationMonths = this.getView().getModel("localJson").getProperty("/TotalvariationMonths"),
				TotalvariationDays = this.getView().getModel("localJson").getProperty("/TotalvariationDays"),
				TotalContractDurationMonths = 0, TotalContractDurationDays = 0,
				ValidFrom = this.getView().getModel("localJson").getProperty("/ValidFrom");

			TotalContractDurationMonths = parseInt(ContractDurationMonth) + parseInt(TotalvariationMonths);
			TotalContractDurationDays = parseInt(ContractDurationDays) + parseInt(TotalvariationDays);

			this.getView().getModel("localJson").setProperty("/TotalContractDurationMonths", TotalContractDurationMonths);
			this.getView().getModel("localJson").setProperty("/TotalContractDurationDays", TotalContractDurationDays);
			var CompletionDate = this.calculateDates(ValidFrom, TotalContractDurationMonths, TotalContractDurationDays);
			this.getView().getModel("localJson").setProperty("/ValidTo", CompletionDate);

		},
		getStartDate: function (CommencementDate, DateofApplying, SignoffDate) {

			if (CommencementDate > DateofApplying) {
				if (CommencementDate > SignoffDate) {
					return CommencementDate;
				} else {
					return SignoffDate;
				}
			} else {
				if (DateofApplying > SignoffDate) {
					return DateofApplying;
				} else {
					return SignoffDate;
				}
			}


		},

		calculatestartDate: function () {
			var SigninDate = this.getView().getModel("localJson").getProperty("/SigninDate"),
				CommencementDate = this.getView().getModel("localJson").getProperty("/CommencementDate"),
				DateOfApplying = this.getView().getModel("localJson").getProperty("/DateOfApplying"),
				TotalContractDurationMonths = this.getView().getModel("localJson").getProperty("/TotalContractDurationMonths"),
				TotalContractDurationDays = this.getView().getModel("localJson").getProperty("/TotalContractDurationDays");
			var ValidFrom = this.getStartDate(CommencementDate, DateOfApplying, SigninDate);
			this.getView().getModel("localJson").setProperty("/ValidFrom", ValidFrom);
			var CompletionDate = this.calculateDates(ValidFrom, TotalContractDurationMonths, TotalContractDurationDays);
			this.getView().getModel("localJson").setProperty("/ValidTo", CompletionDate);
		},


	
		oncalculatVariationOrder: function (oEvent) {
			var HeadToHeadVariation = this.getView().getModel("localJson").getProperty("/HeadToHeadVariation");
			var TotalvariationMonths = 0;//this.getView().getModel("localJson").getProperty("/TotalvariationMonths");
			var TotalvariationDays = 0, //this.getView().getModel("localJson").getProperty("/TotalvariationDays"),
				ContDurationMonth = this.getView().getModel("localJson").getProperty("/ContDurationMonth"),
				ContDurationDays = this.getView().getModel("localJson").getProperty("/ContDurationDays"),
				TotalContractDurationMonths = 0,
				TotalContractDurationDays = 0;

			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			oRowData.ChangeInd = 'X';
			oModel.setProperty(sPath, oRowData);

			$.each(HeadToHeadVariation, function (index, variation) {
				if (variation.MonthNo === "") {
					variation.MonthNo = 0;
				} if (variation.DaysNo === "") {
					variation.DaysNo = 0;
				}
				TotalvariationMonths = parseInt(TotalvariationMonths) + parseInt(variation.MonthNo);
				TotalvariationDays = parseInt(TotalvariationDays) + parseInt(variation.DaysNo);

			})

			this.getView().getModel("localJson").setProperty("/TotalvariationMonths", TotalvariationMonths);
			this.getView().getModel("localJson").setProperty("/TotalvariationDays", TotalvariationDays);

			this.onChangeContractDuration();
		},
		onChangeind: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("localJson").getPath();
			var oModel = this.getView().getModel("localJson");
			var oRowData = oModel.getProperty(sPath);
			oRowData.ChangeInd = 'X';
			oModel.setProperty(sPath, oRowData);
		},
		formatDatew: function (sValue) {
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
		onPRSelectionChange: function (oEvt) {
			var oController = this;
			var notExist = true,
				selectedBUPR = [],
				nullGroup = [];
			var selectedPR = oController.getView().getModel("localJson").getProperty("/selectedPR");
			var PurchaseRequisition = oController.getView().getModel("localJson").getProperty("/myPurchaseRequisition"),
		     	HeadToHeadVariation = oController.getView().getModel("localJson").getProperty("/HeadToHeadVariation"),
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
						if (WBS.BuildingNo === bu.BuildingNo ) {
							nullGroup.push(bu.BuildingNo);
							notExist = false;
						}
					});
				});

				if (notExist) {
					$.each(selectedBUPR, function (w, WBS) {
						selectedBUPR[w].ContractualIndicator = "O";
						selectedBUPR[w].Txt = "Original";
						$.each(HeadToHeadVariation, function (i, st) {
							if (HeadToHeadVariation[i].Status === "C") {
								selectedBUPR[w].ContractualIndicator = HeadToHeadVariation[i].OrderType;
								selectedBUPR[w].SrvStatus = "UA";
								selectedBUPR[w].AsBuild2 = "";
								selectedBUPR[w].OrderNo = HeadToHeadVariation[i].OrderNo;
								selectedBUPR[w].Txt = HeadToHeadVariation[i].OrderType + "-" + HeadToHeadVariation[i].UserOrder
								selectedBUPR[w].vlive = "V";
								//variationBuilding.push(selectedBU);
							}
						});
						selectedBUPR[w].SrvStatus = "UA";
						selectedBUPR[w].DelInd = "";
						selectedBUPR[w].AsBuild2 = "";
						selectedBUPR[w].ModelType = "PR";
						//selectedBUPR[w].WbsCode = selectedBUPR[w].SelectionParameter;
					
						selectedBUPR[w].ActivityNumber = selectedBUPR[w].ActivityNumber;
						selectedBUPR[w].Network = selectedBUPR[w].Network;
						selectedBUPR[w].PrNo = parseInt(selectedBUPR[w].PrNo).toString(); // PR NO
						selectedBUPR[w].PrNumber = parseInt(selectedBUPR[w].PrNo).toString(); // PR 
						selectedBUPR[w].BuildingNo = parseInt(selectedBUPR[w].PrNo).toString(); // PR NO
						selectedBUPR[w].Model = parseInt(selectedBUPR[w].PrNo).toString();
						selectedBUPR[w].BoqDesc = selectedBUPR[w].ActivityNumberDesc;
						
					//	oController.myWBSSet.push(selectedBUPR[w]);
					   selectedPR.push(selectedBUPR[w]);
						PurchaseRequisition.push(selectedBUPR[w]);

					})

					oController.aContexts.push(selectedBUPR);

					oController.getView().getModel("localJson").setProperty("/myPurchaseRequisition", PurchaseRequisition);
					oController.getView().getModel("localJson").setProperty("/selectedPR", selectedPR);
					oController.onPRContractClose();
					oController._handleValueHelpOpjectClosePR();
				} else if (!notExist) {
					var errormas = nullGroup.join();
					sap.m.MessageToast.show("Purchase Requisition is already added or don't select Boq " + errormas);
				}
			} 
		},
		_handleValueHelpOpjectClosePR: function (oEvt) {
			var that = this,
				mModel = that.getView().getModel();
			that.getView().setBusy(true);
			var oModelJson = that.getView().getModel(),
			    ModelBoqobj = {},
			    myPurchaseRequisition = that.getView().getModel("localJson").getProperty("/myPurchaseRequisition"),
				HeadToHeadVariation = that.getView().getModel("localJson").getProperty("/HeadToHeadVariation"),
				filters = [];
			var objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/PRItemSet")));
			if (that.aContexts.length === 0)
				sap.m.MessageToast.show("Select one Building at least!");
			else {
					that.BUBoQs.sort();
					this.objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqItemSet")));
					this.selectedBuilding = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/selectedBuilding")));
					var totalprice = "0.00";
					var selectedPR = that.getView().getModel("localJson").getProperty("/selectedPR");
					$.each(selectedPR, function (i, SelectBuilding) {
						var oFilter1 = new sap.ui.model.Filter("PrNumber", sap.ui.model.FilterOperator.EQ, SelectBuilding.PrNo);
						if (oFilter1 !== "") { filters.push(oFilter1); }
		
					})
					var oFilter4 = new sap.ui.model.Filter("Eancat", sap.ui.model.FilterOperator.EQ, 'PR');
					if (oFilter4 !== "") { filters.push(oFilter4); }
				/*	var oFilter2 = new sap.ui.model.Filter("Project", sap.ui.model.FilterOperator.EQ, that.sProjectCode);
					if (oFilter2 !== "") { filters.push(oFilter2); }
					var oFilter3 = new sap.ui.model.Filter("CompCode", sap.ui.model.FilterOperator.EQ, that.sCoCode);
					if (oFilter3 !== "") { filters.push(oFilter3); }*/
					this.objSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/PRItemSet")));
					that.getView().getModel("localJson").setProperty("/selectedPR", []);

					mModel.read("/BoqTreeSet", {
						filters: filters,
						success: function (OData, responce) {

							OData = OData.results;
							var start = 1;
							var BoqItemSet = [];
							var ContractualIndicator = "O";
							var VariationOrder = "";
							var Action = "UA";
							var UserOrde = "";
							$.each(HeadToHeadVariation, function (i, st) {
								if (HeadToHeadVariation[i].Status === "C") {
									ContractualIndicator = HeadToHeadVariation[i].OrderType;
									VariationOrder = HeadToHeadVariation[i].OrderNo;
									UserOrde = HeadToHeadVariation[i].UserOrder;
									//	Action=HeadToHeadVariation[i].Action;
								}
							});
							if (ContractualIndicator === "O") {
								var UserOrder = "Original";
							} else {
								var UserOrder = ContractualIndicator + "-" + UserOrde;
							}
							$.each(OData, function (i, ServiceBoq) {
								if (OData[i].LevelNo === "1") {
									OData[i].AddNew = "AN";
									OData[i].live = "one";
									//live: "one",
								}

								OData[i].ModelType = "BOQ";
								//OData[i].DelInd = "";
								if (OData[i].Eancat === "" && parseInt(OData[i].LevelNo) === 3) {
									OData[i].Qty = "0";
									OData[i].Uom = "";
									OData[i].Price = "0";

								}
								if (OData[i].Eancat === "U") { OData[i].Qty = 0; }

								if (parseInt(OData[i].LevelNo) === 3) {
									OData[i].Txt = UserOrder;
									OData[i].SrvStatus = Action;

									if (OData[i].Eancat != "") {
										OData[i].PriceUnit = "1";
										OData[i].Price = "1";
									}
									OData[i].DelInd = "";
									OData[i].ModelBoq = [];
									ModelBoqobj = {
										"ModelType" : "PR",
										"Model": OData[i].Data,
										"SubModel": "",
										"Buildingno":  OData[i].Data,
									}
									OData[i].ModelBoq.push(ModelBoqobj);
									OData[i].VariationOrder = VariationOrder;
									OData[i].ChangeIndicator = "addB";
									OData[i].ContractualIndicator = ContractualIndicator;
									OData[i].Indicator = "Y";
									totalprice = parseFloat(totalprice) + (parseFloat(OData[i].Qty) * parseFloat(OData[i].Price));
								} else {
									OData[i].Indicator = "Z";
								}
							});
							
						//	that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);
						//	that.getView().getModel("localJson").setProperty("/myBuildingSet", that.myBuildingSet);

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
								if (newHierachy.length !== 0) {
									$.each(newHierachy, function (c, newNode) {
										TreeBoqItemSet.push(newNode);
									});
								}
							});
							var go = false;
							var found = false;
							$.each(TreeBoqItemSet, function (c, newNode) {
								go = false;

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
													//go= false;
												}
											}
											//	}
										})
									})
									//if(!go ) found = false;
									if (!go && !found) {
										that.objSet.push(newNode);
										go = false;

									}


								} else {
									that.objSet.push(newNode);
								}
								found = false;
								go = false;
							});
							that.getView().getModel("localJson").setProperty("/PRItemSet", that.objSet);
							that.Consoliatedservices();
				
							var PRItemSet = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/PRItemSet")));
							var consolidate = JSON.parse(JSON.stringify(that.getView().getModel("localJson").getProperty("/BoqConsulidatedItemSet")));

							$.each(PRItemSet, function (i, boq) {
								$.each(boq.Categories, function (j, sub) {
									$.each(sub.Categories, function (l, srv) {
											boq.PriceUnit = "0";
											sub.PriceUnit = "0";
											srv.PriceUnit = "0";
									});
								});
		
							});

							$.each(consolidate, function (c, cons) {

								$.each(PRItemSet, function (i, boq) {
									$.each(boq.Categories, function (j, sub) {
						
											$.each(sub.Categories, function (k, srv) {
												if (cons.Data === srv.Data && cons.Txt === srv.Txt) {	
													//if (findservice.Data === srv.Data && ModelType.ModelType === 'PR') {

														$.each(myPurchaseRequisition, function (s, selected) {
															if (selected.PrNo == boq.PrNumber) {
															var ConsolidatedPrice = JSON.parse(JSON.stringify(parseFloat(cons.PriceUnit).toFixed(that.CustomCurrency)));
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
							});
							that.getView().getModel("localJson").setProperty("/PRItemSet", JSON.parse(JSON.stringify(PRItemSet)));
							that.ContractValueHeader();
							that.addBuildingForvariation();
							//	that.getView().setBusy(false);
						},

						error: function (e) {

							sap.m.MessageToast.show("Error");
						}
					});


				
			}

		},
		onChangeNote:function(){
			var ContractPONoteSet  = this.getView().getModel("localJson").getProperty("/ContractPONoteSet");
			ContractPONoteSet.Flag = 'X';
			this.getView().getModel("localJson").setProperty("/ContractPONoteSet",ContractPONoteSet);


		},
		onPressContractTermsTile: function (oEvent) {

			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"),
			ContractTermsInd = this.getView().getModel("localJson").getProperty("/ContractTermsInd"),
			Version  = this.getView().getModel("localJson").getProperty("/Version"),
			PurchDoc = this.getView().getModel("localJson").getProperty("/PurchDoc"),
			handleURL ='';
			var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZSESMISem",
					action:  "display"
				}
			})) || "";
				//Generate a  URL for the second application
				if(ContractTermsInd === 'X'){
					handleURL = "&/displayTerms/" + PurchDoc+'/'+Version;
				}else{
					
					handleURL = "&/createTerms/" + PurchDoc+'/0'
				}
			//Generate a  URL for the second application
			var url = window.location.href.split('#')[0] + hash + handleURL;
			window.open(url, '_blank');

		},




	});

});
