$(document).ready(function () {
	console.log("loading client-side js");

	$('.remove').on('click', function () {
		let storyid = $(this).closest("li").data("storyid")

		$.ajax({
			url: "delete_Story",
			type: 'DELETE',
			success: function (res) {
				console.log(res)
				$(`li[data-storyid=${res.deletedid}]`).remove();
			},
			data: { storyid: storyid },

		});
	})

	$('.saveStory').on('click', function () {
		let storyid = $(this).closest("li").data("storyid")
		let nouns = $(this).closest("li").find(".nouns").toArray().map(function (i) { return i.innerText })
		let adjectives = $(this).closest("li").find(".adjectives").toArray().map(function (i) { return i.innerText })
		let verbs = $(this).closest("li").find(".verbs").toArray().map(function (i) { return i.innerText })
		let lines = $(this).closest("li").find(".lines").text().trim().split(" ");
		let formattedLines = $(this).closest("li").find(".lines").html()
		window.lines = lines
		$.ajax({
			url: "save_Story",
			type: 'PUT',
			success: function (res) {
				console.log(res)
				//$(`li[data-storyid=${res.saveid}]`).save();
			},
			data: { storyid: storyid, nouns: JSON.stringify(nouns), verbs: JSON.stringify(verbs), adjectives: JSON.stringify(adjectives), lines: JSON.stringify(lines), formattedLines: formattedLines },

		});
	})

	$(".user-words").submit(function (e) {
		e.preventDefault()
		let userNouns = $(this).find("input.user-nouns")
		let userVerbs = $(this).find("input.user-verbs")
		let userAdjectives = $(this).find("input.user-adjectives")
		//let noun = $(this).find("input").val()
		$("li").each(function () {

			let story = this
			userNouns.each(function (n) {
				let noun = $(this).val()
				$(story).find(".nouns").eq(n).text(noun)
			})
			userVerbs.each(function (n) {
				let verb = $(this).val()
				$(story).find(".verbs").eq(n).text(verb)
			})
			userAdjectives.each(function (n) {
				let adjective = $(this).val()
				$(story).find(".adjectives").eq(n).text(adjective)
			})
			//	$(this).find(".nouns").eq(0).text(noun)
		})
		//$(".nouns").eq(0).text(noun)
	})

	let elementToChange = undefined;
	$("body").on("click", ".changePartOfSpeech", function () {
		//alert("noun hit")
		//open a pop up window that enables user to switch part of speech.
		$(".popupOuter").css("display", "block")
		elementToChange = $(this)
		let wordInQuestion = $(this).text()
		if ($(this).hasClass("nouns")) {
			//Add text into form do you want to change word to other Part of Speech. Changes text on buttons to verbs and adjectives.
			$(".formContent").text(`Do you want to change the Part of Speech of ${wordInQuestion}`)
			$(".button1").text("Verb")
			$(".button2").text("Adjective")

		}
		else if ($(this).hasClass("verbs")) {
			//Add text into form do you want to change word to other Part of Speech. Changes text on buttons to verbs and adjectives.
			$(".formContent").text(`Do you want to change the Part of Speech of ${wordInQuestion}`)
			$(".button1").text("Noun")
			$(".button2").text("Adjective")

		}
		else if ($(this).hasClass("adjectives")) {
			//Add text into form do you want to change word to other Part of Speech. Changes text on buttons to verbs and adjectives.
			$(".formContent").text(`Do you want to change the Part of Speech of ${wordInQuestion}`)
			$(".button1").text("Verb")
			$(".button2").text("Noun")

		}
		//Upon submit of form on pop up window sends new parts of speech to the backend.


	})

	$(".button1, .button2").click(function (e) {
		e.preventDefault();
		let buttonText = $(this).text()
		if (buttonText === "Verb") {
			$(elementToChange).removeClass("nouns").removeClass("adjectives").addClass("verbs")

		}
		else if (buttonText === "Noun") {
			$(elementToChange).removeClass("verbs").removeClass("adjectives").addClass("nouns")
		}
		else {
			$(elementToChange).removeClass("verbs").removeClass("nouns").addClass("adjectives")
		}
		 

	})

	$(".closePopup").click(function(e){
		$(".popupOuter").css("display", "none")
	})

	$(".addNoun").on("click", function () {

		$(".user-words").prepend(`<input class="user-nouns" type="publictext" name="name" placeholder="Enter a noun" data-word="nouns">`)
	})

	$(".addVerb").on("click", function () {

		$(".user-words").prepend(`<input class="user-verbs" type="publictext" name="name" placeholder="Enter a verb" data-word="verbs">`)
	})
	$(".addAdjective").on("click", function () {

		$(".user-words").prepend(`<input class="user-adjectives" type="publictext" name="name" placeholder="Enter an adjective" data-word="adjectives">`)
	})















})

	/*$('.newJoke').click(function() {
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
	//fetchPoetryAuthor();
})
*/