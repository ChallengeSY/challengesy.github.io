var life = 0;
var lifeMax = 10;
var lifeOrg = 0;
var score = 0;
var combo = 0;
var questionNum = 0;
var nextLifeUp = 0;
var goal = 75;
var transitionObj = null;
var moduleFile = null;
var curQuestion = null; // Safety creation
var playerAnswer = null;
var firstLoad = false;
const questionCount = 18;

// Object
function question(newId) {
	var workObj;
	
	this.qType = newId;
	this.timed = false;
	this.graphCalc = false;
	this.qDiff = 0;
	this.txt = "";
	this.qVars = null;
	this.correctAns = null;
	
	switch (this.qType) {
		// Trigonometry
		case 1:
			this.qVars = new Array(1);
			if (moduleFile == "trigonometry") {
				this.qVars[0] = irandom(1 + score/6,1 + Math.floor(score/6) * 9);
			} else {
				this.qVars[0] = (irandom(1,1 + score/8));
				this.timed = (score >= 5);
			}
			
			if (this.qVars[0] <= 1) {
				this.txt = "Differentiate f(x) = sin(x)";
				this.correctAns = new Array("cos(x)");
			} else {
				this.txt = "Differentiate f(x) = sin(" + markVar(this.qVars[0]) + "x)";
				this.correctAns = new Array(this.qVars[0]+"cos("+this.qVars[0]+"x)", this.qVars[0]+"*cos("+this.qVars[0]+"x)");
			}
			break;

		case 2:
			this.qVars = new Array(1);
			if (moduleFile == "trigonometry") {
				this.qVars[0] = irandom(1 + score/6,1 + Math.floor(score/6) * 9);
			} else {
				this.qVars[0] = (irandom(1,1 + score/8));
				this.timed = (score >= 5);
			}
			
			if (this.qVars[0] <= 1) {
				this.txt = "Differentiate f(x) = cos(x)";
				this.correctAns = new Array("-sin(x)");
			} else {
				this.txt = "Differentiate f(x) = cos(" + markVar(this.qVars[0]) + "x)";
				this.correctAns = new Array("-"+this.qVars[0]+"sin("+this.qVars[0]+"x)", "-"+this.qVars[0]+"*sin("+this.qVars[0]+"x)");
			}
			break;

		case 3:
			this.qDiff = 1;
			this.qVars = new Array(1);
			
			if (moduleFile == "trigonometry") {
				this.qVars[0] = irandom(1 + score/6,1 + Math.floor(score/6) * 9);
			} else {
				this.qVars[0] = (irandom(1,1 + score/9));
				this.timed = true;
			}
			
			if (this.qVars[0] <= 1) {
				this.txt = "Differentiate f(x) = tan(x)";
				this.correctAns = new Array("(sec(x))^2","sec^2(x)");
			} else {
				this.txt = "Differentiate f(x) = tan(" + markVar(this.qVars[0]) + "x)";
				this.correctAns = new Array(this.qVars[0]+"(sec("+this.qVars[0]+"x))^2",this.qVars[0]+"sec^2("+this.qVars[0]+"x)",
					this.qVars[0]+"*(sec("+this.qVars[0]+"x))^2",this.qVars[0]+"*sec^2("+this.qVars[0]+"x)");
			}
			break;

		case 4:
			this.qDiff = 2;
			this.qVars = new Array(1);
			
			if (moduleFile == "trigonometry") {
				this.qVars[0] = irandom(1 + score/6,1 + Math.floor(score/6) * 9);
			} else {
				this.qVars[0] = (irandom(1,1 + score/10));
				this.timed = true;
			}
			
			if (this.qVars[0] <= 1) {
				this.txt = "Differentiate f(x) = csc(x)";
				this.correctAns = new Array("-csc(x)cot(x)","-csc(x)*cot(x)","-cot(x)csc(x)","-cot(x)*csc(x)");
			} else {
				this.txt = "Differentiate f(x) = csc(" + markVar(this.qVars[0]) + "x)";
				this.correctAns = new Array("-"+this.qVars[0]+"csc("+this.qVars[0]+"x)cot("+this.qVars[0]+"x)","-"+this.qVars[0]+"cot("+this.qVars[0]+"x)csc("+this.qVars[0]+"x)","-"+this.qVars[0]+"*csc("+this.qVars[0]+"x)*cot("+this.qVars[0]+"x)","-"+this.qVars[0]+"*cot("+this.qVars[0]+"x)*csc("+this.qVars[0]+"x)");
			}
			break;

		case 5:
			this.qDiff = 2;
			this.qVars = new Array(1);
			
			if (moduleFile == "trigonometry") {
				this.qVars[0] = irandom(1 + score/6,1 + Math.floor(score/6) * 9);
			} else {
				this.qVars[0] = (irandom(1,1 + score/10));
				this.timed = true;
			}
			
			if (this.qVars[0] <= 1) {
				this.txt = "Differentiate f(x) = sec(x)";
				this.correctAns = new Array("sec(x)tan(x)","sec(x)*tan(x)","tan(x)sec(x)","tan(x)*sec(x)");
			} else {
				this.txt = "Differentiate f(x) = sec(" + markVar(this.qVars[0]) + "x)";
				this.correctAns = new Array(this.qVars[0]+"sec("+this.qVars[0]+"x)tan("+this.qVars[0]+"x)",this.qVars[0]+"tan("+this.qVars[0]+"x)sec("+this.qVars[0]+"x)",this.qVars[0]+"*sec("+this.qVars[0]+"x)*tan("+this.qVars[0]+"x)",this.qVars[0]+"*tan("+this.qVars[0]+"x)*sec("+this.qVars[0]+"x)");
			}
			break;

		case 6:
			this.qDiff = 2;
			this.qVars = new Array(1);
			
			if (moduleFile == "trigonometry") {
				this.qVars[0] = irandom(1 + score/6,1 + Math.floor(score/6) * 9);
			} else {
				this.qVars[0] = (irandom(1,1 + score/10));
				this.timed = true;
			}
			
			if (this.qVars[0] <= 1) {
				this.txt = "Differentiate f(x) = cot(x)";
				this.correctAns = new Array("-csc^2(x)","-(csc(x))^2");
			} else {
				this.txt = "Differentiate f(x) = cot(" + markVar(this.qVars[0]) + "x)";
				this.correctAns = new Array("-"+this.qVars[0]+"(csc("+this.qVars[0]+"x))^2","-"+this.qVars[0]+"csc^2("+this.qVars[0]+"x)",
					"-"+this.qVars[0]+"*(csc("+this.qVars[0]+"x))^2","-"+this.qVars[0]+"*csc^2("+this.qVars[0]+"x)");
			}
			break;

		case 7:
			this.qVars = new Array(5);
			
			this.qVars[4] = 0;
			if (moduleFile == "powerRule") {
				if (score >= 5) {
					do {
						this.qVars[0] = (irandom(-2 - score/4,2 + score/4));
						this.qVars[1] = (irandom(2,3+score/6));
						this.qVars[2] = (irandom(-2 - score/4,2 + score/4));
						this.qVars[3] = (irandom(1,2+score/6));
					} while (Math.abs(this.qVars[0]) < 2 || Math.abs(this.qVars[2]) < 2 || this.qVars[1] <= this.qVars[3]);
				} else {
					this.qVars[0] = (irandom(2,2 + score/4));
					this.qVars[2] = (irandom(2,2 + score/4));
					do {
						this.qVars[1] = (irandom(2,3));
						this.qVars[3] = (irandom(1,2));
					} while (this.qVars[1] == this.qVars[3]);
				}
			} else {
				if (score >= goal*4/5) {
					this.timed = true;
				}
				if (score >= goal/5) {
					do {
						this.qVars[0] = (irandom(-2 - score/8,2 + score/8));
						this.qVars[1] = (irandom(2,3+score/12));
						this.qVars[2] = (irandom(-2 - score/8,2 + score/8));
						this.qVars[3] = (irandom(1,2+score/12));
					} while (Math.abs(this.qVars[0]) < 2 || Math.abs(this.qVars[2]) < 2 || this.qVars[1] <= this.qVars[3]);
				} else {
					this.qVars[0] = (irandom(2,2 + score/8));
					this.qVars[2] = (irandom(2,2 + score/8));
					do {
						this.qVars[1] = (irandom(2,3));
						this.qVars[3] = (irandom(1,2));
					} while (this.qVars[1] == this.qVars[3]);
				}
			}
			
			if (score >= 4 && this.qVars[1] <= 3 && this.qVars[3] <= 2 && Math.random() < 0.5) {
				this.qVars[4] = irandom(-Math.floor(Math.sqrt(score)),Math.floor(Math.sqrt(score)));
			}
			
			if (this.qVars[4] != 0) {
				this.txt = "If f(x) = "+markVar(this.qVars[0])+"x^"+markVar(this.qVars[1])+" ";
				if (this.qVars[2] > 0) {
					this.txt = this.txt + "+ "+markVar(this.qVars[2])+"x";
					this.correctAns = new Array(1);
				} else {
					this.correctAns = new Array(2);
					this.txt = this.txt + "- "+markVar(Math.abs(this.qVars[2]))+"x";
				}
				if (this.qVars[3] > 1) {
					this.txt = this.txt + "^"+markVar(this.qVars[3]);
				}
				
				this.txt = this.txt + ", then evaluate f'("+markVar(this.qVars[4])+").";
				
				this.correctAns = new Array(1);
				this.correctAns[0] = this.qVars[0] * this.qVars[1] * Math.pow(this.qVars[4],this.qVars[1]-1) +
					this.qVars[2] * this.qVars[3] * Math.pow(this.qVars[4],this.qVars[3]-1);
			} else {
				workObj = new Array(4);
				workObj[0] = this.qVars[0] * this.qVars[1];
				workObj[1] = this.qVars[1] - 1;
				workObj[2] = this.qVars[2] * this.qVars[3];
				workObj[3] = this.qVars[3] - 1;
				
				this.txt = "Differentiate f(x) = "+markVar(this.qVars[0])+"x^"+markVar(this.qVars[1]);
				if (this.qVars[2] > 0) {
					this.txt = this.txt + " + "+markVar(this.qVars[2])+"x";
					this.correctAns = new Array(1);
				} else {
					this.correctAns = new Array(2);
					this.txt = this.txt + " - "+markVar(Math.abs(this.qVars[2]))+"x";
				}
				if (this.qVars[3] > 1) {
					this.txt = this.txt + "^"+markVar(Math.abs(this.qVars[3]));
				}
				
				if (this.qVars[1] == 2) {
					this.correctAns[0] = workObj[0]+"x+"+workObj[2];
					if (this.qVars[2] < 0) {
						this.correctAns[1] = workObj[0]+"x-"+Math.abs(workObj[2]);
					}
					if (this.qVars[3] > 2) {
						this.correctAns[0] = this.correctAns[0] + "x^"+workObj[3];
						if (this.correctAns[1]) {
							this.correctAns[1] = this.correctAns[1] + "x^"+workObj[3];
						}
					} else if (this.qVars[3] == 2) {
						this.correctAns[0] = this.correctAns[0] + "x";
						if (this.correctAns[1]) {
							this.correctAns[1] = this.correctAns[1] + "x";
						}
					}
				} else {
					this.correctAns[0] = workObj[0]+"x^"+workObj[1]+"+"+workObj[2];
					if (this.qVars[2] < 0) {
						this.correctAns[1] = workObj[0]+"x^"+workObj[1]+"-"+Math.abs(workObj[2]);
					}
					if (this.qVars[3] > 2) {
						this.correctAns[0] = this.correctAns[0] + "x^"+workObj[3];
						if (this.correctAns[1]) {
							this.correctAns[1] = this.correctAns[1] + "x^"+workObj[3];
						}
					} else if (this.qVars[3] == 2) {
						this.correctAns[0] = this.correctAns[0] + "x";
						if (this.correctAns[1]) {
							this.correctAns[1] = this.correctAns[1] + "x";
						}
					}
				}
			}
			break;
			
		case 8:
			this.qVars = new Array(3);
			this.timed = (score >= goal*4/5);
			
			do {
				this.qVars[0] = irandom(500,750+score*18);
				if (score < goal/5) {
					this.qVars[1] = 16;
				} else {
					this.qVars[1] = irandom(8,32);
				}
				this.qVars[2] = irandom(3,20);
				this.qVars[3] = this.qVars[0] - this.qVars[1] * Math.pow(this.qVars[2],2);
			} while (this.qVars[3] <= 0);
			
			this.txt = "A ball's height is modeled by h(t) = "+markVar(this.qVars[0])+" - "+markVar(this.qVars[1])+"t^2.<br /><br />";
			if (score < goal*2/5 || Math.random() < 0.5) {
				this.txt = this.txt + "At t = "+markVar(this.qVars[2])+", what is the velocity of the ball?";
			} else {
				this.txt = this.txt + "If h(t) = "+markVar(this.qVars[3])+", what is the velocity of the ball?";
			}
			
			this.correctAns = new Array(1);
			this.correctAns[0] = -2 * this.qVars[1] * this.qVars[2];
			break;

		case 9:
			this.qDiff = 1;
			this.qVars = new Array(7);
			
			this.qVars[6] = 0;
			if (moduleFile == "powerRule") {
				if (score >= 15) {
					do {
						this.qVars[0] = (irandom(-2 - score/6,2 + score/6));
						this.qVars[1] = (irandom(3,4+score/9));
						this.qVars[2] = (irandom(-2 - score/6,2 + score/6));
						this.qVars[3] = (irandom(2,3+score/9));
						this.qVars[4] = (irandom(-2 - score/6,2 + score/6));
						this.qVars[5] = (irandom(1,2+score/9));
					} while (Math.abs(this.qVars[0]) < 2 || Math.abs(this.qVars[2]) < 2 || Math.abs(this.qVars[4]) < 2 ||
						this.qVars[1] <= this.qVars[3] || this.qVars[3] <= this.qVars[5]);
				} else {
					this.qVars[0] = (irandom(2,2 + score/6));
					this.qVars[2] = (irandom(2,2 + score/6));
					this.qVars[4] = (irandom(2,2 + score/6));
					do {
						this.qVars[1] = (irandom(3,4));
						this.qVars[3] = (irandom(2,3));
						this.qVars[5] = (irandom(1,2));
					} while (this.qVars[1] == this.qVars[3] || this.qVars[3] == this.qVars[5]);
				}
			} else {
				this.timed = (score >= goal*4/5);
				if (score >= goal*2/5) {
					do {
						this.qVars[0] = (irandom(-2 - score/12,2 + score/12));
						this.qVars[1] = (irandom(3,4+score/18));
						this.qVars[2] = (irandom(-2 - score/12,2 + score/12));
						this.qVars[3] = (irandom(2,3+score/18));
						this.qVars[4] = (irandom(-2 - score/12,2 + score/12));
						this.qVars[5] = (irandom(1,2+score/18));
					} while (Math.abs(this.qVars[0]) < 2 || Math.abs(this.qVars[2]) < 2 || Math.abs(this.qVars[4]) < 2 ||
						this.qVars[1] <= this.qVars[3] || this.qVars[3] <= this.qVars[5]);
				} else {
					this.qVars[0] = (irandom(2,2 + score/12));
					this.qVars[2] = (irandom(2,2 + score/12));
					this.qVars[4] = (irandom(2,2 + score/12));
					do {
						this.qVars[1] = (irandom(3,4));
						this.qVars[3] = (irandom(2,3));
						this.qVars[5] = (irandom(1,2));
					} while (this.qVars[1] == this.qVars[3] || this.qVars[3] == this.qVars[5]);
				}
			}
			
			if (this.qVars[1] <= 3 && this.qVars[3] <= 2 && this.qVars[5] <= 1 && Math.random() < 0.5) {
				this.qVars[6] = irandom(-Math.floor(Math.sqrt(score)),Math.floor(Math.sqrt(score)));
			}
			
			if (this.qVars[6] != 0) {
				this.txt = "If f(x) = "+markVar(this.qVars[0])+"x^"+markVar(this.qVars[1]);
				if (this.qVars[2] > 0) {
					this.txt = this.txt + " + "+markVar(this.qVars[2])+"x^"+markVar(this.qVars[3])+"";
				} else {
					this.txt = this.txt + " - "+markVar(Math.abs(this.qVars[2]))+"x^"+markVar(this.qVars[3])+"";
				}
				if (this.qVars[4] > 0) {
					this.txt = this.txt + " + "+markVar(this.qVars[4])+"x";
				} else {
					this.txt = this.txt + " - "+markVar(Math.abs(this.qVars[4]))+"x";
				}
				if (this.qVars[5] > 1) {
					this.txt = this.txt + "^"+markVar(this.qVars[5]);
				}
				
				this.txt = this.txt + ", then evaluate f'("+markVar(this.qVars[6])+").";
				
				this.correctAns = new Array(1);
				this.correctAns[0] = this.qVars[0] * this.qVars[1] * Math.pow(this.qVars[6],this.qVars[1]-1) +
					this.qVars[2] * this.qVars[3] * Math.pow(this.qVars[6],this.qVars[3]-1) +
					this.qVars[4] * this.qVars[5] * Math.pow(this.qVars[6],this.qVars[5]-1);
			} else {
				workObj = new Array(6);
				workObj[0] = this.qVars[0] * this.qVars[1];
				workObj[1] = this.qVars[1] - 1;
				workObj[2] = this.qVars[2] * this.qVars[3];
				workObj[3] = this.qVars[3] - 1;
				workObj[4] = this.qVars[4] * this.qVars[5];
				workObj[5] = this.qVars[5] - 1;
				
				this.txt = "Differentiate f(x) = "+markVar(this.qVars[0])+"x^"+markVar(this.qVars[1]);
				this.correctAns = new Array(1);
				if (this.qVars[2] > 0) {
					this.txt = this.txt + " + "+markVar(this.qVars[2])+"x^"+markVar(Math.abs(this.qVars[3]));
				} else {
					this.txt = this.txt + " - "+markVar(Math.abs(this.qVars[2]))+"x^"+markVar(Math.abs(this.qVars[3]));
				}
				if (this.qVars[4] > 0) {
					this.txt = this.txt + " + "+markVar(this.qVars[4])+"x";
				} else {
					this.txt = this.txt + " - "+markVar(Math.abs(this.qVars[4]))+"x";
				}
				if (this.qVars[5] > 1) {
					this.txt = this.txt + "^"+markVar(Math.abs(this.qVars[5]));
				}
				
				this.correctAns[0] = workObj[0]+"x^"+workObj[1]+"+"+workObj[2];
				if (this.qVars[2] < 0) {
					this.correctAns.push(workObj[0]+"x^"+workObj[1]+"-"+Math.abs(workObj[2]));
				}
				if (this.qVars[3] > 2) {
					this.correctAns[0] = this.correctAns[0] + "x^"+workObj[3];
					if (this.correctAns[1]) {
						this.correctAns[1] = this.correctAns[1] + "x^"+workObj[3];
					}
				} else if (this.qVars[3] == 2) {
					this.correctAns[0] = this.correctAns[0] + "x";
					if (this.correctAns[1]) {
						this.correctAns[1] = this.correctAns[1] + "x";
					}
				}

				if (this.qVars[4] < 0) {
					if (this.correctAns[1]) {
						this.correctAns[1] = this.correctAns[1] + "-"+Math.abs(workObj[4]);
					} else {
						this.correctAns.push(this.correctAns[0] + "-"+Math.abs(workObj[4]));
					}
				} else {
					if (this.correctAns[1]) {
						this.correctAns[1] = this.correctAns[1] + "+"+Math.abs(workObj[4]);
					}
				}
				this.correctAns[0] = this.correctAns[0]+" + "+workObj[4];
				if (this.qVars[5] > 2) {
					this.correctAns[0] = this.correctAns[0] + "x^"+workObj[5];
					if (this.correctAns[1]) {
						this.correctAns[1] = this.correctAns[1] + "x^"+workObj[5];
					}
				} else if (this.qVars[5] == 2) {
					this.correctAns[0] = this.correctAns[0] + "x";
					if (this.correctAns[1]) {
						this.correctAns[1] = this.correctAns[1] + "x";
					}
				}
			}
			break;

		case 10:
			this.qDiff = 1;
			this.qVars = new Array(3);
			this.qVars[2] = 0;
			if (score >= goal*3/10) {
				this.timed = true;
				do {
					this.qVars[0] = irandom(-1 - score/8,1 + score/12);
				} while (this.qVars[0] == -1 || this.qVars[0] == 0);
				this.qVars[1] = irandom(1,1 + score/18);
			} else {
				this.qVars[0] = irandom(1,score/12);
				this.qVars[1] = irandom(1,1+score/18);
			}

			if (score >= 4 && Math.random() < 0.5) {
				this.qVars[2] = irandom(-Math.floor(Math.sqrt(score)),Math.floor(Math.sqrt(score)));
			}
			
			if (this.qVars[2] != 0) {
				if (this.qVars[1] > 1) {
					this.txt = "If f(x) = "+markVar(this.qVars[0])+"ln(x^"+markVar(this.qVars[1])+"), evaluate f'("+markVar(this.qVars[2])+"). Improper (but simplified) fraction or nearest thousandth okay.";
				} else {
					this.txt = "If f(x) = "+markVar(this.qVars[0])+"ln(x), evaluate f'("+markVar(this.qVars[2])+"). Improper (but simplified) fraction or nearest thousandth okay.";
				}
				
				workObj = new Array(2);
				workObj[0] = this.qVars[0]*this.qVars[1];
				workObj[1] = this.qVars[2];
				
				// Force the denominator to be positive
				if (workObj[1] < 0) {
					workObj[0] = workObj[0] * -1;
					workObj[1] = workObj[1] * -1;
				}
				
				for (var i = Math.min(Math.abs(workObj[0]),workObj[1]); i > 1; i--) {
					if (Math.floor(workObj[0]/i) == workObj[0]/i && Math.floor(workObj[1]/i) == workObj[1]/i) {
						workObj[0] = workObj[0] / i;
						workObj[1] = workObj[1] / i;
						break;
					}
				}
				
				this.correctAns = new Array(3);
				this.correctAns[0] = (Math.round(workObj[0]/workObj[1] * 1000) / 1000).toFixed(3);
				this.correctAns[1] = (Math.trunc(workObj[0]/workObj[1] * 1000) / 1000).toFixed(3);
				if (workObj[1] > 1) {
					this.correctAns[2] = workObj[0] + "/" + workObj[1];
				}
			} else {
				if (this.qVars[1] > 1) {
					this.txt = "Differentiate f(x) = "+markVar(this.qVars[0])+"ln(x^"+markVar(this.qVars[1])+")";
				} else {
					this.txt = "Differentiate f(x) = "+markVar(this.qVars[0])+"ln(x)";
				}
				
				this.correctAns = new Array(2);
				this.correctAns[0] = (this.qVars[0]*this.qVars[1]) + "/x";
			}
			break;
			
		case 11:
			this.qDiff = 1;
			this.qVars = new Array(1);
			if (score >= goal*3/10) {
				this.timed = true;
				do {
					this.qVars[0] = irandom(-2 - score/12,2 + score/12);
				} while (this.qVars[0] == -1 || this.qVars[0] == 0);
			} else {
				this.qVars[0] = irandom(2,score/12);
			}
			
			this.correctAns = new Array(1);

			if (this.qVars[0] != 1) {
				this.txt = "Differentiate f(x) = e^"+markVar(this.qVars[0])+"x";
				this.correctAns[0] = this.qVars[0]+"e^"+this.qVars[0]+"x";
			} else {
				this.txt = "Differentiate f(x) = e^x";
				this.correctAns[0] = "e^x";
			}
			break;
			
		case 12:
			this.qDiff = 2;
			this.qVars = new Array(1);
			if (moduleFile == "productRule") {
				do {
					this.qVars[0] = irandom(-1 - score,1 + score);
				} while (this.qVars[0] == -1 || this.qVars[0] == 0);
			} else {
				do {
					this.qVars[0] = irandom(-1 - score/16,1 + score/16);
				} while (this.qVars[0] == -1 || this.qVars[0] == 0);
			}
			
			this.correctAns = new Array(2);

			if (this.qVars[0] != 1) {
				this.txt = "Differentiate f(x) = "+markVar(this.qVars[0])+"</span>x*e^x";
				this.correctAns[0] = "e^x("+this.qVars[0]+"x + "+this.qVars[0]+")";
				this.correctAns[1] = this.qVars[0]+"x*e^x + "+this.qVars[0]+"e^x";
				if (this.qVars[0] < 0) {
					this.correctAns.unshift(this.qVars[0]+"x*e^x - "+Math.abs(this.qVars[0])+"e^x");
					this.correctAns.unshift("e^x("+this.qVars[0]+"x - "+Math.abs(this.qVars[0])+")");
				}
			} else {
				this.txt = "Differentiate f(x) = x*e^x";
				this.correctAns[0] = "e^x(x+1)";
				this.correctAns[1] = "x*e^x+e^x";
			}
			break;
			
		case 13:
			this.qDiff = 1;
			this.qVars = new Array(4);
			this.qVars[0] = irandom(1,score/12);
			this.qVars[1] = irandom(2,score/16);
			this.qVars[2] = irandom(1,score/12);
			this.qVars[3] = irandom(2,score/16);
			
			this.correctAns = new Array(1);

			workObj = new Array(3);
			workObj[0] = this.qVars[0]*this.qVars[2]*4;
			workObj[1] = 3*(this.qVars[0]*this.qVars[3] + this.qVars[1]*this.qVars[2]); 
			workObj[2] = this.qVars[1]*this.qVars[3]*2;

			this.txt = "Differentiate f(x) = ("+markVar(this.qVars[0])+"x^2 + "+markVar(this.qVars[1])+"x)("+markVar(this.qVars[2])+"x^2 + "+markVar(this.qVars[3])+"x). Simplify.";
			this.correctAns[0] = workObj[0]+"x^3+"+workObj[1]+"x^2+"+workObj[2]+"x";
			break;
			
		case 14:
			this.qDiff = 4;
			this.qVars = new Array(1);
			do {
				this.qVars[0] = irandom(-1 - score/24,1 + score/24);
			} while (this.qVars[0] == -1 || this.qVars[0] == 0);

			if (this.qVars[0] != 1) {
				this.txt = "Differentiate f(x) = "+markVar(this.qVars[0])+"x/e^x";
				this.correctAns = new Array(2);
				this.correctAns[0] = this.qVars[0]+"(-x+1)/e^x";
				if (this.qVars[0] > 0) {
					this.correctAns[1] = "(-"+this.qVars[0]+"x+"+this.qVars[0]+")/e^x";
				} else {
					this.correctAns[1] = "("+Math.abs(this.qVars[0])+"x-"+Math.abs(this.qVars[0])+")/e^x";
					this.correctAns.push("("+Math.abs(this.qVars[0])+"x+"+this.qVars[0]+")/e^x");
				}
			} else {
				this.txt = "Differentiate f(x) = x/e^x";
				this.correctAns = new Array(1);
				this.correctAns[0] = "(-x+1)/e^x";
			}
			
			break;
			
		case 15:
			this.qDiff = 2;
			this.qVars = new Array(1);
			this.qVars[0] = irandom(2,score/16);
			
			this.correctAns = new Array(4);

			this.txt = "Differentiate f(x) = "+markVar(this.qVars[0])+"^x";
			this.correctAns[0] = "(ln "+this.qVars[0]+")("+this.qVars[0]+"^x)";
			this.correctAns[1] = "(ln "+this.qVars[0]+")"+this.qVars[0]+"^x";
			this.correctAns[2] = "ln "+this.qVars[0]+"("+this.qVars[0]+"^x)";
			this.correctAns[3] = "ln "+this.qVars[0]+"*"+this.qVars[0]+"^x";
			break;
			
		case 16:
			this.qDiff = 1;
			this.qVars = new Array(3);
			this.qVars[0] = irandom(2,score/16);
			this.qVars[1] = irandom(1,score/24);
			this.qVars[2] = irandom(2,score/16);
			
			workObj = new Array(3)
			workObj[0] = this.qVars[2]*this.qVars[0];
			workObj[1] = this.qVars[0]-1;
			workObj[2] = this.qVars[2]-1;
			
			this.correctAns = new Array(2);

			this.txt = "Differentiate f(x) = (x^"+markVar(this.qVars[0])+" + "+markVar(this.qVars[1])+")^"+markVar(this.qVars[2])+". Do not expand.";
			if (workObj[1] > 1) {
				if (workObj[2] > 1) {
					this.correctAns[0] = this.qVars[2]+"(x^"+this.qVars[0]+"+"+this.qVars[1]+")^"+workObj[2]+"*"+this.qVars[0]+"x^"+workObj[1];
					this.correctAns[1] = workObj[0]+"x^"+workObj[1]+"(x^"+this.qVars[0]+"+"+this.qVars[1]+")^"+workObj[2];
				} else {
					this.correctAns[0] = this.qVars[2]+"(x^"+this.qVars[0]+"+"+this.qVars[1]+")*"+this.qVars[0]+"x^"+workObj[1];
					this.correctAns[1] = workObj[0]+"x^"+workObj[1]+"(x^"+this.qVars[0]+"+"+this.qVars[1]+")";
				}
			} else {
				if (workObj[2] > 1) {
					this.correctAns[0] = this.qVars[2]+"(x^"+this.qVars[0]+"+"+this.qVars[1]+")^"+workObj[2]+"*"+this.qVars[0]+"x";
					this.correctAns[1] = workObj[0]+"x(x^"+this.qVars[0]+"+"+this.qVars[1]+")^"+workObj[2];
				} else {
					this.correctAns[0] = this.qVars[2]+"(x^"+this.qVars[0]+"+"+this.qVars[1]+")*"+this.qVars[0]+"x";
					this.correctAns[1] = workObj[0]+"x(x^"+this.qVars[0]+"+"+this.qVars[1]+")";
				}
			}
			break;
			
		case 17:
			this.qDiff = 4;
			this.graphCalc = true;
			this.qVars = new Array(4);

			do {
				this.qVars[0] = Math.round((Math.random() - 0.5) * score * 1000) / 1000;
				this.qVars[1] = Math.round((Math.random() - 0.5) * score * 1000) / 1000;
			} while (this.qVars[0] > this.qVars[1]);
			this.qVars[2] = irandom(1, score/24);
			this.qVars[3] = irandom(2, score/36);
			
			this.correctAns = new Array(2);
			workObj = new Array(1);

			this.txt = "If f(x) = "+markVar(this.qVars[2])+"x^"+markVar(this.qVars[3])+", then evaluate the average slope between "+markVar(this.qVars[0])+" and "+markVar(this.qVars[1])+" to the nearest thousandth.";
			workObj[0] = (this.qVars[2]*Math.pow(this.qVars[1],this.qVars[3]) - this.qVars[2]*Math.pow(this.qVars[0],this.qVars[3]))/(this.qVars[1]-this.qVars[0]);
			
			this.correctAns[0] = (Math.round(workObj[0] * 1000) / 1000).toFixed(3);
			this.correctAns[1] = (Math.trunc(workObj[0] * 1000) / 1000).toFixed(3);
			break;
			
		case 18:
			this.qDiff = 3;
			this.graphCalc = true;
			this.qVars = new Array(3);

			this.qVars[0] = irandom(2,score/24);
			this.qVars[1] = irandom(2,score/24);
			this.qVars[2] = Math.round((Math.random() - 0.5) * score * 1000) / 1000;
			
			this.correctAns = new Array(2);
			workObj = new Array(1);

			this.txt = "A vehicle recently suffered an engine accident, causing the position to become erratic. "+
					"The model becomes x(t) = sin("+markVar(this.qVars[0])+"t) + "+markVar(this.qVars[1])+"t^2.<br /><br />"+
					"What is the velocity (nearest thousandth) "+markVar(this.qVars[2])+" seconds after the accident?";
			workObj[0] = this.qVars[0]*Math.cos(this.qVars[0]*this.qVars[2]) + 2*this.qVars[1]*this.qVars[2];
			
			this.correctAns[0] = (Math.round(workObj[0] * 1000) / 1000).toFixed(3);
			this.correctAns[1] = (Math.trunc(workObj[0] * 1000) / 1000).toFixed(3);
			break;
			
	}
	
	if (this.timed) {
		this.txt = "<b>Timed Question!</b> " + this.txt;
	}
	if (this.graphCalc) {
		this.txt = "<b>Graphing Calculator highly recommended!</b> " + this.txt;
	}
}

