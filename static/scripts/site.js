$(document).ready(function () {
  console.log("READY");
  $("#logo").delay(500).animate({ opacity: 1 }, 500);
  $("#dropdown").delay(500).animate({ opacity: 1 }, 500);

  $(window).scroll(function () {
    /* Check the location of each desired element */
    $(".fade").each(function () {
      let bottom_of_object = $(this).position().top + 50;
      let bottom_of_window = $(window).scrollTop() + $(window).height();
      /* If the object is completely visible in the window, fade it it */
      if (bottom_of_window > bottom_of_object) {
        $(this).animate(
          {
            opacity: "1",
          },
          500
        );
      }
    });
  });
});