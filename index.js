const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const storeroutes = require("./routes/store");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const cors = require("cors");
const Store = require("./models/store");

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const DB = process.env.MONGO_URL;

module.exports.io = io;
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   next();
// });

app.use(cors());

app.get("/", (req, res) => {
  console.log("base url");
});

app.use("/store", storeroutes);
app.use("/queue", storeroutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 4000;

function formatMinutes(minutes) {
  const pad = (num) => num.toString().padStart(2, "0");
  let totalSeconds = Math.round(minutes * 60); // Convert minutes to seconds
  let hours = Math.floor(totalSeconds / 3600);
  let mins = Math.floor((totalSeconds % 3600) / 60);
  let secs = totalSeconds % 60;
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
}

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinQueue", async (data) => {
    const { storeId, userId } = data;
    if (storeId === "" || userId === "") {
      socket.emit("error", { message: "Missing storeId or userId" });
      return;
    }

    try {
      const store = await Store.findById(storeId);
      if (!store || store.counters.length !== store.numberOfCounters) {
        socket.emit("error", {
          message: "Store not properly configured or does not exist",
        });
        return;
      }

      // Check if userId already exists in any counter
      const isAlreadyQueued = store.counters.some((counter) =>
        counter.customers.includes(userId)
      );
      if (isAlreadyQueued) {
        socket.emit("error", {
          message: "User already in queue",
        });
        return;
      }

      // Find the counter with the minimum avgTimePerPerson
      let minCounterIndex = store.counters.reduce(
        (minIndex, current, index, counters) => {
          return counters[minIndex].avgTimePerPerson <= current.avgTimePerPerson
            ? minIndex
            : index;
        },
        0
      );

      // Update the selected counter
      store.counters[minCounterIndex].customers.push(userId);
      store.counters[minCounterIndex].avgTimePerPerson += store.billingTime;
      

      // Save the updated store
      await store.save();

      // Emit an update to all clients connected about the change in queue
      io.emit("queueUpdated", {
        storeId: storeId,
        counterAlloted: minCounterIndex + 1,
        waitingTime: formatMinutes(
          store.counters[minCounterIndex].avgTimePerPerson
        ),
        customers: store.counters[minCounterIndex].customers.length,
      });
    } catch (error) {
      socket.emit("error", { message: "Error joining queue", error });
      console.error("Error joining queue:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

mongoose
  .connect(DB)
  .then(() => {
    console.log("mongoose connected");
  })
  .catch((error) => {
    console.log(error);
  });

server.listen(PORT, () => {
  console.log("server is running");
});