function startGame() {
	var moduleValid = false;
	
	score = 0;
	combo = 0;
	questionNum = 0;
	nextLifeUp = 0

	if (moduleFile == "trigonometry") {
		moduleValid = true;
		goal = 12;
	} else if (moduleFile == "powerRule") {
		moduleValid = true;
		goal = 25;
		/*
	} else if (moduleFile == "productRule") {
		moduleValid = true;
		goal = 5;
		*/
	} else if (moduleFile == "suddenDeath") {
		moduleValid = true;
		lifeMax = 30;
	} else if (moduleFile == "arcade" || moduleFile == "arcadeSimple") {
		moduleValid = true;
		lifeMax = 10;
		nextLifeUp = 5;
	}
	
	if (moduleValid) {
		life = lifeMax;
		rollQuestion();
	} else {
		applyFeedback(false, "To play this game, a valid module must be loaded.");
		enableAnswerPanels(false);
	}
}

function rollQuestion() {
	questionNum++;
	
	if (moduleFile == "trigonometry") {
		curQuestion = new question((questionNum - 1) % 6 + 1);
	} else if (moduleFile == "powerRule") {
		if (questionNum < 4) {
			curQuestion = new question(7);
		} else if (score < 10) {
			curQuestion = new question(irandom(7,8));
		} else {
			curQuestion = new question(irandom(7,9));
		}
	} else if (moduleFile == "productRule") {
		curQuestion = new question(12);
	} else if (moduleFile == "arcadeSimple") {
		// The user does not have access to a graphing calculator: Skip questions flagged as such
		do {
			curQuestion = new question(irandom(1,questionCount));
		} while(curQuestion.qDiff > Math.floor(score/goal/5) || curQuestion.graphCalc);
	} else {
		do {
			curQuestion = new question(irandom(1,questionCount));
		} while(curQuestion.qDiff > Math.floor(score/goal/5));
	}
	
	if (curQuestion.timed) {
		transitionObj = setInterval(lifeDecay, 30000 / life);
	}
	lifeOrg = life;
	updateUI();
	if (firstLoad) {
		applyFeedback("Good luck with the next question.")
		document.getElementById("fPanel").style.visibility = "hidden";
	} else {
		firstLoad = true;
	}
	document.getElementById("qNum").innerHTML = "Question "+questionNum;
	document.getElementById("qTxt").innerHTML = curQuestion.txt;
	document.getElementById("answerBox").value = "";
	document.getElementById("notation").value = "";
	enableAnswerPanels(true);
}

