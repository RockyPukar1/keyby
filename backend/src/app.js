import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";

const app = express();
app.use(cors())
app.use(express.json());

const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

// Google login
app.post("/auth/google-login", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // Check if user exists in DB
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({ googleId: sub, email, name });
    }

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d"
    });

    res.json({ token: jwtToken, user });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Fetch profiles
app.get("/profiles", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { userId } = jwt.verify(token, process.env.SECRET_KEY);
    const profiles = await Profile.find({ userId });
    res.json({ profiles });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// oauth callback
app.post("/oauth/callback", async (req, res) => {
  const { code } = req.body;

  try {
    const response = axios.post(
      "https://oauth2.googleapis.com/token",
      null,
      {
        params: {
          code,
          client_id: "<CLIENT_ID>",
          client_secret: "<CLIENT_SECRET>",
          redirect_uri: "htt://localhost:3000/oauth/callback",
          grant_type: "authorization_code"
        }
      }
    );

    const { access_token } = (await response).data;
    // TODO: store token in database
    res.json({ access_token });
  } catch (error) {
    console.log("OAuth error:", error);
    res.status(500).send("Error during OAuth token exchange");
  }
})

app.listen(3000, () => {
  console.log("Server running on port", 3000);
})