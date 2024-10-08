# Blog Application Backend

A feature-rich blog application built with Node.js, providing a seamless experience for users to create, manage, and explore content. It includes robust functionalities for post creation, image uploads, and dynamic content display.

## Installation

Clone the repository:

```bash
git clone https://github.com/Kodam-Vinay/zuai-backend.git
cd zuai-backend
```

Install dependecies with npm

```bash
  npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT=8080`
`SALT_ROUNDS=8`
`JWT_SECRET_KEY=zui_ai_assignment`
`MONGO_URL=mongodb+srv://vinay:MBWVkFyJWwnfYYaU@cluster11.ipyv2w4.mongodb.net/`
`CLOUDINARY_CLOUD_NAME=dwgpba5n2`
`CLOUDINARY_API_KEY=494883817292165`
`CLOUDINARY_API_SECRET_KEY=v0v8BrPsDzcCqSabCoiRRncsdUE`
`CLOUDINARY_PRESET=zuai-posts`

## Running the Project

Start the development server

```bash
  npm start
    or
  npm run dev (nodemon)
```

The server will start on http://localhost:8080.

## API Reference

### Authentication

#### register

```http
  POST /api/users/register
```

for successful registration

##### userDetails

`userDetails: {
    user_id,
    name,
    token
}`

- here user*id is generated by
  `const generateUserId = (name) => {
  const randomNumber = generateRandomNumber();
  return (userId = name + "*" + randomNumber);
  };`
- here token is generated by jsonwebtoken which is used for autherization purpose for posts(create post, update post, delete post)

if error respective error will be send to the client

#### login

```http
  POST /api/users/login
```

for successful registration
{
user_id: random_id
name,
token
}

### Posts

#### Get all posts

```http
  GET /api/posts
```

#### Get individual post

```http
  GET /api/posts/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of post to fetch |

#### For create post, update post, delete post token is Required only authorized user can do this tasks.

#### Create post

```http
  POST /api/posts
```

#### Update post

```http
  PUT /api/posts/:id
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of item to update |

#### Delete post

```http
  DELETE /api/posts/:id
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of item to delete |

## Technologies Used

- Node
- Express
- jsonwebtoken
- bcrypt
- validator
- mongoose
- cloudinary
- multer
