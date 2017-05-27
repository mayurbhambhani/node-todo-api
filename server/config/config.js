let env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
    let configs = require("./config.json");
    let envVar = configs[env];
    let envVarKeys = Object.keys(envVar);
    envVarKeys.forEach(function (key) {
        process.env[key] = envVar[key];
    });
}
