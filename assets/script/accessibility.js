// FOCUSABLE ELEMENTS
function getFocusableElements(window) {
    return Array.from(
        window.querySelectorAll(
            "button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])"
        )
    ).filter(function(element) {
        return !element.disabled &&
               !element.hidden &&
               element.offsetParent !== null;
    });
}