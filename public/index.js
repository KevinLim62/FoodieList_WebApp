$(document).ready(function() {

  $("#search_result").keyup((e) => {
    const search_result = e.target.value;
    axios.post('/search',{
      search_query: search_result
    });
  });

});
