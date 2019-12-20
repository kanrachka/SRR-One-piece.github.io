$(function () {
  // Quick replies
  $(document).on('click', '[data-trigger=quickreply]', function (e) {
    var target = $(e.currentTarget).data('name');
    $('#post-content').val($('#post-content').val() + '@' + target);
  });

  // Search
  $(document).on('click', 'a[data-search]', function (e) {
    var where = $(e.currentTarget).data('search');
    $('#searchform input[name=q]').val(where + ' ' + $('#searchform input[name=q]').val());
    $('#searchform').submit();
  });

  // Anti-Adblock
  if (typeof window.adblock === "undefined" || window.adblock === true) {
    window.adblock = true;
    //$('#sidebar').prepend('<div class="widget"><h4>Adblock is currently on.</h4><p></p></div>')
  }

  // Voting
  $(document).on('click', '[data-toggle=like]', function (e) {
    var el    = $(e.currentTarget),
        id    = el.data('id'),
        state = el.data('state'),
        text  = el.hasClass('textual'),
        count = $('[data-bind=like-' + id + ']');

    e.preventDefault();

    if (zeonbbs.authd === false) {
      window.location.href = '/sessions/new';
      return;
    }

    $.ajax((state === 'off' ? '/likes/create' : '/likes/destroy/' + id), {
      type: 'POST',
      data: {
        post_id: id,
        ci_csrf_token: zeonbbs.crsf
      },
      success: function () {
        if (state === 'on') {
          el.data('state', 'off').html(text ? 'Like this again' : '\u25B2').addClass('secondary');
          count.text(count.text() * 1 - 1);
        } else {
          el.data('state', 'on').html(text ? 'Stop liking this' : '\u25BC').removeClass('secondary');
          count.text(count.text() * 1 + 1);
        }
      }
    });

    mixpanel.track('Voted on post');
  });

  // Previews
  $(document).on('click', '[data-trigger=preview]', function (e) {
    var content = $(e.currentTarget).parent().parent().find('[name=content]').val(),
        syntax  = $(e.currentTarget).parent().parent().find('[name=content_syntax]').val();

    $.ajax('/posts/format', {
      type: 'POST',
      data: {
        content: content,
        content_syntax: syntax,
        ci_csrf_token: zeonbbs.crsf
      },
      dataType: 'html',
      success: function (rendered) {
        $('#preview .modal-body').html(rendered);
        $('#preview').modal();
        Rainbow.color();
      }
    });
  });

  // Helpfulness
  $(document).on('click', '[data-toggle=helpful]', function (e) {
    var el    = $(e.currentTarget),
        id    = el.data('id'),
        state = el.data('state');

    e.preventDefault();

    $.ajax((state === 'off' ? '/likes/create' : '/likes/destroy/' + id), {
      type: 'POST',
      data: {
        post_id: id,
        ci_csrf_token: zeonbbs.crsf
      },
      success: function () {
        if (state === 'on') {
          el.data('state', 'off');
          el.text('Unmarked');
        } else {
          el.data('state', 'on');
          el.text('Marked as helpful, thanks!');
        }
      }
    });
  });

  // Flags
  $(document).on('click', '[data-trigger=flag]', function (e) {
    var el = $(e.currentTarget),
        id = el.data('id');

    $('#flag [data-bind=flag]').text(id);
    $('#flag [name=resource_id]').val(id);
    $('#flag').modal();
  });

  $(document).on('click', '[data-trigger=flag-submit]', function () {
    $('#flag form').submit();
  });

  // Tooltips
  $('.tooltip-pls').tooltip();

  // Limited characters
  $('[data-bind=limited-chars]').bind('textchange', function (e) {
    var el         = $(e.currentTarget),
        max_length = el.data('max-length'),
        counter    = $('#' + el.data('counter'));

    if (el.val().length > max_length) {
      el.val(el.val().substr(0, max_length));
      return;
    }

    counter.html(max_length - el.val().length);
  });

  $('#back-to-top a').on('click', function (e) {
    e.preventDefault();

    $('body, html').animate({
      scrollTop: 0
    }, 800);
  });

  // Confirmations
  $(document).on('click', '[data-trigger=confirm]', function (e) {
    if (! window.confirm('Are you sure, mate? Like seriously?')) {
      e.preventDefault();
    }
  });

  // Profile columns
  $(window).on('load', function () {
    $.each($('.equalize'), function (i, _el) {
      var el            = $(_el),
          parent_height = el.parent().innerHeight();

      el.css('height', parent_height);
    });
  });
});
