# SimplerInputs - A Javascript Prototype-Based Abstraction Layer
This is an abraction layer added to input and form DOM prototypes, to make working with inputs easier. While generally, working directly with prototypes is considered bad practice, this library has greatly simplified the process of working with inputs for FDI's internal web applications. It is being shared here publicly as a way to give back to the JS community.'

Documentation will be added to the Wiki in the future as time allows.

## Getting Values of Inputs

### Vanilla JS:

You have to write a different set of code depending on the input type.

```javascript
// GET TEXT INPUT VALUE
let myTextInput = document.querySelector('[name="my-text-input"]');
let value = myTextInput.value;

// GET RADIO INPUT VALUE
let myRadioInput = document.querySelector('[name="my-radio-input"]:checked');
let value = myRadioInput.value;
```
### SimplerInputs

The same function works regardless of type: Text, Checkbox, Radio, Date, Select, Textarea, etc.

```javascript
// GET ANY INPUT VALUE
let myInput = document.querySelector('[name="my-input"]');
let value = myInput.getValue();
```

## Setting Input Values

### Vanilla JS:

```javascript
// SET TEXT INPUT VALUE
let myTextInput = document.querySelector('[name="my-text-input"]');
myTextInput.value = specifiedValue;

// SET RADIO INPUT VALUE
let myRadioInput = document.querySelector('[name="my-radio-input"][value="'+specifiedValue+'"]');
myInput.checked = true;
```

### SimplerInputs:

```javascript
// SET ANY INPUT VALUE
let myInput = document.querySelector('[name="my-input"]');
myInput.setValue(specifiedValue);
```
