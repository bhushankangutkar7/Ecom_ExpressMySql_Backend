class AuthenticationError extends Error {
    constructor(message, statusCode = 401) {
        super(message);
        this.name = "AuthenticationError";
    }
};

export default AuthenticationError;