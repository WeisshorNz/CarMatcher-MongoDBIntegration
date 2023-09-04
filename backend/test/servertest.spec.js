const path = require("path");
const fs = require("fs");
const request = require("supertest");
const app = require("../server"); 

describe("Image API Tests", () => {
  it("should respond with a 200 status code after sending an image", async () => {
    const imagePath = path.join(__dirname, "images", "pic1.jpg");
    const imageBuffer = fs.readFileSync(imagePath);

    const response = await request(app)
      .post("/api")
      .send(imageBuffer)
      .set("Content-Type", "image/jpeg");

    expect(response.status).toBe(200);
  });
});