function lifeDecay() {
	life--;
	updateUI();
	
	if (life == 0) {
		validateAnswer();
	}
}

function validateAnswer() {
	playerAnswer = document.getElementById("answerBox").value;
	if (answerCorrect()) {
		if (curQuestion.timed) {
			life = lifeOrg;
		}
		score++;
		if (combo < 0) {
			combo = 0;
		}
		if (nextLifeUp > 0 && score >= nextLifeUp && score < goal) {
			life = life + 2;
			lifeMax = lifeMax + 2;
			nextLifeUp = nextLifeUp + Math.ceil(lifeMax/2);
			if (nextLifeUp > goal - 19) {
				nextLifeUp = 0;
			} else if (nextLifeUp == goal - 19) {
				nextLifeUp = goal - 20;
			}
		}
		combo++;
		life = Math.min(life + Math.min(Math.floor((combo-1)/2),2),lifeMax);
		
		enableAnswerPanels(false);
		updateUI();
		if (score < goal) {
			applyFeedback(true, "Correct! Keep up the good work!&emsp;"+continueButton(true));
		} else if (moduleFile == "arcade" || moduleFile == "arcadeSimple" || moduleFile == "suddenDeath") {
			applyFeedback(true, "Congratulations! You have completed Arcade Mode!");
		} else {
			applyFeedback(true, "Success! You have completed the module.");
		}
	} else if (curQuestion.timed && life <= 0) {
		enableAnswerPanels(false);
		applyFeedback(false, "Game over! Your life pool has been depleted! One correct answer was: <span style=\"font-family: monospace;\">" + 
				curQuestion.correctAns[irandom(0,curQuestion.correctAns.length-1)] + "</span>&emsp;"+continueButton(false));
		
		updateUI();
	} else if ((moduleFile == "trigonometry" && questionNum < 7) || (moduleFile == "powerRule" && questionNum < 4)) {
		combo = 0;

		updateUI();
		enableAnswerPanels(false);
		applyFeedback(true, "All a learning process. To answer this question correctly: <span style=\"font-family: monospace;\">" + curQuestion.correctAns[0] + "</span>&emsp;"+continueButton(true));
	} else {
		if (combo > 0) {
			combo = 0;
		}
		combo--;
		if (moduleFile == "suddenDeath") {
			life = 0;
		} else {
			life = Math.min(life, lifeOrg - 2 + combo);
		}
		
		updateUI();
		enableAnswerPanels(false);
		if (life > 0) {
			applyFeedback(false, "Incorrect! Your life has been reduced. One correct answer was: <span style=\"font-family: monospace;\">" + 
				curQuestion.correctAns[irandom(0,curQuestion.correctAns.length-1)] + "</span>&emsp;"+continueButton(true));
		} else {
			applyFeedback(false, "Game over! Your life pool has been depleted! One correct answer was: <span style=\"font-family: monospace;\">" + 
				curQuestion.correctAns[irandom(0,curQuestion.correctAns.length-1)] + "</span>&emsp;"+continueButton(false));
		}
	}
	
}

