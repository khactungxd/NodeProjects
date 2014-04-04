var LANGUAGE={	
	__init:function(lang){	// lang = 2-letters language
		var columnIndex=this.LANGUAGE_COLUMN_INDEXES[lang.toUpperCase()];
		if (!columnIndex) columnIndex=0; // DEFAULT = ENGLISH (EN)
		
		for (var key in this.__LANGUAGE_TABLE){			
			eval("this."+key+" = this.__LANGUAGE_TABLE."+key+"["+columnIndex+"];");
		}
	},
	
	// TO ADD NEW LANGUAGE(S) OR NEW WORD(S), PLEASE ONLY EDIT THE PART BELOW 	
	LANGUAGE_COLUMN_INDEXES : {
		"EN":0,
		"DE":1
	},	
	__LANGUAGE_TABLE: {
		//	KEYWORD						EN	(columnIndex=0)				DE (columnIndex=1)		
		MANDANT				:	[		"Customer"				,		"_Mandant"					],
		MANDANTS			:	[		"Customers"				,		"_Mandants"					],
		NUMBER_OF_REQUESTS	:	[		"Number Of Requests"	,		"NOR DE"					],
		RESPONSE_TIME		:	[		"Response Time"			,		"RT DE"						],
		LAST_UPDATE			:	[		"Last Updated"			,		"Zuletzt aktualisiert"		],
		DETAILS				:	[		"Details"				,		"Einzelheiten"				],
		REMOVE				:	[		"Remove"				,		"Entfernen"					],
		ADD					:	[		"Add"					,		"Hinzufügen"				],
		BACK				:	[		"Back"					,		"Zurück"					],
		SEARCH				:	[		"Search"				,		"Suchen"					],
		ALL					:	[		"All"					,		"_All"						],
		SELECT				:	[		"Select"				,		"_Select"					],
		LOCATION			:	[		"Location"				,		"_Location"					],
		
		// SCREEN NAME
		LOCATION_VIEW		:	[		"Location View"			,		"_Location View"			],
		ACTIVITY_VIEW		:	[		"Activity View"			,		"_Activity View"			],
		ORGUNIT_VIEW		:	[		"Orgunit View"			,		"_Orgunit View"				],
		MAP_VIEW			:	[		"Map View"				,		"_Map View"					],
		CHART_VIEW			:	[		"Chart View"			,		"_Chart View"				],
		CHART_FOR_YEARS		:	[		"Chart for all years"	,		"_Chart for all years"		],
		CHART_FOR_MONTHS	:	[		"Chart for all months"	,		"_Chart for all months"		],
		CHART_FOR_DAYS		:	[		"Chart for all days"	,		"_Chart for all days"		],
		CHART_FOR_HOURS		:	[		"Chart for all hours"	,		"_Chart for all hours"		],
		
		
		// DATE - TIME
		DATE				:	[		"Date"					,		"_Date"						],
		HOUR				:	[		"Hour"					,		"_Hour"						],
		DAY					:	[		"Day"					,		"_Day"						],
		MONTH				:	[		"Month"					,		"Monat"						],
		YEAR				:	[		"Year"					,		"Jahr"						],
		TODAY				:	[		"Today"					,		"Heute"						],
		THIS_MONTH			:	[		"This Month"			,		"Dieser Monat"				],
		THIS_YEAR			:	[		"This Year"				,		"Dieses Jahr"				],
		REFRESH				:	[		"Refresh"				,		"Erfrischen"				],
		INTERVAL			:	[		"Interval"				,		"Interval"					],
		MINUTE				:	[		"Minute"				,		"Minute"					],
		MINUTES				:	[		"Minutes"				,		"Minuten"					],
		
		// WARNING
		NO_MANDANTS_ADDED	:	[ "There is no mandants added !" , "_There is no mandants added !"  ],
	}	
}