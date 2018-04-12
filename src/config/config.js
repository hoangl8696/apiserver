module.exports = { 
    API_KEY_NAME: "key",
    DATABASE_URI: "mongodb://localhost/demoAPI",
    REDIS_URL: undefined,
    TOKEN_NAME: "token",
    FILE_NAME: "file",
    FILE_SIZE_IN_MB: 1024, //1GB
    LOG_DIR_DEV: "./logs-dev" ,
    LOG_DIR_PROD: ".pro/logs-prod", //NOT IN USE, FAIL FEATURE, NEED FURTHER TESTING
    RETRY_ATTEMPS: 10,
    CONTENTFUL_IMAGE_UPLOAD_JOB: 1,
    CONTENTFUL_IMAGE_DELETE_JOB: 2,
    CLEANUP_INTERVAL: 10 * 60 * 1000
};