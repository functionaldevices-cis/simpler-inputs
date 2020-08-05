# SimplerInputs - A Javascript Prototype-Based Abstraction Layer
This is an abraction layer added to input and form DOM prototypes, to make working with inputs easier.
Generally, working directly with prototypes is considered bad practice. However, I disagree in some cases. With this library, it becomes much simpler to work with inputs and forms.

With vanilla JS, to get the value of inputd, you'd write something like:

```javascript
// GET TEXT INPUT VALUE
let myTextInput = document.querySelector('[name="my-text-input"]');
let value = myTextInput.value;

// GET RADIO INPUT VALUE
let myRadioInput = document.querySelector('[name="my-radio-input"]:checked');
let value = myRadioInput.value;
```
You have to write a different set of code depending on the input type.

With SimplerInputs, regardless of type (radio, text, date ... as well as textareas and selects) you'd write:

```javascript
// GET ANY INPUT VALUE
let myInput = document.querySelector('[name="my-input"]');
let value = myInput.getValue();
```

It just works.

---------------------------

It's even more helpful when setting values. Vanilla JS:

```javascript
// SET TEXT INPUT VALUE
let myTextInput = document.querySelector('[name="my-text-input"]');
myTextInput.value = specifiedValue;

// SET RADIO INPUT VALUE
let myRadioInput = document.querySelector('[name="my-radio-input"][value="'+specifiedValue+'"]');
myInput.checked = true;
```

With SimplerInputs, that becomes:

```javascript
// SET ANY INPUT VALUE
let myInput = document.querySelector('[name="my-input"]');
myInput.setValue(specifiedValue);
```
