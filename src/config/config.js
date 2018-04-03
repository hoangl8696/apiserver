module.exports = { 
    API_KEY: "developer",
    API_KEY_NAME: "key",
    JWT_SECRET: "make a stronger secret key than this",
    DATABASE_URI: "mongodb://localhost/demoAPI",
    REDIS_URL: undefined,
    TOKEN_NAME: "token",
    FILE_NAME: "file",
    FILE_SIZE_IN_MB: 1024, //1GB
    LOG_DIR_DEV: "./logs-dev" ,
    LOG_DIR_PROD: "./logs-prod", //NOT IN USE, FAIL FEATURE, NEED FURTHER TESTING
    GOOGLE_PLUS_API_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "764774255701-qhjngivkg8q6jdfiak1ibhgblena9p9e.apps.googleusercontent.com",
    GOOGLE_PLUS_API_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "UK0LW03a4W6iJn8HJ-CBXoHl"
};