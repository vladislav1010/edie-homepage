document.addEventListener("DOMContentLoaded", () => {
  // Adjust main menu dropdown height

  const adjustMainMenuDropdownHeight = () => {
    const mainMenuDropdown = document.getElementById("main-menu-dropdown");

    mainMenuDropdown.style.setProperty(
      "--main-menu-offset-top",
      headerBottom()
    );

    function headerBottom() {
      const header = document.getElementById("header");

      const rect = header.getBoundingClientRect();
      return rect.top + rect.height + "px";
    }
  };

  window.addEventListener("resize", adjustMainMenuDropdownHeight);
  window.addEventListener("load", adjustMainMenuDropdownHeight);
  adjustMainMenuDropdownHeight();

  // Toggle .open class on click
  Array.from(document.querySelectorAll('[data-action="toggle"]')).forEach(
    (el) => {
      const hideTargetSelectorOrNull = tryGetHideTargetSelector();

      let hideTargetEl;
      if (hideTargetSelectorOrNull) {
        hideTargetEl = document.querySelector(hideTargetSelectorOrNull);

        if (hideTargetEl != null) {
          hideElement(hideTargetEl);
        }
      }

      el.addEventListener("click", () => {
        const leaveTransitionTimeMsOrNull = tryGetLeaveTransitionTime();
        const targetSelectorOrNull = tryGetTargetSelector();

        if (targetSelectorOrNull !== null) {
          const targetEl = document.querySelector(targetSelectorOrNull);

          if (targetEl != null) {
            toggleOpen(targetEl, hideTargetEl, leaveTransitionTimeMsOrNull);
          }
        }

        function toggleOpen(el, hideEl, leaveTransitionTimeMsOrNull) {
          // Without hiding element, when changing viewport width through mobile breakpoint,
          // header menu hides with animation.
          if (hideEl !== null) {
            if (!el.classList.contains("open")) {
              cancelPendingHideElement();
              open(hideEl, el);
            } else {
              el.classList.remove("open");
              hideElement(hideEl, leaveTransitionTimeMsOrNull);
            }
          }
        }

        function tryGetTargetSelector() {
          return el.dataset.target == null || el.dataset.target.trim() === ""
            ? null
            : el.dataset.target;
        }

        function tryGetLeaveTransitionTime() {
          let result =
            el.dataset.leaveTransitionTime == null ||
            el.dataset.leaveTransitionTime.trim() === ""
              ? null
              : el.dataset.leaveTransitionTime;

          if (result !== null) {
            result = Number(result);
            if (isNaN(result)) {
              result = null;
            }
          }

          return result;
        }
      });

      function tryGetHideTargetSelector() {
        return el.dataset.hideTarget == null ||
          el.dataset.hideTarget.trim() === ""
          ? null
          : el.dataset.hideTarget;
      }

      let timerId = null;

      function hideElement(el, leaveTransitionTimeMsOrNull) {
        if (leaveTransitionTimeMsOrNull) {
          timerId = setTimeout(() => {
            hideElementAtFrameStart();
          }, leaveTransitionTimeMsOrNull);
        } else {
          hideElementAtFrameStart();
        }

        function hideElementAtFrameStart() {
          requestAnimationFrame(() => {
            el.style.display = "none";
          });
        }
      }

      function cancelPendingHideElement() {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
      }

      function open(hideEl, targetEl) {
        requestAnimationFrame(() => {
          hideEl.style.display = "";
          requestAnimationFrame(() => {
            targetEl.classList.add("open");
          });
        });
      }
    }
  );

  // Subscribe button measuring width for input's padding
  const subscribeButton = document.getElementById("subscribe-button");
  const subscribeInput = document.getElementById("subscribe-email");

  function adjustSubscribeInputPadding() {
    const buttonWidth = subscribeButton.getBoundingClientRect().width + "px";

    subscribeInput.style.setProperty("--subscribe-button-width", buttonWidth);
  }

  adjustSubscribeInputPadding();
  window.addEventListener("load", adjustSubscribeInputPadding);
  window.addEventListener("resize", adjustSubscribeInputPadding);

  // Switch button color scheme on service card :hover
  let currentEl = null;
  const servicesEl = document.getElementsByClassName("services")[0];
  servicesEl.addEventListener("mouseover", (event) => {
    if (currentEl) {
      return;
    }

    let target = event.target.closest(".services__item");

    if (!target) {
      return;
    }

    if (!servicesEl.contains(target)) {
      return;
    }

    currentEl = target;
    onServiceEnter(currentEl);
  });

  servicesEl.addEventListener("mouseout", (event) => {
    if (!currentEl) {
      return;
    }

    let relatedTarget = event.relatedTarget;

    while (relatedTarget) {
      if (relatedTarget === currentEl) {
        return;
      }

      relatedTarget = relatedTarget.parentNode;
    }

    onServiceLeave(currentEl);
    currentEl = null;
  });

  function serviceButton(el) {
    return el.querySelector(".service__btn");
  }

  function onServiceEnter(el) {
    const button = serviceButton(el);

    if (!button) {
      return;
    }

    button.classList.remove("btn_dominant");
    button.classList.add("btn_primary");
  }

  function onServiceLeave(el) {
    const button = serviceButton(el);

    if (!button) {
      return;
    }

    button.classList.add("btn_dominant");
    button.classList.remove("btn_primary");
  }
});
