/*

  ██████╗ ██████╗ ███████╗███████╗
 ██╔═══██╗██╔══██╗╚══███╔╝██╔════╝
 ██║   ██║██████╔╝  ███╔╝ █████╗
 ██║   ██║██╔══██╗ ███╔╝  ██╔══╝
 ╚██████╔╝██║  ██║███████╗███████╗
  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝

  Feeling listless? We can help!

 */

$().ready(function() {

    $addItem.hide();
    $newListName.addClass('active');
    printFullList ();


//Formstone Plugins

    $("nav").navigation ({
        gravity: "right",
        type: "overlay"
    });

//end Formstone Plugins

});

    var $newListName= $('#generate_new_list');
    var $addItem= $('#add_item');
    var $saveTitle= $('#save_list_title');
    var $itemInput= $("#add_item_input");
    var $saveItem= $('#add_item_button');

function printFullList () {

        if (localStorage.ORZE_db) {

            var listContents = JSON.parse(localStorage.ORZE_db);
            var listItems = listContents.items;

            //TODO: list title does not remain persistent after reloading page.

            $('#list_title').html('<h5>' + listContents.name + '</h5>');

            $newListName.hide();
            $addItem.slideDown(200);
            $('#add_item_input').focus();

// http://stackoverflow.com/questions/20772417/how-to-loop-through-json-array-in-jquery

            $.each(listItems, function (key, value) {

                if (value.quantity == "" && value.category == "") {

                    $('#list_content').append('<li class="ellipsis"><span class="item">' + value.item + '</span></li>');
                }

                else if (value.quantity !== "" && value.category !== "") {

                    $('#list_content').append('<li class="ellipsis"><span class="item">' + value.item + '</span>, &nbsp; <span class="quantity">' + value.quantity + '</span> &nbsp; <span class="category">' + value.category + '</span></li>');
                }

                else if (value.quantity == "") {

                    $('#list_content').append('<li class="ellipsis"><span class="item">' + value.item + '</span><span class="category">' + value.category + '</span></li>');

                }

                else if (value.category == "") {
                    $('#list_content').append('<li class="ellipsis"><span class="item">' + value.item + '</span>, &nbsp; <span class="quantity">' + value.quantity + '</span></li>');

                }

            });
        }
}


function updateListKey() {

    var $listKeyName = $newListName.val();
    var listKeydata = localStorage.getItem('listKey');

    if ( localStorage.listKey ) {

        console.log ('ListKey database DOES exist.');

        listKey = JSON.parse(listKeydata);
        listKey.push([ $listKeyName ]);

    }

    else {
        console.log ('ListKey database DOES NOT exist.');

        listKey = [];
        listKey.push([ $listKeyName ]);
    }

    localStorage.setItem('listKey', JSON.stringify(listKey));
}


function saveListData() {

    var $listName = $newListName.val();
    var item = $itemInput.val();
    var quantity = $('#add_quantity').val();
    var category = $('#add_category').val();

    if ( localStorage.ORZE_db ) {

        console.log ('List database exists.');
        var listContents = JSON.parse(localStorage.ORZE_db);
        console.log('listContents',listContents);

        var listItems = listContents.items;
        console.log('listItems before adding new one:',listItems);

        var listItemSize = Object.keys(listItems).length;

        console.log('listItemSize',listItemSize);

        listItems[listItemSize] = { 'item': item, 'quantity': quantity, 'category': category};
        console.log('listItems after adding new one:',listItems);

        var newList = {};
        newList.name = $listName;
        newList.items = {};
        newList.items = listItems;

        localStorage.ORZE_db = JSON.stringify(newList);

        var ORZE_json = JSON.parse(localStorage.ORZE_db);

        console.log( 'listItems after saving to localStorage:', ORZE_json.items );
    }

    else {

        console.log ('List database DOES NOT exist.');

        var listItems = { 'item': item, 'quantity': quantity, 'category': category };
        var listItemSize = 0;

        console.log('listItems',listItems);
        console.log('listItemSize',listItemSize);

        var newList = {};
        newList.name = $listName;
        newList.items = {};
        newList.items[listItemSize] = listItems;
        localStorage.ORZE_db = JSON.stringify(newList);

    }

    $("#list_content").empty();
    printFullList ();

}

// Title Creation

    $newListName.on('keydown', function(e) {

        if (e.which == 13) {

            $addItem.slideDown(1000);
            $newListName.removeClass('active');
            $newListName.addClass('blue-middle');
            $saveTitle.fadeOut(500);
            $addItem.slideDown(1000);
            $('#add_item_input').focus();

            updateListKey();
        }
    });

    $saveTitle.on('click', function () {

        $addItem.slideDown(1000);
        $newListName.removeClass('active');
        $newListName.addClass('blue-middle');
        $saveTitle.fadeOut(500);
        $('#add_item_input').focus();

        updateListKey();

    });

// end Title Creation


// Adding Items

    $itemInput.on('keydown', function(e) {
        if (e.which == 13) {

            var $item = $itemInput.val();

            if ($.trim($item).val === "" || $.trim($item).length === 0 ) {

                $itemInput.attr('placeholder', 'ITEM MUST BE NAMED');
            }

            else {

                $itemInput.attr('placeholder', 'New Item Name');

                saveListData();

                $('.add').val('');
                $('#add_item_input').focus();
            }
        }
    });


    $saveItem.on('click', function () {

        var $item = $itemInput.val();

        if ($.trim($item).val === "" || $.trim($item).length === 0 ) {

            $itemInput.attr('placeholder', 'ITEM MUST BE NAMED');

        }

        else {

            $itemInput.attr('placeholder', 'New Item Name');

            saveListData();

            $('.add').val('');
            $('#add_item_input').focus();
        }

    });

//end Adding Items

// AJAX and Nav Functionality

$('#return_to_lists').on('click', function(e) {
    e.preventDefault();

    $("#list_title").hide();
    $("#add_item").hide();


    $("#list_content").empty();

    if (localStorage.listKey)

        var listKeyArray = JSON.parse(localStorage.listKey);

    $.each( listKeyArray, function( i, val ) {

            $("#list_of_lists").html("<li class= 'list_names'><a>" + val + "</a></li>");
        });

//TODO: add button to trigger new list creation as well as style list_of_lists

});