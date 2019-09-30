
**Game Client (in development)**

This project is developed in conjunction with a server that can be found [here](). This is a client that allows users to interact with games developed for the server.

**How does it work?**

Upon authentication verification, the client will request a socket token from the server with which the client can validate its socket connection. The ticket will then be invalidated. Every message received by the socket will update the game component which should in turn update the game. The socket messages are currently stored in a redux store, but will be moved to a lower level component to prevent the entire application from needlessly updating.

**How can I insert a game?**

All you need is a component that is able to receive a socket and user store in props. The socket will give you access to sending and receiving messages. The authentication store will give you access to basic user information. Any messages sent just need to be handled by the server that has your game on it. The server will automatically send it to the correct handler. Of course there will be other minor changes you need to make such as routing to the correct game component, but a system to automate that should be implemented as well.

**Future Improvements**

- Move token storage to HttpOnly cookies. It is currently stored in local storage for convenience.
- Allow chat customizability. Currently, any socket messages sent to the chat are not available for game components.

