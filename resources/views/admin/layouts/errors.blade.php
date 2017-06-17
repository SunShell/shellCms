@if(count($errors))
    <script type="text/javascript">
        var errorMsg =  '<ul>'+
                            @foreach($errors->all() as $error)
                                '<li>{{ $error }}</li>'+
                            @endforeach
                        '</ul>';

        toastr['error'](errorMsg , '' , {
            timeOut : "false",
            closeButton : true,
            positionClass: "toast-top-center"
        });
    </script>
@endif