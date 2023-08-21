## Currency App
Application for tracking exchange rates.  
Built on hapi.js


## Run
Create '.env' like '.envExample'.  
```sh
docker-compose up --build -d
```

### Endpoint examples
To get latest currency 'from' and 'to':  
```
GET http://<APP_HOST>:<APP_PORT>/pair?from=eur&to=jpy&apikey=<APP_API_KEY>  
```

To get all currencies for a specific date:  
```
GET http://<APP_HOST>:<APP_PORT>/date/2023-08-20?apikey=<APP_API_KEY>
```
