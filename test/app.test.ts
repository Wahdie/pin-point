import { app } from "./config/app";
import request from "supertest";
import mongoose from "./config/db";
import http from "http";
// import "../config/setupTeardown";
import { setupTestData } from "./setup/setupTestData";
import { clearDatabase } from "./setup/clearData";

let server: http.Server;
beforeAll(async () => {
     server = app.listen(2003, () => {
          console.log(`listening on http://localhost:2003`);
     });
     await setupTestData();
});

afterAll(async () => {
     await clearDatabase();
     mongoose.disconnect();
     server.close();
});

import "./test-source/auth/login.test";
import "./test-source/auth/register.test";
import "./test-source/attandance/attandance.test";
import "./test-source/group/group.test";
import "./test-source/group/invitation.test";
import "./test-source/user/user.test";
