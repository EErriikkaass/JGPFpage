/*
Fundamentals Code

Shift ALT F tidies page with prettier extension
*/

function myfunction(p1, p2) {

}

function initialize() {
  //window.alert("Hello World");
  document.getElementById("printhere").innerHTML = "Hello World";

  let x = "20";
  let y = "25";
  document.getElementById("datatypes").innerHTML = parseInt(x) + parseInt(y);

  // booleans and conditionals
  let xx = 5;
  let yy = 9;
  let zz = 5;

  if (xx != yy) {
    document.getElementById("boolean1").innerHTML =
      "Its true " + x + " != " + y;
  }

  if (xx == zz) {
    document.getElementById("boolean2").innerHTML = "This is true";
  }

  let my_array = ["item1", "item2", "item3"];
  // Referring to Array by index
  document.getElementById("array").innerHTML = my_array[1];
  my_array[0] = "newitem1";
  document.getElementById("changearray").innerHTML = my_array[0];
  document.getElementById("fullarray").innerHTML = my_array;
  document.getElementById("arraylength").innerHTML = my_array.length;

  let text = "";
  for (i = 0; i < 100; i += 5) {
    text += " # " + i;
  }
  document.getElementById("forloop").innerHTML = text;

  // debugging
  let xq = 20;
  let yq = 8;
  let zq = xq + yq;
  console.log("The value of zq on line 50 is " + zq)









}
// Function
function dateTime() {
  document.getElementById("dateTime").innerHTML = Date();
}
