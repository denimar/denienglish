			//sort routine itself
			controller.options.data.sort(function(rec1, rec2) {

				for (var index = 0 ; index < sortersArray.length ; index++) {
					var sort = sortersArray[index];
					var direction = sort.direction || 'ASC'; //default value
					var desc = direction.toLowerCase() == 'desc';
					var nestedField = sort.name.indexOf('.') != -1;

					//////////////////////////////////////////
					//teste abaixo
					//////////////////////////////////////////
					var sortReturn = 0;

					/*
					var value1;
					var value2;

					if (nestedField) {
						value1 = eval('rec1.' + sort.name);
						value2 = eval('rec2.' + sort.name);	
					} else {
						value1 = rec1[sort.name];
						value2 = rec2[sort.name];					
					}
					*/
					var value1 = rec1[sort.name]; //0.32
					var value2 = rec2[sort.name];					
					//var value1 = eval('rec1.' + sort.name); //0.66
					//var value2 = eval('rec2.' + sort.name);	

					if (value1 != value2) {
						if (desc) {
							sortReturn = value1 > value2 ? -1 : 1;
						} else {
							sortReturn = value1 > value2 ? 1 : -1;							
						}	
					}	
					//////////////////////////////////////////
					//////////////////////////////////////////

					/*
					var sortReturn = 0;
					//Custom Sort
					if (angular.isFunction(sort)) {
						if (desc) {
							sortReturn = sort(rec1, rec2);
						} else {
							sortReturn = sort(rec2, rec1);
						}	
					} else {
						var value1 = eval('rec1.' + sort.name);
						var value2 = eval('rec2.' + sort.name);	

						if (value1 != value2) {
							if (desc) {
								sortReturn = value1 > value2 ? -1 : 1;
							} else {
								sortReturn = value1 > value2 ? 1 : -1;							
							}	
						}	
					}
					*/

					if (sortReturn != 0) {
						return sortReturn;
					}
				}
			});
