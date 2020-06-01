// progressive-image.js
if (
  window.addEventListener &&
  window.requestAnimationFrame &&
  document.getElementsByClassName
) {
  window.addEventListener(
    "load",
    function () {
      // start
      var lazyLoadedImageContainer = document.getElementsByClassName(
          "progressive replace"
        ),
        timer;

      window.addEventListener("scroll", scroller, false);
      window.addEventListener("resize", scroller, false);
      inView();

      // throttled scroll/resize
      function scroller(e) {
        timer =
          timer ||
          setTimeout(function () {
            timer = null;
            requestAnimationFrame(inView);
          }, 300);
      }

      // image in view?
      function inView() {
        var pageYOffset = window.pageYOffset,
          innerHeight = pageYOffset + window.innerHeight,
          containerRect,
          containerRectTopOffset,
          containerRectBottomOffset,
          index = 0;
        while (index < lazyLoadedImageContainer.length) {
          containerRect = lazyLoadedImageContainer[
            index
          ].getBoundingClientRect();
          containerRectTopOffset = pageYOffset + containerRect.top;
          containerRectBottomOffset =
            containerRectTopOffset + containerRect.height;

          if (
            pageYOffset < containerRectBottomOffset &&
            innerHeight > containerRectTopOffset
          ) {
            loadFullImage(lazyLoadedImageContainer[index]);
            lazyLoadedImageContainer[index].classList.remove("replace");
          } else {
            index++;
          }
        }
      }

      // replace with full image
      function loadFullImage(item) {
        if (!item || !item.href) return;

        // load image
        var img = new Image();
        if (item.dataset) {
          img.srcset = item.dataset.srcset || "";
          img.sizes = item.dataset.sizes || "";
        }
        img.src = item.href;
        img.className = "reveal";
        if (img.complete) {
          addImg();
        } else {
          img.onload = addImg;
        }

        // replace image
        function addImg() {
          // disable click
          item.addEventListener(
            "click",
            function (e) {
              e.preventDefault();
            },
            false
          );

          // add full image
          item.appendChild(img).addEventListener("animationend", function (e) {
            // remove preview image
            var previewImage =
              item.querySelector && item.querySelector("img.preview");
            if (previewImage) {
              e.target.alt = previewImage.alt || "";
              item.removeChild(previewImage);
              e.target.classList.remove("reveal");
            }
          });
        }
      }
    },
    false
  );
}
