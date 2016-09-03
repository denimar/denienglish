//Module
angular.module('myApp', ['uiDeniModalMdl', 'ngMaterial', 'ngMessages']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $templateCache, uiDeniModalSrv) {

    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY').split(' ').map(function(state) {
      return {abbrev: state};
	});

	this.openSimpleWindow = function() {
		uiDeniModalSrv.createWindow({
			title: 'Lion',
			width: '480px',			
			height: '360px',
			position: uiDeniModalSrv.POSITION.CENTER,
			htmlTemplate: '<img style="width:100%;height:100%;" src="images/lion.jpg" />',
			modal: true
		}).show();
	}

	this.openWindowWithHtmlTemplate = function() {
		uiDeniModalSrv.createWindow({
			title: 'Sending e-mail...',
			width: '470px',			
			height: '190px',
			position: uiDeniModalSrv.POSITION.CENTER,
			buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
			htmlTemplate: $templateCache.get('template1'),
			modal: true
		}).show();
	}

	this.openWindowWithTemplateAngularMaterial = function() {
		var modal = uiDeniModalSrv.createWindow({
			scope: $scope,
			title: 'Form Angular Material',
			width: '680px',			
			height: '520px',
			position: uiDeniModalSrv.POSITION.CENTER,
			buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
			urlTemplate: 'template-angular-material.htm',
			modal: true
		});

		modal.show().then(function(msgResponse) {
			var editName = $(modal).find('input[ng-model=\"user.name\"]');
			uiDeniModalSrv.ghost('Response', 'Name : ' + editName.val());
		});
	}

	this.openWindowWithTemplateAngularMaterialWithFormValidation = function() {
		var modal = uiDeniModalSrv.createWindow({
			scope: $scope,
			title: 'Form Angular Material with Form Validation',
			width: '450px',			
			height: '300px',
			position: uiDeniModalSrv.POSITION.CENTER,
			buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
			urlTemplate: 'template-angular-material-with-form-validation.htm',
			modal: true
		});

		modal.show().then(function(msgResponse) {
			if (msgResponse.button == 'ok') {
				console.log(msgResponse.form.data);
				uiDeniModalSrv.info('See the result in console;');
			}	
		});
	}

	this.openWaiting = function() {
		var waitWindow = uiDeniModalSrv.createWaiting('Waiting 3 seconds...');
		waitWindow.show();
		setTimeout(function() {
			waitWindow.close();
		}, 3000);
	}

	this.openDialogConfirm = function() {
		uiDeniModalSrv.confirm("Confirm message testing... ?").then(function(button) {
			uiDeniModalSrv.ghost('Response', 'You clicked the button : ' + button);
		});
	}

	this.showGhostMessage1 = function() {
		uiDeniModalSrv.ghost('Top Right', 'Showing Ghost Message at Top Right...');
	}

	this.showGhostMessage2 = function() {
		uiDeniModalSrv.ghost('Bottom Right', 'Showing Ghost Message at Bottom Right...', null, uiDeniModalSrv.POSITION.BOTTOM_RIGHT);
	}

	this.openDialogError = function() {
		uiDeniModalSrv.error("Error message testing...");
	}

	this.openDialogInfo = function() {
		uiDeniModalSrv.info("Info message testing...");
	}

	this.openDialogWarning = function() {
		uiDeniModalSrv.warning("Warning message testing...");
	}

	this.openDialogImageAndDescriptionAdd = function() {
		var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage();
		wndDescriptionMorImage.show().then(function(response) {
			if (response.button == 'ok') {
				$('#examples-dsc').html(response.data.description);
				$('#examples-img').attr('src', URL.createObjectURL(response.data.fileEl.get(0).files[0]));
			}
		});	
	}	

	this.openDialogImageAndDescriptionEdit = function() {
		var description = $('#examples-dsc').html();
		var imgEl = $('#examples-img');

		var config = {
			description: description,
			imgSrc: imgEl.attr('src')
		};

		var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage(config);
		wndDescriptionMorImage.show().then(function(response) {
			if (response.button == 'ok') {
				$('#examples-dsc').html(response.data.description);
				$('#examples-img').attr('src', URL.createObjectURL(response.data.fileEl.get(0).files[0]));
			}
		});	
	}	

	$templateCache.put('template1',  
		'<div class="template1">\n' +		
		'	<table>\n' +
		'		<tr>\n' +		
		'			<td>First Name</td><td><input type="text" /></td>\n' +
		'		</tr>\n' +				
		'		<tr>\n' +		
		'			<td>Last Name</td><td><input type="text" /></td>\n' +
		'		</tr>\n' +				
		'		<tr>\n' +		
		'			<td>Company</td><td><input type="text" /></td>\n' +
		'		</tr>\n' +				
		'		<tr>\n' +		
		'			<td>e-mail</td><td><input type="email" /></td>\n' +
		'		</tr>\n' +				
		'	</table>\n' +
		'</div>'
	);	

    $scope.user = {
      name: 'John Doe',
      email: '',
      phone: '',
      address: 'Mountain View, CA',
      donation: 19.99
    };	

});
