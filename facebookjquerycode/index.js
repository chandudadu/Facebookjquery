// main document ready function to check if dom is loaded fully or not

let myFacebookToken;

$(document).ready(() => {
$('#dataSection4').css('display','none');
$('#dataSection1').css('display','none'); 
$('#dataSection2').css('display','none');
$('#dataSection3').css('display','none');
    myFacebookToken = prompt("Please enter your Facebook Token:", "");
    if (myFacebookToken == null || myFacebookToken == "") {
        alert("No usr Token found");
    } else {
        showAllDetails();
    } // end if condition

}); // end document.ready function

let showAllDetails = () => {
console.log("showalldetails called");
$('#dataSection4').css('display','block');
$('#dataSection1').css('display','none'); 
$('#dataSection2').css('display','none');
$('#dataSection3').css('display','none');
     
             $('#dataSection4 #fbFeedBtn').on('click', function () {
               console.log("fbFeedbutton clicked");
               var display =  $("#dataSection3").css("display");
    if(display!="none")
           { $('#dataSection3').css('display','none');
             
                   
             }
             else{

    showFeedPage();//call to show fb feed page
 }
       

})
             $('#dataSection4 #fbProfileBtn').on('click', function () {
             console.log("fbprofilebutton clicked");
             var display =  $("#dataSection1").css("display");
    if(display!="none")
           { $('#dataSection1').css('display','none');
           
                   
             }
             else{
             console.log("fbBlockMainProfileprofilebutton clicked");
              getAllDetails();//call to show fb profile page
 }
             
})
}
let getAllDetails = () => {


    // API call to get user details

    $.ajax({
        type: 'GET',
        dataType: 'json',
        async: true,
        url: 'https://graph.facebook.com/me?fields=name,quotes,cover,picture.type(large)&access_token=' + myFacebookToken,

        success: (response) => {
 
              $('#dataSection3').css('display','none');

            $('#dataSection1').css('display','block');

            console.log(response);


            $('#userName').append(response.name);
        
            $('#profilePhoto').html('<img src="' + response.picture.data.url + '" class="img-fluid profileHeight"/>');

            $('#cover').css('background-image', 'url(' + response.cover.source + ')');



        }, error: (err) => {

            console.log(err.responseJSON.error.message);
            alert(err.responseJSON.error.message)

        }

    });// end ajax call 

}
//Function to show fb posts feed on click of Get Fb Posts Feed button on homepage


 

//var myFacebookToken = $("#api").val();//store the api token from homepage

let showFeedPage = () => {
//ajax request to get fb data
  
$.ajax({

 type: 'GET',
        dataType: 'json',
        async: true,
        url: 'https://graph.facebook.com/me?fields=posts{created_time,type,full_picture,story,message,source,likes.limit(1).summary(true),comments.limit(1).summary(true)},picture.width(250).height(250),cover,name&access_token=' + myFacebookToken,

success: function (response) {
  $('#dataSection1').css('display','none');

 $('#dataSection2').css('display','none'); 
                   
 $('#dataSection3').css('display','block');


$("#fbFeedInfo").html('<div></div>');//clear the data when user makes consecutive requests


var feeds = response.posts.data;//store the fb posts data array

console.log(feeds);

//map function to loop through the posts data

$.map(feeds, function (value, index) {

var post = feeds[index];

//switch case to call particular posts function based on fb posts type

switch (post.type) {


case 'photo':{

var likes=post.likes;
var likesCount = post.likes.summary.total_count;

var commentsCount = post.comments.summary.total_count;

createPhotoPost(post.story,likes, post.full_picture,likesCount,commentsCount);

}

break;

case 'video':{

var likesCount = post.likes.summary.total_count;
var likes=post.likes;

var commentsCount = post.comments.summary.total_count;

createVideoPost(post.story,likes, post.source,likesCount,commentsCount);

}

break;

}

});

 
//function to create photo post

function createPhotoPost(story,Likes,full_picture,likesCount,commentsCount) {

var sectionStart = '<section id="photo" class="post1">'+'<div class="story">'+story+'</div>';

var pictureURL = '<div class="picture" style ="background-image:url('+full_picture+')";>'+'</div>';


//var pictureURL = '<img src="url('+full_picture+')";>'+'</img>';


var sectionEnd = '</span>'+'</a>'+'</div>'+'</section>';

var postElement = sectionStart+pictureURL+sectionEnd;

$("#fbFeedInfo").append(postElement);

 

}


//function to create video post

function createVideoPost(story,Likes,source,likesCount,commentsCount) {

var sectionStart = '<section id="video" class="post1">';

var postStory = '<div class="story">'+story+'</div>';

var postVideo = '<div class="video">'+'<video controls>'+'<source src= '+source+' type= "video/mp4">'+'</video>'+'</div>';

var likeSection = '<div class="likeCommentContainer">'+'<a href="#" class="likeBox">'+Likes+'<span class="badge">' +likesCount+'';

var commentSection = '</span>'+'</a>'+'<a href="#" class="commentBox">'+Comment+'<span class="badge">'+ commentsCount+'</section>';

var postElement = sectionStart+postStory+postVideo;

$("#fbFeedInfo").append(postElement);

}

 

}, // end of success

//error handling

error: function (jqXHR) {

alert(jqXHR.responseJSON.error.message + "Please refresh the page and Enter valid API token");

},

});//end ajax call

}

