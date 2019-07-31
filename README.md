# BackEnd CRUD User + Articles
###### __USERS__ ######
{
  firstName: type string, min length 4, max length 50, required field,
  lastName: type string, min length 3, max length 60, required field
  role: type string, only valid values is [admin, writer, guest],
  createdAt: type Datetime, with default value,
  numberOfArticles: type number, default value 0, not required,
  nickname: type string, not required
}
# GET 
/users
/users/:id
/users/:id/articles

# POST + req.body.title = string
/users

# PUT + req.body.completed = boolean
/users/:id

# DELETE 
/users/:id

###### __ARTICLES__ ######
{
  title: type string, min length 5, max length 400, required field, add text index
  subtitle: type string, min length 5, not required field,
  description: type string, min length 5, max length 5000, required,
  owner: user reference, required field,
  category: valid options [sport, games, history], required
  createdAt: type datetime, required field
  updatedAt: type datetime, required field
}
# GET 
/articles + query


# POST + req.body.title = string
/articles

# PUT + req.body.completed = boolean
/articles/:id

# DELETE 
/articles/:id