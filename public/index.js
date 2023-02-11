

$(document).ready(function() {

  $("#CreateNew").click(function() {
    $("#form_Modal").css("display", "block");

  });

  $(".form_close").click(function() {
    $("#form_Modal").css("display", "none");

  });

  $("#modalTrigger").click(function() {
    $("#delete_Modal").css("display", "block");

  });

  $(".delete_close").click(function() {
    $("#delete_Modal").css("display", "none");

  });

//   var myModal = document.getElementById('myModal')
//   var myInput = document.getElementById('myInput')
//
// myModal.addEventListener('shown.bs.modal', function () {
//   myInput.focus()
// })

});
