const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");

const getReminder = async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

//.Update
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByIdAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(reminder);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const sendScheduledMessage = async (messageIndex) => {
  const send_to = process.env.EMAIL_SEND;
  const send_from = process.env.EMAIL_USER;

  const weekdays = [
    "Duminica",
    "Luni",
    "Marti",
    "Miercuri",
    "Joi",
    "Vineri",
    "Sambata",
  ];
  const timesOfDay = ["Dimineata", "Amiaza", "Seara"];

  const currentDate = new Date();
  const currentWeekday = weekdays[currentDate.getDay()];
  const currentTimesOfDay = timesOfDay[messageIndex];
  const subject = `${currentWeekday} ${currentTimesOfDay}`;
  const customMessage = `Pastilele pentru ${currentWeekday} ${currentTimesOfDay} le-ai luat?`;

  try {
    await sendEmail(subject, customMessage, send_to, send_from);
    console.log(`Sent message: (${customMessage})`);
  } catch (error) {
    console.log(error);
  }
};

const sendScheduledMessages = asyncHandler(async () => {
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  let messageIndex = -1;

  // Send message every day at 12:59, 13:12, and 13:15
  if (
    (currentHour === 07 && currentMinute === 10) ||
    (currentHour === 12 && currentMinute === 50) ||
    (currentHour === 19 && currentMinute === 01)
  ) {
    messageIndex = [10, 50, 01].indexOf(currentMinute);
  }

  if (messageIndex !== -1) {
    setTimeout(() => sendScheduledMessage(messageIndex));
  }
});

sendScheduledMessages(); // send the first message immediately

// Check every 4 hours
const myInterval = setInterval(sendScheduledMessages, 60 * 1000);

module.exports = { getReminder, updateReminder };
