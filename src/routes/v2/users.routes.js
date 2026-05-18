import { Router } from "express";
import { User } from "../../modules/users/user.model.js";

export const router = Router();

const userResponse = (doc) => {
  const user = doc.toObject();
  delete user.password;
  return user;
};

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
router.post("/", async (req, res) => {
  const { username, email, password, role } = req.body || {};

  if (!username || !email || !password) {
    const error = new Error("username, email, and password are required");

    error.name = "ValidationError";
    error.status = 400;
    return res.status(400).json({ success: false, error: error.message });
  }

  try {
    const doc = await User.create({ username, email, password, role });

    return res.status(201).json({ success: true, data: userResponse(doc) });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/", async (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const { username, email, password } = req.body || {};

  if (!username && !email && !password) {
    return res
      .status(400)
      .json({ error: "username, email, or password is required" });
  }

  user.username = username;
  user.email = email;
  user.password = password;

  return res.status(200).json(user);
});

router.delete("/", async (req, res) => {
  const userIndex = users.findIndex((u) => u.id === String(req.params.id));

  if (userIndex === -1) {
    return res.status(404).json({ error: "not found" });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  return res.status(200).json(deletedUser);
});

// Supabase / PostgreSQL routes (/api/v2/users/pg)
// Password is excluded from SELECT.

const PG_SELECT = "id, username, email, role, createdAt, updatedAt";

router.get("/pg", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select(PG_SELECT);

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

router.post("/pg", async (req, res) => {
  const { username, email, password, role } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "username, email, and password are required",
    });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .insert({ username, email, password, role: role || "user" })
      .select(PG_SELECT)
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});
