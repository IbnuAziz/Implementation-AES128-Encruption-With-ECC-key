$('#swalpesan').on('submit', function(e) {
    e.preventDefault();
    
    Swal.fire({
        title: 'Success',
        text: "Message Send And Encrypted",
        icon: 'success',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Lihat Pesan'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location = '/pesanTerkirim'
        }
      })
})
