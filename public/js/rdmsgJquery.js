// import * as encDec from '../../encANDdec';

$(function() {
    $("table tr").click(function(e) {
      var u = $(this).data("link");
      var t = $(this).data("target");
      console.log(u, t);
      if (t.length) {
        console.log('w-open')
        window.open(u, t);
      } else {
        console.log('w-location')
        window.location.href = u;
      }
  });
});

  // 	$(function(){
//     $('#chat-list:not(.link)').click(function(event){
//         alert('click');
//         var $row = $(this).index();
//         event.stopPropagation();
//     });
// });

// jQuery(document).ready(function($) {
//     $("#chat-list").click(function() {
// 		alert('click');
//         window.location = $(this).data("href");
//     });
// });