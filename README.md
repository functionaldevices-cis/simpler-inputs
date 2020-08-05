# SimplerInputs - A Javascript Prototype-Based Abstraction Layer
This is an abraction layer added to input and form DOM prototypes, to make working with inputs easier.
Generally, working directly with prototypes is considered bad practice. However, I disagree in some cases. With this library, it becomes much simpler to work with inputs and forms.

## Getting Values of Inputs

### Vanilla JS:

```javascript
// GET TEXT INPUT VALUE
let myTextInput = document.querySelector('[name="my-text-input"]');
let value = myTextInput.value;

// GET RADIO INPUT VALUE
let myRadioInput = document.querySelector('[name="my-radio-input"]:checked');
let value = myRadioInput.value;
```
You have to write a different set of code depending on the input type.

### SimplerInputs (Regardless of Type: Text, Checkbox, Radio, Date, Select, Textarea, etc.)

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