function answerCorrect() {
	for (var i = 0; i < curQuestion.correctAns.length; i++) {
		if (playerAnswer.replace(/\s/g, '') == curQuestion.correctAns[i]) {
			return true;
		}
	}

	return false;
}

function sendScore() {
	if (moduleFile == "arcade" || moduleFile == "suddenDeath") {
		if (window.XMLHttpRequest) {
			//Code for modern browsers
			logRequest = new XMLHttpRequest();
		} else {
			//Legacy code, for ancient IE versions 5 and 6
			logRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}

		logRequest.open("POST","logGame.php",true);
		logRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		logRequest.send("score=" + score + "&questions=" + questionCount);
		
		logRequest.onreadystatechange = function() {
			if (logRequest.readyState === 4) {
				if (logRequest.status==200) {
					appendStatus("<br />"+logRequest.responseText);
				} else {
					appendStatus("<br /><span style=\"color: rgb(255,128,0); font-weight: bold;\">Error</span>: "+logRequest.status);
				}
			}
		}
	}
}

function applyFeedback(good, panelTxt) {
	document.getElementById("fPanel").style.visibility = "visible";
	document.getElementById("fPanel").style.borderColor = (good ? "lime" : "red");
	document.getElementById("fTxt").innerHTML = panelTxt;
}

