(function(window) {

	/*************************************************************/
	/************************* FUNCTIONS *************************/
	/*************************************************************/

	function initDatePicker( input ) {
		input.setValue(input.value);
		input.setAttribute('placeholder', 'mm / dd / yyyy')
	};

	function correctForTimezone ( dateTimeString ) {

		let offset = (new Date()).getTimezoneOffset() / 60;
			offset = offset < 10 ? '0' + offset : '' + offset;

		if ( ( dateTimeString.includes('-') ) && ( ! dateTimeString.includes('T') ) ) {

			dateTimeString += 'T' + offset + ':00:00';

		}

		return dateTimeString;

	};

	Date.prototype.toISODateString = function() {

		if ( ! isNaN(this) ) {

			// CREATE ISO STRING AND RETURN JUST THE DATE PORTION

			return this.toISOString().split('T')[0];

		} else {

			return '';

		}

	};

	Date.prototype.toISOTimeString = function() {

		if ( ! isNaN(this) ) {

			// CREATE ISO STRING AND RETURN JUST THE DATE PORTION

			return this.toISOString().split('T')[1];

		} else {

			return '';

		}

	};



	/*************************************************************/
	/*********************** INITiALIZATION **********************/
	/*************************************************************/

	window.simplerInputs.registerCustomType({
		'type' : 'text-date',
		'getValue' : function( input ) {
			return (new Date(input.value)).toISODateString();
		},
		'setValue' : function( input, newValue ) {
			if ( newValue ) {
				input.value = (new Date(correctForTimezone(newValue))).toLocaleDateString();
			}
		}
	});

	document.addEventListener('DOMContentLoaded', function(event){

		document.querySelectorAll('input[type="text-date"]').forEach(function(input){
			initDatePicker( input );
		});

	});

}(window));



	window.simplerInputs.registerCustomType({
		'type' : 'text-datetime-local',
		'setValue' : function( input, newValue ) {
			input.value = newValue;
			input.updateFakeDateAndTimeInputs();
		}
	});