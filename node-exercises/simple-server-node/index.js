const app = require('./SimpleServer');

app.get('/users/:userId/books/:bookId/comment/:commendId', (request, response) => {
  response.end(JSON.stringify(request.params));
});
app.post('/users/:id', (request, response) => {
  // response.end(JSON.stringify(request.params));
  response.end(JSON.stringify(request.body));
});

app.listen(3000);