function continueButton(gameActive) {
	if (gameActive) {
		return "<a class=\"interact\" href=\"javascript:rollQuestion();\">Continue</a>";
	}
	return "<a class=\"interact\" href=\"javascript:startGame();\">Restart module</a>";
}

function enableAnswerPanels(flag) {
	if (!flag) {
		clearInterval(transitionObj);
	}
	document.getElementById("answerButton").disabled = !flag;
	document.getElementById("answerBox").readOnly = !flag;
	document.getElementById("notation").readOnly = !flag;
}

function updateUI() {
	document.getElementById("score").innerHTML = score + " / " + goal;
	document.getElementById("life").innerHTML = life + " / " + lifeMax;
	
	var meterSize = score/goal*300;
	var curveLeft = Math.min(meterSize,3);
	var curveRight = Math.min(Math.max(meterSize-297,0),3);
	var meterClass = "okay";
	if (score*3 < goal) {
		meterClass = "warning";
	} else if (score*3 < goal*2) {
		meterClass = "caution";
	}
	document.getElementById("scoreMtr").innerHTML = "<div class=\"" + meterClass + "\" style=\"width: " + meterSize + "px; border-radius: " +
		curveLeft + "px " + curveRight + "px " + curveRight + "px " + curveLeft + "px;\"></div>";
	if (nextLifeUp > 0) {
		document.getElementById("scoreAux").innerHTML = "<span style=\"color: rgb(0,255,255);\">&uarr; " + nextLifeUp + "</span>";
	} else {
		document.getElementById("scoreAux").innerHTML = "";
	}
	
	meterSize = Math.max(life/lifeMax*300,0);
	curveLeft = Math.min(meterSize,3);
	curveRight = Math.min(Math.max(meterSize-297,0),3);
	meterClass = "okay";
	if (life <= 1 && score < goal) {
		meterClass = "nightmare";
	} else if (lifeOrg <= 3 - Math.min(combo,0) && score < goal) {
		meterClass = "danger";
	} else if (life*3 < lifeMax) {
		meterClass = "warning";
	} else if (life*3 < lifeMax*2) {
		meterClass = "caution";
	}

	document.getElementById("lifeMtr").innerHTML = "<div class=\"" + meterClass + "\" style=\"width: " + meterSize + "px; border-radius: " +
		curveLeft + "px " + curveRight + "px " + curveRight + "px " + curveLeft + "px;\"></div>";
		
	var lifeLost = lifeOrg - life;
	if (lifeLost > 0) {
		document.getElementById("lifeAux").innerHTML = "<span style=\"color: rgb(255,128,128);\">-" + lifeLost + "</span>";
	} else {
		document.getElementById("lifeAux").innerHTML = "";
	}
	
	if (score*10 > goal) {
		document.getElementById("help").style.display = "none";
	}
}

function markVar(baseStr) {
	return "<span class=\"qvar\">" + baseStr + "</span>";
}

function irandom(mini, maxi) {
	return Math.floor((Math.random() * (maxi - mini + 1)) + mini);
}