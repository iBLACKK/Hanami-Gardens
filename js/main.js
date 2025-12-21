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
    $('.date').datetimepicker({
        format: 'L',
        // prevent selection of past dates
        minDate: moment().startOf('day')
    });
    $('.time').datetimepicker({
        format: 'LT'
    });

    // Update the timepicker minimum when the date changes: if date is today, min time is now
    function updateTimeMinSetting() {
        var dateVal = $('#preferred_date_input').val();
        var $timePicker = $('#preferred_time');
        if ($timePicker.length === 0) return;

        if (!dateVal) {
            // remove any minDate restriction
            try { $timePicker.datetimepicker('minDate', false); } catch(e) {}
            return;
        }
        var d = moment(dateVal, 'L', true);
        if (!d.isValid()) {
            try { $timePicker.datetimepicker('minDate', false); } catch(e) {}
            return;
        }
        if (d.isSame(moment(), 'day')) {
            // set minDate/time to now
            try { $timePicker.datetimepicker('minDate', moment()); } catch(e) {}
        } else {
            // remove min
            try { $timePicker.datetimepicker('minDate', false); } catch(e) {}
        }
    }
    // run on load in case a date is prefilled
    updateTimeMinSetting();
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Price carousel
    $(".price-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:3
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
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
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

    // Phone input: prefilled country code validation (E.164-ish)
    $(document).ready(function () {
        var $phone = $('#phone');
        var $form = $('#appointmentForm');

        if ($phone.length === 0 || $form.length === 0) return; // nothing to do on pages without the appointment form

        function isValidE164(val) {
            if (!val) return false;
            var cleaned = val.replace(/[\s\-()]/g, '');
            if (!cleaned.startsWith('+')) return false;
            var digits = cleaned.substring(1);
            // Require a country code (no leading 0), and between 7 and 15 total digits (E.164-ish)
            return /^[1-9]\d{6,14}$/.test(digits);
        }

        $phone.on('input', function () {
            var val = $(this).val();
            if (isValidE164(val)) {
                $(this).removeClass('is-invalid').addClass('is-valid');
            } else {
                $(this).removeClass('is-valid').addClass('is-invalid');
            }
        });

        // Prevent typing of invalid characters (letters, multiple +, etc.)
        $phone.on('keydown', function (e) {
            var allowedKeys = ['Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','Tab'];
            if (allowedKeys.indexOf(e.key) !== -1) return; // allow navigation and editing keys
            if (e.ctrlKey || e.metaKey) return; // allow copy/paste/select-all shortcuts

            var key = e.key;
            // Allow single-character keys only if they are digits, space, dash, parentheses, or plus
            if (key.length === 1) {
                var isDigit = /[0-9]/.test(key);
                var isSep = /[ \-()]/.test(key);
                var isPlus = key === '+';
                if (!(isDigit || isSep || isPlus)) {
                    e.preventDefault();
                    return;
                }
                if (isPlus) {
                    // only allow plus at the start and only once
                    var val = this.value;
                    var selStart = this.selectionStart;
                    if (val.indexOf('+') !== -1 || selStart !== 0) {
                        e.preventDefault();
                        return;
                    }
                }
            }
        });

        // Sanitize pasted content: allow digits, leading +, spaces, dashes, parentheses
        $phone.on('paste', function (e) {
            e.preventDefault();
            var clipboard = (e.originalEvent || e).clipboardData.getData('text') || '';
            // keep digits and allowed punctuation
            var sanitized = clipboard.replace(/[^\d\+\-\s\(\)]/g, '');
            // remove any plus signs that are not leading
            sanitized = sanitized.replace(/\++/g, '+');
            if (sanitized.indexOf('+') > 0) {
                // move the plus to the front if it exists but not at position 0
                sanitized = '+' + sanitized.replace(/\+/g, '');
            }
            // ensure only a single leading plus
            if (sanitized.indexOf('+') === 0) {
                sanitized = '+' + sanitized.substring(1).replace(/\+/g, '');
            } else {
                sanitized = sanitized.replace(/\+/g, '');
            }

            var input = this;
            var start = input.selectionStart;
            var end = input.selectionEnd;
            var newVal = input.value.slice(0, start) + sanitized + input.value.slice(end);
            if (input.maxLength > 0) newVal = newVal.slice(0, input.maxLength);
            input.value = newVal;
            // trigger input event so validation runs
            $(input).trigger('input');
        });

        // Also sanitize drop events
        $phone.on('drop', function (e) {
            e.preventDefault();
            var data = (e.originalEvent || e).dataTransfer.getData('text') || '';
            var sanitized = data.replace(/[^\d\+\-\s\(\)]/g, '');
            sanitized = sanitized.replace(/\++/g, '+');
            if (sanitized.indexOf('+') > 0) sanitized = '+' + sanitized.replace(/\+/g, '');
            if (sanitized.indexOf('+') === 0) sanitized = '+' + sanitized.substring(1).replace(/\+/g, '');
            else sanitized = sanitized.replace(/\+/g, '');
            var input = this;
            var start = input.selectionStart;
            var end = input.selectionEnd;
            var newVal = input.value.slice(0, start) + sanitized + input.value.slice(end);
            if (input.maxLength > 0) newVal = newVal.slice(0, input.maxLength);
            input.value = newVal;
            $(input).trigger('input');
        });

        $form.on('submit', function (e) {
            if (!isValidE164($phone.val())) {
                e.preventDefault();
                $phone.addClass('is-invalid').removeClass('is-valid');
                $phone[0].focus();
                return false;
            }
            // Validate preferred date/time is now or future
            var dateVal = $('#preferred_date_input').val();
            var timeVal = $('#preferred_time_input').val();
            var $date = $('#preferred_date_input');
            var $time = $('#preferred_time_input');
            function isDateTimeValid() {
                if (!dateVal || !timeVal) return false;
                var dt = moment(dateVal + ' ' + timeVal, 'L LT', true);
                if (!dt.isValid()) return false;
                return dt.isSameOrAfter(moment());
            }

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
            var dt = moment(dateVal + ' ' + timeVal, 'L LT', true);
            if (!dt.isValid() || !dt.isSameOrAfter(moment())) {
                $date.addClass('is-invalid').removeClass('is-valid');
                $time.addClass('is-invalid').removeClass('is-valid');
                $fb.show();
            } else {
                $date.addClass('is-valid').removeClass('is-invalid');
                $time.addClass('is-valid').removeClass('is-invalid');
                $fb.hide();
            }
        }

        // hook into tempusdominus change events
        $('.date').on('change.datetimepicker', function() {
            updateTimeMinSetting();
            validateDateTimeInputs();
        });
        $('.time').on('change.datetimepicker', validateDateTimeInputs);
        // also validate on manual input
        $('#preferred_date_input, #preferred_time_input').on('input', validateDateTimeInputs);
    });
    
})(jQuery);

