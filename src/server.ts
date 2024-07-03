import env from "dotenv";
env.config();

import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { sendToQueue } from "./sendToQueue";
import { startWorker } from "./worker";
import { EmailData } from "./types";

const app = express();
const PORT = 6996;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/send-email", async (req: Request, res: Response) => {
  try {
    const emailData: EmailData = req.body;
    await sendToQueue(emailData);
    res.status(200).json({ message: "Email queued successfully" });
  } catch (error) {
    console.error("Error queuing email:", error);
    res.status(500).json({ error: "Failed to queue email" });
  }
});
startWorker();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
