$('.openBtn').on('click',function(){
    $('.modal-body').load('modalBody',function(){
        $('#myModal').modal({show:true});
    });
});

// $('#myModal').on('show.bs.modal', function (e) {
//     var table = $(e.relatedTarget).data('table')
//     var href = '#myModal'
//     $('.openBtn', this).attr('href', href)
//     console.log(href)
//   })
