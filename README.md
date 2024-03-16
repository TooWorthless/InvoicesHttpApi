# This Project:
## [Invoices HTTP API Repo](https://github.com/TooWorthless/InvoicesHttpApi)

## [Invoices WSS Repo](https://github.com/TooWorthless/InvoicesWSS)

<br>

## Previous Project:
### [HTTP API Service Repo](https://github.com/TooWorthless/HttpApiService)

### [Web Socket Service Repo](https://github.com/TooWorthless/WebSocketService)


<br><br>

## /api:
- ### Request( GET /getInvoiceById?id=... ),
    ### Response( { "items": [ invoice items objects ], "key": invoice key } )
- ### Request( GET /getInvoices ),
    ### Response( { "invoice id": { "items": [ invoice items objects ], "key": invoice key }, "invoice n id": ... } )
- ### Request( POST /deleteInvoiceById?id=... ),
    ### Response( Deleted item: { "items": [ invoice items objects ], "key": invoice key } )
- ### Request( GET /donwload/invoiceById?id=... ),
    ### Response( invoice pdf document )
- ### Request( GET /donwload/invoices ),
    ### Response( zip invoices folder )