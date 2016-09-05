describe('ApagarDepoisSrvTest', function () {

    describe('when I call myService.one', function(){
        it('returns 1', function(){

            myTestFunction = function(StringSrv){
                 expect(myService.leftPad(50, 8, '0')).toBe('00008');
            }

            //we only need the following line if the name of the 
            //parameter in myTestFunction is not 'myService' or if
            //the code is going to be minify.
            myTestFunction.$inject = [ 'StringSrv' ];

            var myInjector = angular.injector([ 'app' ]);
            myInjector.invoke( myTestFunction );
        })

    })

	/*
    var $injector = angular.injector([ 'app' ]);
    var myService = $injector.get( 'StringSrv' );

    it('should have a method to check if the path is active', function() {
        expect(myService.leftPad(50, 8, '0')).toBe('00008');
    });	
    */


	/* este deu certo 

    var $injector = angular.injector([ 'apagarDepois' ]);
    var myService = $injector.get( 'apagarDepoisSrv' );

    it('should have a method to check if the path is active', function() {
        expect(myService.name).toBe('denimar de moraes');
        //expect(scope.isActive('/about')).toBe(true);
        //expect(scope.isActive('/contact')).toBe(false);
    });	

    */


});



