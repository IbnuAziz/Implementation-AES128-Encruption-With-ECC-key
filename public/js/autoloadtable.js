    var $table = $('#table')
		var $remove = $('#remove')
		var selections = []
		
		function getIdSelections() {
			return $.map($table.bootstrapTable('getSelections'), function (row) {
			return row.id
    		})
  		}
		function operateFormatter(value, row, index) {
			return [
			'<a class="like" href="javascript:void(0)" title="Like">',
			'<i class="fa fa-heart"></i>',
			'</a>  ',
			'<a class="remove" href="javascript:void(0)" title="Remove">',
			'<i class="fa fa-trash"></i>',
			'</a>'
			].join('')
 		}
		
		window.operateEvents = {
			'click .like': function (e, value, row, index) {
				alert('You click like action, row: ' + JSON.stringify(row))
			},
			'click .remove': function (e, value, row, index) {
				let confirmAction = confirm("Are you sure to execute this action?");
        		if (confirmAction) {
					    window.location = `/deletePesan/${row._id}`
        		} else {
         			console.log('Cancel Delete');
        		}
    	}
  	}
	
    $table.bootstrapTable({
		// show table header
  		showHeader: false,
		rowStyle: function(row, index) {
			return{
				classes: 'gl unread', 
			}	
		},
		rowAttributes: function (row, index) {
			return{
				'data-link': `bacaPesan/${row._id}`,
				'data-target':"_SELF"
			}	
		},
    columns: [
			{
			field: 'state',
			checkbox: true
			}, {
			field: 'operate',
			clickToSelect: false,
			events: window.operateEvents,
			formatter: operateFormatter
      },{
      field: 'results.last_name',
      title: 'Full Name',
			class: 'view-message nm'
      }, {
      field: 'subjek_message',
			clickToSelect: false,
      title: 'Subjek Message',
			class: 'view-message sub'
      }, {
      field: 'text_message',
      title: 'Message',
			class: 'kep w-auto'
      }, {
      field: 'createdAt',
      title: 'Created',
			class: 'text-right crData view-message'
      }
    ],
  });

      $table.on("click-row.bs.table", function (e, field, value, row, $element) {
			if(row == 'subjek_message'){
				window.location = `bacaPesan/${field._id}`
			}else{
				e.preventDefault()
			}
        });

		  $table.on('check.bs.table uncheck.bs.table ' +
      	'check-all.bs.table uncheck-all.bs.table',
			function () {
			$remove.prop('disabled', !$table.bootstrapTable('getSelections').length)

			// save your data, here just save the current page
			selections = getIdSelections()
			// push or splice the selections if you want to save all data selections
    		}
		)
  
		$remove.on('click', function () {
		  const rowid = $(this).closest('tr').data('index');
      $table.bootstrapTable('remove', {
        field: '$index',
        values: [rowid]
      });
      	$remove.prop('disabled', true)
    })