(function ($) {
    "use strict";

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Date and time picker
    // Date and time picker
    flatpickr("#preferred_date_input", {
        dateFormat: "d-m-Y",
        minDate: "today",
        allowInput: true
    });

    flatpickr("#preferred_time_input", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        allowInput: true
    });

    // Validates date and time
    function isDateTimeValid() {
        var dateVal = $('#preferred_date_input').val();
        var timeVal = $('#preferred_time_input').val();

        if (!dateVal || !timeVal) return false;

        // Parse DD-MM-YYYY
        var parts = dateVal.split('-');
        if (parts.length !== 3) return false;
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var year = parseInt(parts[2], 10);

        var inputDate = new Date(year, month, day);

        // Parse HH:mm
        var timeParts = timeVal.split(':');
        if (timeParts.length !== 2) return false;
        var hours = parseInt(timeParts[0], 10);
        var minutes = parseInt(timeParts[1], 10);

        inputDate.setHours(hours, minutes, 0, 0);

        var now = new Date();
        return inputDate >= now;
    }


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Price carousel
    $(".price-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });


    // Team carousel
    $(".team-carousel, .related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });

    // Phone input: strict validation for +254 followed by exactly 9 digits
    $(document).ready(function () {
        var $phone = $('#phone');
        var $form = $('#appointmentForm');
        var prefix = "+254";

        if ($phone.length === 0 || $form.length === 0) return;

        // Helper to validate format: must start with +254 and have exactly 9 digits after
        function isValidPhone(val) {
            if (!val.startsWith(prefix)) return false;
            var suffix = val.substring(prefix.length);
            return /^\d{9}$/.test(suffix);
        }

        // Enforce prefix and allow only numbers
        $phone.on('input', function (e) {
            var val = $(this).val();

            // 1. Ensure prefix is always present at the start
            if (!val.startsWith(prefix)) {
                // If the user deleted the '+' or '254', the raw digits might still be there. 
                // Let's go with a robust input masking approach:
                // Strip everything that isn't a digit
                var digits = val.replace(/\D/g, '');

                // If the user deleted part of +254, we restore it.
                // We'll treat the remaining digits as the body.
                // But we must be careful not to duplicate if the user just highlighted 254.
                // Simplified: prefix + digits (stripping any new 254 if it seems like a duplicate? No, too complex).
                // Just: prefix + valid body digits.

                var rawDigits = val.replace(/\D/g, '');
                var suffix = "";

                // If rawDigits starts with 254, we assume that's the country code key-in
                if (rawDigits.startsWith("254")) {
                    suffix = rawDigits.substring(3);
                } else {
                    suffix = rawDigits;
                }

                // Truncate to 9 digits
                if (suffix.length > 9) suffix = suffix.substring(0, 9);

                $(this).val(prefix + suffix);
            } else {
                // Starts with +254, check the rest
                var suffix = val.substring(prefix.length);
                // remove non-digits from suffix
                var cleanSuffix = suffix.replace(/\D/g, '');
                // truncate to 9
                if (cleanSuffix.length > 9) cleanSuffix = cleanSuffix.substring(0, 9);

                if (suffix !== cleanSuffix) {
                    $(this).val(prefix + cleanSuffix);
                }
            }

            // Re-validate for visual feedback
            var currentVal = $(this).val();
            if (isValidPhone(currentVal)) {
                $(this).removeClass('is-invalid').addClass('is-valid');
            } else {
                $(this).removeClass('is-valid').addClass('is-invalid');
            }
        });

        // Prevent deleting the prefix via keydown
        $phone.on('keydown', function (e) {
            var el = this;
            // If strictly inside prefix
            if (el.selectionStart < prefix.length) {
                // allow arrows, home, end, tab
                if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'].indexOf(e.key) !== -1) return;

                // If they try to backspace the prefix
                if (e.key === 'Backspace' && el.selectionEnd === el.selectionStart) {
                    e.preventDefault();
                    return;
                }

                // If typing, move to end of prefix? 
                // Just allow input event to handle cleanup is safer for edge cases, 
                // but preventing modification of prefix via keydown is good.
                if (e.key.length === 1 || e.key === 'Delete') {
                    // prevent changing prefix
                    if (el.selectionStart < prefix.length && el.selectionEnd <= prefix.length) {
                        e.preventDefault();
                        // optionally move cursor to end of prefix
                        el.setSelectionRange(prefix.length, prefix.length);
                    }
                }
            }
        });

        // Handle paste/drop via the input event primarily, but can add specific handlers if needed.
        // The input event handler above is aggressive enough to handle pased content.

        $form.on('submit', function (e) {
            if (!isValidPhone($phone.val())) {
                e.preventDefault();
                $phone.addClass('is-invalid').removeClass('is-valid');
                $phone[0].focus();
                return false;
            }
            // Validate preferred date/time is now or future
            // Validate preferred date/time is now or future
            var $date = $('#preferred_date_input');
            var $time = $('#preferred_time_input');

            if (!isDateTimeValid()) {
                e.preventDefault();
                $('#datetimeFeedback').show();
                $date.addClass('is-invalid');
                $time.addClass('is-invalid');
                $date[0].focus();
                return false;
            }
        });

        // Validate when user changes date or time
        // Validate when user changes date or time
        function validateDateTimeInputs() {
            var dateVal = $('#preferred_date_input').val();
            var timeVal = $('#preferred_time_input').val();
            var $date = $('#preferred_date_input');
            var $time = $('#preferred_time_input');
            var $fb = $('#datetimeFeedback');

            if (!dateVal || !timeVal) {
                $date.removeClass('is-valid').removeClass('is-invalid');
                $time.removeClass('is-valid').removeClass('is-invalid');
                $fb.hide();
                return;
            }

            if (!isDateTimeValid()) {
                $date.addClass('is-invalid').removeClass('is-valid');
                $time.addClass('is-invalid').removeClass('is-valid');
                $fb.show();
            } else {
                $date.addClass('is-valid').removeClass('is-invalid');
                $time.addClass('is-valid').removeClass('is-invalid');
                $fb.hide();
            }
        }

        // also validate on manual input
        $('#preferred_date_input, #preferred_time_input').on('input change', validateDateTimeInputs);
    });

})(jQuery);

