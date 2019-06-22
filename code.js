// watch the form for submit
function watchForm(){
    $(document).on('submit', 'form', function (e) {
        // prevent default
        e.preventDefault();
        // prepare the page for results
        prepPage();
        // clear previous results
        $('.result').remove();
        // get search term
        let term = $("#term").val();
        // displays map and initializes
        initialize(term);
    });
}

// prepare page for search results
// This will be animated in the future
function prepPage(){
    $('.text').addClass('hidden');
    $('.error').addClass('hidden');
    $('.results').removeClass('hidden');
    $('.weather').removeClass('hidden');
}

(function(){
  
  watchForm();
  
}());