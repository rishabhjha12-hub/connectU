// function toggleFriend(){
//     console.log($('.toggle'))
//     $('.toggle').click(function(e) {
//         e.preventDefault();
//         let self = this;
//         $.ajax({
//             type: 'GET',
//             url: $('.toggle').attr('href'),
//             success:function(data){
//                 console.log(data);
//                 $('.toggle').html('Remove Friend')

//             },
//             error:function(err){
//                 console.log('error is',err.responseText);
//             }
        
//         })


        // .done(data => {
        //     console.log(data);
        //     // if(data.data.isFriend)
        //     //     $(self).html('Remove Friend');
        //     // else
        //     //     $(self).html('Add Friend');
        //     $('.toggle').html('Remove Friend')
        // })
        // .fail(function (errData) {
        //     console.log('error in completing the request: ', errData);
        // });
    // });
// }
// console.log("before function call")
// toggleFriend();
function toggleFriend(){
    $('p a.toggle-friend-btn').click(function(e) {
        e.preventDefault();
        let self = this;
        $.ajax({
            type: 'GET',
            url: $(self).attr('href')
        })
        .done(data => {
            console.log(data);
            if(data.data.isFriend)
                $(self).html('Remove Friend');
            else
                $(self).html('Add Friend');
        })
        .fail(function (errData) {
            console.log('error in completing the request: o', errData);
        });
    });
}

toggleFriend();