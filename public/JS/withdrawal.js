
function showRelevantPlaceholder() {

}

document.addEventListener('DOMContentLoaded', function () {
    const withdrawalStatus = document.querySelector('.withdrawal-status').textContent.trim()

    console.log(withdrawalStatus);


    if (withdrawalStatus === 'success') {
        swal({
            icon: "success",
            title: "Success",
            text: "Your investment Was Successful",
            button: "Go To dashboard"
        })
    } else if (withdrawalStatus === 'fail') {
        swal({
            icon: "error",
            title: "Failed",
            text: "Investment Failed, Please try again",
            buttons: ["Retry", "Go To Dashboard"]
        })
    }
})