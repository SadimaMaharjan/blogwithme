const Handlebars = require("handlebars");
Handlebars.registerHelper("format_date", function (date) {
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const parsedDate = new Date(Date.parse(date));
  const formattedDate = parsedDate.toLocaleDateString("en-US", options);
  return formattedDate;
});
// module.exports = {
//   format_date: (date) => {
//     return `${new Date(date).getMonth() + 1}/${new Date(
//       date
//     ).getDate()}/${new Date(date).getFullYear()}`;
//   },
// };
