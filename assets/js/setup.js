$(document).ready(function() {
  $('#wizard-form').steps({
    headerTag: 'header',
    bodyTag: 'section',
    transitionEffect: 'slideLeft',
    autoFocus: true,
    titleTemplate: '#title#',
    labels: {
      previous: 'Anterior',
      next: 'Siguiente',
      finish: 'Guardar',
      skip: ''
    },
    onStepChanging: function(event, currentIndex, newIndex) {
      if (currentIndex > newIndex) {
        return true;
      }
      var form = $('#wizard-form');
      if (currentIndex < newIndex) {
        $(".body:eq(" + newIndex + ") label.error", form).remove();
        $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
      }
      if (form.parsley().validate() === true) {
        return true;
      }
      return true;
    },
    onFinished: function(event, currentIndex) {
      var form = $('#wizard-form');
      form.submit(function() {
        $.ajax({
          data: $('#wizard-form').serialize(),
          type: $('#wizard-form').attr('method'),
          url: $('#wizard-form').attr('action'), 
          success: function(data) {
            if(data.status == false) {
              swal({   title: "Error!",   text: data.msg,   type: "error",   confirmButtonText: "OK" });
            } else {
              window.location = "/home/login";
            }
          },
          error: function (data) {
            if(data.status == false) {
              swal({   title: "Error!",   text: data.msg,   type: "error",   confirmButtonText: "OK" });
            }
          }
        });
        return false; // avoid to execute the actual submit of the form.
      });
      form.submit();
    }
  });

  $('a[href="#next"]').first().addClass('next btn btn-primary');
  $('a[href="#previous"]').first().addClass('previous btn btn-primary');
  $('a[href="#finish"]').first().addClass('finish btn btn-success');
});