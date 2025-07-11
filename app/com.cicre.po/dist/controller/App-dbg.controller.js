sap.ui.define(
    [
        "com/cicre/po/controller/BaseController",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController , JSONModel) {
      "use strict";
  
      return BaseController.extend("com.cicre.po.controller.App", {
        onInit : function () {
          var oViewModel,
              fnSetAppNotBusy,
              iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

          oViewModel = new JSONModel({
              busy : true,
              delay : 0
          });
          this.setModel(oViewModel, "appView");

          fnSetAppNotBusy = function() {
              oViewModel.setProperty("/busy", false);
              oViewModel.setProperty("/delay", iOriginalBusyDelay);
          };

          // For OData V4
          // this.getOwnerComponent().getModel().requestMetadata().then(fnSetAppNotBusy);
          // apply content density mode to root view
          // this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
      }
      });
    }
  );
  