(function(window) {

	/*************************************************************/
	/*********************** MANAGER CLASS ***********************/
	/*************************************************************/

	let SimplerInputsManager = (function() {

		/***************************************/
		/************* INITIALIZE **************/
		/***************************************/

		var Class = function() {

			// STORE this AS self, SO THAT IT IS ACCESSIBLE IN SUB-FUNCTIONS AND TIMEOUTS.

			var self = this;

			// SETUP VARIABLES FROM USER-DEFINED PARAMETERS

			/* Variable:  config                                 */
			/* Type:      Object                                 */
			/* Purpose:   This is the configutation options for  */
			/*            SimplerInputs.                         */
			self.config = { 
				'customGetValueFunctions' : {},
				'customSetValueFunctions' : {},
				'serializationDefaults' : {},
				'multiValueSeparator' : ','
			};

			document.addEventListener('DOMContentLoaded', function(event){

				self.initLogicForInputs( document.querySelectorAll('input, textarea, select') );

			});

		};

		/***************************************/
		/********** PUBLIC FUNCTIONS ***********/
		/***************************************/

		Class.prototype.initLogicForInputs = function( inputs ) {

			// STORE this AS self, SO THAT IT IS ACCESSIBLE IN SUB-FUNCTIONS AND TIMEOUTS.

			var self = this;

			// CHECK TO SEE IF WE ARE BEING PASSED A CALLBACK

			inputs.forEach(function(input){

				if ( ! ( 'simplerInputsInitialized' in input ) ) { // NEED TO ENSURE THAT THIS DOESN'T FIRE TWICE ON INPUTS

					let inputType = input.getType();

					switch( inputType ) {

						case 'radio' :

							input.addEventListener('change', function(event){

								var inputs = input.getScope().querySelectorAll('input[name="' + input.name + '"]');
								inputs.forEach(function(siblingInput){
									siblingInput.dispatchEvent(new Event('change-all', { bubbles: true }))
								});

							});

							break;

					}

					// STORE THE ORIGINAL VALUE TO TRACK IF INPUT HAS CHANGED

					input.storeOriginalValue();

					// SET UP KEYSTOPPED EVENT

					if ( inputType.startsWith('text') || [ 'email', 'tel', 'fax', 'url', 'date', 'time', 'week', 'month', 'number'].includes( inputType ) ) {

						window.simplerInputs.initKeyStoppedEvent( input );

					}

					input.simplerInputsInitialized = true;

				}

			});

		};

		Class.prototype.registerCustomType = function( params ) {

			// STORE this AS self, SO THAT IT IS ACCESSIBLE IN SUB-FUNCTIONS AND TIMEOUTS.

			var self = this;

			// CHECK TO SEE IF WE ARE BEING PASSED A CALLBACK

			if ( 'getValue' in params ) {
				self.config.customGetValueFunctions[params.type] = params.getValue;
			}

			if ( 'setValue' in params ) {
				self.config.customSetValueFunctions[params.type] = params.setValue;
			}

		};

		Class.prototype.setConfig = function( key, value ) {

			// STORE this AS self, SO THAT IT IS ACCESSIBLE IN SUB-FUNCTIONS AND TIMEOUTS.

			var self = this;

			// CHECK TO SEE IF WE ARE BEING PASSED A CALLBACK

			if ( key in self.config ) {

				self.config[key] = value;

			}

		};

		Class.prototype.initKeyStoppedEvent = function( element ) {

			var keystoppedTimer = null;

			element.addEventListener('keydown', function(event){

				clearTimeout(keystoppedTimer);

				keystoppedTimer = setTimeout(function() {
					event.target.dispatchEvent( new Event('keystopped', { bubbles: true }) );
				}, 600);

			});

		};

		return Class;

	}());

	/*************************************************************/
	/****************** PRIVATE HELPER FUNCTIONS *****************/
	/*************************************************************/

	function encodeSerializedHTTPParams( serializedParams ) {

		// SET UP VARIABLES

		let keyValuePairStringsTemp = [];

		// DE-SERIALIZE THE HTTP PARAMS

		let HTTPParamsObject = deSerializeHTTPParams(serializedParams);

		// ENCODE THE HTTP PARAMS

		HTTPParamsObject = encodeHTTPParamsObject( HTTPParamsObject );

		// RE-SERIALIZE THE PARAMS

		return serializeHTTPParams( HTTPParamsObject );

	};

	function encodeHTTPParamsObject( HTTPParamsObject ) {

		// LOOP THROUGH THE OBJECT AND ENCODE EVERYTHING

		let encodedHTTPParamsObject = {};

		let HTTPParamsArray = Object.entries(HTTPParamsObject);

		HTTPParamsArray.forEach( function( [key, value] ) {
			encodedHTTPParamsObject[encodeURIComponent(key)] = encodeURIComponent(value);
		});
		
		return encodedHTTPParamsObject;

	}

	function serializeHTTPParams( HTTPParamsObject ) {

		return Object.entries(HTTPParamsObject).map(function( [key, value] ) { 
			return key + '=' + value;
		}).join('&');

	}

	function deSerializeHTTPParams( serializedParams ) {

		// SET UP VARIABLES

		let keysValuesObject = {};
		let keyValuePairStrings = [];
		let keyValuePairString = '';
		let keyAndValueArray = [];
		let key = '', value = '';

		// REMOVE ANY STARTING QUESTION MARKS

		serializedParams = serializedParams.replace('?','');

		// MAKE SURE THE QUERY STRING ISN'T EMPTY

		if ( serializedParams != '' ) {

			// FIRST, SPLIT INTO AN ARRAY OF KEY/VALUE PAIRS

			keyValuePairStrings = serializedParams.split('&');

			// LOOP THROUGH THE KEY/VALUE PAIRS

			keyValuePairStrings.forEach(function( keyValuePairString ){

				// SPLIT THE PAIR BY THE "="

				keyAndValueArray = keyValuePairString.split('=');

				key = keyAndValueArray[0];
				value = keyAndValueArray[1];

				// ADD TO LOOKUP OBJECT

				keysValuesObject[key] = decodeURIComponent(value);

			});

		}

		return keysValuesObject;

	};

	/*************************************************************/
	/******************* PROTOTYPE ATTACHMENTS *******************/
	/*************************************************************/

	// APPEND OPTION TO SELECT ELEMENT

	let appendOption = function( value, label = value, dataAttr = {} ) {

		var newOption = document.createElement('option');
			newOption.value = value;
			newOption.textContent = label ? label : value;

		for ( var key in dataAttr ) {
			newOption.dataset[key] = dataAttr[key];
		}

		this.add(newOption);

	};

	HTMLSelectElement.prototype.appendOption = appendOption;

	// OVERWRITE OPTIONS COMPLETELY

	let setOptions = function( options ) {

		let select = this;

		select.clearChildren();

		options.forEach(function(option){

			select.appendOption( option.value, option.label, option.dataAttr );

		});

	};

	HTMLSelectElement.prototype.setOptions = setOptions;

	// CHECK TO SEE IF SELECT ELEMENT CONTAINS SPECIFIED VALUE AS OPTION

	let hasOption = function( value, caseSensitive = false ) {

		for ( var i = 0, l = this.options.length; i < l; i++ ) {

			let optionValue = this.options[i].value;
			let valueToCheck = value;

			if ( ! caseSensitive ) {

				optionValue = optionValue.toLowerCase();
				valueToCheck = valueToCheck.toLowerCase();

			}

			if ( optionValue == valueToCheck ) {

				return true;

			}

		}

		return false;

	};

	HTMLSelectElement.prototype.hasOption = hasOption;

	// SET VALUE

	let setValue = function( newValue ) {

		// CORRECT FOR NULL VALUES

		if ( newValue === null ) {
			newValue = '';
		}

		// SET UP VARIABLES

		let input = this;

		let inputType = input.getType();

		let foundMatchingType = false;

		let setValueFunctions = {

			'select-one' : function( input ) {

				if ( input.hasOption( newValue ) ) {

					input.value = newValue;

				} else {

					console.log('Error: Attempting to set the value of the following input to a non-option:');
					console.log(input);

				}

			},

			'select-multiple' : function( input ) {

				if ( input.hasOption( newValue ) ) {

					input.value = newValue;

				} else {

					console.log('Error: Attempting to set the value of the following input to a non-option:');
					console.log(input);

				}

			},

			'radio' : function( input ) {

				if ( newValue === '' ) {

					var allInputs = input.getScope().querySelectorAll('input[name="' + input.name + '"]');

					for ( let i = 0, l = allInputs.length; i < l; i++ ) {

						allInputs[i].checked = false;

					}

				} else {

					var inputToBeMarkedAsChecked = input.getScope().querySelector('input[name="' + input.name + '"][value="'+ newValue+'"]');

					if ( inputToBeMarkedAsChecked ) {

						inputToBeMarkedAsChecked.checked = true;

					} else {

						console.log('Error: Attempting to set the value of the following input to a non-option.');
						console.log(input);

					}

				}

			},

			'checkbox' : function( input ) {

				var values = newValue.split(',');

				var allInputs = input.getScope().querySelectorAll('input[name="' + input.name + '"]');

				for ( let i = 0, l = allInputs.length; i < l; i++ ) {

					allInputs[i].checked = values.includes( allInputs[i].value ) ? true : false;

				}

			}

		};

		// MERGE HE DEFAULT SETVALUE FUNCTIONS WITH ANY CUSTOM ONES ADDED BY EXTERNAL SOURCES

		Object.assign( setValueFunctions, window.simplerInputs.config.customSetValueFunctions );

		// LOOP THROUGH ALL POSSIBLE TYPES THAT WE HAVE FUNCTIONS FOR AND SET THE VALUE USING THEM

		let possibleTypes = Object.keys(setValueFunctions);

		for ( let possibleType of possibleTypes ) {

			if ( ( ! foundMatchingType ) && ( inputType == possibleType ) ) {

				setValueFunctions[possibleType]( input, newValue );

				foundMatchingType = true;

			}

		}

		if ( ! foundMatchingType ) {

			input.value = newValue;

		}

	};

	HTMLTextAreaElement.prototype.setValue = setValue;
	HTMLInputElement.prototype.setValue = setValue;
	HTMLSelectElement.prototype.setValue = setValue;

	// GET VALUE

	let getValue = function( multiValueSeparator = window.simplerInputs.config.multiValueSeparator ) {

		// SET UP VARIABLES

		let input = this;

		let inputType = input.getType();

		let foundMatchingType = false;

		let getValueFunctions = {

			'radio' : function( input ) {

				var inputThatIsChecked = input.getScope().querySelector('input[name="' + input.name + '"]:checked');

				if ( inputThatIsChecked ) {

					return inputThatIsChecked.value;

				} else {

					return '';

				}

			},

			'checkbox' : function( input ) {

				var inputsThatAreChecked = input.getScope().querySelectorAll('input[name="' + input.name + '"]:checked');

				return [...inputsThatAreChecked].reduce(function(accumulator, inputThatIsChecked){

					accumulator.push(inputThatIsChecked.value)

					return accumulator;

				}, []).join(multiValueSeparator);

			},

			'time' : function( input ) {

				return input.value + ( (input.value.match(/:/g)||[]).length == 1 ? ':00' : '');

			}

		};

		// MERGE HE DEFAULT GETVALUE FUNCTIONS WITH ANY CUSTOM ONES ADDED BY EXTERNAL SOURCES

		Object.assign( getValueFunctions, window.simplerInputs.config.customGetValueFunctions );

		let possibleTypes = Object.keys(getValueFunctions);

		for ( let possibleType of possibleTypes ) {

			if ( ( ! foundMatchingType ) && ( inputType == possibleType ) ) {

				value = getValueFunctions[possibleType]( input );

				foundMatchingType = true;

			}

		}

		if ( ! foundMatchingType ) {

			value = input.value;

		}

		return value;

	};

	HTMLTextAreaElement.prototype.getValue = getValue
	HTMLInputElement.prototype.getValue = getValue
	HTMLSelectElement.prototype.getValue = getValue;

	// STORE ORIGINAL VALUE

	let storeOriginalValue = function() {

		// SET UP VARIABLES

		let input = this;

		// SAVE THE CURRENT VALUE AS THE ORIGINAL VALUE SO THAT WE CAN CHECK LATER IF THE VALUE HAS CHANGED

		input.originalValue = input.getValue();

	};

	HTMLTextAreaElement.prototype.storeOriginalValue = storeOriginalValue;
	HTMLInputElement.prototype.storeOriginalValue = storeOriginalValue;
	HTMLSelectElement.prototype.storeOriginalValue = storeOriginalValue;

	// DETERMINE IF VALUE HAS CHANGED

	let hasChanged = function( caseSensitive = false ) {

		// SET UP VARIABLES

		let input = this;

		// CHECK TO SEE IF THE VALUE HAS CHANGED. IF THERE IS NO ORIGINAL VALUE, ASSUME TRUE

		if ( 'originalValue' in input ) {

			// BY DEFAULT, WE ARE IGNORING CASE CHANGES

			if ( ! caseSensitive ) {

				return ( input.originalValue.toLowerCase() !== input.getValue().toLowerCase() );

			} else {

				return ( input.originalValue !== input.getValue() );

			}

		} else {

			return true;

		}

	};

	HTMLTextAreaElement.prototype.hasChanged = hasChanged;
	HTMLInputElement.prototype.hasChanged = hasChanged;
	HTMLSelectElement.prototype.hasChanged = hasChanged;

	// RESET VALUE TO ORIGINAL VALUE

	let resetValueToOriginal = function() {

		// SET UP VARIABLES

		let input = this;

		// IF THE ORIGINAL VALUE PROPERTY EXISTS IN THE INPUT'S DOM OBJECT, SET THE VALUE TO IT

		if ( 'originalValue' in input ) {

			input.setValue( input.originalValue );

		} else {

			// IF THERE IS NO ORIGINAL VALUE, THEN THERE IS NOTHING TO RESTORE. GO AHEAD AND STORE THE VALUE NOW

			input.storeOriginalValue();

		}

	};

	HTMLTextAreaElement.prototype.resetValueToOriginal = resetValueToOriginal
	HTMLInputElement.prototype.resetValueToOriginal = resetValueToOriginal
	HTMLSelectElement.prototype.resetValueToOriginal = resetValueToOriginal;

	// TOGGLE VALUE (IF RADIO OR CHECKBOX)

	let toggleValue = function() {

		// SET UP VARIABLES

		let input = this;

		// SET THE VALUE, IN SPECIFIC WAYS BASED ON INPUT TYPE

		switch ( input.getType() ) {

			case 'radio' :

				var inputsInGroup = input.getScope().querySelectorAll('input[name="' + input.name + '"]');

				if ( inputsInGroup.length = 2 ) {

					var inputToBeMarkedAsChecked = input.getScope().querySelector('input[name="' + input.name + '"]:not(:checked)');
						inputToBeMarkedAsChecked.checked = true;
						inputToBeMarkedAsChecked.dispatchEvent(new Event('change', { 'bubbles' : true }));

				} else {

					console.log('Error: Attempting to toggle the value of a radio input that doesn\'t have exactly two options.');
					console.log(input);

				}

				break;

			case 'checkbox' :

				if ( input.checked ) {

					input.checked = false;

				} else {

					input.checked = true;

				}

				input.dispatchEvent(new Event('change', { 'bubbles' : true }));

				break;


			default :

					console.log('Error: Attempting to toggle the value of an input that doesn\'t have exactly two options.');
					console.log(input);

				break;

		}

	};

	HTMLInputElement.prototype.toggleValue = toggleValue;

	// GET TRUE TYPE

	let getType = function() {

		// SET UP VARIABLES

		let input = this;
		let trueType = '';

		// CHECK FOR CACHED TRUE TYPE (CACHED FOR PERFORMANCE TO AVOID RECALCULATION)

		if ( 'trueType' in input ) {

			trueType = input.trueType;

		} else {

			// THERE ARE TWO THINGS TO LOOK AT HERE. THE FIRST IS THE SPECIFIED INPUT TYPE, WHICH IS
			// ACCESSED THROUGH THE HTML ATTRIBUTE. THIS IS WHAT THE WEBPAGE IS INTENDING THE INPUT TO
			// BE. HOWEVER, NOT ALL BROWSERS SUPPORT ALL INPUT TYPES, SO WE ALSO HAVE TO LOOK AT THE
			// DOM ".type" PROPERTY. ALSO, TEXTAREAS DON'T HAVE AN HTML ATTRIBUTE, SO WE HAVE TO USE
			// THE DOM ".type" PROPERTY AS A FALLBACK IN THAT CASE.

			let specifiedType = input.getAttribute('type');
			let browserType = input.type;

			// LOAD THE FALLBACK IF THERE IS NO SPECIFIED TYPE

			if ( specifiedType == null ) {

				specifiedType = browserType;

			}

			// NOW WE NEED TO COMPARE THE SPECIFIED TYPE TO THE ACTUAL TYPE THAT THE BROWSER IS REPORTING.
			// IF THE SPECIFIED TYPE IS "date", AND THE BROWSER DOESN'T SUPPORT THAT, THEN THE BROWSER TYPE
			// WILL BE TEXT. SO WE WILL REPORT "text-date". UNSUPPORTED "time" WILL SHOW AS "text-time". ETC..

			if ( specifiedType !== browserType ) {

				trueType = ( 'text-' + specifiedType ).replace('text-text-','text-'); // THE REPLACE IS TO ALLOW FOR MANUALLY SPECIFYING A CUSTOM TYPE TO TEST

			} else {

				trueType = specifiedType;

			}

			input.trueType = trueType;

		}

		return trueType;

	};

	HTMLTextAreaElement.prototype.getType = getType;
	HTMLInputElement.prototype.getType = getType;
	HTMLSelectElement.prototype.getType = getType;

	// GET SCOPE (PARENT WRAPPER OF INPUT SET)

	let getScope = function() {

		// SET UP VARIABLES

		let input = this;
		let ancestorChain = [ input ];
		let ancestor = input;
		let numInputs = 0;

		// CHECK TO SEE IF THE INPUT IS A RADIO OR CHECKBOX. IF SO, WE NEED TO STEP UP THE ANCESTOR CHANGE UNTIL WE HAVE
		// A ELEMENT WHO HAS MORE THAN ONE CHILD WITH THE SAME INPUT NAME. THE IDEA HERE IS THAT A RADIO BUTTON IS GOING
		// TO HAVE MULTIPLE INPUT ELEMENTS WITH THE SAME NAME. ALL OF THEM ARE ONE CONCEPTUAL INPUT AND NEED TO BE TREATED
		// AS A GROUP. BUT THERE MAY BE TWO FORMS ON THE PAGE, AND BOTH FORMS MIGHT HAVE AN INPUT GROUP WITH THE SAME NAME,
		// AND WE DON'T WANT TO MERGE THE TWO INPUT GROUPS.
		// EXAMPLE:
		// A LIST OF PERSONS WHERE EACH LIST ITEM IS EDITABLE. EACH PERSON HAS THE SAME EDITABLE ATTRIBUTES, INCLUDING A
		// RADIO BUTTON WITH THE NAME OF "certifications". ALL OF THE INPUTS WITH THE NAME "certifications" INSIDE ONE FORM
		// SHOULD BE GROUPED TOGETHER. BUT WE DON'T WANT TO GROUP ALL INPUTS WITH THE NAME "certifications" ON THE PAGE AS
		// THE SAME GROUP, BECAUSE THEY ARE IN DIFFERENT FORMS.
		// THE REASON WE DON'T JUST LOOK FOR "form" TAG AS A PARENT IS THAT WE ALL ANY ELEMENT TO BE A PSEUDO-FORM WRAPPER
		// IN THE .serialize() FUNCTION.

		if ( input.getType() == 'radio' || input.getType() == 'checkbox' ) {

			// STEP UP THE ANCESTOR CHANGE, UNTIL WE HAVE AN ELEMENT THAT HAS NO PARENT, WHO'S PARENT IS <html>, OR WHO HAS
			// MULTIPLE OF THE SPECIFIED INPUT AS CHILDREN

			while ( ( numInputs < 2 ) && ( ancestor.parentElement !== null ) &&( ancestor.tagName.toLowerCase() !== 'form' ) && ( ancestor.parentElement.tagName.toLowerCase() !== 'html' ) ) {

				ancestor = ancestor.parentElement;
				ancestorChain.push(ancestor);

				numInputs = ancestor.querySelectorAll('input[name="' + input.name + '"]').length;

			}

			return ancestorChain[ancestorChain.length-1];

		} else {

			return input.parentElement;

		}

	};

	HTMLInputElement.prototype.getScope = getScope;

	// SERIALIZE ALL INPUTS IN A WRAPPER

	let getValues = function( params ) {

		// SET UP VARIABLES

		var form = this; // THIS IS CALLED FORM. BUT IT COULD BE ANY ELEMENT AS A WRAPPER
		var values = {};
		var globalConfig = window.simplerInputs.config;

		// PRELOAD KEY VALUE PAIRS THAT ARE PRESERIALIZED

		if ( form.getAttribute('serialized-params') !== null ) {
			values = deSerializeHTTPParams(form.getAttribute('serialized-params'));
		}

		// SET UP CONFIG DEFAULTS

		var config = {
			'partialSubmitMode' : 'partialSubmitMode' in globalConfig.serializationDefaults ? globalConfig.serializationDefaults.partialSubmitMode : ( form.getAttribute('partialSubmit') !== null ),
			'excludedParentSelectors' : 'excludedParentSelectors' in globalConfig.serializationDefaults ? globalConfig.serializationDefaults.excludedParentSelectors : [],
			'multiValueSeparator' : globalConfig.multiValueSeparator
		};

		// APPLY INDVIDUAL FUNCTION CALL OVERRIDES VIA PARAMETER

		if ( typeof params === 'object' ) {

			if ( 'partialSubmitMode' in params ) {
				config.partialSubmitMode = params.partialSubmitMode;
			}
			if ( 'excludedParentSelectors' in params ) {
				config.excludedParentSelectors = params.excludedParentSelectors;
			}
			if ( 'multiValueSeparator' in params ) {
				config.multiValueSeparator = params.multiValueSeparator;
			}

		}

		// SET UP VARIABLE STATE

		var state = {
			'isInputInExcludedParent' : null,
			'inputSubmitMode' : null,
			'inputShouldBeSubmitted' : null
		}

		// LOOP THROUGH ALL FIELD OBJECTS AND CHECK FOR VALIDITY AND CHANGES. ANY INVALID FIELDS WILL SET
		// FORM TO INVALID, AND ALL CHANGES WILL BE RECORDED FOR SUBMISSION

		form.getSubmittableInputs().forEach(function(input){

			// CHECK TO SEE IF INPUT IS IN EXCLUDED PARENT

			state.isInputInExcludedParent = false;
			config.excludedParentSelectors.forEach(function(excludedParentSelector){
				let excludedParent = input.closest(excludedParentSelector);
				if ( excludedParent !== false && form.contains(excludedParent) ) {
					state.isInputInExcludedParent = true;
				}
			});

			// DETERMINE THE INPUT'S SUBMIT MODE

			state.inputSubmitMode = 'partial';
			if ( input.getAttribute('alwaysSubmit') !== null ) {
				state.inputSubmitMode = 'always';
			}
			if ( input.getAttribute('neverSubmit') !== null ) {
				state.inputSubmitMode = 'never';
			}

			// DETERMINE IF INPUT SHOULD BE SUBMITTED

			switch( state.inputSubmitMode ) {
				case 'never' :
					state.inputShouldBeSubmitted = false;
					break;
				case 'always' :
					state.inputShouldBeSubmitted = true;
					break;
				default :
					state.inputShouldBeSubmitted = ( ! config.partialSubmitMode ) || ( input.hasChanged() );
					break;
			}

			if ( input.getType() === 'checkbox' && input.getValue() === '' ) {
				state.inputShouldBeSubmitted = false;				
			}

			if ( state.isInputInExcludedParent ) {
				state.inputShouldBeSubmitted = false;	
			}

			// IF THE DATA HAS CHANGED OR IF THE FIELD IS SET TO ALWAYS SUBMIT, ADD IT TO THE DATA STACK

			if ( state.inputShouldBeSubmitted ) {

				values[ input.name ] = input.getValue( config.multiValueSeparator );

			}

		});

		// RETURN SERIALIZED DATA

		return values;

	};

	Element.prototype.getValues = getValues;

	// SERIALIZE ALL INPUTS IN A WRAPPER

	let serializeForm = function( params ) { // THIS IS DIFFERENT FUNCTION NAME DUE TO CONFLICT WITH GENERIC FUNCTION

		// SET UP VARIABLES

		var form = this;

		if ( ! params ) {
			params = {};
		}

		// EXTRACT SERIALIZATION PARAMS

		let innerConnector = 'innerConnector' in params ? params.innerConnector : undefined;
		let outerConnector = 'outerConnector' in params ? params.outerConnector : undefined;

		delete params.innerConnector;
		delete params.outerConnector;

		// GET THE VALUES AS AN OBJECT

		let values = form.getValues( params );

		// SERIALIZE THE VALUES

		let serializedValues = serialize( values, innerConnector, outerConnector );

		// RETURN SERIALIZED DATA

		return serializedValues;

	};

	Element.prototype.serialize = serializeForm;

	// GET SUBMITTABLE INPUT NAMES IN A WRAPPER

	let getSubmittableInputs = function() {

		// SET UP VARIABLES

		let keys = [];
		let inputs = [];

		// LOOP THROUGH ALL FIELD OBJECTS AND CHECK FOR VALIDITY AND CHANGES. ANY INVALID FIELDS WILL SET
		// FORM TO INVALID, AND ALL CHANGES WILL BE RECORDED FOR SUBMISSION

		this.querySelectorAll('input, textarea, select').forEach(function(input){

			if ( keys.includes( input.name ) ) {
				return;
			}

			if ( input.name === '' ) {
				return;
			}

			if ( input.disabled ) {
				return;
			}

			// IF THE DATA HAS CHANGED OR IF THE FIELD IS SET TO ALWAYS SUBMIT, ADD IT TO THE DATA STACK

			keys.push( input.name );
			inputs.push( input );

		});

		// RETURN KEYS

		return inputs;

	};

	Element.prototype.getSubmittableInputs = getSubmittableInputs;

	// GET ALL INPUT NAMES IN A WRAPPER

	let getAllInputs = function() {

		return Array.from(this.querySelectorAll('input, textarea, select'));

	};

	Element.prototype.getAllInputs = getAllInputs;

	// UPDATE ALL STORED ORIGINAL VALUES TO CURRENT

	let updateOriginalValues = function() {

		this.getAllInputs().forEach(function(input){

			input.storeOriginalValue();

		});

	};

	Element.prototype.updateOriginalValues = updateOriginalValues;

	// RESET ALL VALUES TO STORED ORIGINALS

	let resetValuesToOriginal = function() {

		this.getAllInputs().forEach(function(input){

			input.resetValueToOriginal();

		});

	};

	Element.prototype.resetValuesToOriginal = resetValuesToOriginal;

	// SET VALUES FOR ALL INPUTS IN A FORM

	let setValuesForAllInputsInForm = function( values ) {

		var form = this;

		// SET EDITABLE INPUT VALUES FROM HTTP PARAMS

		let submittableInputs = form.getSubmittableInputs();

		submittableInputs.forEach(function(input){

			if ( input.name in values ) {

				input.setValue( values[input.name] );

			} else {

				input.resetValueToOriginal();

			}

		});

	};

	HTMLFormElement.prototype.setValues = setValuesForAllInputsInForm;

	/*************************************************************/
	/******************* GENERAL USAGE FUNCTIONS *****************/
	/*************************************************************/

	window.serialize = function( data, innerConnector = '=', outerConnector = '&' ) {

		// CONVERT THE OBJECT OF KEY VALUE PAIRS TO AN ARRAY OF STRINGIFIED KEY/VALUE PAIRS

		let stringifiedKeyValuePairs = Object.entries( data ).map( ( [ key, value ] ) => encodeURIComponent( key ) + innerConnector + encodeURIComponent( value ) );

		// JOIN THE STRINFIED PAIRS AND RETURN

		return stringifiedKeyValuePairs.join( outerConnector );

	};

	window.deSerialize = function( serializedData, innerConnector = '=', outerConnector = '&' ) {

		let stringifiedKeyValuePairs = serializedData ? serializedData.split( outerConnector ) : [];

		return stringifiedKeyValuePairs.reduce(( accumulator, keyValuePair ) => {
			[key, value] = keyValuePair.split( innerConnector );
			accumulator[safeDecodeURIComponent( key )] = safeDecodeURIComponent( value );
			return accumulator;
		}, {});

	};

	function safeDecodeURIComponent( string ) {
		try {
			string = decodeURIComponent(string)
		} catch (ex) {
			string = string;
		}
		return string;
	}

	/*************************************************************/
	/*********************** INITIALIZATION **********************/
	/*************************************************************/

	window.simplerInputs = new SimplerInputsManager();

}(window));