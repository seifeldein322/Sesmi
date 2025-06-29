const cds = require('@sap/cds');
const axios = require('axios');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
// const connectToDatabase = require('../config/db');
// const schemaName = 'DBADMIN';  // Replace with your schema name if needed
// const connection = connectToDatabase();

module.exports = cds.service.impl(async function () {

   // value help request
  this.on('READ', 'ValueHelpSet', async (req) => {

    try {
      let filters = req.query.SELECT.where || [];
      let filterConditions = [];

      // Extract filters dynamically
      for (let i = 0; i < filters.length; i++) {
        if (filters[i].ref) {
          // Handle "eq" conditions
          let fieldName = filters[i].ref[0];
          let fieldValue = filters[i + 2]?.val;
          if (fieldValue !== undefined) {
              filterConditions.push(`${fieldName} eq '${fieldValue}'`);
          }
      } else if (filters[i].func === "contains") {
          // Handle "contains" function
          let fieldName = filters[i].args[0]?.ref[0];
          let fieldValue = filters[i].args[1]?.val;
          if (fieldName && fieldValue) {
              filterConditions.push(`substringof('${fieldValue}', ${fieldName})`);
          }
      }
      }

      if (filterConditions.length === 0) {
          // req.reject(400, "No valid filters provided.");
      }

      // Construct the $filter query
      const filterString = filterConditions.join(" and ");

      // Make request to SAP S/4HANA OData V2 service
      const response = await executeHttpRequest(
          {
              method: 'GET',
              url: `http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/ValueHelpSet?$filter=${encodeURIComponent(filterString)}`,
              headers: {
                  'Cookie': 'sap-usercontext=sap-client=210', // Replace with actual SAP client
                  'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'), // Replace with real credentials
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          }
      );

      return response.data.d.results;

  } catch (error) {
      console.error("Error fetching data from SAP S/4HANA:", error);
  }

        });


    // get currency request

    this.on('GetCurrencyExecuteAction', async (req) => {
      const { Vendor } = req.data; // Extract the input parameter

      try {
        const response = await executeHttpRequest(
          {
            method: 'GET',
            url: `http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/GetCurrencyExecuteAction?Vendor='${Vendor}'`,
            headers: {
              'Cookie': 'sap-usercontext=sap-client=210', // Replace with your actual cookie if needed
              'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'), // Replace with your credentials
              'Accept': 'application/json', // Ensure the response is in JSON format
              'Content-Type': 'application/json' // Specify the content type
            }
          }
        );
        return { Currency: response.data.d.Currency };
      } catch (error) {
        console.error('Error executing the request', error);
      }
  });

      // create Po set 

      this.on('CREATE', 'ContractPOHeaderSet', async (req) => {

        
          const data = req.data;
          // req.data.DocDate = req.data.DocDate + 'T00:00:00';
          // req.data.VperStart = req.data.VperStart + 'T00:00:00';
          // req.data.VperEnd = req.data.VperEnd + 'T00:00:00';
          // req.data.CreationDate = req.data.CreationDate + 'T00:00:00';
          // req.data.ValidFrom = req.data.ValidFrom + 'T00:00:00';
          // req.data.ValidTo = req.data.ValidTo + 'T00:00:00';
          // req.data.SigninDate = req.data.SigninDate + 'T00:00:00';
          // req.data.RevisedValidTo = req.data.RevisedValidTo + 'T00:00:00';
      
          // --- Format all relevant dates to 'YYYY-MM-DD'
          const formatDate = (dateStr) => {
            if (dateStr && dateStr.includes('T')) {
              return dateStr.split('T')[0];
            }
            return dateStr;
          };
      
          const cleanHeader = {
            Flag: data.Flag || "",
            DocType: data.DocType || "",
            Project: data.Project || "",
            Vendor: data.Vendor || "",
            PurchOrg: data.PurchOrg || "",
            PurchDoc: data.PoNumber || "", // <-- Map properly
            Message: data.Message || "",
            PurGroup: data.PurGroup || "",
            CompCode: data.CompCode || "",
            DocDate: formatDate(data.DocDate),
            VperStart: formatDate(data.VperStart),
            VperEnd: formatDate(data.VperEnd),
            Status: data.Status || "",
            DeleteInd: data.DeleteInd || "",
            ContractDesc: data.ContractDesc || "",
            LongDesc: data.LongDesc || "",
            Currency: data.Currency || "",
            MeasMethod: data.MeasMethod || "",
            ConstructionType: data.ConstructionType || "",
            RefContract: data.RefContract || "",
            CreationDate: formatDate(data.CreationDate),
            ValidFrom: formatDate(data.ValidFrom),
            ValidTo: formatDate(data.ValidTo),
            SigninDate: formatDate(data.SigninDate),
            RevisedValidTo: formatDate(data.RevisedValidTo),
            IndexMonth: data.IndexMonth || "",
            Consultant: data.Consultant || "",
            ConsultantName: data.ConsultantName || "",
            Ss: data.Ss || "",
            Ir: data.Ir || "",
            SuperiorWbs: data.SuperiorWbs || "",
            CreationType: data.CreationType || "O",
            MarkUp: data.MarkUp || "0.0",
            VendorName: data.VendorName || "",
            POHeaderToPOItem: [], // You can push only required one below
            POHeaderToPOBuildingNav: [],
            AttachmentSet: [],
            EstimatedContractValue: data.EstimatedContractValue || "0.00",
            OriginalContractValue: data.OriginalContractValue || "0.00",
            TotalContractValue: data.TotalContractValue || "0.00",
            VariationOrderValue: data.VariationOrderValue || "0.00",
            AddendumValue: data.AddendumValue || "0.00",
            RevisedContractValue: data.RevisedContractValue || "0.00",
            SerType: data.SerType || "",
            ContractPONoteNav: {}
          };
      

          const resphana = await axios.post(
            `https://SESMI-MM-NODEJS.cfapps.us10-001.hana.ondemand.com/contract/po-header`,
            cleanHeader,
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
      
          // --- Call OData backend if needed (uncomment if working)
          // const response = await executeHttpRequest({...}, {
          //     method: 'POST',
          //     data: cleanHeader,
          //     headers: {...}
          // });
      
          // Optional: Forward POItem to another endpoint
          // if (req.data.POHeaderToPOItem.length > 0) {
          //   const itemResponse = await axios.post(
          //     `https://SESMI-MM-NODEJS.cfapps.us10-001.hana.ondemand.com/contract/po-item`,
          //     req.data.POHeaderToPOItem[0],
          //     {
          //       headers: {
          //         'Content-Type': 'application/json'
          //       }
          //     }
          //   );
          // }
          req.data.PoNumber = resphana.data.data.PoNumber;
          req.data.Flag = 'U';
          req.data.DocDate = req.data.DocDate + 'T00:00:00';
          req.data.VperStart = req.data.VperStart + 'T00:00:00';
          req.data.VperEnd = req.data.VperEnd + 'T00:00:00';
          req.data.CreationDate = req.data.CreationDate + 'T00:00:00';
          req.data.ValidFrom = req.data.ValidFrom + 'T00:00:00';
          req.data.ValidTo = req.data.ValidTo + 'T00:00:00';
          req.data.SigninDate = req.data.SigninDate + 'T00:00:00';
          req.data.RevisedValidTo = req.data.RevisedValidTo + 'T00:00:00';
          const csrfResponse = await executeHttpRequest({
            method: 'GET',
            url: 'http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/',
            headers: {
                'Cookie': 'sap-usercontext=sap-client=210',
                'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'),
                'x-csrf-token': 'Fetch'
            }
        });
        const csrfToken = csrfResponse.headers['x-csrf-token'];
          try {
            req.headers['x-csrf-token'] = csrfToken;        
              const response = await executeHttpRequest({
                url: `http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/ContractPOHeaderSet?sap-client=210`
              },{
                method :'POST',
                data:req.data,
                headers: {
                  'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'),
                  'Cookie': 'sap-usercontext=sap-client=210',  // ✅ Send session cookies
                  'Accept': 'application/json',
                  'Content-Type': 'application/json; charset=UTF-8',  // ✅ Ensure UTF-8 encoding
    
                }
              }
              );
            // console.log(req.headers)
             
            
            return  response.data.d;
      
        } catch (error) {
          console.error('Error during contract creation:', error.message);
          req.error(500, 'Internal Server Error during contract creation.');
        }


    });

    this.on('READ', 'ContractPOHeaderSet', async (req) => {
      try {



        var PoNumber = null;
        var HanaResp = null
        PoNumber = req.data.PoNumber; // Extract sObjectId from request
        var response = null;
        if (PoNumber){
          const fieldsToUpdate = [
            'PurchDoc', 'DocType', 'Project', 'Vendor', 'PurchOrg', 'PurGroup',
            'CompCode', 'DocDate', 'ContractDesc', 'LongDesc', 'Currency',
            'Status', 'VperStart', 'VperEnd', 'ValidFrom', 'ValidTo'
            // Add any other fields you need to update
        ];
          HanaResp = await axios.get(
            `https://SESMI-MM-NODEJS.cfapps.us10-001.hana.ondemand.com/contract/po-header/${encodeURIComponent(PoNumber)}`,
            null,
            {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        // return  response.data;
        // }
      //   // Make the HTTP request to the external OData service
         response = await executeHttpRequest(
          {
            method: 'GET',
            url: `http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/ContractPOHeaderSet('${PoNumber}')?$expand=POHeaderToBoqItem,ContractPONoteNav,POHeaderToPOItem,ContractPOSrvItemSet,AttachmentSet,POHeaderToPOGetbuildingNav,ReleaseerrorSet,PermissionNav,WFContractInboxNAV,POPurchaseRequisitionTreeNav`,
            headers: {
              'Cookie': 'sap-usercontext=sap-client=210',
              'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'),
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        fieldsToUpdate.forEach(field => {
        if (HanaResp.data[field] !== undefined && HanaResp.data[field] !== '') {
            response.data.d[field] = HanaResp.data[field];
        }
    });

        return response.data.d; // 'd' if OData returns it in that structure, adjust if needed
      }
      else{
        response = await executeHttpRequest(
          {
            method: 'GET',
            url: `http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/ContractPOHeaderSet`,
            headers: {
              'Cookie': 'sap-usercontext=sap-client=210',
              'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'),
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }
        );

        return response.data.d.results; // 'd' if OData returns it in that structure, adjust if needed
      }
        } catch (error) {
          console.error('Error executing the request', error);
        }
      });

    this.on('READ', 'BoqSubItemSet', async (req) => {
      try {
        let filters = req.query.SELECT.where || [];
        let filterConditions = [];
  
        // Extract filters dynamically
        for (let i = 0; i < filters.length; i++) {
          if (filters[i].ref) {
            // Handle "eq" conditions
            let fieldName = filters[i].ref[0];
            let fieldValue = filters[i + 2]?.val;
            if (fieldValue !== undefined) {
                filterConditions.push(`${fieldName} eq '${fieldValue}'`);
            }
        } else if (filters[i].func === "contains") {
            // Handle "contains" function
            let fieldName = filters[i].args[0]?.ref[0];
            let fieldValue = filters[i].args[1]?.val;
            if (fieldName && fieldValue) {
                filterConditions.push(`substringof('${fieldValue}', ${fieldName})`);
            }
        }
        }
  
        if (filterConditions.length === 0) {
            // req.reject(400, "No valid filters provided.");
        }
  
        // Construct the $filter query
        const filterString = filterConditions.join(" and ");
        // console.log("Generated OData V2 Filter:", filterString);
  
        // Make request to SAP S/4HANA OData V2 service
        const response = await executeHttpRequest(
            {
                method: 'GET',
                url: `http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/BoqSubItemSet?$filter=${encodeURIComponent(filterString)}`,
                headers: {
                    'Cookie': 'sap-usercontext=sap-client=210', // Replace with actual SAP client
                    'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'), // Replace with real credentials
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
  
        // console.log("Data fetched successfully:", response.data.d.results.length, "records");
  
        // Return results to Fiori
        return response.data.d.results;
  
    } catch (error) {
        console.error("Error fetching data from SAP S/4HANA:", error);
        // req.reject(500, "Failed to fetch BoqSubItemSet data.");
    }
    });


    this.on('READ', 'BoqTreeSet', async (req) => {
      try {
        let filters = req.query.SELECT.where || [];
        let filterConditions = [];
  
        // Iterate over the filter structure
        for (let i = 0; i < filters.length; i++) {
          if (filters[i].ref) {
              let fieldName = filters[i].ref[0]; // Get field name
              let operator = filters[i + 1]; // Get operator (=, >=, <=)
              let fieldValue = filters[i + 2]?.val; // Get field value
      
              if (fieldValue !== undefined) {
                  // Convert JavaScript operators to OData V2 operators
                  let odataOperator = operator.replace(">=", "ge").replace("<=", "le").replace("=", "eq");
      
                  // ✅ Ensure proper quoting for all values
                  fieldValue = `'${fieldValue}'`;
      
                  filterConditions.push(`${fieldName} ${odataOperator} ${fieldValue}`);
              }
          }
      }
  
        if (filterConditions.length === 0) {
            // req.reject(400, "No valid filters provided.");
        }
  
        // Construct the $filter query
        const filterString = filterConditions.join(" and ");
        // console.log("Generated OData V2 Filter:", filterString);
  
        // Make request to SAP S/4HANA OData V2 service
        const response = await executeHttpRequest(
            {
                method: 'GET',
                url: `http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/BoqTreeSet?$filter=${encodeURIComponent(filterString)}`,
                headers: {
                    'Cookie': 'sap-usercontext=sap-client=210', // Replace with actual SAP client
                    'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'), // Replace with real credentials
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
  
        // console.log("Data fetched successfully:", response.data.d.results.length, "records");
  
        // Return results to Fiori
        return response.data.d.results;
  
    } catch (error) {
        console.error("Error fetching data from SAP S/4HANA:", error);
        // req.reject(500, "Failed to fetch BoqTreeSet data.");
    }
    });



    this.on('POExecuteAction', async (req) => {
      const { 
        PoNo,
        Decision,
        Notes,
        WorkitemId,
        CreationType,
        OrderNo,
        ActionType,
        Comments
      } = req.data;

      const requestBody = {
        PoNo : PoNo,
        Decision : Decision,
        Notes : Notes,
        WorkitemId : WorkitemId,
        CreationType : CreationType,
        OrderNo : OrderNo,
        ActionType : ActionType,
        Comments : Comments
      };

      // const resphana = await axios.post(
      //   `https://SESMI-MM-NODEJS.cfapps.us10-001.hana.ondemand.com/contract/po-execute`,
      //   requestBody,
      //   {
      //     headers: {
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );

      // return resphana.data;
      const csrfResponse = await executeHttpRequest({
        method: 'GET',
        url: 'http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/',
        headers: {
            'Cookie': 'sap-usercontext=sap-client=210',
            'Authorization': 'Basic ' + Buffer.from('s.ahmed:Sa@123456789').toString('base64'),
            'x-csrf-token': 'Fetch'
        }
    });
    const csrfToken = csrfResponse.headers['x-csrf-token'];
      try {
      req.headers['x-csrf-token'] = csrfToken;  
      const response = await executeHttpRequest(
        {
          url: `http://169.50.86.180:8003/sap/opu/odata/CICSE/SESMI_SRV/POExecuteAction?PoNo='${PoNo}'&Decision='${Decision}'&Notes='${Notes}'&WorkitemId='${WorkitemId}'&CreationType='${CreationType}'&OrderNo='${OrderNo}'&ActionType='${ActionType}'&Comments='${Comments}'`,
        },
        {
          method: "POST",
          // URL with parameters
          headers: {
            Cookie: "sap-usercontext=sap-client=210",
            Authorization:
              "Basic " + Buffer.from("s.ahmed:Sa@123456789").toString("base64"),
            Accept: "application/json",
            "Content-Type": "application/json",
            // 'x-csrf-token': csrfToken
          },
        }
      );
      return response.data.d
      } catch (error) {
        console.error('Error executing the request', error);
      }
    });
  });