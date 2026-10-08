router.post(
  "/:slotId/book",
  auth,
  asyncHandler(async (req, res) => {
    const client = await pool.connect();
    // Notice: client, not pool, directly — transactions need ONE single
    // connection held for their entire duration, not borrowed-and-returned
    // per query like pool.query() does automatically

    try {
      await client.query("BEGIN");

      const slotResult = await client.query(
        "SELECT * FROM appointments WHERE appointment_id = $1 AND patient_id IS NULL FOR UPDATE",
        [req.params.slotId],
      );

      if (slotResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(409).json({ error: "Slot no longer available" });
      }

      await client.query(
        "UPDATE appointments SET patient_id = $1 WHERE appointment_id = $2",
        [req.user.patientId, req.params.slotId],
      );

      await client.query("COMMIT");
      res.json({ message: "Appointment booked successfully" });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
      // CRITICAL: always release the connection back to the pool, whether the transaction succeeded or failed — forgetting this leaks connections out of the pool permanently, eventually exhausting it entirely under sustained traffic
    }
  }),
);
