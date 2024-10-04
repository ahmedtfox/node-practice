exports.printOut = (input) => {
  let today = new Date();
  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();
  console.log("-".repeat(7));
  console.log(`${h}:${m}:${s}`);
  console.log(input);
  console.log("-".repeat(7));
};
