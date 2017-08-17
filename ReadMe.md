# Stock Info

### Running the project
1. Clone or download the repository
2. `cd resources`
3. `./init.sh` (initializes and populates the database with stock data)
4. `cd ../backend`
5. `./gradlew clean build run` (starts the backend services on port 9000)
6. `cd ../frontend`
7. `npm run startWithProxy` (starts the Ember application with requests proxied to http://localhost:9000)

---

### Notes
The Yahoo Finance API is no longer active. Instead, this application uses https://quantprice.herokuapp.com/api/v1.1/.

The QuantPrice API does not seem to support many of the stock symbols in the database. These will not render graphs.

The QuantPrice API also limits the number of requests within a given period of time. It is likely that a request for historical data will error out if too many requests are made within a short period of time.

---

### Future Improvements
1. Process the response from https://quantprice.herokuapp.com/api/v1.1/ directly in the backend Java code rather than in the frontend JavaScript code
2. Take advantage of Ember's services, serializers, and models to fetch data rather than using Ajax in the controllers
3. Split the Stocks component into several smaller components and pass props and emit events to communicate between them. Suggestions: search-bar, data-table, pagination

---

### Bugs
1. The candlestick chart is not fully responsive and will fall outside the modal component on smaller resolutions
