## Auth Router
Handles user authentication including signup, login and logout

- POST /signup - Registers a new user
- POST /login - Authenticates a user and issues a token
- POST /logout - Revokes a user's session

## Profile Router
Manages user profile-related operations

- GET /profile/view - Retrieves the profile information of logged-in user
- PATCH /profile/password - Changes user's password
- PATCH /profile/edit - Updates the user profile details

## Connection Request Router
Handles connection request between user's with various statuses

Status options: ignore,interested,accepted,rejected

Endpoints: 
- POST /request/send/interested/:toUserId - Send a connection request to another user
- POST /request/send/ignored/:toUserId - Marks the request as ignored
- POST /request/review/accepted/:requestId - Accept a connection request
- POST /request/review/rejected/:requestId - Reject a connection request

## User Router
Handles operations related to the connections, requests and user feed
- GET /user/connections - Gets a list of connections for the logged-in user
- GET /user/requests/received - Retrieves a list of received connection requests
- GET /user/feed - Gets a list of suggested users to connect with

