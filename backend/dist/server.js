"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = __importDefault(require("./data-source"));
const battlepass_1 = __importDefault(require("./routes/battlepass"));
const profile_1 = __importDefault(require("./routes/profile"));
const auth_1 = __importDefault(require("./routes/auth"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", battlepass_1.default);
app.use("/api", profile_1.default);
app.use("/api", auth_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});
data_source_1.default.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
