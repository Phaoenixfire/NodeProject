$(document).ready(function() {
	console.log("loading client-side js");

	$('.remove').on('click', function(){
		let storyid = $(this).closest("li").data("storyid")
		
		 $.ajax({
			  url: "delete_Story",
			  type: 'DELETE',
			  success: function(res){
				  console.log(res)
				  $(`li[data-storyid=${res.deletedid}]`).remove();
				},
			  data: {storyid:storyid},
		
			});
	})

	$('.newJoke').click(function() {
		// console.log('hello')
		 $('.text').text('loading . . .');
		 
		 $.ajax({
		   type:"GET",
		   headers: { Accept: "application/json" },
		   url:"https://icanhazdadjoke.com/",
		   success: function(data) {
			 console.log(data);
			 $('.text').text(data.joke);
			 //$('.like').data('jokeData', data);
		   }
		 });
		 $.get("/ping", function(res){
			 console.log(res)
		 })
		 $.post("/createstory", {name:"myName"}, function(res){
			console.log(res)
		})
		 fetch('/ping')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(JSON.stringify(myJson));
  });
	   });

		 function fetchPoetryAuthor(){

			fetch('http://poetrydb.org/author')
		.then(function(response) {
			return response.json();
		})
		.then(function(myJson) {
			console.log(JSON.stringify(myJson));
		});
	}
	fetchPoetryAuthor();
})
