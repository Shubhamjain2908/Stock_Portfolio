# Stock Portfolio
A portfolio tracking API adding/deleting/updating trades and can do basic return calculations etc.
By providing REST API endpoints in it.

The api's are written in [NodeJS](https://nodejs.org/en/).

Steps to run the api server:
> Make sure you have NodeJS version 10 or higher installed. (Database used: MongoDB: Mlab)
1) Clone this repository.
2) Navigate to repository folder and execute the following command:
    `npm install`
3) Create a local DB in mongo or remote in MLab. Make note of DB name along with username, password and host. You machine should be able to connect to database using any DB client. Also grant all privillages to it.
4) Run `npm start` in root directory of project to start the api server. This will start the server. Server will listen on port `5000`.
5) Import the following postman collection to have a look at the api's and try them out yourself. Set the following environment variable in postman. In addition this project is Hosted on Heroku
    `url : localhost:5000/api`,
    `Heroku Url: https://lit-reaches-26043.herokuapp.com`
___

### API Endpoints (localhost:5000/api/*)

All the parameters in all the api's are required, unless state optional

Link to [Postman Collection](https://www.getpostman.com/collections/9f5a92140b9ca80c2816)

#### Add Stock
**route - /stock**

**type: POST**

 Api for creating a new Stock/Security

#### Parameters In *raw-JSON* Body
>{
	"name" : "TCS",
	"price": "1892.11"
}
___
#### Fetch Stock
**route - /stock**

**type: GET**

 Api for fetching stocks

___
#### Creating a Trade
**route - /trade**

**type: POST**

 Api To Create a trade (first time transaction) in the portfolio.

#### Parameters In *raw-JSON* Body
> {
	"_stockId": "5dc71dc764fab528dc4431d0",
	"quantity": 8
}

___
#### Updating a Trade (buying of additional stocks)
**route - /trade/:id**

**type: PUT**

 Api To Update an existing trade (buying stocks) from portfolio.

#### Parameters In *raw-JSON* Body
> {
	"id":"1"
}

___
#### Deleting a Trade (selling stocks)
**route - /trade/:id**

**type: DELETE**

 Api for Selling/Removing stocks from portfolio.

___
#### Get Portfolio
**route - /portfolio**

**type: GET**

 Api for getting all the securities and trades corresponding
to it.

___
#### Get Holdings
**route - /holdings**

**type: GET**

 Api To get an aggregate view of all securities in the portfolio with its final quantity and average buy price.

___
#### Get Returns
**route - /returns**

**type: GET**

 Api To get cumulative returns at any point of time of a particular portfolio.

___
#### Postman Collection

Link: [https://www.getpostman.com/collections/9f5a92140b9ca80c2816](https://www.getpostman.com/collections/9f5a92140b9ca80c2816)

___
#### Heroku Hosted URL

Link: [https://lit-reaches-26043.herokuapp.com/](https://lit-reaches-26043.herokuapp.com/)