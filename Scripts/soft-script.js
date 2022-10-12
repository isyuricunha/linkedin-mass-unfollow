// Then, go to the Console view and paste the following code:

var c = document.querySelectorAll("button.is-following");
for (i in c) {
  c[i].click();
}

// If that code gives you an error, try using this one:
const buttons = [...document.querySelectorAll("button.is-following")];
for (let i = 0; i < buttons.length; i++)
  setTimeout(() => buttons[i].click(), i * 1000);
