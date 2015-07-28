var app = angular.module('quizApp', []);
app.factory('quizFactory', function($http) {
    
    
    var questions= new Array();
    
    $http.get("settings.json").success(function(data){
        //questions = data;
        console.log(data.questions);
        questions = data.questions;
        //console.log("data loaded" + data.settings);
        
        
    
    });
    
    
    
    for (var i= 0;i<questions.length; i++){
            questions[i].label = i +1;         
        }
        
	return {
		getQuestionIds: function(){
			var a = new Array(questions.length);
			for (var i= 0;i<questions.length; i++){
				a[i] = i;
			}
			return a;
		}, 
		getQuestion: function(id) {
			if(id < questions.length) {
				return questions[id];
			} else {
				return false;
			}
		}
	};
});

app.directive('quiz', function(quizFactory) {
	return {
		restrict: 'AE',
		scope: {},
		templateUrl: 'template.html',
		link: function(scope, elem, attrs) {
            
			scope.start = function() {
				scope.id = 0;
				scope.quizOver = false;
				scope.inProgress = true;
				scope.getQuestion();
			};
 
			scope.reset = function() {
				scope.inProgress = false;
				scope.score = 0;
			}
 
			scope.getQuestion = function() {
				var q = quizFactory.getQuestion(scope.id);
				if(q) {
					scope.question = q.question;
					scope.options = q.options;
					scope.answer = q.answer;
					scope.answerMode = true;
				} else {
					scope.quizOver = true;
				}
			};
            scope.getQuestionInfo = function(id){
                return quizFactory.getQuestion(id);
            }
			scope.getQuestionIds = function(){
				return quizFactory.getQuestionIds();
			};
            scope.hasErrorMessage = function(){
                return scope.errorMesage != "";
            }
			scope.checkAnswer = function() {
				if(!$('input[name=answer]:checked').length) {
                    scope.errorMesage = "Please select an option!";
                    return ;
                } 
 
				var ans = $('input[name=answer]:checked').val();
 
				if(ans == scope.options[scope.answer]) {
					scope.score++;
					scope.correctAns = true;
				} else {
					scope.correctAns = false;
				}
 
				scope.answerMode = false;
			};
 
			scope.nextQuestion = function() {
                $('.question-area').hide();
                $('.question-area').show("drop", {}, 500, function(){
                });                
                scope.errorMesage = "";
                
                scope.id++;
				scope.getQuestion();
                
				
			}
 
			scope.reset();
		}
	}
});