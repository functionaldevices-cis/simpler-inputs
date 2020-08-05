# SimplerInputs - A Javascript Prototype-Based Abstraction Layer
This is an abraction layer added to input and form DOM prototypes, to make working with inputs easier.
Generally, working directly with prototypes is considered bad practice. However, I disagree in some cases. With this library, it becomes much simpler to work with inputs and forms.

With raw JS, to get the value of a text input, you'd say something like:

```javascript
let myTextInput = document.querySelector('[name="my-text-input"]');
let value = myTextInput.value;
```

To get the value of a set of radio inputs, though, you'd have to:

```javascript
let myRadioInput = document.querySelector('[name="my-radio-input"]:checked');
let value = myRadioInput.value;
```

You have to write a different set of code depending on the input type.

With SimplerInputs, regardless of type (radio, text, date ... as well as textareas and selects) you'd write:

```javascript
let myInput = document.querySelector('[name="my-input"]');
let value = myInput.getValue();
```

It just works.

---------------------------

It's even more helpful when setting values. Vanilla JS:

```javascript
// SET TEXT INPUT

let myTextInput = document.querySelector('[name="my-text-input"]');
myTextInput.value = specifiedValue;

// SET RADIO INPUT

let myRadioInput = document.querySelector('[name="my-radio-input"][value="'+specifiedValue+'"]');
myInput.checked = true;
```

With SimplerInputs, that becomes:

```javascript
// SET ANY INPUT
let myInput = document.querySelector('[name="my-input"]');
myInput.setValue(specifiedValue);
```
