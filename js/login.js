$(document).ready(function(){
    var modal = $(".modal");
    $("#login_from_error").hide(); //hide login error div
    $(".modal-backdrop").on('click', (e) => {e.preventDefault();}); //do nothing when grey area of modal is clicked
    $("#login_form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
            }
        },

        messages: {
            email: 'Please enter a valid email address',
            password: 'Please provide a password'
        },
        submitHandler: (form, e) => {
            e.preventDefault();
            console.log("submit handler");
            modal.modal("show");
           $.ajax({
               type: 'POST',
               url: 'https://localhost:6005/auth/login',
               data: $("#login_form").serialize(),
               success: (result) => {
                   console.log("ajax success");
                   $(".modal-backdrop").remove();
                   modal.modal('hide');
                   if(!(result['success'])){
                       $("#login_from_error").show();
                       $("#login_from_error p").text(result['em']);
                   }
                   else{
                       console.log("res: ", result);
                       window.location = 'home.html';
                   }
                //    console.log("res: ", result);
               },
               error: (error) => {
                console.log("ajax error");
                   modal.modal("hide");
                   console.log("error: ", error);
               }
           });

           console.log("call end");
           return false;
        }
    });
});