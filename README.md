# This Project:
## [Invoices HTTP API Repo](https://github.com/TooWorthless/InvoicesHttpApi)

## [Invoices WSS Repo](https://github.com/TooWorthless/InvoicesWSS)

<br>

## Previous Project:
### [HTTP API Service Repo](https://github.com/TooWorthless/HttpApiService)

### [Web Socket Service Repo](https://github.com/TooWorthless/WebSocketService)


<br><br>

## /api:
- ### Request( GET /invoices/:id ),
    ### Response( { "items": [ invoice items objects ], "key": invoice key } )
    <br>
- ### Request( GET /invoices ),
    ### Response( { "invoice id": { "items": [ invoice items objects ], "key": invoice key }, "invoice n id": ... } )
    <br>
- ### Request( DELETE /invoices/:id ),
    ### Response( Deleted item: { "items": [ invoice items objects ], "key": invoice key } )
    <br>
- ### Request( GET /download/invoices/:id ),
    ### Response( invoice pdf document )
    <br>
- ### Request( GET /download/invoices ),
    ### Response( zip invoices folder )