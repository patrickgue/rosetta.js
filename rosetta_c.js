/* C Compiler for Rosetta */

(function () {
    const keywords = [
	"auto",
	"struct",
	"break",
	"else",
	"long",
	"switch",
	"case",
	"enum",
	"register",
	"typedef",
	"extern",
	"return",
	"union",
	"const",
	"float",
	"short",
	"unsigned",
	"continue",
	"for",
	"signed",
	"default",
	"goto",
	"sizeof",
	"volatile",
	"do",
	"if",
	"static",
	"while"
    ];

    const datatype = [
	"int",
	"double",
	"void",
	"char"
    ];

    const control = [
	"{",
	"}",
	"(",
	")",
	";",
	"?",
	":",
	"=",
	"<",
	">",
	"<=",
	">="
    ];

    const operator = [
	"+",
	"-",
	"/",
	"%",
	"++",
	"--",
	"|",
	"&",
	"||",
	"&&",
    ];

    const numeric = /[0-9]+/g;

    const specialCases = [
	{
	    "token" : "*",
	    "before" : [
		["typ", "ctr"],
		["num", "opt"],
		["exp", "opt"]
	    ]
	}
    ];

    const preCompiled = [
	"#include",
	"#define",
	"#if",
	"#elif",
	"#else",
	"#endif"
    ];

    


	if (!window.rosetta) { return; }

	/* This function takes as argument a plain text (in this case, a code written in C) and returns another plain text written in ECMAScript */
	function createECMASrc (sCSrc) {
	console.log(sCSrc);
	let tokens = [];
	let stringParts = sCSrc
	    .replace(/\(/g," (")
	    .replace(/\)/g," )")
	    .replace(/;/g," ;")
	    .split(/\"/g);
	for(let part in stringParts) {
	    if (part % 2 == 0) {
		let partToken = stringParts[part].split(/[ \n\t]/g);
		for(let token of partToken) {
		    let type = "exp";
		    if(keywords.indexOf(token) > -1) {
			type = "key";
		    }
		    else if(datatype.indexOf(token) > -1) {
			type = "typ";
		    }
		    else if(control.indexOf(token) > -1) {
			type = "ctr";
		    }
		    else if(operator.indexOf(token) > -1) {
			type = "opt";
		    }
		    else if(preCompiled.indexOf(token) > -1) {
			type = "pre";
		    }
		    else if(token.match(numeric)) {
			type = "num"
		    }
		    else {
			for(let scase of specialCases) {
			    if(token === scase.token) {
				for(let btype of scase.before) {
				    if(btype[0] === tokens[tokens.length -1].type) {
					type = btype[1]
				    }
				}
			    }
			}
		    }
		    
		    if(token.length > 0) {
			tokens.push({token,type});
		    }
		}
		//	console.log(part, part % 2 == 1 ? "string": "code" ,stringParts[part]);
	    }
	    else {
		tokens.push({token:stringParts[part],type:"str"});
	    }
	}

	console.log(JSON.stringify(tokens,null," "));
	
	
		/* This is just an empty example... Enjoy in creating your C compiler! */
		return "alert(\"Here you have the C code to be compiled to ECMAScript:\\n\\n\" + " + JSON.stringify(sCSrc) + ");";
	}

	rosetta.appendCompiler([ "text/x-csrc", "text/x-c" ], createECMASrc);

})();
