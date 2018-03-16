const express = require("express");
const Notification = require("../models/notification");

const router = new express.Router();
router.get("/", (req, res) => {
  Notification.find({ userId: req.userId })
    .lean()
    .exec((err, notifications) => {
      console.log(notifications);
      if (err) {
        return res.status(400).json({
          succes: false,
          message: "u done goofed up"
        });
      } else if (notifications.length === 0) {
        return res.status(404).json({
          succes: false,
          message: "not found"
        });
      }

      return res.status(200).json(notifications);
    });
});

router.get("/:id", (req, res) => {
  Notification.findById(req.params.id, (err, notification) => {
    console.log(notification);
    if (err) {
      return res.status(400).json({
        succes: false,
        message: "u done goofed up"
      });
    } else if (!notification) {
      return res.status(404).json({
        succes: false,
        message: "not found"
      });
    }

    return res.status(200).json(notification);
  });
});

router.delete("/:id", (req, res) => {
  Notification.findByIdAndRemove(req.params.id, (err, notification) => {
    let response = {
      message: "Todo successfully deleted",
      id: notification._id
    };
    res.status(200).send(response);
  });
});

router.put("/:id", (req, res) => {
  Notification.findByIdAndUpdate(
    req.params.id,
    req.body,
    (err, notification) => {
      let response = {
        message: "Todo successfully deleted",
        id: notification._id
      };
      res.status(200).send(response);
    }
  );
});

router.post("/", (req, res) => {
  let newNotification = {
    userId: req.userId,
    tag: req.body.tag,
    callback: req.body.callback
  };

  Notification.create(newNotification, (err, notification) => {
    return res.status(201).json(notification._doc);
  });
});

module.exports = router;
