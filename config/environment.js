import dotenv from "dotenv";

export default function () {
  if (process.env.NODE_ENV !== "production") {
    dotenv.config();
  }
}
