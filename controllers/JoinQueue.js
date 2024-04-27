const socketIo = require("socket.io");
const Store = require("../models/store");
const { io } = require("../index");

exports.joinqueue = async (req, res, next) => {
  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("joinQueue", async (data) => {
      const { storeId, userId } = data;
      if (storeId == "" || userId == "") {
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

        let minCounterIndex = store.counters.reduce(
          (minIndex, current, index, counters) => {
            return counters[minIndex].avgTimePerPerson <=
              current.avgTimePerPerson
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
          counterAlloted: minCounterIndex,
          waitingTime: store.counters[minCounterIndex].avgTimePerPerson,
          customers: store.counters[minCounterIndex].customers.length,
        });
      } catch (error) {
        socket.emit("error", { message: "Error joining queue", error });
        console.error("Error joining queue:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
