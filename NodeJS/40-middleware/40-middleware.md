# Middleware

Middleware are just functions.  
Each middleware has access to request and responde objects.  
Middleware can end the HTTP request by sending back a responde with methods like res.send()  
OR middleware can be chained together, one after another by calling next()

