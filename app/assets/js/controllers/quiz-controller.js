angular.module('imdb-quiz').controller('QuizController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){

    $scope.movieInfo = [];
    

    var movieId = ["tt1300854", "tt0848228", "tt2395427"]; // iron man 3, avengers 2012, avengers 2015
    var randomMovie = movieId[Math.floor(Math.random()*movieId.length)];
    
    $http.get('http://www.theimdbapi.org/api/movie?movie_id=' + randomMovie)
    .then(function(response) {
        $scope.movieInfo = response.data;
    });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        var listActors = document.querySelectorAll(".actor")
        ,giveUp = "i give up, who is it?"
        ,randomActor = listActors[Math.floor(Math.random()*listActors.length)]
        ,addActive =  randomActor.classList.add("active")
        ,tipElement =  $('#tip').text(giveUp)
        ,currentScore = document.querySelector(".current-score")
        ,input = $('input:text')       
        ,score = 0
        ,tip = false;

        function scoreWatch(total){
            var shareElement = $('#share-whatsapp');
            shareElement.attr("href", "whatsapp://send?text=I scored " + total + ". Can you do better than me?")
        }
        scoreWatch(score);
        currentScore.textContent = score; 

        $('#tip').on('click', function(event){
            event.preventDefault();
            tip = true;

            var currentActor = $('.actor.active').attr('data-name')
            $(this).text(currentActor);
            input.val(currentActor);
        });
        
        $('button[type=submit]').on('click', function(event){
            
            event.preventDefault();
            var currentActor = $('.actor.active').data('name').toUpperCase()
            ,inputValue = input.val().toUpperCase()
            ,currentIndex = $('.actor.active');
                if(inputValue == currentActor){
                    if(tip == false){
                        score++;
                    }
                    input.val(null);
                    currentScore.textContent = score;
                    tip = false;
                    currentIndex.removeClass('active');
                    tipElement.text(giveUp);
                    scoreWatch(score);
                    if(currentIndex.data('index') >= listActors.length - 1){
                        listActors[0].classList.add('active');
                    }else{
                        var i = currentIndex.data('index');
                        i++;
                        listActors[i].classList.add('active');
                    }
                }else{
                    if(score > 0){
                        score--;
                    }
                    currentScore.textContent = score;
                    scoreWatch(score);
                }
        });

        $('#next').on('click', function(event){
            event.preventDefault();
            var currentIndex = $('.actor.active');
            input.val(null);
            currentIndex.removeClass('active');
            tipElement.text(giveUp);

            if(currentIndex.data('index') >= listActors.length - 1){
                listActors[0].classList.add('active');
            }else{
                var i = currentIndex.data('index');
                i++;
                listActors[i].classList.add('active');
            }
        })

        $('.preloader').removeClass("active");

    });    

}]);