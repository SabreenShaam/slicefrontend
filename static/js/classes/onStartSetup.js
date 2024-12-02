$(document).ready(function(){
  $('.dropdown-submenu a.booking-dropdown').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});
