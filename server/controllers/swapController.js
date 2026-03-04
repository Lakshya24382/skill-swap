import Swap from "../models/Swap.js";

// CREATE SWAP REQUEST
export const createSwap = async (req, res) => {
  try {
    const { receiver, offeredSkill, requestedSkill } = req.body;

    // Prevent duplicate pending swap
    const existingSwap = await Swap.findOne({
        sender: req.user.id,
        receiver,
        status: "pending",
    });

    if (existingSwap) {
      return res.status(400).json({
        message: "Swap request already sent",
    });
    }

    const newSwap = new Swap({
      sender: req.user.id,
      receiver,
      offeredSkill,
      requestedSkill,
    });

    await newSwap.save();

    res.status(201).json({ message: "Swap request sent" });
  } catch (error) {
  console.log("SWAP ERROR:", error);
  res.status(500).json({ message: error.message });
}
};

// GET MY SWAPS
export const getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(200).json(swaps);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE SWAP STATUS
export const updateSwapStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: "Swap not found" });
    }

    // Only receiver can accept/reject
    if (swap.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    swap.status = status;
    await swap.save();

    res.status(200).json({ message: "Swap updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};