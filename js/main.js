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

        // Exit early if form elements don't exist on this page
        if (!$phone || !$phone.length || !$form || !$form.length) return;

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

        // Form submission handler
        $form.on('submit', function (e) {
            // Validate phone format
            var phoneVal = $phone.val() || '';
            if (!isValidE164(phoneVal)) {
                e.preventDefault();
                $phone.addClass('is-invalid').removeClass('is-valid');
                $phone[0].focus();
                alert('Please enter a valid phone number in E.164 format (e.g., +254712345678)');
                return false;
            }
            
            // Log form data for debugging
            console.log('Form submitted with data:', {
                name: $('#full_name').val(),
                phone: phoneVal,
                email: $('#email').val(),
                service: $('#service').val(),
                date: $('#preferred_date_input').val(),
                time: $('#preferred_time_input').val(),
                notes: $('#notes').val()
            });
            
            console.log('Submitting to Google Form...');
        });
    });
    
    
})(jQuery);

